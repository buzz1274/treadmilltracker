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
    v-model="model"
    :name="props.name"
    :pt="{
      header: 'text-sm',
      tableHeader: 'text-xs',
      dayCell: 'text-xs',
    }"
    show-icon
    date-format="dd/mm/yy"
  />
</template>

<style>
.p-inputtext {
  font-size: 14px !important;
}
</style>
