import moment, { type Moment } from 'moment/moment'

import type { IIntervalConfig, TInterval } from '@/types/date.constants'
import { dateConfig } from '@/types/date.constants'
import type { IDateArray } from '@/types/types'

const formatSecondsAsHHMMSS: (seconds: number) => string = (
  seconds: number,
): string => {
  const formattedHours: string = String(Math.floor(seconds / 3600)).padStart(
    2,
    '0',
  )
  const formattedMinutes: string = String(
    Math.floor((seconds % 3600) / 60),
  ).padStart(2, '0')
  const formattedSeconds: string = String(seconds % 60).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

const convertToSeconds: (time: string) => number = (time: string): number => {
  if (!time || !/^\d{2}:\d{2}:\d{2}$/.test(time)) {
    return 0
  }

  const [hours, minutes, seconds] = time.split(':') as [string, string, string]

  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
}

const formatDate = (
  date: Moment | string,
  interval: TInterval = 'days',
): string => moment(date).format(dateConfig[interval].format)

const generateDateSequence = (
  startDate: Date | Moment,
  endDate: Date | Moment,
  interval: TInterval,
): IDateArray[] => {
  const dateArray: IDateArray[] = []
  const config: IIntervalConfig = dateConfig[interval]

  if (config.increment === null) {
    throw new Error('Invalid interval configuration')
  }

  const start: Moment = moment.isMoment(startDate)
    ? startDate.clone()
    : moment(startDate)

  const end: Moment = moment.isMoment(endDate)
    ? endDate.clone()
    : moment(endDate)

  let current: Moment = config.adjustStart
    ? config.adjustStart(start.clone())
    : start.clone()

  while (current <= end) {
    dateArray.push({ date: formatDate(current, interval), data: null })
    current = current
      .clone()
      .add(1, config.increment as moment.unitOfTime.DurationConstructor)
  }

  return dateArray
}

export {
  formatSecondsAsHHMMSS,
  convertToSeconds,
  formatDate,
  generateDateSequence,
}
