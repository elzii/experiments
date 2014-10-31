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

    init: function() {

      this.$el.file_input.addEventListener('change', this.handleFiles, false);

    },


    $el : {

      file_input    : document.getElementById('file'),
      selected_file : document.getElementById('file').files[0],

      preview : document.getElementById('preview')

    },

    handleFiles : function() {

      var files = this.files;

      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /image.*/;
        
        if (!file.type.match(imageType)) {
          continue;
        }
        
        var img = document.createElement("img");
        img.classList.add("obj");
        img.file = file;

        console.log(img);

        App.fileReader.$el.preview.appendChild(img); // Assuming that "preview" is a the div output where the content will be displayed.
        
        var reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file);
      }

      

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