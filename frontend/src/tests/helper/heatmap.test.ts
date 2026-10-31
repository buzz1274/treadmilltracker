import { describe, expect, it } from 'vitest'

import { buildHeatmapMonths } from '@/helper/heatmap'

describe('monthly heatmap', () => {
  it('includes exactly twelve months across a year boundary', () => {
    const months = buildHeatmapMonths('2025-11-01', '2026-10-31', [])
    expect(months).toHaveLength(12)
    expect(months[0]?.key).toBe('2025-11')
    expect(months[11]?.key).toBe('2026-10')
    expect(months.every((month) => month.days.length === 42)).toBe(true)
  })

  it('aligns days to Monday and includes leap day', () => {
    const month = buildHeatmapMonths('2024-02-01', '2024-12-31', [])[0]
    expect(month?.days.slice(0, 3)).toEqual([null, null, null])
    expect(month?.days[3]?.date).toBe('2024-02-01')
    expect(month?.days.filter(Boolean)).toHaveLength(29)
    expect(month?.days.some((day) => day?.date === '2024-02-29')).toBe(true)
  })

  it('sums runs recorded on the same date', () => {
    const months = buildHeatmapMonths('2024-01-01', '2024-12-31', [
      { run_date: '2024-01-02', distance_m: 5000 },
      { run_date: '2024-01-02', distance_m: 2500 },
    ])
    expect(months[0]?.days[1]).toMatchObject({
      date: '2024-01-02',
      recorded: true,
      label: '2 Jan 2024: 7.50 km',
    })
    expect(months[0]?.days[0]?.recorded).toBe(false)
  })

  it('distinguishes future days from days with no runs', () => {
    const months = buildHeatmapMonths('2024-01-01', '2024-01-15', [])
    expect(months[0]?.days[0]?.label).toBe('1 Jan 2024: No runs recorded')
    expect(months[0]?.days[15]).toMatchObject({
      date: '2024-01-16',
      future: true,
      recorded: false,
    })
  })
})
