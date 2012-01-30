class Flower
    constructor: (@root_el, @container_el, @opts) ->
        # construct main node (which also constructs child nodes recursively)
        @main_node = new FlowerNode(@root_el)
        log @main_node

        # ensure that the container div doesn't show scroll bars
        @container_el.css
            overflow: 'hidden'

        # set up canvas to be height/width of container element
        @p_width = @container_el.width()
        @p_height = @container_el.height()
        @paper = Raphael(0, 0, @p_width, @p_height)

        # grab center point (x,y) for future reference
        @p_center = [@p_width / 2, @p_height / 2]

    build: ->
        @main_node.build(@p_center, @opts, @paper, 50)

