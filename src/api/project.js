// ====================================================================
// 项目资源 API 接口封装 (src/api/project.js)
// 实验五核心技术点：
// - 封装对 /api/projects 的 RESTful 请求 (GET/POST/PUT/DELETE)
// ====================================================================

import request from './request'

/**
 * 获取项目列表
 * @param {object} params { category, keyword, status }
 */
export function getProjects(params, options = {}) {
  return request({
    url: '/projects',
    method: 'get',
    params,
    ...options
  })
}

/**
 * 获取指定项目详情
 * @param {number|string} id 
 */
export function getProjectById(id) {
  return request({
    url: `/projects/${id}`,
    method: 'get'
  })
}

/**
 * 新增项目作品
 * @param {object} data 
 */
export function createProject(data) {
  return request({
    url: '/projects',
    method: 'post',
    data
  })
}

/**
 * 更新已有项目
 * @param {number|string} id 
 * @param {object} data 
 */
export function updateProject(id, data) {
  return request({
    url: `/projects/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除项目
 * @param {number|string} id 
 */
export function deleteProject(id) {
  return request({
    url: `/projects/${id}`,
    method: 'delete'
  })
}
