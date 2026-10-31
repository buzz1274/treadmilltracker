<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useToast } from 'primevue/usetoast'

import { userStore as UseUserStore } from '@/stores/UserStore'
const userStore: ReturnType<typeof UseUserStore> = UseUserStore()

const toast = useToast()
const loginCallback = async (credentials: { credential: string }) => {
  try {
    await userStore.login(credentials)
  } catch (error: unknown) {
    const err = error as { status?: string; message?: string }

    toast.add({
      severity: 'error',
      summary: err.status ?? 'Error',
      detail: err.message ?? 'Unknown error',
      life: 3000,
    })
  }
}

const initSignIn = () => {
  // @ts-expect-error google script is loaded externally
  const google = window.google?.accounts?.id
  if (!google) return

  google.initialize({
    client_id:
      '805742976196-mf8qb4ok4gc216g6d4oascohmbor6' +
      'ghh.apps.googleusercontent.com',
    auto_select: true,
    callback: loginCallback,
  })

  google.renderButton(document.getElementById('gSignInButton'), {
    type: 'standard',
    text: 'sign_in_with',
    theme: 'outline',
    size: 'large',
    width: '80',
  })
}

let googleScript: HTMLScriptElement | null = null

onMounted(() => {
  // @ts-expect-error google script is loaded externally
  if (window.google?.accounts?.id) {
    initSignIn()
  } else {
    googleScript = document.querySelector<HTMLScriptElement>(
      '#google-sign-in-script',
    )
    googleScript?.addEventListener('load', initSignIn, { once: true })
  }
})

onBeforeUnmount(() => {
  googleScript?.removeEventListener('load', initSignIn)
})
</script>

<template>
  <section class="landing">
    <div class="landing-copy">
      <p class="eyebrow">
        <span class="status-dot"></span> YOUR RUN. YOUR RHYTHM.
      </p>
      <h1>
        Small steps.<br />
        <em>Stronger you.</em>
      </h1>
      <p class="landing-description">
        Every session adds up. Keep your treadmill runs in one place, discover
        your personal bests, and see your progress take shape.
      </p>
      <div class="sign-in-card">
        <p class="sign-in-title">Your next chapter starts here.</p>
        <p>Sign in to start your training journal.</p>
        <div id="gSignInButton" class="google-sign-in" />
      </div>
      <div class="landing-features">
        <span
          ><i class="pi pi-check" aria-hidden="true"></i> Track every
          session</span
        >
        <span
          ><i class="pi pi-check" aria-hidden="true"></i> See your
          progress</span
        >
      </div>
    </div>
    <div class="landing-art" aria-hidden="true">
      <div class="art-topline">
        <span>BUILT ONE RUN AT A TIME</span><i class="pi pi-arrow-up-right"></i>
      </div>
      <div class="track-illustration">
        <div class="track-lane lane-one"></div>
        <div class="track-lane lane-two"></div>
        <div class="track-lane lane-three"></div>
        <div class="track-lane lane-four"></div>
        <div class="track-marker"><i class="pi pi-bolt"></i></div>
      </div>
      <div class="art-caption">
        <span>Find your stride.</span><span>KEEP GOING ↗</span>
      </div>
    </div>
  </section>
</template>
