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
    function Flower(root_el) {
      this.root_el = root_el;
      this.main_node = new FlowerNode(this.root_el);
    }
    Flower.prototype.parse_data = function() {
      return null;
    };
    return Flower;
  })();
  log = function(text) {
    if ((typeof console !== "undefined" && console !== null ? console.log : void 0) != null) {
      return console.log(text);
    }
  };
  $(function() {
    var f;
    f = new Flower($('#flowerRoot'));
    return log(f.main_node);
  });
  Node = (function() {
    function Node(el, type) {
      this.el = el;
      this.type = type;
      this.children = [];
      this.load_children();
    }
    Node.prototype.load_children = function() {
      var child_els, el, _i, _len, _results;
      child_els = this.el.children('.childNode, .childContent');
      _results = [];
      for (_i = 0, _len = child_els.length; _i < _len; _i++) {
        el = child_els[_i];
        _results.push(this.children.push(this.load_node_based_on_class($(el))));
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
  FlowerNode = (function() {
    __extends(FlowerNode, Node);
    function FlowerNode(el) {
      FlowerNode.__super__.constructor.call(this, el, 'flower');
    }
    return FlowerNode;
  })();
  ContentNode = (function() {
    __extends(ContentNode, Node);
    function ContentNode(el) {
      ContentNode.__super__.constructor.call(this, el, 'content');
    }
    return ContentNode;
  })();
}).call(this);
