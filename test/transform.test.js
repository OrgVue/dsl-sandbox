"use strict"

import assert from "assert"
import transform from "../src/transform.js"

// jshint -W061

describe("transform", function() {
  it("should transform to working script", function() {
    assert.strictEqual(
      5,
      eval(
        transform("2 + 3", {
          timeout: 2000,
        }),
      ),
    )
  })

  it("should shadow XMLHttpRequest", function() {
    assert.strictEqual(eval(transform("XMLHttpRequest")), undefined)
  })

  it("should timeout long running script", function() {
    assert.throws(function() {
      eval(
        transform(
          `
      var i, j, s

      s = 0
      for (i = 0; i < 1E4; i++) {
        for (j = 0; j < i; j++) {
          s += j
        }
      }

      s
      `,
          {
            timeout: 300,
          },
        ),
      )
    }, /Script timeout/)
  })

  it("should transform with extra plugin", function() {
    const code = transform("const x: number = 0;", {
      plugins: ["transform-typescript"],
    })

    if (!code.match("const x = 0;")) assert.fail(code, "")
  })
})
