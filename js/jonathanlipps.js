(function() {
  var Flower, log;
  Flower = (function() {
    function Flower(root_node) {
      this.root_node = root_node;
    }
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
    return log(f.root_node);
  });
}).call(this);
