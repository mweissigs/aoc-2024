import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day2.txt", "utf-8")

const input = await getInput()

const reports = input.split("\n").filter(line => !!line.trim())

const isReportSafe = report => {
  const levels = report.split(" ").map(Number)

  let increasing = null
  for (let i = 1; i < levels.length; i++) {
    if (increasing == null) {
      increasing = levels[i] > levels[i - 1]
    }

    const diff = levels[i] - levels[i - 1]
    if (diff === 0) return false

    if (increasing && diff < 0) return false
    if (!increasing && diff > 0) return false

    if (Math.abs(diff) > 3) return false
  }

  return true
}

let safeReports = 0

for (let i = 0; i < reports.length; i++) {
  if (isReportSafe(reports[i])) {
    safeReports++
  } else {
  }
}

console.log(safeReports)
