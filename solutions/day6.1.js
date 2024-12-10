import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day6.txt", "utf-8")

const input = await getInput()

const matrix = input.split("\n").map(line => line.split(""))
const outputMatrix = input.split("\n").map(line => line.split(""))

// Determine our starting points
let currentR, currentC
for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[0].length; c++) {
    if (matrix[r][c] === "^") {
      currentR = r
      currentC = c
    }
  }
}

let direction = "up"

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

let total = 0
while (currentR >= 0 && currentC >= 0 && currentR < matrix.length && currentC < matrix[0].length) {
  if (outputMatrix[currentR][currentC] !== "X") {
    total++
  }
  outputMatrix[currentR][currentC] = "X"

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

  if (matrix[nextR]?.[nextC] == null) break

  if (matrix[nextR][nextC] === "#") {
    const nextDirection = getNextDirection()
    console.log(`Ran into a # at r,c = ${nextR}, ${nextC}. Rotating from ${direction} to ${nextDirection}`)
    direction = nextDirection
  } else {
    currentR = nextR
    currentC = nextC
  }
}

console.log(total)
// console.log(outputMatrix.map(line => line.join("")).join("\n"))
