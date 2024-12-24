import fs from "fs/promises"

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

let total = 0n
for (let secret of secrets) {
  const original = secret
  for (let i = 0; i < 2000; i++) {
    secret = evolve(secret)
  }
  console.log(original, `-->`, secret)
  total += secret
}

console.log(total)
