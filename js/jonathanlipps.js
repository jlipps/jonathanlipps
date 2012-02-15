(function() {
  var ContentNode, Flower, FlowerNode, Node, deg2rad, dist_between_i, log, log_xy, next_i, prev_i, rad2deg;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice;
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
      this.p_font = this.paper.getFont(this.opts.font_family, this.opts.font_weight, this.opts.font_style, this.opts.font_stretch);
    }
    Flower.prototype.build = function() {
      return this.main_node.build();
    };
    Flower.prototype.track_mouse = function() {
      this.tracking_rect = this.paper.rect(0, 0, this.p_width, this.p_height);
      this.tracking_rect.toBack();
      this.tracking_rect.attr({
        fill: 'lightblue',
        'stroke-width': 0
      });
      return this.tracking_rect.mousemove(__bind(function(e) {
        return log([e.pageX, e.pageY]);
      }, this));
    };
    Flower.prototype.zoom_to = function(x, y, new_w) {
      var i, interval, ms, new_h, r_cx, r_cy, steps, viewbox_x_off, viewbox_y_off, x_off, y_off, zoom_func, _ref;
      log('zooming');
      _ref = this.v_center, r_cx = _ref[0], r_cy = _ref[1];
      x_off = x - r_cx;
      y_off = y - r_cy;
      log([new_w, this.v_width]);
      new_h = new_w * this.v_height / this.v_width;
      viewbox_x_off = x_off + (this.v_width - new_w) / 2;
      viewbox_y_off = y_off + (this.v_height - new_h) / 2;
      log([viewbox_x_off, viewbox_y_off, new_w, new_h]);
      this.paper.setViewBox(0, 0, this.v_width, this.v_height, false);
      this.paper.setViewBox(viewbox_x_off, viewbox_y_off, new_w, new_h, false);
      steps = 200;
      ms = 150;
      interval = ms / steps;
      i = 1;
      return zoom_func = __bind(function() {
        var step_h, step_h_diff, step_w, step_w_diff, step_x, step_y;
        if (i < steps) {
          step_x = i * (viewbox_x_off / steps);
          step_y = i * (viewbox_y_off / steps);
          step_w_diff = (this.v_width - new_w) / steps * i;
          step_h_diff = (this.v_height - new_h) / steps * i;
          if (new_w < this.v_width) {
            step_w = this.v_width - step_w_diff;
            step_h = this.v_height - step_w_diff;
          } else {
            step_w = this.v_width + step_w_diff;
            step_h = this.v_height + step_h_diff;
          }
          this.paper.setViewBox(step_x, step_y, step_w, step_h, false);
          return i++;
        } else {
          return clearInterval();
        }
      }, this);
    };
    return Flower;
  })();
  log = function(text) {
    if ((typeof console !== "undefined" && console !== null ? console.log : void 0) != null) {
      return console.log(text);
    }
  };
  log_xy = function(x, y, label, cx, cy) {
    var str;
    if ((x != null) && (y != null)) {
      str = "" + x + ", " + y;
      if ((label != null) && (cx != null) && (cy != null)) {
        str += " (" + label + ": " + (parseInt(cx)) + ", " + (parseInt(cy)) + ")";
      }
      return $('#logXY').html(str);
    } else {
      return $('#logXY').html("");
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
      node_radius: 0.038,
      node_distance_ratio: 0.75,
      node_child_radius_ratio: 0.8,
      node_in_speed: 150,
      node_out_speed: 100,
      rotation_speed: 200,
      font_family: "myriad-condensed",
      font_weight: 'normal',
      font_style: 'normal',
      font_stretch: 'condensed'
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
      this.grow_translate = 0;
      this.is_middle = false;
      this.url = null;
      if (el.attr('data-url')) {
        this.url = el.attr('data-url');
      }
    }
    FlowerNode.prototype.build = function(center_xy, radius, distance, radius_pct) {
      var in_speed, opts, out_speed, p, p_font, p_height, p_width, toline_text, _ref, _ref2, _ref3, _ref4, _ref5;
      this.center_xy = center_xy;
      this.radius = radius;
      this.distance = distance;
      this.radius_pct = radius_pct;
      _ref = [this.flower.opts, this.flower.paper, this.flower.p_height, this.flower.p_width, this.flower.p_font], opts = _ref[0], p = _ref[1], p_height = _ref[2], p_width = _ref[3], p_font = _ref[4];
      if ((_ref2 = this.center_xy) == null) {
        this.center_xy = this.flower.p_center;
      }
      this.orig_center_xy = [this.center_xy[0], this.center_xy[1]];
      if ((_ref3 = this.radius_pct) == null) {
        this.radius_pct = opts.node_radius;
      }
      if ((_ref4 = this.radius) == null) {
        this.radius = p_width * this.radius_pct;
      }
      if ((_ref5 = this.distance) == null) {
        this.distance = 0;
      }
      in_speed = this.parent ? opts.node_in_speed : opts.node_in_speed * 2;
      out_speed = opts.node_out_speed;
      this.start_radius = 1;
      if (this.parent) {
        this.start_center_xy = [this.parent.center_xy[0], this.parent.center_xy[1]];
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
        var _ref6;
        this.p_text = p.text(this.center_xy[0], this.center_xy[1], this.label);
        this.p_text.attr({
          "font-size": 11,
          "font-family": "Verdana",
          "fill": '#555'
        });
        this.p_hoverset.push(this.p_text);
        (_ref6 = this.p_hoverset).hover.apply(_ref6, this.on_hovers());
        this.p_hoverset.click(this.on_click);
        return this.p_hoverset.mousemove(__bind(function(e) {
          return log_xy.apply(null, [e.pageX, e.pageY, this.label].concat(__slice.call(this.center_xy)));
        }, this));
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
        this.p_node_glow.remove();
        return log_xy();
      }, this);
      return [hover_on, hover_off];
    };
    FlowerNode.prototype.on_click = function() {
      log("" + this.label + " was clicked!");
      if (this.url) {
        return window.location.href = this.url;
      } else {
        if (this.selected) {
          this.hide_children();
          this.zoom_to_node();
          return this.deselect();
        } else {
          if (this.parent) {
            this.close_siblings(__bind(function() {
              return this.parent.rotate_children_to(this, __bind(function() {
                return this.grow_and_build(__bind(function() {
                  return this.zoom_to_node();
                }, this));
              }, this));
            }, this));
          } else {
            this.build_children();
            this.zoom_to_node();
          }
          return this.select();
        }
      }
    };
    FlowerNode.prototype.build_text = function() {
      var bbox, font_size, p, p_font, text_x, _ref;
      _ref = [this.flower.paper, this.flower.p_font], p = _ref[0], p_font = _ref[1];
      font_size = 8;
      this.p_text = p.print(-1000, -1000, "" + this.label, p_font, font_size);
      bbox = this.p_text.getBBox();
      while (bbox.width < this.radius * 2 - this.radius * 0.6) {
        font_size += 2;
        this.p_text.remove();
        this.p_text = p.print(-1000, -1000, "" + this.label, p_font, font_size);
        bbox = this.p_text.getBBox();
      }
      this.p_text.remove();
      text_x = this.center_xy[0] - bbox.width / 2;
      log(text_x);
      this.p_text = p.print(this.center_xy[0] - bbox.width / 2, this.center_xy[1], "" + this.label, p_font, font_size);
      this.p_set.push(this.p_text);
      return log(this.p_text.getBBox());
    };
    FlowerNode.prototype.close_siblings = function(cb) {
      var did_deselect, s, sibling, _i, _len, _ref;
      did_deselect = false;
      _ref = (function() {
        var _j, _len, _ref, _results;
        _ref = this.parent.flower_children;
        _results = [];
        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
          s = _ref[_j];
          if (s !== this) {
            _results.push(s);
          }
        }
        return _results;
      }).call(this);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sibling = _ref[_i];
        if (sibling.has_children_shown()) {
          sibling.hide_children();
        }
        if (sibling.selected) {
          sibling.deselect(cb);
          did_deselect = true;
        }
      }
      if (!did_deselect) {
        return cb();
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
        _results.push(extra_half || rotation_steps !== 0 ? child.set_new_center(i, this.cur_rot_step, num_children) : void 0);
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
      log("Center i was " + center_i + ", rotating to " + i);
      if ((i !== center_i) || extra_half) {
        if (is_right) {
          this.rotate_children(dist_between_i(i, center_i, num_children - 1), false, extra_half);
        } else if (is_left) {
          this.rotate_children(dist_between_i(i, center_i, num_children - 1, false), true, extra_half);
        }
        setTimeout(callback, this.flower.opts.rotation_speed + 50);
      } else {
        callback();
      }
      return this.set_middle_node(node);
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
    FlowerNode.prototype.grow_and_build = function(cb) {
      var even_children, grow_anim_speed, new_distance_ratio, new_x, new_y, opts, post_animation;
      even_children = this.parent.flower_children.length % 2 === 0;
      opts = this.flower.opts;
      grow_anim_speed = opts.rotation_speed;
      new_distance_ratio = 1.6;
      this.grow_translate = this.distance * new_distance_ratio / 2;
      new_x = this.parent.center_xy[0] + ((this.orig_center_xy[0] - this.parent.center_xy[0]) * new_distance_ratio);
      new_y = this.parent.center_xy[1] + ((this.orig_center_xy[1] - this.parent.center_xy[1]) * new_distance_ratio);
      this.center_xy[1] -= this.grow_translate;
      log("Post growth center_xy for " + this.label + " is " + this.center_xy);
      post_animation = __bind(function() {
        this.build_children();
        return cb();
      }, this);
      this.p_hoverset.animate({
        transform: "...T0,-" + this.grow_translate
      }, grow_anim_speed, ">");
      return this.p_stem.animate({
        path: "M" + this.parent.center_xy[0] + "," + this.parent.center_xy[1] + "L" + new_x + "," + new_y
      }, grow_anim_speed, ">", post_animation);
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
        if (child.is_middle) {
          return i;
        }
      }
      return null;
    };
    FlowerNode.prototype.set_middle_node = function(node) {
      var child, _i, _len, _ref, _results;
      _ref = this.flower_children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child === node ? child.is_middle = true : child.is_middle = false);
      }
      return _results;
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
      return this.selected = true;
    };
    FlowerNode.prototype.build_children = function() {
      var child, child_ratio, i, new_distance, new_radius, new_radius_pct, _len, _ref, _results;
      if (this.flower_children.length) {
        child_ratio = this.flower.opts.node_child_radius_ratio;
        new_radius = this.radius * child_ratio;
        new_distance = this.radius + new_radius + new_radius * this.flower.opts.node_distance_ratio;
        new_radius_pct = this.radius_pct * (child_ratio * 0.9);
        log("Building children for " + this.label + ". Current parent xy is " + this.center_xy);
        _ref = this.flower_children;
        _results = [];
        for (i = 0, _len = _ref.length; i < _len; i++) {
          child = _ref[i];
          _results.push(child.build(this.get_center_for_child(i, this.center_xy, new_distance), new_radius, new_distance, new_radius_pct));
        }
        return _results;
      }
    };
    FlowerNode.prototype.zoom_to_node = function() {
      var new_w;
      return new_w = this.radius / this.radius_pct;
    };
    FlowerNode.prototype.deselect = function(cb) {
      var o, post_animation, ungrow_speed;
      if (this.selected) {
        o = this.flower.opts;
        this.p_node.attr({
          fill: o.node_color,
          'stroke-width': o.stem_width
        });
        this.p_stem.attr({
          'stroke-width': o.stem_width
        });
        this.selected = false;
        if (this.parent) {
          this.center_xy[1] += this.grow_translate;
          log("Ungrowing " + this.label);
          log(this.p_node.transform());
          ungrow_speed = o.rotation_speed * 0.75;
          post_animation = __bind(function() {
            var el, i, sub_t, t, ts, tstr, _i, _j, _len, _len2, _len3, _ref;
            _ref = [this.p_node, this.p_text];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              el = _ref[_i];
              ts = el.transform();
              ts = ts.slice(0, ts.length - 2);
              tstr = '';
              for (_j = 0, _len2 = ts.length; _j < _len2; _j++) {
                sub_t = ts[_j];
                for (i = 0, _len3 = sub_t.length; i < _len3; i++) {
                  t = sub_t[i];
                  tstr += t;
                  if (i !== 0 && i !== sub_t.length - 1) {
                    tstr += ',';
                  }
                }
              }
              log([el.toString(), tstr]);
              el.transform(tstr);
            }
            if (cb != null) {
              return setTimeout(cb, 10);
            }
          }, this);
          this.p_hoverset.animate({
            transform: "...T0," + this.grow_translate
          }, o.ungrow_speed, ">", post_animation);
          this.p_stem.animate({
            path: "M" + this.parent.center_xy[0] + "," + this.parent.center_xy[1] + "L" + this.orig_center_xy[0] + "," + this.orig_center_xy[1]
          }, o.ungrow_speed, ">");
          return this.grow_translate = 0;
        }
      }
    };
    FlowerNode.prototype.hide_children = function() {
      this.stop_removing = true;
      this.clear_removal_flags_for_children();
      this.unbuild_children();
      this.extra_rotation_degrees = 0;
      return this.cur_rot_step = 0;
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
          child.unbuild_children();
          child.selected = false;
          child.is_middle = false;
          _results.push(child.cur_rot_deg = 0);
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
      return log("New center for " + this.label + " is " + this.center_xy);
    };
    return FlowerNode;
  })();
}).call(this);
