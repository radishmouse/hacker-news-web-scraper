const makeRequest = require('request-promise');
const cheerio = require('cheerio');
const sentiment = require('node-sentiment');

// The URL for the hacker news site.
const URL = `https://news.ycombinator.com/`;

// How long to wait between each request.
// Otherwise, they know we're scraping.
const DELAY = 700;


// =================================================
// withCheerio
// =================================================
// a function that, given a URL,
// returns an object that you can pass
// to makeRequest (request-promise)
// so that the data from the server
// is processed through cheerio.
const withCheerio = (theURL) => {
  return {
    uri: theURL,
    transform: (body) => {
      return cheerio.load(body);
    }
  };
}

// =================================================
// processComments
// =================================================
// a function that, given a URL for a
// news.ycombinator.com comments page,
// gets all the text for the comments,
// and runs it through sentiment analysis
const processComments = (theURL) => {
  makeRequest(withCheerio(theURL))
    .then(($) => {
      // Use cheerio to grab the title of the story
      let title = $('.storylink').text();

      // Use cheerio to find all the text from the comments
      // and put them in an array (using .map)
      let allText = $('.comment span > *').map((i, e) => {

        // TODO: update the selector used above so that
        // we don't manually have to clean up the
        // "reply" link that appears at the end of
        // ever comment.
        let theText = $(e).text().trim();
        if (theText !== 'reply') {
          return theText;
        } else {
          return '';
        }
      });

      // We need to pass *both* the title
      // and the comments text to the next
      // link in the .then chain.
      // So, we wrap it up in an object.
      return {
        title, // <-- this is the fancy shorthand
               // for title: title
        commentsText: allText.get().join(' ')
        // .get() needs to be used to grab
        // the actual array.
      }
    })
    .then(({title, commentsText}) => {
      // Use object destructuring to pull out
      // the title and commentsText from the
      // object that got passed in from the
      // previous link in the .then chain.

      // Use object destructuring to pull out the
      // "vote" and "score" from the resulting
      // sentiment analysis.
      let {vote, score} = sentiment(commentsText);

      // This is my goofy attempt at nicely printing
      // the results.
      console.log(`${title}:`);
      console.log(`${vote}: ${score}`);
      console.log(`---------------------`);
    })
    .catch((err) => {
      console.log(err.message);
    })
}

// =================================================
// This kicks off the initial HTTP request
// =================================================
makeRequest(withCheerio(URL))
  .then(($) => {
    // ^^ knowing that our code will look basically
    // like jQuery, we're using the argument name `$`

    // A `Set` is designed to hold unique values.
    // That means, there can never be duplicates.
    // We'll use one to keep track of URLs that we've
    // visited so we don't visit the same one twice.
    let visited = new Set([]);

    // Select the story link
    $('.subtext :last-child').each( (i, element) => {

      // Grab its href value
      let href = $(element).attr('href');

      // If we actually have an href value...
      if (href) {
        // and we haven't already visited it...
        if (!visited.has(href)) {

          // add it to the set of visited links...
          visited.add(href);

          // and schedule it to be processed.
          setTimeout(() => {
            // The href needs to be concatenated with
            // the main URL.
            processComments(URL + href);
          }, DELAY * i)
        }
      }
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
