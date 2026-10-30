<script setup lang="ts">
const props = defineProps<{
  tableTitle: string
}>()
</script>

<template>
  <div class="section-heading">
    <div class="section-title">
      {{ props.tableTitle }}
    </div>
    <slot name="header_action" class="text-end"></slot>
  </div>
</template>
