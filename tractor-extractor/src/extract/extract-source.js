


export  default function extractSource(document) {
  var source, arrSources;

  //Find Publication
  if (typeof source == "undefined") {
    arrSources = document.getElementsByClassName("og:site_name"); //Try og:site_name
    if (arrSources.length <= 0) {
      arrSources = document.getElementsByClassName("cre");
    } //Try cre
    if (arrSources.length <= 0) {
      //If no name tags, loop meta tags instead
      var arrMeta = document.getElementsByTagName("meta");

      for (var i = 0; i < arrMeta.length; i++) {
        if (arrMeta[i].getAttribute("property") == "og:site_name") {
          source = arrMeta[i].content;
        } //Find og:site_name in property attributes
      }
    }
    //If anything found, assign it to Publication
    if (arrSources.length > 0) {
      source = arrSources[0].content;
    }

    //Clean up publication name
    if (typeof source != "undefined") {
      //Strip "The" and "www." from beginning
     
      if (
        source.substring(0, 4) == "www." ||
        source.substring(0, 4) == "WWW."
      ) {
        source = source.slice(4);
      }

      //Strip .Com from end
      if (source.lastIndexOf(".com") != -1)
        source = source.slice(0, source.lastIndexOf(".com"));
      if (source.lastIndexOf(".COM") != -1)
        source = source.slice(0, source.lastIndexOf(".COM"));
      //Trim string
      source = source.trim();
    } else {
    }
  }

  return source;
}

