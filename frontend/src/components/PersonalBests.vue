<script setup lang="ts">
import Column from 'primevue/column'
import BaseDataTable from './base/BaseDataTable.vue'

const personalBests = [
  { title: 'Fastest 5km', date: '2025-08-01', time: '21:13' },
  { title: 'Fastest 10km', date: '2025-08-02', time: '45:17' },
]
</script>

<template>
  <BaseDataTable :table-data="personalBests" table-title="Personal Bests">
    <template #data>
      <Column field="title" header="Title"></Column>
      <Column field="date" header="Date"></Column>
      <Column field="time" header="Time"></Column>
      <Column class="w-5 !text-end">
        <template #header>
          <div class="text-center">-</div>
        </template>
        <template #body="{ data }">
          <div class="flex items-center space-x-1">
            <span @click="selectRow(data)"><button class="pi pi-search-plus size-4" /></span>
          </div>
        </template>
      </Column>
    </template>
  </BaseDataTable>
</template>
