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
   * Google Maps API
   * ---------------------------------------
   * Simple API Access:
   * API Key: AIzaSyDDLaUui2j9ktbvnMNWU6gIh9PnnFQrczc
   * http://jsfiddle.net/Blunk/x8dSP/8/light/
   */


  App.geonote = {


    elements : {
      test : null
    },


    init: function() {

      this.map();
    },



    map: function() {

      navigator.geolocation.getCurrentPosition(function (position) {
        // Get the positioning coordinates.
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var map;

        // Do something interesting...
        console.log(lat,lon);

        $('#geolocate').html(lat + ', ' + lon);

        var centerPosition = new google.maps.LatLng(lat, lon);

        var style = [  
        {  
          "stylers":[  
            {  
              "visibility":"on"
            }
          ]
        },
        {  
          "featureType":"road",
          "stylers":[  
            {  
              "visibility":"on"
            },
            {  
              "color":"#ffffff"
            }
          ]
        },
        {  
          "featureType":"road.arterial",
          "stylers":[  
            {  
              "visibility":"on"
            },
            {  
              "color":"#fee379"
            }
          ]
        },
        {  
          "featureType":"road.highway",
          "stylers":[  
            {  
              "visibility":"on"
            },
            {  
              "color":"#fee379"
            }
          ]
        },
        {  
          "featureType":"landscape",
          "stylers":[  
            {  
              "visibility":"on"
            },
            {  
              "color":"#f3f4f4"
            }
          ]
        },
        {  
          "featureType":"water",
          "stylers":[  
            {  
              "visibility":"on"
            },
            {  
              "color":"#7fc8ed"
            }
          ]
        },
        {  
          "featureType":"road",
          "elementType":"labels",
          "stylers":[  
            {  
              "visibility":"off"
            }
          ]
        },
        {  
          "featureType":"poi.park",
          "elementType":"geometry.fill",
          "stylers":[  
            {  
              "visibility":"on"
            },
            {  
              "color":"#83cead"
            }
          ]
        },
        {  
          "elementType":"labels",
          "stylers":[  
            {  
              "visibility":"on"
            },
            {  
              "saturation":-100
            }
          ]
        },
        {  
          "featureType":"landscape.man_made",
          "elementType":"geometry",
          "stylers":[  
            {  
              "weight":0.9
            },
            {  
              "visibility":"off"
            }
          ]
        }];


        var options = {
            zoom: 18,
            center: centerPosition,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map($('#map')[0], options);
        map.setOptions({
            styles: style
        });
        
        var image = {
            url: 'https://dl.dropboxusercontent.com/u/814783/fiddle/marker.png',
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12, 59)
        };
        var shadow = {
            url: 'https://dl.dropboxusercontent.com/u/814783/fiddle/shadow.png',
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(-2, 36)
        };
        var marker = new google.maps.Marker({
            position: centerPosition,
            map: map,
            icon: image,
            shadow: shadow
        });

      });

    },

    getCurrentLocation: function() {
      
    }


  }




  /**
   * DOM Ready
   */
  jQuery(document).ready(function($) {

    App.run.init();


    App.geonote.init();







  });


  /**
   * Window Load
   */
  jQuery(window).ready(function($) {


    

  });


})(jQuery);