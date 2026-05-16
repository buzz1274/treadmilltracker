export class UserModel {
  public isAuthenticated: boolean = false
  public name: string = ''
  public date: Date | null = null

  static fromAPI(data: object): UserModel {
    const user: UserModel = new UserModel()

    user.name = data.full_name
    user.date = new Date(data.registered_date)

    return user
  }
}
