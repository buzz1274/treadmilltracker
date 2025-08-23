<script setup lang="ts">
import Column from 'primevue/column'
import BaseDataTable from './base/BaseDataTable.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'

const personalBests = [
  { title: 'Fastest 5km', date: '2025-08-01', time: '21:13' },
  { title: 'Fastest 10km', date: '2025-08-02', time: '45:17' },
]

const viewPersonalBests = (id: number): void => {
  console.log('View Personal Bests ' + id.toString())
}
</script>

<template>
  <BaseDataTable :table-data="personalBests" table-title="Personal Bests">
    <template #data>
      <Column field="title" header="Title"></Column>
      <Column field="date" header="Date"></Column>
      <Column field="time" header="Time"></Column>
      <Column class="w-3 !text-end">
        <template #header>
          <div class="text-center">-</div>
        </template>
        <template #body="{ data }">
          <div class="flex items-center">
            <BaseIcon
              icon-css="pi pi-search-plus"
              icon-title="View Top 10"
              @click="viewPersonalBests(data)"
            />
          </div>
        </template>
      </Column>
    </template>
  </BaseDataTable>
</template>
