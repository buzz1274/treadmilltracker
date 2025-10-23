import type { ComputedRef, Ref, UnwrapRef } from 'vue'

export interface Run {
  id: number | null
  run_date: string
  distance_m: number
  duration_s: number
  calories: number
  vo2max: number
  pace: number
  save(): void
  delete(): Promise<Response | void>
  distanceKm(): string
  secondsToHHMMSS(): string
}

export type PersonalBests = Record<'title' | 'date' | 'time', string>

export type filterHistoryModelType = {
  viewChoices: string
  groupByChoices: string
}

export type Response = {
  status: number
  data: any
}

export type LoadingState = Ref<
  UnwrapRef<{
    completeCall: (index: number) => void
    isLoading: ComputedRef<boolean>
    apiCalls: any[]
    addCall: () => number
  }>,
  | UnwrapRef<{
      completeCall: (index: number) => void
      isLoading: ComputedRef<boolean>
      apiCalls: any[]
      addCall: () => number
    }>
  | {
      completeCall: (index: number) => void
      isLoading: ComputedRef<boolean>
      apiCalls: any[]
      addCall: () => number
    }
>
