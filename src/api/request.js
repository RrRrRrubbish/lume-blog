// ====================================================================
// Axios 网络请求统一封装模块 (src/api/request.js)
// 实验五核心技术点：
// - 基于 Axios 创建单例客户端，统一配置后端基础 URL (127.0.0.1:3000/api)
// - 封装请求拦截器：自动注入 Authorization Bearer Token
// - 封装响应拦截器：统一解包后端 JSON 结构，统一捕获网络异常与错误提示
// ====================================================================

import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
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
    ElMessage.error(msg)
    return Promise.reject(new Error(msg))
  },
  (error) => {
    let msg = '网络连接异常，请确保后端服务 (3000端口) 已启动'
    if (error.response && error.response.data && error.response.data.message) {
      msg = error.response.data.message
    } else if (error.message) {
      msg = error.message
    }
    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

export default request
