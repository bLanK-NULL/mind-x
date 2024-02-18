<template>
    <div class="designer" ref="designer" :style="{
        'background-color': themeconf.baseBackgroundColor,
    }">
        <div class="selectMask" ref="selectMask" v-if="showSelectMask" :style="{
            width: maskRect.width / scaleRatio+ 'px',
            height: maskRect.height /scaleRatio + 'px',
            left: maskRect.leftAbs + 'px',
            top: maskRect.topAbs + 'px',
        }"></div>
        <DragItem :tabNum="tabNum" :selectNum="selectNum" :maskRect="maskRect" :showSelectMask="showSelectMask"
            :itemData="topItem" :level=topItem.level v-for="topItem of itemsStore.topItems" :key="topItem.id">
        </DragItem>
        <Teleport to="body">
            <Transition name="showRatio">
                <div class="showRatio" v-show="showScale">X {{ scaleRatio }}</div>
            </Transition>
        </Teleport>
    </div>
</template>


<script setup>
import { computed, nextTick, onBeforeMount, onMounted, provide, reactive, ref, toRef, watch } from 'vue';
import DragItem from '@/components/DragItem.vue';
import { useItemsStore } from '@/store/index'
import { storeToRefs } from 'pinia';
const itemsStore = useItemsStore()
const { themeconf, scaleRatio } = storeToRefs(itemsStore)

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
    leftAbs: 0, //相对于designer的坐标
    topAbs: 0,
})
const selectMask = ref(null)
const designer = ref(null)
const selectNum = ref(0) // 第几次框选，唯一标识一次框选
onMounted(() => {
    designer.value.addEventListener('mousedown', (e) => {
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
            console.log(maskRect.width, maskRect.height) 
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
 * scale 缩放的方式
 */
const showScale = ref(false)
let timerOfScale = null;
window.addEventListener('wheel', function (e) {
    if (!e.ctrlKey) return
    e.preventDefault();
    let oldScale = scaleRatio.value;
    if (e.deltaY < 0 && scaleRatio.value < 2) {
        scaleRatio.value = Number((scaleRatio.value + 0.1).toFixed(1))
    }
    else if (e.deltaY > 0 && scaleRatio.value > 0.5) {
        scaleRatio.value = Number((scaleRatio.value - 0.1).toFixed(1))
    } else
        return;
    designer.value.style.scale = scaleRatio.value;
    keepCenter(scaleRatio.value, oldScale)
    //有效缩放后 显示当前倍率
    showScale.value = true;
    clearTimeout(timerOfScale)
    timerOfScale = setTimeout(() => {
        showScale.value = false
        timerOfScale = null;
    }, 1000)
}, { passive: false })
function keepCenter(newScale, oldScale = 1) {
    const width = designer.value.clientWidth;
    const height = designer.value.clientHeight;
    const { scrollX, scrollY } = window
    // console.log("移动: ", scrollX + width / 2 * (newScale - oldScale), scrollY + height / 2 * (newScale - oldScale))
    window.scrollTo(scrollX + width / 2 * (newScale - oldScale), scrollY + height / 2 * (newScale - oldScale))
}

</script>
 
<style scoped> .designer {
     width: v-bind("designerW + 'px'");
     height: v-bind('designerH + "px"');
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
     z-index: 999999999 !important;
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