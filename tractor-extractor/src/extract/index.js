import extractCite from "./extract-cite";
import extractContent from "./extract-content";
import {parseFullName} from 'parse-full-name';

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


  var authorLast = parseFullName(extraction.author, { fixCase: true })?.last;

  Object.assign(extraction, { authorLast });

  return extraction;
}