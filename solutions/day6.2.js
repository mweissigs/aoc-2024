import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day6.txt", "utf-8")

const input = await getInput()

const matrix = input.split("\n").map(line => line.split(""))
const outputMatrix = input.split("\n").map(line => line.split(""))

// Determine our starting points
let startR, startC
for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[0].length; c++) {
    if (matrix[r][c] === "^") {
      startR = r
      startC = c
    }
  }
}

const canMatrixComplete = matrixToTry => {
  let direction = "up"
  let currentR = startR,
    currentC = startC

  const getNextDirection = () => {
    switch (direction) {
      case "up":
        return "right"
      case "right":
        return "down"
      case "down":
        return "left"
      case "left":
        return "up"
    }
  }

  let exploredTiles = []
  while (currentR >= 0 && currentC >= 0 && currentR < matrixToTry.length && currentC < matrixToTry[0].length) {
    const previouslyExploredTile = exploredTiles.find(t => t[0] === currentR && t[1] === currentC && t[2] === direction)
    if (previouslyExploredTile != null) {
      return false
    }
    exploredTiles.push([currentR, currentC, direction])

    let nextR, nextC
    if (direction === "up") {
      nextR = currentR - 1
      nextC = currentC
    }

    if (direction === "right") {
      nextR = currentR
      nextC = currentC + 1
    }

    if (direction === "down") {
      nextR = currentR + 1
      nextC = currentC
    }

    if (direction === "left") {
      nextR = currentR
      nextC = currentC - 1
    }

    if (matrixToTry[nextR]?.[nextC] == null) {
      break
    }

    if (matrixToTry[nextR][nextC] === "#" || matrixToTry[nextR][nextC] === "O") {
      const nextDirection = getNextDirection()
      direction = nextDirection
    } else {
      currentR = nextR
      currentC = nextC
    }
  }

  return true
}

const addObstacle = (r, c) => {
  return matrix.map((row, rIdx) => row.map((col, cIdx) => (rIdx === r && cIdx === c ? "O" : col)))
}

const printMatrix = m => {
  console.log(m.map(line => line.join("")).join("\n"))
}

const totalMatrixes = matrix.length * matrix[0].length
let attemptedMatrixes = 0

let total = 0
for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[0].length; c++) {
    attemptedMatrixes++
    if (matrix[r][c] === ".") {
      console.log(`Attempting matrix ${attemptedMatrixes} / ${totalMatrixes}`)
      const newMatrix = addObstacle(r, c)
      if (!canMatrixComplete(newMatrix)) {
        total++
      }
    }
  }
}

console.log(total)
