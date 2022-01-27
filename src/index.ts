import { h, Fragment } from 'preact';
import { IElement } from './model';
import { parseHtml, parseString } from './parse';

/* -----------------------------------
 *
 * Component
 *
 * -------------------------------- */

function Parser({ children = [] }) {
  return h(Fragment, {}, children);
}

/* -----------------------------------
 *
 * Html
 *
 * -------------------------------- */

function html(htmlValue: string) {
  const preRender = typeof window === 'undefined';
  const docValue = `<!DOCTYPE html>\n<html><body>${htmlValue}</body></html>`;

  if (preRender) {
    const [parsed] = parseHtml(htmlValue);

    return convertToVDom(parsed);
  }

  let nodes: Document;

  try {
    nodes = new DOMParser().parseFromString(docValue, 'text/html');
  } catch {
    // no-op
  }

  if (!nodes) {
    return void 0;
  }

  return convertToVDom(nodes.body);
}

/* -----------------------------------
 *
 * convertToVDom
 *
 * -------------------------------- */

function convertToVDom(node: IElement | Element): preact.VNode<any> | string {
  if (node.nodeType === 3) {
    return parseString(node.textContent);
  }

  if (node.nodeType !== 1) {
    return null;
  }

  const nodeName = String(node.nodeName).toLowerCase();
  const childNodes = Array.from(node.childNodes as NodeListOf<ChildNode>);

  const children = () => childNodes.map((child) => convertToVDom.call(this, child));
  const props = getAttributeObject(node.attributes as NamedNodeMap);

  if (nodeName === 'script') {
    return null;
  }

  if (nodeName === 'body') {
    return h(Parser, {}, children());
  }

  return h(nodeName, props, children());
}

/* -----------------------------------
 *
 * getAttributeObject
 *
 * -------------------------------- */

function getAttributeObject(attributes: NamedNodeMap): object {
  const result = {};

  if (!attributes?.length) {
    return result;
  }

  for (let i = attributes.length - 1; i >= 0; i--) {
    const item = attributes[i];

    result[item.name] = item.value;
  }

  return result;
}

/* -----------------------------------
 *
 * Export
 *
 * -------------------------------- */

export { html };
