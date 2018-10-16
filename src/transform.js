// ## transform

"use strict"

// Imports.
import { transform as babelTransform } from "@babel/standalone"

// limit :: AST
// The AST of the check performed for each loop iteration.
const limit = babelTransform(
  "if (Date.now() > __limit) throw new Error('Script timeout')",
  { ast: true },
).ast

// plugin :: Babel -> Object
// Babel plugin to instrument loops with a timeout check.
const plugin = babel => ({
  visitor: {
    "DoWhileStatement|ForInStatement|ForOfStatement|ForStatement|WhileStatement": {
      enter: (path, state) => {
        path
          .get("body")
          .replaceWithMultiple([limit.program.body[0], path.node.body])
      },
    },
  },
})

// data Option {
//   timeout :: Number
//  }

// transform :: String -> Options -> String
// Transforms a script to be safer.
const transform = (script, options) => {
  let plugins, presets, s, timeout

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

  const __limit = Date.now() + ${timeout};
  `

  presets =
    options && options.presets && options.presets instanceof Array
      ? options.presets
      : []
  plugins = [plugin]
  if (options && options.plugins && options.plugins instanceof Array)
    plugins = plugins.concat(options.plugins)

  s = s + script
  s = babelTransform(s, { plugins: plugins, presets: presets }).code

  return s
}

// Exports.
export default transform
