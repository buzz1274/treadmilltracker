import { Model } from '@/models/Model.ts'
import type { LoadingState, ResponsePayload, Run, RunData } from '@/types/types'
import { formatSecondsAsHHMMSS } from '@/helper/helper.ts'

export class RunModel extends Model implements Run {
  public id: number | null
  public run_date: string
  public distance_m: number
  public duration_s: number
  public calories: number
  public vo2max: number
  public pace: number

  public constructor(loading: LoadingState, run: RunData | null = null) {
    super(loading)

    if (run) {
      this.hydrate(run)
    }
  }

  public distanceKm(): string {
    return (this.distance_m / 1000).toFixed(2)
  }

  public secondsToHHMMSS(): string {
    return formatSecondsAsHHMMSS(this.duration_s)
  }

  public save(): void {
    console.log('save')
  }

  public override delete(): Promise<ResponsePayload | void> {
    return super.delete('api/runs/' + this.id)
  }
}
