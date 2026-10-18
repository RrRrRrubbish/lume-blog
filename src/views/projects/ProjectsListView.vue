<template>
  <div class="projects-list-view">
    <!-- 分类筛选栏 -->
    <div class="card filter-card">
      <div class="filter-group">
        <button 
          v-for="tab in filterTabs" 
          :key="tab.value"
          class="filter-btn" 
          :class="{ active: currentFilter === tab.value }"
          @click="currentFilter = tab.value"
        >
          {{ tab.label }} ({{ getFilterCount(tab.value) }})
        </button>
      </div>

      <span class="count-hint">
        显示 {{ filteredProjects.length }} / {{ projects.length }} 个项目作品
      </span>
    </div>

    <!-- 项目卡片网格列表：复用 ProjectCard 组件，通过插槽分发结构 -->
    <div class="projects-grid">
      <ProjectCard 
        v-for="(project, index) in filteredProjects" 
        :key="project.id" 
        :project="project"
      >
        <!-- 1. 具名插槽 #header：定制编号与标题 -->
        <template #header>
          <div class="custom-card-header">
            <span class="proj-no">PROJECT {{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="proj-title">{{ project.name }}</h3>
          </div>
          <span 
            class="status-pill" 
            :class="project.status === '已完成' ? 'status-completed' : 'status-ongoing'"
          >
            {{ project.status }}
          </span>
        </template>

        <!-- 2. 默认插槽 #default：定制项目介绍、技术栈与进度条 -->
        <template #default>
          <p class="proj-desc">{{ project.description }}</p>
          
          <div class="tech-stack-row">
            <span v-for="tag in project.technologies" :key="tag" class="tech-tag">
              ⚡ {{ tag }}
            </span>
          </div>

          <!-- 进度展示条 -->
          <div class="progress-box">
            <div class="progress-meta">
              <span>项目研发完成度</span>
              <strong>{{ project.progress }}%</strong>
            </div>
            <div class="progress-track">
              <div 
                class="progress-fill" 
                :style="{ width: project.progress + '%' }"
                :class="{ 'fill-done': project.status === '已完成' }"
              ></div>
            </div>
          </div>
        </template>

        <!-- 3. 具名插槽 #footer：使用编程式导航 useRouter().push() 跳转至详情页 -->
        <template #footer>
          <button class="btn btn-outline" @click="goToDetail(project.id)">
            📄 编程式跳转详情
          </button>
          <RouterLink 
            :to="{ name: 'project-detail', params: { id: project.id } }" 
            class="btn btn-primary"
          >
            🔍 声明式详情
          </RouterLink>
        </template>
      </ProjectCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import ProjectCard from '../../components/ProjectCard.vue'
import { useProjectStore } from '../../stores'

const router = useRouter()
const projectStore = useProjectStore()
// 使用 storeToRefs 保持响应式
const { projects } = storeToRefs(projectStore)

// 筛选标签定义
const filterTabs = [
  { label: '全部项目', value: 'all' },
  { label: '已完成', value: 'completed' },
  { label: '进行中', value: 'ongoing' }
]

const currentFilter = ref('all')

// 计算属性：过滤项目列表
const filteredProjects = computed(() => {
  if (currentFilter.value === 'completed') {
    return projects.value.filter(p => p.status === '已完成')
  }
  if (currentFilter.value === 'ongoing') {
    return projects.value.filter(p => p.status === '进行中')
  }
  return projects.value
})

// 统计不同状态的项目数量
const getFilterCount = (type) => {
  if (type === 'completed') return projects.value.filter(p => p.status === '已完成').length
  if (type === 'ongoing') return projects.value.filter(p => p.status === '进行中').length
  return projects.value.length
}

// ====================================================================
// 实验三任务要求：使用 useRouter() 实现编程式导航 push()
// ====================================================================
const goToDetail = (id) => {
  console.log(`[编程式导航] 使用 router.push() 跳转到项目详情，ID = ${id}`)
  router.push({
    name: 'project-detail',
    params: { id }
  })
}
</script>

<style scoped>
.projects-list-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 20px;
}

.filter-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.filter-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
}

.count-hint {
  font-size: 12.5px;
  color: var(--text-muted);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;
}

/* 复用卡片头部与状态样式 */
.custom-card-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.proj-no {
  font-size: 11px;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.5px;
}

.proj-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.4;
}

.status-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  align-self: flex-start;
}

.status-completed {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.status-ongoing {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}

.proj-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-muted);
}

.tech-stack-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  font-size: 11px;
  background: var(--bg-hover);
  color: var(--text-main);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.progress-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: var(--bg-hover);
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
}

.progress-meta strong {
  color: var(--primary);
}

.progress-track {
  height: 6px;
  background: var(--border-color);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #f59e0b;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.progress-fill.fill-done {
  background: #10b981;
}
</style>
