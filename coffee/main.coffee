# on document load
$ ->
    # construct a new flower object with the appropriate root
    opts =
        node_color: '#fff'

    $('body').css({'height': $(window).outerHeight() + 'px'})
    f = new Flower($('#flowerRoot'), $('body'), opts)
    log $('body').outerHeight()
    log $(window).outerHeight()
    log f.main_node
    f.build()
