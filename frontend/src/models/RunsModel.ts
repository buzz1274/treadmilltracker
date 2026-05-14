import { ref, type Ref } from 'vue'

import { Model } from '@/models/Model'
import type { IResponsePayload, IRun, IRunData } from '@/types/types'
import { RunModel } from '@/models/RunModel'
import type { TInterval } from '@/types/date.constants'

export class RunsModel extends Model {
  public runs: Ref<Array<IRun>> = ref([])

  public getRuns(
    group_by: TInterval = 'days',
    start_date: string | null = null,
    end_date: string | null = null,
  ): Promise<IResponsePayload | void> {
    this.runs.value = []

    let url = `api/runs/?group_by=${group_by}`

    if (start_date) url += `&start_date=${start_date}`
    if (end_date) url += `&end_date=${end_date}`

    return this.fetch(url, { method: 'GET' }).then(
      (response: IResponsePayload | void) => {
        if (this.isValidResponse<IRunData>(response)) {
          for (const run of response.data.data) {
            this.runs.value.push(new RunModel(run))
          }
        }
      },
    )
  }
}
