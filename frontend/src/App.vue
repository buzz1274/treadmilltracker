<script setup lang="ts">
import HeaderNavigation from "@/components/HeaderNavigation.vue";
import RunHistory from '@/components/RunHistory.vue'
</script>

<template>
  <header class="bg-black h-20 top-0 flex relative text-white leading-6 items-center">
    <h1 class="text-4xl font-bold pl-4">
      TreadmillTracker
    </h1>
    <HeaderNavigation />
  </header>
  <div class="main">
    <RunHistory />
  </div>
  <footer>
    &copy; zz50.co.uk
    <div class="version">treadmilltracker v0.1</div>
  </footer>
</template>

<style scoped>
.icon {
  cursor: pointer;
}
a {
  color: #fff;
  text-decoration: none;
  padding-top: 1em;
}
.main {
  min-height: 1050px;
  padding: 0.5em;
  background-color: white;
  display: flex;
}
footer {
  width: 100%;
  height: 28px;
  display: flex;
  place-items: center;
  font-weight: bold;
  font-size: 0.75em;
  padding: 0 1em 0 1em;
  background-color: #000;
  color: #fff;
}
.version {
  float: right;
  text-align: left;
  margin-left: auto;
  order: 2;
  font-weight: bold;
  padding: 0 1em 0 1em;
}
</style>
