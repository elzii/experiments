var App;

!(function ($) {

  "use strict";

  App = window.APPLICATION = {};

  /**
   * Config
   */
  App.config = {

    environment : (window.location.href.match(/(localhost)/g) ? 'development' : 'production' ),
    debug: false
    
  };

  /**
   * Data
   */
  App.data = {

  }
  

  /**
   * Elements
   */
  App.$el = {

    request : $('#request'),
    output  : $('#output')


  };


  /**
   * Init
   */
  App.init = function() {

    App.events();
  

    App.request('http://www.reddit.com/.json', function (data) {
      
      var posts = data.data.children;

      posts.forEach(function (post, i) {
        
        App.$el.output.append('<h5>' + post.data.title + '</h5>');

      })
    })

  };



  App.events = function() {



  }




  App.request = function(url, callback) {
    
    fetch(url)
      .then(function(response) {
        // return response.json()
        // 
        var json    = JSON.parse(response.body)
            status  = response.status

        callback(json, status);

      }).catch(function(ex) {
        
        callback(ex);

        // console.log('parsing failed', ex)
      })
  }




  /**
   * Storage
   */
   App.storage = {
       set: function (key, value) {
           window.localStorage.setItem( key, JSON.stringify(value) );
       },
       get: function (key) {
           try {
               return JSON.parse( window.localStorage.getItem(key) );
           } catch (e) {
               return null;
           }
       }
   };



  /**
   * DOM Ready
   */
  $(document).ready(function() {
    App.init();
  })



})(jQuery);