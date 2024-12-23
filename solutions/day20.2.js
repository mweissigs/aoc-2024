import fs from "fs-extra"
import { Heap } from "heap-js"

const input = await fs.readFile("inputs/day20.txt", "utf-8")

const matrix = input.split("\n").map(line => line.split(""))

class Node {
  constructor(r, c, cost, prev) {
    this.r = r
    this.c = c
    this.cost = cost
    this.prev = prev
  }
}

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

heap.push(new Node(sr, sc, 0, null))

const seen = {}
const cheats = {}

const isSeen = (r, c) => seen[r]?.[c] != null
const markSeen = (r, c, cost) => {
  seen[r] = seen[r] || {}
  seen[r][c] = cost
}

const isCheatEqual = (a, b) => {
  return a.fromR === b.fromR && a.fromC === b.fromC && a.toR === b.toR && a.toC === b.toC
}

const addCheat = cheat => {
  cheats[cheat.save] = cheats[cheat.save] || []
  const key = `${cheat.fromR},${cheat.fromC},${cheat.toR},${cheat.toC}`
  if (cheats[cheat.save][key] != null) {
    return
  }

  cheats[cheat.save][key] = cheat
}

const getPossibleCheatsFrom = node => {
  const result = []

  let currentNode = node.prev
  while (currentNode != null) {
    const dr = Math.abs(currentNode.r - node.r)
    const dc = Math.abs(currentNode.c - node.c)
    if (dr + dc <= 20) {
      result.push({
        fromR: node.r,
        fromC: node.c,
        toR: currentNode.r,
        toC: currentNode.c,
        save: node.cost - currentNode.cost - (dr + dc),
      })
    }

    currentNode = currentNode.prev
  }

  return result
}

let finalNode = null
let totalCheats = 0
while (heap.size() > 0) {
  const currentNode = heap.pop()
  const { r, c, cost } = currentNode

  const possibleCheats = getPossibleCheatsFrom(currentNode)
  if (possibleCheats.length > 0) {
    // console.log(possibleCheats)
    totalCheats += possibleCheats.length
    for (const cheat of possibleCheats) {
      addCheat(cheat)
    }
  }

  if (isSeen(r, c)) {
    continue
  }

  markSeen(r, c, cost)

  if (r === er && c === ec) {
    finalNode = currentNode
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

    const node = new Node(nr, nc, ncost, currentNode)

    heap.push(node)
  }
}

console.log(`Ran out of heap nodes. Answer: ${finalNode?.cost ?? "-"}. Total cheats: ${totalCheats}`)

let answer = 0
// There are 32 cheats that save 50 picoseconds.
for (const save of Object.keys(cheats)) {
  const cheatsForSave = cheats[save]
  if (+save < 100) continue

  const numCheatsForSave = Object.keys(cheatsForSave).length
  // console.log(`There are ${numCheatsForSave} cheats that save ${save} picoseconds.`)
  answer += numCheatsForSave
}
console.log(answer)

// 6903 - Too High
// 1452 - Correct
