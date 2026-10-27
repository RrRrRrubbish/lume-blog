// ====================================================================
// 文章资源 API 接口封装 (src/api/article.js)
// 实验五核心技术点：
// - 封装对 /api/articles 的 RESTful 请求 (GET/POST/PUT/DELETE)
// ====================================================================

import request from './request'

/**
 * 获取文章列表
 * @param {object} params { category, status, keyword }
 */
export function getArticles(params, options = {}) {
  return request({
    url: '/articles',
    method: 'get',
    params,
    ...options
  })
}

/**
 * 获取文章详情
 * @param {number|string} id 
 */
export function getArticleById(id) {
  return request({
    url: `/articles/${id}`,
    method: 'get'
  })
}

/**
 * 新增文章
 * @param {object} data 
 */
export function createArticle(data) {
  return request({
    url: '/articles',
    method: 'post',
    data
  })
}

/**
 * 更新文章
 * @param {number|string} id 
 * @param {object} data 
 */
export function updateArticle(id, data) {
  return request({
    url: `/articles/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除文章
 * @param {number|string} id 
 */
export function deleteArticle(id) {
  return request({
    url: `/articles/${id}`,
    method: 'delete'
  })
}
