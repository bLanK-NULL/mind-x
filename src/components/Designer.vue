<template>
    <div class="designer" ref="designer" :style="{
        'background-color': themeconf.baseBackgroundColor,
    }" v-ctxmenu:[contextmenuListOnDesigner]>
        <div class="selectMask" ref="selectMask" v-if="showSelectMask" :style="{
            width: maskRect.width / scaleRatio + 'px',
            height: maskRect.height / scaleRatio + 'px',
            left: maskRect.leftAbs + 'px',
            top: maskRect.topAbs + 'px',
        }"></div>
        <DragItem :itemData="topItem" :level=0 v-for="topItem of topItems" :key="topItem.id">
        </DragItem>
        <Teleport to="body">
            <Transition name="showRatio">
                <div class="showRatio" v-show="showScale">X {{ scaleRatio }}</div>
            </Transition>
        </Teleport>
    </div>
</template>


<script setup>
import { nextTick, onMounted, provide, reactive, ref, watch, onBeforeUnmount } from 'vue';
import DragItem from '@/components/DragItem.vue';
import { useItemsStore } from '@/store/index'
import { storeToRefs } from 'pinia';
import { successMsg, errorMsg, infoMsg } from '@/hooks/Message/globalMessage'
import eventBus from '@/utils/eventBus';
import { saveToLocalForage } from '@/localForage/index'
import { uploadProject } from '@/http/index.js'
import { exportToPNG, getCoverPNG } from '@/utils/exportPdf';
import { withdraw, unwithdraw } from '@/utils/revocableOp';
import { useRoute } from 'vue-router';
import { sendMsg } from '@/utils/crossTab';
import router from '@/router';
const route = useRoute();
const itemsStore = useItemsStore()
const { themeconf, scaleRatio, topItems } = storeToRefs(itemsStore)
const { extractProject, designerRect, createDragItem } = itemsStore

const props = defineProps({
    pname: {
        type: String,
        default: '默认名称'
    }
})
/**
 * 初始化画布位置
 */
onMounted(() => {
    console.log('designer vue onmounted');
    // nextTick(() => {
    // 取消浏览器默认的滚动恢复功能。
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
})

//框选
const showSelectMask = ref(false);
const maskRect = reactive({
    width: 0,
    height: 0,
    left: 0, //相对视口的坐标
    top: 0,
    leftAbs: 0, //相对于designer的坐标
    topAbs: 0,
})
const selectMask = ref(null)
const designer = ref(null)
provide('maskRect', maskRect)
onMounted(() => {
    designer.value.addEventListener('mousedown', handleSelectMask)
})
onBeforeUnmount(() => {
    designer.value.removeEventListener('mousedown', handleSelectMask)
})
function handleSelectMask(e) {
    //点击相对于视口的坐标
    maskRect.left = e.clientX;
    maskRect.top = e.clientY;
    //点击相对于designer的坐标
    maskRect.leftAbs = e.pageX / scaleRatio.value;
    maskRect.topAbs = e.pageY / scaleRatio.value;

    designer.value.addEventListener('mousemove', handleMousemove)
    function handleMousemove(e) {
        showSelectMask.value = true
        //随着缩放倍率而变化宽高
        maskRect.width += e.movementX
        maskRect.height += e.movementY
    }
    designer.value.addEventListener('mouseup', handleMouseUpOrLeave)
    designer.value.addEventListener('mouseleave', handleMouseUpOrLeave)
    function handleMouseUpOrLeave(e) {
        designer.value.removeEventListener('mousemove', handleMousemove)
        showSelectMask.value = false
        eventBus.publish('multiSelected')
        nextTick(() => {
            maskRect.width = 0;
            maskRect.height = 0;
        })
        designer.value.removeEventListener('mouseup', handleMouseUpOrLeave)
        designer.value.removeEventListener('mouseleave', handleMouseUpOrLeave)
    }
}

/**
 * tab键增加节点
 * @param {Object} dragItem 
 */
function handleTab(e) {
    if (e.key === 'Tab') {
        eventBus.publish('tab')
    }
}
window.addEventListener('keydown', handleTab, false)
onBeforeUnmount('keydown', handleTab, false)

/**
 * 按住空格移动
 */
function handleSpaceKeyDown(event) {
    window.scrollBy(-event.movementX, -event.movementY)
}
window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        e.preventDefault()
        document.body.style.cursor = 'grab';
        window.addEventListener('mousemove', handleSpaceKeyDown);
    }
});
window.addEventListener('keyup', function (event) {
    if (event.code === 'Space') {
        document.body.style.cursor = 'default';
        window.removeEventListener('mousemove', handleSpaceKeyDown);
    }
});

/**
 * scale 缩放的方式
 */
const showScale = ref(false)
let timerOfScale = null;
window.addEventListener('wheel', function (e) {
    if (!e.ctrlKey) return
    e.preventDefault();
    if (e.deltaY < 0 && scaleRatio.value < 2) {
        scaleRatio.value = Number((scaleRatio.value + 0.1).toFixed(1))
    }
    else if (e.deltaY > 0 && scaleRatio.value > 0.5) {
        scaleRatio.value = Number((scaleRatio.value - 0.1).toFixed(1))
    } else
        return;
}, { passive: false })
onMounted(() => {
    watch(scaleRatio, (newVal, oldVal) => {
        designer.value.style.scale = newVal;
        keepCenter(newVal, oldVal)
        //有效缩放后 显示当前倍率
        showScale.value = true;
        clearTimeout(timerOfScale)
        timerOfScale = setTimeout(() => {
            showScale.value = false
            timerOfScale = null;
        }, 1000)
    }, { immediate: true })
})
function keepCenter(newScale, oldScale = 1) {
    const width = designer.value.clientWidth;
    const height = designer.value.clientHeight;
    const { scrollX, scrollY } = window
    // console.log("移动: ", scrollX + width / 2 * (newScale - oldScale), scrollY + height / 2 * (newScale - oldScale))
    window.scrollTo(scrollX + width / 2 * (newScale - oldScale), scrollY + height / 2 * (newScale - oldScale))
}

/**
 * 右键菜单
 */
// binding.arg
const contextmenuListOnDesigner = [{
    title: '保存',
    fn: saveProject
}, {
    title: '添加',
    fn: (e) => {
        const item = createDragItem(null)
        watch(item.rect, (newVal) => {
            item.pos.left = (e.pageX - newVal.width / 2) / scaleRatio.value;
            item.pos.top = (e.pageY - newVal.height / 2) / scaleRatio.value;
        }, { once: true })
    }
}, {
    title: '导出png',
    fn: () => {
        exportToPNG(designer.value, route.query.pname)
    }
}]
function saveProject(e) {
    if (topItems.value.length === 0) {
        errorMsg('项目为空!')
        return;
    }
    const data = JSON.stringify(extractProject())
    uploadProject(props.pname, data).then(res => {
        if (res && res.success) {
            successMsg('上传成功')
            console.log(route.query)
            if (!!route.query.newProj) { // 还没有保存的新项目
                sendMsg('reFetch', route.query)
                router.replace({ 
                    name: route.name,
                    query: {
                       ...route.query,
                       newProj: false
                    }
                })
            }
        } else {
            infoMsg('转为本地保存')
            saveToLocal()
        }
        // getCoverPNG(designer.value);
    })
}
function saveToLocal() {
    // const waitingToSaveJson = extractProject();
    saveToLocalForage(props.pname, extractProject())
}
//保存ctrl+s
window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        saveProject()
    }
})

// delete 事件
function handleDel(e) {
    if (e.key === 'Delete') {
        // props.itemData.del()
        eventBus.publish('del')
    }
}
window.addEventListener('keydown', handleDel)

//ctrl+z撤回
window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        e.stopPropagation();
        // console.log('withdraw')
        withdraw();
    } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        e.stopPropagation();
        // console.log('unwithdraw')
        unwithdraw();
    }
})
window.add
</script>

<style scoped>
.designer {
    width: v-bind("designerRect.width + 'px'");
    height: v-bind('designerRect.height + "px"');
    /* background: antiquewhite; */
    position: absolute;
    left: 0;
    top: 0;
    background-image: url('@/assets/bgGrid.svg');
    transform-origin: 0 0;
}

.selectMask {
    box-sizing: border-box;
    border: 2px solid rgb(0, 60, 255);
    background-color: rgba(120, 213, 250, 0.3);
    position: absolute;
    z-index: 99999 !important;
}

.showRatio {
    position: fixed;
    bottom: 32px;
    left: 20px;
    background-color: rgba(255, 255, 255, .3);
    border: 1px solid #000;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    box-sizing: border-bo x;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    user-select: none;
}

/* vue 动画 */
.showRatio-enter-active,
.showRatio-leave-active {
    transition: opacity 1s;
}

.showRatio-enter-from,
.showRatio-leave-to {
    opacity: 0;
}
</style>