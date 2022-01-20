import {
  htmlRegex,
  attrRegex,
  selfClosingTags,
  closedByOpening,
  closedByClosing,
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

function parseHtml(html: string) {
  let currentParent = createElement({ tagName: 'body', tagRange: [0, html.length] });
  const nodeStack = [currentParent];
  let lastTextPos = -1;
  let match: RegExpExecArray;
  let noNestedTagIndex: undefined | number = undefined;
  const dataEndPos = html.length;

  while ((match = htmlRegex.exec(html))) {
    const { 0: matchText, 3: attributes, 4: closingSlash } = match;
    let { 1: leadingSlash, 2: tagName } = match;

    tagName = tagName.toLowerCase();

    const matchLength = matchText.length;
    const tagStart = htmlRegex.lastIndex - matchLength;
    const tagEnd = htmlRegex.lastIndex;
    const isSelfClosing = selfClosingTags.includes(tagName);

    if (lastTextPos > -1 && lastTextPos + matchLength < tagEnd) {
      const textValue = html.substring(lastTextPos, tagStart).replace(/^\s+|\s+$/g, '');

      if (textValue) {
        currentParent.childNodes.push(createText(textValue, createRange(tagStart, tagEnd)));
      }
    }

    lastTextPos = htmlRegex.lastIndex;

    if (!leadingSlash) {
      const tagAttributes = parseAttributes(attributes);
      const parentTagName = currentParent.tagName;

      if (!closingSlash && closedByOpening[parentTagName]) {
        if (closedByOpening[parentTagName][tagName]) {
          nodeStack.pop();
          currentParent = nodeStack[nodeStack.length - 1];
        }
      }

      if (tagName === 'a') {
        if (noNestedTagIndex !== undefined) {
          nodeStack.splice(noNestedTagIndex);
          currentParent = nodeStack[nodeStack.length - 1];
        }

        noNestedTagIndex = nodeStack.length;
      }

      const tagEnd = htmlRegex.lastIndex;
      const tagStart = tagEnd - matchLength;

      const openElement = createElement({
        tagName,
        nodeType: 1,
        attributes: tagAttributes,
        tagRange: createRange(tagStart, tagEnd),
      });

      currentParent.childNodes.push(openElement);
      currentParent = openElement;

      nodeStack.push(currentParent);

      if (isBlockText(tagName)) {
        const closeMarkup = `</${tagName}>`;
        const closeIndex = tagName
          ? html.toLocaleLowerCase().indexOf(closeMarkup, htmlRegex.lastIndex)
          : html.indexOf(closeMarkup, htmlRegex.lastIndex);
        const textEnd = closeIndex === -1 ? dataEndPos : closeIndex;

        if (isIgnored(tagName)) {
          const text = html.substring(tagEnd, textEnd).replace(/^\s+|\s+$/g, '');

          if (text.length > 0 && /\S/.test(text)) {
            currentParent.childNodes.push(createText(text, createRange(tagStart, tagEnd)));
          }
        }

        if (closeIndex === -1) {
          lastTextPos = htmlRegex.lastIndex = html.length + 1;
        } else {
          lastTextPos = htmlRegex.lastIndex = closeIndex + closeMarkup.length;
          leadingSlash = '/';
        }
      }
    }

    if (leadingSlash || closingSlash || isSelfClosing) {
      while (true) {
        if (tagName === 'a') {
          noNestedTagIndex = undefined;
        }

        if (currentParent.tagName === tagName) {
          currentParent.tagRange[1] = createRange(-1, Math.max(lastTextPos, tagEnd))[1];

          nodeStack.pop();
          currentParent = nodeStack[nodeStack.length - 1];

          break;
        }

        const parentTagName = currentParent.tagName;

        if (closedByClosing[parentTagName]) {
          if (closedByClosing[parentTagName][tagName]) {
            nodeStack.pop();
            currentParent = nodeStack[nodeStack.length - 1];

            continue;
          }
        }

        break;
      }
    }
  }

  return nodeStack;
}

/* -----------------------------------
 *
 * parseAttributes
 *
 * -------------------------------- */

function parseAttributes(attributes: string) {
  const result = [];

  for (let match; (match = attrRegex.exec(attributes)); ) {
    const { 1: key, 3: value } = match;
    const isQuoted = value[0] === `'` || value[0] === `"`;

    const attribute = {
      name: key.toLowerCase(),
      value: isQuoted ? value.slice(1, value.length - 1) : value,
    };

    result.push(attribute);
  }

  return result;
}

/* -----------------------------------
 *
 * Export
 *
 * -------------------------------- */

export { parseHtml };
