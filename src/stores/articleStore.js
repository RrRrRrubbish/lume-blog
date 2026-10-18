import { defineStore } from 'pinia'

// ====================================================================
// 文章管理 Store (articleStore.js)
// 实验四核心技术点：
// - 全局管理文章数据，支持跨页面共享（前台文章列表/详情 + 后台文章增删改查）
// - state: articles 初始化优先从 localStorage 读取
// - getters: publishedArticles / draftArticles / getArticleById 等
// - actions: addArticle / updateArticle / removeArticle / togglePublish
// - 持久化: 每次 actions 修改均同步写回 localStorage
// ====================================================================

const ARTICLES_STORAGE_KEY = 'lume_articles'

// 初始内置技术博客文章
const initialArticles = [
  {
    id: 1,
    title: 'Vue 3 组合式 API (<script setup>) 最佳工程实践',
    author: '蓝健涛',
    category: '前端开发',
    summary: '系统梳理 ref、reactive、computed 以及生命周期钩子在真实工程中的优雅组织形态。',
    content: `组合式 API (Composition API) 为大型前端应用带来了更高的代码复用性和更清晰的关注点分离。

在 <script setup> 语法糖下，无需繁琐地声明 export default 和 return，所有顶层声明的变量和函数均可直接在 template 中使用。

核心建议：
1. 单一职责原则：将复杂业务逻辑拆分为独立的 composables 函数（如 useUserStore / useArticleStore）。
2. 正确解构响应式：对 Store 实例解构时，务必使用 storeToRefs 避免响应性丢失。
3. 状态分层管理：页面内私有状态留在组件内部，跨组件/跨页面状态坚决沉淀进 Pinia Store 中。`,
    status: 'published',
    updatedAt: '2026-10-10'
  },
  {
    id: 2,
    title: 'Pinia 全局状态管理深度解析与落地指南',
    author: '蓝健涛',
    category: '状态管理',
    summary: '剖析 Pinia 去除 Mutations 后的扁平架构，配合 storeToRefs 与 localStorage 持久化。',
    content: `Pinia 作为 Vue 3 官方推荐的新一代状态管理库，摒弃了 Vuex 繁复冗余的 mutations 设计，精简为 state、getters 与 actions 三大核心要素。

为什么选择 Pinia？
- 极简的 TypeScript 与自动代码补全支持
- 扁平模块化：每个 Store 都是独立的模块，不再有全局命名空间冲突
- 自由组合：actions 支持同步和异步，可直接修改 state

持久化实践：
在 state 初始化时通过 JSON.parse 从 localStorage 读取已保存数据；在 actions 增删改查后通过 JSON.stringify 同步写入本地缓存，页面刷新后即可实现无缝数据恢复。`,
    status: 'published',
    updatedAt: '2026-10-11'
  },
  {
    id: 3,
    title: 'Vue Router 4 路由守卫与后台动态鉴权实战',
    author: '蓝健涛',
    category: '路由原理',
    summary: '利用 beforeEach 全局前置守卫与路由元信息 meta 实现细粒度的身份校验与标题更新。',
    content: `单页面应用 (SPA) 中的敏感操作入口必须通过路由守卫进行严格控制。

在实验三与实验四的架构中，我们使用了两层保护：
1. 声明式元信息：通过 meta: { requiresAuth: true } 为后台管理路由加锁。
2. 全局前置守卫：在 router.beforeEach 守卫函数内调用 useUserStore() 动态获取登录凭证。若未登录则阻断跳转，并携带 redirect 原始目标路径引导用户前往登录页。

值得注意的是：必须在 beforeEach 回调函数体内调用 useUserStore()，不能在模块顶层直接调用，以确保 Pinia 实例已完全挂载！`,
    status: 'published',
    updatedAt: '2026-10-08'
  },
  {
    id: 4,
    title: 'CSS 自定义属性与毛玻璃暗色模式系统设计',
    author: '蓝健涛',
    category: '界面设计',
    summary: '利用 CSS Variables 与媒体查询打造高品质全站主题切换方案，兼顾现代毛玻璃质感。',
    content: `现代 Web 设计越来越强调沉浸式的视觉交互与人机体验。

在 Lume Blog 中，我们通过 CSS 自定义属性 (:root / .dark-mode) 构建了统一的设计 Token：
- --bg-gradient: 背景动态渐变色
- --bg-card: 半透明毛玻璃卡片背景 (结合 backdrop-filter: blur)
- --primary: 品牌主色系，暗色下自适应提亮保证对比度

全站主题切换仅需在根容器挂载 .dark-mode 类名，即可实现零重绘卡顿的丝滑过渡。`,
    status: 'published',
    updatedAt: '2026-10-06'
  },
  {
    id: 5,
    title: '前端工程化中的单页性能优化与代码规范（草稿）',
    author: '蓝健涛',
    category: '工程实践',
    summary: '探讨 Vite 构建流水线、组件异步分包与 Git Commit 规范在个人与团队协作中的关键价值。',
    content: `从本地秒级冷启动到生产环境代码分割，现代前端工程化让开发体验产生了质的飞跃。

本文记录正在整理的几大重点：
1. Vite 基于原生 ESM 的开发服务预构建机制。
2. 路由懒加载与组件动态按需引入。
3. 规范化的 Git 提交日志格式与自动化构建部署流程。`,
    status: 'draft',
    updatedAt: '2026-10-02'
  }
]

// 读取本地持久化数据
function loadArticles() {
  try {
    const saved = localStorage.getItem(ARTICLES_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('加载本地文章列表失败:', e)
  }
  return initialArticles.map(a => ({ ...a }))
}

export const useArticleStore = defineStore('articles', {
  state: () => ({
    articles: loadArticles()
  }),

  getters: {
    // 已发布文章列表
    publishedArticles: (state) =>
      state.articles.filter((article) => article.status === 'published'),

    // 草稿箱文章列表
    draftArticles: (state) =>
      state.articles.filter((article) => article.status === 'draft'),

    // 文章总数
    totalCount: (state) => state.articles.length,

    // 已发布文章总数
    publishedCount: (state) =>
      state.articles.filter((article) => article.status === 'published').length,

    // 草稿总数
    draftCount: (state) =>
      state.articles.filter((article) => article.status === 'draft').length,

    // 根据编号查询文章详情（返回查找函数）
    getArticleById: (state) => (id) =>
      state.articles.find((article) => article.id === Number(id)),

    // 获取所有可用文章分类
    categories: (state) => {
      const set = new Set(state.articles.map((a) => a.category).filter(Boolean))
      return ['全部', ...Array.from(set)]
    }
  },

  actions: {
    // 新增文章
    addArticle(form) {
      const nextId = this.articles.length
        ? Math.max(...this.articles.map((a) => a.id)) + 1
        : 1

      const newArticle = {
        id: nextId,
        title: (form.title || '').trim(),
        author: (form.author || '蓝健涛').trim(),
        category: form.category || '前端开发',
        summary: (form.summary || '').trim(),
        content: (form.content || '').trim(),
        status: form.status || 'published',
        updatedAt: new Date().toISOString().slice(0, 10)
      }

      this.articles.unshift(newArticle)
      this.persistArticles()
      return nextId
    },

    // 修改/更新文章
    updateArticle(id, form) {
      const article = this.getArticleById(id)
      if (!article) return false

      Object.assign(article, {
        ...form,
        title: (form.title !== undefined ? form.title : article.title).trim(),
        author: (form.author !== undefined ? form.author : article.author).trim(),
        category: form.category || article.category,
        summary: (form.summary !== undefined ? form.summary : article.summary).trim(),
        content: (form.content !== undefined ? form.content : article.content).trim(),
        status: form.status || article.status,
        updatedAt: new Date().toISOString().slice(0, 10)
      })

      this.persistArticles()
      return true
    },

    // 删除文章
    removeArticle(id) {
      const index = this.articles.findIndex((a) => a.id === Number(id))
      if (index !== -1) {
        this.articles.splice(index, 1)
        this.persistArticles()
        return true
      }
      return false
    },

    // 一键切换文章发布/草稿状态
    togglePublish(id) {
      const article = this.getArticleById(id)
      if (!article) return false

      article.status = article.status === 'published' ? 'draft' : 'published'
      article.updatedAt = new Date().toISOString().slice(0, 10)
      this.persistArticles()
      return true
    },

    // 重置恢复初始文章列表
    resetArticles() {
      this.articles = initialArticles.map((a) => ({ ...a }))
      this.persistArticles()
    },

    // 数据持久化同步写回 localStorage
    persistArticles() {
      try {
        localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(this.articles))
      } catch (e) {
        console.error('持久化文章列表失败:', e)
      }
    }
  }
})
