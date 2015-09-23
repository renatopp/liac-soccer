(function() {
  'use strict';

  var Robot = function(id, x, y, r) {
    // Initialization
    this.id                 = id;
    this.display_object     = null;
    this.display_chassis    = null;
    this.display_frontwheel = null;
    this.display_backwheel  = null;
    this.physical_object    = null;
    this.physical_material  = null;
    this.chassis            = null;
    this.vehicle            = null;

    // Settings
    var s_color   = app.config.display['robot'+id+'_color'];
    var s_line    = app.config.display.line_width;
    var s_scale   = app.config.physics.scale;
    var s_damping = app.config.physics.robot_damping;
    var s_mass    = app.config.physics.robot_mass;


    // DISPLAY OBJECT ---------------------------------------------------------
    this.display_chassis = new createjs.Shape();
    this.display_chassis.graphics
        .ss(s_line)
        .s(s_color)
        .r(-r/2, -r/2, r, r)
        .mt(0, 0)
        .lt(0, -r/2)
    
    this.display_frontwheel = new createjs.Shape();
    this.display_frontwheel.graphics.f('red').r(-5, -10, 10, 20);
    this.display_frontwheel.y = -r/2+5;

    this.display_backwheel = new createjs.Shape();
    this.display_backwheel.graphics.f('pink').r(-5, -10, 10, 20);
    this.display_backwheel.y = r/2-25;

    this.display_object = new createjs.Container();
    this.display_object.addChild(this.display_frontwheel);
    this.display_object.addChild(this.display_backwheel);
    this.display_object.addChild(this.display_chassis);
    this.display_object.x = x;
    this.display_object.x = y;
    // ------------------------------------------------------------------------

    // PHYSICS ----------------------------------------------------------------
    this.chassis = new p2.Body({
      mass     : s_mass,
      position : [x/s_scale, y/s_scale]
    });
    var shape = new p2.Box({width:r/s_scale, height:r/s_scale});
    shape.material = new p2.Material();
    this.chassis.addShape(shape);

    this.vehicle = new p2.TopDownVehicle(this.chassis);
    this.front_wheel = this.vehicle.addWheel({localPosition:[0, r/s_scale/2]});
    this.front_wheel.setSideFriction(400);
    this.back_wheel = this.vehicle.addWheel({localPosition:[0, -r/s_scale/2]});
    this.back_wheel.setSideFriction(400);
    
    this.physical_object = this.chassis;
    this.physical_object.label = 'robot';
    this.physical_object.damping = s_damping;
    this.physical_material = shape.material;
    // ------------------------------------------------------------------------
  }
  
  Robot.prototype.update = function() {
    // Settings
    var s_scale     = app.config.physics.scale;
    var s_maxvel    = app.config.physics.robot_max_velocity;
    var s_maxangvel = app.config.physics.robot_max_angular_velocity;

    // Climp velocity
    var vx = this.physical_object.velocity[0];
    var vy = this.physical_object.velocity[1];
    var norm = Math.sqrt(vx*vx, vy*vy);
    if (norm && norm > s_maxvel) {
      var scale = s_maxvel/norm;
      this.physical_object.velocity = [vx*scale, vy*scale];
    }

    // Climp angular velocity
    var a = this.physical_object.angularVelocity;
    var ma = s_maxangvel;
    this.physical_object.angularVelocity = Math.max(Math.min(a, ma), -ma);

    // Update visual
    this.display_object.x = this.physical_object.position[0]*s_scale;
    this.display_object.y = this.physical_object.position[1]*s_scale;
    this.display_object.rotation = this.physical_object.angle*(180/Math.PI);
    this.display_frontwheel.rotation = -this.front_wheel.steerValue*(180/Math.PI);
  }

  Robot.prototype.act = function(force, steer) {
    var s_maxforce = app.config.physics.robot_max_force;
    var s_maxsteer = app.config.physics.robot_max_steer;

    this.front_wheel.steerValue = Math.max(Math.min(steer, 1), -1);
    this.front_wheel.engineForce = force;
  }

  window.Robot = Robot;
})();