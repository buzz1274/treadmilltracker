import { defineStore } from 'pinia'
import { ref } from 'vue'

import { UserService } from '@/services/UserService.ts'
import { UserModel } from '@/models/UserModel.ts'

export const userStore = defineStore('userStore', () => {
  const user = ref<UserModel | null>(new UserModel())
  const userService: UserService = new UserService()

  async function login(credentials: { credential: string }): Promise<void> {
    Object.assign(user.value, await userService.login(credentials))
  }

  async function logout(): Promise<void> {
    Object.assign(user.value, await userService.logout())
  }

  return { user, login, logout }
})
