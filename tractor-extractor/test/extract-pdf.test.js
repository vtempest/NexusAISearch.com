import { describe, it, expect } from "vitest";
import extractPDF from "../extract-pdf";
import fs from 'fs';

var urls = [
  "http://wpc.4d7d.edgecastcdn.net/004D7D/mkt/document/Newcomers-Guide-v1.2.2_Original.pdf",
  "https://www.un.org/sustainabledevelopment/wp-content/uploads/2019/07/13_Why-It-Matters-2020.pdf",
  "https://www.dni.gov/files/ODNI/documents/assessments/NIE_Climate_Change_and_National_Security.pdf"
]
 
describe("extract-pdf", () => {

  // it("parse pdf from url", async () => {
  //   var url = urls[1]
  //   var text = await extractPDF(url, { showPageNumbers: 1 });
  //   console.log(text);
  //   expect(text.length>1).toBeTruthy();
  // }, { timeout: 20000 });
 
  
  it("parse pdf from file", async () => {
    var url = "./test/input/complex.pdf";
    var text = await extractPDF(url, { showPageNumbers: 1 });
    // console.log(text); 

    fs.writeFileSync('./test/output/complex.html', JSON.stringify(text, null, 2)); 
    expect(text).toBeDefined();
  });
});
