import type { Ref } from 'vue'
import { type loadingState } from '@/types/types.d.ts'

export class Model {
  protected _host: string = 'https://' + window.location.hostname + '/'
  protected _data_fetched: boolean = false
  protected _loading: Ref<loadingState>
  protected _call_id: number

  public constructor(loading: Ref<loadingState>) {
    this._loading = loading
  }

  protected fetch(url: string, request: RequestInit): Promise<Response | void> {
    const HTTP_FORBIDDEN: number = 403

    this._call_id = this._loading.value.addCall()

    return fetch(this.apiUrl(url), request)
      .then((response) => {
        this._loading.value.completeCall(this._call_id)

        if (response.status === HTTP_FORBIDDEN) {
          throw new Error(String(HTTP_FORBIDDEN))
        } else {
          return response
        }
      })
      .catch((error) => {
        this._loading.value.completeCall(this._call_id)
        throw new Error(error)
      })
  }

  protected hydrate(data: object): void {
    for (const property in data) {
      if (this.isPropertyOf(property)) {
        this[property].value = data[property]
      }
    }
    this._data_fetched = true
  }

  protected isPropertyOf(property): boolean {
    return (
      Object.hasOwn(this, property) && typeof this[property] !== 'function' && property[0] !== '_'
    )
  }

  private apiUrl(endpoint: string): string {
    return this._host + endpoint
  }
}
