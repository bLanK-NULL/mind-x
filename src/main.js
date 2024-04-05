import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/css/common.css'
import { VCtxmenu } from 'v-ctxmenu'
import router from '@/router/index'
// import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import {
    Layout, LayoutHeader, LayoutSider, LayoutContent, Divider, Tour, Card, CardMeta, Modal, Input,
    FloatButton, Menu, MenuItem, InputPassword, Checkbox, Button,
} from 'ant-design-vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia).use(router).directive('ctxmenu', VCtxmenu)
    // .use(Antd)
    .use(Layout).use(LayoutHeader).use(LayoutSider).use(LayoutContent).use(Divider).use(Tour).use(Card)
    .use(CardMeta).use(Modal).use(Input).use(FloatButton).use(Menu).use(MenuItem)
    .use(InputPassword).use(Checkbox).use(Button)
app.mount('#app')