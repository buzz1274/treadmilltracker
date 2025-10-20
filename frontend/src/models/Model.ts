import type { Ref } from 'vue'

export class Model {
  protected _host: string = 'https://' + window.location.hostname + '/'
  protected _data_fetched: boolean = false
  protected _loading: Ref<boolean>

  public constructor(loading: Ref<boolean>) {
    this._loading = loading
  }

  protected fetch(url: string, request: RequestInit): Promise<Response | void> {
    const HTTP_FORBIDDEN: number = 403

    this._loading.value = true

    return fetch(this.apiUrl(url), request)
      .then((response) => {
        this._loading.value = false
        if (response.status === HTTP_FORBIDDEN) {
          throw new Error(String(HTTP_FORBIDDEN))
        } else {
          return response
        }
      })
      .catch((error) => {
        this._loading.value = false
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
