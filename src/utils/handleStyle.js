/**
 * 处理超出边界的属性 例如属性只有maxDep层,但是当前level超过maxDep
 * @param {RefImpl} themeconf themeconf
 * @param {number} level props.itemData.level
 * @param {string} cssproperty css属性名
 */
let handleStyle = (themeconf, level, cssproperty) => {
    return () => {
        if (!themeconf.value)
            return false;
        if (themeconf.value[level])
            return themeconf.value[level][cssproperty]
        else return themeconf.value[themeconf.value.maxDep][cssproperty]
    }
}

module.exports = {
    handleStyle
}