/**
 * 
 * @param {*} topItems 
 * @param {*} bounding 
 * @returns 无节点返回null,得到缩放倍率1的情况下的边界。
 */
let x1, x2, y1, y2;
function getBounding(topItems, fatherLeft, fatherTop) {
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
        x2 = Math.max(x2, curLeft + curItem.rect.width);
        y2 = Math.max(y2, curTop + curItem.rect.height);
        getBounding(curItem.children, curLeft, curTop)
    }
    const result = {x1,x2,y1,y2}
    Promise.resolve().then(() => {
        x1 = 0; x2 = 0; y1 = 0; y2 = 0;
    })
    return result;
}
export default getBounding;