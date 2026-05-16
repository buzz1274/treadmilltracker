<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { ToastServiceMethods } from 'primevue'

import BaseIcon from '@/components/base/BaseIcon.vue'
import type { IUser } from '@/types/types'
import { UserStore as UseUserStore } from '@/stores/UserStore'
const UserStore: ReturnType<typeof UseUserStore> = UseUserStore()
const { logout } = UserStore

const toast: ToastServiceMethods = useToast()

const props = defineProps<{
  user: IUser
}>()

const signOut = async (): Promise<void> => {
  await logout()
  toast.add({
    severity: 'success',
    summary: 'Logout',
    detail: 'Logged Out successfully',
    life: 3000,
  })
}
</script>

<template>
  <header
    class="bg-black h-20 top-0 flex relative text-white leading-6 items-center"
  >
    <h1 class="text-4xl font-bold pl-4">TreadmillTracker</h1>
    <nav
      v-if="props.user.IsAuthenticated"
      class="absolute top-0 right-0 pr-4 pt-1 text-[0.90rem]"
    >
      Welcome back, {{ props.user.name }}
      <BaseIcon
        icon-css="pi pi-sign-out ml-2"
        icon-title="Logout"
        @click="signOut()"
      />
    </nav>
  </header>
</template>
