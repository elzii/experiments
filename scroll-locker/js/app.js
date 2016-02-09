var APP = (function () {

  var app = {}


  /**
   * Module Properties
   *
   * config
   * data
   * $el
   * 
   */
  app = {

    // Config
    config : {
      environment : window.location.href.match(/(localhost)/g) ? 'development' : 'production',
      debug : window.location.href.match(/(localhost)/g) ? true : false,
      debug_plugins : window.location.href.match(/(localhost)/g) ? true : false,
      debug_console: false
    },


    // Elements
    $el : {
      body : $('body'),

      alert: $('#alert'),

      message: $('#message')
      
    },


  };



  /**
   * Init
   */
  app.init = function () {
    
    // disable scrolling on page load
    app.scrolling.disable()

    // enable it after 3 seconds
    // just a demo method, on CCS enable it after pageloader finishes in callback
    setTimeout(function() {
      app.scrolling.enable()
    }, 3000)

    var start = 2;

    var timer = setInterval(function() {
      if ( start==0 ) {
        clearInterval(timer)
        app.$el.alert
          .removeClass('alert-danger')
          .addClass('alert-success')
        app.$el.message.html('Scrolling enabled')
      }

      app.$el.message.find('span').text(start)
      start--;

    }, 1000)



  }


  

  /**
   * Scrolling
   *
   * enable
   * disable
   */
  app.scrolling = {

    enable: function() {
      console.log('Scrolling enabled.')

      if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
      }
      window.onmousewheel = document.onmousewheel = null; 
      window.onwheel = null; 
      window.ontouchmove = null;  
      document.onkeydown = null; 
    },
    
    disable: function() {

      console.log('Scrolling disabled.')

      if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', preventDefault, false);
      }
      window.onwheel      = preventDefault;                         // modern standard
      window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove  = preventDefault;                         // mobile
      document.onkeydown  = preventDefaultForScrollKeys;
    },

  }



  /**
   * Prevent Default 
   * @param  {Object} event
   */
  preventDefault = function(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;  
  }

  /**
   * Prevent Default For Scroll Keys
   * @param  {Object} event 
   * @return {Boolean}
   */
  preventDefaultForScrollKeys = function(event) {
    
    var keys = {
      37: 1,  // left
      38: 1,  // up
      39: 1,  // right
      40: 1,  // down
      32: 1,  // spacebar
      33: 1,  // pageup
      34: 1,  // pagedown
      35: 1,  // end
      36: 1,  // home
    }

    if ( keys[event.keyCode] ) {
      preventDefault(event);
      return false;
    }
  }






  /**
   * DOCUMENT READY
   * -------------------------------------------------------------------
   *
   */
  document.addEventListener('DOMContentLoaded', function (event) {

    app.init()

  })



  return app;
}());