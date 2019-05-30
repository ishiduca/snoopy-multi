'use strict'
const test = require('tape')
const { through, pipe, concat } = require('mississippi')
const multi = require('./multi')

test('exApp = multi(app)', t => {
  const run = (effect, sources) => {
    if (effect === 'tick') {
      let s = through.obj()
      setTimeout(() => s.end('tick'), 200)
      return s
    }
    if (effect === 'tack') {
      let s = through.obj()
      setTimeout(() => s.end('tack'), 100)
      return s
    }
  }

  t.test('single', tt => {
    const app = multi({ run })
    const data = 'tick'
    const expected = data

    pipe(
      app.run(data),
      concat(result => {
        tt.deepEqual(result, expected, `result "${result}"`)
      }),
      err => {
        tt.error(err, 'no error')
        tt.end()
      }
    )
  })

  t.test('multi 2 datas', tt => {
    const app = multi({ run })
    const data = [ 'tick', 'tack' ]
    const expected = 'tacktick'

    pipe(
      app.run(data),
      concat(result => {
        tt.deepEqual(result, expected, `result "${result}"`)
      }),
      err => {
        tt.error(err, 'no error')
        tt.end()
      }
    )
  })

  t.test('multi 3 datas include undefined', tt => {
    const app = multi({ run })
    const data = [ 'tick', 'hoge', 'tack' ]
    const expected = 'tacktick'

    pipe(
      app.run(data),
      concat(result => {
        tt.deepEqual(result, expected, `result "${result}"`)
      }),
      err => {
        tt.error(err, 'no error')
        tt.end()
      }
    )
  })

  t.end()
})
