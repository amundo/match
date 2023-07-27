let identifyType = (x) => {
  let type = Object.prototype.toString.call(x)
    .toLowerCase()
    .split(" ")[1]
    .slice(0, -1)
    
  return type
}

let hasNestedKeys = (path, object) =>
  path
    .every((key) => {
      if (key in object) {
        object = object[key]
        return true
      }
      return false
    })

    console.log(`matchy`)
let match = (queries, comparand, fields = []) => {
  console.table({queries, comparand, fields})

  if (!Array.isArray(queries)) {
    let queryObject = queries
    queries = Object.entries(queryObject)
  }

  if (fields.length) {
    queries = queries
      .filter(([key, value]) => fields.includes(key))
  }

  let comparandHasAllKeys = queries
    .every(([key, value]) => comparand[key])

  if (!comparandHasAllKeys) return false

  let allValuesMatch = queries
    .every(([key, value]) => {
      if (typeof value == "string" && value.trim().length == 0) {
        return false
      } else if (typeof value == "string") {
        return comparand[key] == value
      } else if (identifyType(value) == "number") {
        return match(value, comparand[key])
      } else if (identifyType(value) == "object") { // wtf
        return match(value, comparand[key])
      } else if (value instanceof RegExp) {
        return value.test(comparand[key])
      }
    })

  return allValuesMatch
}

export { match }
