const makeRequest = require('request-promise');
const cheerio = require('cheerio');
const translate = require('google-translate-api');
const URL = `https://news.ycombinator.com/`;

const lang = process.argv[2] || 'nl';

const options = {
  uri: URL,
  transform: (body) => {
    return cheerio.load(body);
  }
};

makeRequest(options)
  .then(($) => {
    // the code will look very much
    // like jQuery code
    $('.storylink').each( (i, element) => {
      // console.log(element);
      // re-cheerio the thing!
      let theText = $(element).text();
      translate(theText, {from: 'en', to: lang})
        .then((res) => {
          console.log(res.text);
        })
        .catch((err) => {
          console.log(err);
        })
    });
  })
  .catch((err) => {
    console.log(err);
  });