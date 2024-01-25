<template>
  <div class="container">
    <div class="designer">
      <DragItem :itemData="topItem" :level=topItem.level v-for="topItem of itemsStore.topItems" :key="topItem.id">
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
import { nextTick, onBeforeMount, onMounted } from 'vue';
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
</style>