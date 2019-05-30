var xtend = require('xtend')
var { through } = require('mississippi')

module.exports = function snoopyMulti (app) {
  if (!app.run) return app

  return xtend(app, { run: run })

  function run (effect, sources) {
    if (Array.isArray(effect)) {
      var i = 0
      var tr = through.obj()

      tr.on('pipe', function (src) { i += 1 })
      tr.on('unpipe', function (src) {
        if ((i -= 1) === 0) tr.end()
      })

      effect
        .map(function (effect) {
          return app.run(effect, sources)
        })
        .filter(Boolean)
        .forEach(function (stream) {
          stream.pipe(tr, { end: false })
        })

      return tr
    }

    return app.run(effect, sources)
  }
}
