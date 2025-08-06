<script setup lang="ts">
import DataTable from '@/volt/DataTable.vue';
import Column from 'primevue/column';

const products = [{'code': 1}];
</script>

<template>
  <DataTable :value="products">
    <Column field="code" header="Code"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="category" header="Category"></Column>
    <Column field="quantity" header="Quantity"></Column>
  </DataTable>
</template>

<style scoped>
</style>
