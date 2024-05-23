

export function extractTitle(document) {
  var title, arrTitles;

  if (typeof title == "undefined") {
    arrTitles = document.getElementsByName("og:title"); //Try og:title
    if (arrTitles.length <= 0) {
      arrTitles = document.getElementsByName("DC.title");
    } //Try DC.title
    if (arrTitles.length <= 0) {
      arrTitles = document.getElementsByName("headline");
    } //Try headline
    if (arrTitles.length <= 0) {
      //If no name tags, loop meta tags instead
      var arrMeta = document.getElementsByTagName("meta");
      for (i = 0; i < arrMeta.length; i++) {
        if (arrMeta[i].getAttribute("property") == "og:title") {
          title = arrMeta[i].content;
        } //Find og:title in property attributes
      }
    }

    //If anything found, assign it to Title
    if (typeof arrTitle != "undefined") {
      title = arrTitles[0].content;
    }

    //Worst case, use html title
    if (typeof title == "undefined") {
      title = document.title;
    }

    //Slice off | and -
    if (typeof title != "undefined") {
      if (title.indexOf("|") != -1) {
        title = title.slice(0, title.indexOf("|") - 1);
      } //Slice off trailing |
      if (title.indexOf("--") != -1) {
        title = title.slice(0, title.indexOf("--") - 1);
      } //Slice off trailing --
      if (title.indexOf(" - ") != -1) {
        title = title.slice(0, title.indexOf(" - "));
      } //Slice off trailing -
    }
  }

  return title;
}
