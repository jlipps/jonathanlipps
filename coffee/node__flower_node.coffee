# Node which (a) has child nodes or (b) is a link
class FlowerNode extends Node

    constructor: (el, flower) ->
        super(el, 'flower', flower)

        # @label shows up as the text on the node itself
        @label = $('.nodeLabel', @el).html()

        # @cur_rot_step keeps track of how many turns we are away from
        # the initial state (positive = counter-clockwise, negative = clockwise)
        @cur_rot_step = 0

        # We need to keep track of the current rotation degree of this node so
        # we can accumulate rotation degrees for subsequent Raphael transforms
        @cur_rot_deg = 0

    build: (@center_xy, @radius, @distance) ->
        # Set some convenience variables based on Flower options etc...
        [opts, p, p_height, p_width] = [@flower.opts, @flower.paper, @flower.p_height, @flower.p_width]
        @center_xy ?= @flower.p_center
        @radius_pct = opts.node_radius
        @radius ?= p_width * @radius_pct
        @distance ?= opts.node_distance
        in_speed = if @parent then opts.node_in_speed else opts.node_in_speed*2
        out_speed = opts.node_out_speed

        # Set a start radius of 1px for the animation
        @start_radius = 1

        # Set a start center_xy to animate from, either from below the canvas
        # (in the case of the root node) or from the center of the parent
        if @parent
            @start_center_xy = @parent.center_xy
        else
            @start_center_xy = [@center_xy[0], p_height + 1]

        # Initialize Raphael sets used to group paper elements
        @p_set = p.set() # Set of all paper elements for this node
        @p_rset = p.set() # Set of all rotating elements
        @p_hoverset = p.set() # Set of elements which trigger hover/click events

        # Draw stem using SVG path description
        @p_stem = p.path "M#{@start_center_xy[0]},#{@start_center_xy[1]}L#{@start_center_xy[0]},#{@start_center_xy[1]}"
        @p_stem.attr
            stroke: opts.stroke_color
            'stroke-width': opts.stem_width

        # Push stem behind node circles always, and add to appropriate sets
        @p_stem.toBack()
        @p_set.push(@p_stem)
        @p_rset.push(@p_stem)

        # Draw node circle, set attributes, and add to appropriate sets
        @p_node = p.circle(@start_center_xy[0], @start_center_xy[1], @radius)
        @p_node.attr
            fill: opts.node_color
            stroke: opts.stroke_color
            'stroke-width': opts.stem_width
        @p_set.push @p_node
        @p_rset.push @p_node
        @p_hoverset.push @p_node

        # Animate circle node movement to desired center_xy
        @p_node.animate {cx: @center_xy[0], cy: @center_xy[1], r: @radius}, in_speed, ">", =>
            # When animation is finished:
            # Draw text on the node and add to appropriate sets
            @p_text = p.text(@center_xy[0], @center_xy[1], "#{@label}")
            @p_set.push(@p_text)
            @p_hoverset.push(@p_text)

            # Bind hover events to create a glow around the node
            @p_hoverset.hover @on_hovers()...

            # Bind click events to trigger rotation, showing/hiding of children, etc...
            @p_hoverset.click @on_click

        # Animate stem movement (i.e., stem elongation)
        toline_text = "L#{@center_xy[0]},#{@center_xy[1]}"
        if @parent
            @parent.p_node.toFront()
            @parent.p_text.toFront()
            @p_stem.animate {path: "M#{@parent.center_xy[0]},#{@parent.center_xy[1]}#{toline_text}}"}, in_speed, ">"
        else
            # If node is root node, need to animate straight stem from the bottom
            # of the canvas rather than from center
            @p_stem.animate {path: "M#{@center_xy[0]},#{p_height}#{toline_text}"}, in_speed, ">"

    on_hovers: ->
        hover_on =  =>
            @p_node_glow = @p_node.glow
                color: 'blue'
                width: 7,
                opacity: 0.3
        hover_off = =>
            @p_node_glow.remove()

        return [hover_on, hover_off]

    on_click: =>
        log "#{@label} was clicked!"
        if @has_children_shown()
            # If this node has children shown, a click means 'hide them'!
            @hide_children()
        else
            # If no children are shown, a click means 'show them'!
            if @parent
                # If this node has a sibling with children shown, we
                # need to close them before opening this node's children
                for sibling in @parent.flower_children
                    if sibling.has_children_shown()
                        sibling.hide_children()
                    sibling.deselect()

                # Before opening this node's children, we need to rotate
                # the flower so that this node is on top
                @parent.rotate_children_to this

            # Finally, we need to select this node and build its children
            @select()
            @build_children()

        # Zoom into the node we just selected
        @zoom_to_node

    rotate_children: (rotation_steps, clockwise = false) ->
        num_children = @flower_children.length
        max_child_i = num_children - 1 # index of last child in node set
        deg_per_slice = 360 / (num_children + 1) * (if clockwise then -1 else 1)
        step_amt = if clockwise then -1 else 1

        # Loop through the rotation code once per step requested; the animations
        # will appear to be chained
        for rs in [1..rotation_steps]
            # At every rotation step, there is one node which needs to move
            # twice as far to account for the gap for the parent stem. This
            # will also change depending on the direction of rotation
            if @cur_rot_step > 0
                double_cc_i = max_child_i - (@cur_rot_step % (max_child_i + 1))
                double_cw_i = next_i double_cc_i, max_child_i
            else
                double_cw_i = Math.abs(@cur_rot_step) % (max_child_i + 1)
                double_cc_i = prev_i double_cw_i, max_child_i

            log "Double CC index is #{double_cc_i}, Double CW index is #{double_cw_i}"

            # Increment the rotation step to what it will be after this rotation
            @cur_rot_step += step_amt

            for child, i in @flower_children#(c for c in @flower_children when c.p_node isnt null)
                # We need to determine the rotation amount for this node;
                # start off by assuming it's the normal number of degrees
                r_deg = deg_per_slice
                # But if this node's index matches the index that should rotate
                # twice, add an extra slice of degrees
                if (clockwise and i is double_cw_i) or (not clockwise and i is double_cc_i)
                    r_deg += deg_per_slice
                    log "#{child.label} (#{i}) is one that will jump #{if clockwise then 'clockwise' else 'counter-clockwise'} (RS was #{@cur_rot_step})"
                # Perform the actual rotation
                child.rotate_by r_deg
                # Notify the child that it needs to update its @center_xy based
                # on where it has ended up (i.e., the rotation step)
                child.set_new_center i, @cur_rot_step, num_children



    node_index: ->
        # Get the index of this node in its parent's list of children
        if @parent then @parent.flower_children.indexOf(this) else 0

    rotate_children_to: (node) ->
        num_children = @flower_children.length
        i = node.node_index()

        # Since the current rotation step might be -22 even when there's only
        # say 4 or 5 nodes, we want to normalize it to get the smallest equvalent
        sign = if @cur_rot_step < 0 then -1 else 1
        cur_normalized_step = sign * (Math.abs(@cur_rot_step) % num_children)
        log "Normalized step is #{cur_normalized_step}"

        # Now we need to find the node which is currently in 'center' position,
        # i.e., the node in the position we want _this_ node to eventually
        # be in. The index for this node also needs to be normalized so we
        # get a valid node index.
        center_i = Math.floor(num_children / 2) - cur_normalized_step
        if center_i < 0
            center_i = num_children + (center_i % num_children)
        if center_i >= num_children
            center_i = center_i % num_children

        log "Center i is #{center_i}"

        # If the node we want to rotate to is already in center position, we
        # don't need to do anything. Otherwise:
        if i isnt center_i
            # We need to find the 'distance' between this node and the center
            # node based on their indices, and based on which side of center
            # the node is on. With this information we can actually perform the
            # rotation with the appropriate number of steps.
            if node.is_right_of_middle()
                dist = dist_between_i i, center_i, num_children-1
                log "Dist is #{dist}"
                @rotate_children dist
            else if node.is_left_of_middle()
                dist = dist_between_i i, center_i, num_children-1, false
                log "Dist is #{dist}"
                @rotate_children dist, true

    rotate_by: (r_deg) ->
        # The number of degrees to rotate the node by should be added to what is
        # already there since Raphael transforms are cumulative.
        @cur_rot_deg += r_deg
        # The main transform which applies to all the paper elements is as follows:
        main_rotation_transform = "r#{-1*@cur_rot_deg},#{@parent.center_xy[0]},#{@parent.center_xy[1]}"
        # An additional transform applies only to the text node since we want it
        # to rotate in the opposite direction in order to maintain its orientation
        text_rotation_transform = "#{main_rotation_transform}R#{@cur_rot_deg}"
        anim_args = [200, ">"]
        # We perform both animations simultaneously
        @p_rset.animate {transform: main_rotation_transform}, anim_args...
        @p_text.animate {transform: text_rotation_transform}, anim_args...

    is_middle: ->
        # This node is "in the middle" if its center x differs from its parent's
        # center x by less than 1 pixel
        diff = Math.abs(@center_xy[0] - @parent.center_xy[0])
        log diff
        return diff <= 1

    is_right_of_middle: ->
        @center_xy[0] > @parent.center_xy[0]

    is_left_of_middle: ->
        @center_xy[0] < @parent.center_xy[0]

    select: ->
        # When this node is selected, make some nice visual changes to it
        o = @flower.opts
        @p_node.attr
            fill: o.selected_node_color
            'stroke-width': o.selected_stem_width
        @p_stem.attr
            'stroke-width': o.selected_stem_width

    build_children: ->
        # Draw children
        new_distance = @distance * 0.9
        new_radius = @radius * 0.75
        for child, i in @flower_children
            child.build @get_center_for_child(i, @center_xy, new_distance), new_radius, new_distance

    zoom_to_node: ->
        new_w = @radius / @radius_pct
        @flower.zoom_to(@center_xy..., new_w)


    deselect: ->
        o = @flower.opts
        @p_node.attr
            fill: o.node_color
            'stroke-width': o.stem_width
        @p_stem.attr
            'stroke-width': o.stem_width

    hide_children: ->
        # If children are shown, then a click means we need to recursively close
        # them. Since we need to wait for animation callbacks, this recursion
        # happens in 2 directions. So we need to set a flag in order to stop the
        # backwards recursion from closing _this_ node as well
        @stop_removing = true

        # Now we need to remove the 'stop_removing' flag from any children or
        # they won't close
        @clear_removal_flags_for_children()

        # Deconstruct child nodes with animations
        @unbuild_children()

    unbuild_children: (upwards = false) ->

        log "Unbuilding children for: #{@label}"

        if @has_children_shown() and not upwards
            for child in @flower_children
                child.unbuild_children()
        else if not @stop_removing and not @has_children_shown() and not @removal_animation_in_progress
            log "Removing #{@label} with animation"
            @remove_paper_elements =>
                @parent.unbuild_children true
        else if upwards
            if @has_children_shown()
                log "Cannot remove #{@label} since children still exist"
            else if @stop_removing
                log "Not removing #{@label} since we were told not to!"
            else if @removal_animation_in_progress
                log "Not removing because animation was already in progress"




    remove_paper_elements: (callback) ->
        # First, set a flag that says our animation is in progress
        @removal_animation_in_progress = true
        # Remove the text node
        @p_text.remove()
        @p_text = null
        out_speed = @flower.opts.node_out_speed

        # Animate the removal of the stem by shrinking it
        @p_stem.animate {path: "M#{@parent.center_xy[0]},#{@parent.center_xy[1]}L#{@start_center_xy[0]},#{@start_center_xy[1]}"}, out_speed, ">", =>
            # After the animation is complete, actually remove the stem
            @p_stem.remove()
            @p_stem = null

        # Animate the removal of the node by sucking it into parent. The callback
        # for this function is attached to this animation instead of both so it
        # only gets called once (after a timeout, too)
        @p_node.animate {cx: @start_center_xy[0], cy: @start_center_xy[1], r: @start_radius}, out_speed, ">", =>
            # Actually remove node
            @p_node.remove()
            @p_node = null
            # Clear out center_xy so it has to get reset next time node is loaded
            @center_xy = null
            # Set a timeout to run the callback
            setTimeout callback, 5
            # Clear the animation in progress flag
            @removal_animation_in_progress = false

    clear_removal_flags_for_children: ->
        log "Clearing removal flag for #{@label}"
        for child in @flower_children
            child.clear_removal_flags_for_children()
            child.stop_removing = false

    get_center_for_child: (i, offset_xy, distance) ->
        # total number of slices is children + 1 since we account for this node's stem
        deg_per_slice = 360 / (@flower_children.length + 1)
        rad_per_slice = deg2rad(deg_per_slice)
        this_rad = (i+1) * rad_per_slice
        x = (distance * Math.sin(this_rad))
        y = (distance * Math.cos(this_rad))
        #log [x,y]
        x += offset_xy[0]
        y += offset_xy[1]
        return [x,y]

    set_new_center: (i, rot_step, num_children) ->
        #log [i, rot_step, num_children]
        new_i = (i + rot_step) % (num_children)
        if new_i < 0
            new_i = num_children + new_i
        #log "New i for node #{@label} is #{new_i}"
        @center_xy = @parent.get_center_for_child new_i, @parent.center_xy, @distance
        #log "New center for #{@label} is #{@center_xy}"
        #@set_cur_deg()

