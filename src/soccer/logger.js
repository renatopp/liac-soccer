(function() {
  'use strict';

  var Logger = function() {}

  Logger.prototype._send = function(level, message) {
    console.log(level+': '+message);
  }

  Logger.prototype.info = function(message) {
    console.info('INFO: '+message);
    // this._send('INFO', message);
  }
  Logger.prototype.debug = function(message) {
    console.log('DEBUG: '+message);
    // this._send('DEBUG', message);
  }
  Logger.prototype.error = function(message) {
    console.error('ERROR: '+message);
    // this._send('ERROR', message);
  }
  Logger.prototype.warn = function(message) {
    console.warn('WARNING: '+message);
    // this._send('WARNING', message);
  }
  soccer.Logger = Logger;
})()