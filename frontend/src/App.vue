<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import HomeView from '@/views/HomeView.vue'
import RunsView from '@/views/RunsView.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { storeToRefs } from 'pinia'
import { store as useStore } from '@/stores/store'

const store = useStore()
const { user } = storeToRefs(store)
</script>

<template>
  <SiteHeader :user="user" />
  <div class="min-h-[800px] p-2 bg-white flex">
    <RunsView v-if="user.isAuthenticated" :user="user" />
    <HomeView v-else :user="user" />
  </div>
  <SiteFooter />
</template>
