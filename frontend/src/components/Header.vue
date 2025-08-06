<script setup lang="ts">
const logout = (): void => {
  console.log('logout')
}
</script>

<template>
  <header class="bg-black h-20 top-0 flex relative text-white leading-6 items-center">
    <h1 class="text-4xl font-bold pl-4">
      TreadmillTracker
    </h1>
    <nav class="absolute top-0 right-0 pr-4 pt-1 text-[0.90rem]">
      Welcome back, David
      <span class="pi pi-sign-out text-[0.75rem] ml-2 cursor-pointer"
            @click="logout"
            title="Sign out" />
    </nav>
  </header>
</template>
