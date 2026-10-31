<script setup lang="ts">
import moment from 'moment'
import { computed, onMounted, ref, type Ref, watch } from 'vue'
import type { Moment } from 'moment/moment'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'

import { RunsModel } from '@/models/RunsModel.ts'
import type { IUser, IRunData } from '@/types/types'
import { store as useStore } from '@/stores/store'
import BaseComponentHeader from '@/components/base/BaseComponentHeader.vue'
import { buildHeatmapMonths } from '@/helper/heatmap'

const store = useStore()
const { resyncRuns } = storeToRefs(store)
const props = defineProps<{
  user: IUser
}>()

const toast = useToast()
const runsModel = new RunsModel()
const runs = ref<IRunData[]>([])

const endDate: Ref<Moment> = ref(moment())
const startDate: Ref<Moment> = ref(
  moment().subtract(11, 'months').startOf('month'),
)

const getRuns = (): void => {
  runsModel
    .getRuns(
      'days',
      startDate.value.format('YYYY-MM-DD'),
      endDate.value.format('YYYY-MM-DD'),
    )
    .then(() => {
      runs.value = [...runsModel.runs.value]
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

  const startYear = moment(props.user.date).year()
  const endYear = moment().year()

  for (let year = startYear; year <= endYear; year++) {
    availableYears.push(year)
  }

  return availableYears.reverse()
})

const months = computed(() =>
  buildHeatmapMonths(
    startDate.value.format('YYYY-MM-DD'),
    endDate.value.format('YYYY-MM-DD'),
    runs.value,
  ),
)

const changeYear = (year: string): void => {
  const parsedYear = parseInt(year, 10)

  if (!isNaN(parsedYear)) {
    startDate.value = moment().year(parsedYear).startOf('year')
    endDate.value = moment().year(parsedYear).endOf('year')
  } else {
    endDate.value = moment()
    startDate.value = moment(endDate.value)
      .subtract(11, 'months')
      .startOf('month')
  }
  getRuns()
}
</script>

<template>
  <BaseComponentHeader table-title="Heatmap" class="mb-2">
    <template #header_action>
      <select
        class="bg-white text-black text-xs mr-1"
        aria-label="Heatmap year"
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

  <div class="heatmap-months">
    <section v-for="month in months" :key="month.key" class="heatmap-month">
      <h3>{{ month.label }}</h3>
      <div class="month-days">
        <span
          v-for="(day, index) in month.days"
          :key="day?.date ?? index"
          v-tooltip="day?.label"
          class="day-cell"
          :class="{
            'day-recorded': day?.recorded,
            'day-future': day?.future,
            'day-placeholder': !day,
          }"
          :aria-label="day?.label"
          :aria-hidden="!day"
          :tabindex="day?.recorded ? 0 : undefined"
        ></span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.heatmap-months {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18px 14px;
  padding-top: 4px;
}
.heatmap-month h3 {
  color: #65765b;
  font-size: 10px;
  font-weight: 600;
  margin: 0 0 8px;
}
.month-days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 3px;
}
.day-cell {
  display: block;
  aspect-ratio: 1;
  border-radius: 2px;
  background: #eef1e7;
}
.day-recorded {
  background: #254d3c;
}
.day-future {
  opacity: 0.4;
}
.day-placeholder {
  visibility: hidden;
}
.day-cell:not(.day-placeholder):hover,
.day-cell:focus-visible {
  outline: 1px solid #658052;
  outline-offset: 1px;
}
@media (max-width: 520px) {
  .heatmap-months {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
