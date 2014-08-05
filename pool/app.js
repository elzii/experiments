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
    supports : {},
    NFL : {
      json : {
        temp : {}
      }
    }
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

    get : function(key, value) {

      if ( value === undefined ) { value = false; }

      var data;

      if ( !this.hasData(key) ) {
        return false;
      }

      // if ( value ) {
      //   data = localStorage.getItem(key, value);
      // } else {
      //   data = localStorage[key];
      // }

      data = localStorage[key];

      // if json, try to parse
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }

    },

    clear : function(key) {

      if ( key === undefined ) {
        localStorage.clear();
      } else {
        localStorage.clear(key);
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
   * User
   */
  App.user = {

    elements : {
      signup_form : $('form#signup'),
      login_form  : $('form#login'),
      logout_btn  : $('#logout'),
      message     : $('#message')
    },

    init: function() {

      this.signup();
      this.login();
      this.logout();
      
      this.render();
    },

    signup: function() {

      var self = this;

      self.elements.signup_form.submit(function (event) {
        event.preventDefault();

        var $this     = $(this),
            form_data = $this.serialize();

        $.ajax({
          url: 'lib/signup.php',
          type: 'POST',
          data: form_data,
        })
        .done(function (data) {

          var json = $.parseJSON(data);

          if ( App.config.debug ) { console.log("success", json); }

          App.storage.clear('data');
          App.storage.set('data', json);
          

          var alert_type = '';
          // If token error, refreshing the page to resolve
          if ( json.state && json.state === 'ERROR' ) {
            alert_type = 'danger';
          } else if ( json.state && json.state === 'SUCCESS' ) {
            alert_type = 'success';
          } else {
            alert_type = 'warning';
          }
          self.showAlert({ 
            type    : alert_type,
            message : json.message
          });

          self.render();


        })
        .fail(function (data) {
          console.log("error", data);
        })
        
      });

    },

    login: function() {

      var self = this;

      self.elements.login_form.submit(function (event) {
        event.preventDefault();

        var $this     = $(this),
            form_data = $this.serialize();

        $.ajax({
          url: 'lib/login.php',
          type: 'POST',
          data: form_data,
        })
        .done(function (data) {
          var json = $.parseJSON(data);
          
          if ( App.config.debug ) { console.log("success", json); }

          self.showAlert({ 
            type    : 'warning',
            message : json.message
          });

          App.storage.clear('data');
          App.storage.set('data', json);

          self.render();

        })
        .fail(function (data) {
          console.log("error", data);
        })
        
      });

    },

    logout: function() {

      var self = this;

      self.elements.logout_btn.click(function (event) {
        event.preventDefault();

        var $this     = $(this);

        $.ajax({
          url: 'lib/logout.php',
          type: 'POST'
        })
        .done(function (data) {
          // var json = $.parseJSON(data);

          if ( App.config.debug ) { console.log("success", data); }

          self.showAlert({  message : 'Logged out' });

          App.storage.clear('data');

          self.render();

        })
        .fail(function (data) {
          console.log("error", data);

          self.elements.message
            .html('An error occured signing out')
            .show()
        })
        
      });

    },

    isLoggedIn: function() {

      var user = App.storage.get('data').username;

      if ( user ) {
        return true;
      } else {
        return false;
      }
    },

    showAlert: function(data) {

      var self = this;

      data = data || {};

      if ( data.type === undefined ) { data.type = 'warning'; }
      // if ( data.message === undefined ) { data.message = null; }

      console.log(data)

      self.elements.message
        .empty()
        .removeClass('alert-success alert-info alert-warning alert-danger')
        .addClass('alert-'+data.type)
        .html(data.message)
        .show()

    },

    hideAlert: function() {
      var self = this;

      self.elements.message.hide();
    },


    render: function() {

      var self = this;


      // Logged in
      if ( self.isLoggedIn() ) {
        
        self.elements.signup_form.hide();
        self.elements.login_form.hide();
        self.elements.logout_btn.show();

      } else {
        
        self.elements.logout_btn.hide();
        self.elements.login_form.show();
        self.elements.signup_form.show();
      }



    }

  };

  









  /**
   * CURL
   */
  App.curl = {


    get : function(data) {

      return $.ajax({
        url: 'curl.php',
        type: 'GET',
        data: {
          url   : data.url
        }
      })
    
    }
   
  }



  /**
   * DOM Ready
   */
  jQuery(document).ready(function($) {

    App.run.init();

    App.user.init();


    /*
    References:

      - http://www.ehow.com/info_8144644_types-nfl-pools.html

    0. NFL Pool App Idea
      ------------------
      - Pick who you think would win for each game
      - For every correct prediction, better gets 1 point ( predicated 12/15 correctly, for example, 12 points)
      - 1 game every week, (monday night), pick the point spread as well (over under, right on) !! READ UP !!
  

    1. GAME TYPE : 33 Point NFL Pool
      -------------------------------------------
      - Game lasts entire NFL season (17 weeks)
      - The pool can only have as many participants as there are NFL teams (32).
      - Each week, participants are randomly assigned an NFL team. We recommend picking them from a hat.
      - Decide on a buyin amount for the week.
      - If a participant's team scores exactly 33 points, they win. Multiple winners split the pot.
      - If no team scores 33 points, the buy-in pot is rolled over to the next week.
      - Scoring exactly 33 points happens less often than you might think, so some of the pots can be very large.

     */



     /*   
      Pick the Winners
      ----------------
      In NFL football pools where you just have to pick the winners, your goal is to pick the greatest number 
      of teams that win games in a given week. In case there is a tie, contestants frequently pick the combined 
      score of the Monday night game, and the player involved in the tie with the closest guess, without 
      going over, wins.

      Beat the Spread Pools
      ---------------------
      In an NFL pool that uses a betting line known as the spread, players must guess the winner of the game, 
      with a slight adjustment to the score. One team in each game is the favorite and will have a predetermined 
      amount of points deducted from its score. The winner of that game is then determined by comparing the score 
      of the two teams after the favored team has the predetermined number of points deducted from its score. 
      The deduction used for Beat the Spread pools is frequently found in a local newspaper or website that
      announces the official betting lines announced by sportsbooks at casinos in Las Vegas.

      Over and Under Pools
      --------------------
      In an Over and Under Pool, players compete to see who can guess most accurately the final scores of all 
      the games of the current week. An exact score does not have to be predicted. Instead, contestants must 
      guess if the score will be higher or lower than the predicted final score of the two teams combined. 
      This predicted score can be found in national newspapers and websites that list wagering lines established 
      by Las Vegas casinos. The player that makes the most correct guesses of over or under wins the pool for the week.
      If there is a tie, the player involved in the tie who guesses the combined score of the Monday night football game, 
      without going over, wins.

      Confidence Pool
      ---------------
      In a Confidence Pool, players choose winners for each of the games that week. They then get to assign 
      a point value to each of the winners. The numbers go from one through the number of games played that 
      week. A contestant should assign the highest point value for that week to the team he thinks is most 
      likely to win of the teams he predicts to win. The number one should be assigned to the winner he is 
      least confident will win. For each correct guess, the player gets the points assigned to that winner. 
      The player with the highest combined score for the week is the winner. Once again, players guess the combined 
      score of the Monday night game, with the tie being broken and the winner based on who is closest to the total 
      without going over.

      Read more : http://www.ehow.com/info_8144644_types-nfl-pools.html

      */  







  });


  /**
   * Window Load
   */
  jQuery(window).ready(function($) {


    $('.loading').hide();
    $('#wrapper').show();

  });


})(jQuery);