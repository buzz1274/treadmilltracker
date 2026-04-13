import { Model } from '@/models/Model'
import type { ResponsePayload, Run } from '@/types/types.d.ts'
import { RunModel } from '@/models/RunModel'
import { ref, type Ref } from 'vue'

export class PersonalBestsModel extends Model {
  public runs: Ref<Array<Run>> = ref([])

  public getPersonalBests(): Promise<ResponsePayload | void> {
    this.runs.value = []

    const url: string = 'api/personal-bests/'

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
