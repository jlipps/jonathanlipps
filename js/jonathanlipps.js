(function() {
  var ContentNode, Flower, FlowerNode, Node, deg2rad, log;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Flower = (function() {
    function Flower(root_el, container_el, opts) {
      this.root_el = root_el;
      this.container_el = container_el;
      this.opts = opts;
      this.main_node = new FlowerNode(this.root_el);
      log(this.main_node);
      this.container_el.css({
        overflow: 'hidden'
      });
      this.p_width = this.container_el.width();
      this.p_height = this.container_el.height();
      this.paper = Raphael(0, 0, this.p_width, this.p_height);
      this.p_center = [this.p_width / 2, this.p_height / 2];
    }
    Flower.prototype.build = function() {
      return this.main_node.build(this.p_center, this.opts, this.paper, 50);
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
  $(function() {
    var f, opts;
    opts = {
      node_color: '#fff'
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
    }
    FlowerNode.prototype.build = function(center_xy, opts, paper, radius, distance) {
      this.center_xy = center_xy;
      this.opts = opts;
      this.paper = paper;
      this.radius = radius;
      this.distance = distance;
      if (!(this.distance != null)) {
        this.distance = 150;
      }
      if (this.parent) {
        this.p_stem = paper.path("M" + this.parent.center_xy[0] + "," + this.parent.center_xy[1] + "L" + center_xy[0] + "," + center_xy[1]);
      } else {
        this.p_stem = paper.path("M" + center_xy[0] + ",10000L" + center_xy[0] + "," + center_xy[1]);
      }
      this.p_stem.toBack();
      this.p_node = paper.circle(center_xy[0], center_xy[1], radius);
      this.p_node.attr("fill", opts.node_color);
      return this.p_node.click(__bind(function() {
        if (this.children_shown) {
          return this.unbuild_children();
        } else {
          return this.build_children();
        }
      }, this));
    };
    FlowerNode.prototype.build_children = function() {
      var child, i, _len, _ref;
      _ref = this.children;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        child = _ref[i];
        if (child.type === 'flower') {
          child.build(this.get_center_for_child(i, this.center_xy, this.distance), this.opts, this.paper, this.radius * 0.8, this.distance * 0.8);
        }
      }
      return this.children_shown = true;
    };
    FlowerNode.prototype.unbuild_children = function() {
      var child, _i, _len, _ref;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child.type === 'flower') {
          if (child.children_shown) {
            child.unbuild_children();
          }
          child.p_node.remove();
          child.p_stem.remove();
          child.p_node = null;
          child.p_stem = null;
        }
      }
      return this.children_shown = false;
    };
    FlowerNode.prototype.get_center_for_child = function(i, offset_xy, distance) {
      var rad_per_slice, this_rad, total, x, y;
      total = this.children.length + 1;
      rad_per_slice = deg2rad(360 / total);
      this_rad = (i + 1) * rad_per_slice;
      x = distance * Math.sin(this_rad);
      y = distance * Math.cos(this_rad);
      x += offset_xy[0];
      y += offset_xy[1];
      return [x, y];
    };
    return FlowerNode;
  })();
}).call(this);
