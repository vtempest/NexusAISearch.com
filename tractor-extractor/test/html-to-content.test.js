import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import extract from "../src";

import * as fsExtra from "fs-extra";
const INPUT_FOLDER = "./test/input";

const OUTPUT_FOLDER = "./test/output";
fsExtra.emptyDirSync(OUTPUT_FOLDER);

const urls = [
  "https://medium.com/the-artificial-impostor/use-textrank-to-extract-most-important-sentences-in-article-b8efc7e70b4",
  "https://www.nature.com/articles/d41586-024-01493-8",
  "https://arxiv.org/abs/1706.03762",
  "https://arxiv.org/pdf/1706.03762",
  "https://www.gurwinder.blog/p/the-intellectual-obesity-crisis",
  "https://en.wikipedia.org/wiki/Thunder_(mascot)",
  "https://www.cnn.com/2024/06/03/business/zero-down-mortgage-nightcap/index.html",
  // "https://www.nytimes.com/2017/06/23/style/modern-love-to-stay-in-love-sign-on-the-dotted-line-36-questions.html",
  "https://www.vanityfair.com/hollywood/story/richard-dreyfuss-sexist-rant#intcid=_vanity-fair-hollywood-right-rail_f87f0879-6463-480f-819d-d94385ac0101_popular4-1",
  "https://www.anandtech.com/show/21415/amd-unveils-ryzen-9000-cpus-for-desktop-zen-5-takes-center-stage-at-computex-2024",
  "https://www.youtube.com/watch?v=YALpX8oOn78",
];

describe("html to content", () => {
  
  it("url to content and cite", async () => {
    for (var i in urls) {
      var url = urls[i];
      var extraction = await extract(url);
      extraction = JSON.stringify(extraction, null, 2);


      var outputPath =
        url
          .slice(-15)
          .replace(/[^A-Za-z0-9]/g, "") + ".json";
      if(extraction)
      fs.writeFileSync(path.join(OUTPUT_FOLDER, outputPath), extraction);
      
      console.log(extraction);
    }

    expect(extraction).toBeDefined();
  }, 20000);
});


