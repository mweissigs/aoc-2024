import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day7.txt", "utf-8")

const input = await getInput()

let equations = input.split("\n").map(line => line.split(":").map(s => s.trim()))
equations = equations.map(pair => [Number(pair[0]), pair[1].split(" ").map(Number)])

const solveEquation = (numbers, operators) => {
  let result = numbers[0]

  for (let i = 1; i < numbers.length; i++) {
    let operator = operators[i - 1]
    if (operator === "+") {
      result += numbers[i]
    } else if (operator === "*") result *= numbers[i]
    else if (operator === "||") result = +`${result}${numbers[i]}`
  }

  return result
}

const getPossibleOperatorCombinations = n => {
  let result = [["+"], ["*"], ["||"]]

  for (let i = 0; i < n - 1; i++) {
    // Add a new + and * for each existing result
    for (let j = 0; j < result.length; j += 3) {
      result.splice(j, 0, [...result[j]])
      result.splice(j, 0, [...result[j]])
      result[j].push("+")
      result[j + 1].push("*")
      result[j + 2].push("||")
    }
  }

  return result
}

let total = 0
for (const equation of equations) {
  console.log(`Attempting `, JSON.stringify(equation))
  const targetValue = equation[0]
  let numbers = equation[1]
  let possibleOperators = getPossibleOperatorCombinations(numbers.length - 1)

  for (const operators of possibleOperators) {
    const value = solveEquation(numbers, operators)
    if (value === targetValue) {
      total += value
      break
    }
  }
}

console.log(total)
