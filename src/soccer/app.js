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
    this.state = 'DISCONNECTED';
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
    stats.begin();
    if (this.state === 'PLAY') {
      this.update_play(tick);
    }

    if (!desktop) {
      this.game.update(tick);
    }
    stats.end();
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
  }
  App.prototype.on_disconnection = function(client) {
    var i = this.players.indexOf(client);
    if (i < 0) {
      logger.error('Trying to remove unregistered player.');
    }

    this.players[i] = null;
    this.do_disconnect();
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
  }

  // ACTIONS (generally from GUI) ---------------------------------------------
  App.prototype.do_newgame = function() {

  }
  App.prototype.do_play = function() {
    logger.debug('Changing app state to PLAY');
    this.state = 'PLAY';
  }
  App.prototype.do_pause = function() {
    logger.debug('Changing app state to PAUSE');
    this.state = 'PAUSE';
  }
  App.prototype.do_stop = function() {
    logger.debug('Changing app state to STOP');
    this.game.new_game();
    this.update_info();
    this.state = 'STOP';
  }
  App.prototype.do_reset = function() {
    this.game.reset();
  }
  App.prototype.do_disconnect = function() {
    logger.debug('Changing app state to DISCONNECT');
    this.state = 'DISCONNECT';
  }
  App.prototype.do_invert = function() {

  }
  // --------------------------------------------------------------------------

  soccer.App = App;
})()