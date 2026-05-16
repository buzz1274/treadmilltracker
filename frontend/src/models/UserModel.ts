export class UserModel {
  public IsAuthenticated = false
  public name = ''
  public date: Date | null = null

  static fromAPI(data: any): UserModel {
    const user: UserModel = new UserModel()

    user.name = data.full_name
    user.date = new Date(data.registered_date)

    return user
  }
}
