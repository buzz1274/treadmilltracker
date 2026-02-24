import { type Reactive, reactive, type Ref, ref, type UnwrapRef } from 'vue'
import { defineStore } from 'pinia'
import { useLoadingState } from '@/composables/LoadingState.ts'
import type { tUser } from '@/types/types.d.ts'

export const store = defineStore('store', () => {
  const resync_runs: Ref<number> = ref(0)
  const { apiCalls, addAPICall, completeAPICall, isLoading } = useLoadingState()

  const user: Reactive<UnwrapRef<tUser>> = reactive<tUser>({
    authenticated: false,
    name: 'David',
    registrationDate: '2025-01-01',
    get isAuthenticated(): boolean {
      return this.authenticated
    },
    login(): void {
      this.authenticated = true
    },
    logout(): void {
      this.authenticated = false
    },
  })

  return { user, resync_runs, apiCalls, addAPICall, completeAPICall, isLoading }
})
