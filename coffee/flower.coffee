class Flower
    constructor: (@root_el, @container_el, @opts) ->
        @main_node = new FlowerNode(@root_el)
        @paper = Raphael(@container_el.offset().left, @container_el.offset().top, @container_el.width(), @container_el.outerHeight())
        @center = [@container_el.width() / 2, @container_el.outerHeight() / 2]

    build: ->
        log @center
        @main_node_p = @paper.circle(@center[0], @center[1], 50)
        @main_node_p.attr("fill", @opts.node_color)

