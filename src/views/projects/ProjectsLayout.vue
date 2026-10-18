<template>
  <!-- ====================================================================
       项目中心父路由布局容器 (ProjectsLayout.vue)
       实验三核心技术点：
       - 嵌套路由 (Nested Routes)：作为父级路由容器，提供共享布局与统计头部
       - 内部挂载 <RouterView /> 作为子路由出口（承载项目列表与项目详情）
       ==================================================================== -->
  <div class="projects-layout">
    <!-- 共享顶部信息头与统计卡片 -->
    <div class="card layout-header">
      <div class="header-content">
        <div class="title-meta">
          <div class="badge-row">
            <span class="category-badge">工程实践与作品集</span>
            <span class="route-badge">嵌套路由父容器 /projects</span>
          </div>
          <h2 class="page-title">🚀 项目作品中心</h2>
          <p class="page-desc">
            收录个人实战研发成果，记录从构想到落地的全流程技术沉淀 · 当前共收录 {{ projects.length }} 个项目
          </p>
        </div>

        <!-- 统计面板 -->
        <div class="stats-row">
          <div class="stat-box">
            <span class="stat-num">{{ projects.length }}</span>
            <span class="stat-label">总项目数</span>
          </div>
          <div class="stat-box">
            <span class="stat-num">{{ completedCount }}</span>
            <span class="stat-label">已交付</span>
          </div>
          <div class="stat-box">
            <span class="stat-num">{{ ongoingCount }}</span>
            <span class="stat-label">进行中</span>
          </div>
        </div>
      </div>

      <!-- 面包屑与快捷导航 -->
      <div class="sub-nav-bar">
        <div class="breadcrumbs">
          <RouterLink :to="{ name: 'home' }">首页</RouterLink>
          <span class="separator">/</span>
          <RouterLink :to="{ name: 'projects-list' }">项目作品中心</RouterLink>
          <template v-if="currentProjectName">
            <span class="separator">/</span>
            <span class="active-crumb">{{ currentProjectName }}</span>
          </template>
        </div>

        <RouterLink 
          v-if="$route.name === 'project-detail'" 
          :to="{ name: 'projects-list' }" 
          class="btn btn-outline btn-sm"
        >
          ⬅ 返回项目列表
        </RouterLink>
      </div>
    </div>

    <!-- 子路由出口：动态渲染项目列表 (ProjectsListView) 或项目详情 (ProjectDetailView) -->
    <RouterView />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../../stores'

const route = useRoute()
const projectStore = useProjectStore()
// 使用 storeToRefs 保持响应式
const { projects, completedCount, ongoingCount } = storeToRefs(projectStore)

// 如果当前在详情页，提取项目名称供面包屑展示
const currentProjectName = computed(() => {
  if (route.name === 'project-detail') {
    const found = projects.value.find(p => p.id === Number(route.params.id))
    return found ? found.name : '项目详情'
  }
  return ''
})
</script>

<style scoped>
.projects-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.layout-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: linear-gradient(135deg, var(--bg-card), var(--bg-hover));
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.badge-row {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
}

.category-badge {
  font-size: 11px;
  font-weight: 600;
  background: var(--primary-light);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 4px;
}

.route-badge {
  font-size: 11px;
  font-weight: 600;
  background: #f1f5f9;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 4px;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: var(--text-main);
}

.page-desc {
  margin: 6px 0 0;
  font-size: 13.5px;
  color: var(--text-muted);
}

.stats-row {
  display: flex;
  gap: 16px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  min-width: 70px;
}

.stat-num {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary);
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
}

.sub-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.breadcrumbs a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.separator {
  color: var(--text-muted);
}

.active-crumb {
  color: var(--text-main);
  font-weight: 600;
}
</style>
