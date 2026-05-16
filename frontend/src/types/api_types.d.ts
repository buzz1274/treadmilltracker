export interface IApiResponse<T> {
  status: number
  data: T
}

export interface IAccessTokenResponse {
  token: string
}
