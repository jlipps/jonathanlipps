# general node class. Abstract.
class Node
    # set up children array and go ahead and load them
    constructor: (@el, @type) ->
        @children = []
        @load_children()

    # traverse dom children of 'child' types and add them as children to this
    # node
    load_children: ->
        child_els = @el.children('.childNode, .childContent')
        for el in ($(el) for el in child_els)
            @children.push @load_node_based_on_class(el)

    # load a node conditionally based on whether it is a simple child node
    # or whether it is a node with content
    load_node_based_on_class: (el) ->
        if el.hasClass('childNode')
            return new FlowerNode(el)
        else if el.hasClass('childContent')
            return new ContentNode(el)

