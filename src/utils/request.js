// 基于axios来封装请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
import { Message } from 'element-ui'
// 创建一个 axios 实例，说白了就是复制了一个 axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net', // 请求的基础路径
  // 超时时间 单位是ms，这里设置了3s的超时时间
  timeout: 3 * 1000,
  // 定义后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
  transformResponse: [
    function (data) {
      // Do whatever you want to transform the data
      // console.log(data)

      // 后端返回的数据可能不是 JSON 格式字符串
      // 如果不是的话，那么 JSONbig.parse 调用就会报错
      // 所以我们使用 try-catch 来捕获异常，处理异常的发生
      try {
        // 如果转换成功，则直接把结果返回
        return JSONbig.parse(data)
      } catch (err) {
        console.log('转换失败', err)
        // 如果转换失败了，则进入这里
        // 我们在这里把数据原封不动的直接返回给请求使用
        return data
      }

      // axios 默认在内部使用 JSON.parse 来转换处理原始数据
      // return JSON.parse(data)
    }
  ]
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

// 响应拦截器
request.interceptors.response.use(
  function (res) {
    return res
  },
  function (error) {
    // 对响应错误做点什么;没有权限401，去登录界面
    console.dir(error)
    if (error.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
      Message.error('登录状态无效，请重新登录')
    } else if (error.response.status === 403) {
      Message.error('没有操作权限')
    } else if (error.response.status === 400) {
      Message.error('参数错误')
    } else if (error.response.status === 507) {
      router.push('/login')
      Message.error('服务器数据库异常，请稍后重试')
    } else {
      Message.error('网络错误')
    }
    return error
  }
)
// 导出请求方法
export default request
