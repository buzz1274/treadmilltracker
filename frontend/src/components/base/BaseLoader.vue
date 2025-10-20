<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'
import BlockUI from 'primevue/blockui'

const props = defineProps<{
  loading: boolean
}>()
</script>

<template>
  <BlockUI
    :blocked="props.loading"
    :full-screen="true"
    :class="props.loading ? 'block-ui-blocked' : 'block-ui-hidden'"
  >
    <ProgressSpinner
      v-if="props.loading"
      class="progress-spinner"
      stroke-width="8"
      fill="transparent"
      animation-duration=".5s"
    />
  </BlockUI>
</template>

<style scoped>
.block-ui-hidden {
  display: none;
}
.block-ui-blocked {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.progress-spinner {
  width: 50px;
  height: 50px;
}
</style>
