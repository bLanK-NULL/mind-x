import { defineStore } from 'pinia'
import { ref, onMounted, h, computed, watch } from 'vue'
import { useThemeStore } from '@/store/theme'
const uuidv4 = require('uuid').v4;


// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useItemsStore = defineStore('items', () => {
    class DragItems {
        constructor(parent) {
            // 相对父节点的绝对定位的位置
            this.pos = {
                left: 0,
                top: 0,
            }
            this.rect = {
                width: ref(0),
                height: ref(0)
            }
            this.isMoving = ref(false)
            this.title = 'default'
            this.id = uuidv4()
            this.parent = parent || null //指向父亲地址
            this.children = []
            this.level = this.parent ? this.parent.level + 1 : 0 // level = praent.level +1
            this.node = null; //挂载的dragItem节点
            this.content = '';
        }
        //== 无用 ==
        move(event) {
            if (this.isMoving) {
                this.node && (this.node.style.cursor = 'grabbing')
                this.pos.left += event.movementX;
                this.pos.top += event.movementY;
            }
        }
        // 挂载到真实节点上的一系列操作
        mount(node) {
            this.node = node;
            this.rect.width = this.node.getBoundingClientRect().width;
            this.rect.height = this.node.getBoundingClientRect().height;
        }
        //更新节点width和height的数据
        updateRect() {
            if (this.node) {
                this.mount(this.node)
            }
        }
    }
    //所有顶层节点， 一般是一个顶级节点，（以后可能拓展游离节点）
    const topItems = ref([])
    //创建一个DragItem
    function createDragItem(parent) {
        //new 新DragItem, 修改父级的children， 和自己的parent 指向
        let newDragItem;
        if (parent) {
            newDragItem = new DragItems(parent)
            parent.children.push(newDragItem)

            //新节点相对于父节点的位置
            const themeStore = useThemeStore(); 

            watch(newDragItem.parent.rect.width, ()=> {
                newDragItem.pos.left = newDragItem.parent.rect.width.value + themeStore.themeConf.horizonGap
            })


        } else { //顶层节点
            newDragItem = new DragItems()
            topItems.value.push(newDragItem)
            //中心节点的样式--于视口居中

            newDragItem.pos.left = 10000
            newDragItem.pos.top = 10000
        }
        //渲染一次

        return newDragItem
    }

    return {
        topItems,
        createDragItem
    }

})
