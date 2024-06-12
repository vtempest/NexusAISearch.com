import { describe, it, expect } from "vitest";
import fs from "fs";
import { documentToTokens, documentToMarkup } from "./docx-to-html";
import { extractCards } from "./parse-cards";
import { tokensToMarkup } from "./docx-tokens";
import {parseDebateDocx} from  "./parse-debate-docx";
import { getFilesInFolder, handleZipOfDocx } from "./parse-zip-folder";
import path
 from "path";
const INPUT_FOLDER = "./test/input";

const OUTPUT_FOLDER = "./test/output";

describe("extract-docx", () => {

  it("parse zip of docx into cards", async () => {
    return 1

    var zipPath = path.join(INPUT_FOLDER, "UM7.zip")
    var outputFolder = path.join(OUTPUT_FOLDER, "2022OpenEv JSON")
    var outout = await handleZipOfDocx(zipPath, outputFolder);
     
    expect(outputFolder).toBeDefined();

  })

  it("parse docx folder into cards", async () => {
    return 1

    var folder = "D:\\GitHub\\debate-ARCHIVE\\Debate23" //"/home/admin/Downloads/ndtceda23";

    var files = getFilesInFolder(folder);

    for (var i in files) {
      var filename = files[i];
      
      var evCollection = await parseDebateDocx(filename)


      var output = JSON.stringify(evCollection, null, 2)

      var outputPath = filename
        .replace(folder, folder.replace(/\/$/, "") + " JSON")
        .replace(".docx", ".json");

      var outputDir = outputPath.match(/(.*)[\/\\]/)[1] || "";

      fs.mkdirSync(outputDir, { recursive: true });
      if (output)
      fs.writeFileSync(outputPath, output);
    // return 1;
    }

    expect(output).toBeDefined();
  });

});

// // outputPath = outputPath.replace(INPUT_FOLDER.replace(/\\+$/g, ''), INPUT_FOLDER.replace(/\\+$/g, '') + " HTML")

// // fs.writeFileSync(outputPath, htmlDoc);
