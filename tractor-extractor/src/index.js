import extractContent from "./html-to-content/extract-content";
import { testYoutubeURL, fetchYoutubeText } from "./adapters/youtube-to-text";
import fetchText from "./url-to-html/fetch";
import extractPDF from "./adapters/pdf-to-html";
import extractKeywords from "./nlp-tools/keywords";
/**
 * Extract cite info and main formatted text content
 * @param {document} document document or dom object with article content
 * @returns {object} {author, date, title, source, content, image}
 */
export default async function extract(url, options = {}) {
  var response;

  try {
    //site specific handlers -- youtube
    if (url.endsWith(".pdf") || url.startsWith("https://arxiv.org/pdf"))
      response = await extractPDF(url, {});
    else {
      //html page
      var html = await fetchText(url);

      response = await extractContent(html, {
        url,
        markdown: false,
        images: true,
        links: true,
        formatting: true,
      });

      if (testYoutubeURL(url)) {
        var { content, word_count, timestamps, format} = await fetchYoutubeText(url);

        response.html = content;
        response.format = format;
        response.word_count = word_count;
        // response.timestamps = timestamps;
      }
    }

    var {keyphrases, sentences} = await extractKeywords(response.html)
    response.keyphrases = keyphrases;
    response.sentences = sentences;

    response.url = url;
    return response;
  } catch (e) {
    console.error("Error in extract", e);
    // return { error: e.message };
  }
}
