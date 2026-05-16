import type { IUserDataResponse } from '@/types/api_types'
import type { IUser } from '@/types/types'

export class UserModel implements IUser {
  public isAuthenticated = false
  public name = ''
  public date: Date = new Date()

  static fromAPI(data: IUserDataResponse): UserModel {
    const user: UserModel = new UserModel()

    user.name = data.full_name
    user.date = new Date(data.registered_date)

    return user
  }
}
