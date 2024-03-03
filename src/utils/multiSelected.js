// import { useItemsStore } from '@/store/index'
// import { storeToRefs } from 'pinia';
// const ItemsStore = useItemsStore()
// const { topItems } = storeToRefs(ItemsStore)
// const vhead = {
//     children: [topItems.value]
// }
//维护一个 选中dragItem 的数组
const selectedItems = [];
function addSelectedItem(item) {
    if (item)
        selectedItems.push(item);
}
function removeItem(item) {
    selectedItems.splice(selectedItems.indexOf(item), 1);
}
// 处理多个节点被框选，一起移动node
//遍历root，从selectedItems中过滤出需要移动的顶层节点们。
function filteredNodes(root, selectedItems) {
    let nodeSet = new Set();
    dfs(root, selectedItems, nodeSet);
    return nodeSet;
}
function dfs(root, selectedItems, nodeSet) {
    if (!root) return;
    if (selectedItems.includes(root)) {
        nodeSet.add(root);
        return;
    }
    for (const child of root.children) {
        dfs(child, selectedItems, nodeSet);
    }
}
function selectedItemsMove(itemData, scaleRatio, topItems) {
    const vhead = {
        children: topItems.value
    }
    const filteredItems = filteredNodes(vhead, selectedItems)
    window.addEventListener('mousemove', handleMousemove)
    window.addEventListener('mouseup', handleMouseup)
    function handleMousemove(e) {
        if (!selectedItems.length) return;
        if (selectedItems.length === 1) { //单选
            selectedItems[0].pos.left += e.movementX / scaleRatio.value;
            selectedItems[0].pos.top += e.movementY / scaleRatio.value;
        } else {
            filteredItems.forEach(item => {
                item.pos.left += e.movementX / scaleRatio.value
                item.pos.top += e.movementY / scaleRatio.value
            })
        }
    }
    function handleMouseup(e) {
        itemData.isMoving = false;
        window.removeEventListener('mousemove', handleMousemove)
        window.removeEventListener('mouseup', handleMouseup)
    }
}


export {
    addSelectedItem,
    removeItem,
    selectedItemsMove
}