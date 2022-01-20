/* -----------------------------------
 *
 * IElement
 *
 * -------------------------------- */

interface IElement {
  nodeName?: string;
  nodeType?: number;
  tagName?: string;
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
const attrRegex = /(?:^|\s)(id|class)\s*=\s*((?:'[^']*')|(?:"[^"]*")|\S+)/gi;
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
 * Closed By
 *
 * -------------------------------- */

const elementsClosedBy = {
  li: { ul: true, ol: true, UL: true, OL: true },
  LI: { ul: true, ol: true, UL: true, OL: true },
  a: { div: true, DIV: true },
  A: { div: true, DIV: true },
  b: { div: true, DIV: true },
  B: { div: true, DIV: true },
  i: { div: true, DIV: true },
  I: { div: true, DIV: true },
  p: { div: true, DIV: true },
  P: { div: true, DIV: true },
  td: { tr: true, table: true, TR: true, TABLE: true },
  TD: { tr: true, table: true, TR: true, TABLE: true },
  th: { tr: true, table: true, TR: true, TABLE: true },
  TH: { tr: true, table: true, TR: true, TABLE: true },
};

/* -----------------------------------
 *
 * createElement
 *
 * -------------------------------- */

function createElement(element?: IElement): IElement {
  let model = {
    nodeName: 'BODY',
    nodeType: 1,
    tagName: 'body',
    tagRange: [],
    attributes: {},
    childNodes: [],
  };

  if (element) {
    const { nodeName = element.tagName } = element;

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
  elementsClosedBy,
  frameflag,
  createElement,
  createText,
  createRange,
  isBlockText,
  isIgnored,
};
