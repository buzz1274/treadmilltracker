import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const store = defineStore('store', () => {
  const isAuthenticated = ref(false)
  const user = ref({
    isAuthenticated: computed(() => {
      return true
    }),
    name: 'David',
  })

  return { user }
})
