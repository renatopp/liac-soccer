var gui;
var win;
var app;

function run() {
  var config;

  if (window.require) {
    gui = require('nw.gui');
    win = gui.Window.get();

    var fs = require('fs');
    config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
  }

  app = new App(config||stub_config);
  app.initialize();
}

var stub_config = {
  "game": {

  },

  "display": {
    "robot1_color"   : "blue",
    "robot2_color"   : "white",
    "obstacle_color" : "green",
    "ball_color"     : "red",
    "goal_color"     : "yellow",
    "line_width"     : 2
  },

  "physics": {
    "scale"                      : 100,
    "ball_damping"               : 0.0,
    "ball_friction"              : 0,
    "ball_restitution"           : 1,
    "robot_max_force"            : 50,
    "robot_max_force_inverse"    : 25,
    "robot_max_steer"            : 1,
    "robot_max_velocity"         : 5,
    "robot_max_angular_velocity" : 5,
    "robot_damping"              : 0.0,
    "robot_friction"             : 0,
    "robot_restitution"          : 0.9
  },

  "network": {
    "robot1_ip"   : "127.0.0.1",
    "robot1_port" : 50100,
    "robot2_ip"   : "127.0.0.1",
    "robot2_port" : 50200
  }
}
