import type { ComputedRef, Ref } from 'vue'
import type { StatusCodes } from 'http-status-codes'
import type { Moment } from 'moment'

import type { TInterval } from '@/types/date.constants.ts'

export interface IRunData {
  id: number | null
  run_date: string
  distance_m: number
  duration_s: number
  calories: number
  vo2max: number
  pace: number
}

export interface IRun extends IRunData {
  save(): Promise<ResponsePayload>
  delete(): Promise<ResponsePayload>
  distanceKm(): string
  secondsToHHMMSS(): string
}

export type TPersonalBests = Record<'title' | 'date' | 'time', string>

export interface IFilterHistoryModelType {
  viewChoices: string
  groupByChoices: TInterval
}

export interface IResponsePayload {
  status: StatusCodes
  data: object | string | Array<object>
}

export interface IUser {
  name: string
  authenticated: boolean
  registrationDate: string
  isAuthenticated: boolean
  login(): void
  logout(): void
}

export interface ILoadingState {
  apiCalls: Ref<boolean[]>
  addAPICall: () => number
  completeAPICall: (index: number | undefined) => void
  isLoading: ComputedRef<boolean>
}

export interface IDateArray {
  date: string | Moment
  data: number | null
}
