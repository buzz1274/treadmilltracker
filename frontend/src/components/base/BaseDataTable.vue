<script setup lang="ts">
import DataTable from 'primevue/datatable'

const props = withDefaults(
  defineProps<{
    tableData: Array<Record<string, any>>
    tableTitle: string
    paginate?: boolean | ((page: number) => void)
    newRecord?: boolean | (() => void)
    newRecordTitle?: string
  }>(),
  {
    paginate: false,
    newRecord: false,
    newRecordTitle: '',
  },
)
</script>

<template>
  <DataTable
    :value="props.tableData"
    :rows="5"
    paginator
    unstyled
    :pt="{
      tableContainer: 'w-100 pt-1 pl-2',
      table: 'w-95',
      header: 'bg-black text-white pl-2 ',
      bodyRow: 'leading-loose text-xs hover:bg-surface-100 hover:pointer',
      column: {
        headerCell: 'text-left border-b border-black pb-2',
        bodyCell: 'border-b border-gray-400 pt-1 pb-1',
      },
    }"
  >
    <template #header>
      <div class="flex p-1 text-sm justify-between">
        <div class="font-semibold">{{ props.tableTitle }}</div>
        <div v-if="newRecord" class="pt-1 pr-4" :title="props.newRecordTitle">
          <button class="size-4 pi pi-plus" @click="props.newRecord" />
        </div>
      </div>
    </template>

    <template #paginatorcontainer="{ first, last, page, pageCount, totalRecords }">
      <div v-if="props.paginate && pageCount > 1" class="flex w-full justify-center">
        <div class="flex items-middle justify-center border-b border-black w-95 py-3">
          <button
            class="size-4 pi pi-angle-double-left disabled:text-gray-200"
            text
            :disabled="page === 0"
            @click="props.paginate(0)"
          />
          <button
            class="size-4 pi pi-angle-left disabled:text-gray-200"
            text
            :disabled="page === 0"
            @click="props.paginate(page - 1)"
          />
          <div class="text-color font-medium -mt-0.5">
            <span class="hidden sm:block"
              >Showing {{ first }} to {{ last }} of {{ totalRecords }}</span
            >
            <span class="block sm:hidden">Page {{ page + 1 }} of {{ pageCount }}</span>
          </div>
          <button
            class="size-4 pi pi-angle-right disabled:text-gray-200"
            text
            :disabled="page === totalRecords"
            @click="props.paginate(page + 1)"
          />
          <button
            class="size-4 pi pi-angle-double-right disabled:text-gray-200"
            text
            :disabled="page === totalRecords"
            @click="props.paginate(pageCount)"
          />
        </div>
      </div>
    </template>

    <slot name="data"> </slot>
  </DataTable>
</template>
