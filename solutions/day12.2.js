import fs from "fs-extra"

const input = await fs.readFile("inputs/day12.txt", "utf-8")

const plots = input.split("\n").map(p => p.split(""))

const printRegion = region => console.log(JSON.stringify(region, 0, 0))

const regionContains = (region, r, c) => region.some(plot => plot[0] === r && plot[1] === c)

const getRegionArea = region => region.plots.length

// A plot is a perimeter plot if it has a different plot on any of its sides
const getRegionPerimeterPlots = region => {
  const perimeterPlots = []
  for (const plot of region.plots) {
    const [r, c] = plot

    const left = plots[r][c - 1]
    const right = plots[r][c + 1]
    const top = plots[r - 1]?.[c]
    const bottom = plots[r + 1]?.[c]

    if (left != region.plot) {
      perimeterPlots.push([...plot, "left"])
    }

    if (right != region.plot) {
      perimeterPlots.push([...plot, "right"])
    }

    if (top != region.plot) {
      perimeterPlots.push([...plot, "top"])
    }

    if (bottom != region.plot) {
      perimeterPlots.push([...plot, "bottom"])
    }
  }

  return perimeterPlots
}

// A perimeter side is a collection of contiguous perimeter plots
const getNumberOfPerimeterSides = perimeterPlots => {
  let numberOfSides = 0

  for (let r = 0; r < plots.length; r++) {
    const topPlots = perimeterPlots.filter(plot => plot[0] === r && plot[2] === "top").sort((a, b) => a[1] - b[1])
    let previousTopPlot = null
    for (const topPlot of topPlots) {
      // This is the first plot of this "side"
      if (!previousTopPlot) {
        numberOfSides++
        // There is a gap between this plot and the previous one, indicating a new "side"
      } else if (Math.abs(previousTopPlot[1] - topPlot[1]) > 1) {
        console.log(`Detected a gap between ${previousTopPlot} and ${topPlot}. Adding a new side`)
        numberOfSides++
      }

      previousTopPlot = topPlot
    }

    const bottomPlots = perimeterPlots.filter(plot => plot[0] === r && plot[2] === "bottom").sort((a, b) => a[1] - b[1])
    let previousBottomPlot = null
    for (const bottomPlot of bottomPlots) {
      // This is the first plot of this "side"
      if (!previousBottomPlot) {
        numberOfSides++
        // There is a gap between this plot and the previous one, indicating a new "side"
      } else if (Math.abs(previousBottomPlot[1] - bottomPlot[1]) > 1) {
        console.log(`Detected a gap between ${previousBottomPlot} and ${bottomPlot}. Adding a new side`)
        numberOfSides++
      }

      previousBottomPlot = bottomPlot
    }
  }

  for (let c = 0; c < plots[0].length; c++) {
    const leftPlots = perimeterPlots.filter(plot => plot[1] === c && plot[2] === "left").sort((a, b) => a[0] - b[0])
    let previousLeftPlot = null
    for (const leftPlot of leftPlots) {
      // This is the first plot of this "side"
      if (!previousLeftPlot) {
        numberOfSides++
        // There is a gap between this plot and the previous one, indicating a new "side"
      } else if (Math.abs(previousLeftPlot[0] - leftPlot[0]) > 1) {
        console.log(`Detected a gap between ${previousLeftPlot} and ${leftPlot}. Adding a new side`)
        numberOfSides++
      }

      previousLeftPlot = leftPlot
    }

    const rightPlots = perimeterPlots.filter(plot => plot[1] === c && plot[2] === "right").sort((a, b) => a[0] - b[0])
    let previousRightPlot = null
    for (const rightPlot of rightPlots) {
      // This is the first plot of this "side"
      if (!previousRightPlot) {
        numberOfSides++
        // There is a gap between this plot and the previous one, indicating a new "side"
      } else if (Math.abs(previousRightPlot[0] - rightPlot[0]) > 1) {
        console.log(`Detected a gap between ${previousRightPlot} and ${rightPlot}. Adding a new side`)
        numberOfSides++
      }

      previousRightPlot = rightPlot
    }
  }

  return numberOfSides
}

const buildRegion = (plot, r, c, result = []) => {
  if (plots[r]?.[c] === plot && !regionContains(result, r, c)) {
    result.push([r, c])
  } else {
    return result
  }

  buildRegion(plot, r, c - 1, result)
  buildRegion(plot, r, c + 1, result)
  buildRegion(plot, r - 1, c, result)
  buildRegion(plot, r + 1, c, result)

  return {
    plot,
    plots: result,
  }
}

const buildRegions = () => {
  const regions = []

  for (let r = 0; r < plots.length; r++) {
    for (let c = 0; c < plots[r].length; c++) {
      if (regions.some(region => regionContains(region.plots, r, c))) {
        continue
      }

      regions.push(buildRegion(plots[r][c], r, c))
    }
  }

  return regions
}

const regions = buildRegions()

let total = 0
regions.forEach(region => {
  // printRegion(region)
  const area = getRegionArea(region)
  const perimeterPlots = getRegionPerimeterPlots(region)
  const perimeterSides = getNumberOfPerimeterSides(perimeterPlots)
  if (region.plot === "I") {
    console.log(`Area: `, area)
    console.log(`Perimeter Plots: `, perimeterPlots)
    console.log(`# of Sides: `, perimeterSides)
    console.log("\n")
  }

  total += area * perimeterSides
})

console.log(total)
