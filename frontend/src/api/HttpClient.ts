import { ApiError } from '@/api/ApiError.ts'
import { authStore } from '@/api/AuthStore.ts'

class HttpClient {
  private readonly baseUrl: string
  private readonly getToken: () => string | null

  constructor(baseUrl: string, getToken: () => string | null) {
    this.baseUrl = baseUrl
    this.getToken = getToken
  }

  async get<T>(url: string): Promise<T> {
    const response: Response = await fetch(this.url(url), {
      method: 'GET',
      headers: this.setHeaders(),
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(url: string, body?: unknown): Promise<T> {
    const response: Response = await fetch(this.url(url), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: this.setHeaders(),
    })

    return this.handleResponse<T>(response)
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new ApiError(response.status, await response.text())
    }

    return (await response.json()) as T
  }

  private url(url: string): string {
    return `${this.baseUrl}${url}`
  }

  private setHeaders(): HeadersInit {
    const token = this.getToken()

    return {
      'Access-Control-Allow-Origin': '',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }
}

export const httpClient: HttpClient = new HttpClient(
  `https://${window.location.hostname}/`,
  () => authStore.getToken(),
)
