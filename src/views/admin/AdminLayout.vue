<template>
  <!-- ====================================================================
       后台管理中心父路由布局容器 (AdminLayout.vue)
       实验四核心技术点：
       - 结合 Pinia useUserStore 实现登录态感知与安全登出
       - 嵌套路由 (Nested Routes)：包含个人档案修改、项目管理与新增的文章管理
       - 路由元信息与守卫：所有 /admin 下的子路由均受 requiresAuth 守卫保护
       ==================================================================== -->
  <div class="admin-layout">
    <!-- 后台管理头部与导航栏 -->
    <div class="card admin-header-card">
      <div class="header-top">
        <div class="admin-brand">
          <span class="admin-icon">⚙️</span>
          <div>
            <h2 class="admin-title">Lume Blog 后台管理中心</h2>
            <p class="admin-desc">
              当前博主：<strong>{{ bloggerName }}</strong>（学号：{{ profile.studentId }} · {{ profile.class }}）· Pinia 全局状态鉴权已通过
            </p>
          </div>
        </div>

        <div class="admin-top-actions">
          <button class="btn btn-outline btn-sm" @click="handleExportData">
            💾 导出全站数据 (JSON)
          </button>
          <RouterLink :to="{ name: 'home' }" class="btn btn-outline btn-sm">
            🌐 返回前台主页
          </RouterLink>
          <button class="btn btn-outline btn-sm logout-btn" @click="handleAdminLogout">
            🚪 退出管理
          </button>
        </div>
      </div>

      <!-- 嵌套子路由标签导航 -->
      <div class="admin-tabs">
        <RouterLink :to="{ name: 'admin-profile' }" class="admin-tab">
          👤 个人档案修改
        </RouterLink>
        <RouterLink :to="{ name: 'admin-projects' }" class="admin-tab">
          🚀 项目信息管理
        </RouterLink>
        <RouterLink :to="{ name: 'admin-articles' }" class="admin-tab">
          📝 文章内容管理
        </RouterLink>
      </div>
    </div>

    <!-- 子路由出口：渲染 AdminProfileView、AdminProjectsView 或 AdminArticlesView -->
    <RouterView />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../../stores'

const router = useRouter()
const userStore = useUserStore()

// 使用 storeToRefs 保持响应式
const { profile, bloggerName } = storeToRefs(userStore)

const handleAdminLogout = () => {
  if (confirm('确认退出后台管理中心吗？')) {
    userStore.logout()
    alert('已成功退出后台管理身份！')
    router.push({ name: 'home' })
  }
}

// 实验五拓展选做 2：调用后端 RESTful 数据导出接口
const handleExportData = () => {
  window.open('http://127.0.0.1:3000/api/export?download=true', '_blank')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.admin-header-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: linear-gradient(135deg, var(--bg-card), var(--bg-hover));
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-icon {
  font-size: 32px;
}

.admin-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: var(--text-main);
}

.admin-desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-muted);
}

.admin-top-actions {
  display: flex;
  gap: 10px;
}

.logout-btn {
  color: #dc2626;
  border-color: #fca5a5;
}

.logout-btn:hover {
  background: #fee2e2;
}

.admin-tabs {
  display: flex;
  gap: 8px;
  border-top: 1px solid var(--border-color);
  padding-top: 12px;
  flex-wrap: wrap;
}

.admin-tab {
  padding: 8px 18px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  transition: all 0.2s ease;
}

.admin-tab:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.admin-tab.router-link-active,
.admin-tab.router-link-exact-active {
  color: #fff;
  background: var(--primary);
  border-color: var(--primary);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
}
</style>
