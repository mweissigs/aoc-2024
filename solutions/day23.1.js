import fs from "fs/promises"

const input = await fs.readFile("inputs/day23.txt", "utf-8")

const connections = input.split("\n").map(line => line.split("-"))

for (let i = 0; i < connections.length; i += 2) {
  connections.splice(i, 0, [connections[i][1], connections[i][0]])
}

const groupedByFirstName = connections.reduce((acc, [first, second]) => {
  if (!acc[first]) {
    acc[first] = []
  }

  acc[first].push(second)

  return acc
}, {})

const identifyPairsOfSize = (size, currentResult = []) => {
  const results = new Set()
  if (currentResult.length > size) return results

  const nextConnections = groupedByFirstName[currentResult[currentResult.length - 1]]
  const nextResults = nextConnections.map(nc => [...currentResult, nc])

  for (const nextResult of nextResults) {
    if (nextResult[0] === nextResult[nextResult.length - 1] && nextResult.length === size + 1) {
      const cycle = nextResult
        .slice(0, -1)
        .sort((a, b) => a.localeCompare(b))
        .join(",")
      results.add(cycle)
    } else {
      const nestedResults = identifyPairsOfSize(size, nextResult)
      nestedResults.forEach(nr => results.add(nr))
    }
  }

  return results
}

var allResults = new Set()

const firstConnections = Object.keys(groupedByFirstName)
for (const start of firstConnections) {
  const pairsOf3 = identifyPairsOfSize(3, [start])
  pairsOf3.forEach(p => allResults.add(p))
}

const whereAtLeastOneStartsWithT = [...allResults].filter(r => r.split(",").some(x => x.startsWith("t")))
console.log(whereAtLeastOneStartsWithT.length)

// 11011 -- Too high
