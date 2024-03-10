import $http from './conf.js'

function login(username, password) {
    return $http.post('/login', {
        username,
        password
    })
}
async function uploadProject(pname, data) {
    try {
        const res = await $http.post('/uploadProject', {
            pname,
            data,
            stamp: +new Date()
        })
        return res.data
    } catch (err) {
        console.error('请求 /uploadProject 失败', err)
        return null;
    }
}
async function getProjectFromServer(pname, stamp = 0) {
    try {
        const res = await $http.post('/getProjectFromServer', {
            pname,
            stamp
        })
        return res.data;
    } catch (err) {
        console.error('请求 /getProjectFromServer 失败', err)
        return null;
    }

}
export {
    login,
    uploadProject,
    getProjectFromServer
}