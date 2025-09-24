<script setup lang="ts">
import Dialog from 'primevue/dialog'
import BaseDatePicker from '@/components/base/BaseDatePicker.vue'
import Message from 'primevue/message'
import { Form } from '@primevue/forms'
import { computed, ref, Ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { object, string, date, ObjectSchema, InferType } from 'yup'
import { yupResolver } from '@primeuix/forms/resolvers/yup'
import { Run } from '@/types/types'
import BaseButton from '@/components/base/BaseButton.vue'

const props = withDefaults(
  defineProps<{
    title: string
    visible: boolean
    runData: Run | undefined
  }>(),
  {},
)

const runData = computed((): Run | undefined => {
  return props.runData
})

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

const save = () => {
  console.log('SAVE FORM')
  emit('close')
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="props.title"
    class="text-sm"
    position="top"
    :draggable="false"
    :style="{ width: '40rem' }"
  >
    <Form
      v-slot="$form"
      class="p-4"
      :initial-values="runData"
      :resolver="yupResolver(runModelValidationSchema)"
      v-model="runData"
      @submit="save()"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="date" class="font-semibold w-24">Date</label>
        <BaseDatePicker name="date" class="text-xs" />
      </div>
      <div v-if="$form.date?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.date.error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="time" class="font-semibold w-24">Time(hh:mm:ss)</label>
        <InputText name="time" class="text-xs" />
      </div>
      <div v-if="$form.time?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.time.error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="distance" class="font-semibold w-24">Distance(m)</label>
        <InputNumber name="distance" class="text-xs" />
      </div>
      <div v-if="$form.distance?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.distance.error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="distance" class="font-semibold w-24">Calories(kcal)</label>
        <InputNumber name="calories" class="text-xs" />
      </div>
      <div v-if="$form.calories?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.calories.error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="vo2" class="font-semibold w-24">VO₂ Max</label>
        <InputNumber name="vo2" class="text-xs" />
      </div>
      <div v-if="$form.vo2?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.vo2.error.message }}
        </Message>
      </div>
      <div class="flex justify-end gap-2 mt-10">
        <BaseButton label="Cancel" severity="secondary" @click="emit('close')" />
        <BaseButton type="submit" label="Save" severity="primary" />
      </div>
    </Form>
  </Dialog>
</template>
