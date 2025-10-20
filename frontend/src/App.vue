<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import HomeView from '@/views/HomeView.vue'
import RunsView from '@/views/RunsView.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
import Toast from 'primevue/toast'
import { storeToRefs } from 'pinia'
import { store as useStore } from '@/stores/store'

const store = useStore()
const { user, loading } = storeToRefs(store)
</script>

<template>
  <BaseLoader :loading="loading.isLoading" />
  <SiteHeader :user="user" />
  <div class="min-h-[800px] p-2 bg-white flex">
    <Toast />
    <RunsView v-if="user.isAuthenticated" :user="user" />
    <HomeView v-else :user="user" />
  </div>
  <SiteFooter />
</template>
