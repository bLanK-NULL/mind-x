import { defineStore } from 'pinia'
import { ref, onMounted, reactive, toRaw } from 'vue'
import { successMsg, errorMsg } from '@/hooks/Message/globalMessage'
const uuidv4 = require('uuid').v4;
const lightTheme = require(`@/theme/default.js`)
const darkTheme = require(`@/theme/dark.js`)

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useItemsStore = defineStore('items', () => {
    const designerRect = {
        width: 20000,
        height: 20000,
    }
    //初始化当前视口的坐标
    const initialViewportPos = {
        x: designerRect.width / 2 - 0.5 * window.innerWidth,
        y: designerRect.height / 2 - 0.5 * window.innerHeight,
    }

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
            // this.level = this.parent ? this.parent.level + 1 : 0 // level = praent.level +1
            this.node = null; //挂载的dragItem节点
        }
        // 挂载到真实节点上的一系列操作
        mount(node) {
            // console.log('mounted',node)
            this.node = node;
            this.updateRect();
            //tab加的节点走不了App节点的onMounted， 只能走这样里的。
            // 初创时：自己其他兄弟节点不一定挂载了，所以这里是没用的。其实是靠下面的InitialPosition
            // 修改时： 只有这里起到作用
            // this.InitialPosition()
            //自己所有孩子都标准化位置。 这样下面就可以不要InitialPosition了
            // console.log('parent', this.parent.node)
            //有真实父dom节点的情况只能是后来tab添加的节点; 初始创建的（初始三个 || 本地读取）此时还拿不到真实dom节点
            // if (this.parent && this.parent.node) {
            //     this.parent.standardizeChildrenPos()
            // } else {
            //     if (!this.isLocal) // 不是从本地读取来的。
            //         this.standardizeChildrenPos()
            //     this.isLocal = false;
            // }
        }
        //更新节点width和height的数据
        updateRect() {
            // if (this.node) {
            //     this.mount(this.node)
            // }
            this.rect.width = this.node.clientWidth;
            this.rect.height = this.node.clientHeight;
        }
        //规范化所有子节点位置
        standardizeChildrenPos() {
            const len = this.children.length;
            this.children.forEach((child, idx) => {
                child.pos.top = (idx - (len - 1) / 2) * (child.rect.height + themeconf.value.verticalGap) - child.rect.height / 2 + this.rect.height / 2;
                child.pos.left = this.rect.width + themeconf.value.horizonGap;
            })
            if (!this.parent) { //如果本结点还是顶层节点
                const len = topItems.value.length
                //console.log(window.scrollX, window.scrollY) //0 0 
                if (len === 1) { //第一个顶层节点
                    this.pos.left = 9800;
                    this.pos.top = 9800;
                } else {
                    this.pos.left = topItems.value[len - 2].pos.left;
                    this.pos.top = topItems.value[len - 2].pos.top + topItems.value[len - 2].rect.height + themeconf.value.verticalGap;
                }
            }
        }
        //调整自己和兄弟节点
        InitialPosition() {
            if (this.parent) { // 有父节点- 调整父节点的所有子节点
                // console.log('initialPosition', this.level, this.parent.rect.height, this.rect.height);
                const len = this.parent.children.length
                this.parent.children.forEach((item, idx) => {
                    item.pos.top = (idx - (len - 1) / 2) * (item.rect.height + themeconf.value.verticalGap) - item.rect.height / 2 + item.parent.rect.height / 2
                })
                this.pos.left = this.parent.rect.width + themeconf.value.horizonGap
                // this.pos.top = (this.parent.rect.height - this.rect.height) / 2
            } else { // 新加的节点是根节点
                const len = topItems.value.length
                topItems.value.forEach((item, idx) => {
                    item.pos.top = (idx - (len - 1) / 2) * (item.rect.height + themeconf.value.verticalGap) - item.rect.height / 2 + 10000
                })
                this.pos.left = 9800
            }
            // 初始调用本方法时,parent.rect没数据
        }
        //删除当前节点 -- 子节点挂载到父节点上去
        del() {
            if (this.parent) {
                const idx = this.parent.children.findIndex(item => item === this)
                this.parent.children.splice(idx, 1, ...this.children)
                //保留原始位置
                this.children.forEach(child => {
                    child.pos.left += this.pos.left
                    child.pos.top += this.pos.top
                    child.parent = this.parent
                })
            } else {
                const idx = topItems.value.findIndex(item => item === this)
                topItems.value.splice(idx, 1)
            }
            this.node.remove();
            this.node = null;
        }
        /**
         * 导出----提取实例属性
         * isMoving parent children node 不导出
         *  */
        extractProperties() {
            return {
                pos: toRaw(this.pos),
                rect: toRaw(this.rect),
                title: this.title,
                id: this.id,
                // level: this.level,
                next: [],
                isLocal: true,
            }
        }
        /**
         * 导入 ---- 导入实例属性
         *  不导入next; children， parent 已经处理好
         * 
         */
        importProperties(ext) {
            this.pos = reactive(ext.pos)
            this.rect = reactive(ext.rect)
            this.title = ext.title
            this.id = ext.id
            // this.level = ext.level
            this.isLocal = ext.isLocal
        }
    }
    //所有顶层节点， 一般是一个顶级节点，（以后可能拓展游离节点）
    const topItems = ref([])
    //创建一个DragItem , options.tab==true 代表是tab创建（这种方式创建的在onMounted周期之后）
    function createDragItem(parent) {
        //new 新DragItem, 修改父级的children， 和自己的parent 指向
        let newDragItem;
        if (parent) {
            newDragItem = new DragItems(parent)
            parent.children.push(newDragItem)
            // onMounted(() => { //初始节点的初始位置
            //     // newDragItem.InitialPosition()
            // })

        } else { //顶层节点
            newDragItem = new DragItems()
            topItems.value.push(newDragItem)
        }

        return newDragItem
    }
    //当前主题
    const themeconf = ref(lightTheme)
    function setTheme(name) {
        if (name === 'dark')
            themeconf.value = darkTheme
        else
            themeconf.value = lightTheme
    }
    //缩放倍率
    const scaleRatio = ref(1)

    //导出所有节点的必要实例属性和全局配置
    function extractProject() {
        const extract = traverseTopItems(topItems.value)
        return JSON.stringify({
            extract,
            themeName: themeconf.value.name,
            scaleRatio: scaleRatio.value,
            viewportPos: {
                x: window.scrollX,
                y: window.scrollY
            }
        })
    }
    function traverseTopItems(items) {
        if (!items || items.length === 0)
            return [];
        const extract = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            // console.log(item.id.slice(0, 4))
            const extItemProp = item.extractProperties()
            extract.push(extItemProp)
            extItemProp.next = traverseTopItems(item.children)
        }
        return extract
    }

    // 导入本地保存的记录 -- return false 代表导入失败
    function importProject() {
        const project = JSON.parse(localStorage.getItem('mind-x'))
        if (project) {
            // 导入全局数据
            setTheme(project.themeName)
            scaleRatio.value = project.scaleRatio
            initialViewportPos.x = project.viewportPos.x
            initialViewportPos.y = project.viewportPos.y
            // 导入所有节点的数据
            topItems.value = traverseExtract(project.extract)
            if (topItems.value.length === 0)
                return false;
            successMsg('本地导入成功')
            return true;
        } else {
            errorMsg('无本地记录')
            return false;
        }
    }
    /** 
     * @returns extract数据下还原的topItems:  DragItems[]
     */
    function traverseExtract(extract, parentItem = null) {
        if (!extract || extract.length === 0)
            return [];
        const topItems = [];
        for (let i = 0; i < extract.length; i++) {
            let ext = extract[i];
            const dragItem = createDragItem(parentItem) // 处理好了 dragItem.parent
            const children = traverseExtract(ext.next, dragItem)
            dragItem.children = children; // 处理好了 dragItem.children
            topItems.push(dragItem);
            dragItem.importProperties(ext)
        }
        return topItems
    }


    //如果不导入，则自动初始化三个初始节点
    function initProject() {
        const isSuccess = importProject()
        if (!isSuccess) {
            console.log('自动初始化3个节点')
            const root = createDragItem(null)
            createDragItem(root)
            createDragItem(root)
            onMounted(() => {
                root.standardizeChildrenPos();
            })
        }
    }
    return {
        themeconf,
        setTheme,
        topItems,
        createDragItem,
        scaleRatio,
        extractProject,
        initProject,
        initialViewportPos,
        designerRect
    }

})
