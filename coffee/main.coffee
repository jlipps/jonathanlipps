# On document load
$ ->
    # Set up the options which determine Flower behavior
    opts =
        node_color: '#fff'
        selected_node_color: '#e0e0e0'
        stroke_color: '#777'
        stem_width: 1
        selected_stem_width: 2
        node_radius: 0.058 # node radius is a percentage of screen width
        node_distance: 180
        node_in_speed: 150
        node_out_speed: 100
        rotation_speed: 200

    # Set body height explicitly so it can be a valid flower container
    $('body').css({'height': $(window).outerHeight() + 'px'})

    # Initialize flower nav
    f = new Flower $('#flowerRoot'), $('body'), opts

    # Render flower to canvas
    f.build()
