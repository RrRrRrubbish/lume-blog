// ====================================================================
// 系统认证与数据导出 API (src/api/auth.js & src/api/export.js)
// 实验五拓展要求与认证接口封装
// ====================================================================

import request from './request'

/**
 * 用户登录
 */
export function login(username, password) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: { username, password }
  })
}

/**
 * 导出全站数据
 */
export function exportAllData() {
  return request({
    url: '/export',
    method: 'get'
  })
}
