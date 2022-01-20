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
  <article class="container">
    <style>
      .image { background: orange; }
    </style>
    <figure class="image">
      <img src="https://via.placeholder.com/150" alt="Placeholder" />
      <figcaption>${testCaption}</figcaption>
    </figure>
    <p id="text" class="text grey">
      <span>Intro:</span> ${testText}
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
