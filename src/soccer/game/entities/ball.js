(function() {
  'use strict';

  var Ball = function(x, y, r) {
    var s_color = app.config.display.ball_color;
    var s_scale = app.config.physics.scale;
    var s_damping = app.config.physics.ball_damping;
    var s_mass = app.config.physics.ball_mass;

    this.display_object = null;
    this.physical_object = null;

    // DISPLAY OBJECT ---------------------------------------------------------
    this.display_object = new createjs.Shape();
    this.display_object.graphics.f(s_color).dc(0, 0, r);
    this.display_object.x = x;
    this.display_object.x = y;
    // ------------------------------------------------------------------------

    // PHYSICS ----------------------------------------------------------------
    this.physical_object = new p2.Body({
      mass     : s_mass,
      position : [x/s_scale, y/s_scale]
    });
    var shape = new p2.Circle({radius:r/s_scale});
    shape.material = new p2.Material();

    this.physical_object.label = 'ball';
    this.physical_object.damping = s_damping;
    this.physical_object.addShape(shape);
    this.physical_material = shape.material;
    // ------------------------------------------------------------------------
  }
  
  Ball.prototype.update = function() {
    var s_scale = app.config.physics.scale;

    this.display_object.x = this.physical_object.position[0]*s_scale;
    this.display_object.y = this.physical_object.position[1]*s_scale;
    this.display_object.rotation = this.physical_object.angle;
  }

  window.Ball = Ball;
})();