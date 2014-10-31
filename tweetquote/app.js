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
    App.tweetQuote();
  
  
  };



  /**
   * Events
   * 
   */
  App.events = function() {



  }



  /**
   * Tweet Quote
   */
  App.tweetQuote = function() {

    var $tweet_quotes = $('.tweet-quote');

    if ( $tweet_quotes.length < 0 ) { return; }

    $tweet_quotes.click(function() {

      var $this   = $(this),
          account = $this.data('twitter-account'),
          text    = $this.text()

      var share_url = 'https://twitter.com/intent/tweet?url='+window.location.href+'&text='+text;

      window.open( share_url, "socialShareWindow", "status = 1, height = 500, width = 650, resizable = 0" );

    })
  }


  /**
   * DOM Ready
   */
  $(document).ready(function() {

    App.init();

  })




})(jQuery);

