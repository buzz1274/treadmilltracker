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
import Message from 'primevue/message'
import { Form } from '@primevue/forms'
import { object, string, date, ObjectSchema, type InferType } from 'yup'
import { yupResolver } from '@primeuix/forms/resolvers/yup'
import moment from 'moment'

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
      borderColor: '#e8e8e8',
      fill: true,
    },
  ],
}
//end dummy data

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

const filterModel = defineModel<{
  startDate: Date
  endDate: Date
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
    startDate: moment().subtract(1, 'year').toDate(),
    endDate: new Date(),
    xAxis: 'distance',
    yAxis: 'monthly',
  }),
})

const filterModelValidationSchema: ObjectSchema<{
  startDate: Date
  endDate: Date
  xAxis: string
  yAxis: string
}> = object({
  startDate: date().default(filterModel.value.startDate).required('Please enter a valid date'),
  endDate: date()
    .default(filterModel.value.endDate)
    .required('Please enter a valid date')
    .test(
      'endDate',
      'End date must be after start date',
      (value) => value > filterModel.value.startDate,
    ),
  xAxis: string()
    .oneOf(
      xAxisChoices.map((choice) => choice.value),
      'Please select a valid choice',
    )
    .default(filterModel.value.xAxis)
    .required('X-axis is required'),
  yAxis: string()
    .oneOf(
      yAxisChoices.map((choice) => choice.value),
      'Please select a valid choice',
    )
    .default(filterModel.value.yAxis)
    .required('Y-axis is required'),
})

const graphFilterVisible = ref<boolean>(false)
const defaultFilterModel: typeof filterModel.value = structuredClone(filterModel.value)

const filterGraph = (reset: boolean = false): void => {
  let validationError: boolean = false
  let data: InferType<typeof filterModelValidationSchema> | null = null

  if (reset) {
    filterModel.value = structuredClone(defaultFilterModel)
  }

  try {
    data = filterModelValidationSchema.validateSync(filterModel.value)
  } catch {
    validationError = true
  }

  if (!validationError && data) {
    //send request to backend and regenerate graph
    graphFilterVisible.value = false
  }
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
    <Form
      v-slot="$form"
      v-model="filterModel"
      :initial-values="filterModel"
      :resolver="yupResolver(filterModelValidationSchema)"
      class="p-4"
      @submit="filterGraph(false)"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="startDate" class="font-semibold w-24">Start Date</label>
        <BaseDatePicker v-model="filterModel.startDate" name="startDate" class="text-xs" />
      </div>
      <div v-if="$form.startDate?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.startDate.error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="endDate" class="font-semibold w-24">End Date</label>
        <BaseDatePicker v-model="filterModel.endDate" name="endDate" class="text-xs" />
      </div>
      <div v-if="$form.endDate?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.endDate.error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <RadioButtonGroup v-model="filterModel.xAxis" name="xAxis" class="flex flex-wrap gap-4">
          <label for="xAxis" class="font-semibold w-24">X-axis</label>
          <div v-for="(choice, index) in xAxisChoices" :key="index" class="flex items-center gap-2">
            <RadioButton :input-id="'xAxis_' + index" :value="choice.value" />
            <label :for="'aXis_' + index" class="text-xs">{{ choice.label }}</label>
          </div>
        </RadioButtonGroup>
      </div>
      <div v-if="$form.xAxis?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.xAxis.error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <RadioButtonGroup v-model="filterModel.yAxis" name="yAxis" class="flex flex-wrap gap-4">
          <label for="yAxis" class="font-semibold w-24">Y-axis</label>
          <div v-for="(choice, index) in yAxisChoices" :key="index" class="flex items-center gap-2">
            <RadioButton :input-id="'yAxis_' + index" :value="choice.value" />
            <label :for="'yAxis_' + index" class="text-xs">{{ choice.label }}</label>
          </div>
        </RadioButtonGroup>
      </div>
      <div v-if="$form.yAxis?.invalid" class="flex items-center gap-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.yAxis.error.message }}
        </Message>
      </div>
      <div class="flex justify-end gap-2 mt-10">
        <BaseButton label="Cancel" severity="secondary" @click="graphFilterVisible = false" />
        <BaseButton label="Reset" severity="secondary" @click="filterGraph(true)" />
        <BaseButton type="submit" label="Filter" severity="primary" @click="filterGraph(false)" />
      </div>
    </Form>
  </Dialog>
</template>
