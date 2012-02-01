(function() {
  var ContentNode, Flower, FlowerNode, Node, deg2rad, dist_between_i, log, next_i, prev_i, rad2deg;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  Flower = (function() {
    function Flower(root_el, container_el, opts) {
      this.root_el = root_el;
      this.container_el = container_el;
      this.opts = opts;
      this.main_node = new FlowerNode(this.root_el);
      log(this.main_node);
      this.container_el.css({
        position: 'absolute',
        top: '0px',
        left: '0px',
        overflow: 'hidden'
      });
      this.p_width = this.container_el.width();
      this.p_height = this.container_el.height();
      this.paper = Raphael(0, 0, this.p_width, this.p_height);
      this.p_center = [this.p_width / 2, this.p_height / 2];
    }
    Flower.prototype.build = function() {
      return this.main_node.build(this.p_center, this.opts, this.paper, this.p_height, this.p_width);
    };
    return Flower;
  })();
  log = function(text) {
    if ((typeof console !== "undefined" && console !== null ? console.log : void 0) != null) {
      return console.log(text);
    }
  };
  deg2rad = function(phi) {
    return Math.PI * phi / 180;
  };
  rad2deg = function(r) {
    return 180 * r / Math.PI;
  };
  next_i = function(cur_i, max_i) {
    return (cur_i + 1) % (max_i + 1);
  };
  prev_i = function(cur_i, max_i) {
    if (cur_i > 0) {
      return cur_i - 1;
    } else {
      return max_i;
    }
  };
  dist_between_i = function(i1, i2, max_i, next) {
    var dist, dist_step, i_inc;
    if (next == null) {
      next = true;
    }
    i_inc = next ? next_i : prev_i;
    dist = 0;
    for (dist_step = 0; 0 <= max_i ? dist_step <= max_i : dist_step >= max_i; 0 <= max_i ? dist_step++ : dist_step--) {
      if (i1 !== i2) {
        i1 = i_inc(i1, max_i);
        dist += 1;
      }
    }
    return dist;
  };
  $(function() {
    var f, opts;
    opts = {
      node_color: '#fff',
      stroke_color: '#777',
      node_radius: 0.045,
      node_distance: 150
    };
    $('body').css({
      'height': $(window).outerHeight() + 'px'
    });
    f = new Flower($('#flowerRoot'), $('body'), opts);
    return f.build();
  });
  Node = (function() {
    function Node(el, type) {
      this.el = el;
      this.type = type;
      this.children = [];
      this.load_children();
      this.parent = null;
      this.p_node = null;
      this.p_stem = null;
    }
    Node.prototype.load_children = function() {
      var child_els, el, _i, _len, _ref, _results;
      child_els = this.el.children('.childNode, .childContent');
      _ref = (function() {
        var _j, _len, _results2;
        _results2 = [];
        for (_j = 0, _len = child_els.length; _j < _len; _j++) {
          el = child_els[_j];
          _results2.push($(el));
        }
        return _results2;
      })();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(this.children.push(this.load_node_based_on_class(el)));
      }
      return _results;
    };
    Node.prototype.load_node_based_on_class = function(el) {
      var child;
      if (el.hasClass('childNode')) {
        child = new FlowerNode(el);
      } else if (el.hasClass('childContent')) {
        child = new ContentNode(el);
      }
      child.parent = this;
      return child;
    };
    Node.prototype.has_flower_children = function() {
      log(this.flower_children());
      return this.flower_children().length > 0;
    };
    Node.prototype.has_children_shown = function() {
      var child, shown, _i, _len, _ref;
      shown = false;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        shown || (shown = child.p_node !== null);
      }
      return shown;
    };
    Node.prototype.flower_children = function() {
      var child, _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child.type === 'flower') {
          _results.push(child);
        }
      }
      return _results;
    };
    return Node;
  })();
  ContentNode = (function() {
    __extends(ContentNode, Node);
    function ContentNode(el) {
      ContentNode.__super__.constructor.call(this, el, 'content');
    }
    ContentNode.prototype.build = function(center_xy) {
      return null;
    };
    return ContentNode;
  })();
  FlowerNode = (function() {
    __extends(FlowerNode, Node);
    function FlowerNode(el) {
      FlowerNode.__super__.constructor.call(this, el, 'flower');
      this.label = $('.nodeLabel', this.el).html();
      this.children_rotation_step = 0;
      this.cur_r_deg = 0;
    }
    FlowerNode.prototype.build = function(center_xy, opts, paper, canvas_height, canvas_width, radius, distance) {
      var _ref, _ref2, _ref3;
      this.center_xy = center_xy;
      this.opts = opts;
      this.paper = paper;
      this.canvas_height = canvas_height;
      this.canvas_width = canvas_width;
      this.radius = radius;
      this.distance = distance;
      if ((_ref = this.radius_pct) == null) {
        this.radius_pct = this.opts.node_radius;
      }
      if ((_ref2 = this.radius) == null) {
        this.radius = this.canvas_width * this.radius_pct;
      }
      if ((_ref3 = this.distance) == null) {
        this.distance = this.opts.node_distance;
      }
      this.in_speed = this.parent ? 150 : 300;
      this.out_speed = 100;
      this.start_radius = 1;
      if (this.parent) {
        this.start_center_xy = this.parent.center_xy;
      } else {
        this.start_center_xy = [this.center_xy[0], this.canvas_height + 1];
      }
      this.p_set = this.paper.set();
      this.p_rset = this.paper.set();
      this.hover_set = this.paper.set();
      if (this.parent) {
        this.p_stem = paper.path("M" + this.parent.center_xy[0] + "," + this.parent.center_xy[1] + "L" + this.start_center_xy[0] + "," + this.start_center_xy[1]);
      } else {
        this.p_stem = paper.path("M" + this.start_center_xy[0] + "," + (this.start_center_xy[1] + this.canvas_height / 2) + "L" + this.start_center_xy[0] + "," + this.start_center_xy[1]);
      }
      this.p_stem.attr({
        stroke: this.opts.stroke_color
      });
      this.p_stem.toBack();
      this.p_set.push(this.p_stem);
      this.p_rset.push(this.p_stem);
      this.p_node = paper.circle(this.start_center_xy[0], this.start_center_xy[1], this.radius);
      this.p_node.attr({
        fill: this.opts.node_color,
        stroke: this.opts.stroke_color
      });
      this.p_set.push(this.p_node);
      this.p_rset.push(this.p_node);
      this.p_node.animate({
        cx: this.center_xy[0],
        cy: this.center_xy[1],
        r: this.radius
      }, this.in_speed, ">", __bind(function() {
        var hover_off, hover_on;
        this.p_text = paper.text(this.center_xy[0], this.center_xy[1], "" + this.label);
        this.p_set.push(this.p_text);
        this.hover_set.push(this.p_node);
        this.hover_set.push(this.p_text);
        hover_on = __bind(function() {
          return this.p_node_glow = this.p_node.glow({
            color: 'blue',
            width: 7,
            opacity: 0.3
          });
        }, this);
        hover_off = __bind(function() {
          return this.p_node_glow.remove();
        }, this);
        this.hover_set.hover(hover_on, hover_off);
        return this.hover_set.click(__bind(function() {
          var sibling, _i, _len, _ref4;
          log("" + this.label + " was clicked!");
          if (this.has_children_shown()) {
            this.stop_removing = true;
            this.clear_removal_flags_for_children();
            this.unbuild_children();
            return this.zoom_to(false);
          } else {
            if (this.parent) {
              _ref4 = this.parent.flower_children();
              for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
                sibling = _ref4[_i];
                if (sibling.has_children_shown()) {
                  sibling.stop_removing = true;
                  sibling.clear_removal_flags_for_children();
                  sibling.unbuild_children();
                }
              }
              this.parent.rotate_children_to(this);
            }
            this.build_children();
            return this.zoom_to(true);
          }
        }, this));
      }, this));
      if (!this.parent) {
        return this.p_stem.animate({
          path: "M" + this.center_xy[0] + "," + this.canvas_height + "L" + this.center_xy[0] + "," + this.center_xy[1]
        }, this.in_speed, ">");
      } else {
        this.parent.p_node.toFront();
        this.parent.p_text.toFront();
        return this.p_stem.animate({
          path: "M" + this.parent.center_xy[0] + "," + this.parent.center_xy[1] + "L" + this.center_xy[0] + "," + this.center_xy[1]
        }, this.in_speed, ">");
      }
    };
    FlowerNode.prototype.rotate_children = function(rotation_steps, clockwise) {
      var child, deg_per_slice, double_cc_i, double_cw_i, i, max_child_i, num_children, r_deg, rs, step_amt, total, _len, _ref, _results;
      if (clockwise == null) {
        clockwise = false;
      }
      num_children = this.flower_children().length;
      max_child_i = num_children - 1;
      total = num_children + 1;
      deg_per_slice = 360 / total;
      step_amt = clockwise ? -1 : 1;
      if (clockwise) {
        deg_per_slice = -1 * deg_per_slice;
      }
      _results = [];
      for (rs = 1; 1 <= rotation_steps ? rs <= rotation_steps : rs >= rotation_steps; 1 <= rotation_steps ? rs++ : rs--) {
        if (this.children_rotation_step > 0) {
          double_cc_i = max_child_i - (this.children_rotation_step % (max_child_i + 1));
          double_cw_i = next_i(double_cc_i, max_child_i);
        } else {
          double_cw_i = Math.abs(this.children_rotation_step) % (max_child_i + 1);
          double_cc_i = prev_i(double_cw_i, max_child_i);
        }
        log("Double CC index is " + double_cc_i + ", Double CW index is " + double_cw_i);
        _ref = this.flower_children();
        for (i = 0, _len = _ref.length; i < _len; i++) {
          child = _ref[i];
          if (child.p_node !== null) {
            r_deg = deg_per_slice;
            if ((clockwise && i === double_cw_i) || (!clockwise && i === double_cc_i)) {
              r_deg += deg_per_slice;
              log("" + child.label + " (" + i + ") is one that will jump " + (clockwise ? 'clockwise' : 'counter-clockwise') + " (RS was " + this.children_rotation_step + ")");
            }
            child.cur_r_deg += r_deg;
            __bind(function(child, i, r_deg) {
              var anim_args, main_rotation_transform, text_rotation_transform, _ref2, _ref3;
              main_rotation_transform = "r" + (-1 * child.cur_r_deg) + "," + this.center_xy[0] + "," + this.center_xy[1];
              text_rotation_transform = "" + main_rotation_transform + "R" + child.cur_r_deg;
              anim_args = [200, ">"];
              (_ref2 = child.p_rset).animate.apply(_ref2, [{
                transform: main_rotation_transform
              }].concat(__slice.call(anim_args)));
              return (_ref3 = child.p_text).animate.apply(_ref3, [{
                transform: text_rotation_transform
              }].concat(__slice.call(anim_args)));
            }, this)(child, i, r_deg);
            child.set_new_center(i, this.children_rotation_step + step_amt, num_children);
          }
        }
        _results.push(this.children_rotation_step += step_amt);
      }
      return _results;
    };
    FlowerNode.prototype.node_index = function() {
      if (this.parent) {
        return this.parent.children.indexOf(this);
      } else {
        return 0;
      }
    };
    FlowerNode.prototype.rotate_children_to = function(node) {
      var center_i, cur_normalized_step, dist, even_children, i, num_children, sign;
      num_children = this.flower_children().length;
      i = node.node_index();
      sign = this.children_rotation_step < 0 ? -1 : 1;
      cur_normalized_step = sign * (Math.abs(this.children_rotation_step) % num_children);
      log("Normalized step is " + cur_normalized_step);
      even_children = num_children % 2 === 0 ? true : false;
      center_i = Math.floor(num_children / 2) - cur_normalized_step;
      if (center_i < 0) {
        center_i = num_children + (center_i % num_children);
      }
      if (center_i >= num_children) {
        center_i = center_i % num_children;
      }
      log("Center i is " + center_i);
      if (!node.is_middle()) {
        if (node.is_right_of_middle()) {
          dist = dist_between_i(i, center_i, num_children - 1);
          log("Dist is " + dist);
          return this.rotate_children(dist);
        } else if (node.is_left_of_middle()) {
          dist = dist_between_i(i, center_i, num_children - 1, false);
          log("Dist is " + dist);
          return this.rotate_children(dist, true);
        }
      }
    };
    FlowerNode.prototype.is_middle = function() {
      var diff;
      diff = Math.abs(this.center_xy[0] - this.parent.center_xy[0]);
      log(diff);
      return diff <= 1;
    };
    FlowerNode.prototype.is_right_of_middle = function() {
      return this.center_xy[0] > this.parent.center_xy[0];
    };
    FlowerNode.prototype.is_left_of_middle = function() {
      return this.center_xy[0] < this.parent.center_xy[0];
    };
    FlowerNode.prototype.build_children = function() {
      var child, i, new_distance, _len, _ref, _results;
      new_distance = this.distance * 0.9;
      _ref = this.children;
      _results = [];
      for (i = 0, _len = _ref.length; i < _len; i++) {
        child = _ref[i];
        _results.push(child.type === 'flower' ? (child.build(this.get_center_for_child(i, this.center_xy, new_distance), this.opts, this.paper, this.canvas_height, this.canvas_width, this.radius * 0.75, new_distance), child.set_cur_deg(), log("build " + child.label)) : void 0);
      }
      return _results;
    };
    FlowerNode.prototype.zoom_to = function(zooming_in) {
      var new_h, new_w, r_cx, r_cy, x_off, y_off;
      r_cx = this.canvas_width / 2;
      r_cy = this.canvas_height / 2;
      x_off = this.center_xy[0] - r_cx;
      y_off = this.center_xy[1] - r_cy;
      new_w = this.radius / this.radius_pct;
      new_h = new_w * this.canvas_height / this.canvas_width;
      x_off += (this.canvas_width - new_w) / 2;
      return y_off += (this.canvas_height - new_h) / 2;
    };
    FlowerNode.prototype.unbuild_children = function(upwards) {
      var child, _i, _len, _ref, _results;
      if (upwards == null) {
        upwards = false;
      }
      log("Unbuilding children for: " + this.label);
      if (this.has_children_shown() && !upwards) {
        _ref = this.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(child.type === 'flower' ? child.unbuild_children() : void 0);
        }
        return _results;
      } else if (!this.stop_removing && !this.has_children_shown() && !this.removal_animation_in_progress) {
        log("Removing " + this.label + " with animation");
        return this.remove_p(__bind(function() {
          return this.parent.unbuild_children(true);
        }, this));
      } else if (upwards) {
        if (this.has_children_shown()) {
          return log("Cannot remove " + this.label + " since children still exist");
        } else if (this.stop_removing) {
          return log("Not removing " + this.label + " since we were told not to!");
        } else if (this.removal_animation_in_progress) {
          return log("Not removing because animation was already in progress");
        }
      }
    };
    FlowerNode.prototype.remove_p = function(callback) {
      this.removal_animation_in_progress = true;
      this.p_text.remove();
      this.p_text = null;
      this.parent.p_node.toFront();
      this.parent.p_text.toFront();
      this.p_stem.animate({
        path: "M" + this.parent.center_xy[0] + "," + this.parent.center_xy[1] + "L" + this.start_center_xy[0] + "," + this.start_center_xy[1]
      }, this.out_speed, ">");
      return this.p_node.animate({
        cx: this.start_center_xy[0],
        cy: this.start_center_xy[1],
        r: this.start_radius
      }, this.out_speed, ">", __bind(function() {
        this.p_node.remove();
        this.p_stem.remove();
        this.p_node = null;
        this.p_stem = null;
        this.center_xy = null;
        setTimeout(callback, 5);
        return this.removal_animation_in_progress = false;
      }, this));
    };
    FlowerNode.prototype.clear_removal_flags_for_children = function() {
      var child, _i, _len, _ref, _results;
      log("Clearing removal flag for " + this.label);
      _ref = this.flower_children();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.clear_removal_flags_for_children();
        _results.push(child.stop_removing = false);
      }
      return _results;
    };
    FlowerNode.prototype.get_center_for_child = function(i, offset_xy, distance) {
      var rad_per_slice, this_rad, total, x, y;
      total = this.flower_children().length + 1;
      rad_per_slice = deg2rad(360 / total);
      this_rad = (i + 1) * rad_per_slice;
      x = distance * Math.sin(this_rad);
      y = distance * Math.cos(this_rad);
      x += offset_xy[0];
      y += offset_xy[1];
      return [x, y];
    };
    FlowerNode.prototype.get_cur_rad = function() {
      var cur_rad, offset_x, offset_y;
      offset_x = this.center_xy[0] - this.parent.center_xy[0];
      offset_y = this.center_xy[1] - this.parent.center_xy[1];
      cur_rad = Math.asin(offset_x / this.distance);
      return cur_rad;
    };
    FlowerNode.prototype.set_cur_deg = function() {
      return this.deg = rad2deg(this.get_cur_rad());
    };
    FlowerNode.prototype.set_new_center = function(i, rot_step, num_children) {
      var new_i;
      new_i = (i + rot_step) % num_children;
      if (new_i < 0) {
        new_i = num_children + new_i;
      }
      return this.center_xy = this.parent.get_center_for_child(new_i, this.parent.center_xy, this.distance);
    };
    return FlowerNode;
  })();
}).call(this);
