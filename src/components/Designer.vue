<template>
    <div class="designer" ref="designer" :style="{
        'background-color': themeconf.baseBackgroundColor,
    }">
        <div class="selectMask" ref="selectMask" v-if="showSelectMask" :style="{
            width: maskRect.width + 'px',
            height: maskRect.height + 'px',
            left: maskRect.left - designer.getBoundingClientRect().x + 'px',
            top: maskRect.top - designer.getBoundingClientRect().y + 'px',
        }"></div>
        <DragItem :tabNum="tabNum" :selectNum="selectNum" :maskRect="maskRect" :showSelectMask="showSelectMask"
            :itemData="topItem" :level=topItem.level v-for="topItem of itemsStore.topItems" :key="topItem.id">
        </DragItem>
    </div>
</template>


<script setup>
import { computed, nextTick, onBeforeMount, onMounted, provide, reactive, ref, toRef, watch } from 'vue';
import DragItem from '@/components/DragItem.vue';
import { useItemsStore } from '@/store/index'
import { storeToRefs } from 'pinia';
const itemsStore = useItemsStore()
const { themeconf } = storeToRefs(itemsStore)

const node1 = itemsStore.createDragItem(null)
const node2 = itemsStore.createDragItem(node1)
const node3 = itemsStore.createDragItem(node1)
console.log(itemsStore.topItems);
const designerW = ref(20000)
const designerH = ref(20000)
onMounted(() => {
    console.log('app vue onmounted');
    nextTick(() => {
        window.scrollTo(designerW.value / 2 - 0.5 * window.innerWidth, designerH.value / 2 - 0.5 * window.innerHeight)
    })
})

//框选
const showSelectMask = ref(false);
const maskRect = reactive({
    width: 0,
    height: 0,
    left: 0, //相对视口的坐标
    top: 0,
})
const selectMask = ref(null)
const designer = ref(null)
const selectNum = ref(0) // 第几次框选，唯一标识一次框选
onMounted(() => {
    designer.value.addEventListener('mousedown', (e) => {
        //点击相对于视口的坐标 - designer相对于视口的坐标
        maskRect.left = e.clientX
        maskRect.top = e.clientY

        designer.value.addEventListener('mousemove', handleMousemove)
        function handleMousemove(e) {
            showSelectMask.value = true
            maskRect.width += e.movementX
            maskRect.height += e.movementY
        }
        designer.value.addEventListener('mouseup', handleMouseUpOrLeave)
        designer.value.addEventListener('mouseleave', handleMouseUpOrLeave)
        function handleMouseUpOrLeave(e) {
            designer.value.removeEventListener('mousemove', handleMousemove)
            showSelectMask.value = false
            nextTick(() => {
                maskRect.width = 0;
                maskRect.height = 0;
            })
            selectNum.value++
        }
    })
})

/**
 * tab键增加节点
 * @param {Object} dragItem 
 */
const tabNum = ref(0)
function handleTab(e) {
    if (e.key === 'Tab') {
        e.preventDefault()
        e.stopPropagation()
        console.log('Tab');
        tabNum.value++;
        return false;
    }
}
window.addEventListener('keydown', handleTab, false)


/**
 * 按住空格移动
 */
let isSpacePressed = false;
function handleSpaceKeyDown(event) {
    if (isSpacePressed) {
        let scale = window.devicePixelRatio
        window.scrollTo(window.scrollX - event.movementX / scale, window.scrollY - event.movementY / scale);
    }
}
window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        e.preventDefault()
        isSpacePressed = true;
        document.body.style.cursor = 'grab';
        window.addEventListener('mousemove', handleSpaceKeyDown);
    }
});

window.addEventListener('keyup', function (event) {
    if (event.code === 'Space') {
        isSpacePressed = false;
        document.body.style.cursor = 'default';
        window.removeEventListener('mousemove', handleSpaceKeyDown);
    }
});

/**
 * 保证缩放时,视口中心点始终在中心
 */
let scale = 1
onMounted(() => {
    scale = window.devicePixelRatio
})
window.addEventListener('resize', function (e) {
    //新倍率是旧倍率的几倍
    let scaleRatio = window.devicePixelRatio / scale
    // 缩放后在中心的点的相对视口坐标
    let centerX = (scaleRatio - 1) * window.innerWidth / 2
    let centerY = (scaleRatio - 1) * window.innerHeight / 2
    // 移动滚动条
    window.scrollTo(window.scrollX + centerX, window.scrollY + centerY)
    scale = window.devicePixelRatio
})

</script>
 
<style scoped> .designer {
     width: v-bind("designerW + 'px'");
     height: v-bind('designerH + "px"');
     /* background: antiquewhite; */
     position: relative;
     background-image: url('@/assets/bgGrid.svg');

 }

 .selectMask {
     box-sizing: border-box;
     border: 2px solid rgb(0, 60, 255);
     background-color: rgba(120, 213, 250, 0.3);
     position: absolute;
     z-index: 999999999 !important;
 }
</style>