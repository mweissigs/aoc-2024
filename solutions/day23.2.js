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

const groupedByFirstThenLast = connections.reduce((acc, [first, second]) => {
  if (!acc[first]) {
    acc[first] = {}
  }

  if (!acc[first][second]) {
    acc[first][second] = 1
  }

  return acc
}, {})

const lansByFirst = {}

const addLanFor = (first, pair) => {
  if (first === "wq") console.log(`[${first}] Adding LAN for ${pair.join(",")}`)
  if (lansByFirst[first] == null) {
    lansByFirst[first] = {
      computers: new Set(),
      pairs: new Set(),
    }
  }

  lansByFirst[first].computers.add(pair[0])
  lansByFirst[first].computers.add(pair[1])
  lansByFirst[first].pairs.add(pair.sort((a, b) => a.localeCompare(b)).join(","))
}

for (const first of Object.keys(groupedByFirstThenLast)) {
  const seconds = Object.keys(groupedByFirstThenLast[first])
  // console.log(`Seeing how large of a LAN we can create with ${first} and `, seconds)

  let allPossibilities = []
  for (let i = 0; i < seconds.length; i++) {
    allPossibilities.push([first, seconds[i]])
    for (let j = i + 1; j < seconds.length; j++) {
      allPossibilities.push([seconds[i], seconds[j]])
    }
  }

  // console.log(`Before pruning invalid combos: `)
  // console.log(allPossibilities)

  for (let i = 0; i < allPossibilities.length; i++) {
    const [first, second] = allPossibilities[i]
    if (!groupedByFirstThenLast[first][second]) {
      // console.log(`${first} and ${second} are not associated. Removing all cases with ${second}`)
      allPossibilities = allPossibilities.filter(ap => !ap.includes(second))
      i = 0 // Just start over, no idea how long we have to do this
      continue
    }
  }

  // console.log(`After pruning invalid combos: `)
  // console.log(allPossibilities)

  for (const pair of allPossibilities) {
    addLanFor(first, pair)
  }

  // for (let i = 0; i < seconds.length; i++) {
  //   const a = seconds[i]
  //   const isAssociatedWithFirst = groupedByFirstThenLast[first][a]
  //   if (!isAssociatedWithFirst) {
  //     console.log(`${first} and ${a} are not associated. Skipping`)
  //     continue
  //   }

  //   // if (log) console.log(`Adding LAN for ${first} and ${seconds[i]}`)
  //   // addLanFor(first, [first, seconds[i]])
  //   for (let j = i + 1; j < seconds.length; j++) {
  //     const b = seconds[j]
  //     const areSecondsAssociated = groupedByFirstThenLast[a][b]
  //     if (!areSecondsAssociated) {
  //       console.log(`${a} and ${b} are not associated. Skipping`)
  //       continue
  //     }

  //     addLanFor(first, [first, a])
  //     addLanFor(first, [first, b])
  //     addLanFor(first, [a, b])
  //   }
  // }
}

// console.log(groupedByFirstThenLast)
// console.log(lansByFirst)
const largestLans = Array.from(
  new Set(
    Object.values(lansByFirst)
      .map(lan =>
        Array.from(lan.computers)
          .sort((a, b) => a.localeCompare(b))
          .join(",")
      )
      .sort((a, b) => b.length - a.length)
  )
)

console.log(largestLans)

process.exit(0)

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
  const pairsOf3 = identifyPairsOfSize(2, [start])
  pairsOf3.forEach(p => allResults.add(p))
}

console.log(allResults)
