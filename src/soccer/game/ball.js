(function() {
  'use strict';

  var Ball = function(x, y, radius) {
    var color = app.config.display.ball_color;
    var scale = app.config.physics.scale;

    this.display_object = null;
    this.physical_object = null;

    // DISPLAY OBJECT ---------------------------------------------------------
    this.display_object = new createjs.Shape();
    this.display_object.graphics.f(color).dc(0, 0, radius);
    this.display_object.x = x;
    this.display_object.x = y;
    // ------------------------------------------------------------------------

    // PHYSICS ----------------------------------------------------------------
    this.physical_object = new p2.Body({mass:1, position:[x/scale, y/scale]});
    var shape = new p2.Circle({radius: radius/scale});
    shape.material = new p2.Material();

    this.physical_object.damping = 0.5;
    this.physical_object.label = 'ball';
    this.physical_object.addShape(shape);
    this.physical_material = shape.material;
    // ------------------------------------------------------------------------
  }
  
  Ball.prototype.update = function() {
    var scale = app.config.physics.scale;

    this.display_object.x = this.physical_object.position[0]*scale;
    this.display_object.y = this.physical_object.position[1]*scale;
    this.display_object.rotation = this.physical_object.angle;
  }

  window.Ball = Ball;
})();