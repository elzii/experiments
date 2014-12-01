var App;

!(function ($) {

  "use strict";

  App = window.APPLICATION = {};

  /**
   * Config
   */
  App.config = {

    environment : (window.location.href.match(/(localhost)/g) ? 'development' : 'production' ),
    
    api : window.location.protocol + '//' + window.location.host + '/admin/api/',

    debug: true
    
  };



  /**
   * Data
   */
  App.data = {

    temp : {},
    audio : {}

  }
  

  /**
   * Elements
   */
  App.$el = {

    wrap    : $('#wrap'),


  };


  /**
   * Init
   */
  App.init = function() {

    // Main
    App.events();
    App.highlightToTweet();
  
  
  };



  /**
   * Highlight To Tweet
   * 
   */
  App.highlightToTweet = function() {

    var coords = [];

    // Make body relatively positioned
    document.body.style.position = 'relative';

    // Create elements
    var shareText = document.createElement('strong')
        shareText.innerHTML = 'Share your selection with your interweb friends';

    var shareButton = document.createElement('a')
        shareButton.setAttribute('id', 'highlight-tweet-btn')

    // Event listener
    window.addEventListener('mouseup', function (event) {

      console.log('event', event)
      
      var selection  = (document.all) ? document.selection.createRange().text : document.getSelection();
      var text       = selection.toString();
      var parentNode = selection.anchorNode.parentNode;


      // Debug
      console.log('selection', selection)
      console.log('text', text)

      if ( event.target.offsetParent !== null && event.target.offsetParent.id == 'highlight-tweet' ) {
        var buttonClick = true;
      }
      if ( event.target.offsetParent == null ) {
        var buttonClick = false;
      }

      // Remove any existing tweet dialog 
      if ( event.target.id !== 'highlight-tweet' && !buttonClick ) {
        if ( document.querySelectorAll('#highlight-tweet').length > 0 ) {

          console.log('tweetDialog already on the page, removing')

          var el = document.getElementById('highlight-tweet')
              el.parentNode.removeChild(el)

        }
      }

      if ( event.target.offsetParent !== null && event.target.offsetParent.id !== 'highlight-tweet' ) {

        // Make sure we have something selected
        if ( selection.type == 'Range' && text.length > 0 ) {

          // Create new tweet dialog and append it to parent node
          var tweetDialog = document.createElement('div');
              tweetDialog.setAttribute('id', 'highlight-tweet')

              tweetDialog.style.left = ( event.x + 10 ) + 'px'; 
              tweetDialog.style.top = ( event.y + 10 ) + 'px';

              tweetDialog.appendChild(shareText)

              shareButton.innerHTML = 'Tweet (' + text.length + ')';
              shareButton.setAttribute('href', 'javascript:App.sharePop("https://twitter.com/intent/tweet?url='+window.location.href+'&text='+text+'");');
              tweetDialog.appendChild(shareButton)

          document.body.appendChild(tweetDialog)
        
        }

      }

      
      


    })


   
  }






  /**
   * Events
   * 
   */
  App.events = function() {



  }



  App.sharePop = function(url) { 
    window.open( url, "myWindow", "status = 1, height = 500, width = 500, resizable = 0"); 
  }



  /**
   * DOM Ready
   */
  $(document).ready(function() {

    App.init();

  })





})(jQuery);

