export class Model {
  protected _host: string = 'https://' + window.location.hostname + '/'
  protected _data_fetched: boolean = false

  protected fetch(url: string, request: RequestInit): Promise<Response | void> {
    const HTTP_FORBIDDEN = 403

    return fetch(this.apiUrl(url), request)
      .then((response) => {
        if (response.status === HTTP_FORBIDDEN) {
          throw new Error(String(HTTP_FORBIDDEN))
        } else {
          return response
        }
      })
      .catch((error) => {
        console.error(error)
        throw new Error()
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
