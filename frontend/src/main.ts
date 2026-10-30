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
      50: '#f1f6ed',
      100: '#e3edd9',
      200: '#c7dbb6',
      300: '#a5c48e',
      400: '#81a568',
      500: '#50784b',
      600: '#3b623d',
      700: '#31553e',
      800: '#254d3c',
      900: '#203e32',
      950: '#f1f6ed',
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
