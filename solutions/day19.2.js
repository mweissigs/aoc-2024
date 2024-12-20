import fs from "fs-extra"

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

const getTowelsToCreate = combination => {
  if (!combination) {
    return 1
  }

  if (cache[combination] != null) {
    console.log(`Cache hit on ${combination}: ${cache[combination]}`)
    return cache[combination]
  }

  console.log(`Finding matches for combination '${combination}'`)
  let matches = 0
  for (const towel of towels) {
    if (combination.startsWith(towel)) {
      const remaining = combination.slice(towel.length)

      matches += getTowelsToCreate(remaining)
    }
  }

  console.log(`Caching results for '${combination}': `, matches)
  cache[combination] = matches
  return matches
}

let count = 0
for (const combination of combinations) {
  const solutions = getTowelsToCreate(combination)
  console.log(`Found ${solutions} solutions for ${combination}`)
  count += solutions
}
console.log(count)

// 309 - Too low
// 336
