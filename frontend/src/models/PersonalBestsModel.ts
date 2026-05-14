import { Model } from '@/models/Model'
import type { IResponsePayload } from '@/types/types'
import type { IPersonalBests, IPersonalBest } from '@/types/personal_best_types'
import { PersonalBestModel } from '@/models/PersonalBestModel'

export class PersonalBestsModel extends Model implements IPersonalBests {
  public personalBests: Array<IPersonalBest> = []

  public getPersonalBests(): Promise<IResponsePayload | void> {
    this.personalBests = []

    const url = 'api/runs/personal_bests/'

    return this.fetch(url, { method: 'GET' }).then(
      (response: IResponsePayload | void) => {
        if (this.isValidResponse<IPersonalBest>(response)) {
          for (const personalBest of response.data.data) {
            this.personalBests.push(new PersonalBestModel(personalBest))
          }
        }
      },
    )
  }
}
