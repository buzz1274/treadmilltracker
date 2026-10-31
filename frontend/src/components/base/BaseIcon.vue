<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  iconTitle: string
  iconCss: string
}>()

const css = computed((): string => `${props.iconCss} cursor-pointer`)
</script>

<template>
  <button v-tooltip="props.iconTitle" :class="css" style="font-size: 0.95em" />
</template>
