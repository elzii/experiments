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

    // Data
    data : {
      temp : null,
      binds : {}
    },

    // URLs
    urls : {
      social : {
        facebook : '',
        twitter : '',
        youtube : '',
        instagram : '',
        pinterest : ''
      }
    },

    // Supports
    supports : {

    },

    // Body Classes
    classes : {
    
    },

    // Elements
    $el : {
      body : $('body'),

      controls : {
        nav : $('*[data-control-nav]'),
        animation : $('*[data-control-animation]'),
        stage_height : $('*[data-control-stage-height]'),
        toggle_icon : $('*[data-control-toggle-icons]'),
        curtain : $('*[data-control-curtain]'),
        expander : $('*[data-control-expander]'),
        display : $('*[data-control-display]'),
        text : $('*[data-control-text]'),
        sibling : $('*[data-control-sibling]'),
        scrollto : $('*[data-control-scrollto]'),
        active_items : $('*[data-control-activeitems]').find('li'),
        modal : $('*[data-control-modal]')
      },

      modals : {
        modal : $('.modal'),
        bay : $('#modals'),
        close : $('.modal--close')
      }

  };



  /**
   * Init
   */
  app.init = function () {
    
    this.pluginsInit()
    this.cookies()
    this.events()
    this.modals()
    this.forms.init()
 
    this.dataControls.init()
 

  }




  /**
   * Plugins Init
   */
  app.pluginsInit = function () {
    


  }





  /**
   * Modals
   */
  app.modals = function() {

      var modal = app.$el.modals.modal;

      // Move all modals on page into modal bay
      modal.appendTo(app.$el.modals.bay)

      // Click event
      $(document).delegate(app.$el.controls.modal.selector, 'click', function (event) {

        event.preventDefault()

        var modalID = $(this).data('control-modal');

        modalShow(modalID);
      })

      // Add close event listener - ESC
      $(document).on('keyup', function (event) {
        
        event.preventDefault()
        
        var activeModal = $('.modal.show').attr('id'),
            activeModalID = '#'+activeModal;

        if ( activeModal !== undefined ) {
          // Check if ESC key
          if ( event.keyCode == 27 ) {
            modalClose(activeModalID)
          }

          if ( app.config.debug ) console.log('%cEVENT', 'color:#3d8627', '- toggle '+activeModalID+' by keyup ESC')
        }
      })

      // Add close event listener - .modal--close
      $(document).delegate(app.$el.modals.close.selector, 'click', function (event) {
        
        event.preventDefault()

        var activeModal = $('.modal.show').attr('id'),
            activeModalID = '#'+activeModal;

        if ( activeModal !== undefined ) {
          modalClose(activeModalID)
        }

        if ( app.config.debug ) console.log('%cEVENT', 'color:#3d8627', '- toggle '+activeModalID+' by click on '+app.$el.modals.close.selector)
      })



      /**
       * modalShow
       * @param  {String} targetID 
       */
      function modalShow(targetID) {

        var targetID = targetID || null;

        // Toggle body class
        app.$el.body.toggleClass(app.classes.modal_overlay)

        // Toggle modal class
        $(targetID).toggleClass('show')

        if ( app.config.debug ) console.log('%cDATA-CONTROL', 'color:#d2a946', '- firing modal with ID '+targetID)
        

      }


      /**
       * modalClose
       * @param  {String} targetID 
       */
      function modalClose(targetID) {

        var targetID = targetID || null;

        // Toggle body class
        app.$el.body.toggleClass(app.classes.modal_overlay)

        // Toggle modal class
        $(targetID).toggleClass('show')

      }

  }



  /**
   * Forms
   */
  app.forms = {

    init: function() {

      
    },

    
  }





  





  /**
   * Cookies
   */
  app.cookies = function () {
    
    
  }

  



  /**
   * Data Controls
   */
  app.dataControls = {

    init : function() {

      this.stageHeight()
      this.controlNavs()
      this.controlAnimation()
      this.toggleIcon()
      this.controlCurtain()
      this.controlExpander()
      this.controlDisplay()
      this.controlText()
      this.controlSibling()
      this.controlScrollTo()
      this.controlActiveItems()

    },

    /**
     * Control Navs
     * data-control-nav
     * data-control-targets
     */
    controlNavs: function() {

      // set up event bindings
      app.$el.controls.nav.each(function (i, el) {
        
        var $this           = $(this),
            navItems        = $this.find('li'),
            controlTargets  = $this.data('control-targets'),
            startIndex      = ( $this.data('control-start-at') !== undefined ) ? $this.data('control-start-at') : false,
            index           = 0,
            transitionSpeed = 100;


        if ( startIndex != false ) {
          // start at given index
          navItems.eq(startIndex).addClass('active');
          index = startIndex;
          // start item with given index
          $(controlTargets).find('li:nth-child('+(startIndex+1)+')').show()
          
        } else {
          // set active class on first nav item
          navItems.first().addClass('active')
          // show first item
          $(controlTargets).find('li:first-child').show()
        }


        

        // set up click event
        navItems.on('click', function (event) {

          var $self = $(this);
          
          // set scoped index based on clicked index        
          index = $self.index()

          // set active classes on nav
          $self.siblings().removeClass('active')
          $self.addClass('active')

          // split them from comma separator
          if ( controlTargets.indexOf(',') ) {
            
            var target = controlTargets.split(',')
            
            target.forEach(function (selector, x) {
                  
                var $targetItem = $(selector).find('li').eq(index)

                $targetItem.siblings().stop().hide()
                // $targetItem.stop().delay(transitionSpeed+5).fadeIn(transitionSpeed)
                $targetItem.stop().show()

            })

          } else {
            
            var $targetItem = $(controlTargets).find('li').eq(index)

            $targetItem.siblings().stop().fadeOut(transitionSpeed)
            $targetItem.stop().delay(transitionSpeed+5).fadeIn(transitionSpeed)

          }

        })

      })

    },




    /**
     * Control Animation
     * data-control-animation
     */
    controlAnimation: function() {

      // set up event bindings
      $(document).delegate(app.$el.controls.animation.selector, 'click', function (event) {

        var $this = $(this),
            controlTarget = $this.data('control-animation-target'),
            animationClass = $this.data('control-animation-class')

        $(controlTarget)
          .stop()
          .removeClass('animated')
          .removeClass(animationClass)
          .addClass('animated '+animationClass)

        if ( app.config.debug ) console.log('%cDATA-CONTROL', 'color:#d2a946', '- added class "'+animationClass+'" on "'+controlTarget+'"')

      })

    },



    /**
     * Stage Height
     * data-control-stage-height
     */
    stageHeight: function() {

      $(document).delegate(app.$el.controls.stage_height.selector, 'click', function (event) {

        var $this = $(this),
            ww    = $(window).width(),
            wh    = $(window).height()

        $this.width(ww).height(wh)

      })

    },


    /**
     * Icon Toggle
     */
    toggleIcon: function() {

      $(document).delegate(app.$el.controls.toggle_icon.selector, 'click', function (event) {

        var $this       = $(this),
            $icon       = $this.find('.fa'),
            iconClasses = $this.data('control-toggle-icons')

        var icons = iconClasses.split(',')

        $icon
          .toggleClass(icons[0])
          .toggleClass(icons[1])

      })

    },

    /**
     * Control Curtain
     */
    controlCurtain: function() {

      $(document).delegate(app.$el.controls.curtain.selector, 'click', function (event) {

        var $this            = $(this),
            targetCurtainId = $this.data('control-curtain'),
            $targetCurtain  = $(targetCurtainId)

        $targetCurtain.toggleClass('show')

        if ( app.config.debug ) console.log('%cDATA-CONTROL', 'color:#d2a946', '- curtains on '+targetCurtainId)

      })

    },


    /**
     * Control Display
     */
    controlDisplay: function() {

      $(document).delegate(app.$el.controls.display.selector, 'click', function (event) {

        var $this            = $(this),
            targetDisplayId = $this.data('control-display'),
            $targetDisplay  = $(targetDisplayId)

        $targetDisplay.toggle()

        if ( app.config.debug ) console.log('%cDATA-CONTROL', 'color:#d2a946', '- display toggle on '+targetDisplayId)

      })

    },



    /**
     * Control Text
     */
    controlText: function() {

      $(document).delegate(app.$el.controls.text.selector, 'click', function (event) {

        var $this        = $(this),
            text         = $this.data('control-text').split(','),
            $targetText  = $this.find('*[data-control-text-target]'),
            currentText  = $targetText.text()

          if ( currentText == text[0] ) {
            $targetText.text(text[1])
          } else {
            $targetText.text(text[0])
          }

      })

    }, 



    /**
     * Control Sibling
     */
    controlSibling: function() {

      $(document).delegate(app.$el.controls.sibling.selector, 'click', function (event) {

        var $this            = $(this),
            $targetSibling   = $this.siblings(0);

        $targetSibling.toggle()

      })

    },


    /**
     * Control Expander
     */
    controlExpander: function() {

      $(document).delegate(app.$el.controls.expander.selector, 'click', function (event) {


        var $this            = $(this),
            targetExpanderId = $this.data('control-expander'),
            $targetExpander  = $(targetExpanderId)

        $targetExpander.toggleClass('show')

        if ( app.config.debug ) console.log('%cDATA-CONTROL', 'color:#d2a946', '- expander on '+targetExpanderId)

      })

    },


    

    /**
     * Control ScrollTo
     */
    controlScrollTo: function() {

      $(document).delegate(app.$el.controls.scrollto.selector, 'click', function (event) {

        event.preventDefault()

        var $this            = $(this),
            targetElementId  = $this.data('control-scrollto'),
            $targetElement   = $(targetElementId)

        var options = {
          offset : $this.data('control-scrollto-offset') || 0,
          duration : Math.floor( Math.abs($(window).scrollTop() - $targetElement.offset().top) / 2.75 ),
          // easing : $.easing ? 'easeInOutExpo' : 'swing'
          easing : 'swing'
        }

        if ( $targetElement.length > 0 ) {
          
          scrollToElement({
            target : targetElementId,
            offset : options.offset,
            easing : options.easing,
            duration : options.duration
          })

          if ( app.config.debug ) console.log('%cDATA-CONTROL', 'color:#d2a946', '- scrollto element '+targetElementId, options.offset, (options.duration / 1000)+'s', options.easing)
          
        } else {
          if ( app.config.debug ) console.log('%cERROR : DATA-CONTROL', 'color:#eb1817', '- scrollto element '+targetElementId+' does not exist' + options.offset)
        }

      })

    },


    /**
     * Control Active Items
     */
    controlActiveItems: function() {

      $(document).delegate(app.$el.controls.active_items.selector, 'click', function (event) {

        var $this = $(this)

        $this.siblings().removeClass('active')
        $this.addClass('active')

      })

    },

  }




  /**
   * Storage
   */
  app.storage = {

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
   * DOCUMENT READY
   * -------------------------------------------------------------------
   *
   */
  $(document).ready(function(){
      
    app.init();

  });

 


  /**
   * WINDOW LOAD
   * -------------------------------------------------------------------
   *
   */
  $(window).load(function(){
      
    app.fullPageLoader()

  });

  /**
   * WINDOW SCROLL
   * -------------------------------------------------------------------
   *
   */
  $(window).on('scroll', function(){

      

  });


  /**
   * WINDOW RESIZE
   * -------------------------------------------------------------------
   *
   */
  $(window).resize(function(){   
      


  }).trigger('resize');




  /**
   * ORIENTATION CHANGE (requires jQuery mobile)
   * -------------------------------------------------------------------
   *
   */
  window.addEventListener("orientationchange", function() {
      
      

  }, false);




  /**
   * SELF INVOKING ANONYMOUS FUNCTION
   * -------------------------------------------------------------------
   * 
   */
  (function(){ 

        

  })(); 












  /**
   * Private Method Example
   */
  function privateMethod() {
    // ...
  }



  /**
   * scrollToElement
   */
  function scrollToElement(options){

      var duration  = options.duration || 250,
          easing    = options.easing || 'swing',
          offset    = options.offset || 0;

      var target    = options.target || false;

      if(target){
          if(/(iPhone|iPod)\sOS\s6/.test(navigator.userAgent)){
              $('html, body').animate({
                  scrollTop: $(target).offset().top
              }, duration, easing);
          } else {
              $('html, body').animate({
                  scrollTop: $(target).offset().top - (offset)
              }, duration, easing);
          }
      }
  }
  










  return app;
}());