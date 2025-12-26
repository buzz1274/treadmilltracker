<script setup lang="ts">
import Column from 'primevue/column'
import FilterHistoryModal from '@/components/FilterHistoryModal.vue'
import BaseDataTable from './base/BaseDataTable.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import AddEditRunModal from '@/components/AddEditRunModal.vue'
import ViewDeleteRunModal from '@/components/ViewDeleteRunModal.vue'
import { computed, type ComputedRef, onMounted, reactive, ref, type Ref, watch } from 'vue'
import type { filterHistoryModelType, Run } from '@/types/types.d.ts'
import { RunsModel } from '@/models/RunsModel.ts'
import { formatDate } from '@/helper/helper.ts'
import { storeToRefs } from 'pinia'
import { store as useStore } from '@/stores/store'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const store = useStore()
const { resync_runs } = storeToRefs(store)
const runsModel: RunsModel = new RunsModel()
const runs: Ref<Array<Run>> = ref(runsModel.runs)
const displayViewRunModal: Ref<boolean> = ref(false)
const displayAddEditRunModal: Ref<boolean> = ref(false)
const deleteRun: Ref<boolean> = ref(false)
const addEditRunModalTitle: Ref<string> = ref('')
const runModalData: Ref<Run | undefined> = ref(undefined)
const displayFilterHistoryModal: Ref<boolean> = ref(false)
const filterHistoryModel = reactive<filterHistoryModelType>({
  viewChoices: 'distance',
  groupByChoices: 'daily',
})
const isDailyView: ComputedRef<boolean> = computed(
  () => filterHistoryModel.groupByChoices === 'daily',
)
const isDistanceView: ComputedRef<boolean> = computed(
  () => filterHistoryModel.viewChoices === 'distance',
)
const isCaloriesView: ComputedRef<boolean> = computed(
  () => filterHistoryModel.viewChoices === 'calories',
)
const isVo2View: ComputedRef<boolean> = computed(() => filterHistoryModel.viewChoices === 'vo2max')

const getRuns = (group_by: string): void => {
  runsModel.getRuns(group_by).catch((error) => {
    toast.add({ severity: 'error', summary: 'An error occurred', detail: error, life: 3000 })
  })
}

onMounted((): void => {
  getRuns(filterHistoryModel.groupByChoices)
})
watch(
  () => filterHistoryModel.groupByChoices,
  (group_by: string): void => {
    getRuns(group_by)
  },
)
watch(
  () => resync_runs.value,
  (): void => {
    getRuns(filterHistoryModel.groupByChoices)
  },
)
</script>

<template>
  <div>
    <FilterHistoryModal
      v-model:visible="displayFilterHistoryModal"
      :model-value="filterHistoryModel"
      @close="
        () => {
          displayFilterHistoryModal = false
        }
      "
    />

    <ViewDeleteRunModal
      v-model:visible="displayViewRunModal"
      :run="runModalData"
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
          if (isDailyView) {
            displayViewRunModal = true
            runModalData = event.data
          }
        }
      "
    >
      <template #header_action>
        <div>
          <BaseIcon
            v-if="runs.length > 0"
            icon-css="pi pi-filter pr-4"
            icon-title="Filter History"
            @click="displayFilterHistoryModal = true"
          />
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

      <template #empty> No runs found </template>

      <template #data>
        <Column
          field="run_date"
          :header="filterHistoryModel.groupByChoices === 'weekly' ? 'Date(w/c)' : 'Date'"
          :sortable="true"
          class="cursor-pointer"
        >
          <template #body="{ data }: { data: Run }">
            {{ formatDate(data.run_date, filterHistoryModel.groupByChoices) }}
          </template>
        </Column>
        <Column
          v-if="isDistanceView"
          :sortable="true"
          field="distance_m"
          header="Distance(km)"
          class="cursor-pointer"
        >
          <template #body="{ data }: { data: Run }">
            {{ data.distanceKm() }}
          </template>
        </Column>
        <Column
          v-if="isCaloriesView"
          :sortable="true"
          field="calories"
          header="Calories"
          class="cursor-pointer"
        >
        </Column>
        <Column
          v-if="isDistanceView"
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
          v-if="isDistanceView || isCaloriesView"
          :sortable="true"
          field="duration_s"
          header="Time"
          class="cursor-pointer"
        >
          <template #body="{ data }: { data: Run }">
            {{ data.secondsToHHMMSS() }}
          </template>
        </Column>
        <Column
          v-if="isVo2View"
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
            <div v-if="isDailyView" class="flex items-center">
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
            <div v-else class="flex items-center">-</div>
          </template>
        </Column>
      </template>
    </BaseDataTable>
  </div>
</template>
