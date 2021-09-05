// 素材接口
import request from '@/utils/request.js'

// 上传图片
const uploadingImg = data => {
  // 一般文件上传的接口都要求把请求头中的Content-Type设置为multipart/form-data 但是我们使用axios上传文件的话不需要手动设置，你只要给data一个FormData对象即可。 new FormData()
  return request.post('/mp/v1_0/user/images', data)
}

// 获取用户图片素材
const getImg = params => {
  // 一般文件上传的接口都要求把请求头中的Content-Type设置为multipart/form-data 但是我们使用axios上传文件的话不需要手动设置，你只要给data一个FormData对象即可。 new FormData()
  return request.get('/mp/v1_0/user/images', { params })
}

// 取消收藏
const enshrineImg = (params, data) => {
  return request.put(`/mp/v1_0/user/images/${params}`, { collect: data })
}

// 删除图片素材
const deleteImg = params => {
  return request.delete(`/mp/v1_0/user/images/${params}`)
}

export { uploadingImg, getImg, enshrineImg, deleteImg }
