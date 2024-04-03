import { createRouter, createWebHashHistory } from 'vue-router'
// import DesignContainer from '@/components/DesignContainer.vue'
import Login from '@/components/Login'
import Detail from '@/components/Detail'
import EmptyPage from '@/components/EmptyPage.vue'
import FileView from '@/components/Detail/FileView'
import CommunityView from '@/components/Detail/CommunityView'
import { errorMsg, infoMsg } from '@/hooks/Message/globalMessage'
import { storeToRefs } from 'pinia';
import { useItemsStore } from '@/store';
import { checkToken } from '@/http'
const DesignContainer = () => import('@/components/DesignContainer.vue')

const routes = [
    {
        path: '/project/:template?', component: DesignContainer, name: 'DesignContainer', beforeEnter: (to, from, next) => {
            if (!to.query.pname) {
                infoMsg('不存在该项目')
                next({ name: 'detail' })
            } else next();
        },meta: {
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
router.beforeEach(async (to, from) => {
    const { username } = storeToRefs(useItemsStore());
    if (to.meta.requireAuth && !username.value) {
        const resp = await checkToken(); 
        if (resp.data.code == 401) {
            infoMsg(resp.data.message)
            return {
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            }
        }

    }
})
export default router;

