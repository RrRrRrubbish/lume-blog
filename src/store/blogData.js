import { ref } from 'vue'
import { useUserStore, useProjectStore, useArticleStore } from '../stores'

// ====================================================================
// 兼容层与静态技能配置 (src/store/blogData.js)
// 保持历史组件平滑过渡，核心业务状态全面交由 src/stores/*.js (Pinia) 托管
// ====================================================================

// 1. 静态技能栈列表数据（用于首页技能搜索展示）
export const skills = ref([
  {
    id: 1,
    name: 'Vue.js 3 & Pinia & Vue Router 4',
    icon: '🟢',
    level: '熟练',
    description: '掌握组合式 API (<script setup>)、Pinia 集中状态管理、storeToRefs 与路由守卫鉴权。',
    tags: ['Vue3', 'Pinia', 'VueRouter', 'SPA']
  },
  {
    id: 2,
    name: 'JavaScript (ES6+)',
    icon: '🟡',
    level: '熟练',
    description: '深入理解闭包、原型链、Promise 异步编程、解构赋值与模块化规范。',
    tags: ['JS', 'ES6+', '核心基础']
  },
  {
    id: 3,
    name: 'HTML5 & CSS3',
    icon: '🎨',
    level: '精通',
    description: '熟练掌握语义化排版、Flexbox / Grid 弹性布局、媒体查询与现代 CSS 变量规范。',
    tags: ['HTML5', 'CSS3', '响应式布局']
  },
  {
    id: 4,
    name: 'Node.js & Vite',
    icon: '⚡',
    level: '学习中',
    description: '熟悉现代前端工程化脚手架、快速热重载机制与 npm/pnpm 依赖包生态。',
    tags: ['Vite', 'Node', '工程构建']
  },
  {
    id: 5,
    name: 'Git 版本控制',
    icon: '🌿',
    level: '熟练',
    description: '规范掌握分支管理、Git Commit 提交规范、多仓库协同与持续交付流程。',
    tags: ['Git', '版本管理', '代码协作']
  },
  {
    id: 6,
    name: 'UI / UX 界面设计',
    icon: '✨',
    level: '学习中',
    description: '追求极简现代视觉风格，注重信息层级、色彩节奏与丝滑的人机交互体验。',
    tags: ['UI/UX', '设计感', '用户体验']
  }
])
