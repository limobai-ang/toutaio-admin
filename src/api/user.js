// 用户相关的接口调用

import request from '@/utils/request.js'

// 登录功能
const userLogin = data => {
  return request.post('/mp/v1_0/authorizations', data)
}

// 获取用户资料
const getUserInfo = () => {
  return request.get('/mp/v1_0/user/profile')
}

// 编辑用户资料
const editUserInfo = data => {
  return request.patch('/mp/v1_0/user/profile', data)
}

// 导出
export { userLogin, getUserInfo, editUserInfo }
