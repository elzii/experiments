var App;

!(function ($) {

  "use strict";

  App = window.APPLICATION = {};

  /**
   * Config
   */
  App.config = {

    environment : (window.location.href.match(/(localhost)/g) ? 'development' : 'production' ),
    debug: false
    
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

    form    : {
      self      : $('#form'),
      buy_ppu   : $('#input-buy_ppu'),
      sell_ppu  : $('#input-sell_ppu'),
      save      : $('#submit--save_to_collection'),
      clear     : $('#submit--clear_collection')
    },

    output  : {
      self            : $('#output'),
      net_ppu         : $('#output-net_ppu'),
      net_percentage  : $('#output-net_percentage'),

      debug           : $('#output-debug')
    },

    collection : $('#collection'),

    alert : $('#alert'),

    debug : $('#debug'),

    charts : {
      canvas__buy_ppu  : document.getElementById('canvas--buy_ppu').getContext('2d'),
      canvas__sell_ppu : document.getElementById('canvas--sell_ppu').getContext('2d')
    }

  };


  /**
   * Init
   */
  App.init = function() {

    App.events();
    App.handleFormChanges();
    App.displayCollection();
    App.loadCollectionItem();
    
    // submit first to population data
    // App.$el.form.self.submit();

  };



  App.events = function() {

    // Save to collection
    App.$el.form.save.click(function (event) {
      event.preventDefault();
      App.saveToCollection();
    })

    // Clear collection
    App.$el.form.clear.click(function (event) {
      event.preventDefault();
      App.clearCollection();
    })

  }




  /**
   * Calculator
   */
  App.handleFormChanges = function() {

    // Listen on change, keypress, change events
    App.$el.form.self.on('submit', function (event) {

      event.preventDefault();
      
    });

    App.$el.form.self.on('change', function (event) {

      event.preventDefault();

      if ( App.config.debug ) { console.log('handleFormChanges() -> change'); }

      App.processForm();
      
    });
     
  };




  /**
   * Process Form
   */
  App.processForm = function() {

    if ( App.config.debug ) { console.log('processForm()'); }

    var buy_ppu   = App.$el.form.buy_ppu.val(),
        sell_ppu  = App.$el.form.sell_ppu.val(),
        modifier  = App.$el.form.self.find('input[name="input-modifier"]:checked').val(),
        ah_cut    = 0.9;        

    if ( buy_ppu != 0 && sell_ppu != 0 ) {

      var bought = buy_ppu;
      var sold   = (sell_ppu * modifier * ah_cut);

      // Net per unit
      var net_ppu_val         = ( sold - bought );
      var class__net_ppu_val  = ( net_ppu_val > 0 ) ? 'positive' : 'negative';

      App.$el.output.net_ppu.removeClass('positive negative').addClass(class__net_ppu_val);
      App.$el.output.net_ppu.find('#output-net_ppu_val').html(net_ppu_val.toPrecision(4));


      // Net percentage
      var A = Math.round(sold*10000)/10;
      var B = Math.round(bought*10000)/10;

      var net_percentage_val          = (( A - B ) / ( (B + A ) / 2 ) * 100).toPrecision(3);
      var class__net_percentage_val   = ( net_ppu_val > 0 ) ? 'positive' : 'negative';

      App.$el.output.net_percentage.removeClass('positive negative').addClass(class__net_percentage_val);
      App.$el.output.net_percentage.find('#output-net_percentage_val').html(net_percentage_val);


      // Render charts
      App.displayCharts();
      
    } 

    App.data.form_data = App.$el.form.self.serializeObject();
    
    /**
     * Debug
     */
    if ( App.config.debug ) {

      App.$el.debug.show();
      App.$el.output.debug.html(JSON.stringify(App.data));

    }

  };

    





  /**
   * Save To Collection
   */
  App.saveToCollection = function() {

    // init localStorage
    var ls = localStorage || window.localStorage;

    var time_stamp = Date.now();

    if ( !ls.getItem('collection') || ls.getItem('collection') == '' || ls.getItem('collection') == null ) {
      if ( App.config.debug ) { console.log('localStorage item "collection" not set.')}
      ls.setItem('collection', [])
    }

    var lsCollection = App.storage.get('collection');
        lsCollection = $.makeArray(lsCollection);
    
    if ( App.data.form_data['input-buy_ppu'] !== '' || App.data.form_data['input-sell_ppu'] !== '' ) {
      var newCollection = { time_stamp : App.data.form_data };

      lsCollection.push(JSON.stringify(newCollection))

      App.storage.set('collection', lsCollection)
    } else {
      
      App.$el.alert
        .empty()
        .addClass('show')
        .html('Missing some form data bro')

      setTimeout(function() {
        App.$el.alert.removeClass('show');
      }, 2500)
    }


    // Re-render list
    App.displayCollection();

  };



  App.displayCollection = function() {
    
    App.$el.collection.empty();

    // init localStorage
    var ls = localStorage || window.localStorage;

    if ( !ls.getItem('collection') || ls.getItem('collection') == '' || ls.getItem('collection') == null ) {
      if ( App.config.debug ) { console.log('localStorage item "collection" not set.')}
      ls.setItem('collection', [])
    }

    var lsCollection = App.storage.get('collection');

      if ( lsCollection ) {
        lsCollection.forEach( function (item, index) {

        var data = $.parseJSON(item);
            data = data.time_stamp;

        App.$el.collection.append('\
          <div class="btn btn-default btn-nofloat collection-item"> \
            <div class="inline-block collection-item--buy_ppu">'+ data['input-buy_ppu'].toString() +'</div> \
            <div class="inline-block"> ⇉ </div> \
            <div class="inline-block collection-item--sell_ppu">'+ data['input-sell_ppu'].toString() +'</div> \
            <div class="collection-item--modifier" style="display:none;">'+ data['input-modifier'].toString() +'</div> \
          </div> \
        ');

      })

    }

    // Rebind 
    App.loadCollectionItem();


  };


  /**
   * Load Collection Item
   */
  App.loadCollectionItem = function() {

    App.$el.collection.find('.collection-item').click(function (event) {

      var $this     = $(this),
          buy_ppu   = $this.find('.collection-item--buy_ppu').text(),
          sell_ppu  = $this.find('.collection-item--sell_ppu').text(),
          modifier  = $this.find('.collection-item--modifier').text();

      var modifier_id  = modifier.replace('.', '')


      App.$el.form.buy_ppu.val(buy_ppu);
      App.$el.form.sell_ppu.val(sell_ppu);


      App.$el.form.self.find('input[type="radio"]').prop('checked', false)
      App.$el.form.self.find('#modifier-'+modifier_id).prop('checked', true)

      // App.$el.form.self.submit();
      
      App.processForm();
    })


  };


  /**
   * Clear Collection
   */
  App.clearCollection = function() {

    App.$el.collection.empty();

    // init localStorage
    var ls = localStorage || window.localStorage;

    App.storage.set('collection', []);


  }


  /**
   * Storage
   */
   App.storage = {
       set: function (key, value) {
           window.localStorage.setItem( key, JSON.stringify(value) );
       },
       get: function (key) {
           try {
               return JSON.parse( window.localStorage.getItem(key) );
           } catch (e) {
               return null;
           }
       }
   };




  /**
   * Serialize Object
   */
  $.fn.serializeObject = function()
  {
     var o = {};
     var a = this.serializeArray();
     $.each(a, function() {
         if (o[this.name]) {
             if (!o[this.name].push) {
                 o[this.name] = [o[this.name]];
             }
             o[this.name].push(this.value || '');
         } else {
             o[this.name] = this.value || '';
         }
     });
     return o;
  };


  /**
   * Create Range
   */
  Number.prototype.createNumRange = function()
  {
      var num = this,
          num_temp = num,
          arr = [];

      for ( var x = 0; x<5; x++ ) {
        arr[5-x] = (num_temp-=0.001).toPrecision(4);
      }
      arr[6] = num.toPrecision(4);
      for ( var x = 0; x<5; x++ ) {
        arr[7+x] = (num+=0.001).toPrecision(4);
      }

      return arr;
  };



  App.displayCharts = function() {

    App.createFixedSellPPUChart();
    App.createFixedBuyPPUChart();

    
  }


  App.createFixedBuyPPUChart = function() {


    if ( App.data.form_data && App.data.form_data !== undefined ) {
      
      var buy_ppu       = parseFloat($('#input-buy_ppu').val());
      var sell_ppu      = parseFloat($('#input-sell_ppu').val());
      var modifier      = parseFloat($('input[type="radio"]:checked').val());

      var num                = sell_ppu,
          num_temp           = num,
          sell_ppu_arr        = [],
          net_percentage_arr = [],
          buy_ppu_arr        = [];

      for ( var x = 0; x<11; x++ ) {
        buy_ppu_arr[x] = buy_ppu
      }

      for ( var x = 0; x<5; x++ ) {

        var new_num = (num_temp-=0.001).toPrecision(2);

        sell_ppu_arr[4-x] = new_num;

        var A = Math.round((new_num * modifier * 0.9)*10000)/10;
        var B = Math.round(buy_ppu*10000)/10;

        net_percentage_arr[4-x] = getPercentage(A, B);
      }

      sell_ppu_arr[5] = num.toPrecision(2);

      var A = Math.round((num * modifier * 0.9)*10000)/10;
      var B = Math.round(buy_ppu*10000)/10;

      net_percentage_arr[5]  = getPercentage(A, B);


      for ( var x = 0; x<5; x++ ) {

        var new_num = (num+=0.001).toPrecision(2);

        sell_ppu_arr[6+x] = new_num;

        var A = Math.round((new_num * modifier * 0.9)*10000)/10;
        var B = Math.round(buy_ppu*10000)/10;

        net_percentage_arr[6+x] = getPercentage(A, B);


      }

      /**
       * Fixed Sell PPU
       */
      var fixed_sell_ppu = App.createChart(App.$el.charts.canvas__buy_ppu, {
        labels: sell_ppu_arr,
        datasets: [
          {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: buy_ppu_arr
          },
          {
            label: "My third dataset",
            fillColor: "rgba(219, 94, 94,0.2)",
            strokeColor: "rgba(219, 94, 94,0.8)",
            pointColor: "rgba(219, 94, 94,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: net_percentage_arr
          }
        ]
      });

    }


  };



  /**
   * Fixed Sell PPU Chart
   */
  App.createFixedSellPPUChart = function() {


    if ( App.data.form_data && App.data.form_data !== undefined ) {
      
      var buy_ppu       = parseFloat($('#input-buy_ppu').val());
      var sell_ppu      = parseFloat($('#input-sell_ppu').val());
      var modifier      = parseFloat($('input[type="radio"]:checked').val());
          // buy_ppu_range = buy_ppu.createNumRange()

      var num                = buy_ppu,
          num_temp           = num,
          buy_ppu_arr        = [],
          net_percentage_arr = [],
          sell_ppu_arr       = [];

      for ( var x = 0; x<11; x++ ) {
        sell_ppu_arr[x] = sell_ppu
      }

      for ( var x = 0; x<5; x++ ) {

        var new_num = (num_temp-=0.001).toPrecision(2);

        buy_ppu_arr[4-x] = new_num;

        var A = Math.round((sell_ppu * modifier * 0.9)*10000)/10;
        var B = Math.round(new_num*10000)/10;

        net_percentage_arr[4-x] = getPercentage(A, B);
      }


      buy_ppu_arr[5] = num.toPrecision(2);

      var A = Math.round((sell_ppu * modifier * 0.9)*10000)/10;
      var B = Math.round(buy_ppu*10000)/10;

      net_percentage_arr[5]  = getPercentage(A, B);


      for ( var x = 0; x<5; x++ ) {

        var new_num = (num+=0.001).toPrecision(2);

        buy_ppu_arr[6+x] = new_num;

        var A = Math.round((sell_ppu * modifier * 0.9)*10000)/10;
        var B = Math.round(new_num*10000)/10;

        net_percentage_arr[6+x] = getPercentage(A, B);


      }

      /**
       * Fixed Sell PPU
       */
      var fixed_sell_ppu = App.createChart(App.$el.charts.canvas__sell_ppu, {
        labels: buy_ppu_arr,
        datasets: [
          {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: sell_ppu_arr
          },
          {
            label: "My third dataset",
            fillColor: "rgba(219, 94, 94,0.2)",
            strokeColor: "rgba(219, 94, 94,0.8)",
            pointColor: "rgba(219, 94, 94,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: net_percentage_arr
          }
        ]
      });

    }


  };



  /**
   * Chart JS
   */
  App.createChart = function(canvas_el, data, options) {

    var ctx = canvas_el;


    if ( options == null || options == undefined ) {

      options = {

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,

        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth : 1,

        //Boolean - Whether the line is curved between points
        bezierCurve : false,

        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot : true,

        //Number - Radius of each point dot in pixels
        pointDotRadius : 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true,

        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
      }
    }

    return new Chart(ctx).Line(data, options);

  }



  function getPercentage(y, x, neg) {
       
     if ( neg ) {
      return -(100*(y-x)/x);
     } else {
      return 100*(y-x)/x;
     }
  }


  Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == deleteValue) {         
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };





  /**
   * DOM Ready
   */
  $(document).ready(function() {
    App.init();
  })



})(jQuery);