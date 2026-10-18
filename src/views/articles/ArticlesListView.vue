<template>
  <!-- ====================================================================
       文章列表视图组件 (ArticlesListView.vue)
       实验四核心技术点：
       - 使用 Pinia useArticleStore 集中读取文章
       - storeToRefs 解构保持响应式
       - 结合分类筛选、关键字搜索、路由跳转
       ==================================================================== -->
  <div class="articles-list-view">
    <!-- 筛选卡片 -->
    <div class="card filter-card">
      <div class="filter-top">
        <!-- 分类选择器 -->
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat"
            class="tab-btn"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- 关键词搜索框 -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model.trim="searchKeyword"
            type="text"
            placeholder="搜索文章标题、摘要或内容..."
            class="search-input"
          />
        </div>
      </div>

      <div class="filter-bottom">
        <span class="count-hint">
          显示 <strong>{{ filteredArticles.length }}</strong> 篇技术文章
          <span v-if="searchKeyword || selectedCategory !== '全部'">（已应用条件筛选）</span>
        </span>
        <RouterLink v-if="isLoggedIn" :to="{ name: 'admin-articles' }" class="btn btn-outline btn-sm">
          ⚙️ 前往后台管理文章
        </RouterLink>
      </div>
    </div>

    <!-- 文章卡片网格 -->
    <div v-if="filteredArticles.length > 0" class="articles-grid">
      <article
        v-for="article in filteredArticles"
        :key="article.id"
        class="card article-card"
      >
        <div class="article-meta-row">
          <span class="category-tag">{{ article.category }}</span>
          <span class="date-badge">📅 {{ article.updatedAt }}</span>
          <span v-if="article.status === 'draft'" class="draft-badge">草稿</span>
        </div>

        <h3 class="article-title">
          <RouterLink :to="{ name: 'article-detail', params: { id: article.id } }">
            {{ article.title }}
          </RouterLink>
        </h3>

        <p class="article-summary">{{ article.summary }}</p>

        <div class="article-footer">
          <div class="author-info">
            <span class="author-avatar">✍️</span>
            <span class="author-name">{{ article.author }}</span>
          </div>

          <div class="footer-actions">
            <!-- 编程式导航与声明式导航双模支持 -->
            <button class="btn btn-outline btn-sm" @click="handleRead(article.id)">
              📄 编程式阅读
            </button>
            <RouterLink
              :to="{ name: 'article-detail', params: { id: article.id } }"
              class="btn btn-primary btn-sm"
            >
              阅读全文 ➜
            </RouterLink>
          </div>
        </div>
      </article>
    </div>

    <!-- 空状态 -->
    <div v-else class="card empty-card">
      <div class="empty-icon">📂</div>
      <h3>暂未匹配到相关文章</h3>
      <p>未找到符合分类 “{{ selectedCategory }}” 或关键词 “{{ searchKeyword }}” 的文章</p>
      <button class="btn btn-primary btn-sm" @click="resetFilters">
        重置筛选条件
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticleStore, useUserStore } from '../../stores'

const router = useRouter()
const articleStore = useArticleStore()
const userStore = useUserStore()

// 使用 storeToRefs 解构保持响应性
const { publishedArticles, categories } = storeToRefs(articleStore)
const { isLoggedIn } = storeToRefs(userStore)

// 响应式筛选条件
const selectedCategory = ref('全部')
const searchKeyword = ref('')

// 计算筛选后的文章列表
const filteredArticles = computed(() => {
  return publishedArticles.value.filter((article) => {
    const matchCategory =
      selectedCategory.value === '全部' || article.category === selectedCategory.value

    const kw = searchKeyword.value.toLowerCase()
    const matchKeyword =
      !kw ||
      article.title.toLowerCase().includes(kw) ||
      article.summary.toLowerCase().includes(kw) ||
      article.content.toLowerCase().includes(kw)

    return matchCategory && matchKeyword
  })
})

// 编程式导航跳转至文章详情页
const handleRead = (id) => {
  console.log(`[编程式导航] 跳转至文章详情，ID = ${id}`)
  router.push({ name: 'article-detail', params: { id } })
}

// 重置筛选
const resetFilters = () => {
  selectedCategory.value = '全部'
  searchKeyword.value = ''
}
</script>

<style scoped>
.articles-list-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 24px;
}

.filter-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tab-btn {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.tab-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.dark-mode .tab-btn.active {
  color: #0f172a;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  padding: 6px 14px;
  border-radius: 8px;
  min-width: 260px;
}

.search-icon {
  font-size: 13px;
}

.search-input {
  border: none;
  background: transparent;
  color: var(--text-main);
  font-size: 13px;
  outline: none;
  width: 100%;
}

.filter-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px dashed var(--border-color);
}

.count-hint {
  font-size: 12.5px;
  color: var(--text-muted);
}

.count-hint strong {
  color: var(--primary);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 20px;
}

@media (max-width: 640px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
}

.article-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}

.article-meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.category-tag {
  background: var(--primary-light);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 700;
  border: 1px solid var(--primary);
}

.date-badge {
  color: var(--text-soft);
}

.draft-badge {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.article-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.4;
}

.article-title a {
  color: var(--text-main);
  text-decoration: none;
  transition: color 0.2s ease;
}

.article-title a:hover {
  color: var(--primary);
}

.article-summary {
  font-size: 13.5px;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 10px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--text-muted);
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.empty-card {
  text-align: center;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-icon {
  font-size: 36px;
}
</style>
