import { h, Fragment } from 'preact';
import { IElement } from './model';
import { parseHtml } from './parse';

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

function convertToVDom(node: Element | IElement): preact.VNode<any> {
  if (node.nodeType === 3) {
    return node.textContent?.trim() || ('' as any);
  }

  if (node.nodeType !== 1) {
    return null;
  }

  const nodeName = String(node.nodeName).toLowerCase();
  const childNodes = Array.from(node.childNodes as any);

  const children = () => childNodes.map((child) => convertToVDom.call(this, child));
  const props = getAttributeObject(node.attributes as any);

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

export { html };
