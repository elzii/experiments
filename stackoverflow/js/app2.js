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
      environment : (window.location.href.match(/(localhost)/g) ? 'development' : 'production' ),
      debug : true
    },

    // Data
    data : {
      temp : null,
      binds : {}
    },

    // Supports
    supports : {

    },

    // Elements
    $el : {
      body : $('body'),
    }

  };



  /**
   * Init
   */
  app.init = function () {
    
    app.events()
    app.storage.init() 
  }

  /**
   * Events
   */
  app.events = function () {
    
  }

  /**
   * Storage
   *
   * init
   * checkSupport
   * set
   * get
   * getall
   * hasData
   */
  app.storage = {

    init : function() {

      if ( this.checkSupport() ) {
        app.supports.localStorage = true;
        if ( app.config.debug ) console.log('Supports localStorage')
      } else {
        app.supports.localStorage = false;
      }

    },

    checkSupport : function() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (e) {
        return false;
      }
    },


    set : function(key, value) {

      if ( typeof value === 'object' ) {
        value = JSON.stringify(value);

      }

      localStorage.setItem(key, value);
    },

    get : function(key) {
      var data;

      if ( !this.hasData(key) ) {
        return false;
      }

      data = localStorage[key];

      // if json, try to parse
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }

    },

    getAll : function() {

      var archive = {},
          keys    = Object.keys(localStorage);

      for (var i=0; i < keys.length; i++) {
         archive[ keys[i] ] = localStorage.getItem( keys[i] );
      }

      return archive;
    },

    hasData : function(key) {
      return !!localStorage[key] && !!localStorage[key].length;
    }

  }



  /**
   * Private Methods
   */
  function privateMethod() {
    // ...
  }

  return app;
}());