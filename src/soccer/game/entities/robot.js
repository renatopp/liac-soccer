(function() {
  'use strict';

  var Robot = function(id, x, y, r) {
    this.id                 = id;
    this.display_object     = null;
    this.display_chassis    = null;
    this.display_frontwheel = null;
    this.display_backwheel  = null;
    this.physical_object    = null;
    this.physical_material  = null;
    this.chassis            = null;
    this.vehicle            = null;

    // variables
    var color = config.display['robot'+id+'_color'];
    var line = config.display.line_width;
    var scale = config.physics.scale;
    var damping = config.physics.robot_damping;
    var mass = config.physics.robot_mass;
    var friction = config.physics.robot_wheel_friction;

    // DISPLAY OBJECT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // chassis
    this.display_object = new createjs.Shape();
    this.display_object.x = x;
    this.display_object.x = y;
    this.display_object.graphics
                          .setStrokeStyle(line)
                          .beginStroke(color)
                          .drawRect(-r/2, -r/2, r, r)
                          .moveTo(0, 0)
                          .lineTo(0, -r/2);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // PHYSICS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // variables
    var width = r/scale;
    var height = width;
    var position = [x/scale, y/scale];
    var front_wheel_pos = [0, height/2];
    var back_wheel_pos = [0, -height/2];

    // shape
    var shape = new p2.Box({width:width, height:height});

    // material
    shape.material = new p2.Material();
    this.physical_material = shape.material;

    // body (chassis)
    this.physical_object = new p2.Body({mass:mass, position:position});
    this.physical_object.label = 'robot';
    this.physical_object.damping = damping;
    this.physical_object.addShape(shape);

    // vehicle
    this.vehicle = new p2.TopDownVehicle(this.physical_object);
    
    // front wheel
    this.front_wheel = this.vehicle.addWheel({localPosition:front_wheel_pos});
    this.front_wheel.setSideFriction(friction);

    // back wheel
    this.back_wheel = this.vehicle.addWheel({localPosition:back_wheel_pos});
    this.back_wheel.setSideFriction(friction);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  }
  
  Robot.prototype.update = function() {
    // variables
    var scale     = config.physics.scale;
    var maxvel    = config.physics.robot_max_velocity;
    var maxangvel = config.physics.robot_max_angular_velocity;

    // clamp velocity
    var vx = this.physical_object.velocity[0];
    var vy = this.physical_object.velocity[1];
    var norm = Math.sqrt(vx*vx, vy*vy);
    if (norm && norm > maxvel) {
      var ratio = maxvel/norm;
      this.physical_object.velocity = [vx*ratio, vy*ratio];
    }

    // clamp angular velocity
    var a = this.physical_object.angularVelocity;
    var ma = maxangvel;
    this.physical_object.angularVelocity = Math.max(Math.min(a, ma), -ma);

    // Update visual
    this.display_object.x = this.physical_object.position[0]*scale;
    this.display_object.y = this.physical_object.position[1]*scale;
    this.display_object.rotation = this.physical_object.angle*(180/Math.PI);
  }

  Robot.prototype.act = function(force, steer) {
    var mf = config.physics.robot_max_force;
    var mfi = config.physics.robot_max_force_inverse;
    var ms = config.physics.robot_max_steer;

    // notice that negative force goes forward (due to createjs canvas)
    this.front_wheel.steerValue = Math.max(Math.min(steer, ms), -ms);
    this.front_wheel.engineForce = Math.max(Math.min(force, mfi), -mf);
  }

  soccer.Robot = Robot;
})();