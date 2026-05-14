import type { IRun } from '@/types/types'

export interface IPersonalBest {
  id: number
  title: string
  sort_order: number
  runs: IRun[]
}

export interface IPersonalBests {
  personalBests: IPersonalBest[]
}
