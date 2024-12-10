import fs from "fs-extra"
import _ from "lodash"

const getInput = async () => await fs.readFile("inputs/day9.txt", "utf-8")

const input = await getInput()

const digits = input.split("").map(Number)

let mapping = ""
let freespace = false
let fileId = -1

let blocks = []

let index = 0
for (let i = 0; i < digits.length; i++) {
  if (freespace) {
    mapping += _.repeat(".", digits[i])
    for (let j = 0; j < digits[i]; j++) {
      blocks[index + j] = null
    }

    index += digits[i]
  } else {
    fileId++
    mapping += _.repeat(fileId, digits[i])

    for (let j = 0; j < digits[i]; j++) {
      blocks[index + j] = fileId
    }
    index += digits[i]
  }

  freespace = !freespace
}

for (let i = blocks.length - 1; i >= 0; i--) {
  if (blocks[i] == null) continue
  const firstBlockThatWillFit = blocks.indexOf(null)
  if (firstBlockThatWillFit < 0) continue
  if (firstBlockThatWillFit >= i) continue

  console.log(`${blocks[i]}\t->\t${firstBlockThatWillFit}`)
  blocks[firstBlockThatWillFit] = blocks[i]
  blocks[i] = null
}

let total = 0

for (let i = 0; i < blocks.length; i++) {
  if (blocks[i] == null) continue
  total += blocks[i] * i
}

console.log(total)
