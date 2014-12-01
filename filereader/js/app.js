var App;

!(function ($) {

  "use strict";

  App = window.APPLICATION = {};

  /**
   * Config
   */
  App.config = {

    environment : (window.location.href.match(/(localhost)/g) ? 'development' : 'production' ),
    
    api : window.location.protocol + '//' + window.location.host + '/admin/api/',

    debug: true
    
  };



  /**
   * Data
   */
  App.data = {


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

    App.fileReader.init();
  
  
  };


  /**
   * Events
   * 
   */
  App.events = function() {



  }



  /**
   * Forms
   */
  App.forms = {


  

  }




  App.fileReader = {


    /**
     * File Config
     */
    file : {
      reader : new FileReader(),
      filter : /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i
    },

  
    /**
     * Elements
     */
    $el : {

      file_input    : document.getElementById('file'),
      selected_file : document.getElementById('file').files[0],

      preview : document.getElementById('preview'),

      progress : document.getElementById('progress')

    },


    /**
     * Initialize
     */
    init: function() {

      this.$el.file_input.addEventListener('change', this.handleFiles, false);

      console.log(this.file);

    }, 

    /**
     * File Handler
     */
    handleFiles : function(self) {

      var files = this.files;

      for (var i = 0; i < files.length; i++) {
        var file = files[i];
 
        // Check filetype   
        if (!file.type.match(App.fileReader.file.filter)) {
          continue;
        }
        
        


        // File reader methods
        var reader = App.fileReader.file.reader;

        // After loading image, set the source
        reader.onload = function (event) {
          
        };


        /**
         * Progress Handler
         */
        addEventHandler(reader, 'progress', function (e, fileName) { 

          console.log('EventHandler -> "progress"');

          if (e.lengthComputable) {

            var percentage = Math.round((e.loaded * 100) / e.total);

            App.fileReader.$el.progress.innerHTML = 'Loaded : '+percentage+'%'+' of '+fileName;

          }                                           
        }.bindToEventHandler(file.name));


        /**
         * LoadEnd Handler
         */
        addEventHandler(reader, 'loadend', function (event, file) { 

          console.log('EventHandler -> "loadend"');

          // Create image element & set source
          var img = document.createElement("img");
              img.file = file;
              img.src = event.target.result;

          // Render img to DOM
          App.fileReader.$el.preview.appendChild(img);
          
          console.log(img, file);

        }.bindToEventHandler(file));


        // Read as data URL
        reader.readAsDataURL(file);
      }

    }

  }




  /**
   * Prototypes
   */
  Function.prototype.bindToEventHandler = function bindToEventHandler() {

    var handler         = this,
        boundParameters = Array.prototype.slice.call(arguments);

    //unshift requires an argument
    boundParameters.unshift(''); 

    //create closure
    return function(e) {
      // get window.event if e argument missing (in IE)  
      e = e || window.event; 
      //update event info
      boundParameters[0] = e; 
      handler.apply(this, boundParameters);
    }

  };

  function addEventHandler(obj, evt, handler) {
    if(obj.addEventListener) {
      // W3C method
      obj.addEventListener(evt, handler, false);
    } else if(obj.attachEvent) {
      // IE method.
      obj.attachEvent('on'+evt, handler);
    } else {
      // Old school method.
      obj['on'+evt] = handler;
    }
  }














  /**
   * DOM Ready
   */
  $(document).ready(function() {

    App.init();


  })


  /**
   * Observe session data object and live-update in localStorage
   */
  // Object.observe(App.data.session, function (changes){

  //     // This asynchronous callback runs
  //     changes.forEach(function (change) {

  //         // Letting us know what changed
  //         // console.log(change, change.type, change.name, change.oldValue);

  //         App.storage.set('data', change.object)
  //     });

  // });


})(jQuery);