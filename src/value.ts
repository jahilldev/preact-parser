import { h, Fragment } from 'preact';
import { parseHtml } from './parse';

/* -----------------------------------
 *
 * Value
 *
 * -------------------------------- */

function jsxValue(html: string) {
  const preRender = typeof window === 'undefined';
  const value = `<!DOCTYPE html>\n<html><body>${html}</body></html>`;

  if (preRender) {
    return parseHtml(html);
  }

  let nodes: Document;

  try {
    nodes = new DOMParser().parseFromString(value, 'text/html');
  } catch {
    // no-op
  }

  if (!nodes) {
    return void 0;
  }

  const result = convertToVDom(nodes.body);

  return result;
}

/* -----------------------------------
 *
 * convertToVDom
 *
 * -------------------------------- */

function convertToVDom(node: Element) {
  if (node.nodeType === 3) {
    return node.textContent?.trim() || '';
  }

  if (node.nodeType !== 1) {
    return null;
  }

  const nodeName = String(node.nodeName).toLowerCase();
  const childNodes = Array.from(node.childNodes);

  const children = () => childNodes.map((child) => convertToVDom.call(this, child));
  const props = getAttributeObject(node.attributes);

  if (nodeName === 'script') {
    return null;
  }

  if (nodeName === 'body') {
    return h(Fragment, {}, children());
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

export { jsxValue };
