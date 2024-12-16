import fs from "fs-extra"
import _ from "lodash"

const input = await fs.readFile("inputs/day15.txt", "utf-8")

let start = false,
  end = false

let matrix = []
let moves = []
let guardPosition

const lines = input.split("\n").filter(l => !!l)
for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  const chars = line
    .split("")
    .flatMap(c =>
      c === "#" ? ["#", "#"] : c === "O" ? ["[", "]"] : c === "." ? [".", "."] : c === "@" ? ["@", "."] : c,
    )

  if (!start || !end) {
    if (chars.every(c => c === "#")) {
      if (!start) start = true
      else if (!end) end = true
    }

    matrix[i] = chars
  } else {
    moves.push(...chars)
  }
}

for (let i = 0; i < matrix.length; i++) {
  const line = matrix[i]
  const guard = line.indexOf("@")
  if (guard !== -1) {
    guardPosition = [i, guard]
    break
  }
}

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

const getMatrix = () => matrix.map(r => r.join("")).join("\n")
const printMatrix = () => console.log(getMatrix())

const getRequiredMovesForMove = (r, c, move) => {
  let result = []

  if (move === "<") {
    while (true) {
      result.push([r, c, matrix[r][c], "<"])
      // If we hit a #, we can't move anything
      if (matrix[r][c] === "#") {
        break
        // If we hit a ., we can move everything to the left by 1 unit
      }

      if (matrix[r][c] === ".") {
        break
      }

      c--
    }
  } else if (move === ">") {
    while (true) {
      // If we hit a #, we can't move anything
      if (matrix[r][c] === "#") {
        return []
        // If we hit a ., we can move everything to the right by 1 unit
      }

      result.push([r, c, matrix[r][c], ">"])

      if (matrix[r][c] === ".") {
        break
      }

      c++
    }
  } else if (move === "v") {
    if (matrix[r][c] === "@") {
      result.push([r, c, matrix[r][c], "v"])
    }

    if (matrix[r + 1][c] === "[") {
      result.push([r + 1, c, "[", "v"])
      result.push([r + 1, c + 1, "]", "v"])

      result.push(...getRequiredMovesForMove(r + 1, c, "v"))
      result.push(...getRequiredMovesForMove(r + 1, c + 1, "v"))
    } else if (matrix[r + 1][c] === "]") {
      result.push([r + 1, c, "]", "v"])
      result.push([r + 1, c - 1, "[", "v"])

      result.push(...getRequiredMovesForMove(r + 1, c, "v"))
      result.push(...getRequiredMovesForMove(r + 1, c - 1, "v"))
    } else if (matrix[r + 1][c] === "#") {
      result.push([r, c, matrix[r + 1][c], "v"])
    }
  } else if (move === "^") {
    if (matrix[r][c] === "@") {
      result.push([r, c, matrix[r][c], "^"])
    }

    if (matrix[r - 1][c] === "[") {
      result.push([r - 1, c, "[", "^"])
      result.push([r - 1, c + 1, "]", "^"])

      result.push(...getRequiredMovesForMove(r - 1, c, "^"))
      result.push(...getRequiredMovesForMove(r - 1, c + 1, "^"))
    } else if (matrix[r - 1][c] === "]") {
      result.push([r - 1, c, "]", "^"])
      result.push([r - 1, c - 1, "[", "^"])

      result.push(...getRequiredMovesForMove(r - 1, c, "^"))
      result.push(...getRequiredMovesForMove(r - 1, c - 1, "^"))
    } else if (matrix[r - 1][c] === "#") {
      result.push([r, c, matrix[r - 1][c], "^"])
    }
  }

  return _.uniqWith(result, _.isEqual)
}

const applyRequiredMoves = requiredMoves => {
  // console.log(`Applying moves: `, requiredMoves)
  let result = matrix.map(line => [...line])

  for (const requiredMove of requiredMoves) {
    const [r, c, value, move] = requiredMove
    const [dr, dc] = getDrDcForMove(move)
    if (value !== ".") {
      result[r + dr][c + dc] = matrix[r][c]
      result[r][c] = "."
    }

    if (value === "@") {
      // Set the position @ is coming from to .
      // result[r][c] = "."
      guardPosition = [r + dr, c + dc]

      // Check the spots left and right of the new @ to make sure we're cleaning up any pre-existing boxes
      // if (result[r + dr][c + dc + 1] === "]") {
      //   result[r + dr][c + dc + 1] = "."
      // }
      // if (result[r + dr][c + dc - 1] === "[") {
      //   result[r + dr][c + dc - 1] = "."
      // }
    }
  }

  return result
}

const orderRequiredMovies = (requiredMoves, move) => {
  // If moving left, move boxes furthest left first
  if (move === "<") {
    return requiredMoves.sort((a, b) => a[1] - b[1])
  }

  // If moving right, move boxes furthest right first
  if (move === ">") {
    return requiredMoves.sort((a, b) => b[1] - a[1])
  }

  // If moving down, move boxes furthest down first
  if (move === "v") {
    return requiredMoves.sort((a, b) => b[0] - a[0])
  }

  // If moving up, move boxes furthest up first
  if (move === "^") {
    return requiredMoves.sort((a, b) => a[0] - b[0])
  }
}

console.log(`Starting matrix:`)
printMatrix()
console.log()

for (let i = 0; i < moves.length; i++) {
  const move = moves[i]
  let requiredMoves = getRequiredMovesForMove(guardPosition[0], guardPosition[1], move)
  requiredMoves = orderRequiredMovies(requiredMoves, move)
  if (requiredMoves.some(x => x[2] === "#")) {
    requiredMoves = []
  }

  matrix = applyRequiredMoves(requiredMoves)
}

console.log(`Ending matrix:`)
printMatrix()
console.log()

const getCoordinate = (r, c) => 100 * r + c

let total = 0
for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[r].length; c++) {
    if (matrix[r][c] === "[") {
      total += getCoordinate(r, c)
    }
  }
}

console.log(total)
