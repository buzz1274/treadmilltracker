import { type LoadingState, type ResponsePayload } from '@/types/types.d.ts'

export class Model {
  protected _host: string = 'https://' + window.location.hostname + '/'
  protected _loading: LoadingState
  protected _callId: number

  public constructor(loading: LoadingState) {
    this._loading = loading

    if (this._loading.value) {
      this._loading = this._loading.value
    }
  }

  public hydrate(data: object): this {
    for (const property in data) {
      if (this.isPropertyOf(property)) {
        this[property] = data[property]
      }
    }
    return this
  }

  protected fetch(url: string, request: RequestInit): Promise<ResponsePayload | void> {
    const HTTP_FORBIDDEN: number = 403

    this._callId = this._loading.addCall()

    return fetch(this.apiUrl(url), request)
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
      .then((response) => {
        this._loading.completeCall(this._callId)
        if (response.status === 500) {
          throw new Error(response.data['detail'])
        } else if (response.status === HTTP_FORBIDDEN) {
          console.log('forbidden')
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
