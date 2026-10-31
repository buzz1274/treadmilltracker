<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { ref, type Ref, watch } from 'vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import RadioButton from 'primevue/radiobutton'
import RadioButtonGroup from 'primevue/radiobuttongroup'
import Message from 'primevue/message'
import { yupResolver } from '@primeuix/forms/resolvers/yup'
import type { ObjectSchema } from 'yup'
import { object, string } from 'yup'

import BaseButton from '@/components/base/BaseButton.vue'
import { groupByChoices, type TInterval } from '@/types/date.constants'
import type { IFilterHistoryModelType } from '@/types/types.d.ts'

const filterHistoryModel = defineModel<IFilterHistoryModelType>({
  required: true,
})
const props = withDefaults(
  defineProps<{
    visible: boolean
  }>(),
  {},
)

const viewChoices: { label: string; value: string }[] = [
  { label: 'Distance/Pace/Time', value: 'distance' },
  { label: 'Calories/Time', value: 'calories' },
  { label: 'VO₂ Max', value: 'vo2max' },
]

const filterHistoryModelValidationSchema: ObjectSchema<{
  viewChoices: string
  groupByChoices: TInterval
}> = object({
  viewChoices: string()
    .oneOf(
      viewChoices.map((choice) => choice.value),
      'Please select a valid choice',
    )
    .default(filterHistoryModel.value.viewChoices)
    .required('View choice is required'),
  groupByChoices: string()
    .oneOf(
      groupByChoices.map((choice) => choice.value),
      'Please select a valid choice',
    )
    .default(filterHistoryModel.value.groupByChoices)
    .required('Group by choice is required'),
})

const draftFilters = ref<IFilterHistoryModelType>({
  ...filterHistoryModel.value,
})
const visible: Ref<boolean> = ref(props.visible)
const emit = defineEmits<{
  (event: 'close'): void
}>()

watch(
  () => props.visible,
  (newValue): void => {
    if (newValue) {
      draftFilters.value = { ...filterHistoryModel.value }
    }
    visible.value = newValue
  },
)

watch(visible, (newValue: boolean): void => {
  if (!newValue) {
    emit('close')
  }
})
const applyFilters = ({ valid }: FormSubmitEvent): void => {
  if (!valid) return

  filterHistoryModel.value = { ...draftFilters.value }
  emit('close')
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    dismissable-mask
    :header="'Filter History'"
    class="text-sm"
    position="top"
    :draggable="false"
    :style="{ width: '40rem' }"
  >
    <Form
      v-slot="$form"
      :resolver="yupResolver(filterHistoryModelValidationSchema)"
      :initial-values="draftFilters"
      class="p-4"
      @submit="applyFilters"
    >
      <div class="flex items-center gap-4 mb-4">
        <RadioButtonGroup
          v-model="draftFilters.viewChoices"
          name="viewChoices"
          class="flex flex-wrap gap-4"
        >
          <label for="viewChoices" class="font-semibold w-24">Display</label>
          <div
            v-for="(choice, index) in viewChoices"
            :key="index"
            class="flex items-center gap-2"
          >
            <RadioButton
              :input-id="'viewChoice_' + index"
              :value="choice.value"
            />
            <label :for="'viewChoice_' + index" class="text-xs">{{
              choice.label
            }}</label>
          </div>
        </RadioButtonGroup>
      </div>
      <div
        v-if="$form['viewChoices']?.invalid"
        class="flex items-center gap-4 mb-4"
      >
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form['viewChoices'].error.message }}
        </Message>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <RadioButtonGroup
          v-model="draftFilters.groupByChoices"
          name="groupByChoices"
          class="flex flex-wrap gap-4"
        >
          <label for="groupByChoices" class="font-semibold w-24"
            >Group By</label
          >
          <div
            v-for="(choice, index) in groupByChoices"
            :key="index"
            class="flex items-center gap-2"
          >
            <RadioButton
              :input-id="'groupByChoice_' + index"
              :value="choice.value"
            />
            <label :for="'groupByChoice_' + index" class="text-xs">{{
              choice.label
            }}</label>
          </div>
        </RadioButtonGroup>
      </div>
      <div
        v-if="$form['groupByChoices']?.invalid"
        class="flex items-center gap-4 mb-4"
      >
        <div class="w-24"></div>
        <Message severity="error" class="border w-100" size="small">
          {{ $form['groupByChoices'].error.message }}
        </Message>
      </div>
      <div class="flex justify-end gap-2 mt-10">
        <BaseButton
          label="Cancel"
          severity="secondary"
          @click="emit('close')"
        />
        <BaseButton type="submit" label="Apply filters" severity="primary" />
      </div>
    </Form>
  </Dialog>
</template>
