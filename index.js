// let Parser = require('rss-parser')
// let parser = new Parser({
//   customFields: {
//     item: ['address'],
//   },

// })
// const cheerio = require('cheerio')
// let fs = require('fs')
// let express = require('express')
// let path = require('path')

// let app = express()

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'items.json'))
// })

// app.listen(3000)

// async function scrap() {
//   try {
//     // const url = 'https://www.algerimmo.com/rss/?category=&type=0&location='
    
//     const url = 'http://www.annonce-algerie.com/upload/flux/rss_1.xml'

//     var parser = require('rssparser');
//     var options = {};
//     //rss feeds
//     parser.parseURL(url, options, function(err, out){
//         console.log({out});
//     });

//     // const url = 'https://changelog.com/podcast/feed'
//     // let feed = await parser.parseURL('https://www.algerimmo.com/rss/?category=&type=0&location=');
//   //   let feed = await parser.parseURL(url);
    
//   //   const items = feed.items.map(
//   //     (element) => {
//   //       const {link, content, isoDate: publishDate, title,contentSnippet: description, address, guid } = element
//   //       const $ = cheerio.load(content)
//   //       const image = $('img').attr('src')
//   //       return {
//   //         image,
//   //         title,
//   //         publishDate,
//   //         description,
//   //         link, 
//   //         address,
//   //         guid
//   //       }
//   //     }
//   //   )
//   //   delete feed.items
//   //   fs.writeFile("./items.json", JSON.stringify({
//   //     ...feed,
//   //     items
//   //   }, null, 2), (err) => {
//   //     if (err) throw err
//   //   })
//   } catch (error) {
//     console.error(error)
//   }
// }

// scrap()




var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed
 
var req = request('https://www.algerimmo.com/rss/?category=&type=0&location=')
var feedparser = new FeedParser([]);
 
req.on('error', function (error) {
  // handle any request errors
});
 
req.on('response', function (res) {
  var stream = this; // `this` is `req`, which is a stream
 
  if (res.statusCode !== 200) {
    this.emit('error', new Error('Bad status code'));
  }
  else {
    stream.pipe(feedparser);
  }
});
 
feedparser.on('error', function (error) {
  // always handle errors
});
 
feedparser.on('readable', function () {
  // This is where the action is!
  var stream = this; // `this` is `feedparser`, which is a stream
  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
  var item;
 
  while (item = stream.read()) {
    console.log({item});
  }
});