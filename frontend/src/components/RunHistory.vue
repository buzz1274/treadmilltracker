<script setup lang="ts">
import Column from 'primevue/column'
import BaseDataTable from './base/BaseDataTable.vue'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'

const runs = [
  { date: '2025-08-01', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-03', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-04', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-05', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-06', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-07', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-08', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-09', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-10', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
]

const paginate = (page: number): void => {
  console.log('PAGINATE ' + toString(page))
}

const addRun = (): void => {
  console.log('ADD RUN')
}
</script>

<template>
  <BaseDataTable
    :table-data="runs"
    table-title="Run History"
    :paginate="paginate"
    :new-record="addRun"
    new-record-title="Add run"
  >
    <template #data>
      <Column field="date" header="Date"></Column>
      <Column field="distance" header="Distance"></Column>
      <Column field="calories" header="Calories"></Column>
      <Column field="time" header="Time"></Column>
      <Column class="w-5 !text-end">
        <template #header>
          <div class="text-center">-</div>
        </template>
        <template #body="{ data }">
          <div class="flex items-center space-x-1">
            <span @click="selectRow(data)"><PencilIcon class="size-4" /></span>
            <span @click="selectRow(data)"><TrashIcon class="size-4" /></span>
          </div>
        </template>
      </Column>
    </template>
  </BaseDataTable>
</template>
