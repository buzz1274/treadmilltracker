<script setup lang="ts">
import BaseComponentHeader from '@/components/base/BaseComponentHeader.vue'
import { CalendarHeatmap, type CalendarItem } from 'vue3-calendar-heatmap'
import moment from 'moment'
import { computed, onMounted, ref, type Ref } from 'vue'
import type { Moment } from 'moment/moment'
import { RunsModel } from '@/models/RunsModel.ts'
import { useToast } from 'primevue/usetoast'
import type { tUser } from '@/types/types'

const props = defineProps<{
  user: tUser
}>()

const toast = useToast()
const runsModel: RunsModel = ref(new RunsModel())
const runs = ref([])

const endDate: Ref<Moment> = ref(moment())
const startDate: Ref<Moment> = ref(moment().subtract(1, 'years'))

const getRuns = (): void => {
  runsModel.value
    .getRuns('daily', startDate.value.format('YYYY-MM-DD'), endDate.value.format('YYYY-MM-DD'))
    .then(() => {
      runsModel.value.runs.value.forEach((run) => {
        runs.value.push({ date: run.run_date, count: (run.distance_m / 1000).toFixed(2) })
      })

      runs.value = [...runs.value]
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'An error occurred', detail: error, life: 3000 })
    })
}

onMounted((): void => {
  getRuns()
})

const availableYears = computed(() => {
  const availableYears = []

  const startYear = moment(props.user.registrationDate).year()
  const endYear = moment().year()

  for (let year = startYear; year <= endYear; year++) {
    availableYears.push(year)
  }

  return availableYears.reverse()
})

const tooltipFormatter = (run: CalendarItem): string => {
  return (
    '<p class="text-xs">' +
    run.count +
    ' Km ran on ' +
    moment(run.date).format('Do MMM YYYY') +
    '</p>'
  )
}

const changeYear = (year: string): void => {
  if (!isNaN(year) && Number.isInteger(parseInt(year))) {
    startDate.value = moment().year(year).startOf('year')
    endDate.value = moment().year(year).endOf('year')
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
  />
</template>
