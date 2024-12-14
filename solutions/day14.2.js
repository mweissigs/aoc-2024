import fs from "fs-extra"
import readline from "node:readline"

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// })

const input = await fs.readFile("inputs/day14.txt", "utf-8")

const guards = input
  .split("\n")
  .map(line => line.match(/\-?\d+/g).map(Number))
  .map(([px, py, vx, vy]) => ({ px, py, vx, vy }))

const maxX = Math.max(...guards.map(guard => guard.px)) + 1
const maxY = Math.max(...guards.map(guard => guard.py)) + 1

let second = 0
const moveAndPrint = seconds => {
  for (const guard of guards) {
    guard.px += guard.vx
    guard.py += guard.vy

    guard.px = ((guard.px % maxX) + maxX) % maxX
    guard.py = ((guard.py % maxY) + maxY) % maxY
  }
  second++

  let matrix = Array(maxY)
    .fill()
    .map(() => Array(maxX).fill("."))

  for (const guard of guards) {
    matrix[guard.py][guard.px] = "#"
  }

  let output = `Second ${second}\n`
  output += matrix.map(row => row.join("")).join("\n")
  output += "\n\n"

  fs.writeFileSync("./day14out.txt", output, { flag: "a" })

  // console.log(`At second ${second++}`)
  // console.log(matrix.map(row => row.join("")).join("\n"))
}

const initialPxPy = [guards[0].px, guards[0].py]

do {
  moveAndPrint()
  if (guards[0].px === initialPxPy[0] && guards[0].py === initialPxPy[1]) {
    break
  }
} while (true)

console.log(`Guard 1 back in position after ${second} seconds`)
console.log(initialPxPy)
console.log(guards[0])
