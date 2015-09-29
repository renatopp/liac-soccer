(function() {
  'use strict';

  var Logger = function() {}

  Logger.prototype.info = function(message) {
    console.info('INFO: '+message);
  }
  Logger.prototype.debug = function(message) {
    console.log('DEBUG: '+message);
  }
  Logger.prototype.error = function(message) {
    console.error('ERROR: '+message);
  }
  Logger.prototype.warn = function(message) {
    console.warn('WARNING: '+message);
  }
  soccer.Logger = Logger;
})()