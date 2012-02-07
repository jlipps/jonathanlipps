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
      this.main_node = new FlowerNode(this.root_el, this);
      this.container_el.css({
        position: 'absolute',
        top: '0px',
        left: '0px',
        overflow: 'hidden'
      });
      this.p_width = this.container_el.width();
      this.p_height = this.container_el.height();
      this.v_width = this.p_width;
      this.v_height = this.p_height;
      this.paper = Raphael(0, 0, this.p_width, this.p_height);
      this.p_center = [this.p_width / 2, this.p_height / 2];
      this.v_center = this.p_center;
    }
    Flower.prototype.build = function() {
      return this.main_node.build();
    };
    Flower.prototype.zoom_to = function(x, y, new_w) {
      var new_h, r_cx, r_cy, viewbox_x_off, viewbox_y_off, x_off, y_off, _ref, _ref2;
      log('zooming');
      _ref = this.v_center, r_cx = _ref[0], r_cy = _ref[1];
      x_off = x - r_cx;
      y_off = y - r_cy;
      new_h = new_w * this.v_height / this.v_width;
      viewbox_x_off = x_off + (this.v_width - new_w) / 2;
      viewbox_y_off = y_off + (this.v_height - new_h) / 2;
      log([x_off, y_off, new_w, new_h]);
      this.paper.setViewBox(viewbox_x_off, viewbox_y_off, new_w, new_h, false);
      return _ref2 = [new_w, new_h, [x, y]], this.v_width = _ref2[0], this.v_height = _ref2[1], this.v_center = _ref2[2], _ref2;
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
      selected_node_color: '#e0e0e0',
      stroke_color: '#777',
      stem_width: 1,
      selected_stem_width: 2,
      node_radius: 0.055,
      node_distance: 180,
      node_in_speed: 150,
      node_out_speed: 100,
      rotation_speed: 200
    };
    $('body').css({
      'height': $(window).outerHeight() + 'px'
    });
    f = new Flower($('#flowerRoot'), $('body'), opts);
    return f.build();
  });
  Node = (function() {
    function Node(el, type, flower) {
      this.el = el;
      this.type = type;
      this.flower = flower;
      this.parent = null;
      this.p_node = null;
      this.p_stem = null;
      this.children = [];
      this.flower_children = [];
      this.load_children();
    }
    Node.prototype.load_children = function() {
      var child_els, el, node, _i, _len, _ref;
      child_els = this.el.children('.childNode, .childContent');
      _ref = (function() {
        var _j, _len, _results;
        _results = [];
        for (_j = 0, _len = child_els.length; _j < _len; _j++) {
          el = child_els[_j];
          _results.push($(el));
        }
        return _results;
      })();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        node = this.load_node_based_on_class(el);
        this.children.push(node);
        if (node.type === 'flower') {
          this.flower_children.push(node);
        }
      }
      return this.has_flower_children = this.flower_children.length > 0;
    };
    Node.prototype.load_node_based_on_class = function(el) {
      var child;
      if (el.hasClass('childNode')) {
        child = new FlowerNode(el, this.flower);
      } else if (el.hasClass('childContent')) {
        child = new ContentNode(el, this.flower);
      }
      child.parent = this;
      return child;
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
    return Node;
  })();
  ContentNode = (function() {
    __extends(ContentNode, Node);
    function ContentNode(el, flower) {
      ContentNode.__super__.constructor.call(this, el, 'content', flower);
    }
    ContentNode.prototype.build = function(center_xy) {
      return null;
    };
    return ContentNode;
  })();
  FlowerNode = (function() {
    __extends(FlowerNode, Node);
    function FlowerNode(el, flower) {
      this.on_click = __bind(this.on_click, this);      FlowerNode.__super__.constructor.call(this, el, 'flower', flower);
      this.label = $('.nodeLabel', this.el).html();
      this.cur_rot_step = 0;
      this.cur_rot_deg = 0;
      this.extra_rotation_degrees = 0;
      this.url = null;
      if (el.attr('data-url')) {
        this.url = el.attr('data-url');
      }
    }
    FlowerNode.prototype.build = function(center_xy, radius, distance) {
      var in_speed, opts, out_speed, p, p_height, p_width, toline_text, _ref, _ref2, _ref3, _ref4;
      this.center_xy = center_xy;
      this.radius = radius;
      this.distance = distance;
      _ref = [this.flower.opts, this.flower.paper, this.flower.p_height, this.flower.p_width], opts = _ref[0], p = _ref[1], p_height = _ref[2], p_width = _ref[3];
      if ((_ref2 = this.center_xy) == null) {
        this.center_xy = this.flower.p_center;
      }
      this.orig_center_xy = this.center_xy;
      this.radius_pct = opts.node_radius;
      if ((_ref3 = this.radius) == null) {
        this.radius = p_width * this.radius_pct;
      }
      if ((_ref4 = this.distance) == null) {
        this.distance = opts.node_distance;
      }
      in_speed = this.parent ? opts.node_in_speed : opts.node_in_speed * 2;
      out_speed = opts.node_out_speed;
      this.start_radius = 1;
      if (this.parent) {
        this.start_center_xy = this.parent.center_xy;
      } else {
        this.start_center_xy = [this.center_xy[0], p_height + 1];
      }
      this.p_set = p.set();
      this.p_rset = p.set();
      this.p_hoverset = p.set();
      this.p_stem = p.path("M" + this.start_center_xy[0] + "," + this.start_center_xy[1] + "L" + this.start_center_xy[0] + "," + this.start_center_xy[1]);
      this.p_stem.attr({
        stroke: opts.stroke_color,
        'stroke-width': opts.stem_width
      });
      this.p_stem.toBack();
      this.p_set.push(this.p_stem);
      this.p_rset.push(this.p_stem);
      this.p_node = p.circle(this.start_center_xy[0], this.start_center_xy[1], this.radius);
      this.p_node.attr({
        fill: opts.node_color,
        stroke: opts.stroke_color,
        'stroke-width': opts.stem_width
      });
      this.p_set.push(this.p_node);
      this.p_rset.push(this.p_node);
      this.p_hoverset.push(this.p_node);
      this.p_node.animate({
        cx: this.center_xy[0],
        cy: this.center_xy[1],
        r: this.radius
      }, in_speed, ">", __bind(function() {
        var _ref5;
        this.p_text = p.text(this.center_xy[0], this.center_xy[1], "" + this.label);
        this.p_set.push(this.p_text);
        this.p_hoverset.push(this.p_text);
        (_ref5 = this.p_hoverset).hover.apply(_ref5, this.on_hovers());
        return this.p_hoverset.click(this.on_click);
      }, this));
      toline_text = "L" + this.center_xy[0] + "," + this.center_xy[1];
      if (this.parent) {
        this.parent.p_node.toFront();
        this.parent.p_text.toFront();
        return this.p_stem.animate({
          path: "M" + this.parent.center_xy[0] + "," + this.parent.center_xy[1] + toline_text + "}"
        }, in_speed, ">");
      } else {
        return this.p_stem.animate({
          path: "M" + this.center_xy[0] + "," + p_height + toline_text
        }, in_speed, ">");
      }
    };
    FlowerNode.prototype.on_hovers = function() {
      var hover_off, hover_on;
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
      return [hover_on, hover_off];
    };
    FlowerNode.prototype.on_click = function() {
      var sibling, _i, _len, _ref;
      log("" + this.label + " was clicked!");
      if (this.url) {
        return window.location.href = this.url;
      } else {
        if (this.has_children_shown()) {
          this.hide_children();
        } else {
          if (this.parent) {
            this.parent.rotate_children_to(this, __bind(function() {
              return this.grow_and_build();
            }, this));
            _ref = this.parent.flower_children;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              sibling = _ref[_i];
              if (sibling.has_children_shown()) {
                sibling.hide_children();
              }
              sibling.deselect();
            }
          } else {
            this.build_children();
          }
          this.select();
        }
        return this.zoom_to_node();
      }
    };
    FlowerNode.prototype.rotate_children = function(rotation_steps, clockwise, extra_half) {
      var child, deg_per_slice, double_cc_i, double_cw_i, i, max_child_i, num_children, r_deg, rs, step_amt, _len, _len2, _ref, _ref2, _results;
      if (clockwise == null) {
        clockwise = false;
      }
      if (extra_half == null) {
        extra_half = false;
      }
      log("Rotating children " + rotation_steps + " step" + (extra_half ? ' with an extra half turn' : ''));
      num_children = this.flower_children.length;
      max_child_i = num_children - 1;
      deg_per_slice = 360 / (num_children + 1) * (clockwise ? -1 : 1);
      step_amt = clockwise ? -1 : 1;
      if (extra_half) {
        this.extra_rotation_degrees = deg_per_slice / 2;
      }
      rs = 0;
      while (rs < rotation_steps) {
        if (this.cur_rot_step > 0) {
          double_cc_i = max_child_i - (this.cur_rot_step % (max_child_i + 1));
          double_cw_i = next_i(double_cc_i, max_child_i);
        } else {
          double_cw_i = Math.abs(this.cur_rot_step) % (max_child_i + 1);
          double_cc_i = prev_i(double_cw_i, max_child_i);
        }
        this.cur_rot_step += step_amt;
        _ref = this.flower_children;
        for (i = 0, _len = _ref.length; i < _len; i++) {
          child = _ref[i];
          r_deg = deg_per_slice;
          if ((clockwise && i === double_cw_i) || (!clockwise && i === double_cc_i)) {
            r_deg += deg_per_slice;
          }
          child.rotate_by(r_deg);
        }
        rs += 1;
      }
      _ref2 = this.flower_children;
      _results = [];
      for (i = 0, _len2 = _ref2.length; i < _len2; i++) {
        child = _ref2[i];
        if (extra_half) {
          log("Extra degrees: " + this.extra_rotation_degrees);
          child.rotate_by(this.extra_rotation_degrees);
        }
        _results.push(child.set_new_center(i, this.cur_rot_step, num_children));
      }
      return _results;
    };
    FlowerNode.prototype.node_index = function() {
      if (this.parent) {
        return this.parent.flower_children.indexOf(this);
      } else {
        return 0;
      }
    };
    FlowerNode.prototype.rotate_children_to = function(node, callback) {
      var center_i, cur_normalized_step, even_children, even_nodes_spread, extra_half, extra_half_rotation, i, is_left, is_right, num_children, sign, _ref;
      num_children = this.flower_children.length;
      i = node.node_index();
      _ref = [node.is_right_of_middle(), node.is_left_of_middle()], is_right = _ref[0], is_left = _ref[1];
      even_children = num_children % 2 === 0;
      even_nodes_spread = false;
      extra_half_rotation = false;
      sign = this.cur_rot_step < 0 ? -1 : 1;
      cur_normalized_step = sign * (Math.abs(this.cur_rot_step) % num_children);
      center_i = this.index_of_middle_node();
      if (center_i === null && even_children) {
        even_nodes_spread = true;
        extra_half = true;
      }
      if (center_i == null) {
        center_i = Math.floor(num_children / 2) - cur_normalized_step;
      }
      if (even_nodes_spread && is_right) {
        center_i = prev_i(center_i, num_children - 1);
      }
      log("Center i is " + center_i);
      if (i !== center_i || extra_half) {
        if (is_right) {
          this.rotate_children(dist_between_i(i, center_i, num_children - 1), false, extra_half);
        } else if (is_left) {
          this.rotate_children(dist_between_i(i, center_i, num_children - 1, false), true, extra_half);
        }
        return setTimeout(callback, this.flower.opts.rotation_speed + 5);
      } else {
        return callback();
      }
    };
    FlowerNode.prototype.rotate_by = function(r_deg) {
      var anim_args, cx, cy, main_rotation_transform, px, py, text_rotation_transform, _ref, _ref2, _ref3, _ref4;
      this.cur_rot_deg += r_deg;
      main_rotation_transform = "r" + (-1 * this.cur_rot_deg) + "," + this.parent.center_xy[0] + "," + this.parent.center_xy[1];
      text_rotation_transform = "" + main_rotation_transform + "R" + this.cur_rot_deg;
      anim_args = [this.flower.opts.rotation_speed, ">"];
      (_ref = this.p_rset).animate.apply(_ref, [{
        transform: main_rotation_transform
      }].concat(__slice.call(anim_args)));
      (_ref2 = this.p_text).animate.apply(_ref2, [{
        transform: text_rotation_transform
      }].concat(__slice.call(anim_args)));
      _ref3 = __slice.call(this.parent.center_xy).concat(__slice.call(this.orig_center_xy)), px = _ref3[0], py = _ref3[1], cx = _ref3[2], cy = _ref3[3];
      return (_ref4 = this.p_stem).animate.apply(_ref4, [{
        path: "M" + px + "," + py + "L" + cx + "," + cy
      }].concat(__slice.call(anim_args)));
    };
    FlowerNode.prototype.grow_and_build = function() {
      var even_children, grow_anim_speed, new_distance_ratio, new_x, new_y, opts, post_animation;
      even_children = this.parent.flower_children.length % 2 === 0;
      opts = this.flower.opts;
      grow_anim_speed = opts.rotation_speed;
      new_distance_ratio = 1.6;
      new_x = this.parent.center_xy[0] + ((this.orig_center_xy[0] - this.parent.center_xy[0]) * new_distance_ratio);
      new_y = this.parent.center_xy[1] + ((this.orig_center_xy[1] - this.parent.center_xy[1]) * new_distance_ratio);
      this.center_xy[1] -= this.distance * new_distance_ratio / 2;
      log("After growing, center_xy is " + this.center_xy);
      this.p_hoverset.animate({
        transform: "...T0,-" + (this.distance * new_distance_ratio / 2)
      }, grow_anim_speed, ">");
      this.p_stem.animate({
        path: "M" + this.parent.center_xy[0] + "," + this.parent.center_xy[1] + "L" + new_x + "," + new_y
      }, grow_anim_speed, ">");
      post_animation = __bind(function() {
        return this.build_children();
      }, this);
      return setTimeout(post_animation, grow_anim_speed + 5);
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
    FlowerNode.prototype.index_of_middle_node = function() {
      var child, i, _len, _ref;
      _ref = this.flower_children;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        child = _ref[i];
        if (child.selected) {
          return i;
        }
      }
      return null;
    };
    FlowerNode.prototype.select = function() {
      var o;
      o = this.flower.opts;
      this.p_node.attr({
        fill: o.selected_node_color,
        'stroke-width': o.selected_stem_width
      });
      this.p_stem.attr({
        'stroke-width': o.selected_stem_width
      });
      log("Setting selected of " + this.label + " to true");
      return this.selected = true;
    };
    FlowerNode.prototype.build_children = function() {
      var child, i, new_distance, new_radius, _len, _ref, _results;
      new_distance = this.distance * 0.75;
      new_radius = this.radius * 0.7;
      log("Building children. Current parent xy is " + this.center_xy);
      _ref = this.flower_children;
      _results = [];
      for (i = 0, _len = _ref.length; i < _len; i++) {
        child = _ref[i];
        _results.push(child.build(this.get_center_for_child(i, this.center_xy, new_distance), new_radius, new_distance));
      }
      return _results;
    };
    FlowerNode.prototype.zoom_to_node = function() {
      var new_w;
      return new_w = this.radius / this.radius_pct;
    };
    FlowerNode.prototype.deselect = function() {
      var o;
      o = this.flower.opts;
      this.p_node.attr({
        fill: o.node_color,
        'stroke-width': o.stem_width
      });
      this.p_stem.attr({
        'stroke-width': o.stem_width
      });
      return this.selected = false;
    };
    FlowerNode.prototype.hide_children = function() {
      this.stop_removing = true;
      this.clear_removal_flags_for_children();
      this.unbuild_children();
      return this.extra_rotation_degrees = 0;
    };
    FlowerNode.prototype.unbuild_children = function(upwards) {
      var child, _i, _len, _ref, _results;
      if (upwards == null) {
        upwards = false;
      }
      log("Unbuilding children for: " + this.label);
      if (this.has_children_shown() && !upwards) {
        _ref = this.flower_children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(child.unbuild_children());
        }
        return _results;
      } else if (!this.stop_removing && !this.has_children_shown() && !this.removal_animation_in_progress) {
        log("Removing " + this.label + " with animation");
        return this.remove_paper_elements(__bind(function() {
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
    FlowerNode.prototype.remove_paper_elements = function(callback) {
      var out_speed;
      this.removal_animation_in_progress = true;
      this.p_text.remove();
      this.p_text = null;
      out_speed = this.flower.opts.node_out_speed;
      this.p_stem.animate({
        path: "M" + this.parent.center_xy[0] + "," + this.parent.center_xy[1] + "L" + this.start_center_xy[0] + "," + this.start_center_xy[1]
      }, out_speed, ">", __bind(function() {
        this.p_stem.remove();
        return this.p_stem = null;
      }, this));
      return this.p_node.animate({
        cx: this.start_center_xy[0],
        cy: this.start_center_xy[1],
        r: this.start_radius
      }, out_speed, ">", __bind(function() {
        this.p_node.remove();
        this.p_node = null;
        this.center_xy = null;
        setTimeout(callback, 5);
        return this.removal_animation_in_progress = false;
      }, this));
    };
    FlowerNode.prototype.clear_removal_flags_for_children = function() {
      var child, _i, _len, _ref, _results;
      log("Clearing removal flag for " + this.label);
      _ref = this.flower_children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.clear_removal_flags_for_children();
        _results.push(child.stop_removing = false);
      }
      return _results;
    };
    FlowerNode.prototype.get_center_for_child = function(i, offset_xy, distance, extra_deg) {
      var deg_per_slice, extra_rad, rad_per_slice, this_rad, x, y;
      deg_per_slice = 360 / (this.flower_children.length + 1);
      rad_per_slice = deg2rad(deg_per_slice);
      extra_rad = deg2rad(this.extra_rotation_degrees);
      this_rad = (i + 1) * rad_per_slice + extra_rad;
      x = distance * Math.sin(this_rad);
      y = distance * Math.cos(this_rad);
      x += offset_xy[0];
      y += offset_xy[1];
      return [x, y];
    };
    FlowerNode.prototype.set_new_center = function(i, rot_step, num_children) {
      var new_i;
      new_i = (i + rot_step) % num_children;
      if (new_i < 0) {
        new_i = num_children + new_i;
      }
      this.center_xy = this.parent.get_center_for_child(new_i, this.parent.center_xy, this.distance);
      return log("Center for " + this.label + " is " + this.center_xy);
    };
    return FlowerNode;
  })();
}).call(this);
