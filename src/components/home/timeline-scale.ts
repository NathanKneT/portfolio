// The home timeline's time scale (design-phase.md §2: a month has the same width everywhere).
// Every position is computed from month numbers, the same way on the server and in the browser.

// The axis starts here, two months before the first role.
export const AXIS_START = "2022-07"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// "2025-09" -> a month number. The month itself starts at that number and ends one later.
export const monthNumber = (iso: string) => {
  const [year, month] = iso.split("-").map(Number)
  return year * 12 + (month - 1)
}

export type Scale = {
  start: number
  end: number
  // Now, with the day as a fraction of the month.
  now: number
  // "Nov 2026"
  nowLabel: string
  months: number
  // January of each year inside the axis: the year lines.
  years: { year: number; at: number }[]
  // A share of the axis, from 0 to 1.
  share: (month: number) => number
}

/**
 * "Now" is the build date: the server and the browser draw the same picture,
 * and the label says which month it is ("Now · Nov 2026"). The axis ends two
 * months after the month of the build, on a month boundary.
 */
export const makeScale = (built: Date): Scale => {
  const year = built.getUTCFullYear()
  const month = built.getUTCMonth()
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const nowMonth = year * 12 + month
  const now = nowMonth + (built.getUTCDate() - 1) / days
  const start = monthNumber(AXIS_START)
  const end = nowMonth + 2
  const months = end - start
  const years: Scale["years"] = []
  for (let y = Math.ceil(start / 12); y * 12 < end; y += 1) {
    if (y * 12 > start) years.push({ year: y, at: y * 12 })
  }
  return {
    start,
    end,
    now,
    nowLabel: `${MONTHS[month]} ${year}`,
    months,
    years,
    share: (value: number) => (value - start) / months,
  }
}
