// 自定义文本框全选内容
export function customSelect(element) {
    if (document.selection) {
        var range = document.body.createTextRange()
        range.moveToElementText(element)
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange()
        range.selectNodeContents(element)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
    }
} 
