import { Model } from '@/models/Model'
import type { IPersonalBest } from '@/types/personal_best_types'
import type { IRun } from '@/types/types'
import { RunModel } from '@/models/RunModel'

export class PersonalBestModel extends Model implements IPersonalBest {
  public id = 0
  public title = ''
  public sort_order = 0
  public runs: Array<IRun> = []

  public constructor(personalBest: IPersonalBest) {
    super()

    this.hydrate(personalBest)
    this.runs = []

    for (const run of personalBest.runs) {
      this.runs.push(new RunModel(run))
    }
  }
}
