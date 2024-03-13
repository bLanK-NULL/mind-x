import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image'

function exportNodeToPDF(node, scaleRatio = window.devicePixelRatio) {
    const options = {
        width: 2000,
        height: 1000,
        windowWidth: 2000,
        windowHeight: 1000,
        x: 9560,
        y: 9600,
        scale: scaleRatio
    }

    html2canvas(node, options).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        // 创建一个新的 a 元素
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'output.png'; // 设置下载的文件名
        // 触发点击事件
        link.click();
        console.log('success export to image')
    });
}


export {
    exportNodeToPDF,
}
