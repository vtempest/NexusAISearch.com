import extractAuthor from './extract-author';
import extractDate from './extract-date';
import extractTitle from './extract-title';
import extractSource from './extract-source';

/**
 * Extract cite info from document using meta tags and common class names
 * adapted from  Cite Creator Chrome Extension 2016 (GPL 3.0)
 * https://chromewebstore.google.com/detail/cite-creator/jampigcbgngjedogaoglhpeckidccodi
 *
 * @param {document} document document or dom object with article content
 * @returns {object} {author, date, title, source}
 */
export default function extractCite(document) {
  return {
    author: extractAuthor(document),
    date: extractDate(document),
    title: extractTitle(document),
    source: extractSource(document),
  };
}
