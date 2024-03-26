import axios from "axios";
import { useItemsStore } from "@/store";
import { md5 } from 'js-md5'

const $http = axios.create({
    baseURL: 'http://127.0.0.1:3000',
})
//无需token的白名单
const whiteListApi = ['/login']
//防止伪造token
const secretId = 'bLanK_L'

$http.interceptors.request.use(config => {
    let token = localStorage.getItem('token');
    if (whiteListApi.indexOf(config.url) === -1 && token)
        config.headers.authorization = "Bearer " + token;
    config.headers.secret = md5(secretId);
    return config
});
$http.interceptors.response.use(response => {
    if (response.data && response.data.token)
        localStorage.setItem('token', response.data.token)
    if (response.data && response.data.username) {
        const { setUsername } = useItemsStore();
        setUsername(response.data.username);
    }
    return response
})

export default $http;
