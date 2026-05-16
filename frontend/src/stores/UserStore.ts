import { defineStore } from 'pinia'
import { ref } from 'vue'

import { UserService } from '@/services/UserService.ts'
import { UserModel } from '@/models/UserModel.ts'

export const UserStore = defineStore('userStore', () => {
  const user = ref<UserModel | null>(new UserModel())
  const userService: UserService = new UserService()

  async function login(credentials: Array): UserModel {
    Object.assign(user.value, await userService.login(credentials))
  }

  async function logout(): UserModel {
    Object.assign(user.value, await userService.logout())
  }

  return { user, login, logout }
})
