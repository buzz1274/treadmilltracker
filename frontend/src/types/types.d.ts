import type { ComputedRef, Ref, UnwrapRef } from 'vue'
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

export type tUser = Ref<
  UnwrapRef<{
    name: string
    isAuthenticated: ComputedRef<boolean>
  }>,
  UnwrapRef<{
    name: string
    isAuthenticated: ComputedRef<boolean>
  }>,
  {
    name: string
    isAuthenticated: ComputedRef<boolean>
  }
>

export type tLoadingState = Ref<
  UnwrapRef<{
    completeCall: (index: number | undefined) => void
    isLoading: ComputedRef<boolean>
    apiCalls: boolean[]
    addCall: () => number
  }>,
  | UnwrapRef<{
      completeCall: (index: number | undefined) => void
      isLoading: ComputedRef<boolean>
      apiCalls: boolean[]
      addCall: () => number
    }>
  | {
      completeCall: (index: number | undefined) => void
      isLoading: ComputedRef<boolean>
      apiCalls: boolean[]
      addCall: () => number
    }
>
