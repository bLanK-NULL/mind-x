import { defineStore } from 'pinia'
import { ref, onMounted, h, computed, watch, onBeforeUpdate, reactive, toRef } from 'vue'
const uuidv4 = require('uuid').v4;


// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useItemsStore = defineStore('items', () => {
    class DragItems {
        constructor(parent) {
            // 相对父节点的绝对定位的位置
            this.pos = reactive({
                left: 0,
                top: 0,
            })
            this.rect = reactive({
                width: 0,
                height: 0
            })
            this.isMoving = ref(false)
            this.title = 'default'
            this.id = uuidv4()
            this.parent = parent || null //指向父亲地址
            this.children = []
            this.level = this.parent ? this.parent.level + 1 : 0 // level = praent.level +1
            this.node = null; //挂载的dragItem节点
        }
        // 挂载到真实节点上的一系列操作
        mount(node) {
            // console.log('mount  this.node', this.node);
            this.node = node;
            this.rect.width = node.getBoundingClientRect().width;
            this.rect.height = node.getBoundingClientRect().height;
            this.InitialPosition() //tab加的节点走不了App节点的onMounted
        }
        //更新节点width和height的数据
        updateRect() {
            if (this.node) {
                this.mount(this.node)
            }
        }
        //创建一个节点时，初始位置
        InitialPosition() {
            if (this.parent) {
                // console.log('initialPosition', this.level, this.parent.rect.height, this.rect.height);
                const len = this.parent.children.length
                this.parent.children.forEach((item, idx) => {
                    item.pos.top = (idx - (len - 1) / 2) * (item.rect.height + getThemeConf().verticalGap) - item.rect.height / 2 + item.parent.rect.height / 2
                })
                this.pos.left = this.parent.rect.width + getThemeConf().horizonGap
                // this.pos.top = (this.parent.rect.height - this.rect.height) / 2
            } else { // 新加的节点是根节点
                const len = topItems.value.length
                topItems.value.forEach((item, idx) => {
                    item.pos.top = (idx - (len - 1) / 2) * (item.rect.height + getThemeConf().verticalGap) - item.rect.height / 2 + 10000
                })
                this.pos.left = 9800
            }
            // 初始调用本方法时,parent.rect没数据
        }
        // 新节点创建时，被挤开
        squeezeOut(left, top) {
            this.pos.left += left;
            this.pos.top += top;
        }
        //删除当前节点
        del() {
            if(this.parent) {
                const idx = this.parent.children.findIndex(item => item === this)
                this.parent.children.splice(idx, 1)
            }else {
                const idx = topItems.value.findIndex(item => item === this)
                topItems.value.splice(idx, 1)
            }
            //调整剩余节点位置
            this.InitialPosition()
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
            onMounted(() => { //初始节点的初始位置
                newDragItem.InitialPosition()
            })

        } else { //顶层节点
            newDragItem = new DragItems()
            topItems.value.push(newDragItem)
        }

        return newDragItem
    }
    const themename = ref('default')
    function getThemeConf() {
        const theme = require(`@/theme/${themename.value}.js`)
        return theme

    }
    return {
        themename,
        getThemeConf,
        topItems,
        createDragItem
    }

})
