<script setup lang="ts">
import moment from 'moment/moment'
import Dialog from 'primevue/dialog'
import { computed, type ComputedRef, ref, type Ref, watch } from 'vue'
import type { Run } from '@/types/types.d.ts'
import BaseButton from '@/components/base/BaseButton.vue'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import { store as useStore } from '@/stores/store'

const store = useStore()
const { resync_runs } = storeToRefs(store)

const props = withDefaults(
  defineProps<{
    run: Run | undefined
    visible: boolean
    delete?: boolean
  }>(),
  {
    delete: false,
  },
)
const run: ComputedRef<Run | undefined> = computed((): Run | undefined => {
  return props.run
})

const toast = useToast()
const visible: Ref<boolean> = ref(props.visible)
const emit = defineEmits<{
  (event: 'close'): void
}>()

watch(
  () => props.visible,
  (newValue): void => {
    visible.value = newValue
  },
)

watch(visible, (newValue: boolean): void => {
  if (!newValue) {
    emit('close')
  }
})

const deleteRun = (): void => {
  if (!run.value) return

  run.value
    .delete()
    .then(() => {
      resync_runs.value++

      toast.add({
        severity: 'success',
        summary: 'Run deleted',
        detail: 'Run deleted successfully',
        life: 3000,
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'An error occurred',
        detail: error,
        life: 3000,
      })
    })
  emit('close')
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="'Treadmill run on ' + moment(run?.run_date).format('MMMM Do YYYY')"
    class="text-sm"
    position="top"
    :draggable="false"
    :style="{ width: '40rem' }"
  >
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">Distance(km)</div>
      <div>{{ run?.distanceKm() }}</div>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">Time(h:m:s)</div>
      <div>{{ run?.secondsToHHMMSS() }}</div>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">Pace(Km/h)</div>
      <div>{{ run?.pace }}</div>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">Calories</div>
      <div>{{ run?.calories }}</div>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">VO₂ Max</div>
      <div>{{ run?.vo2max }}</div>
    </div>
    <div v-if="props.delete" class="flex justify-end gap-2 mt-10">
      <BaseButton label="Cancel" severity="secondary" @click="emit('close')" />
      <BaseButton label="Delete" severity="primary" @click="deleteRun" />
    </div>
  </Dialog>
</template>
