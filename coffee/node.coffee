class Node
    constructor: (@el, @type) ->
        @children = []
        @load_children()

    load_children: ->
        child_els = @el.children('.childNode, .childContent')
        for el in child_els
            @children.push @load_node_based_on_class($(el))

    load_node_based_on_class: (el) ->
        if el.hasClass('childNode')
            return new FlowerNode(el)
        else if el.hasClass('childContent')
            return new ContentNode(el)

class FlowerNode extends Node
    constructor: (el) ->
        super(el, 'flower')



class ContentNode extends Node
    constructor: (el) ->
        super(el, 'content')

