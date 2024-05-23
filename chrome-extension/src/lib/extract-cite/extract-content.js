import { Readability } from './readability';

export function getCardData(document) {

  let article = new Readability(document, {  }).parse();

  let articleNode = document.createElement('div');
  articleNode.innerHTML = article.content;

  let title = article.title;
  let authorString = article.byline;
  // split author into seperate authors
  // split by and, &, and ,
 


}

