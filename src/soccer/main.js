// GLOBALS ====================================================================
var soccer = {};
var desktop = {};
var gui = {};
var app;
var config;
var logger;
var stats;
// ============================================================================

function run() {
  _initialize_desktop();
  _initialize_gui();
  _initialize_subsystems();
  _initialize_canvas_resize();
  _initialize_app();
  _hide_splash();
}

/** Set up environment variables */
function _initialize_desktop() {
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
    config  = _get_stub_config();
  }
}

/** Grab and set up DOM elements */
function _initialize_gui() {
  gui.score1             = $('*[id="score-1"]');
  gui.score2             = $('*[id="score-2"]');
  gui.name1              = $('*[id="name-1"]');
  gui.name2              = $('*[id="name-2"]');
  gui.status1            = $('*[id="status-1"]');
  gui.status2            = $('*[id="status-2"]');
  gui.simulation_speed   = $('*[id="simulation-speed"]');
  gui.btn_newgame        = $('*[id="btn-newgame"]');
  gui.btn_play           = $('*[id="btn-play"]');
  gui.btn_pause          = $('*[id="btn-pause"]');
  gui.btn_stop           = $('*[id="btn-stop"]');
  gui.btn_reset          = $('*[id="btn-reset"]');
  gui.btn_randomreset    = $('*[id="btn-randomreset"]');
  gui.btn_invert         = $('*[id="btn-invert"]');
  gui.btn_exit           = $('*[id="btn-exit"]');
  gui.btn_togglesensors1 = $('*[id="btn-toggle-sensors1"]');
  gui.btn_togglesensors2 = $('*[id="btn-toggle-sensors2"]');
  gui.btn_documentation  = $('*[id="btn-documentation"]');
  gui.btn_about          = $('*[id="btn-about"]');

  // Set click events and avoid click while disabled
  gui.btn_newgame.click(function() {
    if ($(this).attr('disabled') !== 'disabled') {
      app.do_newgame();
    }
  });
  gui.btn_play.click(function() {
    if ($(this).attr('disabled') !== 'disabled') {
      app.do_play();
    }
  });
  gui.btn_pause.click(function() {
    if ($(this).attr('disabled') !== 'disabled') {
      app.do_pause();
    }
  });
  gui.btn_stop.click(function() {
    if ($(this).attr('disabled') !== 'disabled') {
      app.do_stop();
    }
  });
  gui.btn_reset.click(function() {
    if ($(this).attr('disabled') !== 'disabled') {
      app.do_reset();
    }
  });
  gui.btn_randomreset.click(function() {
    if ($(this).attr('disabled') !== 'disabled') {
      app.do_randomreset();
    }
  });
  gui.btn_invert.click(function() {
    if ($(this).attr('disabled') !== 'disabled') {
      app.do_invert();
    }
  });
  gui.btn_togglesensors1.click(function() {
    config.debug.show_robot1_sensors = !config.debug.show_robot1_sensors;
  });
  gui.btn_togglesensors2.click(function() {
    config.debug.show_robot2_sensors = !config.debug.show_robot2_sensors;
  });
  gui.btn_exit.click(function() {
    desktop.gui.App.quit();
  });
  gui.btn_documentation.click(function() {
    desktop.gui.Shell.openExternal('http://inf.ufrgs.br/~rppereira/docs/liac-soccer/');
  });
  gui.simulation_speed.change(function(e) {
    config.physics.simulation_speed = $(e.target).val();
  });


  // remove focus from buttons so they do not change colors (bue to bootstrap)
  gui.btn_newgame.focus(function() {
    var self = $(this);
    setTimeout(function() { self.blur() }, 100);
  });
  gui.btn_play.focus(function() {
    var self = $(this);
    setTimeout(function() { self.blur() }, 100);
  });
  gui.btn_pause.focus(function() {
    var self = $(this);
    setTimeout(function() { self.blur() }, 100);
  });
  gui.btn_stop.focus(function() {
    var self = $(this);
    setTimeout(function() { self.blur() }, 100);
  });
  gui.btn_reset.focus(function() {
    var self = $(this);
    setTimeout(function() { self.blur() }, 100);
  });
  gui.btn_randomreset.focus(function() {
    var self = $(this);
    setTimeout(function() { self.blur() }, 100);
  });
  gui.btn_invert.focus(function() {
    var self = $(this);
    setTimeout(function() { self.blur() }, 100);
  });
  gui.simulation_speed.keypress(function (evt) {
    evt.preventDefault();
  });

  // button states
  gui.btn_play.attr('disabled', 'disabled');
  gui.btn_pause.attr('disabled', 'disabled');
  gui.btn_stop.attr('disabled', 'disabled');
  gui.btn_reset.attr('disabled', 'disabled');
  gui.btn_randomreset.attr('disabled', 'disabled');
}

/** Set up sub systems */
function _initialize_subsystems() {
  logger = new soccer.Logger();

  if (config.debug.show_fps) {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '5px';
    stats.domElement.style.bottom = '5px';
    document.body.appendChild(stats.domElement);
  }
}

function _initialize_canvas_resize() {
  var canvas = document.getElementById('game');
  var container = $(canvas.parentElement);

  function resize() {
    var width = window.innerWidth-510;
    var height = window.innerHeight-38;

    if (width > height) {
      canvas.style.width = '';
      canvas.style.height = '100%';
    } else {
      canvas.style.width = '100%';
      canvas.style.height= '';
    }
  }

  window.addEventListener('resize', function() {
    resize();
  })
  resize();
}

function _initialize_app() {
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

function _hide_splash() {
  if (desktop) {
    $('.sc-splash').delay(700).fadeOut(700)
  } else {
    $('.sc-splash').hide();
  }
}

function _get_stub_config() {
  return {
    "display": {
      "fps"            : 600,
      "robot1_color"   : "#51AEE7",
      "robot2_color"   : "#CE662F",
      "obstacle_color" : "#EBEEF7",
      "ball_color"     : "#697F4A",
      "goal_color"     : "#F2CD02",
      "bg_color"       : "#333333",
      "line_width"     : 3
    },

    "debug" : {
      "show_fps" : true,
      "show_robot1_sensors": false,
      "show_robot2_sensors": false
    },

    "physics": {
      "scale"                      : 100,
      "simulation_speed"           : 1,
      "gs_iterations"              : 128,
      "substeps"                   : 128,
      "ball_mass"                  : 1,
      "ball_damping"               : 0.8,
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