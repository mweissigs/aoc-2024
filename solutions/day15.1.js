import fs from "fs-extra"

const input = await fs.readFile("inputs/day15.txt", "utf-8")

let start = false,
  end = false

let matrix = []
let moves = []
let guardPosition

const lines = input.split("\n").filter(l => !!l)
for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  const chars = line.split("")

  if (!start || !end) {
    if (chars.every(c => c === "#")) {
      if (!start) start = true
      else if (!end) end = true
    }

    if (line.includes("@")) {
      guardPosition = [i, line.indexOf("@")]
    }

    matrix[i] = chars
  } else {
    console.log(`Adding moves: ${chars}`)
    moves.push(...chars)
  }
}

// console.log(matrix)
// console.log(moves)
// console.log(guardPosition)

const getDrDcForMove = move => {
  switch (move) {
    case "<":
      return [0, -1]
    case ">":
      return [0, 1]
    case "^":
      return [-1, 0]
    case "v":
      return [1, 0]
    default:
      throw new Error(`Invalid move: ${move}`)
  }
}

const getAllInWay = (dr, dc) => {
  let result = []
  let nr = guardPosition[0],
    nc = guardPosition[1]

  do {
    result.push([nr, nc, matrix[nr][nc]])
    if (matrix[nr][nc] === "#" || matrix[nr][nc] === ".") {
      break
    }
    nr += dr
    nc += dc
  } while (true)

  return result
}

const printMatrix = () => console.log(matrix.map(r => r.join("")).join("\n"))

const attemptMove = move => {
  const [dr, dc] = getDrDcForMove(move)
  const allInWay = getAllInWay(dr, dc)
  console.log(`allInWay: `, allInWay)

  const lastInWay = allInWay[allInWay.length - 1]

  if (lastInWay[2] === "#") {
    return
  } else if (lastInWay[2] === ".") {
    for (let i = allInWay.length - 1; i > 0; i--) {
      matrix[allInWay[i][0]][allInWay[i][1]] = matrix[allInWay[i - 1][0]][allInWay[i - 1][1]]
    }
    matrix[allInWay[0][0]][allInWay[0][1]] = "."
    guardPosition = [guardPosition[0] + dr, guardPosition[1] + dc]
  }
}

const getCoordinate = (r, c) => r * 100 + c

console.log(`Starting matrix:`)
printMatrix()

for (const move of moves) {
  attemptMove(move)
  console.log(`Applied move ${move}`)
  printMatrix()
}

let total = 0
for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[r].length; c++) {
    if (matrix[r][c] === "O") {
      total += getCoordinate(r, c)
    }
  }
}

console.log(total)
