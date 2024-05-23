const SentenceSplitter = require("sentence-splitter");

/**
 * Splits any string of sentences into array of sentences
 * uses https://github.com/textlint-rule/sentence which 
 * understands abbreviations, numbers, quotes, etc
 *
 * @param {string} text string of sentences with varied punctuation
 * @returns {array} array of {text, start, end} of sentence text and range in original text
 */
export default function splitSentences (text) {
  SentenceSplitter.split(text)
    .filter(({ type }) => type == "Sentence")
    .map(({ raw, range }, index) => (raw));
}

//simpler no-dependency version
function splitSentencesRegExp(text) {
  return text.match(/[^.?!]{20,}[.!?]+[\])'"`’”]*|.+/g);
}

