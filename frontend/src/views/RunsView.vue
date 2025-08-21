<script setup lang="ts">
import RunHistory from '../components/RunHistory.vue'
import PersonalBests from '../components/PersonalBests.vue'
</script>

<template>
  <div class="grid grid-cols-10 gap-4 w-screen">
    <div class="col-span-3">
      <PersonalBests class="mb-8" />
      <RunHistory />
    </div>
    <div class="col-span-7">
      <!-- Content for the second column (70% width) -->
    </div>
  </div>
</template>
