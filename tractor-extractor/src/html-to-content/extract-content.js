import { NodeHtmlMarkdown } from "node-html-markdown";
const { Readability } = require("@mozilla/readability");
import Parser from "@postlight/parser";
import extractCite from "../html-to-cite";
import { parseDate } from "chrono-node";
import cleanBasicHTML from "./clean-html";

export default async function extractContent(html, options) {
  options = options || {
    markdown: true,
    images: true,
    links: true,
    sections: false,
    formatting: true,
    url: "",
  };

  var postlightParsedArticle  
   = await new Promise(function (resolve, reject) {
    Parser.parse(options.url, {
      html,
    }).then((result) => {
      resolve(result);
    }).catch((e) => {
      console.log(e);
      reject();
    })
  });

  
  var { date_published, lead_image_url, word_count, content } = postlightParsedArticle;
  
  date_published = date_published
    ? parseDate(date_published)?.toISOString().split("T")[0]
    : null;

    
  var {author, date, title, source} = extractCite(html, {url: options.url});
  
  
  author =   postlightParsedArticle.author  ||  author ;
  title = postlightParsedArticle.title || title;

  date = date_published
  


  

  var html = cleanBasicHTML(content, options)
    .replace(/[\u0300-\u036f]/g, "") //special chars
    .replace(/ \s+/g, " ")
    .trim() //whitespace
    .replace(/[\r\n\t]+/g, ""); //remove linebreaks

  // if (options.markdown) {
  //   text = NodeHtmlMarkdown.translate(text);
  //   // text = splitSentences(text);
  // }

  var image = lead_image_url;

  return { title, author, date, source, html, image, word_count };

  // return text;
}

/**
 *  Extract main text content from wepbage html string with Readability
 * @param {string} html - the html to parse
 * @return {string} string of basic html or empty if error
 */
export function extractContentReadability(document) {
  try {
    return new Readability(document).parse()?.content;
  } catch (e) {
    console.log(e);
    return "";
  }
}
