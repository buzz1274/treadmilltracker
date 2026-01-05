<script setup lang="ts">
import Dialog from 'primevue/dialog'
import BaseDatePicker from '@/components/base/BaseDatePicker.vue'
import { convertToSeconds } from '@/helper/helper.ts'
import Message from 'primevue/message'
import { Form } from '@primevue/forms'
import { computed, ref, type Ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { yupResolver } from '@primeuix/forms/resolvers/yup'
import type { Run } from '@/types/types.d.ts'
import BaseButton from '@/components/base/BaseButton.vue'
import { object, string, number, ObjectSchema } from 'yup'
import { RunModel } from '@/models/RunModel'
import { store as useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const store = useStore()
const { resync_runs } = storeToRefs(store)

const props = withDefaults(
  defineProps<{
    title: string
    visible: boolean
    runData: Run | undefined
  }>(),
  {},
)

const runData: Run = computed(() => props.runData)
const run = ref(new RunModel(runData.value))

const runModelValidationSchema: ObjectSchema<{
  run_date: string
  formattedSeconds: string
  distance_m: number
  calories: number
  vo2max: number
}> = object({
  run_date: string().required('Please enter a valid date'),
  formattedSeconds: string().matches(
    /^([0-1]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/,
    'Please enter time in the format HH:MM:SS',
  ),
  distance_m: number().required('Please enter a valid distance'),
  calories: number().required('Please enter valid value for calories'),
  vo2max: number().required('Please enter valid value for VO2 max'),
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

const save = (): void => {
  let validationError: boolean = false

  try {
    runModelValidationSchema.validateSync(run.value)
  } catch (error) {
    validationError = true
  }

  if (!validationError) {
    run.value
      .save()
      .then(() => {
        const action = props.title.includes('Edit') ? 'updated' : 'created'

        resync_runs.value++

        toast.add({
          severity: 'success',
          summary: 'Run ' + action,
          detail: 'Run ' + action + ' successfully',
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
}

const formattedSeconds = computed({
  get(): string {
    return run.value?.secondsToHHMMSS()
  },
  set(value: string) {
    run.value.duration_s = convertToSeconds(value)
  },
})
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
      v-model="run"
      class="p-4"
      :initial-values="run"
      :resolver="yupResolver(runModelValidationSchema)"
      @submit="save()"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="date" class="font-semibold w-24">Date</label>
        <BaseDatePicker v-model="run.run_date" name="run_date" class="text-xs" />
      </div>
      <div v-if="$form.run_date?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.run_date.error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="time" class="font-semibold w-24">Time(hh:mm:ss)</label>
        <InputText
          v-model="formattedSeconds"
          autocomplete="off"
          name="formattedSeconds"
          class="text-xs"
        />
      </div>
      <div v-if="$form.formattedSeconds?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.formattedSeconds.error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="distance" class="font-semibold w-24">Distance(m)</label>
        <InputNumber
          v-model="run.distance_m"
          autocomplete="off"
          name="distance_m"
          class="text-xs"
        />
      </div>
      <div v-if="$form.distance_m?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.distance_m.error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="distance" class="font-semibold w-24">Calories(kcal)</label>
        <InputNumber v-model="run.calories" autocomplete="off" name="calories" class="text-xs" />
      </div>
      <div v-if="$form.calories?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.calories.error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="vo2" class="font-semibold w-24">VO₂ Max</label>
        <InputNumber v-model="run.vo2max" autocomplete="off" name="vo2max" class="text-xs" />
      </div>
      <div v-if="$form.vo2max?.invalid" class="flex items-center gap-4 mb-4">
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form.vo2max.error.message }}
        </Message>
      </div>
      <div class="flex justify-end gap-2 mt-10">
        <BaseButton label="Cancel" severity="secondary" @click="emit('close')" />
        <BaseButton type="submit" label="Save" severity="primary" />
      </div>
    </Form>
  </Dialog>
</template>
