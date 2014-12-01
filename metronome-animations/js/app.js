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
    App.metronome();
  
  
  };



  /**
   * Events
   * 
   */
  App.events = function() {



  }





  /**
   * Metronome
   *
   * @documentation 
   */
  App.metronome = function() {

    var path = fetchPreparedSVGPath();
    var length = path.getTotalLength();

    path.style.strokeDasharray = length + ' ' + length;
    path.style.strokeDashoffset = length;

    // frame based animation
    Metronome({
      type: 'frame',
      frames: 120,
      easing: 'easeInOutQuad',
      draw: function(handle, progress) {
        path.style.strokeDashoffset = Math.floor(length * (1 - progress));
      },
      complete: function() {
        alert('Jerbs done');
      }
    });

    // duration based animation
    Metronome({
      type: 'duration',
      duration: 3000,
      easing: 'easeInOutQuad',
      draw: function(handle, progress) {
        path.style.strokeDashoffset = Math.floor(length * (1 - progress));
      },
      complete: function() {
        alert('Jerbs done');
      }
    });

  }




  /**
   * DOM Ready
   */
  $(document).ready(function() {

    App.init();

  })




})(jQuery);

