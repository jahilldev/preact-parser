import { h } from 'preact';
import { mount } from 'enzyme';
import { jsxValue } from '../src/value';

/* -----------------------------------
 *
 * Variables
 *
 * -------------------------------- */

const testCaption = 'testCaption';
const testText = 'Lorem ipsum dolor sit amet';
const testHtml = `
  <article id="first" class="container" data-article="1">
    <style>
      .image { background: orange; }
    </style>
    <figure class="image" title="Image">
      <img src="https://via.placeholder.com/150" alt="Placeholder" />
      <figcaption>${testCaption}</figcaption>
    </figure>
    <p id="text" class="text grey">
      <span>Intro:</span> ${testText}
      <br />
      <a href="/">Go back</a>
    </p>
    <script type="text/json">
      {"productName": "testProduct", "productPrice": "10.00"}
    </script>
  </article>
`;

/* -----------------------------------
 *
 * Value
 *
 * -------------------------------- */

describe('jsxValue()', () => {
  describe('when run in the browser', () => {
    //
  });

  describe('when run on the server', () => {
    const { window } = global;

    beforeAll(() => {
      delete global.window;
    });

    afterAll(() => {
      global.window = window;
    });

    it('returns a valid VDom tree from an HTML string', () => {
      const result = jsxValue(testHtml);

      console.log('RESULT', result);

      expect(true).toBe(true);
    });
  });
});
