<script setup lang="ts">
const props = defineProps<{
  tableTitle: string
}>()
</script>

<template>
  <div class="flex p-1 text-sm justify-between bg-black text-white pl-2">
    <div class="font-semibold">
      {{ props.tableTitle }}
    </div>
    <slot name="header_action"></slot>
  </div>
</template>
