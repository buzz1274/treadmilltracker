import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { type LoadingState } from '@/types/types.d.ts'
import { LoadingState } from '@/stores/LoadingState.ts'

export const store = defineStore('store', () => {
  const loading: LoadingState = ref(LoadingState)

  const user = ref({
    isAuthenticated: computed(() => {
      return true
    }),
    name: 'David',
  })

  return { user, loading }
})
