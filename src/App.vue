<template>
  <div class="container">
    <div class="designer">
      <DragItem :itemData="topItem" :level=topItem.level v-for="topItem of itemsStore.topItems" :key="topItem.id"></DragItem>
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
import { nextTick } from 'vue';
import DragItem from './components/DragItem.vue';
import { useItemsStore } from '@/store/index'
const itemsStore = useItemsStore()

const node1 = itemsStore.createDragItem(null)
const node2 = itemsStore.createDragItem(node1)
nextTick()
node1.pos.left = 100
node1.pos.top = 100
node2.pos.left = 100
node2.pos.top = 100
const node3 = itemsStore.createDragItem(node2)
node3.pos.left = 80
node3.pos.top = 80
const node4 = itemsStore.createDragItem(node2)
node4.pos.left = 80
node4.pos.top = 20
console.log(itemsStore.topItems);
</script>
 
<style scoped>
* {
  margin: 0;
  padding: 0;
}

.designer {
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