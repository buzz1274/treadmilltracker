<script setup lang="ts">
import Button from 'primevue/button'

const props = defineProps<{
  label: string
  severity: string
}>()
</script>

<template>
  <Button
    type="button"
    :label="props.label"
    :severity="props.severity"
    size="small"
    :pt="{
      label: 'text-sm',
    }"
  />
</template>
