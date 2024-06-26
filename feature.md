# 部署
[Mind-X](http://1.94.9.34:3001/)

## 连线功能

- 计算出 item 中心位置,计算出删 svg 的起始位置和 line 的结束位置
  - 因为子项目可以移动,所以 svg 的起始位置可能不是父节点中心而是子节点中心
- 利用三次贝塞尔曲线优雅连线

## 编辑 title 功能

- contenteditable: false 的元素, 双击自动改成 true,并自动获取焦点(focus()无效 )
  1. 因为 false 改成 true 后,要 nextTick 可以再获取焦点
- tab 在浏览器的默认事件

## 拖拽item

- 不跟手
  - 因为注册了 item.onmouseleave 事件, 导致鼠标离开 item 时会 isMoving=false,停止移动
  - 删掉这一事件, 快速拖动过程不跟手,但是最终位置是不变的
- 全方位自由拖动，怎么处理连线？

## 删除

删除当前节点后，把子节点转移到父节点上，并保证子节点位置不变。

## 画布

### 拖动画布

- `window.scrollTo(window.scrollX - event.movementX / scale, window.scrollY - event.movementY/scale);`
  - 缩小时拖动,移动同样鼠标距离滚动条移动px要更多
- 

### 缩放

- 保证中心位置缩放后还在中心
  - 用scale控制designer缩放，里面所有内容都会缩放。他们的实际大小不会变比如width，margin，left, clientWidth。 但是会影响getBoundingClient().x  和 getBoundingClient().width; computedStyle 不会变
  - 把designer 的 transform-origin: 0 0;
  - 放大后原始中心位置会向右下角偏移， 再用window.scrollTo() 来把视口向右下角移动。这样就能保证中心位置缩放后还在中心。

> 遇到的问题：
>
> fixed定位的元素，如果其父元素带transform则不会再相对于视口，而是相对于其父元素

* 用到了防抖思想
  * 缩放时展示缩放倍率

### 框选

因为框选会受到scale莫名其妙的影响,选择起点就会很难,所以我想绕过scale的影响

1. 获取起点相对于文档的坐标 `e.pageX`,也就是相对于designer的坐标,但是文档是没有scale效果的
2. 通过 `left = e.pageX / scaleRatio` 得到了其应该在desginer元素上的绝对定位坐标

选中的item，可以一起拖拽， 删除，添加子节点。

### 背景

- 整体太大,不能直接创建
  - 只创建视口部分, 放大缩小根据缩放比例调整网格密度,依然消耗性能
- 利用 background-img 重复填充的特性

```html
<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
  <path d="M25 0 v50" stroke="black" stroke-opacity="0.1" stroke-dasharray="16,4" />
  <path d="M0 25 h50" stroke="black" stroke-opacity="0.1" stroke-dasharray="16,4" />
</svg>
```

## 滚动恢复

* window.scrollTo失效
  * 当我打开一个页面然后手动滚动到其他地方后，再刷新页面，此时页面会闪到scrollTo的位置，然后立刻闪回我上次手动滚动到的位置。

```js
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
} 
```

> history 也是浏览器全局属性

## 右键菜单-指令

* *为什么createApp时传入ref props 不会自动解包？？？*
* 全局指令必须在app.mount之前注册！
* 具有复用性

## 迭代递归

## 事件总线

采用 `发布-订阅者模式`， 在designer监听delete键盘事件，publish。每个DragItem都订阅delete事件。

> 原本采用在DragItem里每个都注册delete键盘事件，利用了闭包特性。但是这样导致tab后加入的节点delete事件注册晚，而事件处理谁先注册谁先处理。从而导致在同时删除它和它的父节点时先删除了父节点，把所有儿子节点移给了爷爷节点。儿子节点会销毁再重新生成，儿子节点的事件处理函数也随着组件再销毁重新生成。导致原本应该处理delete事件的处理函数失效，删不掉儿子节点。

## 保存

云端保存和离线保存

## 导出图片

1. puppeter （designer都画不清）
2. dom-to-image (不行)
3. rasterizeHTML
4. html2canvas
   1. 如果子项移动到父项的左或者上边，就会导致svg标签有一个绝对定位，而html2canvas导出时没考虑到这个，所以连线会正好差这个值。
   2. 所以我连线就用canvas画，虽然对于频繁修改的位置来说性能变差了，但是解决了上面的问题，因为html2canvas最终是把dom节点转成canvas，而对于canvas则保持原样。
   3. jsPDF修改不了宽高。

**自动裁剪**

## 保存 IndexedDb / localforage - 优化

1. 异步操作，性能好
2. 数据类型支持丰富，包含数组，对象，和二进制
3. 支持循环引用

但是对于我的数据结构，要处理

1. htmlElement 无法克隆，也无需克隆，需要排除
2. Proxy和RefImpl

原本使用localstorage存储，还需要使用 `JSON`编码和解码。



# 撤回/ 反撤回

1. 哪些操作可以撤回
   1. 添加节点
   2. 删除节点
   3. 编辑节点

维护一个栈

recode 函数 记录



withDraw撤回

unWithDraw反撤回


## 跨标签通信





## 感受

### 1. 前期打好架构真的很重要

比如吃亏在比如缩放功能，

前期直接利用ctrl+滚轮来缩放，还有再控制一下缩放中心始终以画面中心

然后因为 发现所有东西都被缩放了，所以又改用scale 来缩放designer

最后觉得早知道整个designer可以用svg来做，利用viewbox 来实现缩放

## 利用微队列 - 优化(废弃)

因为我页面中所有项都是由vue根据TopItems数组来生成的。所以当我刚刚调用createDragItem完还没有拿到dom节点。

紧接着我又要做一些操作要用到dom节点的宽高。所以我想到了用 `Promise.resolve().then() ` 其实用nextTick也是一样的

```js
    async function initProject() {
        const isSuccess = await importProject()
        console.log('isSuccess', isSuccess)
        if (!isSuccess) {
            console.log('自动初始化3个节点')
            const root = createDragItem(null)
            createDragItem(root)
            createDragItem(root)
            // onUpdated(() => {
            // root.standardizeChildrenPos();
            // })
            Promise.resolve().then(() => {
                root.standardizeChildrenPos();
            })
        }
    }
```
##
跨标签
Detail页改名或删除, 打开的designer 要改名或关闭
designer 新保存项目, Detail页要展示


## 优化
* nginx - gzip
* http缓存 (not yet begun)
* 路由懒加载
* 组件库部分映入, 依旧很大890KB,再splitChunks分包
* keep-alive detail页切换文件和社区时,不用再请求项目列表
* 事件委托 `event.composedPath()` 或 `pointerEvent` 
  * 返回一个数组, 依次是 
  * 指定元素是否可以是鼠标事件的target `div.style.pointerEvent = 'none'`;
    * 注意此属性会继承如果用来做事件委托,需要把子元素 修改回`auto`
* 防抖

