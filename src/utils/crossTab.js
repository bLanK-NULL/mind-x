// 跨标签通信
const channel = new BroadcastChannel('crossMsg');
function listenMsg(type, cb) {
    const listener = (e) => {
        // console.log(e.data, e.data.type)
        if (e.data.type === type)
            cb(e.data)
    }
    channel.addEventListener('message', listener)
    return () => {
        channel.removeEventListener('message', listener)
    }
}

function sendMsg(type, value) {
    channel.postMessage({
        type,
        value
    })
}


export {
    listenMsg,
    sendMsg,
}

