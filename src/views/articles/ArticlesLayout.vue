<template>
  <!-- ====================================================================
       技术文章父路由布局容器 (ArticlesLayout.vue)
       实验四核心技术点：
       - 结合 Pinia useArticleStore 共享数据
       - storeToRefs 响应式解构文章统计数据
       - 嵌套路由父容器：提供共享头部、面包屑导航与 <RouterView /> 出口
       ==================================================================== -->
  <div class="articles-layout">
    <!-- 共享顶部信息头与统计卡片 -->
    <div class="card layout-header">
      <div class="header-content">
        <div class="title-meta">
          <div class="badge-row">
            <span class="category-badge">技术专栏与笔记</span>
            <span class="route-badge">Pinia 全局驱动 /articles</span>
          </div>
          <h2 class="page-title">📚 技术博客与思考</h2>
          <p class="page-desc">
            记录现代前端全栈工程实战、框架底层原理与个人开发沉淀 · 全局共管理 {{ totalCount }} 篇技术文献
          </p>
        </div>

        <!-- 统计面板：数据来自 Pinia Store -->
        <div class="stats-row">
          <div class="stat-box">
            <span class="stat-num">{{ totalCount }}</span>
            <span class="stat-label">总文章篇数</span>
          </div>
          <div class="stat-box stat-highlight">
            <span class="stat-num">{{ publishedCount }}</span>
            <span class="stat-label">已公开阅读</span>
          </div>
          <div class="stat-box">
            <span class="stat-num">{{ draftCount }}</span>
            <span class="stat-label">草稿撰写中</span>
          </div>
        </div>
      </div>

      <!-- 面包屑与快捷导航 -->
      <div class="sub-nav-bar">
        <div class="breadcrumbs">
          <RouterLink :to="{ name: 'home' }">首页</RouterLink>
          <span class="separator">/</span>
          <RouterLink :to="{ name: 'articles-list' }">技术文章中心</RouterLink>
          <template v-if="currentArticleTitle">
            <span class="separator">/</span>
            <span class="active-crumb">{{ currentArticleTitle }}</span>
          </template>
        </div>

        <RouterLink 
          v-if="$route.name === 'article-detail'" 
          :to="{ name: 'articles-list' }" 
          class="btn btn-outline btn-sm"
        >
          ⬅ 返回文章列表
        </RouterLink>
      </div>
    </div>

    <!-- 子路由出口：渲染 ArticlesListView 或 ArticleDetailView -->
    <RouterView />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../../stores'

const route = useRoute()
const articleStore = useArticleStore()

// 使用 storeToRefs 解构保持响应性
const { articles, totalCount, publishedCount, draftCount } = storeToRefs(articleStore)

// 根据路由参数匹配当前文章标题作为面包屑导航
const currentArticleTitle = computed(() => {
  if (route.name === 'article-detail') {
    const article = articleStore.getArticleById(route.params.id)
    return article ? article.title : '文章详情'
  }
  return ''
})
</script>

<style scoped>
.articles-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.layout-header {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.title-meta {
  flex: 1;
  min-width: 280px;
}

.badge-row {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.category-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--primary-light);
  color: var(--primary);
  border: 1px solid var(--primary);
}

.route-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #475569;
}

.dark-mode .route-badge {
  background: #1e293b;
  color: #cbd5e1;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 6px 0;
}

.page-desc {
  font-size: 13.5px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

.stats-row {
  display: flex;
  gap: 12px;
}

.stat-box {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.stat-box.stat-highlight {
  border-color: var(--primary);
  background: var(--primary-light);
}

.stat-num {
  font-size: 22px;
  font-weight: 800;
  color: var(--primary);
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  margin-top: 2px;
}

.sub-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px dashed var(--border-color);
  flex-wrap: wrap;
  gap: 10px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
}

.breadcrumbs a {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.breadcrumbs a:hover {
  color: var(--primary);
}

.separator {
  color: var(--text-soft);
  font-size: 12px;
}

.active-crumb {
  color: var(--primary);
  font-weight: 700;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12.5px;
}
</style>
