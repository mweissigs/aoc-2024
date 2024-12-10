import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day4.txt", "utf-8")

const input = await getInput()

const matrix = input.split("\n").map(line => line.split(""))

// We're looking for the possible combinations starting from every X:
/*
  Horizontal forward:
  . . X M A S . .
  r, c+1 = M
  r, c+2 = A
  r, c+3 = S

  Horizontal backward:
  . . S A M X . .
  r, c-1 = M
  r, c-2 = A
  r, c-3 = S

  Vertical forward:
  .
  .
  X
  M
  A
  S
  .
  .
  r+1, c = M
  r+2, c = A
  r+3, c = S

  Vertical backward:
  .
  .
  S
  A
  M
  X
  .
  .
  r-1, c = M
  r-2, c = A
  r-3, c = S

  TL-BR Diagonal forward:
  . . . . .
  . X . . .
  . . M . .
  . . . A .
  . . . . S
  r+1, c+1 = M
  r+2, c+2 = A
  r+3, c+3 = S

  TL-BR Diagonal backward:
  . . . . .
  . S . . .
  . . A . .
  . . . M .
  . . . . X
  r-1, c-1 = M
  r-2, c-2 = A
  r-3, c-3 = S

  TR-BL Diagonal forward:
  . . . . .
  . . . S .
  . . A . .
  . M . . .
  X . . . .
  r-1, c+1 = M
  r-2, c+2 = A
  r-3, c+3 = S

  TR-BL Diagonal backward:
  . . . . .
  . . . X .
  . . M . .
  . A . . .
  S . . . .
  r+1, c-1 = M
  r+2, c-2 = A
  r+3, c-3 = S
*/

const findHorizontalForward = (matrix, r, c) =>
  matrix[r][c] === "X" && matrix[r][c + 1] === "M" && matrix[r][c + 2] === "A" && matrix[r][c + 3] === "S"

const findHorizontalBackward = (matrix, r, c) =>
  matrix[r][c] === "X" && matrix[r][c - 1] === "M" && matrix[r][c - 2] === "A" && matrix[r][c - 3] === "S"

const findVerticalForward = (matrix, r, c) =>
  matrix[r][c] === "X" && matrix[r + 1]?.[c] === "M" && matrix[r + 2]?.[c] === "A" && matrix[r + 3]?.[c] === "S"

const findVerticalBackward = (matrix, r, c) =>
  matrix[r][c] === "X" && matrix[r - 1]?.[c] === "M" && matrix[r - 2]?.[c] === "A" && matrix[r - 3]?.[c] === "S"

const findTLBRDiagonalForward = (matrix, r, c) =>
  matrix[r][c] === "X" &&
  matrix[r + 1]?.[c + 1] === "M" &&
  matrix[r + 2]?.[c + 2] === "A" &&
  matrix[r + 3]?.[c + 3] === "S"

const findTLBRDiagonalBackward = (matrix, r, c) =>
  matrix[r][c] === "X" &&
  matrix[r - 1]?.[c - 1] === "M" &&
  matrix[r - 2]?.[c - 2] === "A" &&
  matrix[r - 3]?.[c - 3] === "S"

const findTRBLDiagonalForward = (matrix, r, c) =>
  matrix[r][c] === "X" &&
  matrix[r - 1]?.[c + 1] === "M" &&
  matrix[r - 2]?.[c + 2] === "A" &&
  matrix[r - 3]?.[c + 3] === "S"

const findTRBLDiagonalBackward = (matrix, r, c) =>
  matrix[r][c] === "X" &&
  matrix[r + 1]?.[c - 1] === "M" &&
  matrix[r + 2]?.[c - 2] === "A" &&
  matrix[r + 3]?.[c - 3] === "S"

let total = 0
for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix.length; c++) {
    if (findHorizontalForward(matrix, r, c)) {
      total++
    }

    if (findHorizontalBackward(matrix, r, c)) {
      total++
    }

    if (findVerticalForward(matrix, r, c)) {
      total++
    }

    if (findVerticalBackward(matrix, r, c)) {
      total++
    }

    if (findTLBRDiagonalForward(matrix, r, c)) {
      total++
    }

    if (findTLBRDiagonalBackward(matrix, r, c)) {
      total++
    }

    if (findTRBLDiagonalForward(matrix, r, c)) {
      total++
    }

    if (findTRBLDiagonalBackward(matrix, r, c)) {
      total++
    }
  }
}

console.log(total)