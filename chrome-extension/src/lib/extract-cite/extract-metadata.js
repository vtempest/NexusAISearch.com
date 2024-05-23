// meta data extraction

export default (doc) => {
  const entry = {
    title: "",
    author: "",
    source: "",
    date: "",
  };

  const attributeLists = {
    source: ["application-name", "og:site_name", "twitter:site", "dc.title"],
    title: ["title", "og:title", "twitter:title", "parsely-title"],
    author: [
      "author",
      "creator",
      "og:creator",
      "article:author",
      "twitter:creator",
      "dc.creator",
      "parsely-author",
    ],
    date: [
      "article:published_time",
      "article:modified_time",
      "og:updated_time",
      "dc.date",
      "dc.date.issued",
      "dc.date.created",
      "dc:created",
      "dcterms.date",
      "datepublished",
      "datemodified",
      "updated_time",
      "modified_time",
      "published_time",
      "release_date",
      "date",
      "parsely-pub-date",
      'article:published',
      'article:published_time',
      'og:pubdate',
      'pubdate',
      'date',
      'dateCreated',
      'pdate',
      'sailthru.date',
      'dcterms.created',
    ],
  };

  //parse meta tags for property or name
  Array.from(doc.getElementsByTagName("meta")).forEach((node) => {
    const content = node.getAttribute("content");
    if (!content) return null;

    const property =
      node.getAttribute("property")?.toLowerCase() ??
      node.getAttribute("itemprop")?.toLowerCase();

    const name = node.getAttribute("name")?.toLowerCase();

    for (const [key, attrs] of Object.entries(attributeLists)) {
      if (attrs.includes(property) || attrs.includes(name)) {
        result = { key, content };
      }
    }
    if (result) {
      entry[result.key] = result.content;
    }
  });

  return entries;
};
