import { retext } from "retext";
import retextKeywords from "retext-keywords";
import retextPos from "retext-pos";
/**
 *  extract key phrases & key entities with retext-keywords
 *  which uses part-of-speech tags to find n-gram phrases, then normalizes them to
 * @param {string} text
 * @param {object} options {maximum, includePositions}
 * @return {array}  array of {value, count} sorted by frequency
 */
export default async function extractKeywords(text, options) {
  
  var maximum = options?.maximum || 30;
  var includePositions = options?.positions || false;

  var plantext = text.replace(/<[^>]*>?/gm, " . \n ");


  const file = await retext()
    .use(retextPos) // Make sure to use `retext-pos` before `retext-keywords`.
    .use(retextKeywords, { maximum })
    .process(plantext);

  var keyphrases = file?.data?.keyphrases
    .map((phrase) => ({
      value: toString(phrase.matches[0].nodes),
      // matches: phrase.matches.map((match) => [
      //   match.nodes[0].position.start.offset,
      //   match.nodes[0].position.end.offset,
      // ]),
      count: phrase.matches.length,
    }))
    .filter(
      (phrase) =>
        phrase.value.length > 7 &&
        !["https", "href", "img src", "br/"].includes(phrase.value)
    );
  return keyphrases;

}

/**
 * reduce an array with duplicate strings to array of {text, count}
 * count frequency by normalized & ignoring case, return text in its original case
 * normalize by removing stop words and plurals
 * @param {array} arr array of duplicate strings
 * @param {boolean} optionNormalize true to normalize the returned text of strings
 * by removing stop words and plurals, false to keep original text of last occurring string
 * @returns {array} array of unique values with count [{text, count}]
 */
export function reduceByNormalizedFrequency(arr, optionNormalize) {
  const counts = {};
  var originalCase = {};

  var stopWords = getStopWords();

  for (var phraseOriginal of arr) {
    // split into lowercase tokens by whitespace,
    /// filter out stop words 127 commonly ignored stop words
    var phraseDisplay = phraseOriginal
      .replace(/[^a-zA-Z\ \-]/g, "") //remove non-letters and non-space
      .replace(/s$/g, "") //plurals at the end
      .split(" ")
      .filter((word) => !stopWords.includes(word.toLowerCase()))
      .join(" ")
      .trim();

    if (phraseDisplay.trim().length) {
      //use case-ignore and ignore all but letters
      //when creating keys for counting similarity
      var phraseNormalized = phraseDisplay.toLowerCase();

      originalCase[phraseNormalized] = optionNormalize
        ? phraseDisplay
        : phraseOriginal;

      counts[phraseNormalized] = counts[phraseNormalized]
        ? counts[phraseNormalized] + 1
        : 1;
    }
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1]) //sort by frequency descending
    .map(([key, count]) => {
      return { text: originalCase[key], count };
    });
}

/**
 *  list of 125 common stop words
 * @param {Array} stopWords
 */
export function getStopWords() {
  // prettier-ignore
  return [ "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "can", "will", "just", "don", "should", "now" ]
}
