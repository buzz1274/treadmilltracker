export type Run = {
  run_date: string
  distance_m: number
  duration_s: number
  calories: number
  vo2max: number
}

export type PersonalBests = Record<'title' | 'date' | 'time', string>
