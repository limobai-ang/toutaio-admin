// 文章相关的接口调用
import request from '@/utils/request.js'

// 获取文章频道
const getChannels = () => {
  return request.get('/mp/v1_0/channels')
}

// 获取文章列表
const getArticles = params => {
  return request.get('/mp/v1_0/articles', { params })
}

// 删除文章
const removeArticle = params => {
  return request.delete(`/mp/v1_0/articles/${params}`)
}

// 发布文章
const addArticle = (data, params) => {
  console.log(data, params)
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft: params // 是否存为草稿（true 为草稿）
    },
    data
  })
}

// 查询文章
const inquireArticle = params => {
  return request.get(`/mp/v1_0/articles/${params}`)
}

// 修改文章
const editArticle = (data, params) => {
  return request.put(`/mp/v1_0/articles/${params}`, data)
}

// 导出
export {
  getChannels,
  getArticles,
  removeArticle,
  addArticle,
  inquireArticle,
  editArticle
}
