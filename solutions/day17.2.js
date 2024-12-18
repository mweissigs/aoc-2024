import fs from "fs-extra"
import _ from "lodash"

const input = await fs.readFile("inputs/day17.txt", "utf-8")

const lines = input.split("\n")
const inputProgram = lines[4].split(": ")[1].split(",").map(Number)

const find = (program, answer) => {
  if (!program.length) {
    return answer
  }

  let a = BigInt(0)
  let b = BigInt(0)
  let c = BigInt(0)

  var range = _.range(8).map(BigInt)
  for (let t of range) {
    a = (answer << BigInt(3)) | BigInt(t)
    b = a % BigInt(8)
    b = b ^ BigInt(3)
    c = a >> BigInt(b)
    a = a >> BigInt(3)
    b = b ^ BigInt(4)
    b = b ^ c
    if (b % BigInt(8) === BigInt(program[program.length - 1])) {
      let result = find(program.slice(0, -1), (answer << BigInt(3)) | BigInt(t))
      if (result == null) continue
      return result
    }
  }
}

console.log(find(inputProgram, BigInt(0)))
