<script setup lang="ts">
/*global google */
import { onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

import type { IUser } from '@/types/types'
import { UserStore as UseUserStore } from '@/stores/UserStore'
const UserStore: ReturnType<typeof UseUserStore> = UseUserStore()
const { login } = UserStore

const toast = useToast()
const props: {
  user: IUser
} = defineProps<{
  user: IUser
}>()

onMounted(() => {
  if (typeof google !== 'undefined' && typeof google.accounts !== 'undefined') {
    initSignIn()
  }
})

const initSignIn = () => {
  google.accounts.id.initialize({
    client_id:
      '805742976196-mf8qb4ok4gc216g6d4oascohmbor6ghh.apps.googleusercontent.com',
    auto_select: true,
    callback: loginCallback,
  })

  google.accounts.id.renderButton(document.getElementById('gSignInButton'), {
    type: 'standard',
    text: 'sign_in_with',
    theme: 'outline',
    size: 'large',
    width: '80',
  })
}

const loginCallback = async (credentials) => {
  try {
    await login(credentials)
  } catch (ApiError) {
    toast.add({
      severity: 'error',
      summary: ApiError.status,
      detail: ApiError.message,
      life: 3000,
    })
  }
}
</script>

<template>
  <div class="flex justify-center mx-auto pt-10">
    <div class="text-center max-w-lg p-6 bg-white">
      <p class="text-gray-700">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
        porttitor tortor id urna efficitur ultrices. Maecenas fringilla dapibus
        condimentum. Duis ut sapien non leo feugiat tempus non ac dolor. Ut
        accumsan rhoncus pulvinar. Mauris tincidunt est vitae ex ornare varius.
        Phasellus id dolor in felis molestie bibendum non eu arcu. Nunc molestie
        maximus vestibulum. Ut tempor nunc a nisi suscipit, ac ullamcorper massa
        mattis. Etiam justo lacus, scelerisque non quam in, suscipit vehicula
        neque. Phasellus non diam ac lorem ornare
        <br /><br />
        Nulla eu ullamcorper libero, vel eleifend orci. Cras massa erat, rhoncus
        facilisis enim at, maximus varius mauris. Fusce at sapien vitae velit
        laoreet suscipit. In finibus molestie rhoncus. Donec risus velit,
        hendrerit ut quam quis, hendrerit finibus purus. Nam quis faucibus
        lorem. Pellentesque at sem quam. Fusce rhoncus orci vitae iaculis
        efficitur. Maecenas elit purus, pharetra at lectus id, accumsan gravida
        enim. Duis elementum velit non leo ultrices, a rutrum eros cursus. Morbi
        nec finibus risus. Cras lacus sapien, pretium at nisi quis, consequat
        dignissim ante. Phasellus molestie suscipit suscipit. Integer tristique
        tincidunt
      </p>
      <div class="pt-6 flex justify-center">
        <div id="gSignInButton" />
      </div>
    </div>
  </div>
</template>
