import Parser from "@postlight/parser";
import { parseDate } from "chrono-node";
import extractCite from "../html-to-cite";
import convertHTMLToBasicHTML from "./html-to-basic-html";

export default async function extractContent(html, options) {
  options = options || {
    images: true,
    links: true,
    formatting: true,
    absoluteURLs: 1,
    url: "",
  };

  var postlightParsedArticle = await new Promise(function (resolve, reject) {
    Parser.parse(options.url, {
      html,
    })
      .then(resolve)
      .catch((e) => {
        console.log(e);
        reject();
      });
  });

  var { date_published, lead_image_url, word_count, content } =
    postlightParsedArticle;

  date_published = date_published
    ? parseDate(date_published)?.toISOString().split("T")[0]
    : null;

  var { author, date, title, source } = extractCite(html, { url: options.url });

  author = postlightParsedArticle.author || author;
  title = postlightParsedArticle.title || title;
  date = date_published || date;

  var html = convertHTMLToBasicHTML(content, options);
  var image = lead_image_url;

  return { title, author, date, source, html, image, word_count };
}
