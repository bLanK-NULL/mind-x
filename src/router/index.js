import { createRouter, createWebHashHistory } from 'vue-router'
// import DesignContainer from '@/components/DesignContainer.vue'
// import Login from '@/components/Login'
import Detail from '@/components/Detail'
// import FileView from '@/components/Detail/FileView'
// import CommunityView from '@/components/Detail/CommunityView'
import { infoMsg } from '@/hooks/Message/globalMessage'
const DesignContainer = () => import('@/components/DesignContainer.vue')
const Login = () => import('@/components/Login')
const CommunityView = () => import('@/components/Detail/CommunityView')
const FileView = () => import('@/components/Detail/FileView')
const routes = [
    {
        path: '/project/:template?', component: DesignContainer, name: 'DesignContainer', beforeEnter: (to, from, next) => {
            if (!to.query.pname) {
                infoMsg('不存在该项目')
                next({ name: 'detail' })
            } else next();
        }, meta: {
            requireAuth: true
        }
    },
    { path: '/login', component: Login, name: 'login' },
    {
        path: '/', component: Detail, name: 'detail', redirect: '/fileView',
        children: [
            {
                path: 'fileView',
                name: 'fileView',
                component: FileView,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'communityView',
                name: 'communityView',
                component: CommunityView,
                meta: {
                    requireAuth: true
                }
            },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export default router;

