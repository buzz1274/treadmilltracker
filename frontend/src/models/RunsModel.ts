import { Model } from '@/models/Model'
import type { Run } from '@/types/types.d.ts'
import { RunModel } from '@/models/RunModel'
import { ref, type Ref } from 'vue'

export class RunsModel extends Model {
  public runs: Ref<Array<Run>> = ref([])

  public getRuns(group_by: string = 'daily'): void {
    this.runs.value = []

    this.fetch('api/runs/?group_by=' + group_by, { method: 'GET' }).then((response) => {
      if (response && response.data && 'data' in response.data) {
        for (const run of response.data['data']) {
          this.runs.value.push(new RunModel(this._loading).hydrate(run))
        }
      }
    })
  }
}
