import fetchGoogleWeb from "../adapters/google-web";
import fetchGoogleNews from "../adapters/google-news";
import fetchDuckWebSearch from "../adapters/duck-web-search";

export default async function searchController(c) {
  
  const searchTerm = c.req.query("term");
  const engine = Number(c.req.query("engine")) || 0;

  const searchEngines = ["googleweb", "googlenews"];

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

  var elapsed = new Date().getTime() - startTime;

  var {results, next_words} = response;

  return c.json({ results, next_words, searchTerm, elapsed });
}