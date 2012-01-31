# general node class. Abstract.
class Node
    # set up children array and go ahead and load them
    constructor: (@el, @type) ->
        @children = []
        @load_children()
        @parent = null
        @p_node = null
        @p_stem = null

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
            child = new FlowerNode(el)
        else if el.hasClass('childContent')
            child = new ContentNode(el)
        child.parent = @
        return child

    has_flower_children: ->
        log @flower_children()
        return @flower_children().length > 0

    has_children_shown: ->
        shown = false
        for child in @children
            shown or= child.p_node isnt null
        return shown

    flower_children: ->
        return (child for child in @children when child.type is 'flower')

