!(function ($) {

  "use strict"; // jsHint


  /**
   * Application variables
   */
  window.APPLICATION      = {};
  window.APPLICATION.GAME = {};
  var App                 = window.APPLICATION;
  var Game                = window.APPLICATION.GAME;
  var ua                  = navigator.userAgent;

  var d                 = document;


  /**
   * Config
   */
  App.config = {
    debug : true,

    user_agent : {
      iOS             : (ua.match(/(iPad|iPhone|iPod)/g) ? true : false),
      iphone          : (ua.match(/(iPhone|iPod)/g) ? true : false),
      ipad            : (ua.match(/(iPad)/g) ? true : false),
      android         : (ua.match(/(Android)/g) ? true : false),
      mobile          : ((/Mobile|iPhone|iPod|BlackBerry|Windows Phone/i).test(ua || navigator.vendor || window.opera) ? true : false),
      mobile_all      : ((/Mobile|Android|iPhone|iPod|BlackBerry|Windows Phone/i).test(ua || navigator.vendor || window.opera) ? true : false),
      desktop_chrome  : (window.chrome ? true : false),
      iphone_chrome   : ((ua.match(/(iPod|iPhone|iPad)/) && ua.match(/AppleWebKit/) && ua.match('CriOS')) ? true : false),
      iphone_safari   : ((ua.match(/(iPod|iPhone|iPad)/) && ua.match(/AppleWebKit/) && !ua.match('CriOS')) ? true : false),
      android_native  : (ua.indexOf('Android') > -1 && ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') <= -1),
      android_chrome  : (ua.indexOf('Android') > -1 && ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') > -1),
      android_samsung : (ua.indexOf('Android') > -1 && ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') > -1 && ua.indexOf('SCH') > -1)
    }
  }

 

  /** 
   * Application data/vars
   */
  App.data = {
    supports : {}
  };


  /**
   * App Init
   */
  App.run = {

    init : function() {

      // storage
      App.storage.init();

      // plugins
      App.plugins.init();

      // events
      App.events.init();

    }

  };


  /**
   * Elements
   */
  App.elements = {


  };



  /**
   * Plugins
   */
  App.plugins = {

    init : function() {
      
    }

  };



  /**
   * Events
   */
  App.events = {

    init : function() {

      this.clicks();
    },

    clicks : function() {

        
    }

  };






  /**
   * Local Storage
   */
  App.storage = {

    init : function() {

      if ( this.checkSupport() ) {
        App.data.supports.localStorage = true;
      } else {
        App.data.supports.localStorage = false;
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
   * Helpers
   */
  App.helpers = {

    getCurrentURL : function() {
      return location.href;
    },

    getFilename : function(url) {

      var href = url || window.location.href;

      var loc       = window.location || location;
      var filename  = loc.pathname.split("/");
          filename  = filename[filename.length-1];

      return filename;

    },

    getPagename : function(url) {

      var href = url || window.location.href;

      var loc       = window.location || location;
      var filename  = loc.pathname.split("/");
          filename  = filename[filename.length-1];

      var matches   = filename.match(/(.*)\.[^.]+$/);

      if ( matches ) {
        matches = matches[1];
      } else {
        matches = 'index';
      }

      return matches;

    },

    getDomain : function(url) {
      var host    = location.host;
      var matches = host.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      var domain  = matches && matches[1];  // domain will be null if no match is found

      return domain;
    },


    isPage : function(name) {

      var pagename = this.getPagename();

      if ( name == pagename ) {
        return true;
      } else {
        return false;
      }

    },

    isPath : function(pathname, index) {

      if ( index === undefined ) { index = 1; }

      var path = window.location.pathname;

          path = path.split('/');

      return path[index];
      
    }

  };


  




  /**
   * Terrain
   * 
   * 2-dimensional array of values that represents the height of the terrain
   * at any given x, y coordinate.
   *  
   * @param [integer] (detail) a power/exponent
   */
  function Terrain(detail) {
    this.size = Math.pow(2, detail) + 1;
    this.max = this.size - 1;
    this.map = new Float32Array(this.size * this.size);
  }

  /**
   * Terrain.get
   * 
   * Get a value from an x,y input after computing size
   * 
   * @param [integer] (x) x value
   * @param [integer] (y) y value
   */
  Terrain.prototype.get = function(x, y) {
    if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
    return this.map[x + this.size * y];
  };

  /**
   * Terrain.set
   * Set a map array value based on x,y and a given val
   * @param [integer] (x) x value
   * @param [integer] (y) y value
   * @param [integer] (val) a given value
   */
  Terrain.prototype.set = function(x, y, val) {
    this.map[x + this.size * y] = val;
  };

  
  Terrain.prototype.generate = function(roughness) {
    var self = this;

    this.set(0, 0, self.max);
    this.set(this.max, 0, self.max / 2);
    this.set(this.max, this.max, 0);
    this.set(0, this.max, self.max / 2);

    divide(this.max);

    
    function divide(size) {
      var x, y, half = size / 2;
      var scale = roughness * size;
      if (half < 1) return;

      for (y = half; y < self.max; y += size) {
        for (x = half; x < self.max; x += size) {
          square(x, y, half, Math.random() * scale * 2 - scale);
        }
      }
      for (y = 0; y <= self.max; y += half) {
        for (x = (y + half) % size; x <= self.max; x += size) {
          diamond(x, y, half, Math.random() * scale * 2 - scale);
        }
      }
      divide(size / 2);
    }

    function average(values) {
      var valid = values.filter(function(val) { return val !== -1; });
      var total = valid.reduce(function(sum, val) { return sum + val; }, 0);
      return total / valid.length;
    }

    function square(x, y, size, offset) {
      var ave = average([
        self.get(x - size, y - size),   // upper left
        self.get(x + size, y - size),   // upper right
        self.get(x + size, y + size),   // lower right
        self.get(x - size, y + size)    // lower left
      ]);
      self.set(x, y, ave + offset);
    }

    function diamond(x, y, size, offset) {
      var ave = average([
        self.get(x, y - size),      // top
        self.get(x + size, y),      // right
        self.get(x, y + size),      // bottom
        self.get(x - size, y)       // left
      ]);
      self.set(x, y, ave + offset);
    }
  };

  Terrain.prototype.draw = function(ctx, width, height) {
    var self = this;
    var waterVal = this.size * 0.3;

    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        var val = this.get(x, y);
        var top = project(x, y, val);
        var bottom = project(x + 1, y, 0);
        var water = project(x, y, waterVal);
        var style = brightness(x, y, this.get(x + 1, y) - val);

        rect(top, bottom, style);
        rect(water, bottom, 'rgba(50, 150, 200, 0.15)');
      }
    }

    function rect(a, b, style) {
      if (b.y < a.y) return;
      ctx.fillStyle = style;
      ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
    }

    function brightness(x, y, slope) {
      if (y === self.max || x === self.max) return '#000';
      var b = ~~(slope * 50) + 128;
      return ['rgba(', b, ',', b, ',', b, ',1)'].join('');
    }

    function iso(x, y) {
      return {
        x: 0.5 * (self.size + x - y),
        y: 0.5 * (x + y)
      };
    }

    function project(flatX, flatY, flatZ) {
      var point = iso(flatX, flatY);
      var x0 = width * 0.5;
      var y0 = height * 0.2;
      var z = self.size * 0.5 - flatZ + point.y * 0.75;
      var x = (point.x - self.size * 0.5) * 6;
      var y = (self.size - point.y) * 0.005 + 1;

      return {
        x: x0 + x / y,
        y: y0 + z / y
      };
    }
  };

  var display = document.getElementById('display');
  var ctx = display.getContext('2d');
  var width = display.width = window.innerWidth;
  var height = display.height = window.innerHeight;

  var terrain = new Terrain(9);
  terrain.generate(0.95);
  terrain.draw(ctx, width, height);






  /**
   * DOM Ready
   */
  jQuery(document).ready(function($) {

    App.run.init();


    







  });


  /**
   * Window Load
   */
  jQuery(window).ready(function($) {


    

  });


})(jQuery);