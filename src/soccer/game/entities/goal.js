(function() {
  'use strict';

  var Goal = function(x, y, w, h) {
    this.display_object = null;
    this.physical_object = null;

    // variables
    var scale = config.physics.scale;
    var color = config.display.goal_color;
    var line = config.display.line_width;

    // DISPLAY OBJECT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    this.display_object = new createjs.Shape();
    this.display_object.x = x;
    this.display_object.x = y;
    this.display_object.graphics
                          .setStrokeStyle(line)
                          .beginStroke(color)
                          .drawRect(-w/2, -h/2, w, h);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // PHYSICS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var width = w/scale;
    var height = h/scale;
    var mass = 0;
    var position = [x/scale, y/scale];
    var collisionResponse = false;

    // shape
    var shape = new p2.Box({width:width, height:height});

    // body
    this.physical_object = new p2.Body({
      collisionResponse : collisionResponse,
      position : position,
      mass : mass,
    });
    this.physical_object.label = 'goal';
    this.physical_object.addShape(shape);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  }
  
  Goal.prototype.update = function() {
    var scale = config.physics.scale;
    this.display_object.x = this.physical_object.position[0]*scale;
    this.display_object.y = this.physical_object.position[1]*scale;
    this.display_object.rotation = this.physical_object.angle;
  }

  soccer.Goal = Goal;
})()