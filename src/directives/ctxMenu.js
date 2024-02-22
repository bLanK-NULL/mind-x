import { reactive } from 'vue';
import ContextMenu from './ContextMenu/ContextMenu.vue';

const root = document.createElement('div');
const pos = reactive({
    left: 0,
    top: 0,
})
const isVisible = ref(false)
const VCtxMenu = {
    mounted: (el, binding, vnode) => {
        const app = createApp(Comp, {
            pos,
            list,
            
        })
        app.mount(root)
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            el.appendChild(root)
            // ctxMenuRef.value.visible = true;
            pos.left = e.x;
            pos.top = e.y;
        })
    },
}

export default VCtxMenu;