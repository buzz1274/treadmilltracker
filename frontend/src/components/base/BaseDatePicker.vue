<script setup lang="ts">
import DatePicker from 'primevue/datepicker'

const model = defineModel<{
  date: Date
}>()
</script>

<template>
  <DatePicker
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
