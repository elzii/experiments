var TUMBLR = (function () {

  var tumblr = {}


  /**
   * Module Properties
   *
   * config
   * data
   * $el
   * 
   */
  tumblr = {

    // Config
    config : {
      environment : window.location.href.match(/(localhost)/g) ? 'development' : 'production',
      debug : window.location.href.match(/(localhost)/g) ? true : false,
      debug_plugins : window.location.href.match(/(localhost)/g) ? true : false,
      debug_console: false
    },


    // Elements
    $el : {
      

    },

    url : {
      oauth : {
        request_token : 'http://www.tumblr.com/oauth/request_token',
        access_token : 'http://www.tumblr.com/oauth/access_token',
        authorize : 'http://www.tumblr.com/oauth/authorize',
      }
    }


  };



  /**
   * Init
   */
  tumblr.init = function () {
    
    

  }


  








  /**
   * DOCUMENT READY
   * -------------------------------------------------------------------
   *
   */
  document.addEventListener('DOMContentLoaded', function (event) {

  })


  tumblr.init()

  return tumblr;
}());