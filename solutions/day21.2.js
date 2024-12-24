import fastCartesian from "fast-cartesian"
import fs from "fs/promises"
import _ from "lodash"

const input = await fs.readFile("inputs/day21.txt", "utf-8")

const combinations = input.split("\n")

class Node {
  constructor(r, c, path) {
    this.r = r
    this.c = c
    this.path = path
  }
}

const keypad = [
  [7, 8, 9],
  [4, 5, 6],
  [1, 2, 3],
  [null, 0, "A"],
]

const dpad = [
  [null, "^", "A"],
  ["<", "v", ">"],
]

const keypadCache = {}
const dpadCache = {}

const getCacheEntry = (cache, from, to) => {
  if (cache[from] == null) {
    cache[from] = {}
  }

  return cache[from][to]
}

const setCacheEntry = (cache, from, to, value) => {
  if (cache[from] == null) {
    cache[from] = {}
  }

  cache[from][to] = value
}

const getAllPossibleInputsToGetTo = (pad, from, to) => {
  const cache = pad === keypad ? keypadCache : dpadCache
  const cachedValue = getCacheEntry(cache, from, to)
  if (cachedValue != null) {
    // console.log(`Got a cache hit for pad `, pad, `going from ${from} to ${to}`)
    return cachedValue
  }

  const lookup = {}
  for (let r = 0; r < pad.length; r++) {
    for (let c = 0; c < pad[0].length; c++) {
      lookup[pad[r][c]] = [r, c]
    }
  }

  const queue = []
  const possibilities = []

  queue.push(new Node(lookup[from][0], lookup[from][1], "", 0, null))

  if (from === to) {
    possibilities.push(new Node(lookup[from][0], lookup[from][1], "A"))
  } else {
    let shortestLength = Number.MAX_VALUE

    outer: while (queue.length > 0) {
      const currentNode = queue.shift()
      const { r: cr, c: cc } = currentNode

      const moveLeft = new Node(cr, cc - 1, currentNode.path + "<")
      const moveRight = new Node(cr, cc + 1, currentNode.path + ">")
      const moveUp = new Node(cr - 1, cc, currentNode.path + "^")
      const moveDown = new Node(cr + 1, cc, currentNode.path + "v")
      const options = [moveLeft, moveRight, moveUp, moveDown]

      for (const option of options) {
        const nextNode = option
        const { r: nr, c: nc } = nextNode

        if (nr < 0 || nc < 0 || nr >= pad.length || nc >= pad[0].length) {
          continue
        }

        if (pad[nr]?.[nc] == null) {
          continue
        }

        if (nextNode.path.length > shortestLength) {
          break outer
        }

        if (nr === lookup[to][0] && nc === lookup[to][1]) {
          const finalPath = nextNode.path + "A"
          shortestLength = finalPath.length
          nextNode.path = finalPath
          possibilities.push(nextNode)
        }

        queue.push(nextNode)
      }
    }
  }

  const result = possibilities.map(p => p.path)
  setCacheEntry(cache, from, to, result)
  return result
}

const getAllKeypadInputsForCombination = (pad, combination) => {
  let results = []
  let kp = "A"

  for (const input of combination) {
    results.push(getAllPossibleInputsToGetTo(pad, kp, input))
    kp = input
  }

  return fastCartesian(results).map(input => input.join(""))
}

const numRobots = 25
let answer = 0

for (const combination of combinations) {
  console.log(`Combination: `, combination)
  const keypadInputs = getAllKeypadInputsForCombination(keypad, combination)
  let next = keypadInputs
  for (let i = 0; i < numRobots; i++) {
    let robotInputs = next.flatMap(input => getAllKeypadInputsForCombination(dpad, input))
    const lengths = _.uniq(robotInputs.map(i => i.length))
    let minLength = Math.min(...lengths)
    robotInputs = robotInputs.filter(i => i.length === minLength)
    next = robotInputs
  }

  answer += next[0].length * combination.replaceAll(/[^\d]/g, "")
}

console.log(answer)
