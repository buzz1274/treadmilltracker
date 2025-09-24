<script setup lang="ts">
import Column from 'primevue/column'
import BaseDataTable from './base/BaseDataTable.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import AddEditRunModal from '@/components/AddEditRunModal.vue'
import ViewDeleteRunModal from '@/components/ViewDeleteRunModal.vue'
import { ref, Ref } from 'vue'
import { Run } from '@/types/types.d.ts'

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

const historyDisplay: Ref<string> = ref('distance')
const displayViewRunModal: Ref<boolean> = ref(false)
const displayAddEditRunModal: Ref<boolean> = ref(false)
const deleteRun: Ref<boolean> = ref(false)
const addEditRunModalTitle: Ref<string> = ref('')
const runModalData: Ref<Run | undefined> = ref(undefined)
</script>

<template>
  <div>
    <ViewDeleteRunModal
      v-model:visible="displayViewRunModal"
      :run-data="runModalData"
      :delete="deleteRun"
      @close="
        () => {
          displayViewRunModal = false
          deleteRun = false
          runModalData = undefined
        }
      "
    />

    <AddEditRunModal
      v-model:visible="displayAddEditRunModal"
      :title="addEditRunModalTitle"
      :run-data="runModalData"
      @close="
        () => {
          displayAddEditRunModal = false
          runModalData = undefined
        }
      "
    />

    <BaseDataTable
      :table-data="runs"
      table-title="History"
      :paginate="true"
      :rows-per-page="10"
      new-record-title="Add run"
      @row-select="
        (event) => {
          displayViewRunModal = true
          runModalData = event.data
        }
      "
    >
      <template #header_action>
        <div>
          <select
            class="bg-white text-black text-xs mr-4"
            @change="historyDisplay = $event.target.value"
          >
            <option value="distance">Distance/Time</option>
            <option value="calories">Calories/Time</option>
            <option value="vo2">VO₂ Max</option>
          </select>
          <BaseIcon
            icon-css="pi pi-plus pr-2"
            icon-title="Add Run"
            @click="
              () => {
                addEditRunModalTitle = 'Add Run'
                displayAddEditRunModal = true
              }
            "
          />
        </div>
      </template>

      <template #data>
        <Column field="date" header="Date"></Column>
        <Column v-if="historyDisplay === 'distance'" field="distance" header="Distance"></Column>
        <Column v-if="historyDisplay === 'calories'" field="calories" header="Calories"></Column>
        <Column
          v-if="historyDisplay === 'distance' || historyDisplay === 'calories'"
          field="time"
          header="Time"
        ></Column>
        <Column v-if="historyDisplay === 'vo2'" field="vo2" header="VO₂ Max"></Column>
        <Column class="w-4 !text-end">
          <template #header>
            <div class="text-center">-</div>
          </template>
          <template #body="{ data }">
            <div class="flex items-center">
              <BaseIcon
                icon-css="pi pi-pencil pr-1"
                icon-title="Edit Run"
                @click="
                  () => {
                    displayAddEditRunModal = true
                    addEditRunModalTitle = 'Edit Run'
                    runModalData = data
                  }
                "
              />
              <BaseIcon
                icon-css="pi pi-trash"
                icon-title="Delete Run"
                @click="
                  () => {
                    displayViewRunModal = true
                    runModalData = data
                    deleteRun = true
                  }
                "
              />
            </div>
          </template>
        </Column>
      </template>
    </BaseDataTable>
  </div>
</template>
