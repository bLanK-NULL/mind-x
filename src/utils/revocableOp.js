import { successMsg, errorMsg } from "@/hooks/Message/globalMessage";
import { nextTick } from "vue";
//操作栈
class Stack {
    constructor() {
        this._stack = [];
        this._p = 0; //当前指针，指向撤回地址。
    }
    record(type, wrapObj) {
        this._stack[this._p] = { type, ...wrapObj };
        // console.log('入栈', { type, ...wrapObj })
        this._p++;
        //每次记录到了，就把后续可能存在的withdrawobj删掉。
        this._stack.length = this._p;
    }
    withdraw() {
        if (this._p <= 0)
            return false;
        this._p--;
        return this._stack[this._p];
    }
    unwithdraw() {
        if (this._p >= this._stack.length)
            return false;
        return this._stack[this._p++]
    }
    clear() {
        this._stack.length = 0;
        this._p = 0;
    }
}
const stack = new Stack()
function clearRecode() {
    stack.clear();
}

function withdrawTab({ itemData }) {
    const myIdx = itemData.parent.children.indexOf(itemData)
    if (myIdx !== -1) {
        itemData.parent.children.splice(myIdx, 1);// 从父节点的children 卸载。
        return true;
    }
    return false;
}
function withdrawEdit(withdrawObj) {
    const { itemData, oldTitle } = withdrawObj
    const el = itemData.node.querySelector('.content');
    if (el) {
        withdrawObj.newTitle = itemData.title;
        itemData.title = oldTitle
        el.innerTHML = oldTitle
        nextTick(() => itemData.updateRect())
        return true;
    }
    return false;
}
function withdrawDelete({ itemData, father, start, length }) {
    const children = father.children.splice(start, length, itemData);
    itemData.children = children;
    children.forEach(child => { //复原位置。
        child.pos.left -= itemData.pos.left
        child.pos.top -= itemData.pos.top
        child.parent = itemData;
    })
    return true;
}
function withdraw() {
    const withdrawObj = stack.withdraw()
    if (!withdrawObj) return;
    const { type, itemData } = withdrawObj;
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
        successMsg('撤回')
    else errorMsg('撤回-失败')
}
function record(type, wrapObj) {
    stack.record(type, wrapObj)
}
function unwithdraw() {
    const withdrawObj = stack.unwithdraw();
    if (!withdrawObj) return;
    const { type } = withdrawObj;
    let result;
    if (type === 'tab') {
        result = unwithdrawTab(withdrawObj)
    } else if (type === 'edit') {
        result = unwithdrawEdit(withdrawObj)
    } else if (type === 'del') {
        result = unwithdrawDel(withdrawObj)
    } else {
        throw Error('反撤回异常')
    }
    if (result)
        successMsg('反撤回')
    else errorMsg('反撤回-失败')
}
function unwithdrawTab({ itemData }) {
    return itemData.parent.children.push(itemData)
}
function unwithdrawEdit({ itemData, newTitle }) {
    const el = itemData.node.querySelector('.content');
    if (el) {
        itemData.title = newTitle
        el.innerTHML = newTitle
        nextTick(() => itemData.updateRect())
        return true;
    }
    return false;
}
function unwithdrawDel({ itemData, father, start, length }) {
    return itemData.del(false)
}
export {
    unwithdraw,
    withdraw,
    record,
    clearRecode,
}