import extractCite from "./extract-cite";
import extractContent from "./extract-content";

/**
 * Extract cite info and main formatted text content
 * @param {document} document document or dom object with article content
 * @returns {object} {author, date, title, source, content}
 */

export default async function extract(document) {
  //site specific handlers -- youtube

  var extraction = extractCite(document);

  var content = extractContent(document, {
    markdown: false,
    images: true,
    links: true,
    formatting: true,
  });
  Object.assign(extraction, { content });


  var parseFullName = require("parse-full-name").parseFullName;
  try {
    var authorLast = parseFullName(extraction.author, { fixCase: true })?.last;
  } catch (e) {}

  Object.assign(extraction, { authorLast });

  return extraction;
}

/**
 * Get the text content of a node or list of nodes.
 *
 * Prefers the node’s plain-text fields, otherwise serializes its children, and
 * if the given value is an array, serialize the nodes in it.
 *
 * @param {Array<Nodes> | Nodes} value
 *   Node or list of nodes to serialize.
 * @returns {string}
 *   Result.
 */
export function toString(value) {
  let index = -1;

  if ("value" in value) return value.value;

  // console.log(value.position?.start)

  const children =
    (Array.isArray(value) ? value : value.children) || emptyNodes;

  const values = [];

  while (++index < children.length) {
    values[index] = toString(children[index]);
  }

  return values.join("");
}
