(function() {
  'use strict';

  var Robot = function(id, x, y, r) {
    this._i_x = x;
    this._i_y = y;

    this.id                 = id;
    this.display_object     = null;
    this.display_chassis    = null;
    this.display_frontwheel = null;
    this.display_backwheel  = null;
    this.physical_object    = null;
    this.physical_material  = null;
    this.chassis            = null;
    this.vehicle            = null;
    this.ray                = null;
    this.score              = 0;

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
    
    // ray casting
    this.display_ray = new createjs.Shape();
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


  /** Get robot readings about obstacles */
  Robot.prototype.get_sensors = function(world) {
    var sensors = {};

    var scale = config.physics.scale;
    var show_debug = config.debug['show_robot'+this.id+'_sensors'];

    // raycasting variables
    var ray = new p2.Ray({mode:p2.Ray.ALL});
    var angle = this.display_object.rotation;
    var from = [this.physical_object.position[0],
                this.physical_object.position[1]];
    var to = [from[0], from[1]-2500/scale]; // 25meters
    ray.from = from;

    // raycasting results
    var result = new p2.RaycastResult();
    var point = p2.vec2.create();
    var nearest_obstacle = null;
    var nearest_distance = null;
    ray.callback = function(r_) {
      if (r_.hasHit() && r_.body.label == 'obstacle') {

        // verify if the hit is in fact the closest hit
        var d = r_.getHitDistance(ray);
        if (d < nearest_distance) {
          r_.getHitPoint(point, ray);
          nearest_obstacle = [point[0], point[1]];
          nearest_distance = d;
        }
      }
    }

    // do the raycast around the robot (each 5 degrees)
    for (var i=0; i<360; i+=15) {
      // reset nearest information
      nearest_obstacle = null;
      nearest_distance = 100000000000;

      // compute the new end position (initial always start from robot center)
      var rangle = soccer.utils.to_radians(angle+i);
      ray.to = soccer.utils.rotate_point(to[0], to[1], rangle, from[0], from[1]);
      ray.update();
      
      // do the raycasting (p2 calls the ray.callback for each collision)
      world.raycast(result, ray);

      // update sensor info
      sensors[i] = Math.floor(nearest_distance*scale);

      if (show_debug) {
        this._draw_ray(ray);
        if (nearest_obstacle) {  
          this._draw_sensor(nearest_obstacle)
        }
      }
    }

    return sensors;
  }

  Robot.prototype._draw_ray = function(ray) {
    var color = config.display['robot'+this.id+'_color'];
    var scale = config.physics.scale;

    this.display_ray.graphics
      .setStrokeStyle(2)
      .beginStroke(color)
      .moveTo(ray.from[0]*scale, ray.from[1]*scale)
      .lineTo(ray.to[0]*scale, ray.to[1]*scale)
    this.display_ray.alpha = 0.5;
  }

  Robot.prototype._draw_sensor = function(p) {
    var color = config.display['robot'+this.id+'_color'];
    var scale = config.physics.scale;
    this.display_ray.graphics
      .beginFill(color)
      .drawCircle(p[0]*scale, p[1]*scale, 10)
  }

  Robot.prototype.reset = function() {
    var scale = config.physics.scale;
    this.display_object.x = this._i_x;
    this.display_object.y = this._i_y;
    this.display_object.rotation = 0;
    this.physical_object.position = [this._i_x/scale, this._i_y/scale];
    this.physical_object.angle = 0;
    this.physical_object.angularVelocity = 0;
    this.physical_object.velocity = [0, 0];
    this.front_wheel.engineForce = 0;
    this.front_wheel.steerValue = 0;
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
    var angle = this.physical_object.angle;
    this.display_object.x = this.physical_object.position[0]*scale;
    this.display_object.y = this.physical_object.position[1]*scale;
    this.display_object.rotation = soccer.utils.to_degrees(angle);

    this.display_ray.graphics.clear()
  }

  Robot.prototype.act = function(force, steer) {
    var mf = config.physics.robot_max_force;
    var mfi = config.physics.robot_max_force_inverse;
    var ms = config.physics.robot_max_steer;

    steer = soccer.utils.clamp(steer, -ms, ms);
    force = soccer.utils.clamp(force, -mfi, mf)*config.physics.robot_force;

    // notice that negative force goes forward (due to createjs canvas)
    this.front_wheel.steerValue = -steer;
    this.front_wheel.engineForce = -force;
  }

  soccer.Robot = Robot;
})();