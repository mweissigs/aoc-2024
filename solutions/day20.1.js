import fs from "fs-extra"
import { Heap } from "heap-js"

const input = await fs.readFile("inputs/day20.txt", "utf-8")

const matrix = input.split("\n").map(line => line.split(""))

let sr, sc
let er, ec

for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[0].length; c++) {
    if (matrix[r][c] === "S") {
      sr = r
      sc = c
    } else if (matrix[r][c] === "E") {
      er = r
      ec = c
    }
  }
}

const printMatrix = () => console.log(matrix.map(line => line.join("")).join("\n"))

const priorityComparator = (a, b) => a.cost - b.cost
const heap = new Heap(priorityComparator)

heap.push({ cost: 0, r: sr, c: sc })

const seen = {}
const cheats = {}

const isSeen = (r, c) => seen[r]?.[c] != null
const markSeen = (r, c, cost) => {
  seen[r] = seen[r] || {}
  seen[r][c] = cost
}
const addCheat = (r, c, save) => {
  cheats[save] = cheats[save] || []
  cheats[save].push({ r, c })
}

const getPossibleCheatsFrom = (r, c, cost) => {
  const result = []

  if (matrix[r - 1][c] === "#" && matrix[r - 2]?.[c] === "." && isSeen(r - 2, c)) {
    result.push({ r: r - 2, c, save: cost - seen[r - 2][c] - 2 })
  }

  if (matrix[r + 1][c] === "#" && matrix[r + 2]?.[c] === "." && isSeen(r + 2, c)) {
    result.push({ r: r + 2, c, save: cost - seen[r + 2][c] - 2 })
  }

  if (matrix[r][c - 1] === "#" && matrix[r][c - 2] === "." && isSeen(r, c - 2)) {
    result.push({ r, c: c - 2, save: cost - seen[r][c - 2] - 2 })
  }

  if (matrix[r][c + 1] === "#" && matrix[r][c + 2] === "." && isSeen(r, c + 2)) {
    result.push({ r, c: c + 2, save: cost - seen[r][c + 2] - 2 })
  }

  return result
}

let answer = null
let totalCheats = 0
while (heap.size() > 0) {
  const { cost, r, c } = heap.pop()

  const possibleCheats = getPossibleCheatsFrom(r, c, cost)
  if (possibleCheats.length > 0) {
    // console.log(possibleCheats)
    totalCheats += possibleCheats.length
    for (const cheat of possibleCheats) {
      addCheat(cheat.r, cheat.c, cheat.save)
    }
  }

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

console.log(`Ran out of heap nodes. Answer: ${answer}. Total cheats: ${totalCheats}`)
console.log(
  Object.keys(cheats)
    .filter(save => save >= 100)
    .reduce((total, save) => total + cheats[save].length, 0)
)

// 6903 - Too High
// 1452 - Correct