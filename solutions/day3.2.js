import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day3.txt", "utf-8")

const input = await getInput()

const tokenizerPattern = /(?:do\(\))|(mul\(\d{1,3},\d{1,3}\))|(?:don't\(\))/g
const mulPattern = /mul\((\d{1,3}),(\d{1,3})\)/

const matches = [...input.matchAll(tokenizerPattern)]

let on = true

let total = 0
for (const match of matches) {
  if (match[0] === "do()") on = true
  else if (match[0] === "don't()") on = false
  else if (on) {
    const [_, d1, d2] = match[0].match(mulPattern)
    total += +d1 * +d2
  }
}

console.log(total)
