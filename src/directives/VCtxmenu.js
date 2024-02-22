import { reactive, ref, createApp } from 'vue';
import Contextmenu from '@/components/Contextmenu/Contextmenu.vue';

const VCtxmenu = {
    mounted: (el, binding, vnode) => {
        const root = document.createElement('div');
        const pos = reactive({
            left: 0,
            top: 0,
        })
        const isVisible = ref(false)
        const app = createApp(Contextmenu, {
            list: binding.arg,
            pos,
            isVisible //为什么app接收到的没有解包?
        })
        app.mount(root)
        app.config.globalProperties.$updateVisible = function updateVisible(val) {
            isVisible.value = !!val;
        }
        el.addEventListener('contextmenu', function (e) {
            e.stopPropagation();
            e.preventDefault();
            el.appendChild(root)
            isVisible.value = true;
            pos.left = e.x;
            pos.top = e.y;
        })
    },

}

export default VCtxmenu;