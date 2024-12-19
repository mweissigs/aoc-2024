import fs from "fs-extra"
import { Heap } from "heap-js"

const input = await fs.readFile("inputs/day18.txt", "utf-8")

const lines = input
  .split("\n")
  .map(line => line.split(",").map(Number))
  .slice(0, 12)

const maxX = Math.max(...lines.map(([x]) => x))
const maxY = Math.max(...lines.map(([, y]) => y))

console.log(`Building a ${maxX}x${maxY} grid`)

const matrix = []
for (let r = 0; r <= maxY; r++) {
  matrix[r] = []
  for (let c = 0; c <= maxX; c++) {
    matrix[r][c] = "."
  }
}

const printMatrix = () => console.log(matrix.map(line => line.join("")).join("\n"))

for (const [x, y] of lines) {
  matrix[y][x] = "#"
}

let sr = 0,
  sc = 0
let er = maxY,
  ec = maxX

const priorityComparator = (a, b) => a.cost - b.cost
const heap = new Heap(priorityComparator)

heap.push({ cost: 0, r: sr, c: sc })

const seen = {}

const isSeen = (r, c) => seen[r]?.[c] != null
const markSeen = (r, c, cost) => {
  seen[r] = seen[r] || {}
  seen[r][c] = cost
}

let answer = null
while (heap.size() > 0) {
  const { cost, r, c } = heap.pop()
  if (isSeen(r, c)) {
    continue
  }

  markSeen(r, c, cost)

  if (r === er && c === ec) {
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

console.log(`Ran out of heap nodes. Answer: ${answer}`)
