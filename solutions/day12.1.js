import fs from "fs-extra"

const input = await fs.readFile("inputs/day12.txt", "utf-8")

const plots = input.split("\n").map(p => p.split(""))

const printRegion = region => console.log(JSON.stringify(region, 0, 0))

const regionContains = (region, r, c) => region.some(plot => plot[0] === r && plot[1] === c)

const getRegionArea = region => region.plots.length
const getRegionPerimeter = region => {
  let result = 0
  for (const plot of region.plots) {
    const [r, c] = plot
    let perimeter = 0

    const left = plots[r][c - 1]
    const right = plots[r][c + 1]
    const top = plots[r - 1]?.[c]
    const bottom = plots[r + 1]?.[c]

    if (left !== region.plot) {
      perimeter++
    }

    if (right !== region.plot) {
      perimeter++
    }

    if (top !== region.plot) {
      perimeter++
    }

    if (bottom !== region.plot) {
      perimeter++
    }

    result += perimeter
  }

  return result
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
  printRegion(region)
  const area = getRegionArea(region)
  const perimeter = getRegionPerimeter(region)
  console.log(`Area: `, area)
  console.log(`Perimeter: `, perimeter)
  console.log("\n")

  total += area * perimeter
})

console.log(total)
