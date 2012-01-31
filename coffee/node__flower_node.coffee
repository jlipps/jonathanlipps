# Node which has child nodes
class FlowerNode extends Node
    constructor: (el) ->
        super(el, 'flower')
        @label = $('.nodeLabel', @el).html()
        @children_rotation_step = 0

    build: (@center_xy, @opts, @paper, @canvas_height, @canvas_width, @radius, @distance) ->

        @radius_pct ?= @opts.node_radius
        @radius ?= @canvas_width * @radius_pct
        @distance ?= @opts.node_distance
        @in_speed = if @parent then 150 else 300
        @out_speed = 100

        # if this is the root node, rejig center-xy to start below canvas for animation
        @start_radius = 1
        if @parent
            @start_center_xy = @parent.center_xy
        else
            @start_center_xy = [@center_xy[0], @canvas_height + 1]

        @p_set = @paper.set()

        # draw stem using SVG path description
        if @parent
            @p_stem = paper.path("M#{@parent.center_xy[0]},#{@parent.center_xy[1]}L#{@start_center_xy[0]},#{@start_center_xy[1]}")
        else
            @p_stem = paper.path("M#{@start_center_xy[0]},#{@start_center_xy[1]+@canvas_height/2}L#{@start_center_xy[0]},#{@start_center_xy[1]}")

        # push stems behind circles always
        @p_stem.toBack()
        @p_set.push(@p_stem)

        # draw circle and set attributes
        @p_node = paper.circle(@start_center_xy[0], @start_center_xy[1], @radius)
        @p_node.attr("fill", @opts.node_color)
        @p_set.push(@p_node)

        # animate
        @p_node.animate({cx: @center_xy[0], cy: @center_xy[1], r: @radius}, @in_speed, ">", () =>
            @p_text = paper.text(@center_xy[0], @center_xy[1], @label)
            @p_set.push(@p_text)
            @hover_set = @paper.set()
            @hover_set.push(@p_node)
            @hover_set.push(@p_text)
            # create glow on hover
            hover_on = =>
                @p_node_glow = @p_node.glow
                    color: 'blue'
                    width: 7,
                    opacity: 0.3
            hover_off = =>
                @p_node_glow.remove()
            @hover_set.hover(hover_on, hover_off)
            # hook up click handler
            @hover_set.click =>
                if @has_children_shown()
                    @stop_removing = true
                    # need to remove 'stop_removing' flag from any children or they won't close
                    @clear_removal_flags_for_children()
                    @unbuild_children()
                    @zoom_to(false)
                else
                    if @parent
                        for sibling in @parent.flower_children()
                            if sibling.has_children_shown()
                                sibling.stop_removing = true
                                sibling.clear_removal_flags_for_children()
                                sibling.unbuild_children()
                        @parent.rotate_children_to(@)
                    @build_children()
                    @zoom_to(true)
        )
        if not @parent
            @p_stem.animate({path: "M#{@center_xy[0]},#{@canvas_height}L#{@center_xy[0]},#{@center_xy[1]}"}, @in_speed, ">")
        else
            @parent.p_node.toFront()
            @parent.p_text.toFront()
            @p_stem.animate({path: "M#{@parent.center_xy[0]},#{@parent.center_xy[1]}L#{@center_xy[0]},#{@center_xy[1]}"}, @in_speed, ">")

    rotate_children: (rotation_steps) ->
        num_children = @flower_children().length
        total = num_children + 1
        deg_per_slice = 360 / total
        for rs in [1..rotation_steps]
            for child, i in @flower_children()
                do (child, i) =>
                    if child.p_node isnt null
                        if i is (num_children - (@children_rotation_step % num_children) - 1)
                            deg = deg_per_slice*2
                        else
                            deg = deg_per_slice
                        log "r#{-1*deg},#{@center_xy[0]},#{@center_xy[1]} for #{child.label}"
                        child.p_node.transform("r#{-1*deg},#{@center_xy[0]},#{@center_xy[1]}")
                        child.p_stem.transform("r#{-1*deg},#{@center_xy[0]},#{@center_xy[1]}")
                        child.p_text.transform("r#{-1*deg},#{@center_xy[0]},#{@center_xy[1]}")
                        #log child.p_set.attr('rotation')
                        #child.p_set.animate({rotation: "#{deg},#{@center_xy[0]},#{@center_xy[1]}"}, 200, ">")
                        child.set_new_center(i, @children_rotation_step+1, num_children)
                        #child.p_node.attr({cx: child.center_xy[0], cy: child.center_xy[1]})
                        #child.p_text.attr({text: "#{child.label}\n#{child.center_xy[0]},#{child.center_xy[1]}"})
                        #child.p_text = @paper.text(child.center_xy[0], child.center_xy[1], "#{child.label}\n#{child.center_xy[0]},#{child.center_xy[1]}")
                        #child.hover_set.rotate(deg, child.center_xy[0], child.center_xy[1])
            @children_rotation_step += 1


    rotate_children_to: (node) ->
        cur_step = @children_rotation_step
        @rotate_children(1)


    build_children: ->
        # draw children
        new_distance = @distance * 0.9
        for child, i in @children
            if child.type is 'flower'
                child.build(@get_center_for_child(i, @center_xy, new_distance), @opts, @paper, @canvas_height, @canvas_width, @radius * 0.75, new_distance)
                log "build #{child.label}"

    zoom_to: (zooming_in) ->
        # zoom in viewport
        r_cx = @canvas_width / 2
        r_cy = @canvas_height / 2
        x_off = @center_xy[0] - r_cx
        y_off = @center_xy[1] - r_cy
        new_w = @radius / @radius_pct
        new_h = new_w * @canvas_height / @canvas_width
        x_off += (@canvas_width - new_w) / 2
        y_off += (@canvas_height - new_h) / 2
        #log [x_off, y_off, new_w, new_h]

        #@paper.setViewBox(x_off, y_off, new_w, new_h, false)
        # steps = 100
        # ms = 400
        # for i in [1..steps]
        #     setTimeout( =>
        #         step_x = i * (x_off / steps)
        #         step_y = i * (y_off / steps)
        #         step_w_diff = ((@canvas_width - new_w) / steps * i)
        #         step_h_diff = ((@canvas_height - new_h) / steps * i)
        #         if zooming_in
        #             step_w = @canvas_width - step_w_diff
        #             step_h = @canvas_height - step_h_diff
        #         else
        #             step_w = new_w + step_w_diff
        #             step_h = new_h + step_h_diff
        #         @paper.setViewBox(step_x, step_y, step_w, step_h, false)
        #     , ms / steps)
        #x, y, w, h, fit

    unbuild_children: (upwards=false) ->

        log "Unbuilding children for: #{@label}"

        if @has_children_shown() and not upwards
            for child in @children
                if child.type is 'flower'
                    child.unbuild_children()
        else if not @stop_removing and not @has_children_shown() and not @removal_animation_in_progress
            log "Removing #{@label} with animation"
            @remove_p =>
                @parent.unbuild_children(true)
        else if upwards
            if @has_children_shown()
                log "Cannot remove #{@label} since children still exist"
            else if @stop_removing
                log "Not removing #{@label} since we were told not to!"
            else if @removal_animation_in_progress
                log "Not removing because animation was already in progress"




    remove_p: (callback) ->
        # animate removal
        @removal_animation_in_progress = true
        @p_text.remove()
        @p_text = null
        @parent.p_node.toFront()
        @parent.p_text.toFront()
        @p_stem.animate({path: "M#{@parent.center_xy[0]},#{@parent.center_xy[1]}L#{@start_center_xy[0]},#{@start_center_xy[1]}"}, @out_speed, ">")
        @p_node.animate({cx: @start_center_xy[0], cy: @start_center_xy[1], r: @start_radius}, @out_speed, ">", =>
            # remove elements from paper and set nodes to none
            @p_node.remove()
            @p_stem.remove()
            @p_node = null
            @p_stem = null
            @center_xy = null
            setTimeout(callback, 5)
            @removal_animation_in_progress = false
        )


    clear_removal_flags_for_children: ->
        log "Clearing removal flag for #{@label}"
        for child in @flower_children()
            child.clear_removal_flags_for_children()
            child.stop_removing = false




    get_center_for_child: (i, offset_xy, distance) ->
        # total number of slices is children + 1 since we account for this node's stem
        total = @flower_children().length + 1
        rad_per_slice = deg2rad(360 / total)
        this_rad = (i+1) * rad_per_slice
        x = (distance * Math.sin(this_rad))
        y = (distance * Math.cos(this_rad))
        log [x,y]
        x += offset_xy[0]
        y += offset_xy[1]
        return [x,y]

    get_cur_rad: ->
        offset_x = @center_xy[0] - @parent.center_xy[0]
        cur_rad = Math.asin(offset_x / @distance)
        log "Current rad for #{@label} is: #{cur_rad}"

    set_new_center: (i, rot_step, num_children) ->
        log [i, rot_step, num_children]
        new_i = (i + rot_step) % (num_children)
        log "New i for node #{@label} is #{new_i}"
        @center_xy = @parent.get_center_for_child(new_i, @parent.center_xy, @distance)

