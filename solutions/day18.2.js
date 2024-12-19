import fs from "fs-extra"
import { Heap } from "heap-js"

const input = await fs.readFile("inputs/day18.txt", "utf-8")

const lines = input.split("\n").map(line => line.split(",").map(Number))

const size = 70

const buildMatrix = bytes => {
  var linesInPlay = lines.slice(0, bytes)

  const matrix = []
  for (let r = 0; r <= size; r++) {
    matrix[r] = []
    for (let c = 0; c <= size; c++) {
      matrix[r][c] = "."
    }
  }

  for (const [x, y] of linesInPlay) {
    matrix[y][x] = "#"
  }

  return matrix
}

const printMatrix = matrix => console.log(matrix.map(line => line.join("")).join("\n"))

for (let i = 1; i < lines.length; i++) {
  let answer = null

  const priorityComparator = (a, b) => a.cost - b.cost
  const heap = new Heap(priorityComparator)
  heap.push({ cost: 0, r: 0, c: 0 })

  const seen = {}

  const isSeen = (r, c) => seen[r]?.[c] != null
  const markSeen = (r, c, cost) => {
    seen[r] = seen[r] || {}
    seen[r][c] = cost
  }

  const matrix = buildMatrix(i)

  while (heap.size() > 0) {
    const { cost, r, c } = heap.pop()
    if (isSeen(r, c)) {
      continue
    }

    markSeen(r, c, cost)

    if (r === size && c === size) {
      answer = cost
      break
    }

    const moveLeft = { ncost: cost + 1, nr: r, nc: c - 1 }
    const moveRight = { ncost: cost + 1, nr: r, nc: c + 1 }
    const moveUp = { ncost: cost + 1, nr: r - 1, nc: c }
    const moveDown = { ncost: cost + 1, nr: r + 1, nc: c }
    const options = [moveLeft, moveRight, moveUp, moveDown]

    for (const option of options) {
      const { ncost, nr, nc } = option

      if (nr < 0 || nr >= matrix.length) continue
      if (nc < 0 || nc >= matrix[0].length) continue
      if (matrix[nr][nc] === "#") continue
      if (seen[nr] != null && seen[nr][nc] != null && seen[nr][nc] < ncost) continue

      heap.push({
        cost: ncost,
        r: nr,
        c: nc,
      })
    }
  }

  if (answer == null) {
    console.log(`Path was blocked on byte at ${lines[i-1]}`)
    break
  }
}
