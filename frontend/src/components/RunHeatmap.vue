<script setup lang="ts">
import BaseComponentHeader from '@/components/base/BaseComponentHeader.vue'
import { CalendarHeatmap, type CalendarItem } from 'vue3-calendar-heatmap'
import moment from 'moment'
import { ref } from 'vue'

//dummy data
const runs = [{ date: '2025-8-1', count: 7600 }]
const availableYears = [2025, 2024]
//end dummy data

const endDate: ref<Date> = ref(new Date())

const tooltipFormatter = (run: CalendarItem): string => {
  return run.count + ' metres ran on ' + moment(run.date).format('Do MMM YYYY')
}

const changeYear = (year: string) => {
  endDate.value = new Date(parseInt(year), 11, 31)

  if (isNaN(endDate.value.getTime())) {
    endDate.value = new Date()
  }
}
</script>

<template>
  <BaseComponentHeader table-title="Heatmap" class="mb-2">
    <template #header_action>
      <select class="bg-white text-black text-xs" @change="changeYear($event.target.value)">
        <option value="">Last 12 months</option>
        <option v-for="(availableYear, index) in availableYears" :key="index" value="availableYear">
          {{ availableYear }}
        </option>
      </select>
    </template>
  </BaseComponentHeader>
  <CalendarHeatmap
    :values="runs"
    :no-data-text="'No runs recorded'"
    :tooltip-formatter="(v) => tooltipFormatter(v)"
    :end-date="endDate"
  />
</template>
