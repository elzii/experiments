var App;

!(function ($) {

  "use strict";

  App = window.APPLICATION = {};

  /**
   * Config
   */
  App.config = {

    environment : (window.location.href.match(/(localhost)/g) ? 'development' : 'production' ),
    
    api : {
      key : 'U4DMV*8nvpm3EOpvf69Rxw((',
      access_token : 'E3QDg5wvLmcWaa38hENN0g))',
      root_url : 'https://api.stackexchange.com/2.2/'
    },

    debug: true
    
  };




  /**
   * Data
   */
  App.data = {

    temp : {},
    audio : {},

    binds : {
      so : {
        user : {
          display_name : null,
          account_id : null
        }
      }
    }

  }
  

  /**
   * Elements
   */
  App.$el = {

    wrap    : $('#wrap'),


  };


  /**
   * Init
   */
  App.init = function() {

    // Main
    App.events();
    App.stackOverflow.init();
    
    // App.renderData();
  
  };



  /**
   * Events
   * 
   */
  App.events = function() {



  }





  /**
   * stackOverflow
   *
   * @documentation 
   */
  App.stackOverflow = {

    init : function() {

        this.getUserData('1132995')
    },
 
    getUserData : function(user_id) {

    $.ajax({
      url: App.config.api.root_url + 'users/' + user_id ,
      type: 'GET',
      data: {
        key : App.config.api.key,
        site : 'stackoverflow',
        access_token : App.config.api.access_token,
        filter : 'default'
      },
    })
    .done(function (data) {
      
      App.data.binds.so.user = {
        display_name : data.items[0].display_name,
        account_id : data.items[0].account_id
      }


      console.log(data.items[0])


    })
    .fail(function (data) {
      console.log("error", data);
    })
    
    }
    


  }



  App.renderData = function() {

    var data = $('*[data-bind]');

    $.each(data, function (i, obj) {

        var prop = $(this).data('bind');
        // console.log(prop);
    })

  }


  /**
   * DOM Ready
   */
  $(document).ready(function() {

    App.init();

  })


  // Which we then observe
  Object.observe(App.data.binds.so.user, function (changes){

      console.log(changes);

      // This asynchronous callback runs
      // changes.forEach(function(change) {

          // Letting us know what changed
          // console.log(change);

          // var $bind = $('*[data-bind]').data('bind');

          // // Find the matching bind
          // if ( $bind == change.name ) {
            
          //   $('*[data-bind]').data('bind', change.name).html(App.data.binds[change.name])

          //   console.log(App.data.binds[change.name])

          // }

      // });

  });




})(jQuery);

