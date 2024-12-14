import fs from "fs-extra"

const input = await fs.readFile("inputs/day13.txt", "utf-8")

const machines = []

const lines = input.split("\n").filter(l => !!l.trim())

const q = 10000000000000
// const q = 0

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
      x: parseInt(prize.split(" ")[0].replace(/[^\d]/g, "")) + q,
      y: parseInt(prize.split(" ")[1].replace(/[^\d]/g, "")) + q,
    },
  })
}

// A costs 3
// B costs 1
const trySolveMachine = machine => {
  // machine.a.x * n1 + machine.b.x * n2 = machine.prize.x
  // machine.a.y * n1 + machine.b.y * n2 = machine.prize.y

  // machine.b.y * (machine.a.x * n1 + machine.b.x * n2) = machine.b.y * machine.prize.x
  // machine.a.y * (machine.a.y * n1 + machine.b.y * n2) = machine.a.y * machine.prize.y

  // Multiply top by b.y
  let an1 = machine.a.x * machine.b.y
  let an2 = machine.b.x * machine.b.y
  let r1 = machine.prize.x * machine.b.y

  // Multiply bottom by b.x
  let bn1 = machine.a.y * machine.b.x
  let bn2 = machine.b.y * machine.b.x
  let r2 = machine.prize.y * machine.b.x

  let n1 = (r1 - r2) / (an1 - bn1)

  // There is no answer if this is a fraction
  if (n1 % 1 != 0) {
    console.log(`Cannot reach X with machine ${machine.machineNumber}: `, n1)
    return 0
  } else {
    console.log(`n1: `, n1)
  }

  let n2 = (machine.prize.x - machine.a.x * n1) / machine.b.x
  if (n2 % 1 != 0) {
    console.log(`Cannot reach Y with machine ${machine.machineNumber}: `, n2)

    return 0
  } else {
    console.log(`n2: `, n2)
  }

  return (n1 * 3) + n2
}

// const getCheapestCombination = combinations => {
//   let cheapestCombination = combinations[0]
//   for (const combination of combinations) {
//     const cost = combination.a * 3 + combination.b
//     if (cost < cheapestCombination) {
//       cheapestCombination = combination
//     }
//   }

//   return cheapestCombination
// }

let totalTokens = 0
for (const machine of machines) {
  const cost = trySolveMachine(machine)
  totalTokens += cost
}
console.log(totalTokens)
