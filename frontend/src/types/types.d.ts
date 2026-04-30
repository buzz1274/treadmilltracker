import type { ComputedRef, Ref } from 'vue'
import type { StatusCodes } from 'http-status-codes'
import type { Moment } from 'moment'

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

export interface filterHistoryModelType {
  viewChoices: string
  groupByChoices: string
}

export interface ResponsePayload {
  status: StatusCodes
  data: object | string | Array<object>
}

export interface tUser {
  name: string
  authenticated: boolean
  registrationDate: string
  isAuthenticated: boolean
  login(): void
  logout(): void
}

export interface tLoadingState {
  apiCalls: Ref<boolean[]>
  addAPICall: () => number
  completeAPICall: (index: number | undefined) => void
  isLoading: ComputedRef<boolean>
}

export interface tDateArray {
  date: string | Moment
  data: number | null
}
