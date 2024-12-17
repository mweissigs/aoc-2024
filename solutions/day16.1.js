import fs from "fs-extra"
import _ from "lodash"
import { Heap } from "heap-js"

const input = await fs.readFile("inputs/day16.txt", "utf-8")

const matrix = input
  .split("\n")
  .filter(l => !!l)
  .map(l => l.split(""))

let sr, sc

for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[r].length; c++) {
    if (matrix[r][c] === "S") {
      sr = r
      sc = c
    }
  }
}

const priorityComparator = (a, b) => a.cost - b.cost
const heap = new Heap(priorityComparator)

heap.push({ cost: 0, r: sr, c: sc, dr: 0, dc: 1 })

const seen = {}

while (heap.size() > 0) {
  const { cost, r, c, dr, dc } = heap.pop()
  seen[`${r}.${c}.${dr}.${dc}`] = true

  if (matrix[r][c] === "E") {
    console.log(cost)
    break
  }

  const moveForward = {
    ncost: cost + 1,
    nr: r + dr,
    nc: c + dc,
    ndr: dr,
    ndc: dc,
  }

  const turnLeft = {
    ncost: cost + 1000,
    nr: r,
    nc: c,
    ndr: dc,
    ndc: -dr,
  }

  const turnRight = {
    ncost: cost + 1000,
    nr: r,
    nc: c,
    ndr: -dc,
    ndc: dr,
  }

  const options = [moveForward, turnLeft, turnRight]

  for (const { ncost, nr, nc, ndr, ndc } of options) {
    if (matrix[nr][nc] === "#") continue
    if (seen[`${nr}.${nc}.${ndr}.${ndc}`] != null) continue
    heap.push({
      cost: ncost,
      r: nr,
      c: nc,
      dr: ndr,
      dc: ndc,
    })
  }
}
