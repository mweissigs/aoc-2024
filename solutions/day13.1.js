import fs from "fs-extra"

const input = await fs.readFile("inputs/day13.txt", "utf-8")

const machines = []

const lines = input.split("\n").filter(l => !!l.trim())

let machineNumber = 1
for (let i = 0; i < lines.length; i += 3) {
  const buttonA = lines[i].split(": ")[1]
  const buttonB = lines[i + 1].split(": ")[1]
  const prize = lines[i + 2].split(": ")[1]

  machines.push({
    machineNumber: machineNumber++,
    a: {
      x: parseInt(buttonA.split(" ")[0].replace(/[^\d]/g, "")),
      y: parseInt(buttonA.split(" ")[1].replace(/[^\d]/g, "")),
    },
    b: {
      x: parseInt(buttonB.split(" ")[0].replace(/[^\d]/g, "")),
      y: parseInt(buttonB.split(" ")[1].replace(/[^\d]/g, "")),
    },
    prize: {
      x: parseInt(prize.split(" ")[0].replace(/[^\d]/g, "")),
      y: parseInt(prize.split(" ")[1].replace(/[^\d]/g, "")),
    },
  })
}

// A costs 3
// B costs 1
const trySolveMachine = machine => {
  let combinations = []
  for (let a = 0; a <= 100; a++) {
    for (let b = 0; b <= 100; b++) {
      const x = machine.a.x * a + machine.b.x * b
      const y = machine.a.y * a + machine.b.y * b
      if (x === machine.prize.x && y === machine.prize.y) {
        combinations.push({ a, b })
      }
    }
  }

  return combinations
}

const getCheapestCombination = combinations => {
  let cheapestCombination = combinations[0]
  for (const combination of combinations) {
    const cost = combination.a * 3 + combination.b
    if (cost < cheapestCombination) {
      cheapestCombination = combination
    }
  }

  return cheapestCombination
}

let totalTokens = 0
for (const machine of machines) {
  const combination = trySolveMachine(machine)
  const cheapestCombination = getCheapestCombination(combination)
  if (cheapestCombination != null) {
    const cost = cheapestCombination.a * 3 + cheapestCombination.b
    totalTokens += cost
  }
}
console.log(totalTokens)
