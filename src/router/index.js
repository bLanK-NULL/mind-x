import { createRouter, createWebHashHistory } from 'vue-router'
import DesignContainer from '@/components/DesignContainer.vue'
import Login from '@/components/Login'
import Detail from '@/components/Detail'
import { errorMsg } from '@/hooks/Message/globalMessage'

const routes = [
    {
        path: '/', component: import('@/components/DesignContainer.vue'), name: 'DesignContainer', beforeEnter: (to, from, next) => {
            if (!to.query.pname) {
                errorMsg('不存在该项目')
                next({ name: 'detail' })
            } else next();
        },
    },
    { path: '/login', component: Login, name: 'login' }
    , { path: '/detail', component: Detail, name: 'detail' }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export default router;

