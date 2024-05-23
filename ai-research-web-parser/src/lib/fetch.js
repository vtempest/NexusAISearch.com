// import { HttpProxyAgent, HttpsProxyAgent } from "hpagent";
import fetch from "node-fetch";

/**
 * Scrapes any url to return html or pdf,
 * error if bot detection
 * @param {string} url url of any webpage
 * @returns
 */
export default async function fetchText(url) {

  // return fetchViaProxy("http://ipinfo.io/ip");
  const headers = {
    "user-agent":
      "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0",
  };

  var response = await fetch(url, { headers });

  response = url.endsWith(".pdf")
    ? await response.buffer()
    : await response.text();

  //check for bot detection
  if (checkBotDetected(response)) return { error: "Bot detected" };

  return response;
}

//check html for bot block messages
function checkBotDetected(html) {
  return (
    html.includes("Cloudflare Ray ID") ||
    (html.includes("request_error") && html.includes("proxyId")) ||
    html.includes("Before you continue to Google") ||
    html.includes("Please verify you are a human") ||
    html.includes("Sorry, we just need to make sure you're not a robot") ||
    html.includes("Access to this page has been denied") ||
    html.includes("Please make sure your browser supports JavaScript") ||
    html.includes("Please complete the security check to access")
  );
}

//when using scrapoxy, disable "Intercept HTTPS requests"

var proxy =
  "http://oze4ey6yqkpyicjnmpxev:2g8o91ivcangvy9kytziv@34.240.142.46:8888/";

/**
 * Scrapes a url for html content, optionally using proxy
 * @param {string} url url to fetch, supports http and https
 * @returns {string} html content of the url
 */
async function fetchViaProxy(url) {
  var agent = null,
    requestHandler;

  if (url.startsWith("https")) {
    agent = new HttpsProxyAgent({
      proxy,
    });
    // requestHandler = https;
  } else if (url.startsWith("http")) {
    agent = new HttpProxyAgent({
      proxy,
    });
    // requestHandler = http;
  } else {
    throw new Error("Unsupported protocol");
  }

  var r = await (await fetch(url, { agent })).text();


  return r;
}