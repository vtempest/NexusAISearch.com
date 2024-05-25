import fs from "fs";
import { getResolvedPDFJS } from "unpdf";

/**
 *  PDF to Text merging unwanted line breaks into sentences
 *  preserving paragraphs, Section Headers, and Page Numbers
 *  Utilizes unpdf library to wrap pdf.js for Node,
 *  better quality than pdf2json or pdf-parse
 * @param {string} pdfPath - File Path or url to a PDF file
 * @param {object} { showPageNumbers = false }
 * @returns text
 * @throws {Error} if the PDF file is not found or cannot be loaded
 */
export default async function extractPDF(
  pdfPath,
  { showPageNumbers = true, 
    cleanLines = true, 
    removePageHeaders = false
  }
) {
  // try {
    //load file or download url into memory buffer
    var buffer = pdfPath.startsWith("http")
      ? await (await fetch(pdfPath)).arrayBuffer()
      : await fs.readFileSync(pdfPath);


    const PDFJS = await getResolvedPDFJS();
    const doc = await PDFJS.getDocument(new Uint8Array(buffer)).promise;

    // Get metadata
    var metadata = await doc.getMetadata();
    var { Author: author, CreationDate: date, Title: title } = metadata.info;
    date = date.slice(2, 6) + "-" + date.slice(6, 8) + "-" + date.slice(8, 10);
    date = date ? new Date(date)?.toISOString().split("T")[0] : null;

    // get text ranges with pdf.js
    var pages = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      var contentObjects = await page.getTextContent();
      var content = contentObjects.items.map((item) => item.str);
      pages.push(content);
    }

    //TODO remove redundant headers and page numbers
    if (removePageHeaders && pages.length > 2){
      //test first 4 ranges in each page for a redundant header
      for (let rangeIndex = 0; rangeIndex < 3; rangeIndex++) {
        var headerMatches=0, pageNumMatches = 0,
        matchedHeaderIndex, matchedPageNumIndex, lastHeader = "";
        pages.forEach((page, pageNum) => {
          var range =  page[rangeIndex];
          if (!range) return;

          // detect header  if same range in same index as prior page, 
          if (range?.length > 8  && pageNum >= 1 
            && range == pages[pageNum-1][rangeIndex]) {

              pages[pageNum][rangeIndex] = "";
            console.log("Removing Header: ", range);
          }

          if (range && range.length < 4 && parseInt(range) && pageNum >= 1 
            && parseInt(range)-1==parseInt(pages[pageNum-1][rangeIndex])){
           
            pages[pageNum][rangeIndex] = "";
            console.log("Removing PageNums: ", range);
          }

          lastHeader = range;
        })
      }

    }


    var text = pages
      .map((content, pageNumber) => {
        content = content.reduce((all, range) => {

          //hyphenated words at end of line or column
          if (cleanLines && range.endsWith("-")) return all + range.slice(0, -1);

          // Merge unwanted mid-sentence line breaks
          if (cleanLines && '.?!"”\n'.includes(range[range.length - 1]))
            return all + range + "\n\n";

          return all + range + " ";
        }, "");

        //clean up
        if (cleanLines)
          content = content
            // trailing spaces or breaks
            .replaceAll(/\n{2,}/g, "\n\n")
            .replaceAll(/ +/g, " ");

        // Add page numbers if requested
        if (showPageNumbers) 
          content = `[ ${pageNumber + 1} ]\n` + content;

        return content;
      })
      .join("\n");

    return text;
    // return   { text, author, title, date, pageCount: pages.length }; //pages.join("\n");
  // } catch (e) {
  //   throw new Error(e.message);
  // }
}
