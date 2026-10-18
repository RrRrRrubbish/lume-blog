<template>
  <!-- ====================================================================
       动态路由项目详情组件 (ProjectDetailView.vue)
       实验三核心技术点：
       - 动态路由参数获取：使用 useRoute() 获取 route.params.id 并转为 Number
       - 编程式导航综合应用：
         - router.go(-1)：返回上一浏览历史记录
         - router.push()：返回项目列表或跳转后台管理
         - router.replace()：对于无效项目 ID，使用 replace 替换历史记录重定向
       ==================================================================== -->
  <div class="project-detail-view">
    <!-- 1. 正常项目详情渲染 -->
    <div v-if="project" class="card detail-card">
      <!-- 头部元信息栏 -->
      <div class="detail-header">
        <div class="title-area">
          <div class="meta-tags">
            <span class="badge category-badge">📁 {{ project.category }}</span>
            <span 
              class="badge status-badge"
              :class="project.status === '已完成' ? 'status-done' : 'status-ongoing'"
            >
              {{ project.status }} ({{ project.progress }}%)
            </span>
            <span class="badge id-badge">动态路由参数 :id = {{ route.params.id }}</span>
          </div>
          <h1 class="project-name">{{ project.name }}</h1>
          <p class="timeline">
            📅 研发周期：{{ project.startDate }} 至 {{ project.endDate || '至今' }}
          </p>
        </div>

        <!-- 顶部快捷操作栏 (编程式导航) -->
        <div class="action-buttons">
          <button class="btn btn-outline" @click="goBack" title="调用 router.go(-1) 返回上一页">
            ⬅ 返回上一页 (go(-1))
          </button>
          <button class="btn btn-primary" @click="goToList" title="调用 router.push() 返回项目列表">
            📋 返回项目列表
          </button>
        </div>
      </div>

      <!-- 研发进度可视化 -->
      <div class="detail-progress-section">
        <div class="progress-info">
          <span>🎯 项目研发整体完成进度</span>
          <strong>{{ project.progress }}%</strong>
        </div>
        <div class="progress-bar-bg">
          <div 
            class="progress-bar-inner" 
            :style="{ width: project.progress + '%' }"
            :class="{ 'bar-done': project.status === '已完成' }"
          ></div>
        </div>
      </div>

      <!-- 项目简要概述 -->
      <div class="detail-section">
        <h3 class="section-heading">📌 项目简述与定位</h3>
        <p class="section-text lead-text">{{ project.description }}</p>
      </div>

      <!-- 架构与深度实现说明 -->
      <div class="detail-section">
        <h3 class="section-heading">🏗️ 系统架构与深度实现</h3>
        <p class="section-text detail-body">{{ project.fullDetail }}</p>
      </div>

      <!-- 核心技术亮点清单 -->
      <div class="detail-section">
        <h3 class="section-heading">✨ 核心技术亮点与创新</h3>
        <ul class="highlights-list">
          <li v-for="(item, index) in project.highlights" :key="index">
            <span class="highlight-dot">✔</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <!-- 所用技术栈 -->
      <div class="detail-section">
        <h3 class="section-heading">⚡ 技术栈清单</h3>
        <div class="tech-row">
          <span v-for="tech in project.technologies" :key="tech" class="tech-pill">
            {{ tech }}
          </span>
        </div>
      </div>

      <!-- 底部控制与跳转后台 -->
      <div class="detail-footer">
        <div class="footer-note-text">
          💡 本页面由 <code>/projects/:id</code> 动态路由解析渲染。当前路由完整路径：<code>{{ route.fullPath }}</code>
        </div>
        <div class="footer-buttons">
          <button class="btn btn-outline" @click="goBack">返回上一页</button>
          <RouterLink :to="{ name: 'admin-projects' }" class="btn btn-primary">
            ⚙️ 前往后台管理项目
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- 2. 无效路由参数处理 (指导书要求：无效详情地址处理与 replace 导航) -->
    <div v-else class="card invalid-card">
      <div class="invalid-content">
        <span class="error-icon">🔍</span>
        <h2>未查询到项目详情</h2>
        <p class="invalid-hint">
          抱歉，无法在项目数据库中匹配到 ID 为 <code>{{ route.params.id }}</code> 的项目作品。
        </p>
        <div class="invalid-actions">
          <button class="btn btn-primary" @click="handleInvalidRedirect">
            重定向至项目列表 (router.replace)
          </button>
          <button class="btn btn-outline" @click="goHome">
            返回首页 (router.push)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '../../stores'

// 1. 获取当前路由对象与路由器实例
const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

// 2. 根据动态路由参数 :id 获取对应的项目数据（通过 Pinia getter）
const project = computed(() => {
  return projectStore.getProjectById(route.params.id) || null
})

// ====================================================================
// 3. 编程式导航综合方法实现 (满足实验指导书 3.1(6) 要求)
// ====================================================================

// ① 返回上一页：调用 router.go(-1)
const goBack = () => {
  console.log('[编程式导航] 执行 router.go(-1) 返回历史上一页')
  router.go(-1)
}

// ② 返回列表：调用 router.push()
const goToList = () => {
  console.log('[编程式导航] 执行 router.push({ name: "projects-list" })')
  router.push({ name: 'projects-list' })
}

// ③ 返回首页：调用 router.push()
const goHome = () => {
  router.push({ name: 'home' })
}

// ④ 无效详情地址重定向：调用 router.replace() 替换当前历史记录（不保留错误访问栈）
const handleInvalidRedirect = () => {
  alert(`⚠️ 正在将无效地址 ${route.fullPath} 替换重定向回项目中心...`)
  router.replace({ name: 'projects-list' })
}
</script>

<style scoped>
.project-detail-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 20px;
}

.meta-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.badge {
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
}

.category-badge {
  background: var(--primary-light);
  color: var(--primary);
}

.status-badge.status-done {
  background: #dcfce7;
  color: #15803d;
}

.status-badge.status-ongoing {
  background: #fef3c7;
  color: #b45309;
}

.id-badge {
  background: #f1f5f9;
  color: #475569;
  font-family: monospace;
}

.project-name {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
}

.timeline {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-muted);
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.detail-progress-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--bg-hover);
  padding: 14px 18px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-muted);
}

.progress-info strong {
  color: var(--primary);
}

.progress-bar-bg {
  height: 8px;
  background: var(--border-color);
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  background: #f59e0b;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.progress-bar-inner.bar-done {
  background: #10b981;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-heading {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.lead-text {
  font-size: 14.5px;
  color: var(--text-main);
  line-height: 1.6;
}

.detail-body {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.8;
  background: var(--bg-hover);
  padding: 14px 18px;
  border-radius: 8px;
  border-left: 4px solid var(--primary);
}

.highlights-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.highlights-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: var(--text-main);
}

.highlight-dot {
  color: #10b981;
  font-weight: bold;
}

.tech-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-pill {
  font-size: 12px;
  font-weight: 600;
  background: var(--bg-hover);
  color: var(--primary);
  border: 1px solid var(--border-color);
  padding: 4px 12px;
  border-radius: 999px;
}

.detail-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.footer-note-text {
  font-size: 12px;
  color: var(--text-muted);
}

.footer-note-text code {
  background: var(--bg-hover);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.footer-buttons {
  display: flex;
  gap: 10px;
}

/* 无效 ID 提示卡片 */
.invalid-card {
  padding: 48px 24px;
  text-align: center;
}

.invalid-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  max-width: 480px;
  margin: 0 auto;
}

.error-icon {
  font-size: 48px;
}

.invalid-content h2 {
  margin: 0;
  font-size: 20px;
  color: var(--text-main);
}

.invalid-hint {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
}

.invalid-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
</style>
