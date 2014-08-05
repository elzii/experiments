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


  



  App.NFL = {

    /**
     * Config
     *
     * Configuration options for use within app, similar to global vars
     */
    config : {
      api_key : 'tes3hmdt8q65zyyn3ud4vz3r',
      year    : '2014',
      weeks   : 17
    },



    /**
     * Elements
     * 
     * Id / class names of elements for rendering or otherwise
     */
    elements : {
      container   : '#content',
      week_filter : '#nfl-week-filter'
    },



    /**
     * Initialize
     * 
     * Initializes the app
     *
     */
    init: function() {

      var self = this;

      this.renderScheduleByWeekFilter('#nfl-week-filter', 16);
      this.renderSchedule();
      
    },



    /**
     * Build URL
     * 
     * Build the URL to fetch JSON passing in various parameters as desired
     *
     * @param  [object] (options) object of parameter options
     * @return [string] http://api.sportsdatallc.org/nfl-t1/2013/REG/1/schedule.json?api_key=tes3hmdt8q65zyyn3ud4vz3r
     */
    buildURL: function(options) {

      options = options || {};

      if ( options.api_key === undefined )        { options.api_key = this.config.api_key; }
      if ( options.access_level === undefined )   { options.access_level = 't'; }
      if ( options.version === undefined )        { options.version = '1'; }
      if ( options.year === undefined )           { options.year = '2014'; }
      if ( options.season === undefined )         { options.season = 'REG'; }
      if ( options.week === undefined )           { options.week = '1'; }

      var url = 'http://api.sportsdatallc.org/nfl-'+options.access_level+''+options.version+'/'+options.year+'/'+options.season+'/'+options.week+'/schedule.json?api_key='+options.api_key+''

      return url;

    },



    /**
     * Get JSON
     * 
     * Checks to see if we have JSON data in localStorage by request URL as key,
     * if not, make an AJAX call to go get it from API 
     *
     * @param [string] (url)      the URL (built by buildURL())
     * @param [func]   (callback) callback function - call render methods here
     * @return n/a
     */
    getJSON: function(url, callback) {
      
      url = url || null;

      if ( localStorage.getItem(url) ) {

        if ( App.config.debug ) { console.log('Getting from localStorage instead'); }

        callback($.parseJSON(localStorage.getItem(url)));

      } else {
        if ( App.config.debug ) { console.log('No results locally, making XHR request...'); }
        
        $.ajax({
          url: 'curl.php',
          type: 'GET',
          data: {
            url   : url
          }
        }).done(function (result) {
          var json = $.parseJSON(result);
          
          if ( App.config.debug ) { console.log('Setting to localStorage with key:', url); }
          localStorage.setItem(url, result);

          callback(json);
        })
      }

    },



    /**
     * Get Schedule By Week
     * 
     * Builds URL for a weekly schedule and runs getJSON()
     *
     * @param [object] (options)  object with parameters for year or week
     * @param [func]   (callback) callback function - call render methods here
     * @return getJSON()
     */
    getScheduleByWeek: function(options, callback) {

      if ( options.week === undefined ) { options.week = '1'; }
      if ( options.year === undefined ) { options.year = this.config.year; }

      var url = this.buildURL({ 
        year : options.year,
        week : options.week
      });

      return this.getJSON(url, callback);
    },



    /**
     * Render Schedule By Week
     * 
     * Renders all games from a schedule API call onto the page
     *
     * @param [object] (data) json object with game information
     * @param [string] (id)   a string/int to use as an identifier on DOM elements
     */
    renderScheduleByWeek: function(data, id) {

      var self     = this,
          $content = $(App.NFL.elements.container),
          games    = data.games;

      $content.append('<div class="row week-'+id+'"><br><br></div>');

      $.each(games, function (index, item) {

        // console.log(index,item);

        $('.week-'+id).append('\
          <div class="col-lg-4"> \
            <div class="panel panel-default"> \
              <div class="panel-heading clearfix"> \
                <div class="nfl-away  text-left"><img src="'+self.teamLogoImageURL(item.away)+'"/></div> \
                <div class="nfl-vs  text-center"><h5 style="margin:22px 0 0 0;line-height:1;">'+item.away+' @ '+item.home+'</h5></div> \
                <div class="nfl-home "><img src="'+self.teamLogoImageURL(item.home)+'"/></div> \
              </div> \
              <div class="panel-body text-center"> \
                <div style="position:relative;"> \
                  <img class="nfl-img-stadium" src="'+self.teamStadiumImageURL(item.home)+'"> \
                  <h5 class="nfl-stadium">'+item.venue.name+'</h5> \
                </div> \
              </div> \
              <div class="panel-footer text-center"> \
                <h4>'+item.scheduled.substr(0,10)+'</h4> \
              </div> \
            </div> \
          </div> \
        ');

      })

    },



    /**
     * Render Schedule
     * 
     * Wrapper function for getScheduleByWeek() to render multiple weeks. !REDUNDANT
     *
     */
    renderSchedule: function() {
      
      var self = this;

      self.getScheduleByWeek({ week : 1 }, function (result) {
        self.renderScheduleByWeek(result, 1);
      });

    },



    /**
     * Render Schedule By Week Filter
     * 
     * Render the week filter buttons onto the page
     *
     * @param [string] (element) the jquery selector where we want to append the filter list
     * @return [n/a] runs the getScheduleByWeek() function
     */
    renderScheduleByWeekFilter: function(element) {

      var self = this;

      if ( element === undefined ) return;

      for ( var i=1; i<App.NFL.config.weeks+1; i++) {
        $(element).append('<a data-week='+i+' type="button" style="margin:0 10px 10px 0;" class="nfl-week-filter btn btn-default btn-lg">'+i+'</a>');
      }

      $('.nfl-week-filter:first').addClass('active');

      $('.nfl-week-filter').click(function (event) {

        var $this     = $(this),
            week_num  = $this.data('week'),
            $content  = $('#content');

        $this.siblings().removeClass('active');
        $this.addClass('active');
        $content.empty();

        self.getScheduleByWeek({ week : week_num }, function (result) {
          self.renderScheduleByWeek(result, week_num );
        });

      });

    },



    /**
     * Team Logo Image URL
     * 
     * Gets a URL of an image of the desired team's logo
     *
     * @param  [string] (team_code) The team's abbreviation, ex: SD - San Diego
     * @return [string] (img_url) The logo URL
     */
    teamLogoImageURL: function(team_code) {

      // var img_url = 'http://upload.wikimedia.org/wikipedia/en/thumb/7/72/'+team_names[team_code]+'_logo.svg/200px-'+team_names[team_code]+'_logo.svg.png';

      var img_url = 'http://i.nflcdn.com/static/site/5.32/img/logos/teams-gloss-81x54/'+team_code.toLowerCase()+'.png';

      return img_url;
    },



    /**
     * Team Stadium Image URL
     * 
     * Generates URL from curated list of stadium images paired with NFL team codes
     *
     * @param  [string] (team_code)     The team's abbreviation, ex: SD - San Diego
     * @return [string] (team_stadium)  The stadium image URL
     */
    teamStadiumImageURL: function(team_code) {

      var team_stadium = {
        'ARI' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/University_of_Phoenix_Stadium_no_field.jpg/300px-University_of_Phoenix_Stadium_no_field.jpg',
        'ATL' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/VT_Hokies_Marching_Virginians.jpg/300px-VT_Hokies_Marching_Virginians.jpg',
        'BAL' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/M%26T_Bank_Stadium_DoD.jpg/300px-M%26T_Bank_Stadium_DoD.jpg',
        'BUF' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Bills.jpg/300px-Bills.jpg',
        'CAR' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Carolina_Panthers_24_Tampa_Bay_Bucanners_10.jpg/300px-Carolina_Panthers_24_Tampa_Bay_Bucanners_10.jpg',
        'CHI' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Soldier_field_2006.jpg/300px-Soldier_field_2006.jpg',
        'CIN' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Cincinnati-paul-brown-stadium2.jpg/300px-Cincinnati-paul-brown-stadium2.jpg',
        'CLE' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Cleveland_Browns_Stadium_during_2008_NFL_season.JPG/300px-Cleveland_Browns_Stadium_during_2008_NFL_season.JPG',
        'DAL' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Cowboys_Stadium_field.jpg/300px-Cowboys_Stadium_field.jpg',
        'DEN' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Invesco_Field_at_Mile_High_Stadium.jpg/300px-Invesco_Field_at_Mile_High_Stadium.jpg',
        'DET' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Ford-Field-September-10-2006.jpg/300px-Ford-Field-September-10-2006.jpg',
        'GB'  : 'http://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Lambeau_Field_bowl.jpg/300px-Lambeau_Field_bowl.jpg',
        'HOU' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Reliantstadium.jpg/300px-Reliantstadium.jpg',
        'IND' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/8/89/LucasOilStadiumTheLuke.jpg/300px-LucasOilStadiumTheLuke.jpg',
        'JAC' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Superbowl_XXXIX%2C_2005.JPG/300px-Superbowl_XXXIX%2C_2005.JPG',
        'KC'  : 'http://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/061123Broncos-Chiefs02.jpg/300px-061123Broncos-Chiefs02.jpg',
        'MIA' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Dolphinstadiumint.JPG/300px-Dolphinstadiumint.JPG',
        'MIN' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/TCF_Bank_Stadium_opener.jpg/300px-TCF_Bank_Stadium_opener.jpg',
        'NE'  : 'http://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Gillette_Stadium02.jpg/300px-Gillette_Stadium02.jpg',
        'NO'  : 'http://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Mercedes-Benz_Superdome_Poydras_bike.JPG/300px-Mercedes-Benz_Superdome_Poydras_bike.JPG',
        'NYG' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/4/46/New_Meadowlands_Stadium_Mezz_Corner.jpg/300px-New_Meadowlands_Stadium_Mezz_Corner.jpg',
        'NYJ' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/4/46/New_Meadowlands_Stadium_Mezz_Corner.jpg/300px-New_Meadowlands_Stadium_Mezz_Corner.jpg',
        'OAK' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Oakland_Coliseum_field_from_Mt._Davis.JPG/300px-Oakland_Coliseum_field_from_Mt._Davis.JPG',
        'PHI' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Philly_%2845%29.JPG/300px-Philly_%2845%29.JPG',
        'PIT' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Heinz_Field02.jpg/300px-Heinz_Field02.jpg',
        'SD'  : 'http://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Qualcomm_Interior.jpg/300px-Qualcomm_Interior.jpg',
        'SEA' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Levi%27s_Stadium_from_air.jpg/300px-Levi%27s_Stadium_from_air.jpg',
        'SF'  : 'http://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seahawksvcowboysatqwest.jpg/300px-Seahawksvcowboysatqwest.jpg',
        'STL' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Edwardjonesinterior.jpg/300px-Edwardjonesinterior.jpg',
        'TB'  : 'http://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Raymond_James_Stadium02.JPG/300px-Raymond_James_Stadium02.JPG',
        'TEN' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Night_Settles_on_LP_Field.jpg/300px-Night_Settles_on_LP_Field.jpg',
        'WAS' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/07/FedExField01.jpg/300px-FedExField01.jpg'
      }

      return team_stadium[team_code];

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


    App.NFL.init();







  });


  /**
   * Window Load
   */
  jQuery(window).ready(function($) {


    

  });


})(jQuery);