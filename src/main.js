import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/css/common.css'
import { VCtxmenu } from 'v-ctxmenu'
import router from '@/router/index'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

const pinia = createPinia()
const app = createApp(App)

app.use(pinia).use(router).use(Antd).directive('ctxmenu', VCtxmenu)
app.mount('#app')