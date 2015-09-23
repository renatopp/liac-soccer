(function() {
  'use strict';

  var Obstacle = function(x, y, w, h) {
    var s_color = app.config.display.obstacle_color;
    var s_scale = app.config.physics.scale;
    var s_line  = app.config.display.line_width;

    this.display_object = null;
    this.physical_object = null;
    this.physical_shape = null;

    // DISPLAY OBJECT ---------------------------------------------------------
    this.display_object = new createjs.Shape();
    this.display_object.graphics.ss(s_line).s(s_color).r(-w/2, -h/2, w, h);
    this.display_object.x = x;
    this.display_object.x = y;
    // ------------------------------------------------------------------------

    // PHYSICS ----------------------------------------------------------------
    this.physical_object = new p2.Body({
        mass     : 0,
        position : [x/s_scale, y/s_scale]
    });
    var shape = new p2.Box({width:w/s_scale, height:h/s_scale});
    shape.material = new p2.Material();
    
    this.physical_object.label = 'obstacle';
    this.physical_object.addShape(shape);
    this.physical_material = shape.material;
    // ------------------------------------------------------------------------
  }
  
  Obstacle.prototype.update = function() {
    var s_scale = app.config.physics.scale;

    this.display_object.x = this.physical_object.position[0]*s_scale;
    this.display_object.y = this.physical_object.position[1]*s_scale;
    this.display_object.rotation = this.physical_object.angle;
  }

  window.Obstacle = Obstacle;
})()