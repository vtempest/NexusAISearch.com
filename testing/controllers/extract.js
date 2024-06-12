import langModel from "$lib/lang-model-api";
import extract from "$lib/extract";
import fetch from "$lib/fetch";
import { env, getRuntimeKey } from "hono/adapter";
const { parseHTML } = require("linkedom");

import fetchYoutubeText, {fetchViaYoutubeTranscript} from "$lib/extract/extract-youtube-transcript";

export default async function extractController(c) {
  
    const url = c.req.query("url");
    const customPrompt = c.req.query("prompt");
    
     
//for youtube videos, get the transcript and timestamps
  if (url?.includes("youtube.com/watch")) {
    var extractedObject = await fetchYoutubeText(url);

    if (extractedObject.error)
      extractedObject = await fetchViaYoutubeTranscript(url);

    if (extractedObject.error) 
      return c.json({ error: extractedObject.error });

    var {content} = extractedObject;


  } else {
    var html = await fetch(url);
    if (html.error) return c.json({ error: html.error });
    const { document } = parseHTML(html);


    var { author, date, title, source, content, keywords } = await extract(document);
  
    // // set base url for relative links
    // content=content
    //   .replaceAll(/<a href="[^h]/gi, '<a href="' + url + '/')
    //   .replaceAll(/<img src="[^h]/gi, '<img src="' + url + '/')

  
  }

  var userPrompt = encodeURIComponent(content);

  
    
    // get env from dev.vars in Cloudflare or from .env in local
    const apiKey = getRuntimeKey() == "workerd"
        ? env(c, "workerd").GROQ_API_KEY
        : process ? process.env?.GROQ_API_KEY : null;

      
    var summaryPrompt = `
    brief sentences providing summary of key points below. use short
     phrases and include details about key entities. do not format in
      markdown. do not say key points or summary. do not say anything else.
       do not say 'here are ... '
    `

    var systemPrompt = customPrompt ? customPrompt : summaryPrompt;
    if (userPrompt)
    var summary = await langModel({
      systemPrompt,
      userPrompt,
      apiKey
    });
  
  
    return c.json({ summary, url, author, date, title, source, content, keywords } );
  }