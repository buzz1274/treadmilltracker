import moment from 'moment/moment'

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
  } else {
    return date
  }
}

export { formatSecondsAsHHMMSS, convertToSeconds, formatDate }
