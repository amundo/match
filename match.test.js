import { match } from "./match.js"
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.95.0/testing/asserts.ts"

Deno.test("identical objects", () =>
  assert(match(
    { "form": "gato" },
    { "form": "gato" },
  )))

Deno.test("identical objects as array query", () =>
  assert(match(
    [
      ["form", "gato"],
    ],
    { "form": "gato" },
  )))

Deno.test("typo doesn’t match", () =>
  assert(
    !match(
      [
        ["frmo", "gaot"],
      ],
      { "form": "gato" },
    ),
  ))

Deno.test("no overlapping keys", () =>
  assert(
    !match(
      { "gloss": "cat" },
      { "form": "gato" },
    ),
  ))

Deno.test("missing key in comparand", () => {
  assert(
    !match(
      { "form": "gato", "gloss": "cat" },
      { "form": "gato" },
    ),
  )
})


Deno.test("query is subset of comparand", () => {
  assert(match(
    { "form": "gato" },
    { "form": "gato", "gloss": "cat" },
  ))
})


Deno.test("query as array of terms is subset", () => {
  assert(match(
    [
      ["form", "gato"],
    ],
    { "form": "gato", "gloss": "cat" },
  ))
})


Deno.test("query is superset but field constraint matches", () => {
  assert(match(
    { "form": "gato", "wordClass": "noun" },
    { "form": "gato" },
    ["form"],
  ))
})

Deno.test("query as array queries is superset but field constraint matches", () => {
  assert(match(
    [
      ["form", "gato"],
      ["wordClass", "noun"],
    ],
    { "form": "gato" },
    ["form"],
  ))
})

Deno.test("regexp", () =>
  assert(
    match(
      [
        ["form", /^g/],
      ],
      { "form": "gato" },
    ),
  ))


Deno.test("wrong regexp", () => {
  return assert(
    !match(
      { "form": /^q/ },
      { "form": "gato" },
    ),
  )
})

Deno.test("wrong regexp array query", () => {
  return assert(
    !match(
      [
        ["form", /^q/],
      ],
      { "form": "gato" },
    ),
  )
})

Deno.test("right regexp array query", () => {
  return assert(
    match(
      [
        ["form", /^g/],
      ],
      { "form": "gato" },
    ),
  )
})

Deno.test("two queries on same field ok", () =>
  assert(match(
    [
      ["form", /^g/],
      ["form", /o$/],
    ],
    { "form": "gato" },
  )))


Deno.test("some unicode data", () => {
  assert(
    match(
      {
        "codepoint": "02B1",
        "name": "MODIFIER LETTER SMALL H WITH HOOK",
        "character": "ʱ",
        "type": "modifier",
        "features": {},
      },
      {
        "codepoint": "02B1",
        "name": "MODIFIER LETTER SMALL H WITH HOOK",
        "character": "ʱ",
        "type": "modifier",
        "features": {},
      },
    ),
  )
})


Deno.test("match returns true when all query values match comparand", () => {
  let queries = { name: "John", age: 30 }
  let comparand = { name: "John", age: 30 }
  assert(match(queries, comparand))
})

Deno.test("match returns false when not all query values match comparand", () => {
  let queries = { name: "John", age: "30" }
  let comparand = { name: "John", age: "25" }
  assert(!match(queries, comparand))
})


Deno.test("match returns true when all query values match comparand with fields filter", () => {
  let queries = { name: "John", age: "30" }
  let comparand = { name: "John", age: "30", address: "NYC" }
  let fields = ["name", "age"]
  assertEquals(match(queries, comparand, fields), true)
})


Deno.test("match returns false when all query values match comparand with fields filter", () => {
  let queries = { name: "John", age: "30" }
  let comparand = { name: "John", age: "25", address: "NYC" }
  let fields = ["name", "age"]
  assert(!match(queries, comparand, fields))
})


Deno.test("match returns true when the query values match comparand with regular expression", () => {
  let queries = { name: /^John/ }
  let comparand = { name: "John" }
  assert(match(queries, comparand))
})

Deno.test("match returns true when the query values match comparand with regular expression, array style", () => {
  let queries = [["name", /^John/]]
  let comparand = { name: "John" }
  assertEquals(match(queries, comparand), true)
})



Deno.test("empty string values should be ignored", () => {
  let queries = { name: "" }
  let comparand = { name: "John" }
  assert(!match(queries, comparand))
})


Deno.test("can match symbol query to phone", () => {
  let symbolQuery = { symbol: "p" }
  let phone = {
    symbol: "p",
    name: "voiceless bilabial plosive",
    type: "consonant",
    features: { place: "bilabial", manner: "plosive", voicing: "voiceless" },
    characters: [
      { codepoint: "0070", name: "LATIN SMALL LETTER P", character: "p" },
    ],
  }

  assert(match(symbolQuery, phone))
})










// @TODO handle values that are numbers

// Deno.test("match returns false when the query values does not match comparand with regular expression", () => {
// let queries = { name: "John", bad: "" }
// let comparand = { name: "John" }
// assertEquals(match(queries, comparand), false)
// })


// Deno.test("can support array field match", () => {
//   let queries = [
//     [
//       ["metadata", "type"],
//       "uniliteral",
//     ],
//   ]
//   let comparand = {
//     "hieroglyph": "𓄿",
//     "metadata": {
//       "type": "uniliteral",
//     },
//   }
//   assertEquals(match(queries, comparand), true)
// })
