export interface IApiResponse<T> {
  status: number
  data: T
}

export interface IAccessTokenResponse {
  token: string
}

export interface IUserDataResponse {
  full_name: string
  registered_date: string
}
