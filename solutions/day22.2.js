import fs from "fs/promises"
import _ from "lodash"

const input = await fs.readFile("inputs/day22.txt", "utf-8")

const secrets = input.split("\n").map(BigInt)

const evolve = secret => {
  const x = secret * 64n
  secret ^= x
  secret %= 16777216n

  const y = secret / 32n
  secret ^= y
  secret %= 16777216n

  const z = secret * 2048n
  secret ^= z
  secret %= 16777216n

  return secret
}

const pricesLookupBySequence = {}

for (let secret of secrets) {
  const buyer = secret
  const iterations = []

  // Get each iteration and determine the price and change
  for (let i = 0; i < 2000; i++) {
    secret = evolve(secret)
    const price = Number(secret % 10n)

    iterations.push({
      buyer,
      price,
      change: i === 0 ? null : price - iterations[i - 1].price,
    })
  }

  const addSequence = (sequence, iteration) => {
    const key = sequence.join(",")

    if (pricesLookupBySequence[key] == null) {
      pricesLookupBySequence[key] = {}
    }

    if (pricesLookupBySequence[key][iteration.buyer] == null) {
      pricesLookupBySequence[key][iteration.buyer] = iteration.price
    }
  }

  for (let i = 3; i < iterations.length; i++) {
    const x1 = iterations[i - 3].change
    const x2 = iterations[i - 2].change
    const x3 = iterations[i - 1].change
    const x4 = iterations[i].change

    const sequence = [x1, x2, x3, x4]
    addSequence(sequence, iterations[i])
  }
}

const totalsBySequence = Object.keys(pricesLookupBySequence).map(sequence => [
  sequence,
  _.sum(Object.values(pricesLookupBySequence[sequence])),
])
// console.log(pricesLookupBySequence["1,5,0,-9"])
// console.log(totalsBySequence)
const max = _.maxBy(totalsBySequence, ([, total]) => total)
console.log(max)

// 33 - Not right
// 1598 -- Too Low
// 1600 - Correct
