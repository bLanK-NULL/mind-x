import $http from './conf.js'

function login(username, password) {
    return $http.post('/login', {
        username,
        password
    })
}

export {
    login
}