(function() {
  var ContentNode, Flower, FlowerNode, Node, log;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Flower = (function() {
    function Flower(root_el, container_el, opts) {
      this.root_el = root_el;
      this.container_el = container_el;
      this.opts = opts;
      this.main_node = new FlowerNode(this.root_el);
      this.paper = Raphael(this.container_el.offset().left, this.container_el.offset().top, this.container_el.width(), this.container_el.outerHeight());
      this.center = [this.container_el.width() / 2, this.container_el.outerHeight() / 2];
    }
    Flower.prototype.build = function() {
      log(this.center);
      this.main_node_p = this.paper.circle(this.center[0], this.center[1], 50);
      return this.main_node_p.attr("fill", this.opts.node_color);
    };
    return Flower;
  })();
  log = function(text) {
    if ((typeof console !== "undefined" && console !== null ? console.log : void 0) != null) {
      return console.log(text);
    }
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
    log($('body').outerHeight());
    log($(window).outerHeight());
    log(f.main_node);
    return f.build();
  });
  Node = (function() {
    function Node(el, type) {
      this.el = el;
      this.type = type;
      this.children = [];
      this.load_children();
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
      if (el.hasClass('childNode')) {
        return new FlowerNode(el);
      } else if (el.hasClass('childContent')) {
        return new ContentNode(el);
      }
    };
    return Node;
  })();
  ContentNode = (function() {
    __extends(ContentNode, Node);
    function ContentNode(el) {
      ContentNode.__super__.constructor.call(this, el, 'content');
    }
    return ContentNode;
  })();
  FlowerNode = (function() {
    __extends(FlowerNode, Node);
    function FlowerNode(el) {
      FlowerNode.__super__.constructor.call(this, el, 'flower');
    }
    return FlowerNode;
  })();
}).call(this);
