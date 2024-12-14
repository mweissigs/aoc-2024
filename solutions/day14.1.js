import fs from "fs-extra"

const input = await fs.readFile("inputs/day14.txt", "utf-8")
const seconds = +process.argv[2]

const guards = input
  .split("\n")
  .map(line => line.match(/\-?\d+/g).map(Number))
  .map(([px, py, vx, vy]) => ({ px, py, vx, vy }))

const maxX = Math.max(...guards.map(guard => guard.px)) + 1
const maxY = Math.max(...guards.map(guard => guard.py)) + 1

for (const guard of guards) {
  guard.px += seconds * guard.vx
  guard.py += seconds * guard.vy

  guard.px = ((guard.px % maxX) + maxX) % maxX
  guard.py = ((guard.py % maxY) + maxY) % maxY
}

const mx = Math.floor(maxX / 2)
const my = Math.floor(maxY / 2)

const q1 = guards.filter(guard => guard.px < mx && guard.py < my).length
const q2 = guards.filter(guard => guard.px > mx && guard.py < my).length
const q3 = guards.filter(guard => guard.px < mx && guard.py > my).length
const q4 = guards.filter(guard => guard.px > mx && guard.py > my).length

console.log(q1 * q2 * q3 * q4)
