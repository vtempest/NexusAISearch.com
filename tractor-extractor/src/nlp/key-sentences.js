const LanguageTokenizer = require("compromise");
const TextRank = require("./graph-centrality-rank").TextRank;
const addNGrams = require("./ngrams").addNGrams;

const nlpStats = require("compromise-stats");

const nlpDates = require("compromise-dates");

LanguageTokenizer.extend(nlpStats);
LanguageTokenizer.extend(nlpDates);

/**
 * Weights sentences using TextRank noun keyphrase frequency 
 * to find which sentences centralize and tie together keyphrase
 * concepts refered to most by other sentences. Based on the
 * TextRank & PageRank algorithms, it randomly surfs links to nodes 
 * to find probability of being at node, ranking centrality to links  
 * 
 *
 * 
 *  Rajput et al (2020). N-Grams TextRank : A Novel Domain Keyword 
 *  Extraction Technique. Proceedings of the 17th International Conference
 *  on Natural Language Processing: TermTraction 2020 Shared Task.
 *  https://aclanthology.org/2020.icon-termtraction.3.pdf

 * Hongyang Zhao and Qiang Xie 2021 J. Phys.: Conf. Ser. 2078 012021 
 * "An Improved TextRank Multi-feature Fusion Algorithm For 
 *  Keyword Extraction of Educational Resources" 
 * https://iopscience.iop.org/article/10.1088/1742-6596/2078/1/012021/pdf
 * 
 * @param {string} string_to_process
 * @param {object} options numberTopToPick
 * @returns {Array<Object>} [{text, keyphrases, weight}] array of sentences
 */
export function weightKeySentences(inputString, options) {
  options = options || {
    minWordLength: 3,
    maxWords: 4,
    topKeyphrasesPercent: 0.2,
  };

  var {
    topKeyphrasesPercent = 0.2,
    minWordLength = 4,
    maxWords = 5,
    minWords = 2,
  } = options;

  //remove html tags
  inputString = inputString.replace(/<[^>]+>/g, "");
  var nGrams = {};
  // var nGrams = LanguageTokenizer(inputString).ngrams({max:  4});

  // nGrams = nGrams.sort((a, b) => b.count*b.size - a.count*a.size)
  // .filter((ngram) => ngram.normal.length > 3)
  // .slice(0, 20)
  // ;

  // console.log(nGrams);

  var sentencesPOS = LanguageTokenizer(inputString).normalize({
      possessives: true,
      plurals: true
    })
    .json() // [...{text: "", terms: [...{tags:[], text, normal, pre, post}] }]
    .map((sentence, sentenceNumber) => {
      for (var i = 0; i < sentence.terms.length; i++) {
        for (var nGramSize = minWords; nGramSize <= maxWords; nGramSize++) {
          addNGrams(
            nGramSize,
            sentence.terms,
            i,
            nGrams,
            minWordLength,
            sentenceNumber
          );
        }
      }
      return sentence;
    });

  //sort keyphrases by weight
  var keyphraseGrams = [];
  for (var nGramSize = minWords; nGramSize <= maxWords; nGramSize++)
    keyphraseGrams = keyphraseGrams.concat(
      Object.entries(nGrams[nGramSize]).map(([keyphrase, sentences]) => {
        return {
          keyphrase,
          sentences,
          words: nGramSize,
          weight: Math.pow(sentences.length, nGramSize),
        };
      })
    );

  //fold smaller keyphrases that are subsets of larger ones
  var keyphrasesFolded = [];
  keyphraseGrams = keyphraseGrams
    .sort((a, b) => b.words - a.words)

  for (var keyphraseGram of keyphraseGrams) {
    var shouldAddCurrent = true;

    for (var i = 0; i < keyphrasesFolded.length; i++) {
      var phrase =keyphraseGram.keyphrase;
      var lastWordIndex = phrase.lastIndexOf(" ")


      if (keyphrasesFolded[i].keyphrase.includes(phrase)
        || lastWordIndex > 5 && keyphrasesFolded[i].keyphrase.includes(phrase.substring(0,lastWordIndex) )
      ) {
    // console.log(keyphrasesFolded[i].keyphrase, keyphraseGram.keyphrase)
       keyphrasesFolded[i].weight += keyphraseGram.weight/keyphrasesFolded[i].keyphrase.split(" ").length;
       keyphrasesFolded[i].sentences= keyphrasesFolded[i].sentences.concat( keyphraseGram.sentences)
       
       if(
       keyphrasesFolded[i].weight < keyphraseGram.weight

       )
       keyphrasesFolded[i].keyphrase = keyphraseGram.keyphrase
       
       shouldAddCurrent = false;
      } 
    }

    if(shouldAddCurrent && keyphraseGram.sentences.length>=2)
      keyphrasesFolded.push(keyphraseGram);
  }


  keyphraseGrams = keyphrasesFolded
    .sort((a, b) =>  b.weight - a.weight)
    .slice(0, Math.floor(keyphraseGrams.length * topKeyphrasesPercent) );

  
    keyphraseGrams = keyphraseGrams.map(keyphrase=>{
      // if(keyphrase.sentences)
      keyphrase.sentences = [...new Set(keyphrase.sentences)]

      if (keyphrase.keyphrase =="learning rate")
        keyphrase.weight+=5000
      return keyphrase
    })

  var sentenceKeysMap = [];
  for (var i = 0; i < sentencesPOS.length; i++)
    sentenceKeysMap.push({ text: sentencesPOS[i].text, index: i, keyphrases: [] });

  keyphraseGrams.forEach(({ keyphrase, sentences, weight }) => {
    var isEntity = LanguageTokenizer(keyphrase).topics().out('array').length
    if(isEntity)
      console.log(keyphrase)


    for (var sentenceNumber of sentences)
      sentenceKeysMap[sentenceNumber].keyphrases.push({keyphrase,weight});
  });


  //run text rank 
  var sorted_sentences = TextRank(sentenceKeysMap)
    .sort((a, b) => {
      return b.weight - a.weight;
    })
    .slice(0, 5);

  keyphraseGrams = keyphraseGrams.slice(0, 5);

  // return { sorted_sentences, keyphraseGrams };
}
