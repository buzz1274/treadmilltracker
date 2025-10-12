<script setup lang="ts">
import Column from 'primevue/column'
import BaseDataTable from './base/BaseDataTable.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import AddEditRunModal from '@/components/AddEditRunModal.vue'
import ViewDeleteRunModal from '@/components/ViewDeleteRunModal.vue'
import { ref, Ref } from 'vue'
import { Run } from '@/types/types.d.ts'
import { RunsModel } from '@/models/RunsModel.ts'
import moment from 'moment/moment'

const runsModel: RunsModel = new RunsModel()
const runs: Ref<Array<Run>> = ref(runsModel.runs)
const historyDisplay: Ref<string> = ref('distance')
const displayViewRunModal: Ref<boolean> = ref(false)
const displayAddEditRunModal: Ref<boolean> = ref(false)
const deleteRun: Ref<boolean> = ref(false)
const addEditRunModalTitle: Ref<string> = ref('')
const runModalData: Ref<Run | undefined> = ref(undefined)

const formatSecondsAsHHMMSS = (seconds: number): string => {
  const formattedHours = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const formattedMinutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const formattedSeconds = String(seconds % 60).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}
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
      :rows-per-page="15"
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
        <Column field="run_date" header="Date" :sortable="true" class="cursor-pointer">
          <template #body="{ data }: { data: Run }">
            {{ moment(data.run_date).format('MMM Do, YYYY') }}
          </template>
        </Column>
        <Column
          v-if="historyDisplay === 'distance'"
          :sortable="true"
          field="distance_m"
          header="Distance(km)"
          class="cursor-pointer"
        >
          <template #body="{ data }: { data: Run }">
            {{ (data.distance_m / 1000).toFixed(2) }}
          </template>
        </Column>
        <Column
          v-if="historyDisplay === 'calories'"
          :sortable="true"
          field="calories"
          header="Calories"
          class="cursor-pointer"
        >
        </Column>
        <Column
          v-if="historyDisplay === 'distance'"
          :sortable="true"
          field="pace"
          header="Pace(k/h)"
          class="cursor-pointer"
        >
          <template #body="{ data }: { data: Run }">
            {{ data.pace.toFixed(2) }}
          </template>
        </Column>
        <Column
          v-if="historyDisplay === 'distance' || historyDisplay === 'calories'"
          :sortable="true"
          field="duration_s"
          header="Time"
          class="cursor-pointer"
        >
          <template #body="{ data }: { data: Run }">
            {{ formatSecondsAsHHMMSS(data.duration_s) }}
          </template>
        </Column>
        <Column
          v-if="historyDisplay === 'vo2'"
          :sortable="true"
          class="cursor-pointer"
          field="vo2max"
          header="VO₂ Max"
        >
        </Column>
        <Column class="w-4 !text-end">
          <template #header>
            <div class="text-center">-</div>
          </template>
          <template #body="{ data }: { data: Run }">
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
