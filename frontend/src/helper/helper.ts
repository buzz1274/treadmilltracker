import moment, { type Moment } from 'moment/moment'

import type { tDateArray } from '@/types/types'

const formatSecondsAsHHMMSS: (seconds: number) => string = (seconds: number): string => {
  const formattedHours: string = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const formattedMinutes: string = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const formattedSeconds: string = String(seconds % 60).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

const convertToSeconds: (time: string) => number = (time: string): number => {
  if (!time) return 0

  const [hours, minutes, seconds]: [string, string, string] = time.split(':')

  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
}

const formatDate = (date: string | Moment, format = 'daily'): string | Moment => {
  if (format === 'daily' || format === 'weekly') {
    return moment(date).format('MMM Do, YYYY')
  } else if (format === 'monthly') {
    return moment(date).format('MMM, YYYY')
  } else if (format === 'ISO-8601') {
    return moment(date).format('YYYY-MM-DD')
  } else if (format === 'ISO-MONTHLY') {
    return moment(date).format('YYYY-MM')
  } else if (format === 'ISO-YEARLY') {
    return moment(date).format('YYYY')
  } else {
    return date
  }
}

const generateDateSequence = (
  startDate: Date | Moment,
  endDate: Date | Moment,
  interval: string,
): tDateArray[] => {
  const dateArray: tDateArray[] = []
  let dateFormat = 'ISO-8601'
  let dateIncrement: 'days' | 'weeks' | 'months' | 'years' = 'days'

  if (!moment.isMoment(startDate)) {
    startDate = moment(startDate)
  }

  if (!moment.isMoment(endDate)) {
    endDate = moment(endDate)
  }

  if (interval === 'monthly') {
    dateFormat = 'ISO-MONTHLY'
    dateIncrement = 'months'
  } else if (interval === 'weekly') {
    if (startDate.isoWeekday() >= 1) {
      startDate = startDate.isoWeekday(1)
    }
    dateIncrement = 'weeks'
  } else if (interval === 'yearly') {
    dateFormat = 'ISO-YEARLY'
    dateIncrement = 'years'
  }

  while (startDate <= endDate) {
    dateArray.push({ date: formatDate(startDate, dateFormat), data: null })
    startDate = startDate.clone().add(1, dateIncrement)
  }
  return dateArray
}

export { formatSecondsAsHHMMSS, convertToSeconds, formatDate, generateDateSequence }
