<script setup lang="ts">
import Column from 'primevue/column'
import BaseDataTable from './base/BaseDataTable.vue'

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

const editRun = (id: number): void => {
  console.log('EDIT RUN' + id.toString())
}

const deleteRun = (id: number): void => {
  console.log('EDIT RUN' + id.toString())
}

const addRun = (): void => {
  console.log('ADD RUN')
}
</script>

<template>
  <BaseDataTable
    :table-data="runs"
    table-title="Run History"
    :paginate="true"
    :rows-per-page="10"
    new-record-title="Add run"
  >
    <template #header_action>
      <button class="pi pi-plus pr-4" title="Add Run" style="font-size: 0.95em" @click="addRun" />
    </template>

    <template #data>
      <Column field="date" header="Date"></Column>
      <Column field="distance" header="Distance"></Column>
      <Column field="calories" header="Calories"></Column>
      <Column field="time" header="Time"></Column>
      <Column class="w-4 !text-end">
        <template #header>
          <div class="text-center">-</div>
        </template>
        <template #body="{ data }">
          <div class="flex items-center">
            <button
              class="size-4 pi pi-pencil"
              title="Edit Run"
              style="font-size: 0.95em"
              @click="editRun(data)"
            />
            <button
              class="size-4 pi pi-trash"
              title="Delete Run"
              style="font-size: 0.95em"
              @click="deleteRun(data)"
            />
          </div>
        </template>
      </Column>
    </template>
  </BaseDataTable>
</template>
