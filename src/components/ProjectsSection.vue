<template>
  <!-- ====================================================================
       项目展示板块组件 (ProjectsSection.vue)
       实验二核心技术点：
       - 组件拆分与复用：引入 ProjectCard 可复用卡片组件
       - 插槽深度应用：使用具名插槽 #header、#footer 和默认插槽 #default 定制内容
       - 组合式 API：使用 ref、computed 管理项目列表与分类筛选
       ==================================================================== -->
  <section id="projects" class="card projects-section">
    <!-- 板块标题与统计 -->
    <div class="section-top">
      <div class="title-group">
        <h2 class="section-title">
          <span>🚀 项目作品展示</span>
          <span class="project-badge">实战成果集</span>
        </h2>
        <p class="section-subtitle">
          记录从构想到落地的实战开发全流程 · 当前共收录 {{ projects.length }} 个代表作品
        </p>
      </div>

      <!-- 分类筛选切换 -->
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
    </div>

    <!-- 项目卡片网格列表：复用 ProjectCard 组件，通过插槽分发结构 -->
    <div class="projects-grid">
      <ProjectCard 
        v-for="(project, index) in filteredProjects" 
        :key="project.id" 
        :project="project"
      >
        <!-- 1. 具名插槽 #header：定制项目编号与标题 -->
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

        <!-- 3. 具名插槽 #footer：定制操作栏按钮 -->
        <template #footer>
          <button class="btn btn-outline" @click="handleShowDetail(project)">
            📄 查看详情
          </button>
          <button 
            v-if="project.hasDemo" 
            class="btn btn-primary" 
            @click="handleOpenDemo(project)"
          >
            🌐 在线演示
          </button>
        </template>
      </ProjectCard>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProjectCard from './ProjectCard.vue'

// 筛选标签定义
const filterTabs = [
  { label: '全部项目', value: 'all' },
  { label: '已完成', value: 'completed' },
  { label: '进行中', value: 'ongoing' }
]

const currentFilter = ref('all')

// 项目作品列表数据
const projects = ref([
  {
    id: 1,
    name: 'Lume Blog 个人博客与知识空间',
    description: '采用 Vue 3 单文件组件 (SFC) 与 Vite 现代化工程架构构建，支持暗色模式、响应式布局及完整组件通信。',
    technologies: ['Vue 3', 'Vite', '组合式API', 'Flex/Grid'],
    status: '已完成',
    progress: 100,
    hasDemo: true
  },
  {
    id: 2,
    name: '学生成绩与学分统计分析系统',
    description: '面向高校学子设计的学业成绩数据追踪与绩点可视化分析看板，支持快捷查询与图表直观展示。',
    technologies: ['Vue 3', 'ECharts', 'Pinia', 'TypeScript'],
    status: '进行中',
    progress: 85,
    hasDemo: false
  },
  {
    id: 3,
    name: '校园二手图书与闲置物品流转平台',
    description: '包含物品分类检索、个人主页展示、在线留言意向沟通等核心功能，打造绿色循环校园生态。',
    technologies: ['Vue 3', 'REST API', 'Node.js', 'CSS动画'],
    status: '进行中',
    progress: 60,
    hasDemo: true
  }
])

// 计算属性：根据当前筛选标签返回过滤后的项目列表
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

// 操作事件
const handleShowDetail = (project) => {
  alert(`【项目详情】\n名称：${project.name}\n状态：${project.status} (${project.progress}%)\n技术栈：${project.technologies.join(', ')}\n简介：${project.description}`)
}

const handleOpenDemo = (project) => {
  alert(`🌐 正在打开【${project.name}】的线上演示环境...`)
}
</script>

<style scoped>
.projects-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.project-badge {
  font-size: 11px;
  font-weight: 600;
  background: var(--primary-light);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--primary);
}

.section-subtitle {
  font-size: 13px;
  color: var(--text-muted);
}

/* 筛选按钮组 */
.filter-group {
  display: flex;
  gap: 6px;
}

.filter-btn {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.filter-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* 卡片网格 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.custom-card-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.proj-no {
  font-size: 11px;
  font-family: monospace;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.5px;
}

.proj-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.4;
}

.status-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
}

.status-completed {
  background: #dcfce7;
  color: #166534;
}

.status-ongoing {
  background: #fef3c7;
  color: #92400e;
}

.proj-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
}

.tech-stack-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  font-size: 11px;
  background: var(--tag-bg);
  color: var(--tag-text);
  padding: 3px 8px;
  border-radius: 4px;
}

/* 进度条 */
.progress-box {
  margin-top: 4px;
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-soft);
  margin-bottom: 4px;
}

.progress-track {
  height: 6px;
  background: var(--bg-input);
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
