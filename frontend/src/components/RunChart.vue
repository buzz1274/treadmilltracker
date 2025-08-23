<script setup lang="ts">
import Chart from 'primevue/chart'
import BaseComponentHeader from '@/components/base/BaseComponentHeader.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'

//dummy data
const runs = [
  { date: '2025-08-01', distance: '7600' },
  { date: '2025-08-02', distance: '8900' },
  { date: '2025-08-03', distance: '12000' },
  { date: '2025-08-04', distance: '1234' },
  { date: '2025-08-05', distance: '4598' },
  { date: '2025-08-06', distance: '7891' },
  { date: '2025-08-07', distance: '7867' },
  { date: '2025-08-08', distance: '5432' },
  { date: '2025-08-09', distance: '5456' },
  { date: '2025-08-10', distance: '5123' },
]

const chartData = {
  labels: runs.map((run) => run.date),
  datasets: [
    {
      label: 'Distance(m)',
      data: runs.map((run) => run.distance),
      borderColor: '#000000',
      fill: true,
    },
  ],
}
//end dummy data

const filterGraph = (): void => {
  console.log('filterGraph')
}
</script>

<template>
  <BaseComponentHeader table-title="Chart">
    <template #header_action>
      <BaseIcon icon-css="pi pi-filter pr-4" icon-title="Filter Graph" @click="filterGraph" />
    </template>
  </BaseComponentHeader>
  <Chart type="bar" :data="chartData" />
</template>
