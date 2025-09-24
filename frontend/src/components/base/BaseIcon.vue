<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  iconTitle: string
  iconCss: string
}>()

const css = computed((): string => {
  return props.iconCss + ' cursor-pointer'
})
</script>

<template>
  <button
    v-tooltip="{
      value: props.iconTitle,
      pt: { text: '!bg-black text-xs' },
    }"
    :class="css"
    style="font-size: 0.95em"
  />
</template>
