<script setup lang="ts">
import Chart from 'primevue/chart'
import Dialog from 'primevue/dialog'
import {
  computed,
  type ComputedRef,
  type Ref,
  onMounted,
  ref,
  watch,
} from 'vue'
import RadioButton from 'primevue/radiobutton'
import RadioButtonGroup from 'primevue/radiobuttongroup'
import Message from 'primevue/message'
import { Form } from '@primevue/forms'
import type { ObjectSchema } from 'yup'
import { object, string, date, mixed, type InferType } from 'yup'
import { yupResolver } from '@primeuix/forms/resolvers/yup'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { useToast } from 'primevue/usetoast'

import { store as useStore } from '@/stores/store'
import { formatDate, generateDateSequence } from '@/helper/helper.ts'
import { RunsModel } from '@/models/RunsModel.ts'
import type { IUser, IDateArray, IRun } from '@/types/types'
import { groupByChoices, type TInterval } from '@/types/date.constants.ts'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDatePicker from '@/components/base/BaseDatePicker.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import BaseComponentHeader from '@/components/base/BaseComponentHeader.vue'

// @ts-expect-error path of least resistance
const runsModel: Ref<RunsModel> = ref(new RunsModel())
const toast = useToast()
const runs = ref<IDateArray[]>([])
const store = useStore()
const { resyncRuns } = storeToRefs(store)
const pickerKey = ref(0)

const props = defineProps<{
  user: IUser
}>()

const registrationDate: ComputedRef<Date> = computed(() =>
  moment(props.user.date, 'YYYY-MM-DD').toDate(),
)

const formatData = (data: number, xAxis: string): number => {
  if (xAxis === 'distance_m') return Number((data / 1000).toFixed(2))
  if (xAxis === 'duration_s') return Number((data / 3600).toFixed(2))

  return data
}

const xAxisChoices: { label: string; value: string }[] = [
  { label: 'Distance(km)', value: 'distance_m' },
  { label: 'Time(hrs)', value: 'duration_s' },
  { label: 'Calories', value: 'calories' },
  { label: 'VO₂ Max', value: 'vo2max' },
]
const yAxisChoices = groupByChoices

const filterModel = defineModel<{
  startDate: Date
  endDate: Date
  xAxis: keyof Pick<IRun, 'distance_m' | 'duration_s' | 'calories' | 'vo2max'>
  yAxis: TInterval
}>({
  type: Object,
  default: (): {
    startDate: Date
    endDate: Date
    xAxis: keyof Pick<IRun, 'distance_m' | 'duration_s' | 'calories' | 'vo2max'>
    yAxis: TInterval
  } => ({
    startDate: moment().subtract(1, 'year').startOf('month').toDate(),
    endDate: new Date(),
    xAxis: 'distance_m',
    yAxis: 'months',
  }),
})

// @ts-expect-error path of least resistance
const filterModelValidationSchema: ObjectSchema<{
  startDate: Date
  endDate: Date
  xAxis: keyof Pick<IRun, 'distance_m' | 'duration_s' | 'calories' | 'vo2max'>
  yAxis: TInterval
}> = object({
  startDate: date()
    .default(filterModel.value.startDate)
    .required('Please enter a valid date'),
  endDate: date()
    .default(filterModel.value.endDate)
    .required('Please enter a valid date')
    .test(
      'endDate',
      'End date must be after start date',
      (value) => value > filterModel.value.startDate,
    ),
  xAxis: mixed()
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
const defaultFilterModel: typeof filterModel.value = structuredClone(
  filterModel.value,
)

const getRuns = (): void => {
  runsModel.value
    .getRuns(
      filterModel.value.yAxis,
      formatDate(moment(filterModel.value.startDate), 'ISO-8601'),
      formatDate(moment(filterModel.value.endDate), 'ISO-8601'),
    )
    .then(() => {
      const baseRuns: IDateArray[] = generateDateSequence(
        filterModel.value.startDate,
        filterModel.value.endDate,
        filterModel.value.yAxis,
      )

      const runMap = new Map<string, IRun>(
        runsModel.value.runs.value.map((r) => [
          formatDate(r.run_date, filterModel.value.yAxis),
          r,
        ]),
      )

      runs.value = baseRuns.map((run: IDateArray) => {
        const key = moment.isMoment(run.date)
          ? run.date.format('YYYY-MM-DD')
          : run.date

        const match: IRun | undefined = runMap.get(key)

        if (!match) return run

        return {
          ...run,
          data: formatData(
            match[filterModel.value.xAxis],
            filterModel.value.xAxis,
          ),
        }
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'An error occurred',
        detail: error,
        life: 3000,
      })
    })
}

onMounted((): void => {
  getRuns()
})

watch(
  () => resyncRuns.value,
  (): void => {
    getRuns()
  },
)

const chartData = computed(() => ({
  labels: runs.value.map((run: IDateArray) => run.date),
  datasets: [
    {
      label: xAxisChoices.find(
        (choice) => choice.value === filterModel.value.xAxis,
      )?.label,
      data: runs.value.map((run: IDateArray) => run.data),
      borderColor: '#000',
      fill: false,
      spanGaps: filterModel.value.xAxis === 'vo2max',
    },
  ],
}))

const filterGraph = (reset = false): void => {
  let validationError = false
  let data: InferType<typeof filterModelValidationSchema> | null = null

  if (reset) {
    filterModel.value = structuredClone(defaultFilterModel)
    getRuns()
    graphFilterVisible.value = false
  } else {
    try {
      data = filterModelValidationSchema.validateSync(filterModel.value)
    } catch {
      validationError = true
    }

    if (!validationError && data) {
      getRuns()
      graphFilterVisible.value = false
    }
  }
}

const updateDate = (type: string): void => {
  if (type === 'start') {
    filterModel.value.startDate = new Date(props.user.date)
  }
  if (type === 'end') {
    filterModel.value.endDate = new Date()
  }

  pickerKey.value++
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
  <Chart
    v-if="filterModel['xAxis'] == 'vo2max'"
    type="line"
    :data="chartData"
  />
  <Chart v-else type="bar" :data="chartData" />

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
        <BaseDatePicker
          :key="pickerKey"
          v-model="filterModel.startDate"
          :min-date="registrationDate"
          :max-date="new Date()"
          :manual-input="false"
          name="startDate"
          class="text-xs"
        />
        <span class="text-xs cursor-pointer" @click="updateDate('start')">
          Earliest Date
        </span>
      </div>
      <div
        v-if="$form['startDate']?.invalid"
        class="flex items-center gap-4 mb-4"
      >
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form['startDate'].error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="endDate" class="font-semibold w-24">End Date</label>
        <BaseDatePicker
          :key="pickerKey"
          v-model="filterModel.endDate"
          :max-date="new Date()"
          :manual-input="false"
          name="endDate"
          class="text-xs"
        />
        <span class="text-xs cursor-pointer" @click="updateDate('end')">
          Latest Date
        </span>
      </div>
      <div
        v-if="$form['endDate']?.invalid"
        class="flex items-center gap-4 mb-4"
      >
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form['endDate'].error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <RadioButtonGroup
          v-model="filterModel.xAxis"
          name="xAxis"
          class="flex flex-wrap gap-4"
        >
          <label for="xAxis" class="font-semibold w-24">X-axis</label>
          <div
            v-for="(choice, index) in xAxisChoices"
            :key="index"
            class="flex items-center gap-2"
          >
            <RadioButton :input-id="'xAxis_' + index" :value="choice.value" />
            <label :for="'aXis_' + index" class="text-xs">{{
              choice.label
            }}</label>
          </div>
        </RadioButtonGroup>
      </div>
      <div v-if="$form['xAxis']?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form['xAxis'].error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <RadioButtonGroup
          v-model="filterModel.yAxis"
          name="yAxis"
          class="flex flex-wrap gap-4"
        >
          <label for="yAxis" class="font-semibold w-24">Y-axis</label>
          <div
            v-for="(choice, index) in yAxisChoices"
            :key="index"
            class="flex items-center gap-2"
          >
            <RadioButton :input-id="'yAxis_' + index" :value="choice.value" />
            <label :for="'yAxis_' + index" class="text-xs">{{
              choice.label
            }}</label>
          </div>
        </RadioButtonGroup>
      </div>
      <div v-if="$form['yAxis']?.invalid" class="flex items-center gap-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form['yAxis'].error.message }}
        </Message>
      </div>
      <div class="flex justify-end gap-2 mt-10">
        <BaseButton
          label="Cancel"
          severity="secondary"
          @click="graphFilterVisible = false"
        />
        <BaseButton
          label="Reset"
          severity="secondary"
          @click="filterGraph(true)"
        />
        <BaseButton
          type="submit"
          label="Filter"
          severity="primary"
          @click="filterGraph(false)"
        />
      </div>
    </Form>
  </Dialog>
</template>
