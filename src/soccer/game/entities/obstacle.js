(function() {
  'use strict';

  var Obstacle = function(x, y, w, h) {
    this.display_object = null;
    this.physical_object = null;
    this.physical_shape = null;

    // variables
    var color = config.display.obstacle_color;
    var scale = config.physics.scale;
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
    // variables
    var width = w/scale;
    var height = h/scale;
    var position = [x/scale, y/scale];
    var mass = 0;

    // shape
    var shape = new p2.Box({width:width, height:height});
    
    // material
    shape.material = new p2.Material();
    this.physical_material = shape.material;
    
    // body
    this.physical_object = new p2.Body({mass:mass, position:position});
    this.physical_object.label = 'obstacle';
    this.physical_object.addShape(shape);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  }
  
  Obstacle.prototype.update = function() {
    var scale = config.physics.scale;
    this.display_object.x = this.physical_object.position[0]*scale;
    this.display_object.y = this.physical_object.position[1]*scale;
    this.display_object.rotation = this.physical_object.angle;
  }

  soccer.Obstacle = Obstacle;
})()