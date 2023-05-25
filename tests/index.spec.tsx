import { h } from 'preact';
import { mount } from 'enzyme';
import { parse } from '../src/index';

/* -----------------------------------
 *
 * Variables
 *
 * -------------------------------- */

const testCaption = 'testCaption';
const testTitle = 'testTitle';
const testWord = 'testWord';
const testText = 'Lorem ipsum dolor sit amet';
const testImage = 'https://via.placeholder.com/150';

const testSentence = `<p><strong>${testWord}</strong> <em>${testWord}</em> &nbsp; ${testWord}?</p>`;

const testHtml = `
  <!-- some comment -->
  <article title="Article" id="first" class="container" data-article="1">
    <style data-theme>
      .image { background: orange; }
    </style>
    <h2>${testTitle}</h2>
    <figure class="image" title="Image">
      <img src="${testImage}" alt="Placeholder" />
      <figcaption>${testCaption}</figcaption>
    </figure>
    <!-- some comment -->
    <p id="text" class="text grey">
      <span>Intro:</span> ${testText}
      <br />
      <a href="/" target="_blank" rel="noopener">
        Go <em class="accent">back</em>
      </a>
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
 * Component
 *
 * -------------------------------- */

function Content() {
  return <main>{parse(testHtml)}</main>;
}

/* -----------------------------------
 *
 * Value
 *
 * -------------------------------- */

describe('parse()', () => {
  describe('when run in the browser', () => {
    it('returns a valid VDom tree from an HTML string', () => {
      const result = parse(testHtml) as JSX.Element;
      const instance = mount(result);

      expect(instance.find('article').exists()).toEqual(true);
      expect(instance.find('h2').text()).toEqual(testTitle);
      expect(instance.find('img').prop('src')).toEqual(testImage);
    });

    it('can be used within JSX and Preact components', () => {
      const instance = mount(<Content />);

      expect(instance.find('article').exists()).toEqual(true);
      expect(instance.find('h2').text()).toEqual(testTitle);
    });

    it('elegantly handles non-closed tags', () => {
      const result = parse(`<main><div><p><p>${testText}`) as JSX.Element;
      const instance = mount(result);

      expect(instance.find('div').length).toEqual(1);
      expect(instance.find('p').length).toEqual(2);
    });

    it('can accept a non-html string value', () => {
      const result = parse(testText) as JSX.Element;
      const instance = mount(result);

      expect(instance.text()).toEqual(testText);
    });

    it('preserves word spacing if present', () => {
      const result = parse(testSentence) as JSX.Element;
      const instance = mount(result);

      expect(instance.text()).toEqual(`${testWord} ${testWord} ${testWord}?`);
    });
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
      const result = parse(testHtml) as JSX.Element;
      const instance = mount(result as any);

      expect(instance.find('article').exists()).toEqual(true);
      expect(instance.find('h2').text()).toEqual(testTitle);
      expect(instance.find('img').prop('src')).toEqual(testImage);
    });

    it('can be used within JSX and Preact components', () => {
      const instance = mount(<Content />);

      expect(instance.find('article').exists()).toEqual(true);
      expect(instance.find('h2').text()).toEqual(testTitle);
    });

    it('preserves word spacing if present', () => {
      const result = parse(testSentence) as JSX.Element;
      const instance = mount(result);

      expect(instance.text()).toEqual(`${testWord} ${testWord} ${testWord}?`);
    });
  });
});
