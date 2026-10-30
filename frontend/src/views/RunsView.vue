<script setup lang="ts">
import RunHistory from '../components/RunHistory.vue'
import PersonalBests from '../components/PersonalBests.vue'
import RunChart from '../components/RunChart.vue'
import RunHeatmap from '../components/RunHeatmap.vue'
import type { IUser } from '@/types/types'

const props: {
  user: IUser
} = defineProps<{
  user: IUser
}>()
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-grid">
      <div class="dashboard-sidebar">
        <section class="dashboard-card"><PersonalBests /></section>
        <section class="dashboard-card"><RunHistory /></section>
      </div>
      <div class="dashboard-main">
        <section class="dashboard-card chart-card">
          <RunChart :user="props.user" />
        </section>
        <section class="dashboard-card">
          <RunHeatmap :user="props.user" />
        </section>
        <div class="training-note">
          <i class="pi pi-sparkles" aria-hidden="true"></i> Progress isn’t
          always a straight line. Showing up counts.
        </div>
      </div>
    </div>
  </div>
</template>
