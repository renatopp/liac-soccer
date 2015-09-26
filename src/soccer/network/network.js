(function() {
  'use strict';

  var Network = function() {
    // only starts network is running on desktop version
    if (!desktop) {
      logger.warn('Network server disabled because app is running on browser.');
      return;
    }

    logger.info('Initializing network server.');

    // variables
    this.server = null;
    this.clients = [];
    this.is_waiting_moves = false;
    this.waiting_turn = -1;

    // initialize
    this._set_up();
  }

  /** Set up the server  */
  Network.prototype._set_up = function() {
    // create server object
    var self = this;
    this.server = desktop.net.createServer(function(c) {
      self._handle_connection(c);
    });

    // set up max connections
    this.server.maxConnections = config.network.max_connections;

    // set up server and start listening
    var host = config.network.host;
    var port = config.network.port;
    this.server.listen({host:host, port:port}, function() {
      logger.info('Network server listening on '+host+':'+port+'.');
    });

    // finishing
    logger.info('Network server initialized.');
  }

  /** Handle client connection */
  Network.prototype._handle_connection = function(c) {
    logger.info('New client connecting.');

    // create network client
    var client = new soccer.Client(this, c);
    this.clients.push(client);

    // tell app about the connection
    app.on_connection(client.id);

    logger.info('Client connected.');
  }

  /** Handle client disconnection */
  Network.prototype._handle_disconnection = function(client) {
    logger.info('Client disconnecting.')

    // destroy client
    client.disconnect();

    // remove client
    this.clients.splice(this.clients.indexOf(client), 1);

    // tell app about the connection
    app.on_disconnection(client.id);

    logger.info('Client disconnected.')
  }

  /** Disconnect all clients */
  Network.prototype.disconnect_all = function() {
    logger.info('Disconnecting clients.');

    // destroy clients
    for (var i=0; i<this.clients.length; i++) {
      this.clients[i].disconnect();
    }

    // clean
    this.clients = [];

    logger.info('All clients disconnected.');
  }

  Network.prototype.ask_for_moves = function(info) {
    if (this.is_waiting_moves) {
      logger.error('Network asked for new moves, but it is still waiting for '+
                   'previous moves.');
    }

    this.waiting_turn = soccer.utils.make_id();
    this.is_waiting_moves = true;

    var c1 = this.clients[0];
    var c2 = this.clients[1];

    c1.move = null;
    c1.send({
      type     : 'state',
      turn     : this.waiting_turn,
      ball     : info.ball,
      player   : info[c1.id],
      opponent : info[c2.id]
    });

    c2.move = null;
    c2.send({
      type     : 'state',
      turn     : this.waiting_turn,
      ball     : info.ball,
      player   : info[c2.id],
      opponent : info[c1.id]
    });
  }

  Network.prototype.get_moves = function() {
    var c1 = this.clients[0];
    var c2 = this.clients[1];

    if (c1.move && c2.move) {
      var moves = {}
      moves[c1.id] = c1.move;
      moves[c2.id] = c2.move;

      this.waiting_turn = null;
      this.is_waiting_moves = false;
      c1.move = null;
      c2.move = null;
      return moves;
    }

    return null;
  }

  soccer.Network = Network;
})()