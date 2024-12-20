import fs from "fs-extra"
import _ from "lodash"

const input = await fs.readFile("inputs/day19.txt", "utf-8")

const lines = input.split("\n")
const towels = lines[0].split(", ").sort((a, b) => b.length - a.length)

const towelsByLength = towels.reduce((acc, towel) => {
  const length = towel.length
  if (!acc[length]) {
    acc[length] = []
  }

  acc[length].push(towel)

  return acc
}, {})

const combinations = lines.slice(2)

const cache = {}

const getTowelsToCreate = (combination, result = []) => {
  if (combination === "brg") {
    console.log(`Trying to find a combination to create ${combination}. Result so far: `, result.join(", "))
  }

  if (!combination) {
    return result
  }

  for (const towel of towels) {
    if (combination.startsWith(towel)) {
      const remaining = combination.slice(towel.length)
      const newResult = [...result, towel]

      const sub = getTowelsToCreate(remaining, newResult)
      if (!sub) continue

      return sub
    }
  }

  return null
}

let count = 0
for (const combination of combinations) {
  console.log(`Trying to find a combination to create ${combination}`)
  const towelsToCreate = getTowelsToCreate(combination)
  if (towelsToCreate != null) {
    console.log(`Found a combination to create ${combination}`, towelsToCreate.join(", "))
    count++
  } else {
    console.log(`Could not find a combination to create ${combination}: `)
  }
}
console.log(count)

// 309 - Too low
