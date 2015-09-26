(function() {
  'use strict';

  soccer.utils = {};

  soccer.utils.clamp = function(value, min_value, max_value) {
    return Math.max(Math.min(value, max_value), min_value);
  }

  soccer.utils.to_radians = function(value) { return value*0.0174532925; }
  soccer.utils.to_degrees = function(value) { return value*57.2957795; }

  soccer.utils.rotate_point = function(x, y, angle, anchor_x, anchor_y) {
    anchor_x = anchor_x || 0;
    anchor_y = anchor_y || 0;

    x -= anchor_x;
    y -= anchor_y;

    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    var new_x = (x*cos - y*sin) + anchor_x;
    var new_y = (x*sin + y*cos) + anchor_y;

    return [new_x, new_y];
  }

  soccer.utils.is_number = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  soccer.utils.make_id = function() {
    return Math.floor(Math.random()*10000000000)+'.'+(new Date()).getTime();
  }
})();