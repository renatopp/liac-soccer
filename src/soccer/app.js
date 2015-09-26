(function() {
  'use strict';

  /**
   * App handles the communication among GUI, Game and Network.
   */
  var App = function() {
    this.game    = null;
    this.network = null;

    // list of network clients, players[0]=>robot1...
    this.players = [null, null];
    this.state = 'DISCONNECT';
    this._waiting_moves = false;
    this._move_timout = 0;

  }

  /** Initialize all objects */
  App.prototype.initialize = function() {
    this.game = new soccer.Game();
    this.network = new soccer.Network();

    this.update_info();

    var self = this;
    createjs.Ticker.framerate = config.display.fps;
    createjs.Ticker.on('tick', function(e) { self.on_update(e.delta/1000.); });
  }

  // CALLBACKS ----------------------------------------------------------------
  App.prototype.on_update = function(tick) {
    if (config.debug.show_fps) stats.begin();

    if (this.state === 'PLAY') {
      this.update_play(tick);
    } else {
      this.game.robot1.get_sensors(); // to show raycasting
      this.game.robot2.get_sensors(); // to show raycasting
    }

    if (!desktop) {
      this.game.update(tick);
    } else {
      this.game._render();
    }
    
    if (config.debug.show_fps) stats.end();
  }

  App.prototype.on_goal = function(robot_who_scored) {
    if (robot_who_scored === 1) {
      this.game.robot1.score += 1;
    } else {
      this.game.robot2.score += 1;
    }

    this.game.reset();
    this.update_info();
  }

  App.prototype.on_connection = function(client) {
    var i;

    if (this.players[0] == null) {
      i = 0;
    } else if (this.players[1] == null) {
      i = 1;
    } else {
      logger.error('Trying to register more players than supported.');
      return;
    }

    this.players[i] = client;
    if (this.players[0] !== null && this.players[1] !== null) {
      this.do_stop();
    }

    this.update_info();
  }
  App.prototype.on_disconnection = function(client) {
    var i = this.players.indexOf(client);
    if (i < 0) {
      return;
    //   logger.error('Trying to remove unregistered player.');
    }

    this.players[i] = null;
    this.do_disconnect();

    this.update_info();
  }
  App.prototype.on_rename = function() {
    this.update_info();
  }
  // --------------------------------------------------------------------------

  App.prototype.update_play = function(tick) {
    // if app already asked for movement and is waiting
    if (this._waiting_moves) {
      var moves = this.network.get_moves();

      // movements ready
      if (moves) {
        var move1 = moves[this.players[0]];
        var move2 = moves[this.players[1]];
        this.game.robot1.act(move1.force, move1.steer);
        this.game.robot2.act(move2.force, move2.steer);
        this.game.update(tick);

        this._move_timout = 0;
        this._waiting_moves = false;
      }
    }

    // notice that the previous IF can set waiting_moves to false
    if (!this._waiting_moves) {
      var info = this._get_game_info();
      this.network.ask_for_moves(info);
      this._waiting_moves = true;
    }
  }
  App.prototype._get_game_info = function() {
    var p1 = this.players[0];
    var p2 = this.players[1];
    var info = {};
    info['ball'] = this.game.get_ball_info();
    if (p1) info[p1] = this.game.get_robot_info(1);
    if (p2) info[p2] = this.game.get_robot_info(2);

    return info;
  }

  App.prototype.update_info = function() {
    var robot1 = this.game.robot1;
    var robot2 = this.game.robot2;

    gui.score1.html(robot1.score);
    gui.score2.html(robot2.score);

    var default_name = config.network.host+':'+config.network.port;
    gui.name1.html(default_name)
    gui.name2.html(default_name)

    var default_status = 'Disconnected';
    gui.status1.html(default_status)
    gui.status2.html(default_status)

    var clients = this.network.clients;
    if (this.players[0]) {
      var c = clients[ (clients[0].id===this.players[0])? 0:1 ];
      gui.name1.html(c.name);
      gui.status1.html('Connected');
    }
    if (this.players[1]) {
      var c = clients[ (clients[0].id===this.players[1])? 0:1 ];
      gui.name2.html(c.name);
      gui.status2.html('Connected');
    }
  }

  // ACTIONS (generally from GUI) ---------------------------------------------
  App.prototype.do_newgame = function() {
    logger.info('Creating new game.');
    this.network.disconnect_all();
    this.game.reset();
    this.do_disconnect();
    this.players = [null, null];
    this.update_info();
  }
  App.prototype.do_play = function() {
    logger.debug('Changing app state to PLAY.');
    this.state = 'PLAY';

    gui.btn_play.attr('disabled', 'disabled');
    gui.btn_pause.attr('disabled', false);
    gui.btn_stop.attr('disabled', false);
    gui.btn_reset.attr('disabled', false);
    gui.btn_invert.attr('disabled', 'disabled');
  }
  App.prototype.do_pause = function() {
    logger.debug('Changing app state to PAUSE.');
    this.state = 'PAUSE';

    gui.btn_play.attr('disabled', false);
    gui.btn_pause.attr('disabled', 'disabled');
    gui.btn_stop.attr('disabled', false);
    gui.btn_reset.attr('disabled', false);
    gui.btn_invert.attr('disabled', 'disabled');
  }
  App.prototype.do_stop = function() {
    logger.debug('Changing app state to STOP.');
    this.game.new_game();
    this.update_info();
    this.state = 'STOP';

    gui.btn_play.attr('disabled', false);
    gui.btn_pause.attr('disabled', 'disabled');
    gui.btn_stop.attr('disabled', 'disabled');
    gui.btn_reset.attr('disabled', 'disabled');
    gui.btn_invert.attr('disabled', false);
  }
  App.prototype.do_reset = function() {
    this.game.reset();
  }
  App.prototype.do_disconnect = function() {
    logger.debug('Changing app state to DISCONNECT.');
    this.state = 'DISCONNECT';

    gui.btn_play.attr('disabled', 'disabled');
    gui.btn_pause.attr('disabled', 'disabled');
    gui.btn_stop.attr('disabled', 'disabled');
    gui.btn_reset.attr('disabled', 'disabled');
    gui.btn_invert.attr('disabled', false);
  }
  App.prototype.do_invert = function() {
    if (this.state !== 'DISCONNECT' && this.state !== 'STOP') {
      logger.warn('Trying to invert players during game.');
      return;
    }

    var temp = this.players[0];
    this.players[0] = this.players[1];
    this.players[1] = temp;
    this.update_info();
  }
  // --------------------------------------------------------------------------

  soccer.App = App;
})()