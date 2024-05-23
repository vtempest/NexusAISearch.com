/**
 * Extract cite info from document using meta tags and common class names
 * adapted from  Cite Creator Chrome Extension 2016 (GPL 3.0)
 * https://chromewebstore.google.com/detail/cite-creator/jampigcbgngjedogaoglhpeckidccodi
 *
 * @param {document} document document or dom object with article content
 * @returns {object} date
 */

export default function extractDate(document) {

  var arrDates = [], date, strBodyText;

  //If anything found, assign it to Date
    strBodyText = document.body.innerText; //get all text on page
    if (strBodyText.length > 1500) {
      strBodyText = strBodyText.slice(0, 1500);
    } //slice off after 1500 words to avoid false matches and make search faster

    date = strBodyText.match(/\b\d{1,2}\/\d{1,2}\/(\d{2}|\d{4})\b/); //Match m/d/yy to mm/dd/yyyy
    if (date == null) {
      date = strBodyText.match(
        /\b(1[0-2]|0?[1-9])-(3[01]|[12][0-9]|0?[1-9])-(?:[0-9]{2})?[0-9]{2}\b/
      );
    } //same with -
    if (date == null) {
      date = strBodyText.match(
        /\b(1[0-2]|0?[1-9])\.(3[01]|[12][0-9]|0?[1-9])\.(?:[0-9]{2})?[0-9]{2}\b/
      );
    } //same with .
    if (date == null) {
      date = strBodyText.match(
        /\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/
      );
    } //match full month name
    if (date == null) {
      date = strBodyText.match(
        /\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\ (0?[1-9]|([12]\d)|30)(st|nd|rd|th))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))(st|nd|rd|th)))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/
      );
    } //match day with st/th/etc
    if (date == null) {
      date = strBodyText.match(
        /\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)(.)?\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)(.)?\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?(.)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/
      );
    } //match month with period
    if (date == null) {
      date = strBodyText.match(
        /\b((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\ (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])\ (Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\b|t)t?|Nov|Dec)(ember)?)\ ((1[6-9]|[2-9]\d)\d{2})\b/
      );
    } //match dd MMMM yyyy - works to find date but parser sometimes mixes up date/month
    if (date == null) {
      date = strBodyText.match(
        /\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/
      );
    } //match MMMM dd, yyyy
    if (date == null) {
      date = strBodyText.match(
        /\b(?:(((JAN(UARY)?|MA(R(CH)?|Y)|JUL(Y)?|AUG(UST)?|OCT(OBER)?|DEC(EMBER)?)\ 31)|((JAN(UARY)?|MA(R(CH)?|Y)|APR(IL)?|JU((LY?)|(NE?))|AUG(UST)?|OCT(OBER)?|(SEPT|NOV|DEC)(EMBER)?)\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/
      );
    } //same with caps
    if (date == null) {
      date = strBodyText.match(
        /\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\ ((1[6-9]|[2-9]\d)\d{2}))\b/
      );
    } //match MMMM dd yyyy
    if (date == null) {
      date = strBodyText.match(
        /\b(?:(((JAN(UARY)?|MA(R(CH)?|Y)|JUL(Y)?|AUG(UST)?|OCT(OBER)?|DEC(EMBER)?)\ 31)|((JAN(UARY)?|MA(R(CH)?|Y)|APR(IL)?|JU((LY?)|(NE?))|AUG(UST)?|OCT(OBER)?|(SEPT|NOV|DEC)(EMBER)?)\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\ ((1[6-9]|[2-9]\d)\d{2}))\b/
      );
    } //same with caps
    if (date == null) {
      date = strBodyText.match(
        /\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\.\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\.\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\.\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\ ((1[6-9]|[2-9]\d)\d{2}))\b/
      );
    } //match MMMM. dd yyyy
    if (date == null) {
      date = strBodyText.match(
        /\b(?:(((JAN(UARY)?|MA(R(CH)?|Y)|JUL(Y)?|AUG(UST)?|OCT(OBER)?|DEC(EMBER)?)\.\ 31)|((JAN(UARY)?|MA(R(CH)?|Y)|APR(IL)?|JU((LY?)|(NE?))|AUG(UST)?|OCT(OBER)?|(SEPT|NOV|DEC)(EMBER)?)\.\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\.\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\ ((1[6-9]|[2-9]\d)\d{2}))\b/
      );
    } //same with caps
    if (date == null) {
      date = strBodyText.match(
        /\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\.\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\.\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\.\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/
      );
    } //match MMMM. dd, yyyy
    if (date == null) {
      date = strBodyText.match(
        /\b(?:(((JAN(UARY)?|MA(R(CH)?|Y)|JUL(Y)?|AUG(UST)?|OCT(OBER)?|DEC(EMBER)?)\.\ 31)|((JAN(UARY)?|MA(R(CH)?|Y)|APR(IL)?|JU((LY?)|(NE?))|AUG(UST)?|OCT(OBER)?|(SEPT|NOV|DEC)(EMBER)?)\.\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\.\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/
      );
    } //same with caps

    if (date != null) {
      date = date[0];
    } //Select only first match from regex result array



  // scan common tags for Updated or Published text
  if (date != null) {
    let possibleDateTags = ["time", "span", "div", "p", "*"];
    for (let tag of possibleDateTags) {
      for (let el of document.getElementsByTagName(tag)) {
        if (el.textContent.includes("Published")) {
          date = el.textContent.split("Published")[1].trim();
          if (date) return date;
        } else if (el.textContent.includes("Updated")) {
          date = el.textContent.split("Updated")[1].trim();
          if (date) return date;
        } else if (el.textContent.includes("Posted")) {
          date = el.textContent.split("Posted")[1].trim();
          if (date) return date;
        }
      }
    }
  }

  //Convert date with parser
  if (date != null && typeof date != "undefined") {
    //Clean up date if it has a combined date/time code that breaks parser
    if (
      date.length > 10 &&
      date.indexOf(" ") == -1 &&
      date.indexOf("T") == 10
    ) {
      date = date.slice(0, 10);
    }
  }

  date = !!Date.parse(date)  && new Date(date)?.toISOString()?.split("T")[0];

  return date;
}
