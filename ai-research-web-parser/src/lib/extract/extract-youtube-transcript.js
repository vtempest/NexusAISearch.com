const { parseHTML } = require("linkedom");
const { YoutubeTranscript } = require("youtube-transcript");
const fetch = require("../fetch");

/**
 * fetch youtube.com video's webpage HTML for embedded transcript
 * if blocked, use scraper of youtubetranscript.com
 * @param {string} videoUrl
 * @param {boolean} boolTimestamps - true to return timestamps, default true
 * @return {Object} {content, timestamps} where content is the full text of
 * the transcript, and timestamps is an array of [characterIndex, timeSeconds]
 */
export default async function fetchYoutubeText(
  videoUrl,
  boolTimestamps = true
) {
  try {
    var transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
  } catch (e) {
    console.log(e.message);
    transcript = await fetchViaYoutubeTranscript(videoUrl);
  }

  var content = "";
  var timestamps = [];
  transcript.forEach(({ offset, text }) => {
    if (boolTimestamps)
      timestamps.push([content.length, Math.floor(offset, 0)]);

    content += text + " ";
  });

  if (!boolTimestamps) return { content };

  return { content, timestamps };
}

/**
 * get youtubetranscript of most youtube videos,
 * except if disabled by uploader
 * fetch-based scraper of youtubetranscript.com
 *
 * @param {string} videoUrl
 * @return {Object} {content, timestamps} where content is the full text of
 * the transcript, and timestamps is an array of [characterIndex, timeSeconds]
 */
export async function fetchViaYoutubeTranscript(videoUrl) {
  const videoId = extractVideoId(videoUrl);

  const url = "https://youtubetranscript.com/?server_vid2=" + videoId;

  var html = await fetch(url)
  const { document } = parseHTML(html);

  return document
    .querySelectorAll("transcript text")
    .map((elem) => ({text: elem.textContent,
      offset: elem.getAttribute("data-start")}))

}

// Extract video ID from the YouTube URL
const extractVideoId = (url) => {
  const regex =
    /(?:\/embed\/|v=|v\/|vi\/|youtu\.be\/|\/v\/|^https?:\/\/(?:www\.)?youtube\.com\/(?:(?:watch)?\?.*v=|(?:embed|v|vi|user)\/))([^#\&\?]*).*/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

//get video cite info from url
//blocked in cloudflare-workers
async function getYoutubeInfo(videoUrl) {
  try {
    var info = await getBasicInfo(videoUrl);

    var videoInfo = await YouTube.getVideo(videoUrl);

    var { tags, title, description, durationFormatted, uploadedAt } = videoInfo;

    var source = videoInfo.channel.name;

    var date = chrono.parseDate(uploadedAt).toISOString().split("T")[0];

    return {
      title,
      url: videoUrl,
      source,
      date,
      duration: durationFormatted,
      tags,
      description,
    };
  } catch (e) {}
}

export function secondsToHms(s) {
  return (
    (s > 3600 ? (s - (s % 3600)) / 3600 + ":" : "") +
    (((s - (s % 60)) / 60) % 60) +
    ":" +
    Number(s % 60)
      .toFixed(0)
      .padStart(2, "0")
  );
}
