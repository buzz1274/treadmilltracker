import { Model } from '@/models/Model.ts'

export class UserModel extends Model {
  public constructor(user: UserData | null = null) {
    super()

    this.getCSRFToken()

    if (user) {
      this.hydrate(run)
    }
  }
}
