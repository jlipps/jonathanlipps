log = (text) ->
    if console?.log?
        console.log(text)

deg2rad = (phi) ->
    return Math.PI * phi / 180

rad2deg = (r) ->
    return 180 * r / Math.PI

next_i = (cur_i, max_i) ->
    return (cur_i + 1) % (max_i + 1)

prev_i = (cur_i, max_i) ->
    return if cur_i > 0 then (cur_i - 1) else (max_i)

dist_between_i = (i1, i2, max_i, next=true) ->
    i_inc = if next then next_i else prev_i
    dist = 0
    for dist_step in [0..max_i]
        #log [i1, i2]
        if i1 isnt i2
            i1 = i_inc(i1, max_i)
            dist += 1
    return dist
