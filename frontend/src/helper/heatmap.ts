import moment from 'moment'

import type { IRunData } from '@/types/types'

export function buildHeatmapMonths(
  startDate: string,
  endDate: string,
  runs: Pick<IRunData, 'run_date' | 'distance_m'>[],
) {
  const totals = new Map<string, number>()
  for (const run of runs) {
    totals.set(run.run_date, (totals.get(run.run_date) ?? 0) + run.distance_m)
  }

  const start = moment(startDate).startOf('month')
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const month = start.clone().add(monthIndex, 'months')
    const offset = month.isoWeekday() - 1
    const days = Array.from({ length: 42 }, (_, cellIndex) => {
      const dayNumber = cellIndex - offset + 1
      if (dayNumber < 1 || dayNumber > month.daysInMonth()) return null
      const day = month.clone().date(dayNumber)
      const date = day.format('YYYY-MM-DD')
      const future = date > endDate || day.isAfter(moment(), 'day')
      const distance = totals.get(date)
      return {
        date,
        recorded: !future && distance !== undefined,
        future,
        label: `${day.format('D MMM YYYY')}: ${
          future
            ? 'Future date'
            : distance === undefined
              ? 'No runs recorded'
              : `${(distance / 1000).toFixed(2)} km`
        }`,
      }
    })
    return {
      key: month.format('YYYY-MM'),
      label: month.format('MMM YYYY'),
      days,
    }
  })
}
