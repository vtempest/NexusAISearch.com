import extractAuthor from "./extract-author";
import extractDate from "./extract-date";
import extractTitle from "./extract-title";
import extractSource from "./extract-source";
import extractMetadata from "./extract-metadata";

/**
 * Extract cite info from document using meta tags and common class names
 * adapted from  Cite Creator Chrome Extension 2016 (GPL 3.0)
 * https://chromewebstore.google.com/detail/cite-creator/jampigcbgngjedogaoglhpeckidccodi
 *
 * @param {document} document document or dom object with article content
 * @returns {object} {author, date, title, source}
 */
export default function extractCite(document) {
  var { author, date, title, source } = extractMetadata(document);

  // date = !!Date.parse(date) && new Date(date).toISOString().split("T")[0];
  return {
    title: extractTitle(document) || title,
    source: extractSource(document) || source,
    author:  extractAuthor(document) || author,
    date: extractDate(document) ||  date ,
  };
}
