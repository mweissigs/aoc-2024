import fs from "fs-extra"
import _ from "lodash"

const getInput = async () => await fs.readFile("inputs/day8.txt", "utf-8")

const input = await getInput()

const matrix = input.split("\n").map(line => line.split(""))

// Keep track of the positions we find
const pairs = {}
let antinodes = []

const tryAddAntiNode = antinode => {
  if (!antinodes.some(a => a[0] === antinode[0] && a[1] === antinode[1])) {
    // if (matrix[antinode[0]][antinode[1]] === ".") {
    matrix[antinode[0]][antinode[1]] = "#"
    // }
    antinodes.push(antinode)
  }
}

for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    const val = matrix[i][j]
    if (val === ".") {
      continue
    }

    if (!pairs[val]) {
      pairs[val] = [[i, j]]
    } else {
      pairs[val].push([i, j])
    }
  }
}

const isNodeInBounds = node => node[0] >= 0 && node[0] < matrix[0].length && node[1] >= 0 && node[1] < matrix.length
// && _.get(result, `${node[0]}.${node[1]}`) == null

const tryPlaceAntiNode = (loc, dx, dy) => {
  const antinode = [loc[0] + dx, loc[1] + dy]
  if (isNodeInBounds(antinode)) {
    // _.set(result, `${antinode[0]}.${antinode[1]}`, 1)
    tryAddAntiNode(antinode)
    tryPlaceAntiNode(antinode, dx, dy)
    return true
  }

  return false
}

const result = {}

for (const node of Object.keys(pairs)) {
  const locations = pairs[node]
  if (locations.length === 1) continue

  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      let loc1 = locations[i]
      let loc2 = locations[j]
      tryAddAntiNode(loc1)
      tryAddAntiNode(loc2)

      const dx = loc2[0] - loc1[0]
      const dy = loc2[1] - loc1[1]

      tryPlaceAntiNode(loc2, dx, dy)
      tryPlaceAntiNode(loc1, -dx, -dy)
    }
  }
}
const printMatrix = m => {
  console.log(m.map(line => line.join("")).join("\n"))
}
// console.log(pairs)
// console.log(result)
// printMatrix(matrix)
console.log(antinodes.length)
