import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

export const store = defineStore('store', () => {
  const loading: Ref<boolean> = ref(false)

  const user = ref({
    isAuthenticated: computed(() => {
      return true
    }),
    name: 'David',
  })

  return { user, loading }
})
