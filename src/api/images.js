// 素材接口
import request from '@/utils/request.js'

const uploadingImg = data => {
  // 一般文件上传的接口都要求把请求头中的Content-Type设置为multipart/form-data 但是我们使用axios上传文件的话不需要手动设置，你只要给data一个FormData对象即可。 new FormData()
  return request.post('/mp/v1_0/user/images', data)
}

export { uploadingImg }
