export interface Run {
  id: number | null
  run_date: string
  distance_m: number
  duration_s: number
  calories: number
  vo2max: number
  pace: number
  save(): void
  delete(): boolean
  distanceKm(): string
  secondsToHHMMSS(): string
}

export type PersonalBests = Record<'title' | 'date' | 'time', string>

export type filterHistoryModelType = {
  viewChoices: string
  groupByChoices: string
}

export interface loadingState {
  apiCalls: boolean[]
  addCall(): number
  completeCall(index: number): void
  isLoading: boolean
}
