(function() {
  'use strict';

  /**
   * Game handles simulation and canvas display.
   */
  var Game = function() {
    // createjs display
    this.stage   = null;
    
    // p2js physics world
    this.world   = null;
    
    // list of all objects in the screen
    this.objects = [];
    
    // shortcuts
    this.ball    = null;
    this.robot1  = null;
    this.robot2  = null;
  }

  /* Initialize display and physics */
  Game.prototype.initialize = function() {

    this._initialize_display();
    this._initialize_physics_base();
    this._initialize_objects();
    this._initialize_physics_materials();
    this._initialize_physics_collisions();
  }
  
  // INTIALIZATIONS -----------------------------------------------------------
  /** Initialize CreateJS objects */
  Game.prototype._initialize_display = function() {
    this.stage = new createjs.Stage('game');

    // move stage so (0, 0) can be at the center of the screen;
    this.stage.x = this.stage.canvas.width/2;
    this.stage.y = this.stage.canvas.height/2;
  }

  /** Initialize P2JS world */
  Game.prototype._initialize_physics_base = function() {
    // variables
    var solver = new p2.GSSolver({
      iterations : config.physics.gs_iterations
    });
    var gravity = [0, 0]; 

    // create world
    this.world = new p2.World({solver:solver, gravity:gravity});
  }

  /** Initialize game objects */
  Game.prototype._initialize_objects = function() {
    // outer obstacles (doesnt let the ball leave the screen behind the goal)
    this._addObject(new soccer.Obstacle(1050, 0, 100, 2000));
    this._addObject(new soccer.Obstacle(-1050, 0, 100, 2000));

    // inner obstacles (all visible objects)
    this._addObject(new soccer.Obstacle(0, -725, 1900, 50));
    this._addObject(new soccer.Obstacle(0, 725, 1900, 50));
    this._addObject(new soccer.Obstacle(-975, -500, 50, 500));
    this._addObject(new soccer.Obstacle(-975, 500, 50, 500));
    this._addObject(new soccer.Obstacle(975, -500, 50, 500));
    this._addObject(new soccer.Obstacle(975, 500, 50, 500));

    // goals
    this._addObject(new soccer.Goal(-975, 0, 50, 500));
    this._addObject(new soccer.Goal(975, 0, 50, 500));

    // objects
    this.ball = new soccer.Ball(0, 0, 10);
    this._addObject(this.ball);

    this.robot1 = new soccer.Robot(1, -500, 0, 100);
    this._addObject(this.robot1);

    this.robot2 = new soccer.Robot(2, 500, 0, 100);
    this._addObject(this.robot2);
  }

  /** Add a game object to the game. */
  Game.prototype._addObject = function(object) {
    this.objects.push(object);

    // register object on the createjs stage
    this.stage.addChild(object.display_object);

    // register object on the p2js world
    this.world.addBody(object.physical_object);

    // robots have special code due to the p2js vehicle object
    if (object.vehicle) {
      object.vehicle.addToWorld(this.world);
    }
  }

  /** Set up friction and bounceness among objects */
  Game.prototype._initialize_physics_materials = function() {
    // Variables
    var rf = config.physics.robot_friction;
    var rr = config.physics.robot_restitution;
    var bf = config.physics.ball_friction;
    var br = config.physics.ball_restitution;

    // Set
    for (var i=0; i<this.objects.length; i++) {
      var m = this.objects[i].physical_material;
      if (m) {
        this._create_material(this.ball.physical_material, m, bf, br);
        this._create_material(this.robot1.physical_material, m, rf, rr);
        this._create_material(this.robot2.physical_material, m, rf, rr);
      }
    }
  }

  /** Create and add material in the world */
  Game.prototype._create_material = function(m1, m2, f, r) {
    this.world.addContactMaterial(
      new p2.ContactMaterial(m1, m2, {friction:f, restitution:r})
    );
  }

  /** Set up collision callbacks */
  Game.prototype._initialize_physics_collisions = function() {
    this.world.on("beginContact", function(event) {
      var a = event.bodyA.label;
      var b = event.bodyB.label;

      // if collision between ball and goal
      if (a=='ball' && b=='goal' || a=='goal' && b=='ball') {
        // TODO: set up this call
        console.log('GOAL!');
      }
    });
  }
  // --------------------------------------------------------------------------


  Game.prototype.reset = function() {

  }

  /** Update the display and game simulation */
  Game.prototype.update = function(tick) {

    // update all game objects
    for (var i=0; i<this.objects.length; i++) {
      this.objects[i].update();
    }

    // update physics
    this.world.step(tick, 0, config.physics.substeps);

    // update display
    this.stage.update();

    // TODO: remove this
    var steer = (1000-this.stage.mouseX)/1000;
    var force = -(750-this.stage.mouseY)/15;
    this.robot1.act(force, steer);
  }

  soccer.Game = Game;

})()