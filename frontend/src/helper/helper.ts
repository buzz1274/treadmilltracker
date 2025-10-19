import moment from 'moment/moment'

const formatSecondsAsHHMMSS = (seconds: number): string => {
  const formattedHours = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const formattedMinutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const formattedSeconds = String(seconds % 60).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

const formatDate = (date: string, format: string = 'daily'): string => {
  if (format === 'daily' || format === 'weekly') {
    return moment(date).format('MMM Do, YYYY')
  } else if (format === 'monthly') {
    return moment(date).format('MMM, YYYY')
  } else {
    return date
  }
}

export { formatSecondsAsHHMMSS, formatDate }
