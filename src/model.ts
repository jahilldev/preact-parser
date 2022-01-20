/* -----------------------------------
 *
 * IElement
 *
 * -------------------------------- */

interface IElement {
  nodeName?: string;
  nodeType?: number;
  tagName: string;
  tagRange: number[];
  attributes?: object;
  textContent?: string;
  childNodes?: IElement[];
}

/* -----------------------------------
 *
 * NodeType
 *
 * -------------------------------- */

enum NodeType {
  ELEMENT = 1,
  TEXT = 3,
}

/* -----------------------------------
 *
 * Variables
 *
 * -------------------------------- */

const htmlRegex = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][-.:0-9_a-zA-Z]*)((?:\s+[^>]*?(?:(?:'[^']*')|(?:"[^"]*"))?)*)\s*(\/?)>/g;
const attrRegex = /(\S+)\s*=\s*(\"?)([^"]*)(\2|\s|$)/gi;
const frameflag = 'documentfragmentcontainer';

/* -----------------------------------
 *
 * Self Closing
 *
 * -------------------------------- */

const selfClosingTags = [
  'area',
  'base',
  'br',
  'col',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'embed',
  'param',
  'track',
  'wbr',
];

/* -----------------------------------
 *
 * Block Text
 *
 * -------------------------------- */

const blockTextElements = ['script', 'noscript', 'style', 'pre'];

/* -----------------------------------
 *
 * Opened By
 *
 * -------------------------------- */

const closedByOpening = {
  li: { li: true },
  p: { p: true, div: true },
  b: { div: true },
  td: { td: true, th: true },
  th: { td: true, th: true },
  h1: { h1: true },
  h2: { h2: true },
  h3: { h3: true },
  h4: { h4: true },
  h5: { h5: true },
  h6: { h6: true },
};

/* -----------------------------------
 *
 * Closed By
 *
 * -------------------------------- */

const closedByClosing = {
  li: { ul: true, ol: true },
  a: { div: true },
  b: { div: true },
  i: { div: true },
  p: { div: true },
  td: { tr: true, table: true },
  th: { tr: true, table: true },
};

/* -----------------------------------
 *
 * createElement
 *
 * -------------------------------- */

function createElement(element: IElement): IElement {
  const { nodeName = element.tagName } = element;

  let model = {
    nodeName: 'BODY',
    nodeType: 1,
    tagName: 'body',
    tagRange: [],
    attributes: {},
    childNodes: [],
  };

  if (element) {
    model = {
      ...model,
      ...element,
      nodeName,
    };
  }

  return model;
}

/* -----------------------------------
 *
 * createText
 *
 * -------------------------------- */

function createText(value: string, tagRange: number[]) {
  return createElement({
    nodeType: NodeType.TEXT,
    textContent: value,
    nodeName: '#text',
    tagName: void 0,
    tagRange,
  });
}

/* -----------------------------------
 *
 * createRange
 *
 * -------------------------------- */

function createRange(start: number, end: number) {
  return [start - frameflag.length + 2, end - frameflag.length + 2];
}

/* -----------------------------------
 *
 * isBlockText
 *
 * -------------------------------- */

function isBlockText(tagName: string) {
  return blockTextElements.map((it) => new RegExp(`^${it}$`, 'i')).some((it) => it.test(tagName));
}

/* -----------------------------------
 *
 * isIgnored
 *
 * -------------------------------- */

function isIgnored(tagName: string) {
  return blockTextElements.map((it) => new RegExp(`^${it}$`, 'i')).some((it) => it.test(tagName));
}

/* -----------------------------------
 *
 * Export
 *
 * -------------------------------- */

export {
  IElement,
  NodeType,
  htmlRegex,
  attrRegex,
  selfClosingTags,
  blockTextElements,
  closedByOpening,
  closedByClosing,
  frameflag,
  createElement,
  createText,
  createRange,
  isBlockText,
  isIgnored,
};
