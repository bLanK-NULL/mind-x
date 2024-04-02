import localforage from 'localforage'
import { successMsg, errorMsg } from '@/hooks/Message/globalMessage'

function saveToLocalForage(key, value) {
    localforage.setItem(key, value).then(res => {
        successMsg('本地保存成功')
        // console.log(res)
    }).catch(err => {
        errorMsg('本地保存失败')
        throw err
    })
}

async function getFromLocalForage(key) {

    return await localforage.getItem(key)
}
async function deleteFromLocalForage(key) {
    return localforage.removeItem(key)
}

export {
    saveToLocalForage,
    getFromLocalForage,
    deleteFromLocalForage
}