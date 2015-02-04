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

    $el : {

      canvas : document.getElementById('canvas')

    }

   
  };



  /**
   * Init
   */
  app.init = function () {
    
    app.rope()

  }


  

  /**
   * Physics
   */
  app.rope = function () {
    
    var renderer = Newton.GLRenderer(app.$el.canvas)

    var sim = Newton.Simulator({
      solve: [ Newton.PinConstraint, Newton.BoxConstraint, Newton.RopeConstraint ]
    })

    var gravity = Newton.LinearForce(7, Math.PI * 1.5)
    var container = Newton.BoxConstraint(0, 0, 400, 400)

    var prev, current;

    // build a string to dangle
    for (var i = 0; i < 30; i++) {

      // add a particle to the string
      current = sim.add(Newton.Particle(200 + i * 10, 100));

      // a PinConstraint pins the first Particle in place
      if (!prev) sim.add(Newton.PinConstraint(current));

      // a RopeConstraint attaches subsequent particles to the previous particle
      else sim.add(Newton.RopeConstraint(prev, current));

      prev = current;
    }

    renderer.render(sim);

    sim.add(gravity);
    sim.add(container);
    sim.start();
    

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