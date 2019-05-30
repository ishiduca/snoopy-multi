# snoopy-multi

run multiple effects in [ '@ishiduca/snoopy' ](https://github.com/ishiduca/snoopy)

## install

```shell
npm i --save @ishiduca/snoopy-multi
```

## usage

### applyMultipleEffectsApp = multi(app)

### example

```js
const yo = require('yo-yo')
const { through, pipe } = require('mississippi')
const { start } = require('@ishiduca/snoopy')
const multi = require('@ishiduca/snoopy-multi')
const app = multi({
  init () {
    return {
      model: 0
    }
  },
  update (model, action) {
    if (action === 'add') {
      return { model: model + 1 }
    }
    if (action === 'tick') {
      return {
        model,
        effect: 'TICK'
      }
    }
    if (action === 'tack') {
      return {
        model,
        effect: 'SCHEDULE_TICK'
      }
    }
    if (action === 'tick tack') {
      return {
        model,
        effect: ['SCHEDULE_TICK', 'TICK']
      }
    }
  },
  view (model, actionsUp) {
    return yo`
      <section>
        <nav>
          <a onclick=${e => actionsUp('tick')}>tick</a>
          <a onclick=${e => actionsUp('tack')}>tack</a>
          <a onclick=${e => actionsUp('tick tack')}>tick tack</a>
        </nav>
        <div class="result">${model}</div>
      </section>
    `
  },
  run (effect, sources) {
    if (effect === 'TICK') {
      let s = through.obj()
      process.nextTick(() => s.end('add'))
      return s
    }
    if (effect === 'SCHEDULE_TICK') {
      let s = through.obj()
      setTimeout(() => s.end('add'), 1000)
      return s
    }
  }
})

const root = document.querySelector('main')
const { views } = start(app)

views().pipe(through.obj((el, _, done) => {
  yo.update(el, root)
  done()
}))
```

### inspiration

- [`ashaffer/redux-multi`](https://github.com/ashaffer/redux-multi)
- [`ahdinosaur/inu-multi`](https://github.com/ahdinosaur/inu-multi)

### authour

ishiduca@gmail.com

## license

The Apache License

Copyright &copy; 2019 ishiduca

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
