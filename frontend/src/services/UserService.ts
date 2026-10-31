import { httpClient } from '@/api/HttpClient.ts'
import { UserModel } from '@/models/UserModel'
import { authStore } from '@/api/AuthStore.ts'
import type {
  IAccessTokenResponse,
  IUserDataResponse,
} from '@/types/api_types.d.ts'

export class UserService {
  public async login(credentials: { credential: string }): Promise<UserModel> {
    const loginResponse: IAccessTokenResponse =
      await httpClient.post<IAccessTokenResponse>('/api/auth/login', {
        credential: credentials.credential,
      })

    authStore.setToken(loginResponse.token)

    try {
      return await this.getCurrentUser()
    } catch (error) {
      authStore.setToken(null)
      throw error
    }
  }

  public async getCurrentUser(): Promise<UserModel> {
    const userResponse = await httpClient.get<IUserDataResponse>('api/users/me')
    const user = UserModel.fromAPI(userResponse)
    user.isAuthenticated = true
    return user
  }

  public logout(): UserModel {
    authStore.setToken(null)
    return new UserModel()
  }
}
