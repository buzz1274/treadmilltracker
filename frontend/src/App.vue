<script setup lang="ts">
import Toast from 'primevue/toast'
import { storeToRefs } from 'pinia'

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
const { user } = storeToRefs(userStore)
</script>

<template>
  <BaseLoader :loading="isLoading" />
  <SiteHeader :user="user" />
  <div class="min-h-[800px] p-2 bg-white flex">
    <Toast />
    <RunsView v-if="user.isAuthenticated" :user="user" />
    <HomeView v-else :user="user" />
  </div>
  <SiteFooter />
</template>
