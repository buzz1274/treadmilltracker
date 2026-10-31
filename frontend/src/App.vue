<script setup lang="ts">
import Toast from 'primevue/toast'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

import SiteHeader from '@/components/SiteHeader.vue'
import HomeView from '@/views/HomeView.vue'
import RunsView from '@/views/RunsView.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
import { store as UseStore } from '@/stores/store'
import { userStore as UseUserStore } from '@/stores/UserStore'

const store: ReturnType<typeof UseStore> = UseStore()
const userStore: ReturnType<typeof UseUserStore> = UseUserStore()
const { isLoading } = storeToRefs(store)
const { user, isRestoringSession } = storeToRefs(userStore)
const toast = useToast()

onMounted(() => {
  void userStore.restoreSession().catch(() => {
    toast.add({
      severity: 'warn',
      summary: 'Unable to restore your session',
      detail: 'Please sign in again or refresh to retry.',
      life: 5000,
    })
  })
})
</script>

<template>
  <BaseLoader :loading="isLoading || isRestoringSession" />
  <SiteHeader :user="user" />
  <main class="site-main">
    <Toast class="site-toast" />
    <RunsView v-if="user.isAuthenticated" :user="user" />
    <HomeView v-else-if="!isRestoringSession" :user="user" />
  </main>
  <SiteFooter />
</template>
