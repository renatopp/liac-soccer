// GLOBALS ====================================================================
var soccer = {};
var desktop = {};
var gui = {};
var app;
var config;
var logger;
var stats;
// ============================================================================

// INITIALIZE ENVIRONMENT =====================================================
// If is running in nodejs
if (window.require) {
  // nodejs modules
  desktop.gui = require('nw.gui');
  desktop.fs  = require('fs');
  desktop.net = require('net');
  desktop.io  = require('socket.io');

  // node-webkit variables
  desktop.win = desktop.gui.Window.get();

  // configuration
  config = JSON.parse(desktop.fs.readFileSync('config.json', 'utf-8'));

// If is running in browser (for tests)
} else {
  desktop = null;
  config  = get_stub_config();
}
// ============================================================================

// GRAB GUI ELEMENTS ==========================================================
function _register_gui() {
  gui.score1      = $(document.getElementById('score-1'));
  gui.score2      = $(document.getElementById('score-2'));
  gui.name1       = $(document.getElementById('name-1'));
  gui.name2       = $(document.getElementById('name-2'));
  gui.status1     = $(document.getElementById('status-2'));
  gui.status2     = $(document.getElementById('status-2'));
  gui.btn_play    = $(document.getElementById('btn-play'));
  gui.btn_pause   = $(document.getElementById('btn-pause'));
  gui.btn_stop    = $(document.getElementById('btn-stop'));
  gui.btn_reset   = $(document.getElementById('btn-reset'));
  gui.btn_invert  = $(document.getElementById('btn-invert'));
  gui.btn_newgame = $(document.getElementById('btn-newgame'));
}
// ============================================================================

function run() {
  _register_gui();
  logger = new soccer.Logger();
  stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '5px';
  stats.domElement.style.bottom = '5px';
  document.body.appendChild(stats.domElement);

  // logging
  if (desktop) {
    logger.info('Running on desktop version.');
  } else {
    logger.info('Running on browser.');
    logger.warn('Brower is used only for tests during development. ' +
                "Some feature won't work correctly.");
  }

  // initialize everything
  app = new soccer.App();
  app.initialize();
}

function get_stub_config() {
  return {
    "game": {
    },

    "display": {
      "fps"            : 600,
      "robot1_color"   : "blue",
      "robot2_color"   : "white",
      "obstacle_color" : "green",
      "ball_color"     : "red",
      "goal_color"     : "yellow",
      "line_width"     : 2
    },

    "debug" : {
      "show_robot1_sensors": false,
      "show_robot2_sensors": false
    },

    "physics": {
      "scale"                      : 100,
      "gs_iterations"              : 128,
      "substeps"                   : 128,
      "ball_mass"                  : 1,
      "ball_damping"               : 0.5,
      "ball_friction"              : 0,
      "ball_restitution"           : 1,
      "robot_force"                : 50,
      "robot_max_force"            : 1,
      "robot_max_force_inverse"    : 0.5,
      "robot_max_steer"            : 1,
      "robot_max_velocity"         : 8,
      "robot_max_angular_velocity" : 5,
      "robot_wheel_friction"       : 400,
      "robot_mass"                 : 10,
      "robot_damping"              : 0.0,
      "robot_friction"             : 0,
      "robot_restitution"          : 0.9
    },

    "network": {
      "host"            : "127.0.0.1",
      "port"            : 50100,
      "max_connections" : 2
    }
  };
}