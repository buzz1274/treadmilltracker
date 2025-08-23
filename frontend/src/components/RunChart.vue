<script setup lang="ts">
import Chart from 'primevue/chart'
import BaseComponentHeader from '@/components/base/BaseComponentHeader.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import RadioButton from 'primevue/radiobutton'

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

const graphFilterVisible: ref<boolean> = ref(false)
const xAxisChoices: { label: string; value: string }[] = [
  { label: 'Distance(km)', value: 'distance' },
  { label: 'Time(hrs)', value: 'time' },
  { label: 'Calories', value: 'calories' },
  { label: 'VO₂ Max', value: 'vo2max' },
]
const yAxisChoices: { label: string; value: string }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]

const filterGraph = (reset: boolean = false): void => {
  console.log('filterGraph ' + reset)
  graphFilterVisible.value = false
}
</script>

<template>
  <BaseComponentHeader table-title="Chart">
    <template #header_action>
      <BaseIcon
        icon-css="pi pi-filter pr-4"
        icon-title="Filter Graph"
        @click="graphFilterVisible = true"
      />
    </template>
  </BaseComponentHeader>
  <Chart type="bar" :data="chartData" />

  <Dialog
    v-model:visible="graphFilterVisible"
    modal
    header="Filter Graph"
    class="text-sm"
    position="top"
    :draggable="false"
    :style="{ width: '40rem' }"
  >
    <div class="flex items-center gap-4 mb-4">
      <label for="start_date" class="font-semibold w-24">Start Date</label>
      <DatePicker v-model="start_date" date-format="dd/mm/yy" />
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label for="end_date" class="font-semibold w-24">End Date</label>
      <DatePicker v-model="end_date" date-format="dd/mm/yy" />
    </div>
    <div class="flex flex-wrap gap-4 mb-4">
      <label for="end_date" class="font-semibold w-24">X-axis</label>
      <div v-for="(choice, index) in xAxisChoices" :key="index" class="flex items-center gap-2">
        <RadioButton
          v-model="x_axis"
          :input-id="'x_axis_' + index"
          :name="choice.value"
          :value="choice.value"
        />
        <label :for="'x_axis' + index">{{ choice.label }}</label>
      </div>
    </div>
    <div class="flex flex-wrap gap-4">
      <label for="end_date" class="font-semibold w-24">Y-axis</label>
      <div v-for="(choice, index) in yAxisChoices" :key="index" class="flex items-center gap-2">
        <RadioButton
          v-model="y_axis"
          :input-id="'y_axis_' + index"
          :name="choice.value"
          :value="choice.value"
        />
        <label :for="'y_axis' + index">{{ choice.label }}</label>
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-10">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="graphFilterVisible = false"
      ></Button>
      <Button type="button" label="Reset" severity="secondary" @click="filterGraph(true)"></Button>
      <Button type="button" label="Filter" @click="filterGraph(false)"></Button>
    </div>
  </Dialog>
</template>
