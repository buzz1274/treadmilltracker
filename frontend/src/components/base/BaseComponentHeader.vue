<script setup lang="ts">
const props = defineProps<{
  tableTitle: string
}>()
</script>

<template>
  <div class="flex p-1 text-sm justify-between bg-black text-white">
    <div class="font-semibold">
      {{ props.tableTitle }}
    </div>
    <slot name="header_action" class="text-end"></slot>
  </div>
</template>
