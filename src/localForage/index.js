import localforage from 'localforage'
import { successMsg, errorMsg } from '@/hooks/Message/globalMessage'

function saveToLocalForage(key, value) {
    localforage.setItem(key, value).then(res => {
        successMsg('保存成功')
        console.log(res)
    }).catch(err => {
        errorMsg('保存失败')
        throw err
    })
}

async function getFromLocalForage(key) {

    return await localforage.getItem(key)
}

export { saveToLocalForage, getFromLocalForage }