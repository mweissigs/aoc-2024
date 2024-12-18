import fs from "fs-extra"

const input = await fs.readFile("inputs/day17.txt", "utf-8")

const lines = input.split("\n")

let registerA = BigInt(lines[0].split(": ")[1])
let registerB = BigInt(lines[1].split(": ")[1])
let registerC = BigInt(lines[2].split(": ")[1])

const program = lines[4].split(": ")[1].split(",").map(Number)

const outputs = []

const getComboOperand = operand =>
  [0n, 1n, 2n, 3n].includes(operand)
    ? operand
    : operand === 4n
    ? registerA
    : operand === 5n
    ? registerB
    : operand === 6n
    ? registerC
    : null

const processAdv = operand => {
  const numerator = registerA
  const denominator = 2n ** getComboOperand(operand)
  const result = numerator / denominator
  registerA = result >> 0n
  return false
}

const processBxl = operand => {
  registerB = registerB ^ operand
  return false
}

const processBst = operand => {
  registerB = getComboOperand(operand) % 8n
  return false
}

const processJnz = operand => {
  if (registerA === 0n) {
    return false
  }

  instructionPointer = operand
  return true
}

const processBxc = operand => {
  registerB = registerB ^ registerC
  return false
}

const processOut = operand => {
  const output = getComboOperand(operand) % 8n
  outputs.push(output)
  return false
}

const processBdv = operand => {
  const numerator = registerA
  const denominator = 2n ** getComboOperand(operand)
  const result = numerator / denominator
  registerB = result >> 0n
  return false
}

const processCdv = operand => {
  const numerator = registerA
  const denominator = 2n ** getComboOperand(operand)
  const result = numerator / denominator
  registerC = result >> 0n
  return false
}

const processInstruction = (instruction, operand) => {
  switch (instruction) {
    case 0:
      return processAdv(operand)
    case 1:
      return processBxl(operand)
    case 2:
      return processBst(operand)
    case 3:
      return processJnz(operand)
    case 4:
      return processBxc(operand)
    case 5:
      return processOut(operand)
    case 6:
      return processBdv(operand)
    case 7:
      return processCdv(operand)
    default:
      throw new Error(`Invalid instruction: ${instruction}`)
  }
}

let instructionPointer = 0n
while (instructionPointer < program.length) {
  let instruction = program[instructionPointer]
  let operand = BigInt(program[instructionPointer + 1n])

  const skipJump = processInstruction(instruction, operand)
  if (!skipJump) {
    instructionPointer += 2n
  }
}

console.log(`Register A: `, registerA)
console.log(`Register B: `, registerB)
console.log(`Register C: `, registerC)

console.log(outputs.join(","))
