import type { ResponsePayload, RunData } from '@/types/types.d.ts'
import { StatusCodes } from 'http-status-codes'
import Cookies from 'js-cookie'
import { store as useStore } from '@/stores/store'

export class Model {
  private _host: string = 'https://' + window.location.hostname + '/'
  protected _store: ReturnType<typeof useStore> = useStore()

  public constructor() {}

  protected hydrate<T extends Partial<RunData>>(data: T): this {
    for (const property in data) {
      if (this.isPropertyOf(property)) {
        this[property as unknown as keyof this] = data[property] as unknown as this[keyof this]
      }
    }
    return this
  }

  protected fetch = async (endpointURL: string, request: RequestInit): Promise<ResponsePayload> => {
    if (request['method'] !== 'GET') {
      request['headers'] = await this.setHeaders(request['headers'] ?? {})
    }

    const callId: number = this._store.addAPICall()

    return fetch(this.apiUrl(endpointURL), { ...request, credentials: 'include' })
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
        this._store.completeAPICall(callId)

        if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
          throw new Error(this.errorMessage(response))
        } else if (response.status === StatusCodes.FORBIDDEN) {
          this._store.user.logout()
          throw new Error('403: Forbidden')
        }
        return response
      })
      .catch((error) => {
        this._store.completeAPICall(callId)
        throw error
      })
  }

  protected save(
    endpointURL: string,
    data: object,
    is_update: boolean = false,
  ): Promise<ResponsePayload> {
    return this.fetch(endpointURL, {
      method: is_update ? 'PATCH' : 'POST',
      body: JSON.stringify(data),
    }).then((response: ResponsePayload) => {
      if (response.status !== StatusCodes.OK && response.status !== StatusCodes.CREATED) {
        throw new Error(this.errorMessage(response))
      } else {
        return response
      }
    })
  }

  protected delete(endpointURL: string): Promise<ResponsePayload> {
    return this.fetch(endpointURL, {
      method: 'DELETE',
    }).then((response: ResponsePayload) => {
      if (response.status !== StatusCodes.NO_CONTENT) {
        throw new Error(this.errorMessage(response))
      } else {
        return response
      }
    })
  }

  protected isPropertyOf(property: string): boolean {
    return (
      Object.hasOwn(this, property as keyof this) &&
      typeof this[property as keyof this] !== 'function' &&
      property[0] !== '_'
    )
  }

  private setHeaders = async (headers: HeadersInit): Promise<HeadersInit> => {
    headers = {
      ...headers,
      'X-CSRF-Token': await this.getCSRFToken(),
      'Access-Control-Allow-Origin': '',
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

  protected async getCSRFToken(): Promise<string> {
    let csrf_token: string | undefined = Cookies.get('session')

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
