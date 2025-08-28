<script setup lang="ts">
import Chart from 'primevue/chart'
import BaseComponentHeader from '@/components/base/BaseComponentHeader.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'
import BaseDatePicker from '@/components/base/BaseDatePicker.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import RadioButton from 'primevue/radiobutton'
import RadioButtonGroup from 'primevue/radiobuttongroup'

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

const filterModel = defineModel<{
  startDate: Date
  endData: Date
  xAxis: string
  yAxis: string
}>({
  type: Object,
  default: (): {
    startDate: Date
    endDate: Date
    xAxis: string
    yAxis: string
  } => ({
    startDate: new Date('2025-08-01'),
    endDate: new Date('2025-08-01'),
    xAxis: 'distance',
    yAxis: 'monthly',
  }),
})

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
  console.log(filterModel.value)
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
      <label for="startDate" class="font-semibold w-24">Start Date</label>
      <BaseDatePicker v-model="filterModel.startDate" />
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label for="endDate" class="font-semibold w-24">End Date</label>
      <BaseDatePicker v-model="filterModel.endDate" />
    </div>
    <RadioButtonGroup v-model="filterModel.xAxis" name="xaxis" class="flex flex-wrap gap-4 mb-4">
      <label for="xaxis" class="font-semibold w-24">X-axis</label>
      <div v-for="(choice, index) in xAxisChoices" :key="index" class="flex items-center gap-2">
        <RadioButton :input-id="'xaxis_' + index" :value="choice.value" />
        <label :for="'axis_' + index" class="text-xs">{{ choice.label }}</label>
      </div>
    </RadioButtonGroup>
    <RadioButtonGroup v-model="filterModel.yAxis" name="yaxis" class="flex flex-wrap gap-4">
      <label for="yaxis" class="font-semibold w-24">Y-axis</label>
      <div v-for="(choice, index) in yAxisChoices" :key="index" class="flex items-center gap-2">
        <RadioButton :input-id="'yaxis_' + index" :value="choice.value" />
        <label :for="'yaxis_' + index" class="text-xs">{{ choice.label }}</label>
      </div>
    </RadioButtonGroup>
    <div class="flex justify-end gap-2 mt-10">
      <BaseButton label="Cancel" severity="secondary" @click="graphFilterVisible = false" />
      <BaseButton label="Reset" severity="secondary" @click="filterGraph(true)" />
      <BaseButton label="Filter" severity="primary" @click="filterGraph(false)" />
    </div>
  </Dialog>
</template>
