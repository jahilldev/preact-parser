# preact-parser

When dealing with HTML strings in Preact, our only real option is to use `dangerouslySetInnerHTML`. This is fine(-ish) if you 100% trust the contents of that HTML, but regardless, it opens up potential vectors for attack, problems and bugs. Ideally, we'd be able to sanitise, and convert this HTML into VDom nodes that can be natively rendered in the same manner as defined JSX or `h()` calls.

This lightweight package (**2KB** GZipped) accepts an HTML string (doesn't have to contain HTML, can be text), parses it, and returns a tree of VDom nodes ready to render by Preact. It can work both on the client (Dom Parser) and the server, so is ideal for isomorphic applications.

It automatically strips `<script />` tags, so you no longer have to worry about someone "accidentally" adding an `alert('Hello')` in your CMS / API of choice.

# Getting Started

Install with Yarn:

```bash
$ yarn add preact-parser
```

Install with NPM:

```bash
$ npm i preact-parser
```

# Using html()

`preact-parser` exports a single function, `html()`, that accepts a string of HTML or text, and can be used directly within your component trees. As mentioned above, in the browser it makes use of the native DOM parser, and on the server uses a tiny, efficient string parser.

For example:

```jsx
import { html } from 'preact-parser';

/*[...]*/

const htmlApiResponse = `
   <p>Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
   <p>There are many variations of passages of Lorem Ipsum available</p>
   <script>
      alert('Gotcha!');
   </script>
`;

/*[...]*/

function BlogContent() {
  return <article class="content">{html(htmlApiResponse)}</article>;
}
```

When rendered, the above will output:

```html
<p>Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
<p>There are many variations of passages of Lorem Ipsum available</p>
```

# Acknowledgement

The server side HTML string parser in this package takes inspiration from the fantastically fast `node-html-parser`. That package provides a full DOM representation, including methods, which was overkill for this. In order to keep the size of `preact-parser` to a minimum, we've made use of the excellent parsing function found there.
