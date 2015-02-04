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

      shows : $('#shows')
      
    },

    settings : {

    },

    feeds : {

      showrss_all : 'http://showrss.info/rss.php?user_id=207854&hd=0&proper=null'
    }


  };



  /**
   * Init
   */
  app.init = function () {
    
    this.showFeed.init()
    

  }





  /**
   * Show Feed
   */
  app.showFeed = {

    container : $('#shows'),

    template : $('#show_template').html(),
    
      
    /**
     * Initialize
     */
    init: function() {

      this.buildShowList( app.feeds.showrss_all )

    },


    /**
     * getShowFeed
     *
     * Use curl proxy to get showrss feed, parse XML to json and return it
     *
     * @param {String} url
     * @param {Function} callback
     */
    getShowFeed: function(url, callback) {

      var request;

      request = $.ajax({
        url: 'ajax.php',
        type: 'POST',
        data : {
          action : 'curl',
          url : url,
          convertXML : true
        }
      })
      .done(function (data) {
        
        var json  = $.parseJSON(data),
            items = json.channel.item

        callback(items)

      })
      .fail(function (data) {
        console.log("error", data);

        callback(data)
      })
      
    },

    /**
     * buildShowList
     *
     * Read the object containing the show list returning from getShowFeed
     * 
     * @param  {String} url
     */
    buildShowList: function(url) {

      var self = this;

      var obj = { 'shows' : [] };

      // Get the feed
      this.getShowFeed( url, function (items) {

        var _this = app.showFeed;
        
        $.each(items, function (i, show) {

          // Get cleaned up torrent info
          var show_info = _this.filterShowTorrentInfo( show.link, show.title )   

          // Magnet URI
          var magnet_uri = show.link;

          // Format date
          var release_date = formatPubDate( show.pubDate )

          console.log('Show Torrent Info: ', show_info)
          

          // app.$el.shows.append('\
          //   <div class="show col-md-3"> \
          //     <div class="show__inner"> \
          //       <div class="show__info"> \
          //         <h4 class="show-title">' + show_info.title + '</h4> \
          //       </div> \
          //     </div> \
          //   </div> \
          // ')

          obj.shows.push({
            name : show_info.title,
            season : show_info.season,
            episode : show_info.episode,
            episode_title : show_info.episode_name,
            release_date : release_date,
            magnet_uri : magnet_uri
          })

        })
        
        var html = Mustache.to_html( self.template, obj )

        self.container.html(html)

        // return shows;

      })

    },


    /**
     * Render Show List
     */
    render: function() {

    },



    /**
     * filterShowTorrentInfo
     *
     * Use regex on torrent file name to return some cleaned up strings
     */
    filterShowTorrentInfo: function( show_link, show_title ) {

       var torrent_info = {};

       if ( show_link ) {
         // Get torrent filename
         var torrent_str = getTorrentFilenameFromMagnetURI( show_link )

         // Nicename
         var show_nicename         = torrent_str.match(/^(\[.+\])?(.+[^a-z0-9])(?=S\d)/)
             torrent_info.title    = show_nicename[0].replace(/\+/g, ' ').trim()

         // Season
         var show_season         = torrent_str.match(/S(\d{1,2})/)
             torrent_info.season = show_season[0].replace('S', '')

         // Episode
         var show_episode         = torrent_str.match(/E(\d{1,2})/)
             torrent_info.episode = show_episode[0].replace('E', '')
       } else {
         console.log('ERROR: show_link not passed')
       }

       // Episode Name
       if ( show_title ) {
         var show_sxe = show_title.match(/\d{1,2}x\d{1,2}/)
             show_sxe = show_sxe[0]

         var show_episode_name = show_title.substring( show_title.indexOf(show_sxe) )
             show_episode_name = show_episode_name.replace(show_sxe, '')
             show_episode_name = show_episode_name.replace(/[-][\d].[\s]/, '').trim()

         torrent_info.episode_name = show_episode_name
       } else {
         console.log('ERROR: show_title not passed')
       }
       

       return torrent_info;

    }


  },


  /**
   * Show List
   *
   * Manually generated (copy/paste) from showrss.info acct
   */
  app.showList = [
    "Archer",
    "Bob's Burgers",
    "Community",
    "Derek",
    "Drugs, Inc.",
    "Game of Thrones",
    "Girls",
    "Hannibal",
    "House of Cards",
    "Legit",
    "Mad Men",
    "Marvel's Agents of S.H.E.I.L.D",
    "Parenthood",
    "Parks and Recreation",
    "QI",
    "Rick and Morty",
    "Shameless",
    "Sherlock",
    "South Park",
    "The League",
    "The Simpsons",
    "Vice",
    "Wilfred",
    "Workaholics"
  ]



  /**
   * Regular Expressions
   */
  app.showRegex = {
    first_word : /(^[A-Z])\w+/g,
    detail_groups : /(.*?)\.S?(\d{1,2})E?(\d{2})\.(.*)/g
  }



  








  /**
   * searchStringInArray
   */
  function searchStringInArray (str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].match(str)) return j;
    }
    return -1;
  }


  /**
   * substringBetween
   */
  function substringBetween( string, start, end ) {
    return string.substring( show.link.lastIndexOf(start)+1, show.link.lastIndexOf(end) );
  }

  /**
   * replaceAllInString
   */
   function replaceAllInString(find, replace, str) {
     return str.replace(new RegExp(find, 'g'), replace);
   }


   /**
    * getTorrentFilenameFromMagnetURI
    */
  function getTorrentFilenameFromMagnetURI( magnet_link ) {

    var str_arr = magnet_link.split(/[&]/)
        str_arr = str_arr[1]

    return str_arr.replace('dn=', '')

  }

   /**
    * Format Published Date
    */
  function formatPubDate( date_str ) {
    
    var date = new Date(date_str)

    return date.toLocaleDateString()
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