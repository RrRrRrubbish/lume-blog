import { defineStore } from 'pinia'
import defaultAvatar from '../assets/Ark1.jpg'

// ====================================================================
// 用户认证与博主档案 Store (userStore.js)
// 实验四核心技术点：
// - 使用 Pinia defineStore 定义集中式状态
// - state / getters / actions 分层组织
// - localStorage 手动持久化，确保页面刷新后登录状态与修改内容不丢失
// ====================================================================

const LOGIN_KEY = 'lume_is_logged_in'
const PROFILE_KEY = 'lume_profile'

// 博主默认初始资料
const defaultProfile = {
  name: '蓝健涛',
  studentId: '249980413',
  class: '24计科1班',
  role: '计算机科学与技术学子 · 前端开发者',
  major: '计算机科学与技术',
  avatar: defaultAvatar,
  bio: '热爱探索现代 Web 前端技术与单页面应用 (SPA) 架构。以 Lume Blog 为载体，系统实践 Vue 3 核心技术栈、Vue Router 路由工程化与 Pinia 全局状态管理。',
  detailedIntro: '目前大三在读，系统钻研了数据结构、计算机网络及 Vue 3 生态。在实验三与实验四中，深入掌握了路由工程化、Pinia 全局状态集中管理、状态持久化与路由前置守卫联动实战。',
  goals: '熟练掌握 Vue 3 全家桶（Router / Pinia）、深入组件化与工程化实战、打造高品质个人作品集',
  hobbies: '开源探索、算法刷题、科技数码、轻音乐',
  blogVision: '打造优雅、极简、高性能的现代前端个人技术花园',
  socialLinks: [
    { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
    { name: '技术笔记', icon: '📝', url: '#' },
    { name: '邮箱联系', icon: '📧', url: 'mailto:jiantao@example.com' }
  ]
}

// 尝试从 localStorage 读取已保存的个人档案，否则使用初始值
function loadProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // 若本地缓存仍是旧版根目录绝对路径或无效值，自动同步为 Vite 编译后的资源路径
      if (!parsed.avatar || parsed.avatar === '/Ark1.jpg' || parsed.avatar.startsWith('/Ark1') || parsed.avatar.endsWith('Ark1.jpg')) {
        parsed.avatar = defaultAvatar
      }
      return parsed
    }
    return { ...defaultProfile }
  } catch (e) {
    console.error('加载本地个人档案失败:', e)
    return { ...defaultProfile }
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    // 登录状态持久化
    isLoggedIn: localStorage.getItem(LOGIN_KEY) === 'true',
    // 个人档案数据持久化
    profile: loadProfile()
  }),

  getters: {
    // 鉴权判断 getter
    isAuthenticated: (state) => state.isLoggedIn,
    // 博主姓名 getter
    bloggerName: (state) => state.profile.name,
    // 角色身份 getter
    bloggerRole: (state) => state.profile.role
  },

  actions: {
    // 登录认证
    login(username, password) {
      if (username === 'lanjiantao' && password === '123456') {
        this.isLoggedIn = true
        localStorage.setItem(LOGIN_KEY, 'true')
        return { success: true }
      }
      return {
        success: false,
        message: '账号或密码错误（测试账号：lanjiantao，密码：123456）'
      }
    },

    // 登出处理
    logout() {
      this.isLoggedIn = false
      localStorage.removeItem(LOGIN_KEY)
    },

    // 更新个人档案
    updateProfile(newProfile) {
      Object.assign(this.profile, newProfile)
      this.persistProfile()
    },

    // 恢复默认档案
    resetProfile() {
      this.profile = { ...defaultProfile }
      this.persistProfile()
    },

    // 持久化档案至 localStorage
    persistProfile() {
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(this.profile))
      } catch (e) {
        console.error('持久化个人档案失败:', e)
      }
    }
  }
})
