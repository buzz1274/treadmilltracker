import { computed, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { LoadingState } from '@/stores/LoadingState.ts'

export const store = defineStore('store', () => {
  const loading: Ref<LoadingState> = ref(LoadingState)
  const resync_runs: Ref<number> = ref(0)

  const user = ref({
    isAuthenticated: computed(() => {
      return true
    }),
    name: 'David',
  })

  return { user, loading, resync_runs }
})
