(function() {
  'use strict';

  var Obstacle = function(x, y, w, h) {
    var color = app.config.display.obstacle_color;
    var scale = app.config.physics.scale;
    var line  = app.config.display.line_width;

    this.display_object = null;
    this.physical_object = null;
    this.physical_shape = null;

    // DISPLAY OBJECT ---------------------------------------------------------
    this.display_object = new createjs.Shape();
    this.display_object.graphics.ss(line).s(color).r(-w/2, -h/2, w, h);
    this.display_object.x = x;
    this.display_object.x = y;
    // ------------------------------------------------------------------------

    // PHYSICS ----------------------------------------------------------------
    this.physical_object = new p2.Body({mass:0, position:[x/scale, y/scale]});
    var shape = new p2.Box({width:w/scale, height:h/scale});
    shape.material = new p2.Material();
    
    this.physical_object.label = 'obstacle';
    this.physical_object.addShape(shape);
    this.physical_material = shape.material;
    // ------------------------------------------------------------------------
  }
  
  Obstacle.prototype.update = function() {
    var scale = app.config.physics.scale;

    this.display_object.x = this.physical_object.position[0]*scale;
    this.display_object.y = this.physical_object.position[1]*scale;
    this.display_object.rotation = this.physical_object.angle;
  }

  window.Obstacle = Obstacle;
})()