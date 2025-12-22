import { computed, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import type { tLoadingState, tUser } from '@/types/types.d.ts'
import { LoadingState } from '@/stores/LoadingState.ts'

export const store = defineStore('store', () => {
  const loadingState: tLoadingState = ref(LoadingState)
  const resync_runs: Ref<number> = ref(0)

  const user: tUser = ref({
    isAuthenticated: computed(() => {
      return true
    }),
    name: 'David',
  })

  return { user, loadingState, resync_runs }
})
