import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/css/common.css'
import { VCtxmenu } from 'v-ctxmenu'
import router from '@/router/index'
// import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import {
    Layout, LayoutContent, Divider, Tour, Card, CardMeta, Modal, Input,
    FloatButton, Menu, MenuItem, Form, FormItem, InputPassword, Checkbox, Button,
} from 'ant-design-vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia).use(router).directive('ctxmenu', VCtxmenu)
    // .use(Antd)
    .use(Layout).use(LayoutContent).use(Divider).use(Tour).use(Card)
    .use(CardMeta).use(Modal).use(Input).use(FloatButton).use(Menu).use(MenuItem).use(Form)
    .use(FormItem).use(InputPassword).use(Checkbox).use(Button)
app.mount('#app')