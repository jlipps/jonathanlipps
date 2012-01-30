log = (text) ->
    if console?.log?
        console.log(text)

deg2rad = (phi) ->
    return Math.PI * phi / 180
