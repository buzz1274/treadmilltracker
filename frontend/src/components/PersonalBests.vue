<script setup lang="ts">
import Column from 'primevue/column'
import BaseDataTable from './base/BaseDataTable.vue'
import { ref, type Ref } from 'vue'
import Dialog from 'primevue/dialog'
import type { PersonalBests } from '@/types/types.d.ts'

const personalBests = [
  { title: 'Fastest 5km', date: '2025-08-01', time: '21:13' },
  { title: 'Fastest 10km', date: '2025-08-02', time: '45:17' },
]
const displayPersonalBestsModal: Ref<boolean> = ref(false)
const personalModalData: Ref<PersonalBests | null> = ref(null)

const viewPersonalBests = (event: InputEvent): void => {
  personalModalData.value = event.data as unknown as PersonalBests
  displayPersonalBestsModal.value = true
  //retrieve top 10 from backend//
}
</script>

<template>
  <div>
    <Dialog
      v-model:visible="displayPersonalBestsModal"
      modal
      :header="'Top 10 ' + personalModalData?.title"
      class="text-sm"
      position="top"
      :draggable="false"
      :style="{ width: '40rem' }"
    >
      <h1>Personal Bests</h1>
    </Dialog>
    <BaseDataTable
      :table-data="personalBests"
      table-title="Personal Bests"
      @row-select="viewPersonalBests"
    >
      <template #data>
        <Column field="title" header="Title"></Column>
        <Column field="date" header="Date"></Column>
        <Column class="!text-end" field="time" header="Time"></Column>
      </template>
    </BaseDataTable>
  </div>
</template>
