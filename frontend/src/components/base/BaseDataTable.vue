<script setup lang="ts">
import DataTable from 'primevue/datatable'
import BaseComponentHeader from '@/components/base/BaseComponentHeader.vue'
import { Run, PersonalBests } from '@/types/types.d.ts'

const props = withDefaults(
  defineProps<{
    tableData: Array<Run | PersonalBests>
    tableTitle: string
    paginate?: boolean
    rowsPerPage?: number
  }>(),
  {
    paginate: false,
    newRecord: false,
    rowsPerPage: 10,
  },
)

defineEmits(['rowSelect'])
</script>

<template>
  <DataTable
    :value="props.tableData"
    :rows="props.rowsPerPage"
    paginator
    unstyled
    stripedRows
    selection-mode="single"
    :pt="{
      tableContainer: 'w-full pt-1 pl-2',
      table: 'w-95',
      header: 'bg-black text-white',
      bodyRow: 'leading-loose text-xs hover:bg-gray-100 hover:cursor-zoom-in even:bg-gray-50',
      column: {
        headerCell: 'text-left border-b border-black pb-2',
        bodyCell: 'border-b border-gray-400 pt-1 pb-1',
      },
    }"
    @row-select="(event) => $emit('rowSelect', event)"
  >
    <template #header>
      <BaseComponentHeader :table-title="props.tableTitle">
        <template #header_action>
          <slot name="header_action" />
        </template>
      </BaseComponentHeader>
    </template>

    <template
      #paginatorcontainer="{
        first,
        last,
        page,
        pageCount,
        totalRecords,
        firstPageCallback,
        lastPageCallback,
        prevPageCallback,
        nextPageCallback,
      }"
    >
      <div v-if="props.paginate && pageCount > 1" class="flex w-full justify-center">
        <div class="flex items-middle justify-center border-b border-black w-95 py-3">
          <button
            class="size-4 pi pi-angle-double-left disabled:text-gray-200 enabled:cursor-pointer"
            text
            :disabled="page === 0"
            @click="firstPageCallback"
          />
          <button
            class="size-4 pi pi-angle-left disabled:text-gray-200 enabled:cursor-pointer"
            text
            :disabled="page === 0"
            @click="prevPageCallback"
          />
          <div class="text-color font-medium -mt-0.5">
            <span class="hidden sm:block"
              >Showing {{ first }} to {{ last }} of {{ totalRecords }}</span
            >
            <span class="block sm:hidden">Page {{ page + 1 }} of {{ pageCount }}</span>
          </div>
          <button
            class="size-4 pi pi-angle-right disabled:text-gray-200 enabled:cursor-pointer"
            text
            :disabled="page === pageCount - 1"
            @click="nextPageCallback"
          />
          <button
            class="size-4 pi pi-angle-double-right disabled:text-gray-200 enabled:cursor-pointer"
            text
            :disabled="page === pageCount - 1"
            @click="lastPageCallback"
          />
        </div>
      </div>
    </template>

    <slot name="data"> </slot>
  </DataTable>
</template>
