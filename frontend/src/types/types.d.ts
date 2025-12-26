
import type { ComputedRef, Ref } from 'vue'
import { StatusCodes } from 'http-status-codes'

export interface RunData {
  id: number | null
  run_date: string
  distance_m: number
  duration_s: number
  calories: number
  vo2max: number
  pace: number
}

export interface Run extends RunData {
  save(): void
  delete(): Promise<ResponsePayload>
  distanceKm(): string
  secondsToHHMMSS(): string
}

export type PersonalBests = Record<'title' | 'date' | 'time', string>

export type filterHistoryModelType = {
  viewChoices: string
  groupByChoices: string
}

export type ResponsePayload = {
  status: StatusCodes
  data: object | string | Array<object>
}

export type tUser = {
  name: string
  authenticated: boolean
  login(): void
  logout(): void
  isAuthenticated: boolean
}

export type tLoadingState = {
  apiCalls: Ref<boolean[]>
  addAPICall: () => number
  completeAPICall: (index: number | undefined) => void
  isLoading: ComputedRef<boolean>
}
