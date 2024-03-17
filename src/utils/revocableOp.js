import { successMsg, errorMsg } from "@/hooks/Message/globalMessage";
//操作栈
class Stack {
    constructor() {
        this._stack = [];
        this._p = 0; //当前指针，指向撤回地址。
    }
    record(type, wrapObj) {
        this._stack[this._p] = { type, ...wrapObj };
        console.log('入栈', { type, ...wrapObj })
        this._p++;
    }
    pop() {
        if (this._p <= 0)
            return false;
        this._p--;
        return this._stack[this._p];
    }

}
const stack = new Stack()

//撤回tab
function withdrawTab({ itemData }) {
    // 直接在this.parent.children.pop(); 
    const myIdx = itemData.parent.children.indexOf(itemData)
    if (myIdx !== -1) {
        itemData.parent.children.splice(myIdx, 1);// 从父节点的children 卸载。
        return true;
    }
    return false;
}

function withdrawEdit({ itemData, oldTitle, el }) {
    if (el) {
        itemData.title = oldTitle
        el.innerTHML = oldTitle
        return true;
    }
    return false;
}
function withdrawDelete({ itemData, father, start, length }) {
    const children = father.children.splice(start, length, itemData);
    itemData.children = children;
    children.forEach(child=> { //复原位置。
        child.pos.left -= itemData.pos.left
        child.pos.top -= itemData.pos.top
        child.parent = itemData;
    })
    return true;
}


function withdraw() {
    const withdrawObj = stack.pop()
    if (!withdrawObj) return;
    const { type } = withdrawObj;
    let result = false;
    if (type === 'tab') { //撤回-增加操作
        result = withdrawTab(withdrawObj)
    } else if (type === 'edit') {
        result = withdrawEdit(withdrawObj)
    } else if (type === 'del') {
        result = withdrawDelete(withdrawObj)
    } else {
        throw Error('撤回异常')
    }
    if (result)
        successMsg('撤回成功')
    else errorMsg('撤回失败')
}
function record(type, itemData) {
    stack.record(type, itemData)
}

export {
    withdraw,
    record
}