import { describe, expect, it } from 'vitest'

import { convertToSeconds, timePattern } from '@/helper/helper.ts'

describe('duration input', () => {
  it.each([
    ['00:00:01', 1],
    ['00:59:59', 3599],
    ['01:30:00', 5400],
    ['23:59:59', 86399],
  ])('accepts %s and converts it to %i seconds', (input, seconds) => {
    expect(timePattern.test(input)).toBe(true)
    expect(convertToSeconds(input)).toBe(seconds)
  })

  it.each([
    '00:99:00',
    '00:60:00',
    '00:00:60',
    '00:00:99',
    '24:00:00',
    '1:30:00',
    '01:3:00',
    '01:30:0',
    '-1:30:00',
    '01:30',
    ' 01:30:00 ',
    'invalid',
    '',
  ])('rejects %s instead of normalizing it', (input) => {
    expect(timePattern.test(input)).toBe(false)
    expect(convertToSeconds(input)).toBe(0)
  })
})
