import extractContent from "./html-to-content/html-to-content";
import { testYoutubeURL, fetchYoutubeText } from "./youtube-to-content/youtube-to-text";
import fetchText from "./url-to-html/fetch";
import extractPDF from "./pdf-to-content/pdf-to-html";
import {weightKeySentences} from "./keyphrases/key-sentences"
/**
 * Extract cite info and main formatted text content
 * @param {document} document document or dom object with article content
 * @returns {object} {author, date, title, source, content, image}
 */
export default async function extract(url, options = {}) {
  options = options || {
    keyphrases: true,
    images: true,
    links: true,
    formatting: true,
    absoluteURLs: true
  }
  var response;

  // try {
    //specific handlers -- youtube, pdf
    if (url.endsWith(".pdf") || url.startsWith("https://arxiv.org/pdf"))
      response = await extractPDF(url, {});
    else {
      //html page
      var html = await fetchText(url);

      //hidden pdf url that does not end with pdf
      if (html[0]=="%" || html.indexOf("<")==-1){
        response = await extractPDF(url, {});
        html = response.html;
      } 


      options.url = url;
      response = await extractContent(html, options);

      if (testYoutubeURL(url)) {
        var { content, word_count, timestamps, format} = await fetchYoutubeText(url);

        response.html = content;
        response.format = format;
        response.word_count = word_count;
        // response.timestamps = timestamps;
      }
    }
    if (response.html && options.keyphrases){
    var plainText = response.html?.replace(/<[^>]*>/g, " ").replaceAll("\n", " ")
    var { sorted_sentences, keyphraseGrams } = weightKeySentences(plainText)
    response.keyphrases = keyphraseGrams;
    response.sorted_sentences = sorted_sentences;
    }

    var response2 = {url};
    Object.assign(response2, response)

    return response2;
  // } catch (e) {
  //   console.error("Error in extract", e);
  //   // return { error: e.message };
  // }
}
