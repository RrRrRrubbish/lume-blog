import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores'

// 1. 视图组件按需/直接导入
import HomeView from '../views/HomeView.vue'
import ProjectsLayout from '../views/projects/ProjectsLayout.vue'
import ProjectsListView from '../views/projects/ProjectsListView.vue'
import ProjectDetailView from '../views/projects/ProjectDetailView.vue'
import ArticlesLayout from '../views/articles/ArticlesLayout.vue'
import ArticlesListView from '../views/articles/ArticlesListView.vue'
import ArticleDetailView from '../views/articles/ArticleDetailView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminProfileView from '../views/admin/AdminProfileView.vue'
import AdminProjectsView from '../views/admin/AdminProjectsView.vue'
import AdminArticlesView from '../views/admin/AdminArticlesView.vue'
import NotFoundView from '../views/NotFoundView.vue'

// 2. 路由表定义（基础路由、动态路由、嵌套路由、重定向与404）
const routes = [
  // 默认根路径重定向至首页
  {
    path: '/',
    redirect: '/home'
  },
  // ① 基础路由：个人主页
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: {
      title: '个人主页'
    }
  },
  // ② 嵌套路由与动态路由：项目中心
  {
    path: '/projects',
    component: ProjectsLayout,
    children: [
      {
        path: '',
        name: 'projects-list',
        component: ProjectsListView,
        meta: {
          title: '项目作品列表'
        }
      },
      // 动态路由：通过 :id 传递项目编号
      {
        path: ':id',
        name: 'project-detail',
        component: ProjectDetailView,
        meta: {
          title: '项目详情与架构'
        }
      }
    ]
  },
  // ③ 实验四新增：嵌套路由与动态路由：技术文章专栏
  {
    path: '/articles',
    component: ArticlesLayout,
    children: [
      {
        path: '',
        name: 'articles-list',
        component: ArticlesListView,
        meta: {
          title: '技术文章列表'
        }
      },
      // 动态路由：通过 :id 传递文章编号
      {
        path: ':id',
        name: 'article-detail',
        component: ArticleDetailView,
        meta: {
          title: '博文阅读详情'
        }
      }
    ]
  },
  // ④ 基础路由：关于博主
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      title: '关于博主'
    }
  },
  // ⑤ 身份认证页面（登录）
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: '博主身份认证'
    }
  },
  // ⑥ 嵌套路由与权限控制：后台管理中心
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/profile',
    meta: {
      title: '后台管理中心',
      requiresAuth: true
    },
    children: [
      {
        path: 'profile',
        name: 'admin-profile',
        component: AdminProfileView,
        meta: {
          title: '编辑个人简介',
          requiresAuth: true
        }
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: AdminProjectsView,
        meta: {
          title: '项目信息管理',
          requiresAuth: true
        }
      },
      // 实验四新增：后台博文管理
      {
        path: 'articles',
        name: 'admin-articles',
        component: AdminArticlesView,
        meta: {
          title: '博文内容管理',
          requiresAuth: true
        }
      }
    ]
  },
  // ⑦ 通配符路由：404 错误兜底
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      title: '404 页面未找到'
    }
  }
]

// 3. 创建路由实例（HTML5 Hash 模式，适配 GitHub Pages 静态部署无 404 刷新问题）
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 切换路由时自动平滑滚动至页面顶部
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

// 4. 全局前置守卫 beforeEach：更新页面标题与敏感页面鉴权
// 实验四核心规范：必须在 beforeEach 回调函数体内调用 useUserStore()，确保 Pinia 挂载完成
router.beforeEach((to, from, next) => {
  // ① 动态更新浏览器标题
  const siteTitle = 'Lume Blog · 蓝健涛'
  document.title = to.meta.title ? `${to.meta.title} | ${siteTitle}` : siteTitle

  // ② 身份鉴权拦截：结合 Pinia 用户状态控制后台管理访问
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !userStore.isLoggedIn) {
    ElMessage.warning('🔒 访问受限：后台管理中心需要博主身份认证，请先登录！')
    // 携带目标跳转路径，登录成功后可直接重定向回原页面
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
