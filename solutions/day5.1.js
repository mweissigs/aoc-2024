import fs from "fs-extra"

const getRulesInput = async () => await fs.readFile("inputs/day5-rules.txt", "utf-8")
const getPagesInput = async () => await fs.readFile("inputs/day5-pages.txt", "utf-8")

const rulesInput = await getRulesInput()
const pagesInput = await getPagesInput()

// [X]: [Y1,Y2,...] to indicate that X must be printed before any of Y1,Y2,...
const mustBeBefore = rulesInput
  .split("\n")
  .map(pair => pair.split("|").map(Number))
  .reduce((result, pair) => {
    const existing = result[pair[0]] ?? []
    const value = [...existing, pair[1]]

    return {
      ...result,
      [pair[0]]: value,
    }
  }, {})

const pages = pagesInput.split("\n").map(line => line.split(",").map(Number))

const isPageValid = page => {
  for (let i = page.length - 1; i >= 0; i--) {
    const mustBeBeforeValues = mustBeBefore[page[i]] ?? []
    for (let j = 0; j < i; j++) {
      if (mustBeBeforeValues.includes(page[j])) {
        return false
      }
    }
  }
  return true
}

let total = 0
for (const page of pages) {
  if (isPageValid(page)) {
    const middleDigit = page[Math.floor(page.length / 2)]
    total += middleDigit
  }
}
console.log(total)
