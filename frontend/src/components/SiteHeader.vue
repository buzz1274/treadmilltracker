<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  user: ref<any>
}>()

const logout = (): void => {}
</script>

<template>
  <header class="bg-black h-20 top-0 flex relative text-white leading-6 items-center">
    <h1 class="text-4xl font-bold pl-4">TreadmillTracker</h1>
    <nav v-if="props.user.isAuthenticated" class="absolute top-0 right-0 pr-4 pt-1 text-[0.90rem]">
      Welcome back, {{ props.user.name }}
      <span
        class="pi pi-sign-out text-[0.75rem] ml-2 cursor-pointer"
        title="Sign out"
        @click="logout"
      />
    </nav>
  </header>
</template>
