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

      
    },


  };



  /**
   * Init
   */
  app.init = function () {
    
    this.timeline.init()

  }



  app.timeline = {

    json: 'data/timeline.json',

    init: function() {

      createStoryJS({
        type:       'timeline',
        width:      '100%',
        height:     '100%',
        source:     this.json,
        embed_id:   'timeline',
        start_zoom_adjust: '3'
      })

    },


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