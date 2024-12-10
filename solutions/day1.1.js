import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day1.txt", "utf-8")

const input = await getInput()

const lines = input
  .split("\n")
  .filter(line => !!line.trim())
  .map(x => x.split(/\s+/))
  .map(arr => arr.map(Number))

const leftList = lines.map(x => x[0]).sort((a, b) => a - b)
const rightList = lines.map(x => x[1]).sort((a, b) => a - b)

let total = 0
for (let i = 0; i < leftList.length; i++) {
  const distance = Math.abs(leftList[i] - rightList[i])
  total += distance
}

console.log(total)
