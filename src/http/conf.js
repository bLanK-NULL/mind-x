import axios from "axios";

const $http = axios.create({
    baseURL: 'http://127.0.0.1:3000',
})

$http.interceptors.request.use(config => {
    config.headers.authorization = "Bearer " + (localStorage.getItem('token') || '')
    return config
});
$http.interceptors.response.use(response => {
    if (response.data && response.data.token)
        localStorage.setItem('token', response.data.token)
    return response
})

export default $http;
