import { Model } from '@/models/Model'
import type { Run } from '@/types/types.d.ts'
import { ref, type Ref } from 'vue'

export class RunsModel extends Model {
  public runs: Ref<Array<Run>> = ref([])

  public constructor() {
    super()
    this.getRuns()
  }

  public getRuns(group_by: string = 'daily'): void {
    this.fetch('api/runs/?group_by=' + group_by, { method: 'GET' })
      .then((response) => {
        return response ? response.json() : null
      })
      .then((data) => {
        this.hydrate({ runs: data['data'] })
      })
      .catch((error) => {
        //
        console.log(error)
      })
  }
}
