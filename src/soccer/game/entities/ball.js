(function() {
  'use strict';

  var Ball = function(x, y, r) {
    this.display_object = null;
    this.physical_object = null;
    this.physical_material = null;

    // variables
    var color = config.display.ball_color;
    var scale = config.physics.scale;
    var damping = config.physics.ball_damping;
    var mass = config.physics.ball_mass;

    // DISPLAY OBJECT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    this.display_object = new createjs.Shape();
    this.display_object.x = x;
    this.display_object.x = y;
    this.display_object.graphics
                          .beginFill(color)
                          .drawCircle(0, 0, r);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // PHYSICS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var position = [x/scale, y/scale];
    var radius = r/scale;
    
    // shape
    var shape = new p2.Circle({radius:radius});

    // material
    shape.material = new p2.Material();
    this.physical_material = shape.material;

    // body
    this.physical_object = new p2.Body({mass:mass, position:position});
    this.physical_object.label = 'ball';
    this.physical_object.damping = damping;
    this.physical_object.addShape(shape);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  }
  
  Ball.prototype.update = function() {
    var scale = config.physics.scale;
    this.display_object.x = this.physical_object.position[0]*scale;
    this.display_object.y = this.physical_object.position[1]*scale;
    this.display_object.rotation = this.physical_object.angle;
  }

  soccer.Ball = Ball;
})();