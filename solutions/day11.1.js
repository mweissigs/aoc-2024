import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day11.txt", "utf-8")

const input = await getInput()
const times = +process.argv.find(a => a.startsWith("--times=")).split("=")[1]

const stones = input.split(/\s+/g).map(Number)

const mutateStone = (i, log) => {
  const stone = stones[i]
  if (stone === 0) {
    if (log) console.log(`Index ${i} has a value of ${stone}. Condition 1`)
    stones[i] = 1
    return 1
  } else if (stone.toString().length % 2 === 0) {
    if (log) console.log(`Index ${i} has a value of ${stone}. Condition 2`)
    let leftDigits = +stone.toString().slice(0, stone.toString().length / 2)
    let rightDigits = +stone.toString().slice(stone.toString().length / 2)

    stones[i] = leftDigits
    // stones.splice(i + 1, 0, rightDigits)
    stones.push(rightDigits)
    return 2
  } else {
    if (log) console.log(`Index ${i} has a value of ${stone}. Condition 3`)
    stones[i] = stones[i] * 2024
    return 1
  }
}

const blink = times => {
  for (let time = 0; time < times; time++) {
    // console.log(`Executing blink #${time + 1}`)
    for (let i = 0; i < stones.length;) {
      i += mutateStone(i, false)
    }
    // console.log(`After ${time + 1}: ${stones.length}`)
    // console.log(stones.length, "\t", stones.join(" "))
  }
}

// console.log(stones.length, "\t", stones.join(" "))
// console.log(stones.join(" "))
const start = Date.now()
blink(times)
const end = Date.now()
// console.log(stones.length, "\t", stones.join(" "))
console.log(`Finished in ${end - start}ms`)
// console.log(stones.length)
