// 基于axios来封装请求模块
import axios from 'axios'

// 创建一个 axios 实例，说白了就是复制了一个 axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net', // 请求的基础路径
  // 超时时间 单位是ms，这里设置了3s的超时时间
  timeout: 3 * 1000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
    // config.data = JSON.stringify(config.data) // 数据转化,也可以使用qs转换
    // config.headers = {
    //   'Content-Type': 'application/x-www-form-urlencoded' // 配置请求头
    // }
    // 注意使用token的时候需要引入cookie方法或者用本地localStorage等方法，推荐js-cookie
    const token = 'Bearer ' + localStorage.getItem('token') // 这里取token之前，你肯定需要先拿到token,存一下
    if (token) {
      // config.params = { token: token } // 如果要求携带在参数中
      config.headers.Authorization = token // 如果要求携带在请求头中
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// 导出请求方法
export default request
