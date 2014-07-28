!(function ($) {

  "use strict"; // jsHint

  window.APPLICATION   = {};
  var App              = window.APPLICATION;
  var ua               = navigator.userAgent;

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
   * Reddit Feed
   */
  App.reddit = {

    interval  : 10000,
    urls      : {
      all_new : 'http://www.reddit.com/r/all/new/.json?sort=new'
    },

    elements : {
      container       : $('#reddit-posts'),
      progress        : $('#reddit-update-interval'),
      post_count      : $('#reddit-post-count'),
      domain_count    : $('#reddit-domain-count'),
      loading         : $('#reddit-loading'),
      repost_count    : $('#reddit-repost-count'),
      stop            : $('#reddit-stop-stream')
    },

    /**
     * Init
     * 
     * Initializes functions
     * 
     * @param none
     * @return none
     */
    init : function() {
      this.events();
      this.getJSON(App.reddit.urls.all_new, { 
        sort  : 'new',
        count : 25
      });
      this.updateStream();
    },


    events : function() {

      App.reddit.elements.stop.click(function(){
        App.reddit.stopStream();
      });
    },


    /**
     * Get JSON
     * 
     * Performs AJAX request to url and uses promises to wait for response
     * 
     * @param [string] (url) the url
     * @param [object] (params) parameters
     * @return none
     */
    getJSON : function(url, params) {

      var data = {};

      // Show loading spinner
      App.reddit.toggleLoading(true);

      var promise = $.ajax({
        url: url,
        type: 'GET',
        // cache: false,
        dataType: 'json',
        data: params,
      });
      
      promise.done(function (response, status) {
        // console.log('SUCCESS ->', response);

      })
      promise.fail(function (response, status) {
        // console.log("error");
      });

      $.when(promise).done(function (xhrobj) {
        
        if ( App.config.debug ) { console.log('JSON XHR Object: ', xhrobj); }

        App.data.reddit.json          = xhrobj;
        App.data.reddit.starting_post = xhrobj.data.after;
        App.data.reddit.ending_post   = xhrobj.data.children[0].data.name;

        App.reddit.setDataLocally(App.data.reddit.json);

        if ( App.config.debug ) { console.log('Last Post ID: ', xhrobj.data.children[0].data.name); }


        // Count posts
        App.reddit.postCount('.reddit-post');

        // Count unique domains
        App.reddit.countDomainUniques();

        // Count duplicate links
        App.reddit.countDuplicateLinks();

        // Hide loading spinner
        setTimeout(function() {
          App.reddit.toggleLoading(false);
        }, 25);

      });

    },

    /**
     * Set Data Locally
     * 
     * Set returned JSON data from api to a local object
     * 
     * @param [object] (json_data) the JSON data returned from getJSON()
     * @return none
     */
    setDataLocally : function(json_data) {

      App.data.reddit.posts = [];

      json_data.data.children.map(function (obj, index) {

        App.data.reddit.posts[index] = obj.data;

      });

      // Render the posts
      this.render(App.data.reddit.posts);

    },


    /**
     * Render
     * 
     * Renders the posts onto the page
     * 
     * @param [object] (data) the post data created from json via api
     * @param [object] (options) additional options, mostly formatting
     * @return none
     */
    render : function(data, options) {

      var $container = this.elements.container;

      options = options || {};

      if ( options.separator ) {
        $container.find('.media:first-child').before('<hr>');
      }
      
      console.log('-----------------------------------------------------------');
      console.log('Rendering new posts...');
      console.log('-----------------------------------------------------------');

      $.each(data, function (index, item) {

        // Handle irregular thumbnail values
        if ( item.thumbnail === "self" || item.thumbnail === "default" || item.thumbnail === "nsfw" || item.thumbnail == null || !item.thumbnail ) {
          var thumb_url = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZWVlIi8+PHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMzIiIHk9IjMyIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+NjR4NjQ8L3RleHQ+PC9zdmc+';
        } else {
          var thumb_url = item.thumbnail;
        }

        // Handle post self text
        if ( !item.selftext || item.selftext == null || item.selftext === "" ) {
          var self_text = '';
        } else {
          var self_text = item.selftext;
        }

        // Handle NSFW posts
        if ( item.thumbnail === "nsfw" ) {
          var nsfw_label = '<span class="label label-danger">NSFW</span>';
        } else {
          var nsfw_label = '';
        }

        // Generate HTML for post
        $container.prepend(' \
          <div class="media reddit-post" data-post-id="'+item.name+'"> \
            <a class="thumb pull-left" href="#"> \
              <img class="media-object" src="'+thumb_url+'" width="64" height="64"> \
            </a> \
            <div class="media-body"> \
              <h4 class="media-heading">'+item.title+'</h4> \
              <p>'+self_text+'</p> \
              <footer> \
                <span class="label label-info">'+item.subreddit+'</span> \
                <span class="label label-default">'+item.author+'</span> \
                '+nsfw_label+' \
              </footer> \
            </div> \
          </div> \
        ');

      });

    },


    /**
     * Update Stream
     * 
     * Runs various functions for both processing and displaying stream updates
     * 
     * @param none
     * @return none
     */    
    updateStream : function () {

        var freq = this.interval;

        // Animate once initially
        App.reddit.displayUpdateInterval(App.reddit.elements.progress);

        // show progress bar
        App.data.reddit.stream = setInterval(function() {
          // Render update progress animaton
          App.reddit.displayUpdateInterval(App.reddit.elements.progress);

          // Get more posts via JSON
          App.reddit.getJSON(
            App.reddit.urls.all_new, { 
              sort   : 'new', 
              before : App.data.reddit.ending_post,
              count  : 25
            });

        }, freq );


    },


    stopStream : function() {

      App.reddit.elements.progress
        .stop()
        .animate({'width' : '0%'}, 75, 'linear');

      clearInterval(App.data.reddit.stream);

    },

    /**
     * Display Update Interval
     * 
     * Displays and animates the progress bar indicating the stream update interval
     * 
     * @param [string] (selector) the jquery selector
     * @return none
     */
    displayUpdateInterval: function(selector) {

      var duration = this.interval;

      selector.animate({
        'width' : '100%'
      }, duration, 'linear', function (callback) {
        selector.attr('style', 'width:0px;');
      });

    },



    /**
     * Post Count
     * 
     * Calculates the amount of elements in the DOM to generate a post count. Used 
     * with updateStream() to keep a running tally.
     * 
     * @param [string] (element) the jquery selector
     * @return none
     */
    postCount: function(element) {
      
      var count = App.data.reddit.post_count;

      $(element).each(function (i) {
        count = i + 1;
      });

      if ( App.config.debug ) { console.log('Post count: ', count); }

      App.reddit.elements.post_count.text(count);
    },



    /**
     * Count Unique Domains
     * 
     * Calculate the number of unique domains
     * 
     * @param none
     * @return none
     */
    countDomainUniques: function() {

      var domains         = App.data.reddit.domains,
          domains_unique  = App.data.reddit.domains_unique;

      App.data.reddit.posts.map(function (obj, index) {

        domains.push(obj.domain);

      });

      $.each(domains, function (i, el) {
        if ($.inArray(el, domains_unique) === -1) {
          domains_unique.push(el);
        }
      });

      App.reddit.elements.domain_count.text(domains_unique.length);

      console.log('Unique domains: ', domains_unique.length);

    },



    /**
     * Count Reposts
     * 
     * Calculate the number of reposts
     * 
     * @param none
     * @return none
     */
    countDuplicateLinks: function() {

      var links             = App.data.reddit.links,
          links_unique      = App.data.reddit.links_unique,
          links_duplicate   = App.data.reddit.links_duplicate;

      App.data.reddit.posts.map(function (obj, index) {

        links.push(obj.url);

      });

      $.each(links, function (i, el) {
        if ($.inArray(el, links_unique) === -1) {
          links_unique.push(el);
        }
      });

      // var sorted_links = links.sort();

      // for (var i = 0; i < links.length - 1; i++) {
      //     if (sorted_links[i + 1] == sorted_links[i]) {
      //         if ( $.inArray(sorted_links[i], links_duplicate ) === -1 ) {
      //           links_duplicate.push(sorted_links[i]);
      //         }
      //     }
      // }

      // console.log(links_duplicate);

      var difference = links.length - links_unique.length;

      App.reddit.elements.repost_count.text(difference);

      console.log('Repost count: ', difference);

    },



    /**
     * Toggle Loading
     * 
     * Toggle display of ajax loading gif
     * 
     * @param [boolean] (visible) on/off
     * @return none
     */
    toggleLoading : function(visible) {

      if ( visible == true ) {
        App.reddit.elements.loading.show();
      } else {
        App.reddit.elements.loading.hide();
      }
    },



    /**
     * Debug
     * 
     * Various debugging / console logs. Use with updateStream() to repeat occurance.
     * 
     * @param none
     * @return none
     */
    debug: function() {

      // Update interval
      console.log('Update Interval: ', this.interval/1000 + ' seconds');

      // Starting post ID
      console.log('Starting post ID: ', App.data.reddit.starting_post);

      // Ending post ID
      console.log('Ending post ID: ', App.data.reddit.ending_post);
    }



  };






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
   * DOM Ready
   */
  jQuery(document).ready(function($) {

    App.run.init();

    App.userData.init();

    /**
     * Page specific invocations
     */
  

  });


  /**
   * Window Load
   */
  jQuery(window).ready(function($) {
    if ( App.helpers.isPath('reddit') ) {
      App.reddit.init();
    }
  });


})(jQuery);