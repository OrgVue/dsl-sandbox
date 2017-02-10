# dsl-sandbox

This module provides a transform a script into a safer version. The transform will:
- enforce strict mode
- hide global objects such as `XMLHttpRequest`
- instrument loops with a check to avoid the script from never returning or crashing a browser

## usage

```js
"use strict"

const dslsandbox = require("dsl-sandbox")

var result = (function() {
  return eval(dslsandbox.transform("2 + 3"))
}).call({})

console.log(result)
```

Notes:
- the actual `eval` call is best wrapped in an IIFE so `this` can be set explicitly, as opposed to leak from the parent
scope.
- the actual `eval` call is best isolated in a file to ensure minimum leak of parent scope. In the example, `result`
and `dslsandbox` would be visible.

## TODOs
- add more realistic example
- add an option to concat plugins, such as ES2015
