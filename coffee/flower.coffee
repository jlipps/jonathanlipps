class Flower
    constructor: (@root_el, @container_el, @opts) ->
        # construct main node (which also constructs child nodes recursively)
        @main_node = new FlowerNode(@root_el, this)

        # ensure that the container div doesn't show scroll bars
        @container_el.css
            position: 'absolute'
            top: '0px'
            left: '0px'
            overflow: 'hidden'

        # set up paper to be height/width of container element
        @p_width = @container_el.width()
        @p_height = @container_el.height()
        # also store viewbox variables used for zooming/panning
        @v_width = @p_width
        @v_height = @p_height
        @paper = Raphael(0, 0, @p_width, @p_height)

        # grab center point (x,y) for future reference
        @p_center = [@p_width / 2, @p_height / 2]
        @v_center = @p_center


    build: ->
        @main_node.build()

    zoom_to: (x, y, new_w) ->
        log 'zooming'
        # zoom in viewport
        [r_cx, r_cy] = @v_center
        x_off = x - r_cx
        y_off = y - r_cy
        new_h = new_w * @v_height / @v_width
        viewbox_x_off = x_off + (@v_width - new_w) / 2
        viewbox_y_off = y_off + (@v_height - new_h) / 2
        log [x_off, y_off, new_w, new_h]

        @paper.setViewBox(0, 0, @v_width, @v_height, false)
        @paper.setViewBox(viewbox_x_off, viewbox_y_off, new_w, new_h, false)
        #[@v_width, @v_height, @v_center] = [new_w, new_h, [x, y]]


        # steps = 100
        # ms = 400
        # for i in [1..steps]
        #     setTimeout( =>
        #         step_x = i * (x_off / steps)
        #         step_y = i * (y_off / steps)
        #         step_w_diff = ((@p_width - new_w) / steps * i)
        #         step_h_diff = ((@p_height - new_h) / steps * i)
        #         if zooming_in
        #             step_w = @p_width - step_w_diff
        #             step_h = @p_height - step_h_diff
        #         else
        #             step_w = new_w + step_w_diff
        #             step_h = new_h + step_h_diff
        #         @paper.setViewBox(step_x, step_y, step_w, step_h, false)
        #     , ms / steps)
        #x, y, w, h, fit

