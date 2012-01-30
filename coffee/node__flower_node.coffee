# Node which has child nodes
class FlowerNode extends Node
    constructor: (el) ->
        super(el, 'flower')
        @label = $('.nodeLabel', @el).html()

    build: (@center_xy, @opts, @paper, @radius, @distance) ->
        if not @distance?
            @distance = 150

        # draw stem
        if @parent
            @p_stem = paper.path("M#{@parent.center_xy[0]},#{@parent.center_xy[1]}L#{center_xy[0]},#{center_xy[1]}")
        else
            log "M#{center_xy[0]},10000L#{center_xy[0]}#{center_xy[1]}"
            @p_stem = paper.path("M#{center_xy[0]},10000L#{center_xy[0]},#{center_xy[1]}")
        # push stems behind circles always
        @p_stem.toBack()

        # draw circle
        @p_node = paper.circle(center_xy[0], center_xy[1], radius)
        @p_node.attr("fill", opts.node_color)

        # hook up event handler
        @p_node.click =>
            if @children_shown
                @unbuild_children()
            else
                @build_children()

    build_children: ->
        # draw children
        for child, i in @children
            if child.type is 'flower'
                child.build(@get_center_for_child(i, @center_xy, @distance), @opts, @paper, @radius * 0.8, @distance * 0.8)
        @children_shown = true

    unbuild_children: ->
        log 'unbilding children'
        log @
        for child in @children
            if child.type is 'flower'
                if child.children_shown
                    child.unbuild_children()
                child.p_node.remove()
                child.p_stem.remove()
                child.p_node = null
                child.p_stem = null
        @children_shown = false

    get_center_for_child: (i, offset_xy, distance) ->
        # total number of slices is children + 1 since we account for this node's stem
        total = @children.length + 1
        rad_per_slice = deg2rad(360 / total)
        this_rad = (i+1) * rad_per_slice
        x = (distance * Math.sin(this_rad))
        y = (distance * Math.cos(this_rad))
        log [x,y]
        x += offset_xy[0]
        y += offset_xy[1]
        return [x,y]

