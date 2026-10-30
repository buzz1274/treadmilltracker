<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { ToastServiceMethods } from 'primevue'

import type { IUser } from '@/types/types'
import { userStore as UseUserStore } from '@/stores/UserStore'
const userStore: ReturnType<typeof UseUserStore> = UseUserStore()
const { logout } = userStore

const toast: ToastServiceMethods = useToast()

const props = defineProps<{
  user: IUser
}>()

const signOut = (): void => {
  logout()
  toast.add({
    severity: 'success',
    summary: 'Logout',
    detail: 'Logged Out successfully',
    life: 3000,
  })
}
</script>

<template>
  <header class="site-header">
    <a href="/" class="brand" aria-label="TreadmillTracker home">
      <span class="brand-mark"
        ><i class="pi pi-bolt" aria-hidden="true"></i
      ></span>
      <span class="brand-copy">
        <span
          >Treadmill<span class="brand-light">Tracker</span
          ><span class="brand-dot">.</span></span
        >
        <span class="brand-byline">YOUR TRAINING JOURNAL</span>
      </span>
    </a>
    <nav
      v-if="props.user.isAuthenticated"
      class="user-nav"
      aria-label="Account"
    >
      <span class="user-greeting"
        >Hello, <strong>{{ props.user.name }}</strong></span
      >
      <button class="sign-out-button" aria-label="Sign out" @click="signOut()">
        <i class="pi pi-sign-out" aria-hidden="true"></i><span>Sign out</span>
      </button>
    </nav>
    <span v-else class="header-tagline">A little further, every day.</span>
  </header>
</template>
