import { httpClient } from '@/api/HttpClient.ts'
import { UserModel } from '@/models/UserModel'
import { authStore } from '@/api/AuthStore.ts'
import { type IAccessTokenResponse } from '@/types/http.d.ts'

export class UserService {
  public async login(credentials: Array): Promise<UserModel> {
    const LoginResponse: IAccessTokenResponse =
      await httpClient.post<IAccessTokenResponse>('/api/auth/login', {
        credential: credentials.credential,
      })

    authStore.setToken(LoginResponse.token)

    const UserResponse = await httpClient.get<UserModel>('api/users/me')

    const user: UserModel = UserModel.fromAPI(UserResponse)
    user.IsAuthenticated = true

    return user
  }

  public async logout(): Promise<UserModel> {
    return new UserModel()
  }
}
