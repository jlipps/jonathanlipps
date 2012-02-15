# On document load
$ ->
    # Set up the options which determine Flower behavior
    opts =
        node_color: '#fff'
        selected_node_color: '#e0e0e0'
        stroke_color: '#777'
        stem_width: 1
        selected_stem_width: 2
        node_radius: 0.058 # node radius is a percentage of canvas width
        node_distance_ratio: 0.75
        node_child_radius_ratio: 0.8 # how much smaller a child should be
        node_in_speed: 150
        node_out_speed: 100
        rotation_speed: 200
        font_family: "myriad-condensed"
        font_weight: 'normal'
        font_style: 'normal'
        font_stretch: 'condensed'

    # Set body height explicitly so it can be a valid flower container
    $('body').css({'height': $(window).outerHeight() + 'px'})

    # Initialize flower nav
    f = new Flower $('#flowerRoot'), $('body'), opts

    # Render flower to canvas
    f.build()
