{exec} = require 'child_process'
task 'build', 'Build project from coffee/*.coffee to js/jonathanlipps.js', ->
  exec 'coffee --join js/jonathanlipps.js --compile coffee/*.coffee', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr
