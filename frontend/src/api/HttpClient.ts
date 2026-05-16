import { type IApiResponse } from '@/types/http.d.ts'
import { ApiError } from '@/api/ApiError.ts'
import { authStore } from '@/api/AuthStore.ts'

class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly getToken: string,
  ) {
    this.baseUrl = baseUrl
    this.getToken = getToken
  }

  async get<T>(url: string): Promise<IApiResponse<T>> {
    const response: Response = await fetch(this.url(url), {
      method: 'GET',
      headers: this.setHeaders(),
    })

    return this.handleResponse<IApiResponse<T>>(response)
  }

  async post<T>(url: string, body?: unknown): Promise<T> {
    const response: Response = await fetch(this.url(url), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: this.setHeaders(),
    })

    return this.handleResponse<IApiResponse<T>>(response)
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data: T = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, await response.text())
    }

    return data
  }

  private url(url: string): string {
    return `${this.baseUrl}${url}`
  }

  private setHeaders(): HeadersInit {
    return {
      'Access-Control-Allow-Origin': '',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(this.getToken()
        ? { Authorization: `Bearer ${this.getToken()}` }
        : {}
      ),
    }
  }
}

export const httpClient: HttpClient = new HttpClient(
  `https://${window.location.hostname}/`,
  () => authStore.getToken(),
)
