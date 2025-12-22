import { computed, ref } from 'vue'
import type { tLoadingState } from '@/types/types.d.ts'

export const LoadingState: tLoadingState = ref({
  apiCalls: [],

  addCall: (): number => {
    LoadingState.value.apiCalls.push(true)

    return LoadingState.value.apiCalls.length - 1
  },

  completeCall: (index: number | undefined): void => {
    if (index !== undefined) {
      LoadingState.value.apiCalls[index] = false
    }
  },

  isLoading: computed((): boolean => {
    if (LoadingState.value.apiCalls.length === 0) {
      return false
    }

    if (LoadingState.value.apiCalls.every((value) => !value)) {
      LoadingState.value.apiCalls = []
      return false
    }

    return true
  }),
})
