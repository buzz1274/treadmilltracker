import { Model } from '@/models/Model'
import type { ResponsePayload, Run } from '@/types/types.d.ts'
import { RunModel } from '@/models/RunModel'
import { ref, type Ref } from 'vue'

export class RunsModel extends Model {
  public runs: Ref<Array<Run>> = ref([])

  public getRuns(
    group_by: string = 'daily',
    start_date: string | null = null,
    end_date: string | null = null,
  ): Promise<ResponsePayload | void> {
    this.runs.value = []

    let url: string = 'api/runs/?group_by=' + group_by

    if (start_date) url += '&start_date=' + start_date
    if (end_date) url += '&end_date=' + end_date

    return this.fetch(url, { method: 'GET' }).then((response: ResponsePayload | void) => {
      if (
        response &&
        typeof response === 'object' &&
        response.data &&
        typeof response.data === 'object' &&
        !Array.isArray(response.data) &&
        'data' in response.data &&
        Array.isArray(response.data.data)
      ) {
        for (const run of response.data.data) {
          this.runs.value.push(new RunModel(run))
        }
      }
    })
  }
}
