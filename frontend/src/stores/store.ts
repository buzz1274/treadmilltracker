import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'

import { useLoadingState } from '@/composables/LoadingState.ts'

export const store = defineStore('store', () => {
  const resyncRuns: Ref<number> = ref(0)
  const { apiCalls, addAPICall, completeAPICall, isLoading } = useLoadingState()

  return { resyncRuns, apiCalls, addAPICall, completeAPICall, isLoading }
})
