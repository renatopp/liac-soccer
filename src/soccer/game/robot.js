(function() {
  'use strict';

  var Robot = function(id, x, y, r) {
    var color = app.config.display['robot'+id+'_color'];
    var line = app.config.display.line_width;
    var scale = app.config.physics.scale;

    this.id = id;
    this.display_object = null;
    this.physical_object = null;
    this.vehicle = null;

    // DISPLAY OBJECT ---------------------------------------------------------
    this.display_object = new createjs.Container();
    
    this.display_chassis = new createjs.Shape();
    this.display_chassis.graphics.ss(line).s(color).r(-r/2, -r/2, r, r).mt(0, 0).lt(0, -r/2)
    this.display_frontwheel = new createjs.Shape();
    this.display_frontwheel.graphics.f('red').r(-5, -10, 10, 20);
    this.display_frontwheel.y = -r/2+5;
    this.display_backwheel = new createjs.Shape();
    this.display_backwheel.graphics.f('pink').r(-5, -10, 10, 20);
    this.display_backwheel.y = r/2-25;

    this.display_object.addChild(this.display_frontwheel);
    this.display_object.addChild(this.display_backwheel);
    this.display_object.addChild(this.display_chassis);

    this.display_object.x = x;
    this.display_object.x = y;
    // ------------------------------------------------------------------------

    // PHYSICS ----------------------------------------------------------------
    this.chassis = new p2.Body({mass:10, position:[x/scale, y/scale]});
    var shape = new p2.Box({width:r/scale, height:r/scale});
    shape.material = new p2.Material();
    this.chassis.addShape(shape);

    this.vehicle = new p2.TopDownVehicle(this.chassis);
    this.front_wheel = this.vehicle.addWheel({localPosition: [0, r/scale/2]});
    this.front_wheel.setSideFriction(400);
    this.back_wheel = this.vehicle.addWheel({localPosition: [0, -r/scale/2]});
    this.back_wheel.setSideFriction(400);
    
    this.physical_object = this.chassis;
    this.physical_object.label = 'robot';
    this.physical_material = shape.material;
    // ------------------------------------------------------------------------


    // this.physical_object = new p2.Body({
    //   mass     : 10,
    //   position : [x/scale, y/scale]
    // });
    // var shape = new p2.Box({width:r/scale, height:r/scale});
    // this.physical_object.addShape(shape);
    // this.physical_object.damping = 0.5;
    // this.physical_object.angularDamping = 0.5;
  }
  
  Robot.prototype.update = function() {
    var scale = app.config.physics.scale;

    var a = this.physical_object.angularVelocity;
    this.physical_object.angularVelocity = Math.max(Math.min(a, 5), -5);

    this.display_object.x = this.physical_object.position[0]*scale;
    this.display_object.y = this.physical_object.position[1]*scale;
    this.display_object.rotation = this.physical_object.angle*(180/Math.PI);

    this.display_frontwheel.rotation = -this.front_wheel.steerValue*(180/Math.PI);
    // this.display_backwheel.rotation = -this.back_wheel.steerValue*(180/Math.PI);
  }

  Robot.prototype.act = function(force, steer) {
    this.front_wheel.steerValue = Math.max(Math.min(steer, 1), -1);
    this.front_wheel.engineForce = force;
    // this.back_wheel.steerValue = Math.max(Math.min(steer, 1), -1);
    // this.back_wheel.engineForce = force;
  }

  window.Robot = Robot;
})();