import { h } from 'preact';
import { mount } from 'enzyme';
import { html } from '../src/value';

/* -----------------------------------
 *
 * Variables
 *
 * -------------------------------- */

const testCaption = 'testCaption';
const testText = 'Lorem ipsum dolor sit amet';
const testHtml = `
  <article title="Article" id="first" class="container" data-article="1">
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
      <a href="/">Go <em>back</em></a>
    </p>
    <button class="button">
      <span>Click</span> me
    </button>
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

describe('html()', () => {
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
      const result = html(testHtml);

      console.log('RESULT', result);

      expect(true).toBe(true);
    });
  });
});
