import { Model } from '@/models/Model.ts'
import type { ResponsePayload, Run, RunData } from '@/types/types'
import { formatSecondsAsHHMMSS, formatDate } from '@/helper/helper.ts'

export class RunModel extends Model implements Run {
  public id!: number | null
  public run_date!: string
  public distance_m!: number
  public duration_s!: number
  public calories!: number
  public vo2max!: number
  public pace!: number

  public constructor(run: RunData | null = null) {
    super()

    if (run) {
      this.hydrate(run)
    }
  }

  public distanceKm(): string {
    return (this.distance_m / 1000).toFixed(2)
  }

  public secondsToHHMMSS(): string {
    return this.duration_s ? formatSecondsAsHHMMSS(this.duration_s) : ''
  }

  public save(): Promise<ResponsePayload> {
    return super.save(
      'api/runs/',
      {
        id: this.id,
        run_date: formatDate(this.run_date, 'ISO-8601'),
        distance_m: this.distance_m,
        duration_s: this.duration_s,
        calories: this.calories,
        vo2max: this.vo2max,
      },
      !!this.id,
    )
  }

  public override delete(): Promise<ResponsePayload> {
    return super.delete('api/runs/' + this.id)
  }
}
