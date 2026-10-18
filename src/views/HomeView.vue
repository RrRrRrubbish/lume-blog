<template>
  <div class="home-view">
    <!-- 1. 个人核心信息卡片 (Pinia userStore 驱动) -->
    <ProfileCard :profile="profile" />

    <!-- 2. 技能栈与搜索板块 (双向绑定搜索关键词) -->
    <SkillsSection 
      v-model="searchKeyword" 
      :skills="skills" 
    />

    <!-- 3. 精选技术文章板块 (Pinia articleStore 驱动) -->
    <div class="card featured-card">
      <div class="featured-header">
        <div>
          <h3 class="featured-title">📚 最新技术博文</h3>
          <p class="featured-desc">
            Pinia 全局状态实时驱动 · 当前已发布 {{ publishedCount }} 篇博文
          </p>
        </div>
        <RouterLink :to="{ name: 'articles-list' }" class="btn btn-primary">
          进入文章专栏 ➜
        </RouterLink>
      </div>

      <!-- 文章精选列表 -->
      <div class="quick-list">
        <div 
          v-for="article in publishedArticles.slice(0, 3)" 
          :key="article.id" 
          class="quick-item"
        >
          <div class="item-info">
            <div class="title-row">
              <span class="category-badge-sm">{{ article.category }}</span>
              <span class="item-name">{{ article.title }}</span>
            </div>
            <span class="item-desc">{{ article.summary }}</span>
          </div>
          <RouterLink 
            :to="{ name: 'article-detail', params: { id: article.id } }" 
            class="btn btn-outline btn-sm"
          >
            阅读 📄
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- 4. 精选项目快速入口卡片 (Pinia projectStore 驱动) -->
    <div class="card featured-card">
      <div class="featured-header">
        <div>
          <h3 class="featured-title">🚀 实战项目精选</h3>
          <p class="featured-desc">当前共收录 {{ projects.length }} 个代表性项目作品，涵盖前端工程化、数据可视化等领域。</p>
        </div>
        <RouterLink :to="{ name: 'projects-list' }" class="btn btn-primary">
          进入项目中心 ➜
        </RouterLink>
      </div>

      <!-- 快捷项目列表 -->
      <div class="quick-list">
        <div 
          v-for="project in projects.slice(0, 3)" 
          :key="project.id" 
          class="quick-item"
        >
          <div class="item-info">
            <span class="item-name">{{ project.name }}</span>
            <span class="item-tags">{{ project.technologies.join(' · ') }}</span>
          </div>
          <RouterLink 
            :to="{ name: 'project-detail', params: { id: project.id } }" 
            class="btn btn-outline btn-sm"
          >
            详情 📄
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import ProfileCard from '../components/ProfileCard.vue'
import SkillsSection from '../components/SkillsSection.vue'
import { skills } from '../store/blogData'
import { useUserStore, useProjectStore, useArticleStore } from '../stores'

const searchKeyword = ref('')

const userStore = useUserStore()
const projectStore = useProjectStore()
const articleStore = useArticleStore()

// 使用 storeToRefs 保持响应式解构
const { profile } = storeToRefs(userStore)
const { projects } = storeToRefs(projectStore)
const { publishedArticles, publishedCount } = storeToRefs(articleStore)
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.featured-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.featured-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.featured-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
}

.featured-desc {
  margin: 4px 0 0;
  font-size: 13.5px;
  color: var(--text-muted);
}

.quick-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-hover);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
  gap: 14px;
}

.quick-item:hover {
  border-color: var(--primary);
  transform: translateX(4px);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.category-badge-sm {
  font-size: 11px;
  background: var(--primary-light);
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.item-name {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--text-main);
}

.item-desc {
  font-size: 12.5px;
  color: var(--text-muted);
  max-width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-tags {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
