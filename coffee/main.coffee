# on document load
$ ->
    # construct a new flower object with the appropriate root
    opts =
        node_color: '#fff',
        stroke_color: '#777',
        node_radius: 0.055, # node radius is a percentage of screen width
        node_distance: 180

    # set body height explicitly so it can be a valid flower container
    $('body').css({'height': $(window).outerHeight() + 'px'})

    # initialize flower nav
    f = new Flower($('#flowerRoot'), $('body'), opts)

    # render flower to canvas
    f.build()
