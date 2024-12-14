import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day11.txt", "utf-8")

const input = await getInput()
const times = +process.argv.find(a => a.startsWith("--times=")).split("=")[1]

let stones = input
  .split(/\s+/g)
  .map(Number)
  .reduce(
    (map, stone) => ({
      ...map,
      [stone]: (map[stone] || 0) + 1,
    }),
    {}
  )

const mutate = () => {
  const newStones = {}
  for (const stone of Object.keys(stones)) {
    if (stone == 0) {
      newStones[1] ??= 0
      newStones[1] += stones[stone] ?? 1
    } else if (stone.toString().length % 2 === 0) {
      let leftDigits = +stone.toString().slice(0, stone.toString().length / 2)
      let rightDigits = +stone.toString().slice(stone.toString().length / 2)

      // console.log(`Split ${stone} into ${leftDigits} and ${rightDigits}`)

      newStones[leftDigits] ??= 0
      newStones[leftDigits] += stones[stone] ?? 1

      newStones[rightDigits] ??= 0
      newStones[rightDigits] += stones[stone] ?? 1
    } else {
      newStones[stone * 2024] ??= 0
      newStones[stone * 2024] += stones[stone] ?? 1
    }
  }

  return newStones
}

const blink = times => {
  for (let time = 0; time < times; time++) {
    stones = mutate()
  }
}

const start = Date.now()
blink(times)
const end = Date.now()

console.log(stones)
console.log(Object.values(stones).reduce((acc, val) => acc + val, 0))
console.log(`Finished in ${end - start}ms`)
