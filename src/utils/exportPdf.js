import html2canvas from 'html2canvas';
import getBounding from '@/utils/getBounding'
import { nextTick } from 'vue';
import { useItemsStore } from '@/store/index'
import { storeToRefs } from 'pinia';

async function exportToPNG(node, filename = 'output',) {
    const itemsStore = useItemsStore()
    const { topItems, scaleRatio } = storeToRefs(itemsStore)
    const bounding = getBounding(topItems.value)
    const edge = 40; //四周留白40px
    const options = {
        width: (bounding.x2 - bounding.x1 + edge * 2),
        height: (bounding.y2 - bounding.y1 + edge * 2),
        x: (bounding.x1 - edge),
        y: (bounding.y1 - edge),
        scale: 1
    }
    const oldscale = scaleRatio.value
    scaleRatio.value = 1
    const { scrollX, scrollY } = window
    await nextTick();
    html2canvas(node, options).then(canvas => {
        scaleRatio.value = oldscale; //复原
        nextTick(() => window.scrollTo(scrollX, scrollY))
        const imgData = canvas.toDataURL('image/png');
        // 创建一个新的 a 元素
        const link = document.createElement('a');
        link.href = imgData;
        link.download = filename + '.png'; // 设置下载的文件名
        // 触发点击事件
        link.click();

    });
}

async function getCoverPNG(node, filename = 'cover') {
    const itemsStore = useItemsStore()
    const { topItems, scaleRatio } = storeToRefs(itemsStore)
    const bounding = getBounding(topItems.value)
    const edge = 20; //四周留白40px
    const cardWH = 210; //detail的卡片的宽高 ~ px。
    let width = (bounding.x2 - bounding.x1 + edge * 2)
    let height = (bounding.y2 - bounding.y1 + edge * 2)
    const options = {
        width: width,
        height: height,
        x: (bounding.x1 * scaleRatio.value - edge),
        y: (bounding.y1 * scaleRatio.value - edge),
        scale: 1
    }




    // const oldscale = scaleRatio.value
    // scaleRatio.value = 1
    await nextTick();
    html2canvas(node, options).then(canvas => {
        // scaleRatio.value = oldscale; //复原
        // const { scrollX, scrollY } = window
        // nextTick(() => window.scrollTo(scrollX, scrollY))
        const imgData = canvas.toDataURL('image/png');
        // 创建一个新的 a 元素
        const link = document.createElement('a');
        link.href = imgData;
        link.download = filename + '.png'; // 设置下载的文件名
        // 触发点击事件
        link.click();
    });
}

export {
    exportToPNG,
    getCoverPNG
}
