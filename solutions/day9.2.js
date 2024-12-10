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

const findFirstBlockIndexThatCanFit = size => {
  let currentSize = 0
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] == null) {
      currentSize++
      if (currentSize === size) {
        return i - size + 1
      }
    } else {
      currentSize = 0
    }
  }

  return -1
}

// console.log(blocks.map(b => (b == null ? "." : b)).join(""))
let failedMoves = {}
for (let i = blocks.length - 1; i >= 0; i--) {
  if (blocks[i] == null) continue
  if (failedMoves[blocks[i]]) continue

  let fileSize = 0
  inner: for (let j = i; j >= 0; j--) {
    if (blocks[j] === blocks[i]) {
      fileSize++
    } else {
      break inner
    }
  }

  const firstBlockThatWillFit = findFirstBlockIndexThatCanFit(fileSize)
//   console.log(`File id ${blocks[i]} has a size of ${fileSize}, and can fit into ${firstBlockThatWillFit}`)
  if (firstBlockThatWillFit < 0) {
    failedMoves[blocks[i]] = true
    continue
  }
  if (firstBlockThatWillFit >= i) {
    failedMoves[blocks[i]] = true
    continue
  }

  console.log(`${blocks[i]}\t->\t${firstBlockThatWillFit}`)
  for (let j = 0; j < fileSize; j++) {
    blocks[firstBlockThatWillFit + j] = blocks[i - j]
    blocks[i - j] = null
  }
//   console.log(blocks.map(b => (b == null ? "." : b)).join(""))
}

let total = 0

for (let i = 0; i < blocks.length; i++) {
  if (blocks[i] == null) continue
  total += blocks[i] * i
}

console.log(total)

// 7424842570768 -- Too high
