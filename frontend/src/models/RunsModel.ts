import { Model } from '@/models/Model'
import type { ResponsePayload, Run } from '@/types/types.d.ts'
import { RunModel } from '@/models/RunModel'
import { ref, type Ref } from 'vue'

export class RunsModel extends Model {
  public runs: Ref<Array<Run>> = ref([])

  public getRuns(group_by: string = 'daily'): Promise<ResponsePayload | void> {
    this.runs.value = []

    return this.fetch('api/runs/?group_by=' + group_by, { method: 'GET' }).then(
      (response: ResponsePayload | void) => {
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
      },
    )
  }
}
