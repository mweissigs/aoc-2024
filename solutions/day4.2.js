import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day4.txt", "utf-8")

const input = await getInput()

const matrix = input.split("\n").map(line => line.split(""))

// We're looking for the possible combinations starting from every X:
/*
  TL-BR Diagonal forward:
  . . . . .
  . . . . .
  . . M . .
  . . . A .
  . . . . S
  r+1, c+1 = A
  r+2, c+2 = S

  TL-BR Diagonal backward:
  . . . . .
  . S . . .
  . . A . .
  . . . M .
  . . . . .
  r-1, c-1 = A
  r-2, c-2 = S

  TR-BL Diagonal forward:
  . . . . .
  . . . S .
  . . A . .
  . M . . .
  . . . . .
  r-1, c+1 = A
  r-2, c+2 = S

  TR-BL Diagonal backward:
  . . . . .
  . . . . .
  . . M . .
  . A . . .
  S . . . .
  r+1, c-1 = A
  r+2, c-2 = S
*/

const findTLBRDiagonalForward = (matrix, r, c) => matrix[r - 1]?.[c - 1] === "M" && matrix[r + 1]?.[c + 1] === "S"
const findTLBRDiagonalBackward = (matrix, r, c) => matrix[r - 1]?.[c - 1] === "S" && matrix[r + 1]?.[c + 1] === "M"

const findBLTRDiagonalForward = (matrix, r, c) => matrix[r + 1]?.[c - 1] === "M" && matrix[r - 1]?.[c + 1] === "S"
const findBLTRDiagonalBackward = (matrix, r, c) => matrix[r + 1]?.[c - 1] === "S" && matrix[r - 1]?.[c + 1] === "M"

const findXMas = (matrix, r, c) => {
  if (matrix[r][c] !== "A") {
    return null
  }

  const direction1 = findTLBRDiagonalForward(matrix, r, c) || findTLBRDiagonalBackward(matrix, r, c)
  const direction2 = findBLTRDiagonalForward(matrix, r, c) || findBLTRDiagonalBackward(matrix, r, c)

  return direction1 && direction2
}

let total = 0
for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix.length; c++) {
    if (findXMas(matrix, r, c)) {
      total++
    }
  }
}

console.log(`Total number of MAS: `, total)
