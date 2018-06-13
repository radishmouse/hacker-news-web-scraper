const rp = require('request-promise');
const cheerio = require('cheerio');
const sentiment = require('node-sentiment');
const URL = `https://news.ycombinator.com/`;

// const options = {
//   uri: URL,
//   transform: (body) => {
//     return cheerio.load(body);
//   }
// };

const cheerioFy = (theURL) => {
  return {
    uri: theURL,
    transform: (body) => {
      return cheerio.load(body);
    }
  }
}


const processComments = (theURL) => {
  // console.log(`processing ${theURL}`);
  rp(cheerioFy(theURL))
    .then(($) => {
    // .then((resp) => {
      // console.log(resp);
      let allText = $('.comment span > *').map((i, e) => {
        // console.log($(e).text());
        // return $(e).text();
        let theText = $(e).text().trim();
        if (theText !== 'reply') {
          return theText;
        } else {
          return '';
        }
      });
      // console.log('yep');

      // console.log(allText.get().join(' '));
      return allText.get().join(' ');
    })
    .then((commentsText) => {
      let {vote, score} = sentiment(commentsText);

      console.log(`Done processing ${theURL}:`);
      console.log(`${vote}: ${score}`);
      console.log(`---------------------`);
    })
    .catch((err) => {
      // console.log('nope');
      // console.log(err.message);
      // console.log(err);
    })
}

rp(cheerioFy(URL))
  .then(($) => {
    // the code will look very much
    // like jQuery code
    let visited = new Set([]);
    $('.subtext :last-child').each( (i, element) => {
      // console.log(element);
      // re-cheerio the thing!
      let href = $(element).attr('href');
      if (href) {
        if (!visited.has(href)) {
          visited.add(href);
          setTimeout(() => {
            processComments(URL + href);
          }, 1000 * i)
        }
        // console.log(URL + href);
      }
    });
  })
  .catch((err) => {
    // console.log(err);
  });
