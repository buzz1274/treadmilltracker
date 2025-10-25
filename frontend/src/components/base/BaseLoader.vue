<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'

const props = defineProps<{
  loading: boolean
}>()
</script>

<template>
  <div v-if="props.loading" class="loader-overlay">
    <ProgressSpinner
      class="progress-spinner"
      stroke-width="8"
      fill="transparent"
      animation-duration=".5s"
    />
  </div>
</template>

<style scoped>
.loader-overlay {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
}
.progress-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
}
</style>
