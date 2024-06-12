import sanitizeHtml from "sanitize-html";

/**
 * Remove all HTML tags except basic formatting and links and img src
 * @param {string} html
 * @param {object} options {images: 0, links: 1, sections: 1, formatting: 1 }
 * @returns {string} sanitized html
 */
export function cleanBasicHTML(
    html,
    { images = 0, links = 1, formatting = 1 }
  ) {
    return sanitizeHtml(html, {
      allowedTags: !formatting
        ? []
        : [
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
            "small",
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
  