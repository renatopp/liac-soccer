(function() {
  'use strict';

  var Goal = function(x, y, w, h) {
    var color = app.config.display.goal_color;
    var scale = app.config.physics.scale;
    var line  = app.config.display.line_width;

    this.display_object = null;
    this.physical_object = null;

    // DISPLAY OBJECT ---------------------------------------------------------
    this.display_object = new createjs.Shape();
    this.display_object.graphics.ss(line).s(color).r(-w/2, -h/2, w, h);
    this.display_object.x = x;
    this.display_object.x = y;
    // ------------------------------------------------------------------------

    // PHYSICS ----------------------------------------------------------------
    this.physical_object = new p2.Body({
      mass              : 0,
      position          : [x/scale, y/scale],
      collisionResponse : false,
    });
    var shape = new p2.Box({width:w/scale, height:h/scale});
    
    this.physical_object.label = 'goal';
    this.physical_object.addShape(shape);
    // ------------------------------------------------------------------------
  }
  
  Goal.prototype.update = function() {
    var scale = app.config.physics.scale;

    this.display_object.x = this.physical_object.position[0]*scale;
    this.display_object.y = this.physical_object.position[1]*scale;
    this.display_object.rotation = this.physical_object.angle;
  }

  window.Goal = Goal;
})()