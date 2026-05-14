<script setup lang="ts">
import Column from 'primevue/column'
import { onMounted, ref, type Ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'

import BaseDataTable from './base/BaseDataTable.vue'
import type { IRun } from '@/types/types.d.ts'
import { PersonalBestsModel } from '@/models/PersonalBestsModel.ts'
import { formatDate } from '@/helper/helper.ts'
import { store as useStore } from '@/stores/store'
import type { IPersonalBest } from '@/types/personal_best_types'

const store = useStore()
const toast = useToast()
const { resyncRuns } = storeToRefs(store)
const personalBestsModel = ref(new PersonalBestsModel())
const displayPersonalBestsModal: Ref<boolean> = ref(false)
const personalBestModalData: Ref<IPersonalBest | null> = ref(null)

const viewPersonalBests = (event: InputEvent): void => {
  personalBestModalData.value = event.data as unknown as IPersonalBest
  displayPersonalBestsModal.value = true
}
const personalBestTitle = (): string => {
  if (!personalBestModalData.value) return ''

  return `
    Top ${personalBestModalData.value.runs.length}
    ${
      personalBestModalData.value.title.endsWith('Run')
        ? `${personalBestModalData.value.title}s`
        : `${personalBestModalData.value.title} Runs`
    }
    `
}

const getPersonalBests = (): void => {
  personalBestsModel.value.getPersonalBests().catch((error: unknown) => {
    toast.add({
      severity: 'error',
      summary: 'An error occurred',
      detail: error,
      life: 3000,
    })
  })
}

onMounted((): void => {
  getPersonalBests()
})

watch(
  () => resyncRuns.value,
  (): void => {
    getPersonalBests()
  },
)
</script>

<template>
  <div>
    <Dialog
      v-model:visible="displayPersonalBestsModal"
      modal
      :header="personalBestTitle()"
      class="text-sm"
      position="top"
      :draggable="false"
      :style="{ width: '40rem' }"
    >
      <BaseDataTable
        :table-data="personalBestModalData?.runs ?? []"
        table-title=""
        :show-header="false"
        table-style="min-width:100%"
      >
        <template #data>
          <Column field="date" header="Date">
            <template #body="{ data }: { data: IRun }">
              {{ formatDate(data.run_date, 'days') ?? '-' }}
            </template>
          </Column>
          <Column
            class="!text-end cursor-pointer"
            field="distance"
            header="Distance(km)"
          >
            <template #body="{ data }: { data: IRun }">
              {{ data.distanceKm() ?? '-' }}
            </template>
          </Column>
          <Column
            class="!text-end cursor-pointer"
            field="distance"
            header="Pace(km/h)"
          >
            <template #body="{ data }: { data: IRun }">
              {{ data.pace.toFixed(2) ?? '-' }}
            </template>
          </Column>
          <Column
            class="!text-end cursor-pointer"
            field="calories"
            header="Calories"
          >
            <template #body="{ data }: { data: IRun }">
              {{ data.calories ?? '-' }}
            </template>
          </Column>
          <Column
            class="!text-end cursor-pointer"
            field="vo2max"
            header="VO₂ Max"
          >
            <template #body="{ data }: { data: IRun }">
              {{ data.vo2max ?? '-' }}
            </template>
          </Column>
          <Column
            class="!text-end cursor-pointer"
            field="time"
            header="Time(HH:MM:SS)"
          >
            <template #body="{ data }: { data: IRun }">
              {{ data.secondsToHHMMSS() ?? '-' }}
            </template>
          </Column>
        </template>
      </BaseDataTable>
    </Dialog>

    <BaseDataTable
      :table-data="personalBestsModel.personalBests"
      table-title="Personal Bests"
      @row-select="viewPersonalBests"
    >
      <template #data>
        <Column field="title" header="Title"></Column>
        <Column field="date" header="Date">
          <template #body="{ data }: { data: IPersonalBest }">
            {{
              data?.runs?.['0']?.run_date
                ? formatDate(data.runs['0'].run_date, 'days')
                : '-'
            }}
          </template>
        </Column>
        <Column class="!text-end" field="distance" header="Distance(km)">
          <template #body="{ data }: { data: IPersonalBest }">
            {{ data?.runs?.['0']?.distanceKm() ?? '-' }}
          </template>
        </Column>
        <Column class="!text-end" field="time" header="Time(HH:MM:SS)">
          <template #body="{ data }: { data: IPersonalBest }">
            {{ data?.runs?.['0']?.secondsToHHMMSS() ?? '-' }}
          </template>
        </Column>
      </template>
    </BaseDataTable>
  </div>
</template>
