(function() {
  'use strict';

  /**
   * App handles the communication among GUI, Game and Network.
   */
  var App = function(config) {
    this.config  = config;
    this.game    = null;
    this.network = null;
  }

  /** Initialize all objects */
  App.prototype.initialize = function() {
    this.game = new soccer.Game();
    this.game.initialize();

    var self = this;
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on('tick', function(e) { self.on_update(e.delta/1000.); });
  }

  // CALLBACKS ----------------------------------------------------------------
  App.prototype.on_update = function(tick) {
    this.game.update(tick);
  }
  App.prototype.on_goal = function() {}
  // --------------------------------------------------------------------------

  // ACTIONS (generally from GUI) ---------------------------------------------
  App.prototype.do_newgame = function() {}
  App.prototype.do_play = function() {}
  App.prototype.do_pause = function() {}
  App.prototype.do_stop = function() {}
  App.prototype.do_step = function() {}
  App.prototype.do_reset = function() {}
  App.prototype.do_invertplayer = function() {}
  // --------------------------------------------------------------------------

  soccer.App = App;
})()