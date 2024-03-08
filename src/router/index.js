import { createRouter, createWebHashHistory } from 'vue-router'
import DesignContainer from '@/components/DesignContainer.vue'
import Login from '@/components/Login'
import Detail from '@/components/Detail'

const routes = [
    { path: '/', component: import('@/components/DesignContainer.vue'), name: 'DesignContainer', },
    { path: '/login', component: Login, name: 'login' }
    , { path: '/detail', component: Detail, name: 'detail' }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export default router;

