# dsl-sandbox

This module provides a transform for scripts into a safer versions. The transform will:
- enforce strict mode
- hide global objects such as `XMLHttpRequest`
- instrument loops with a check to avoid the script from never returning or crashing a browser

## Usage

```js
"use strict"

import dslsandbox from "dsl-sandbox"

const result = (function() {
  return eval(dslsandbox.transform("2 + 3"))
}).call({})

console.log(result)
```

Notes:
- the actual `eval` call is best wrapped in an IIFE so `this` can be set explicitly, as opposed to leak from the parent
scope.
- the actual `eval` call is best isolated in a file to ensure minimum leak of parent scope. In the example, `result`
and `dslsandbox` would be visible.

## Adding presets or plugins
Extra code transforms can be added as babel presets or plugins:
```js
dslsandbox.transform("var element = <div>Hello world</div>", {
  presets: ["react"],
  plugins: []
})
```

## TODOs
- add more realistic example
