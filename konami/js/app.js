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
    App.walkway();
  
  
  };



  /**
   * Events
   * 
   */
  App.events = function() {



  }





  /**
   * Walkway
   *
   * @documentation https://github.com/ConnorAtherton/walkway
   */
  App.walkway = function() {

 

    // Overwriting defaults
    var svg = new Walkway({
      selector: '#svg_emblem',
      duration: '2000',
      // can pass in a function or a string like 'easeOutQuint'
      easing: function (t) {
        return t * t;
      }
    });

    
    var paths = svg.paths;

    svg.draw(function () {
      console.log('Animation complete');


    });
    


  }




  /**
   * DOM Ready
   */
  $(document).ready(function() {

    App.init();

  })




})(jQuery);

