<script setup lang="ts">
import DatePicker from 'primevue/datepicker'

const props = defineProps<{
  name: string
}>()

const model = defineModel<{
  date: Date
}>()
</script>

<template>
  <DatePicker
    :name="props.name"
    v-model="model"
    :pt="{
      header: 'text-sm',
      tableHeader: 'text-sm',
      dayCell: 'text-xs',
    }"
    show-icon
    date-format="dd/mm/yy"
  />
</template>
