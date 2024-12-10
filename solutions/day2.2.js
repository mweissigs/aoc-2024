import fs from "fs-extra"

const getInput = async () => await fs.readFile("inputs/day2.txt", "utf-8")

const input = await getInput()

const reports = input.split("\n").filter(line => !!line.trim())

const getReportWithout = (report, index) => {
  const levels = report.split(" ").map(Number)
  return levels.filter((_, i) => i !== index).join(" ")
}

const isReportSafe = (report, isModified) => {
  const levels = report.split(" ").map(Number)

  let increasing = null
  let result = true
  for (let i = 1; i < levels.length; i++) {
    if (increasing == null) {
      increasing = levels[i] > levels[i - 1]
    }

    const diff = levels[i] - levels[i - 1]
    if (diff === 0) {
      result = false
    }

    if (increasing && diff < 0) {
      result = false
    }

    if (!increasing && diff > 0) {
      result = false
    }

    if (Math.abs(diff) > 3) {
      result = false
    }
  }

  if (!result > 0 && !isModified) {
    for (let i = 0; i < report.length; i++) {
      const newReport = getReportWithout(report, i)
      if (isReportSafe(newReport, true)) {
        return true
      }
    }
  }

  return result
}

let safeReports = 0

for (let i = 0; i < reports.length; i++) {
  if (isReportSafe(reports[i])) {
    safeReports++
  } else {
  }
}

// Part 1: 257
console.log(safeReports)
