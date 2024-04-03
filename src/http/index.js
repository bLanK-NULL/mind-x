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

async function getAllProject() {
    try {
        const res = await $http.get('/getAllProject')
        return res.data;
    } catch (err) {
        console.error('请求 /getAllProject 失败', err)
        return [];
    }
}

async function getProjectByPname(pname) {
    try {
        const res = await $http.post('/getProjectByPname', {
            pname
        })
        return res.data
    } catch (err) {
        console.error('请求 /getProjectByPname 失败', err)
        return null;
    }
}
async function renameProject(oldPname, newPname) {
    return $http.post('/renameProject', {
        oldPname,
        newPname
    })
}
async function deleteProject(pname) {
    return $http.post('/deleteProject', {
        pname
    })
}
async function checkToken() {
    return $http.get('/checkToken');
}
export {
    login,
    uploadProject,
    getProjectFromServer,
    getAllProject,
    getProjectByPname,
    renameProject,
    deleteProject,
    checkToken
}