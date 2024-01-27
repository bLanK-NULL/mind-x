<template>
  <!-- 从某个顶层节点开始的树都在一个DragItem组件里递归 -->
  <div class="drag-item" ref="dragItem"
    :style="{ left: props.itemData.pos.left + 'px', top: props.itemData.pos.top + 'px' }">
    <div class="item" :class="{ 'selected-item': isSelectedItem }"
      :style="{ cursor: props.itemData.isMoving ? 'grabbing' : 'grab' }" @click="handleClickItem">
      <div class="content" :contenteditable="contenteditable" @dblclick="handleEditTitle" @blur="afterHandleEditTitle"
        @keyup.enter.ctrl="contenteditable = false" v-html="props.itemData.title">
      </div>
    </div>
    <!-- 子节点 -->
    <div class="children">
      <DragItem :selectNum="selectNum" :maskRect="maskRect" :showSelectMask="showSelectMask" :itemData="topItem"
        :level="topItem.level" v-for="topItem of props.itemData.children" :key="topItem.id">
      </DragItem>
    </div>
    <!-- 起点节点保存连线 -->
    <div class="s-line" v-if="props.itemData.node">
      <svg v-for="topItem of props.itemData.children" :key="topItem.id" :style="{
        left: Math.min(topItem.pos.left, 0) + 'px', top: Math.min(topItem.pos.top, 0) + 'px',
        width: Math.max(props.itemData.rect.width, topItem.pos.left + topItem.rect.width) - Math.min(topItem.pos.left, 0) + 'px',
        height: Math.max(props.itemData.rect.height, topItem.pos.top + topItem.rect.height) - Math.min(topItem.pos.top, 0) + 'px'
      }">
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
import DragItem from '@/components/DragItem.vue'
import { computed, nextTick, onMounted, reactive, ref, watchEffect, watch } from 'vue';
import { customSelect } from '@/utils/index.js'
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
  maskRect: {
    type: Object
  },
  showSelectMask: {
    type: Boolean
  },
  selectNum: {
    type: Number,
    default: 0
  }
})
const contenteditable = ref(false)
const dragItem = ref(null)

//先触发里层的也就是最里层的
onMounted(() => {
  //绑定node
  props.itemData.mount(dragItem.value)

  //移动逻辑 
  let x, y, domX, domY;
  const handleMousedown = function (e) {
    x = e.clientX;
    y = e.clientY;
    domX = props.itemData.pos.left;
    domY = props.itemData.pos.top;
    e.stopPropagation()
    props.itemData.isMoving = true;
    document.addEventListener('mousemove', handleMouseMove, false)
    this.addEventListener('mouseup', handleMouseUp, false)
  }
  const handleMouseMove = function (e) {
    if (props.itemData.isMoving) {
      props.itemData.pos.left = domX + e.clientX - x
      props.itemData.pos.top = domY + e.clientY - y
    }
  }
  const handleMouseUp = function (e) {
    props.itemData.isMoving = false
  }
  //给dragItem 下的item 绑定事件， 但是移动的是整个dragItem
  props.itemData.node.firstElementChild.addEventListener('mousedown', handleMousedown, false)

})

/**
 * dblclick事件 修改title 的函数
 */
async function handleEditTitle(e) {
  const el = e.currentTarget;
  if (!contenteditable.value) {
    contenteditable.value = true;
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
  props.itemData.updateRect()
}


/**
 * 选择item (点击, 框选?)
 */
const isSelectedItem = ref(false)
function handleClickItem() {
  isSelectedItem.value = !isSelectedItem.value
}
//框选
onMounted(() => {
  //被框中的条件
  watch(() => props.selectNum, () => {
    // console.log(props.maskRect.width)
    const dragItemRect = {
      width: props.itemData.node.getBoundingClientRect().width,
      height: props.itemData.node.getBoundingClientRect().height,
      centerY: props.itemData.node.getBoundingClientRect().y + props.itemData.node.getBoundingClientRect().height / 2,
      centerX: props.itemData.node.getBoundingClientRect().x + props.itemData.node.getBoundingClientRect().width / 2,
    }
    if ((props.maskRect.height > dragItemRect.height / 2 && props.maskRect.top < dragItemRect.centerY && props.maskRect.top + props.maskRect.height > dragItemRect.centerY)
      && (props.maskRect.width > dragItemRect.width / 2 && props.maskRect.left < dragItemRect.centerX && props.maskRect.left + props.maskRect.width > dragItemRect.centerX)) {
      isSelectedItem.value = !isSelectedItem.value
    }

  })
})
</script>

<style  scoped>
.drag-item {
  z-index: 9;
  display: inline-block;
  position: absolute;
}

.drag-item>.item {
  box-sizing: border-box;
  /* 带定min-width */
  min-width: 78px;
  width: fit-content;
  background-color: rgb(3, 134, 249);
  border-radius: 4px;
  overflow: hidden;
  padding: 18px 12px;
}

.drag-item>.item:hover {
  box-shadow: 0px 0px 2px 3px rgba(50, 50, 50, 0.2);
}

.selected-item {
  border: 3px solid black;
}

.drag-item>.item>.content {
  user-select: none;
  min-height: 20.8px;
  min-width: 10px;
}

.drag-item svg {
  position: absolute;
  z-index: -9;

}
</style>