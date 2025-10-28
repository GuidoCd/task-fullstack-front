import './assets/main.css' // <-- AÑADE ESTA LÍNEA

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Toast from 'vue-toastification' // 1. Import the library
import 'vue-toastification/dist/index.css' // 2. Import the CSS for styling
import clickOutside from './directives/click-outside'

const app = createApp(App)

app.directive('click-outside', clickOutside);

app.use(createPinia())
app.use(router)
app.use(Toast)

app.mount('#app')
