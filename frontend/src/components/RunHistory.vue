<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const runs = [
  { date: '2025-08-01', distance: '5km', time: '1:30', calories: '120' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120' },
  { date: '2025-08-02', distance: '5km', time: '1:30', calories: '120' },
]
</script>

<template>
  <DataTable
    :value="runs"
    stripedRows
    :pt="{
      table: { class: 'text-xs px-2' },
      headerRow: { class: 'h-7' },
      bodyRow: { class: 'h-5 text-xs' },
    }"
  >
    <template #header>
      <div class="font-semibold h-3 text-sm">Run History</div>
    </template>

    <Column field="date" header="Date" class="border-gray:50"></Column>
    <Column field="distance" header="Distance"></Column>
    <Column field="calories" header="Calories"></Column>
    <Column field="time" header="Time"></Column>
  </DataTable>
</template>
