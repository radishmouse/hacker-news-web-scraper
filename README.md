# Image Scraper

This program downloads the thumbnail images displayed on the home page of reddit.com.

## Setup

Make sure to install the node modules
and create a `downloadedImages` directory.

```sh
npm install
mkdir downloadedImages
```

## The high level

Using the `request-promise` and `request` modules, this program grabs the HTML text from the home page of reddit.com

That text is passed to the `processDataFromServer` function, which uses the `cheerio` module to parse the HTML text.

When `cheerio` parses HTML, it returns a function. That function is designed to be used like jQuery. This means you can pass it selector strings to find elements, and you also have access to jQuery-like methods (such as `.text` and `.attr`).

Because you use it just like jQuery, it's useful to name this variable `$`.

We then use the `cheerio`'d version of the document to grab all of the `img` tags and iterate through them (using `.each`).

As `.each` visits each `img` element, it will pass that element to our callback function.

Inside our callback function, we re-wrap the `element` with `cheerio` (by passing it to the `$` function). Once it has been wrapped with `cheerio`, then we can access the `.attr` function to get the `src` attribute of the image.

We save the value of the `src` attribute to a variable, check to see if it's got a "real" value, add `'https:'` to the beginning (if it needs it).

This gives us a URL for the image.

Then, we use the `request` module to get the data from that image URL (specifying that the data coming back is going to be binary). When the network data comes back, the data will be processed by the `saveImage` function.

`saveImage` then generates a unique file name (based on the current time stamp) and writes the image data to a file.

