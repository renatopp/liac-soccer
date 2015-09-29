(function() {
  'use strict';

  var Client = function(network, socket) {
    this.id = soccer.utils.make_id();
    this.name = 'Unnamed dude';
    this.network = network;
    this.socket = socket;
    this.move = null;

    var self = this;
    this.socket.on('error', function() {}); // supress connection error
    this.socket.on('close', function(error) { self._handle_close(error); });
    this.socket.on('data', function(data) { self._handle_data(data); });
  }

  /** Handle closing (can occour by error or just connection close). */
  Client.prototype._handle_close = function(error) {
    // let network handle with these
    this.network._handle_disconnection(this);
  }

  /** Handle incoming data */
  Client.prototype._handle_data = function(buffer) {
    this.receive(buffer.toString());
  }

  /** Disconnect this socket */
  Client.prototype.disconnect = function() {
    logger.info('Disconnecting client "'+this.name+'".');
    this.socket.destroy();
    logger.info('Client "'+this.name+'" disconnected.');
  }

  Client.prototype.send = function(data) {
    var string = JSON.stringify(data);
    this.socket.write(string);
  }
  Client.prototype.receive = function(string) {
    try {
      var data = JSON.parse(string);
    } 
    catch (e) {
      var msg = 'Invalid JSON string.';
      this.send({type:'badmove', motive:1, message:msg});
    }

    if (data.name) { 
      // TODO: should clip to max length
      this.name = data.name;
      app.on_rename(this);
    }
    else if (this.network.waiting_turn != data.turn) {
      var msg = 'Invalid turn.';
      this.send({type:'badmove', motive:2, message:msg});
    }
    else if (!soccer.utils.is_number(data.steer)) {
      var msg = 'Invalid steer value, please provide a number.';
      this.send({type:'badmove', motive:3, message:msg});
    }
    else if (!soccer.utils.is_number(data.force)) {
      var msg = 'Invalid force value, please provide a number';
      this.send({type:'badmove', motive:4, message:msg});
    }
    else {
      this.move = data;
    }
  }

  soccer.Client = Client;
})()