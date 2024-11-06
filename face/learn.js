// axios封装
//引入axios
// import axios from 'axios'
// //创建实例
// const api = axios.create({
//     //请求地址的公共部分
//     baseURL: '',
//     //请求的超时时间
//     timeout: 3000
// })
// //axios拦截器
// api.interceptors, request.use(config => {//config·请求的信息
//     return config
// },
//     err· => { Promise.reject(err) }) / 抛出错误

// api.interceptors.response.use(res => {
//     console.log(res)
//     return Promise.resolve(res)
// }, err => {
//     //抛出错误
//     Promise.reject(err)
// })
// export default api

// 调用axios文件
// import api from 'axios.js'
// export const login = () => api({
//     url: '',
//     method: 'get',
//     params: params
// })
// //使用
// import { login } from 'request.js'
// method: {
//     login().then(res => { console.log(res) })
// }