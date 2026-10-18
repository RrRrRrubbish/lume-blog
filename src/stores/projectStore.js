import { defineStore } from 'pinia'

// ====================================================================
// 项目作品库 Store (projectStore.js)
// 实验四核心技术点：
// - 全局管理项目作品集，实现跨页面共享（前台展示/详情 + 后台项目增删改查）
// - state: projects 初始化优先从 localStorage 读取
// - getters: completedProjects / ongoingProjects / getProjectById 等
// - actions: addProject / updateProject / deleteProject
// - 持久化: 每次修改同步写回 localStorage
// ====================================================================

const PROJECTS_STORAGE_KEY = 'lume_projects'

// 初始内置项目列表
const initialProjects = [
  {
    id: 1,
    name: 'Lume Blog 个人博客与知识空间',
    category: '前端工程',
    description: '采用 Vue 3 单文件组件 (SFC)、Vue Router 4 与 Pinia 现代化工程架构构建，具备亮暗色主题、动态路由、文章知识库及后台权限管理。',
    fullDetail: '本项目是《Web前端框架程序设计》课程的核心实验载体。在实验一、实验二、实验三的基础上，实验四全面接入 Pinia 状态管理，重构了跨组件、跨页面状态共享逻辑。系统支持文章与项目信息的完整增删改查、localStorage 手动持久化，并配置了 beforeEach 全局前置守卫对敏感后台实施权限拦截。',
    highlights: [
      'Pinia 集中式状态管理与 storeToRefs 响应式解构',
      'Vue Router 4 声明式与编程式双模导航',
      '嵌套子路由架构与统一布局容器',
      '全局前置路由守卫与动态标题注入',
      '文章与项目双库数据持久化与实时响应'
    ],
    technologies: ['Vue 3', 'Pinia', 'Vue Router 4', 'Vite', '组合式API', 'CSS变量主题'],
    status: '已完成',
    progress: 100,
    hasDemo: true,
    startDate: '2026-09-15',
    endDate: '2026-10-13'
  },
  {
    id: 2,
    name: '学生成绩与学分统计分析系统',
    category: '数据可视化',
    description: '面向高校学子设计的学业成绩数据追踪与绩点可视化分析看板，支持快捷查询与图表直观展示。',
    fullDetail: '针对高校学分绩点计算繁琐、历史成绩难以纵向对比的痛点开发。系统基于 Vue 3 + ECharts 绘制课程雷达图与每学期 GPA 走向折线图。支持导入成绩单自动生成预警提示，助力大学生清晰规划学业目标。',
    highlights: ['ECharts 动态响应式图表看板', '学分加权平均分智能核算引擎', '挂科预警与薄弱科目雷达透视'],
    technologies: ['Vue 3', 'ECharts', 'Pinia', 'TypeScript'],
    status: '进行中',
    progress: 85,
    hasDemo: false,
    startDate: '2026-09-20',
    endDate: '2026-11-15'
  },
  {
    id: 3,
    name: '校园二手图书与闲置物品流转平台',
    category: '全栈应用',
    description: '包含物品分类检索、个人主页展示、在线留言意向沟通等核心功能，打造绿色循环校园生态。',
    fullDetail: '为解决高校毕业生教材教材堆积与新生购书成本高的问题，打造了这款校园轻量闲置交易 Web 应用。采用 RESTful API 规范，支持按专业教材快速检索、一键收藏与校内当面交易意向预约，倡导低碳环保校园生活。',
    highlights: ['图书 ISBN 扫码与快速录入', '实时留言意向交互卡片', '校区定位与自提地点智能推荐'],
    technologies: ['Vue 3', 'REST API', 'Node.js', 'CSS Grid', 'Flexbox'],
    status: '进行中',
    progress: 60,
    hasDemo: true,
    startDate: '2026-09-28',
    endDate: '2026-12-01'
  },
  {
    id: 4,
    name: '程序员极简技术周刊订阅聚合器',
    category: '工具效率',
    description: '聚合 GitHub 热门趋势、掘金优质技术博客与前端前沿动态，支持离线阅读标记与 RSS 订阅源定制。',
    fullDetail: '旨在解决日常技术资讯获取碎片化、低效化问题。该聚合器支持自定义订阅源，通过异步任务定时拉取优质前端前沿资讯，支持暗色护眼阅读模式、技术文章重点笔记高亮标注及一键导出为 Markdown 格式。',
    highlights: ['多源 RSS 异步订阅聚合与分类清洗', '全文本地缓存与离线已读标记', '优雅的排版排版与代码块高亮'],
    technologies: ['Vue 3', 'Web Storage API', 'Fetch API', 'Markdown解析'],
    status: '进行中',
    progress: 70,
    hasDemo: true,
    startDate: '2026-10-01',
    endDate: '2026-11-20'
  }
]

function loadProjects() {
  try {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('加载本地项目库失败:', e)
  }
  return initialProjects.map(p => ({ ...p }))
}

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: loadProjects()
  }),

  getters: {
    // 项目总数
    totalCount: (state) => state.projects.length,

    // 已完成项目
    completedProjects: (state) =>
      state.projects.filter(p => p.status === '已完成'),

    // 进行中项目
    ongoingProjects: (state) =>
      state.projects.filter(p => p.status === '进行中'),

    // 已完成数量
    completedCount: (state) =>
      state.projects.filter(p => p.status === '已完成').length,

    // 进行中数量
    ongoingCount: (state) =>
      state.projects.filter(p => p.status === '进行中').length,

    // 按编号查询详情
    getProjectById: (state) => (id) =>
      state.projects.find(p => p.id === Number(id)),

    // 获取所有项目分类
    categories: (state) => {
      const set = new Set(state.projects.map(p => p.category).filter(Boolean))
      return ['全部', ...Array.from(set)]
    }
  },

  actions: {
    // 新增项目
    addProject(newProject) {
      const maxId = this.projects.reduce((max, p) => (p.id > max ? p.id : max), 0)
      const project = {
        id: maxId + 1,
        ...newProject,
        startDate: newProject.startDate || new Date().toISOString().split('T')[0]
      }
      this.projects.unshift(project)
      this.persistProjects()
      return project.id
    },

    // 更新项目
    updateProject(id, updatedFields) {
      const index = this.projects.findIndex(p => p.id === Number(id))
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...updatedFields }
        this.persistProjects()
        return true
      }
      return false
    },

    // 删除项目
    deleteProject(id) {
      const index = this.projects.findIndex(p => p.id === Number(id))
      if (index !== -1) {
        this.projects.splice(index, 1)
        this.persistProjects()
        return true
      }
      return false
    },

    // 重置恢复默认项目列表
    resetProjects() {
      this.projects = initialProjects.map(p => ({ ...p }))
      this.persistProjects()
    },

    // 持久化存储至 localStorage
    persistProjects() {
      try {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(this.projects))
      } catch (e) {
        console.error('持久化项目库失败:', e)
      }
    }
  }
})
