<script setup lang="ts">
import moment from 'moment/moment'
import Dialog from 'primevue/dialog'
import { ref, Ref, watch } from 'vue'
import { Run } from '@/types/types'
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
  toast.add({
    severity: 'success',
    summary: 'Run deleted',
    detail: 'Run deleted successfully',
    life: 3000,
  })
  emit('close')
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="'Treadmill run on ' + moment(runData?.date).format('MMMM Do YYYY')"
    class="text-sm"
    position="top"
    :draggable="false"
    :style="{ width: '40rem' }"
  >
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">Distance</div>
      <div>{{ runData?.distance }}</div>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">Time</div>
      <div>{{ runData?.time }}</div>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">Calories</div>
      <div>{{ runData?.calories }}</div>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <div class="font-semibold w-24">VO₂ Max</div>
      <div>{{ runData?.vo2 }}</div>
    </div>
    <div v-if="props.delete" class="flex justify-end gap-2 mt-10">
      <BaseButton label="Cancel" severity="secondary" @click="emit('close')" />
      <BaseButton label="Delete" severity="primary" @click="deleteRun" />
    </div>
  </Dialog>
</template>
