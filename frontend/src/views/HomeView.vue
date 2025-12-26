<script setup lang="ts">
import type { tUser } from '@/types/types'
import BaseButton from '@/components/base/BaseButton.vue'

const props: {
  user: tUser
} = defineProps<{
  user: tUser
}>()
</script>

<template>
  <div class="flex justify-center mx-auto pt-10">
    <div class="text-center max-w-lg p-6 bg-white">
      <p class="text-gray-700">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum porttitor tortor id urna
        efficitur ultrices. Maecenas fringilla dapibus condimentum. Duis ut sapien non leo feugiat
        tempus non ac dolor. Ut accumsan rhoncus pulvinar. Mauris tincidunt est vitae ex ornare
        varius. Phasellus id dolor in felis molestie bibendum non eu arcu. Nunc molestie maximus
        vestibulum. Ut tempor nunc a nisi suscipit, ac ullamcorper massa mattis. Etiam justo lacus,
        scelerisque non quam in, suscipit vehicula neque. Phasellus non diam ac lorem ornare
        <br /><br />
        Nulla eu ullamcorper libero, vel eleifend orci. Cras massa erat, rhoncus facilisis enim at,
        maximus varius mauris. Fusce at sapien vitae velit laoreet suscipit. In finibus molestie
        rhoncus. Donec risus velit, hendrerit ut quam quis, hendrerit finibus purus. Nam quis
        faucibus lorem. Pellentesque at sem quam. Fusce rhoncus orci vitae iaculis efficitur.
        Maecenas elit purus, pharetra at lectus id, accumsan gravida enim. Duis elementum velit non
        leo ultrices, a rutrum eros cursus. Morbi nec finibus risus. Cras lacus sapien, pretium at
        nisi quis, consequat dignissim ante. Phasellus molestie suscipit suscipit. Integer tristique
        tincidunt
      </p>
      <p class="pt-6">
        <BaseButton label="Login" severity="primary" @click="props.user.login()" />
      </p>
    </div>
  </div>
</template>
