// ## transform

"use strict"

// Imports.
const babel = require("babel-core")

// limit :: AST
// The AST of the check performed for each loop iteration.
const limit = babel.transform("if (new Date().getTime() > __limit) throw new Error('Script timeout')", {}).ast

// plugin :: Babel -> Object
// Babel plugin to instrument loops with a timeout check.
const plugin = babel => ({
  visitor: {
    "DoWhileStatement|ForInStatement|ForOfStatement|ForStatement|WhileStatement": {
      enter: (path, state) => {
        path.get("body").replaceWithMultiple([
          limit.program.body[0],
          path.node.body
        ])
      }
    }
  }
})

// data Option {
//   timeout :: Number
//  }

// transform :: String -> Options -> String
// Transforms a script to be safer.
const transform = (script, options) => {
  var s, timeout

  timeout = options && options.timeout > 0 ? options.timeout : 15000 // 15 seconds default
  s = `"use strict"
  const Document = undefined
  const document = undefined
  const Navigator = undefined
  const setInterval = undefined
  const setTimeout = undefined
  const Window = undefined
  const window = undefined
  const XMLHttpRequest = undefined

  const __limit = new Date().getTime() + ${timeout};
  `

  s = s + script
  s = babel.transform(s, { plugins: [plugin] }).code

  return s
}

// Exports.
module.exports = transform
