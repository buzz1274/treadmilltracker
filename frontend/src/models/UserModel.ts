import type { IUserDataResponse } from '@/types/api_types'

export class UserModel {
  public isAuthenticated = false
  public name = ''
  public date: Date | null = null

  static fromAPI(data: IUserDataResponse): UserModel {
    const user: UserModel = new UserModel()

    user.name = data.full_name
    user.date = new Date(data.registered_date)

    return user
  }
}
