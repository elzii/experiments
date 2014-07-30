!(function ($) {

  "use strict"; // jsHint


  /**
   * Application variables
   */
  window.APPLICATION    = {};
  var App               = window.APPLICATION;
  var ua                = navigator.userAgent;

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
    reddit : {
      json            : {},
      posts           : {},
      stream          : {},
      domains         : [],
      domains_unique  : [],
      links           : [],
      links_unique    : [],
      links_duplicate : [],
      starting_post   : null,
      ending_post     : null,
      post_count      : 0
    },
    curl     : {
      temp : null
    },
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

    btn_build_json  : $('#build_json'),
    nav_characters  : $('.character-nav'),
    loading_spinner : $('#loading')

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

        // rebuild json
        App.elements.btn_build_json.click(function (event) {
          event.preventDefault();

          var $this = $(this),
              data  = App.CSSCharacters.buildFeed('.char'),
              build = App.CSSCharacters.writeJSON('json.php', data);

          console.log('Rebuilding JSON file...');

          if ( build.responseText == 'success' ) {
            console.log('Successfully rewrote JSON file');

            $this.after('<a href="characters.json" class="btn btn-success" style="margin-left:5px;">View JSON</a>');
          } else {
            console.log('There was an error');
          }

        });
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
   * App JSON
   */
  App.CSSCharacters = {

    init : function() {

      this.buildNav(App.elements.nav_characters);
    },

    getField : function(element) {

    },

    getCSSAttribute : function(element, attribute) {

      this.element    = $(element);
      this.attribute  = $(element).css(attribute);

      return this.attribute;

    },

    buildFeed : function(element, output) {

      output = output || 'json';

      var self  = this,
          arr   = [],
          obj   = {};

      $(element).each(function (i,v) {

        var $this         = $(this),
            el_box_shadow = 'box-shadow: '+self.getCSSAttribute(element, 'box-shadow'),
            el_name       = $this.attr('name');

        arr[i] = {
          name : el_name,
          css  : el_box_shadow
        };

      });

      if ( output === 'array' ) {
        return arr;
      } else {
        return JSON.stringify(arr);
      }

    },

    writeJSON : function(filename, json_data) {

      var self = this;

      return $.ajax({
        type: "POST",
        url: filename,
        dataType : 'json',
        async: false,
        data: { data: json_data },
        success: function(response, status) {
          console.log('SUCCESS ->' + response, status);
        },
        failure: function(response, status) {
          console.log('ERROR ->' + response, status);
        }
      });

    },


    list : function(element) {

      var list = [];

      $(element).each( function (i) {

        var $this           = $(this),
            character_name  = $this.attr('name');

        list[i] = character_name;

      });

      return list;

    },

    buildNav : function(element) {

      var characters = this.list('.char');

      characters.map(function (name, index) {
        
        element.append('<li><a href="#">'+name+'</a></li>');

      });

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
   * User Data / Cookies
   */
  App.userData = {

    init : function() {
      this.setUserData();
    },

    setUserData : function() {

      // visits
      var visits = $.cookie('visits') || 0;

      $.cookie('visits', parseInt(visits)+1);

    }
  }


  /**
   * CURL
   * Example: App.curl.get({ url : 'https://www.google.com' });
   */
  App.curl = {

    init : function() {

    },

    get : function(data) {
      var promise = $.ajax({
        url: '/lib/curl.php',
        type: 'GET',
        // dataType: 'jsonp',
        data: {
          url : data.url
        }
      })
      .done(function (data) {
        
      })
      .fail(function (data) {
        
      })
      .always(function (data) {
        
      })

      $.when(promise).done(function (xhrobj) {
        
        App.data.curl.temp = xhrobj;

        console.log('SET `App.data.curl.temp` AS ', App.data.curl.temp);

      });
    }
   
  }


  /**
   * Facebook SDK
   */
  App.facebook = {

    init : function(app_id) {
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '433517646684852', // 526151207504816 433517646684852
          xfbml      : true,
          version    : 'v2.0'
        });

      };

    },

    script : function() {
      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
      
    },

    getLoginStatus : function() {

      window.fbAsyncInit = function() {
        FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token 
            // and signed request each expire
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;

            console.log(uid, accessToken);

          } else if (response.status === 'not_authorized') {
            console.log('the user is logged in to Facebook, but has not authenticated your app');
          } else {
            console.log('the user isnt logged in to Facebook.');
          }
        });
      }
    }

  };







  /**
   * DOM Ready
   */
  jQuery(document).ready(function($) {

    App.run.init();
    
    App.CSSCharacters.init();

    App.userData.init();


  });


  /**
   * Window Load
   */
  jQuery(window).ready(function($) {

    

  });


})(jQuery);