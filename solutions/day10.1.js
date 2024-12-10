import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day10.txt", "utf-8")

const input = await getInput()

const map = input.split("\n").map(line => line.split("").map(Number))

const tryAddResult = (result, r, c) => {
  if (!result.some(([row, col]) => row === r && col === c)) {
    result.push([r, c])
  }
}

const traverse = (r, c, val = 0, path = [], log = false) => {
  if (log) console.log(`Stepped onto ${r}, ${c}`, path)

  let result = []

  if (map[r]?.[c] === 9) {
    if (log) console.log(`Landed on 9, returning [${r}, ${c}]`)
    return [[r, c]]
  }

  const left = map[r]?.[c - 1]
  const right = map[r]?.[c + 1]
  const up = map[r - 1]?.[c]
  const down = map[r + 1]?.[c]

  const nextStep = val + 1

  if (left !== nextStep && right !== nextStep && up !== nextStep && down !== nextStep) {
    if (log) console.log(`There are no next steps around us at ${r}, ${c}. Returning empty array.`)
    return []
  }

  if (left === nextStep) {
    if (log) console.log(`Found next step to the left at ${r}, ${c}`)
    const newPath = [...path, [r, c]]
    const recursedResults = traverse(r, c - 1, nextStep, newPath, log)
    for (const recursedResult of recursedResults) {
      tryAddResult(result, recursedResult[0], recursedResult[1])
    }
  }

  if (right === nextStep) {
    if (log) console.log(`Found next step to the right at ${r}, ${c}`)
    const newPath = [...path, [r, c]]
    const recursedResults = traverse(r, c + 1, nextStep, newPath, log)
    for (const recursedResult of recursedResults) {
      tryAddResult(result, recursedResult[0], recursedResult[1])
    }
  }

  if (up === nextStep) {
    if (log) console.log(`Found next step up at ${r}, ${c}`)
    const newPath = [...path, [r, c]]
    const recursedResults = traverse(r - 1, c, nextStep, newPath, log)
    for (const recursedResult of recursedResults) {
      tryAddResult(result, recursedResult[0], recursedResult[1])
    }
  }

  if (down === nextStep) {
    if (log) console.log(`Found next step down at ${r}, ${c}`)
    const newPath = [...path, [r, c]]
    const recursedResults = traverse(r + 1, c, nextStep, newPath, log)
    for (const recursedResult of recursedResults) {
      tryAddResult(result, recursedResult[0], recursedResult[1])
    }
  }

  return result
}

let total = 0

let trailheads = {}
for (let r = 0; r < map.length; r++) {
  for (let c = 0; c < map[r].length; c++) {
    if (map[r][c] === 0) {
      const accessible9s = traverse(r, c)
      trailheads[`${r},${c}`] = accessible9s

      total += accessible9s.length
    }
  }
}

console.log(total)
