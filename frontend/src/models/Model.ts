import { type LoadingState, type ResponsePayload } from '@/types/types.d.ts'
import { StatusCodes } from 'http-status-codes'
import { ref } from 'vue'

export class Model {
  private _host: string = 'https://' + window.location.hostname + '/'
  private _callId: number
  protected _loading: LoadingState

  public constructor(loading: LoadingState) {
    this._loading = loading
  }

  protected hydrate(data: object): this {
    for (const property in data) {
      if (this.isPropertyOf(property)) {
        this[property] = data[property]
      }
    }
    return this
  }

  protected fetch(endpointURL: string, request: RequestInit): Promise<ResponsePayload | void> {
    if (!this._loading.value) {
      this._loading.value = ref(this._loading)
    }

    this._callId = this._loading.value.addCall()

    return fetch(this.apiUrl(endpointURL), request)
      .then((response) => {
        return response
          .json()
          .then((data) => ({
            status: response.status,
            data: data,
          }))
          .catch((error) => {
            return {
              status: response.status,
              data: error,
            }
          })
      })
      .then((response: ResponsePayload) => {
        this._loading.value.completeCall(this._callId)
        if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
          throw new Error(response.data['detail'])
        } else if (response.status === StatusCodes.FORBIDDEN) {
          //redirect to homepage//
          console.log('forbidden')
        }
        return response
      })
  }

  protected delete(endpointURL: string): Promise<ResponsePayload | void> {
    return this.fetch(endpointURL, {
      method: 'DELETE',
    }).then((response: ResponsePayload) => {
      if (response.status !== StatusCodes.NO_CONTENT) {
        throw new Error(response.data['detail'])
      }
      return response
    })
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
