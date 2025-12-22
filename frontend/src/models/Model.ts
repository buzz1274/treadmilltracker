import type { tLoadingState, ResponsePayload, RunData } from '@/types/types.d.ts'
import { StatusCodes } from 'http-status-codes'
import Cookies from 'js-cookie'

export class Model {
  private _host: string = 'https://' + window.location.hostname + '/'
  private _callId?: number
  protected _loadingState: tLoadingState

  public constructor(loadingState: tLoadingState) {
    this._loadingState = loadingState
  }

  protected hydrate<T extends Partial<RunData>>(data: T): this {
    for (const property in data) {
      if (this.isPropertyOf(property)) {
        this[property as unknown as keyof this] = data[property] as unknown as this[keyof this]
      }
    }
    return this
  }

  protected async fetch(endpointURL: string, request: RequestInit): Promise<ResponsePayload> {
    /*
    if (!this._loadingState.value) {
      this._loadingState.value = ref(this._loadingState)
    }
    */

    this._callId = this._loadingState.value.addCall()

    if (request['method'] !== 'GET') {
      request['headers'] = await this.setHeaders(request['headers'] ?? {})
    }

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
        this._loadingState.value.completeCall(this._callId)
        if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
          throw new Error(this.errorMessage(response))
        } else if (response.status === StatusCodes.FORBIDDEN) {
          this._loadingState.value.completeCall(this._callId)
          //redirect to homepage//
        }
        return response
      })
      .catch((error) => {
        this._loadingState.value.completeCall(this._callId)
        throw error
      })
  }

  protected delete(endpointURL: string): Promise<ResponsePayload> {
    return this.fetch(endpointURL, {
      method: 'DELETE',
    }).then((response: ResponsePayload) => {
      if (response.status !== StatusCodes.NO_CONTENT) {
        throw new Error(this.errorMessage(response))
      }
      return response
    })
  }

  protected isPropertyOf(property: string): boolean {
    return (
      Object.hasOwn(this, property as keyof this) &&
      typeof this[property as keyof this] !== 'function' &&
      property[0] !== '_'
    )
  }

  private async setHeaders(headers: HeadersInit): Promise<HeadersInit> {
    headers = {
      ...headers,
      'X-CSRFToken': await this.getCSRFToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    return headers
  }

  private errorMessage(response: ResponsePayload): string {
    if (typeof response.data === 'object' && response.data !== null && 'detail' in response.data) {
      return response.data['detail'] as string
    } else {
      return 'An unknown error occurred'
    }
  }

  private async getCSRFToken(): Promise<string> {
    let csrf_token: string | undefined = Cookies.get('csrftoken')

    if (!csrf_token) {
      csrf_token = await this.fetch('/api/auth/csrf', { method: 'GET' }).then(
        (response: ResponsePayload) => {
          return typeof response.data === 'object' && response.data !== null
            ? JSON.stringify(response.data)
            : response.data?.toString() || ''
        },
      )
    }
    return csrf_token ?? ''
  }

  private apiUrl(endpoint: string): string {
    return this._host + endpoint
  }
}
