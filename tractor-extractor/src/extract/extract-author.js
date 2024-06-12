/**
 * Extract part of cite info from document using meta tags and common class names
 * adapted from  Cite Creator Chrome Extension 2016 (GPL 3.0)
 * https://chromewebstore.google.com/detail/cite-creator/jampigcbgngjedogaoglhpeckidccodi
 *
 * @param {document} document document or dom object with article content
 * @returns {string} author
 */
export default function extractAuthor(document) {
  var arrAuthors, strBodyText, strByLine, author;

  //If Name is empty, it's the first time through, so attempt to compute it - start with most likely tags
  if (typeof author == "undefined") {
    arrAuthors = document.getElementsByClassName("author"); //Try author
    if (arrAuthors.length <= 0) {
      arrAuthors = document.getElementsByClassName("Author");
    } //Try Author
    if (arrAuthors.length <= 0) {
      arrAuthors = document.getElementsByClassName("sailthru.author");
    } //Try sailtru.author
    if (arrAuthors.length <= 0) {
      arrAuthors = document.getElementsByClassName("byl");
    } //Try byl
    if (arrAuthors.length <= 0) {
      arrAuthors = document.getElementsByClassName("byline");
    } //Try byline
    if (arrAuthors.length <= 0) {
      arrAuthors = document.getElementsByClassName("DC.creator");
    } //Try DC.creator
    if (arrAuthors.length <= 0) {
      var arrMeta = document.getElementsByTagName("meta");
      for (i = 0; i < arrMeta.length; i++) {
        if (arrMeta[i].getAttribute("name") == "ces:authors") {
          author = arrMeta[i].content;
        } //Try ces:authors meta tag
      }
    }

    //If anything found, assign the first hit to Name
    if (arrAuthors.length > 0) {
      author = arrAuthors[0].content;
    }
  }

  //Try to find a div of byline or author class - done separately from regex below for speed, to avoid looping all elements if unnecessary
  if (typeof author == "undefined") {
    arrAuthors = document.getElementsByClassName("author");
    if (arrAuthors.length <= 0) {
      arrAuthors = document.getElementsByClassName("byline");
    }
    if (arrAuthors.length > 0) {
      author = arrAuthors[0].innerText.trim(); //If anything found, assign Name the innerText
      if (author.indexOf("\n") != -1) {
        author = author.slice(0, author.indexOf("\n") + 1);
      } //Slice end if there's a newline
      if (
        author.substring(0, 3) == "By " ||
        author.substring(0, 3) == "by " ||
        author.substring(0, 3) == "BY "
      ) {
        author = author.slice(3);
      } //Strip "By" from beginning
    }
  }

  //Try to find any div with "author" or "byline" in part of the id or classname
  if (typeof author == "undefined") {
    //Loop all divs and look for a match
    var arrDivs = document.getElementsByTagName("div");
    for (var i = 0; i < arrDivs.length; i++) {
      if (
        arrDivs[i].id.search(/author/i) > -1 ||
        arrDivs[i].className.search(/author/i) > -1 ||
        arrDivs[i].id.search(/byline/i) > -1 ||
        arrDivs[i].className.search(/byline/i) > -1
      ) {
        author = arrDivs[i].innerText.trim();
        if (author.indexOf("\n") > 0) {
          author = author.slice(0, author.indexOf("\n") + 1);
        } //Slice end if there's a newline
        if (
          author.substring(0, 3) == "By " ||
          author.substring(0, 3) == "by " ||
          author.substring(0, 3) == "BY "
        ) {
          author = author.slice(3);
        } //Strip "By" from beginning
        var n = indexOfNthMatch(author, " ", 2); //find 2nd space
        if (n > 0) {
          author = author.slice(0, n).trim();
        } //slice off everything after 2nd space
        break; //exit after first match
      }
    }
  }

  //Try the same thing with spans instead
  if (typeof author == "undefined") {
    //Loop all spans and look for a match
    var arrSpans = document.getElementsByTagName("span");
    for (i = 0; i < arrSpans.length; i++) {
      if (
        arrSpans[i].id.search(/author/i) > -1 ||
        arrSpans[i].className.search(/author/i) > -1 ||
        arrSpans[i].id.search(/byline/i) > -1 ||
        arrSpans[i].className.search(/byline/i) > -1
      ) {
        author = arrSpans[i].innerText.trim();
        if (author.indexOf("\n") > 0) {
          author = author.slice(0, author.indexOf("\n") + 1);
        } //Slice end if there's a newline
        if (
          author.substring(0, 3) == "By " ||
          author.substring(0, 3) == "by " ||
          author.substring(0, 3) == "BY "
        ) {
          author = author.slice(3);
        } //Strip "By" from beginning
        n = indexOfNthMatch(author, " ", 2); //Find 2nd space
        if (n > 0) {
          author = author.slice(0, n).trim();
        } //Slice off everything after 2nd space
        break; //Exit after first match
      }
    }
  }

  //Attempt to manually find byline
  if (typeof author == "undefined") {
    strBodyText = document.body.innerText; //Get all text on page
    if (strBodyText.length > 1000) {
      strBodyText = strBodyText.slice(0, 1000);
    } //Slice off after 1000 words to avoid false matches
    n = strBodyText.search(/\bby \b/i); //Find first occurence of "by "
    if (n > -1) {
      //If match found
      strByLine = strBodyText.slice(n); //Slice off everything before "by"
      if (strByLine.indexOf("\n") != -1) {
        strByLine = strByLine.slice(0, strByLine.indexOf("\n") + 1);
      } //Slice end if there's a newline
      n = indexOfNthMatch(strByLine, " ", 3); //Find 3rd space, 1 more than usual to account for By
      strByLine = strByLine.slice(0, n); //slice off everything after 3rd space
      //if (strByLine.indexOf(".") > -1){ //if Byline contains "." for middle initial
      //	n=indexOfNthMatch(strByLine, ' ', 3); //find 3rd space
      //	strByLine=strByLine.slice(0, n); //slice off end again
      //}
      author = strByLine.slice(3); //slice off "By "
    }
  }


  //Clean up Name if found
  if (typeof author != "undefined") {
    //Strip "By" from beginning if it made it through
    if (
      author.substring(0, 3) == "By " ||
      author.substring(0, 3) == "by " ||
      author.substring(0, 3) == "BY "
    ) {
      author = author.slice(3);
    }
    //Strip "The" and "www." from beginning
    if (
      author.substring(0, 4) == "The " ||
      author.substring(0, 4) == "the " ||
      author.substring(0, 4) == "THE "
    ) {
      author = author.slice(4);
    }
    if (
      author.substring(0, 4) == "www." ||
      author.substring(0, 4) == "Www." ||
      author.substring(0, 4) == "WWW."
    ) {
      author = author.slice(4);
    }
    //Strip .Com from end
    if (author.lastIndexOf(".com") != -1) {
      author = author.slice(0, author.lastIndexOf(".com"));
    }
    if (author.lastIndexOf(".Com") != -1) {
      author = author.slice(0, author.lastIndexOf(".Com"));
    }
    if (author.lastIndexOf(".COM") != -1) {
      author = author.slice(0, author.lastIndexOf(".COM"));
    }

    //Clean up extra byline info
    if (author.indexOf("|") != -1) {
      author = author.slice(0, author.indexOf("|") - 1);
    } //Slice off trailing |
    if (author.indexOf("--") != -1) {
      author = author.slice(0, author.indexOf("--") - 1);
    } //Slice off trailing --
    if (author.indexOf(" - ") != -1) {
      author = author.slice(0, author.indexOf(" - "));
    } //Slice off trailing -
    if (author.indexOf("/") != -1) {
      author = author.slice(0, author.indexOf("/"));
    } //Slice off trailing /
    if (author.indexOf(":") != -1) {
      author = author.slice(0, author.indexOf(":"));
    } //Slice off trailing -

    //Make Name title case
    author = author.replace(/\w*/g, function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    })
    author = author.replace(" And ", " and ");
  }

  return author;
}

/**
 * Utility function - Find nth occurrence of a character in a string
 * @param {string} string string to search in
 * @param {string} char character to find
 * @param {number} nth what occurrence of that character to match
 * @returns {number} index of nth occurrence of char in string
 */
function indexOfNthMatch(string, char, nth) {
  var first_index = string.indexOf(char);
  var length_up_to_first_index = first_index + 1;

  if (nth == 1) {
    return first_index;
  } else {
    var string_after_first_occurrence = string.slice(length_up_to_first_index);
    var next_occurrence = indexOfNthMatch(
      string_after_first_occurrence,
      char,
      nth - 1
    );

    if (next_occurrence === -1) {
      return -1;
    } else {
      return length_up_to_first_index + next_occurrence;
    }
  }
}

//extend string with .toTitleCase() method
Object.assign(String.prototype, {
  toTitleCase() {
    return this.replace(/\w*/g, function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
  },
});


