function getBounding(topItems) {
    let x1, x2, y1, y2; //(x1,y1) 记录最左上角，(x2,y2)记录最右上角
    function traverse(topItems, fatherLeft, fatherTop) {
        if (topItems.length === 0)
            return null;
        for (let i = 0; i < topItems.length; i++) {
            const curItem = topItems[i];
            if (x1 === undefined) { //初始化
                x1 = curItem.pos.left
                y1 = curItem.pos.top
                x2 = curItem.pos.left + curItem.rect.width
                y2 = curItem.pos.top + curItem.rect.height
            }
            let curLeft = curItem.pos.left;
            let curTop = curItem.pos.top;
            if (curItem.parent) { //当前不是是顶级节点
                curLeft += fatherLeft;
                curTop += fatherTop;
            }
            x1 = Math.min(x1, curLeft);
            y1 = Math.min(y1, curTop);
            x2 = Math.max(x2, curLeft + curItem.rect.width + curItem.rect.width);
            y2 = Math.max(y2, curTop + curItem.rect.height + curItem.rect.height);
            traverse(curItem.children, curLeft, curTop)
        }
        const result = { x1, x2, y1, y2 }
        return result;
    }
    return traverse(topItems);
}
export default getBounding;