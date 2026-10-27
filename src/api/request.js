// ====================================================================
// Axios 网络请求统一封装模块 (src/api/request.js)
// 实验五核心技术点：
// - 基于 Axios 创建单例客户端，统一配置后端基础 URL (127.0.0.1:3000/api)
// - 封装请求拦截器：自动注入 Authorization Bearer Token
// - 封装响应拦截器：统一解包后端 JSON 结构，统一捕获网络异常与错误提示
// - 增强容灾机制：在 GitHub Pages 纯静态公网环境与离线静默查询时，自动优雅降级，防止弹窗骚扰
// ====================================================================

import axios from 'axios'
import { ElMessage } from 'element-plus'

// 判断当前是否处于远程非本地环境 (如 GitHub Pages 公网部署)
const isRemoteStaticHost = typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 1. 若处于 GitHub Pages 静态站点，自动切换为静默拦截，避免产生 Mixed Content 阻断与红字报错
    if (isRemoteStaticHost && (config.baseURL?.includes('127.0.0.1') || config.baseURL?.includes('localhost'))) {
      config.silent = true
      const controller = new AbortController()
      config.signal = controller.signal
      controller.abort('GitHub Pages 静态环境自动启用内置持久化数据')
    }

    // 2. 注入登录认证凭证
    const token = localStorage.getItem('lume_auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 后端返回标准格式: { code: 200, message: '...', data: ... }
    if (res && (res.code === 200 || res.code === 201)) {
      return res.data
    }
    // 业务错误
    const msg = (res && res.message) || '请求失败'
    if (!response.config?.silent) {
      ElMessage.error(msg)
    }
    return Promise.reject(new Error(msg))
  },
  (error) => {
    const isSilent = error.config?.silent || isRemoteStaticHost || axios.isCancel(error)

    // 仅在非静默请求且处于本地环境时，向用户抛出醒目的错误通知
    if (!isSilent) {
      let msg = '后端服务连接异常 (请确保 3000 端口服务已启动)'
      if (error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message
      } else if (error.message && error.message !== 'Network Error') {
        msg = error.message
      }
      ElMessage.error(msg)
    } else {
      console.warn('[Lume Blog] 当前使用离线/本地存储模式:', error.message || '静默降级')
    }

    return Promise.reject(error)
  }
)

export default request
