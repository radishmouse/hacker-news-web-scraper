const makeRequest = require('request-promise');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'https://www.reddit.com/';

function processDataFromServer(respData) {
  // console.log(respData);
  // I could dump all this to a file.
  let $ = cheerio.load(respData);

  $('img').each((i, element) => {
    var imageURL = $(element).attr('src');
    if (imageURL) {
      if (!imageURL.startsWith('https')) {
        imageURL = 'https:' + imageURL;
      }
      // #1 download the image
      console.log(`requesting...${imageURL}`);

      request(imageURL, {encoding: 'binary'}, saveImage);
        // .then(downloadImage)
        // .catch(thatErrorTho)
    }
  });
}

function saveImage(error, response, imageData) {
  if (error) {
    thatErrorTho(error);
    return;
  }

  // console.log(imageData);
  console.log('downloading...image...');
  let imageName = 'downloadedImages/' + (new Date()).getTime() + '.jpg';

  fs.writeFile(imageName, imageData, 'binary', thatErrorTho);
}

function thatErrorTho(err) {
  console.log(err);
}

makeRequest(URL)
  .then(processDataFromServer)
  .catch(thatErrorTho)





// let someHTML = `
//   <h1>
//     hey what is up?
//   </h1>
//   <img src="oakley.jpg">
// `;

// let $ = cheerio.load(someHTML);

// let theText = $('img').attr('src');
// console.log(theText);











