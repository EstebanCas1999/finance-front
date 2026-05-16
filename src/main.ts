import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Toast from 'vue-toastification'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  icons: { defaultSet: 'mdi' },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Toast, { position: 'bottom-right', timeout: 4000 })
app.mount('#app')
