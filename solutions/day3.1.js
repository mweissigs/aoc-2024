import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day3.txt", "utf-8")

const input = await getInput()

const allMulsPattern = /(mul\(\d{1,3},\d{1,3}\))/g
const mulPattern = /mul\((\d{1,3}),(\d{1,3})\)/

const matches = [...input.matchAll(allMulsPattern)]

let total = 0
for (const match of matches) {
    const [_, d1, d2] = match[0].match(mulPattern)
    total += (+d1 * +d2)
}

console.log(total)