<template>
  <div class="container">
    <div class="designer" ref="designer">
      <div class="selectMask" ref="selectMask" v-if="showSelectMask" :style="{
        width: maskRect.width + 'px',
        height: maskRect.height + 'px',
        left: maskRect.left - designer.getBoundingClientRect().x + 'px',
        top: maskRect.top - designer.getBoundingClientRect().y + 'px',
      }"></div>
      <DragItem :selectNum="selectNum" :maskRect="maskRect" :showSelectMask="showSelectMask" :itemData="topItem"
        :level=topItem.level v-for="topItem of itemsStore.topItems" :key="topItem.id" @selectOver="selectOver">
      </DragItem>
      <!-- 顶级节点的连出去的svg必须在这里划 -->
      <!-- <svg >
      <g>
        <line x1="0" y1="0" x2="60" y2="60" stroke="crimson" stroke-width="2" />
      </g>
    </svg> -->
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeMount, onMounted, reactive, ref } from 'vue';
import DragItem from './components/DragItem.vue';
import { useThemeStore } from '@/store/theme'
import { useItemsStore } from '@/store/index'
const themeStore = useThemeStore()
themeStore.setThemeConf() // 设置为默认主题 
const itemsStore = useItemsStore()

const node1 = itemsStore.createDragItem(null)
const node2 = itemsStore.createDragItem(node1)
const node3 = itemsStore.createDragItem(node2)
// const node3 = itemsStore.createDragItem(node2)
console.log(itemsStore.topItems);

onMounted(() => {
  nextTick(() => {
    window.scrollTo(10000 - 0.5 * window.innerWidth, 10000 - 0.5 * window.innerHeight)
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
function selectOver(dragItem) {

}

</script>
 
<style scoped> .designer {
   width: 20000px;
   height: 20000px;
   background: antiquewhite;
   position: relative;
 }

 svg {
   width: 100%;
   height: 100%;
 }

 .selectMask {
   box-sizing: border-box;
   border: 2px solid rgb(0, 60, 255);
   background-color: rgba(120, 213, 250, 0.3);
   position: absolute;
   z-index: 999999999 !important;
 }
</style>