import moment from 'moment'
import { describe, expect, it } from 'vitest'

import { generateDateSequence } from '@/helper/helper.ts'
import type { TInterval } from '@/types/date.constants.ts'

interface ISequenceCase {
  description: string
  start: string
  end: string
  interval: TInterval
  dates: string[]
}

const cases: ISequenceCase[] = [
  {
    description: 'includes the final month after a month-end start',
    start: '2026-01-31',
    end: '2026-03-01',
    interval: 'months',
    dates: ['Jan, 2026', 'Feb, 2026', 'Mar, 2026'],
  },
  {
    description: 'includes partial months across a year boundary',
    start: '2025-12-31',
    end: '2026-02-01',
    interval: 'months',
    dates: ['Dec, 2025', 'Jan, 2026', 'Feb, 2026'],
  },
  {
    description: 'includes a single partial month',
    start: '2026-03-20',
    end: '2026-03-25',
    interval: 'months',
    dates: ['Mar, 2026'],
  },
  {
    description: 'includes the final year after a late-year start',
    start: '2024-12-31',
    end: '2026-01-01',
    interval: 'years',
    dates: ['2024', '2025', '2026'],
  },
  {
    description: 'includes the final year after a leap-day start',
    start: '2024-02-29',
    end: '2025-01-01',
    interval: 'years',
    dates: ['2024', '2025'],
  },
  {
    description: 'includes a single partial year',
    start: '2026-10-01',
    end: '2026-10-31',
    interval: 'years',
    dates: ['2026'],
  },
  {
    description: 'preserves daily boundaries',
    start: '2026-10-30',
    end: '2026-11-01',
    interval: 'days',
    dates: ['Oct 30th, 2026', 'Oct 31st, 2026', 'Nov 1st, 2026'],
  },
  {
    description: 'preserves Monday-based weekly boundaries',
    start: '2026-10-31',
    end: '2026-11-02',
    interval: 'weeks',
    dates: ['Oct 26th, 2026', 'Nov 2nd, 2026'],
  },
]

describe('generateDateSequence', () => {
  it.each(cases)('$description', ({ start, end, interval, dates }) => {
    expect(generateDateSequence(moment(start), moment(end), interval)).toEqual(
      dates.map((date) => ({ date, data: null })),
    )
  })

  it.each<TInterval>(['months', 'years'])(
    'does not mutate inputs when grouping by %s',
    (interval) => {
      const start = moment('2025-12-31T12:30:00')
      const end = moment('2026-02-01T15:45:00')
      const originalStart = start.valueOf()
      const originalEnd = end.valueOf()
      const expected = generateDateSequence(start, end, interval)
      expect(start.valueOf()).toBe(originalStart)
      expect(end.valueOf()).toBe(originalEnd)
      expect(
        generateDateSequence(start.toDate(), end.toDate(), interval),
      ).toEqual(expected)
    },
  )

  it.each<TInterval>(['months', 'years'])(
    'returns no periods for a reversed %s range',
    (interval) => {
      expect(
        generateDateSequence(
          moment('2026-10-31'),
          moment('2026-10-01'),
          interval,
        ),
      ).toEqual([])
    },
  )
})
