# General node class. Abstract.
class Node

    constructor: (@el, @type, @flower) ->
        @parent = null
        @p_node = null
        @p_stem = null
        @children = []
        @flower_children = []
        @load_children()

    # Traverse DOM children of 'child' types and add them as children to this
    # node
    load_children: ->
        child_els = @el.children('.childNode, .childContent')
        for el in ($(el) for el in child_els)
            node = @load_node_based_on_class(el)
            @children.push node
            if node.type is 'flower'
                @flower_children.push node
        @has_flower_children = @flower_children.length > 0

    # load a node conditionally based on whether it is a simple child node
    # or whether it is a node with content
    load_node_based_on_class: (el) ->
        if el.hasClass('childNode')
            child = new FlowerNode(el, @flower)
        else if el.hasClass('childContent')
            child = new ContentNode(el, @flower)
        child.parent = this
        return child

    has_children_shown: ->
        shown = false
        for child in @children
            shown or= child.p_node isnt null
        return shown

