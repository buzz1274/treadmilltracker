<script setup lang="ts">
import RunHistory from '../components/RunHistory.vue'
</script>

<template>
  <div class="grid grid-cols-10 gap-4 w-screen">
    <div class="col-span-3">
      <RunHistory />
      <RunHistory />
    </div>
    <div class="col-span-7">
      <!-- Content for the second column (70% width) -->
    </div>
  </div>
</template>
