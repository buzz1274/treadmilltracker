import { defineStore } from 'pinia'
import { ref } from 'vue'

import { authStore } from '@/api/AuthStore.ts'
import { ApiError } from '@/api/ApiError.ts'
import { UserService } from '@/services/UserService.ts'
import { UserModel } from '@/models/UserModel.ts'

export const userStore = defineStore('userStore', () => {
  const user = ref<UserModel>(new UserModel())
  const isRestoringSession = ref(true)
  const userService: UserService = new UserService()

  async function login(credentials: { credential: string }): Promise<void> {
    Object.assign(user.value, await userService.login(credentials))
  }

  function logout(): void {
    Object.assign(user.value, userService.logout())
  }

  async function restoreSession(): Promise<void> {
    isRestoringSession.value = true
    const token = authStore.getToken()
    try {
      if (!token) return
      const restoredUser = await userService.getCurrentUser()
      if (authStore.getToken() === token)
        Object.assign(user.value, restoredUser)
    } catch (error) {
      if (
        authStore.getToken() === token &&
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        logout()
      }
      throw error
    } finally {
      isRestoringSession.value = false
    }
  }

  return { user, isRestoringSession, login, logout, restoreSession }
})
