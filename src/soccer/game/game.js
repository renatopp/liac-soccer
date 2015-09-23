(function() {
  'use strict';

  var Game = function() {
    this.stage = null;
    this.world = null;
    this.objects = [];
    this.time = 0;
  }

  Game.prototype.initialize = function() {
    // CREATEJS ---------------------------------------------------------------
    this.stage = new createjs.Stage('game');
    var w = this.stage.canvas.width;
    var h = this.stage.canvas.height;

    this.stage.x = w/2;
    this.stage.y = h/2;

    // PHYSICS ----------------------------------------------------------------
    this.world = new p2.World({
      solver: new p2.GSSolver({iterations:128}),
      gravity: [0, 0]
    })

    // GAME -------------------------------------------------------------------
    // outer obstacles
    this.addObject(new Obstacle(1050, 0, 100, 2000));
    this.addObject(new Obstacle(-1050, 0, 100, 2000));

    // inner obstacles
    this.addObject(new Obstacle(0, -725, 1900, 50));
    this.addObject(new Obstacle(0, 725, 1900, 50));
    this.addObject(new Obstacle(-975, -500, 50, 500));
    this.addObject(new Obstacle(-975, 500, 50, 500));
    this.addObject(new Obstacle(975, -500, 50, 500));
    this.addObject(new Obstacle(975, 500, 50, 500));

    // goal
    this.addObject(new Goal(-975, 0, 50, 500));
    this.addObject(new Goal(975, 0, 50, 500));

    // objects
    this.ball = new Ball(0, 0, 10);
    this.robot1 = new Robot(1, -500, 0, 100);
    this.robot2 = new Robot(2, 500, 0, 100);
    this.addObject(this.ball);
    this.addObject(this.robot1);
    this.addObject(this.robot2);

    // PHYSICAL MATERIALS -----------------------------------------------------
    var create_material = function(w, m1, m2, f, r) {
      w.addContactMaterial(new p2.ContactMaterial(m1, m2, {
        friction    : f,
        restitution : r
      }));
    }

    var w = this.world;
    for (var i=0; i<this.objects.length; i++) {
      var obj = this.objects[i];
      if (obj.physical_material) {
        create_material(w, obj.physical_material, this.ball.physical_material, 0, 1);
        create_material(w, obj.physical_material, this.robot1.physical_material, 0, .9);
        create_material(w, obj.physical_material, this.robot2.physical_material, 0, .9);
      }
    }

    // CONTACT
    this.world.on("beginContact", function(event) {
      var a = event.bodyA.label;
      var b = event.bodyB.label;
      if (a=='ball' && b=='goal' || a=='goal' && b=='ball') {
        console.log('GOAL!')
      }
    });

  }

  Game.prototype.addObject = function(object) {
    this.objects.push(object);

    this.stage.addChild(object.display_object);
    this.world.addBody(object.physical_object);

    if (object.vehicle) {
      object.vehicle.addToWorld(this.world);
    }
  }

  Game.prototype.reset = function() {

  }

  Game.prototype.update = function(tick) {
    this.time += tick;

    for (var i=0; i<this.objects.length; i++) {
      this.objects[i].update();
    }
    this.world.step(tick, 0, 128);
    this.stage.update();

    // TESTE
    var steer = (1000-this.stage.mouseX)/1000;
    var force = -(750-this.stage.mouseY)/15;
    this.robot1.act(force, steer);

  }

  window.Game = Game;

})()