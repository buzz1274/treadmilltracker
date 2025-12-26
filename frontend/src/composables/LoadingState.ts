import { computed, ref } from 'vue'
import type { tLoadingState } from '@/types/types.d.ts'

export function useLoadingState(): tLoadingState {
  const apiCalls = ref<boolean[]>([])

  const addAPICall = (): number => {
    apiCalls.value.push(true)
    return apiCalls.value.length - 1
  }

  const completeAPICall = (index: number | undefined): void => {
    if (index !== undefined && index >= 0 && index < apiCalls.value.length) {
      apiCalls.value[index] = false
    }
  }

  const isLoading = computed((): boolean => {
    return apiCalls.value.some((value) => value === true)
  })

  return { apiCalls, addAPICall, completeAPICall, isLoading }
}
