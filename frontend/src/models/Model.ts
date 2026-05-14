import { StatusCodes } from 'http-status-codes'
import Cookies from 'js-cookie'

import type {
  IRunData,
  IResponsePayload,
  IDataArrayResponse,
} from '@/types/types.d.ts'
import { store as useStore } from '@/stores/store'

export class Model {
  private _host = `https://${window.location.hostname}/`
  protected _store: ReturnType<typeof useStore> = useStore()

  protected fetch = async (
    endpointURL: string,
    request: RequestInit,
  ): Promise<IResponsePayload> => {
    let updatedRequest: RequestInit = {
      ...request,
    }

    if (request['method'] !== 'GET') {
      updatedRequest = {
        ...request,
        headers: await this.setHeaders(request['headers'] ?? {}),
      }
    }

    const callId: number = this._store.addAPICall()

    return fetch(this.apiUrl(endpointURL), {
      ...updatedRequest,
      credentials: 'include',
    })
      .then((response) =>
        response
          .json()
          .then((data) => ({
            status: response.status,
            data,
          }))
          .catch((error) => ({
            status: response.status,
            data: error,
          })),
      )
      .then((response: IResponsePayload) => {
        this._store.completeAPICall(callId)

        if (
          response.status === StatusCodes.INTERNAL_SERVER_ERROR ||
          response.status === StatusCodes.UNPROCESSABLE_ENTITY
        ) {
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
    is_update = false,
  ): Promise<IResponsePayload> {
    return this.fetch(endpointURL, {
      method: is_update ? 'PATCH' : 'POST',
      body: JSON.stringify(data),
    }).then((response: IResponsePayload) => {
      if (
        response.status !== StatusCodes.OK &&
        response.status !== StatusCodes.CREATED
      ) {
        throw new Error(this.errorMessage(response))
      } else {
        return response
      }
    })
  }

  protected delete(endpointURL: string): Promise<IResponsePayload> {
    return this.fetch(endpointURL, {
      method: 'DELETE',
    }).then((response: IResponsePayload) => {
      if (response.status !== StatusCodes.NO_CONTENT) {
        throw new Error(this.errorMessage(response))
      } else {
        return response
      }
    })
  }

  protected hydrate<T extends Partial<IRunData>>(data: T): this {
    for (const property in data) {
      if (this.isPropertyOf(property)) {
        this[property as unknown as keyof this] = data[
          property
        ] as unknown as this[keyof this]
      }
    }
    return this
  }

  protected isPropertyOf(property: string): boolean {
    return (
      Object.hasOwn(this, property) &&
      typeof this[property as keyof this] !== 'function' &&
      property[0] !== '_'
    )
  }

  protected isValidResponse<T>(
    response: IResponsePayload | void,
  ): response is IDataArrayResponse<T> {
    return !!(
      response &&
      typeof response === 'object' &&
      response.data &&
      typeof response.data === 'object' &&
      !Array.isArray(response.data) &&
      'data' in response.data &&
      Array.isArray(response.data.data)
    )
  }

  private setHeaders = async (headers: HeadersInit): Promise<HeadersInit> => ({
    ...headers,
    'X-CSRF-Token': await this.getCSRFToken(),
    'Access-Control-Allow-Origin': '',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  })

  private errorMessage(response: IResponsePayload): string {
    if (
      typeof response.data === 'object' &&
      response.data !== null &&
      'detail' in response.data
    ) {
      return response.data['detail'] as string
    } else {
      return 'An unknown error occurred'
    }
  }

  protected async getCSRFToken(): Promise<string> {
    let csrfToken: string | undefined = Cookies.get('session')

    if (!csrfToken) {
      csrfToken = await this.fetch('/api/auth/csrf', { method: 'GET' }).then(
        (response: IResponsePayload) =>
          typeof response.data === 'object' && response.data !== null
            ? JSON.stringify(response.data)
            : response.data?.toString() || '',
      )
    }
    return csrfToken ?? ''
  }

  private apiUrl(endpoint: string): string {
    return this._host + endpoint
  }
}
