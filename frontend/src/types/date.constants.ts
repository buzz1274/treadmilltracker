import type { Moment } from 'moment/moment'

export interface IIntervalConfig {
  format: string
  label: string
  increment: TInterval | null
  isChoice: boolean
  adjustStart?: (date: Moment) => Moment
}

export const dateConfig = {
  days: {
    format: 'MMM Do, YYYY',
    increment: 'days',
    label: 'Daily',
    displayFormat: 'MMM Do, YYYY',
    isChoice: true,
  },
  weeks: {
    format: 'MMM Do, YYYY',
    increment: 'weeks',
    label: 'Weekly',
    adjustStart: (date: Moment) => date.isoWeekday(1),
    isChoice: true,
  },
  months: {
    format: 'MMM, YYYY',
    increment: 'months',
    label: 'Monthly',
    isChoice: true,
  },
  years: {
    format: 'YYYY',
    increment: 'years',
    label: 'Yearly',
    isChoice: true,
  },
  'ISO-8601': {
    format: 'YYYY-MM-DD',
    increment: null,
    label: 'ISO-8601',
    isChoice: false,
  },
  'ISO-MONTHLY': {
    format: 'YYYY-MM',
    increment: null,
    label: 'ISO-MONTHLY',
    isChoice: false,
  },
} as const

export type TInterval = keyof typeof dateConfig
export const groupByChoices: { label: string; value: TInterval }[] = (
  Object.keys(dateConfig) as TInterval[]
)
  .filter((key: TInterval) => dateConfig[key].isChoice)
  .map((key) => ({
    value: key,
    label: dateConfig[key].label,
  }))
