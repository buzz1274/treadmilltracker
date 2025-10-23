<script setup lang="ts">
import moment from 'moment/moment'
import Dialog from 'primevue/dialog'
import { computed, type ComputedRef, ref, Ref, watch } from 'vue'
import { Run } from '@/types/types.d.ts'
import BaseButton from '@/components/base/BaseButton.vue'
import { useToast } from 'primevue/usetoast'

const props = withDefaults(
  defineProps<{
    runData: Run | undefined
    visible: boolean
    delete?: boolean
  }>(),
  {
    delete: false,
  },
)
const runData: ComputedRef<Run | undefined> = computed((): Run | undefined => {
  return props.runData
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
  if (!runData.value) return

  runData.value
    .delete()
    .then(() => {
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
    :header="'Treadmill run on ' + moment(runData?.run_date).format('MMMM Do YYYY')"
    class="text-sm"
    position="top"
    :draggable="false"
    :style="{ width: '40rem' }"
  >
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">Distance(km)</div>
      <div>{{ runData?.distanceKm() }}</div>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">Time(h:m:s)</div>
      <div>{{ runData?.secondsToHHMMSS() }}</div>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">Pace(Km/h)</div>
      <div>{{ runData?.pace }}</div>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">Calories</div>
      <div>{{ runData?.calories }}</div>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">VO₂ Max</div>
      <div>{{ runData?.vo2max }}</div>
    </div>
    <div v-if="props.delete" class="flex justify-end gap-2 mt-10">
      <BaseButton label="Cancel" severity="secondary" @click="emit('close')" />
      <BaseButton label="Delete" severity="primary" @click="deleteRun" />
    </div>
  </Dialog>
</template>
