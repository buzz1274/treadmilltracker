<script setup lang="ts">
import {
  CalendarHeatmap,
  type CalendarItem,
  type Value as HeatmapValue,
} from 'vue3-calendar-heatmap'
import moment from 'moment'
import { computed, onMounted, ref, type Ref, watch } from 'vue'
import type { Moment } from 'moment/moment'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'

import { RunsModel } from '@/models/RunsModel.ts'
import type { IUser, IRun } from '@/types/types'
import { store as useStore } from '@/stores/store'
import BaseComponentHeader from '@/components/base/BaseComponentHeader.vue'

const store = useStore()
const { resyncRuns } = storeToRefs(store)
const props = defineProps<{
  user: IUser
}>()

const toast = useToast()
const runsModel = new RunsModel()
const runs = ref<HeatmapValue[]>([])

const endDate: Ref<Moment> = ref(moment())
const startDate: Ref<Moment> = ref(moment().subtract(1, 'years'))

const getRuns = (): void => {
  runsModel
    .getRuns(
      'days',
      startDate.value.format('YYYY-MM-DD'),
      endDate.value.format('YYYY-MM-DD'),
    )
    .then(() => {
      runs.value = runsModel.runs.value.map((run: IRun) => ({
        date: new Date(run.run_date),
        count: Number((run.distance_m / 1000).toFixed(2)),
      }))
    })
    .catch((error: unknown) => {
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

const availableYears = computed(() => {
  const availableYears = []

  const startYear = moment(props.user.registrationDate).year()
  const endYear = moment().year()

  for (let year = startYear; year <= endYear; year++) {
    availableYears.push(year)
  }

  return availableYears.reverse()
})

const tooltipFormatter = (run: CalendarItem): string =>
  `<p class="text-xs">${run.count} Km ran on ${moment(run.date).format(
    'Do MMM YYYY',
  )}</p>`

const changeYear = (year: string): void => {
  const parsedYear = parseInt(year, 10)

  if (!isNaN(parsedYear)) {
    startDate.value = moment().year(parsedYear).startOf('year')
    endDate.value = moment().year(parsedYear).endOf('year')
  } else {
    endDate.value = moment()
    startDate.value = moment(endDate.value).subtract(1, 'years')
  }
  getRuns()
}
</script>

<template>
  <BaseComponentHeader table-title="Heatmap" class="mb-2">
    <template #header_action>
      <select
        class="bg-white text-black text-xs mr-1"
        @change="changeYear(($event.target as HTMLSelectElement)?.value)"
      >
        <option value="">Last 12 months</option>
        <option
          v-for="(availableYear, index) in availableYears"
          :key="index"
          :value="availableYear"
        >
          {{ availableYear }}
        </option>
      </select>
    </template>
  </BaseComponentHeader>

  <CalendarHeatmap
    :values="runs"
    no-data-text="<p class='text-xs'>No runs recorded</p>"
    :tooltip-formatter="(v) => tooltipFormatter(v)"
    :range-color="['#e8e8e8', '#e8e8e8', '#000000']"
    :end-date="endDate"
    :week-start="1"
  />
</template>
