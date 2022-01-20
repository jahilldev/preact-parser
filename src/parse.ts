import {
  htmlRegex,
  attrRegex,
  selfClosingTags,
  elementsClosedBy,
  frameflag,
  createElement,
  createText,
  createRange,
  isBlockText,
  isIgnored,
} from './model';

/* -----------------------------------
 *
 * parseHtml
 *
 * -------------------------------- */

function parseHtml(value: string) {
  let currentParent = createElement();
  const nodeStack = [currentParent];
  let lastTextPos = -1;
  let match: RegExpExecArray;
  let noNestedTagIndex: undefined | number = undefined;
  const html = `<${frameflag}>${value}</${frameflag}>`;

  const dataEndPos = html.length - (frameflag.length + 2);

  while ((match = htmlRegex.exec(html))) {
    let [matchText, leadingSlash, tagName, attributes, closingSlash] = match;

    tagName = tagName.toLowerCase();

    const matchLength = matchText.length;
    const tagStart = htmlRegex.lastIndex - matchLength;
    const tagEnd = htmlRegex.lastIndex;
    const isSelfClosing = selfClosingTags.includes(tagName);

    if (lastTextPos > -1) {
      if (lastTextPos + matchLength < tagEnd) {
        const textValue = html.substring(lastTextPos, tagStart).replace(/^\s+|\s+$/g, '');

        if (textValue) {
          currentParent.childNodes.push(createText(textValue, createRange(tagStart, tagEnd)));
        }
      }
    }

    lastTextPos = htmlRegex.lastIndex;

    // handle opening tag
    if (!leadingSlash) {
      const tagAttributes = parseAttributes(attributes);
      const parentTagName = currentParent.tagName;

      if (!closingSlash && isSelfClosing) {
        nodeStack.pop();
        currentParent = nodeStack[nodeStack.length - 1];
      }

      // Prevent nested A tags by terminating the last A and starting a new one : see issue #144
      if (tagName === 'a') {
        if (noNestedTagIndex !== undefined) {
          nodeStack.splice(noNestedTagIndex);
          currentParent = nodeStack[nodeStack.length - 1];
        }

        noNestedTagIndex = nodeStack.length;
      }

      const tagEndPos = htmlRegex.lastIndex;
      const tagStartPos = tagEndPos - matchLength;

      const openElement = createElement({
        tagName,
        nodeType: 1,
        attributes: tagAttributes,
        tagRange: createRange(tagStartPos, tagEndPos),
      });

      currentParent.childNodes.push(openElement);
      currentParent = openElement;

      nodeStack.push(currentParent);

      if (isBlockText(tagName)) {
        // Find closing tag
        const closeMarkup = `</${tagName}>`;
        const closeIndex = tagName
          ? html.toLocaleLowerCase().indexOf(closeMarkup, htmlRegex.lastIndex)
          : html.indexOf(closeMarkup, htmlRegex.lastIndex);
        const textEndPos = closeIndex === -1 ? dataEndPos : closeIndex;

        if (isIgnored(tagName)) {
          const text = html.substring(tagEndPos, textEndPos);

          if (text.length > 0 && /\S/.test(text)) {
            currentParent.childNodes.push(createText(text, createRange(tagStart, tagEnd)));
          }
        }

        if (closeIndex === -1) {
          lastTextPos = htmlRegex.lastIndex = html.length + 1;
        } else {
          lastTextPos = htmlRegex.lastIndex = closeIndex + closeMarkup.length;
          // Cause to be treated as self-closing, because no close found
          leadingSlash = '/';
        }
      }
    }

    // handle closing tag
    if (leadingSlash || closingSlash || isSelfClosing) {
      while (true) {
        if (tagName === 'a') {
          noNestedTagIndex = undefined;
        }

        if (currentParent.tagName === tagName) {
          // Update range end for closed tag
          (<[number, number]>currentParent.tagRange)[1] = createRange(
            -1,
            Math.max(lastTextPos, tagEnd)
          )[1];

          nodeStack.pop();
          currentParent = nodeStack[nodeStack.length - 1];

          break;
        } else {
          const parentTagName = currentParent.tagName;

          // Trying to close current tag, and move on
          if (elementsClosedBy[parentTagName]) {
            if (elementsClosedBy[parentTagName][tagName]) {
              nodeStack.pop();
              currentParent = nodeStack[nodeStack.length - 1];

              continue;
            }
          }

          // Use aggressive strategy to handle unmatching markups.
          break;
        }
      }
    }
  }

  console.log('TREE', JSON.stringify(nodeStack));

  return nodeStack;
}

/* -----------------------------------
 *
 * parseAttributes
 *
 * -------------------------------- */

function parseAttributes(attributes: string) {
  const result = {};

  for (let match; (match = attrRegex.exec(attributes)); ) {
    const [key, value] = match;
    const isQuoted = value[0] === `'` || value[0] === `"`;

    result[key.toLowerCase()] = isQuoted ? value.slice(1, value.length - 1) : value;
  }

  return result;
}

/* -----------------------------------
 *
 * Export
 *
 * -------------------------------- */

export { parseHtml };
