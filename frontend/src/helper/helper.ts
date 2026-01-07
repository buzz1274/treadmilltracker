import moment, { Moment } from 'moment/moment'

const formatSecondsAsHHMMSS = (seconds: number): string => {
  const formattedHours = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const formattedMinutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const formattedSeconds = String(seconds % 60).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

const convertToSeconds = (time: string): number => {
  if (!time) return 0

  const [hours, minutes, seconds] = time.split(':')

  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
}

const formatDate = (date: string, format: string = 'daily'): string => {
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

const generateDateSequence = (startDate: Date, endDate: Date, interval: string): Date[] => {
  const dateArray = []
  let dateFormat: string = 'ISO-8601'
  let dateIncrement: string = 'days'
  let currentDate: Moment = moment(startDate)

  endDate = moment(endDate)

  if (interval === 'monthly') {
    dateFormat = 'ISO-MONTHLY'
    dateIncrement = 'months'
  } else if (interval === 'weekly') {
    if (currentDate.isoWeekday() >= 1) {
      currentDate = currentDate.isoWeekday(1)
    }
    dateIncrement = 'weeks'
  } else if (interval === 'yearly') {
    dateFormat = 'ISO-YEARLY'
    dateIncrement = 'years'
  }

  while (currentDate <= endDate) {
    dateArray.push({ date: formatDate(currentDate, dateFormat), data: 0 })
    currentDate = currentDate.clone().add(1, dateIncrement)
  }
  return dateArray
}

export { formatSecondsAsHHMMSS, convertToSeconds, formatDate, generateDateSequence }
