<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/solid'

const runs = [
  { date: '2025-08-01', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120', vo2: '39' },
]
</script>

<template>
  <DataTable
    :value="runs"
    rows="10"
    unstyled
    paginator
    paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    :currentPageReportTemplate="'Showing {first} to {last} of {totalRecords}'"
    :pt="{
      tableContainer: 'w-100 pt-1 pl-2',
      table: 'w-95',
      header: 'bg-black text-white pl-2 ',
      bodyRow: 'leading-loose text-xs hover:bg-surface-100 hover:pointer',
      column: {
        headerCell: 'text-left border-b border-black pb-2',
        bodyCell: 'border-b border-gray-400 pt-1 pb-1',
      },
      pcPaginator: {
        root: 'flex items-center justify-center pt-3',
      },
    }"
  >
    <template #header>
      <div class="flex p-1 text-sm justify-between">
        <div class="font-semibold">Run History</div>
        <div class="pt-1 pr-4">
          <PlusIcon @click="selectRow(data)" class="size-4" />
        </div>
      </div>
    </template>

    <Column field="date" header="Date"></Column>
    <Column field="distance" header="Distance"></Column>
    <Column field="calories" header="Calories"></Column>
    <Column field="time" header="Time"></Column>
    <Column class="w-10 !text-end">
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
  </DataTable>
</template>
