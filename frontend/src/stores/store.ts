import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { type loadingState } from '@/types/types.d.ts'

export const store = defineStore('store', () => {
  const loading: Ref<loadingState> = ref({
    apiCalls: [],

    addCall: (): number => {
      loading.value.apiCalls.push(true)

      return loading.value.apiCalls.length - 1
    },

    completeCall: (index: number): void => {
      loading.value.apiCalls[index] = false
    },

    isLoading: computed((): boolean => {
      if (loading.value.apiCalls.length === 0) {
        return false
      }

      if (loading.value.apiCalls.every((value) => !value)) {
        loading.value.apiCalls = []
        return false
      }

      return true
    }),
  })

  const user = ref({
    isAuthenticated: computed(() => {
      return true
    }),
    name: 'David',
  })

  return { user, loading }
})
