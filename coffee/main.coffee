# on document load
$ ->
    # construct a new flower object with the appropriate root
    f = new Flower $('#flowerRoot')
    log f.main_node
