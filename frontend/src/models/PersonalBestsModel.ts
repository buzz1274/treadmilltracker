//import { ref, type Ref } from 'vue'

import { Model } from '@/models/Model'
//import type { IResponsePayload, IRun } from '@/types/types.d.ts'
//import { RunModel } from '@/models/RunModel'

export class PersonalBestsModel extends Model {
  //public runs: Ref<Array<IRun>> = ref([])
  /*
  public getPersonalBests(): Promise<IResponsePayload | void> {
    this.runs.value = []

    //const url = 'api/personal-bests/'

    /*
    return this.fetch(url, { method: 'GET' }).
      then((response: IResponsePayload | void) => {
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
  */
}
