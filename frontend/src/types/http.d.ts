export interface IApiResponse<T> {
  status: number
  data: T
}

export interface IAccessTokenResponse {
  access_token: string
}
