import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day8.txt", "utf-8")

const input = await getInput()

const matrix = input.split("\n").map(line => line.split(""))

// Keep track of the positions we find
const pairs = {}

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

// {
//   '0': [ [ 1, 8 ], [ 2, 5 ], [ 3, 7 ], [ 4, 4 ] ],
//   'A': [ [ 5, 6 ], [ 8, 8 ], [ 9, 9 ] ]
// }

const result = {}

let total = 0

for (const node of Object.keys(pairs)) {
  const locations = pairs[node]
  if (locations.length === 1) continue

  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      const loc1 = locations[i]
      const loc2 = locations[j]

      const dx = loc2[0] - loc1[0]
      const dy = loc2[1] - loc1[1]

      const an1 = [loc1[0] - dx, loc1[1] - dy]
      const an2 = [loc2[0] + dx, loc2[1] + dy]

      if (
        an1[0] >= 0 &&
        an1[0] < matrix[0].length &&
        an1[1] >= 0 &&
        an1[1] < matrix.length &&
        result[an1[0]]?.[an1[1]] == null
      ) {
        result[an1[0]] ??= {}
        result[an1[0]][an1[1]] = 1
        total++
      }

      if (
        an2[0] >= 0 &&
        an2[0] < matrix[0].length &&
        an2[1] >= 0 &&
        an2[1] < matrix.length &&
        result[an2[0]]?.[an2[1]] == null
      ) {
        result[an2[0]] ??= {}
        result[an2[0]][an2[1]] = 1
        total++
      }
    }
  }
}

console.log(total)