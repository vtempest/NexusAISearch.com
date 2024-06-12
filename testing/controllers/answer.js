import langModel from "$lib/lang-model-api";
import extract from "$lib/extract";
import { env, getRuntimeKey } from "hono/adapter";
const { parseHTML } = require("linkedom");

import fetch from "$lib/fetch";

import fetchGoogleWeb from "../adapters/google-web";
import fetchGoogleNews from "../adapters/google-news";
import fetchDuckWebSearch from "../adapters/duck-web-search";


export default async function answerController(c) {
  try {
    const searchTerm = c.req.query("q");
    
    //how many top results to extract
    const limitSources = c.req.query("limit") || 2;
    const engine = Number(c.req.query("engine")) || 0;

    var startTime = new Date().getTime();

    var response;

    if (engine == 2)
      response = await fetchGoogleWeb({
        searchTerm,
      });

    if (engine == 1)
      response = await fetchGoogleNews({
        searchTerm,
      });

    if (engine == 0)
      response = await fetchDuckWebSearch({
        query: searchTerm,
      });

    var { results } = response;

    //get content of first search result
    var customPrompt =
      `
    Considering the context below, cite the sources in your answer and
    answer the query of: ` + searchTerm;

    //for other sites, extract the main content as  basic html
    var sources = [];

    for (var i = 0; i < limitSources; i++) {

      var url = results[i]?.url;
      var html = await fetch(url);
      if (html.error) continue;

      const { document } = parseHTML(html);

      var source = await extract(document);

        // set base url for relative links / but not // protocol links
        source.content=source.content
    .replaceAll(/<(img src|a href)="\/([^\/])/gi, '<$1="' + new URL(url).origin + '/$2')
    //remove links to page anchors
    .replaceAll(/<a href="#[^>]*>/gi, '')



      Object.assign(source, { url });
      sources.push(source);

    }

    // var {text, error} = extractedObject;
    var userPrompt =
      JSON.stringify(sources[0])?.slice(0, 5000) +
      JSON.stringify(sources[1])?.slice(0, 5000);
      
    // get env from dev.vars in Cloudflare or from .env in local
    const apiKey =
      getRuntimeKey() == "workerd"
        ? env(c, "workerd").GROQ_API_KEY
        : process
        ? process.env?.GROQ_API_KEY
        : null;

    var summaryPrompt = `
    4 complete sentences providing summary of key points below. use short
     phrases and include details about key entities. do not format in
      markdown. do not say key points or summary. do not say anything else.
       do not say 'here are ... '
    `;
    userPrompt = userPrompt?.replace(/[\{\}]/g, "");
    var systemPrompt = customPrompt ? customPrompt : summaryPrompt;

    var answer = await langModel({
      systemPrompt,
      userPrompt,
      apiKey,
    });

    var elapsed = ((new Date().getTime() - startTime)/1000).toFixed(1);


    return c.json({ answer, sources, elapsed });
  } catch (e) {
    console.log(e);
    return c.json({ error: e.message });
  }
}
