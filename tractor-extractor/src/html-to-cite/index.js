import { parseHTML } from "linkedom";
import { parseFullName } from "parse-full-name";
import { parseDate } from "chrono-node";

import extractAuthor from "./extract-author";
import extractDate from "./extract-date";
import {extractTitle, extractSource} from "./extract-cite-dom";
import extractMetadata from "./extract-metadata";

/**
 * Extract cite info from document using meta tags and common class names
 *
 * @param {document} documentHTML  dom object or html string with article content
 * @returns {object} {author, date, title, source}
 */
export default function extractCite(document) {
  //if passing in html string, convert to dom object
  if (typeof document === "string") 
    document = parseHTML(document)?.document;

  var { author, date, title, source } = extractMetadata(document);

  if (!author || author.length < 5 || author.length > 50 || author.split(" ").length < 2) {
    author = extractAuthor(document) || author;
    if (author?.length < 5 || author?.length > 50) author = null;
  }

  date = extractDate(document) || date;
  date = parseDate(date)?.toISOString().split("T")[0];

  title = extractTitle(document) || title;
  source = extractSource(document) || source;

  return { author, date, title, source };
}
