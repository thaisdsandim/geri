import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(router)
app.use(vue3GoogleLogin, {
  clientId: '1033725976196-e7dvq1747ipd9ih09ck807mdjo1as5jm.apps.googleusercontent.com'
})

app.mount('#app')
