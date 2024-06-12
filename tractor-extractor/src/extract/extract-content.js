import sanitizeHtml from "sanitize-html";
import { NodeHtmlMarkdown } from "node-html-markdown";
const { Readability } = require("@mozilla/readability");

/**
 *  Extract main text content from wepbage html string
 *  with Readability and linkedom to build a dom and find the
 *  element most likely to contain article, strip to basic html
 * @param {string} html - the html to parse
 * @param {object} options {markdown: 0, images: 1, links: 1, formatting: 1 }
 * @return {string} string of basic html
 */
export default function extractContent(document, options) {
  options = options || {
    markdown: true,
    images: true,
    links: true,
    sections: false,
    formatting: true,
    url: "",
  };
  try {
    var mainContentHTML = new Readability(document).parse()?.content;
  } catch (e) {
    console.log(e);
    return false
  }

  var text = cleanBasicHTML(mainContentHTML, options)
    .replace(/[\u0300-\u036f]/g, "") //special chars
    .replace(/ \s+/g, " ")
    .trim() //whitespace
    .replace(/[\r\n\t]+/g, "<br/>"); //linebreaks

  if (options.markdown) {
    text = NodeHtmlMarkdown.translate(text);
    // text = splitSentences(text);
  }

  return text;
}

/**
 * Remove all HTML tags except basic formatting and links and img src
 * @param {string} html
 * @param {object} options {images: 1, links: 1, sections: 1, formatting: 1 }
 * @returns {string} sanitized html
 */
export function cleanBasicHTML(
  html,
  { images = 0, links = 1, formatting = 1 }
) {
  return sanitizeHtml(html, {
    allowedTags: !formatting ? [] :[
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "br",
      "p",
      "u",
      "b",
      "i",
      "em",
      "strong",
      "blockquote",
      "section",
      "details",
      "summary",
      "pre",
      "code",
      "figure",
      "hr",
      "label",
      "ul",
      "ol",
      "li",
      "dd",
      "dl",
      "table",
      "th",
      "tr",
      "td",
      "thead",
      "tbody",
      "tfood",
      links ? "a" : "",
      images ? "img" : "",
    ],
    allowedAttributes: {
      a: ["href"],
      img: ["src"],
    },
  });
}
