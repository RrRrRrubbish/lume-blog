<template>
  <!-- ====================================================================
       文章详情视图组件 (ArticleDetailView.vue)
       实验四核心技术点：
       - Pinia Store 按需获取单一资源：articleStore.getArticleById(id)
       - 结合动态路由参数 route.params.id
       - 编程式导航与异常参数安全回退
       ==================================================================== -->
  <div class="article-detail-view">
    <!-- 匹配到文章数据 -->
    <div v-if="article" class="card detail-card">
      <header class="detail-header">
        <div class="meta-row">
          <span class="category-badge">📁 {{ article.category }}</span>
          <span class="date-badge">📅 更新于 {{ article.updatedAt }}</span>
          <span
            class="status-badge"
            :class="article.status === 'published' ? 'status-published' : 'status-draft'"
          >
            {{ article.status === 'published' ? '✔ 已公开' : '📝 草稿' }}
          </span>
          <span class="route-id-badge">动态路由参数 :id = {{ $route.params.id }}</span>
        </div>

        <h1 class="article-title">{{ article.title }}</h1>

        <div class="author-row">
          <div class="author-profile">
            <span class="author-avatar">👨‍💻</span>
            <div>
              <div class="author-name">{{ article.author }}</div>
              <div class="author-sub">博主原创技术博文 · Lume Blog</div>
            </div>
          </div>

          <div class="header-actions">
            <button class="btn btn-outline btn-sm" @click="handleBack">
              ⬅ 返回上一页 (go(-1))
            </button>
            <button class="btn btn-primary btn-sm" @click="handleToList">
              📋 文章列表
            </button>
          </div>
        </div>
      </header>

      <!-- 文章导读摘要 -->
      <div class="summary-box">
        <strong>💡 核心导读：</strong>
        <p>{{ article.summary }}</p>
      </div>

      <!-- 文章主体正文 -->
      <div class="article-body">
        <div class="article-content" v-html="formattedContent"></div>
      </div>

      <!-- 底部操作与元信息 -->
      <footer class="detail-footer">
        <div class="footer-tip">
          💡 本页面由 <code>/articles/:id</code> 动态路由解析，数据由 Pinia <code>useArticleStore</code> 响应式驱动。
        </div>

        <div class="footer-btns">
          <button class="btn btn-outline" @click="handleToList">
            返回文章列表
          </button>
          <RouterLink
            v-if="isLoggedIn"
            :to="{ name: 'admin-articles' }"
            class="btn btn-primary"
          >
            ⚙️ 前往后台管理文章
          </RouterLink>
        </div>
      </footer>
    </div>

    <!-- 未匹配到文章时的友好提示 -->
    <div v-else class="card not-found-card">
      <div class="error-icon">🔍</div>
      <h2>未查询到相关文章</h2>
      <p>
        抱歉，无法在文章数据库中匹配到编号为 <code>{{ $route.params.id }}</code> 的文章作品。
      </p>
      <div class="error-actions">
        <button class="btn btn-primary" @click="handleReplace">
          重定向回文章列表 (router.replace)
        </button>
        <button class="btn btn-outline" @click="handleGoHome">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticleStore, useUserStore } from '../../stores'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const userStore = useUserStore()

const { isLoggedIn } = storeToRefs(userStore)

// 从 Pinia Store 根据动态路由参数匹配文章
const article = computed(() => {
  return articleStore.getArticleById(route.params.id)
})

// 正文段落格式化
const formattedContent = computed(() => {
  if (!article.value || !article.value.content) return ''
  return article.value.content
    .split('\n\n')
    .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('')
})

// 编程式导航：返回上一页
const handleBack = () => {
  router.go(-1)
}

// 编程式导航：跳转回列表
const handleToList = () => {
  router.push({ name: 'articles-list' })
}

// 编程式导航：重定向并替换历史记录
const handleReplace = () => {
  router.replace({ name: 'articles-list' })
}

// 返回首页
const handleGoHome = () => {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.article-detail-view {
  max-width: 860px;
  margin: 0 auto;
}

.detail-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-header {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 12px;
}

.category-badge {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--primary);
}

.date-badge {
  color: var(--text-soft);
}

.status-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 11px;
}

.status-published {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.status-draft {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}

.route-id-badge {
  background: var(--bg-input);
  color: var(--text-muted);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.article-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.35;
  margin: 0;
}

.author-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.author-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  font-size: 26px;
}

.author-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.author-sub {
  font-size: 11.5px;
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.summary-box {
  background: var(--primary-light);
  border-left: 4px solid var(--primary);
  border-radius: 8px;
  padding: 14px 18px;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--text-main);
}

.summary-box strong {
  color: var(--primary);
}

.summary-box p {
  margin: 6px 0 0;
  color: var(--text-muted);
}

.article-body {
  line-height: 1.8;
  font-size: 15px;
  color: var(--text-main);
}

.article-content :deep(p) {
  margin-bottom: 16px;
}

.detail-footer {
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.footer-tip {
  font-size: 12px;
  color: var(--text-muted);
}

.footer-tip code {
  background: var(--bg-input);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--primary);
}

.footer-btns {
  display: flex;
  gap: 10px;
}

.not-found-card {
  text-align: center;
  padding: 50px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.error-icon {
  font-size: 40px;
}

.error-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>
