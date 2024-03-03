<template>
  <!-- 从某个顶层节点开始的树都在一个DragItem组件里递归 -->
  <div class="drag-item" ref="dragItem"
    :style="{ left: props.itemData.pos.left + 'px', top: props.itemData.pos.top + 'px' }">
    <div class="item" :class="{ 'selected-item': isSelectedItem }" :style="{
      cursor: props.itemData.isMoving ? 'grabbing' : 'default',
      'background-color': bgcStyle,
      'font-size': ftStyle,
      'color': ftColorStyle,
    }" @mousedown.capture="isSelectedItem=true" @mouseup="isSelectedItem=false" v-ctxmenu:[contextmenuListOnItem]>
      <div class="content" :contenteditable="contenteditable" @dblclick="handleEditTitle" @blur="afterHandleEditTitle"
        @keyup.enter.ctrl="contenteditable = false" v-html="props.itemData.title">
      </div>
    </div>
    <!-- 子节点 -->
    <div class="children">
      <DragItem :tabNum="tabNum" :itemData="topItem" :level="props.level + 1"
        v-for=" topItem  of  props.itemData.children " :key="topItem.id">
      </DragItem>
    </div>
    <!-- 起点节点保存连线 -->
    <div class="s-line" v-if="props.itemData.node && props.itemData.rect.width !== 0">
      <svg v-for=" topItem  of  props.itemData.children " :key="topItem.id" :style="{
      left: Math.min(topItem.pos.left, 0) + 'px', top: Math.min(topItem.pos.top, 0) + 'px',
      width: Math.max(props.itemData.rect.width, topItem.pos.left + topItem.rect.width) - Math.min(topItem.pos.left, 0) + 'px',
      height: Math.max(props.itemData.rect.height, topItem.pos.top + topItem.rect.height) - Math.min(topItem.pos.top, 0) + 'px'
    }
      ">
        <line :x1="props.itemData.rect.width / 2 - Math.min(topItem.pos.left, 0)"
          :y1="props.itemData.rect.height / 2 - Math.min(topItem.pos.top, 0)"
          :x2="topItem.pos.left + topItem.rect.width / 2 - Math.min(topItem.pos.left, 0)"
          :y2="topItem.pos.top + topItem.rect.height / 2 - Math.min(topItem.pos.top, 0)" stroke="crimson"
          stroke-width="2" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watchEffect, watch, onBeforeUpdate, toRef, inject, onBeforeMount, toRaw, onBeforeUnmount } from 'vue';
import { customSelect } from '@/utils/index.js'
import { useItemsStore } from '@/store/index'
import { storeToRefs } from 'pinia';
import eventBus from '@/utils/eventBus';
import { addSelectedItem, removeItem, selectedItemsMove } from '@/utils/multiSelected'
const itemsStore = useItemsStore()
const props = defineProps({
  itemData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  level: {
    type: Number,
    default: 0
  },
  tabNum: {
    type: Number,
    default: 0
  }
})
const contenteditable = ref(false)
const dragItem = ref(null)
const { themeconf, scaleRatio, topItems } = storeToRefs(itemsStore)
/**
 * 处理不同主题的样式
 */
let level = props.level
const { handleStyle } = require('@/utils/handleStyle')
const bgcStyle = computed(handleStyle(themeconf, level, 'backgroundColor'))
const ftStyle = computed(handleStyle(themeconf, level, 'fontSize'))
const ftColorStyle = computed(handleStyle(themeconf, level, 'color'))
const isSelectedItem = ref(false)
/**
 * 绑定node
 */
onMounted(() => props.itemData.mount(dragItem.value))

/**
 * 移动item 的逻辑
 */
onMounted(() => {
  //给dragItem 下的item 绑定事件，  因为dragItem里有svg线段和子节点,不能在其上注册事件
  dragItem.value.firstElementChild.addEventListener('mousedown', handleMousedown, false)
})
const handleMousedown = function (e) {
  e.stopPropagation()
  props.itemData.isMoving = true;
  // window.addEventListener('mousemove', handleMouseMove, false)
  // window.addEventListener('mouseup', handleMouseUp, false)
  selectedItemsMove(props.itemData, scaleRatio, topItems)
}
// const handleMouseMove = function (e) {
//   if (props.itemData.isMoving) {
//     console.log('ismoving: ', props.level)
//     props.itemData.pos.left += e.movementX / scaleRatio.value
//     props.itemData.pos.top += e.movementY / scaleRatio.value
//   }
// }
// const handleMouseUp = function (e) {
//   props.itemData.isMoving = false;
//   window.removeEventListener('mousemove', handleMouseMove, false)
//   window.removeEventListener('mouseup', handleMouseUp, false)
// }
//维护 selectedItems表 在multiSelectedMove.js 中
watch(isSelectedItem, (newVal) => {
  if (newVal) {
    // console.log('add', props.itemData)
    addSelectedItem(props.itemData)
  } else {
    removeItem(props.itemData)
  }
})

/**
 * dblclick事件 修改title 的函数
 */
async function handleEditTitle(e) {
  const el = e.currentTarget;
  if (!contenteditable.value) {
    contenteditable.value = true;
    isSelectedItem.value = true
    await nextTick()
    //聚焦
    el.focus()
    //选中所有 & 可能用户会修改内容
    customSelect(el)
  }
}
// blur和keyup.enter.ctrl 修改结束 的函数
function afterHandleEditTitle(e) {
  props.itemData.title = e.currentTarget.innerHTML
  contenteditable.value = false
  props.itemData.updateRect()
}


/**
 * 选择item (点击, 框选?)
 */
// function handleClickItem() {
//   isSelectedItem.value = !isSelectedItem.value
// }
//框选
const maskRect = inject('maskRect')
eventBus.subscribe('multiSelected', () => {
  const dragItemRect = {
    width: props.itemData.node.getBoundingClientRect().width,
    height: props.itemData.node.getBoundingClientRect().height,
    centerY: props.itemData.node.getBoundingClientRect().y + props.itemData.node.getBoundingClientRect().height / 2,
    centerX: props.itemData.node.getBoundingClientRect().x + props.itemData.node.getBoundingClientRect().width / 2,
  }
  if ((maskRect.height > dragItemRect.height / 2 && maskRect.top < dragItemRect.centerY && maskRect.top + maskRect.height > dragItemRect.centerY)
    && (maskRect.width > dragItemRect.width / 2 && maskRect.left < dragItemRect.centerX && maskRect.left + maskRect.width > dragItemRect.centerX)) {
    isSelectedItem.value = !isSelectedItem.value
  }
})

//处理tab -- isSelectedItem增加子节点
watch(() => props.tabNum, () => {
  if (isSelectedItem.value) {
    const newDragItem = itemsStore.createDragItem(props.itemData)
    isSelectedItem.value = false
    //初始化位置---默认在上一个兄弟的正下方。
    const lastSibling = props.itemData.children[props.itemData.children.length - 2];
    if (lastSibling) {
      newDragItem.pos.left = lastSibling.pos.left
      newDragItem.pos.top = lastSibling.pos.top + lastSibling.rect.height + themeconf.value.verticalGap
    } else { // 没有兄弟，就对其父节点
      newDragItem.pos.left = props.itemData.rect.width + themeconf.value.horizonGap;
      newDragItem.pos.top = - newDragItem.rect.height / 2 + newDragItem.rect.height / 2;
    }
  }
})

/**
 * del键删除节点
 */
eventBus.subscribe('delete', () => {
  if (isSelectedItem.value && dragItem.value) {
    isSelectedItem.value = false;
    props.itemData.del();
  }
}, props.level)

/**
 * 右键菜单 在item上触发时
 */
const contextmenuListOnItem = [{
  title: '编辑',
  fn: () => console.log('编辑')
}, {
  title: '删除',
  fn: null
}, {
  title: '复制',
  fn: null
}]
</script>

<style scoped>
.drag-item {
  /* z-index: 9; */
  display: inline-block;
  position: absolute;
}

.drag-item>.item {
  box-sizing: border-box;
  /* 带定min-width */
  min-width: 78px;
  width: fit-content;
  border-radius: 4px;
  overflow: hidden;
  padding: 18px 12px;
}

.drag-item>.item:hover {
  box-shadow: 0px 0px 2px 3px rgba(50, 50, 50, 0.2);
}

.selected-item {
  /*border: 3px solid black;*/
  box-shadow: 0px 0px 3px 2px rgb(4, 229, 49) !important;
}

.drag-item>.item>.content {
  user-select: none;
  min-height: 20.8px;
  min-width: 10px;
}

.item>.content[contenteditable="true"]:focus {
  outline: none;
}

.drag-item svg {
  position: absolute;
  z-index: -9;

}
</style>