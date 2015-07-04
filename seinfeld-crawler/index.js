var osmosis = require('osmosis')

var config = {
  url : 'http://putlocker.is/watch-seinfeld-tvshow-online-free-putlocker.html'
}


osmosis
  // Get the URL
  .get( config.url) 
  // Find the anchor element that links to each episode page
  .find('div.content-box h2 + table')
  .data(function (season) {

    console.log( this.find('a'), season.find('a'))
    // console.log( this, season )

  })
  







// osmosis
//   // Get the URL
//   .get( config.url) 
//   // Find the anchor element that links to each episode page
//   .find('div.content-box h2 + table a')
//   .set('location')
//   .follow('@href')
//   .find('header + div + div li > a')
//   .set('category')
//   .follow('@href')
//   .find('p > a', '.totallink + a.button.next:first')
//   .follow('@href')
//   .set({
//       'title':        'section > h2',
//       'description':  '#postingbody',
//       'subcategory':  'div.breadbox > span[4]',
//       'date':         'time@datetime',
//       'latitude':     '#map@data-latitude',
//       'longitude':    '#map@data-longitude',
//       'images[]':     'img@src'
//   })
//   .data(function(listing) {
//       // do something with listing data
//   }) 