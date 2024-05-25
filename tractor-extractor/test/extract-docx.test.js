import { describe, it, expect } from "vitest";
import extractDOCX from "../extract-docx";
import fs  from 'fs'

var doc = "./example.docx"

describe("extract-docx", () => {

  it("parse docx from file", async () => {
    
    var text = await extractDOCX(doc);
    // console.log(text);
    expect(text?.length>1).toBeTruthy();


  }, { timeout: 20000 });

  
});

  
// //run conversion
// //single file
// if (INPUT_FOLDER.endsWith(".docx") ) {
//   convertFile(INPUT_FOLDER, 1);

// } else if (INPUT_FOLDER.endsWith(".html") ) {

//   //convert html to json
//   const fileContents = fs.readFileSync(INPUT_FOLDER);
//   if (!fileContents || fileContents.length === 0) {
//     process.exit(1);
//   }
//   //const cards = extractCardsFromHtml(fileContents.toString());
//  // console.log(JSON.stringify(cards));
// }  else {  
//   var allFiles = getFilesInFolder(INPUT_FOLDER)
//   totalFileCount = allFiles.length;
  
//   allFiles.forEach(convertFile);
// } 

// };


// //convert docx by unzipping it and regex to simple html u,b,p,h1,h2,h3,h4,span

// const docx2html = (docXML) => {

//     //create DOM with document elements and formatting
//     var output = "";
//     var inputDom = new JSDOM(
//           docXML.replace(/<[a-zA-Z]*?:/g, "<").replace(/<\/[a-zA-Z]*?:/g, "</")
//         ).window.document.body;

//     var plist = inputDom.getElementsByTagName("p");
  
//     // paragraph node list in the doc containing all paragraphs,
//     // each containing in-line <r> text ranges equivalent to <span> and style info as <pPr>
//     for (var i = 0; i < plist.length; i++) {
//       var inNode = plist[i];
//       var outNode = "";
  
//       //detect paragraph style name and add it as a class name later
//       var pStyle = inNode.getElementsByTagName("pStyle")[0]?.getAttribute("w:val").toLowerCase() || "";
      
//       //use h1-h9 for heading styles or p for normal paragraph
//       var tag = pStyle.includes('heading') ? pStyle.replace("heading", "h") : "p";

//       //convert each text range from xml to html
//       for (var j = 0; j < inNode.getElementsByTagName("r").length; j++) {
//         var inNodeChild = inNode.getElementsByTagName("r")[j];
//         var val = inNodeChild.textContent;

//         //pass style as class name to parent paragraph
//         var style = inNodeChild
//             .getElementsByTagName("rStyle")[0]
//             ?.getAttribute("w:val")
//             .toLowerCase() || "";
//         if (style) 
//           val = "<span class='"+style+"'>" + val + "</span>";
    
  
//         //add bold, underline, highlight
   
//         if (
//           inNodeChild.getElementsByTagName("u").length 
        
//         )
//           val = "<u>" + val + "</u>";
  
//         if (inNodeChild.getElementsByTagName("highlight").length)
//           val = '<mark style="background-color:' + 
//             inNodeChild.getElementsByTagName("highlight")[0].getAttribute("w:val") 
//             + '">' + val + "</mark>";
  
//         outNode += val;
//       }
  
//       //add to output
//       output += "<"+tag+" class='"+pStyle+"'>" + outNode + "</"+tag+">";
//     }
  
//     return output;
//   }
  

// //get all files in folder and subfolders
// const getFilesInFolder = (dir, files = []) => {
//   const dirFiles = fs.readdirSync(dir)
//   for (const f of dirFiles) {
//       const stat = fs.lstatSync(dir + path.sep + f)
//       if (stat.isDirectory()) 
//         getFilesInFolder(dir + path.sep + f, files)
//       else 
//           files.push(dir + path.sep + f)
//   }
//   return files
// }


// var outputPath=filepath.replace(".docx", ".html")
// outputPath = outputPath.replace(INPUT_FOLDER.replace(/\\+$/g, ''), INPUT_FOLDER.replace(/\\+$/g, '') + " HTML")

// // create output dir if not exists
// const dir = path.dirname(outputPath)
// if (!fs.existsSync(dir)) {
//   fs.mkdirSync(dir, {recursive:true});
// }

// fs.writeFileSync(outputPath, htmlDoc); 

