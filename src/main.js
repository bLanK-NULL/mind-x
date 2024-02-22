import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/css/common.css'
import VCtxmenu from '@/directives/VCtxmenu'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia).directive('ctxmenu', VCtxmenu)
app.mount('#app')