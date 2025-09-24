import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import { definePreset } from '@primeuix/themes'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const themePreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '#000',
      100: '#000',
      200: '#000',
      300: '#000',
      400: '#000',
      500: '#000',
      600: '#000',
      700: '#000',
      800: '#000',
      900: '#000',
      950: '#000',
    },
  },
})

app.directive('tooltip', Tooltip)

app.use(createPinia())
app.use(router)
app.use(ToastService)

//... @ts-expect-error
app.use(PrimeVue, {
  theme: {
    preset: themePreset,
    options: {
      darkModeSelector: false,
    },
  },
})

app.mount('#app')
