<script setup lang="ts">
import RunHistory from '../components/RunHistory.vue'
import PersonalBests from '../components/PersonalBests.vue'
import RunChart from '../components/RunChart.vue'
import RunHeatmap from '../components/RunHeatmap.vue'
import type { tUser } from '@/types/types'

const props: {
  user: tUser
} = defineProps<{
  user: tUser
}>()
</script>

<template>
  <div class="grid grid-cols-10 gap-4 w-screen">
    <div class="col-span-3">
      <PersonalBests class="mb-6" />
      <RunHistory class="mb-6" />
    </div>
    <div class="col-span-7">
      <RunChart :user="user" />
      <div class="mb-6" />
      <RunHeatmap :user="user" />
    </div>
  </div>
</template>
