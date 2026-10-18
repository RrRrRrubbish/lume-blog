<template>
  <div class="about-view">
    <!-- 1. 博主个人主档案卡片 (el-card, el-avatar, el-tag) -->
    <el-card shadow="hover" class="about-card">
      <div class="about-header">
        <el-avatar :size="84" :src="profile.avatar" class="author-avatar" />
        <div class="author-title-group">
          <div class="badge-row">
            <el-tag type="primary" effect="dark" round size="small">博主个人档案</el-tag>
            <el-tag type="info" effect="plain" round size="small">24计科1班 · 蓝健涛</el-tag>
            <el-tag type="success" effect="light" round size="small">Vue 3 + Element Plus 全栈重构版</el-tag>
          </div>
          <h1 class="author-name">{{ profile.name }}</h1>
          <p class="author-role">{{ profile.role }} · {{ profile.major }}</p>
        </div>
      </div>

      <!-- 核心信息网格 -->
      <div class="info-grid">
        <div class="info-item">
          <span class="item-label">👤 真实姓名</span>
          <strong class="item-val">{{ profile.name }}</strong>
        </div>
        <div class="info-item">
          <span class="item-label">🆔 本人学号</span>
          <strong class="item-val">{{ profile.studentId }}</strong>
        </div>
        <div class="info-item">
          <span class="item-label">🏫 所属班级</span>
          <strong class="item-val">{{ profile.class }}</strong>
        </div>
        <div class="info-item">
          <span class="item-label">📖 实践课程</span>
          <strong class="item-val">[20212144] Web前端框架程序设计</strong>
        </div>
      </div>

      <!-- 个人简介与技术追求 -->
      <div class="content-section">
        <h3 class="section-title">🌟 个人简介与技术追求</h3>
        <p class="section-para">{{ profile.bio }}</p>
        <p class="section-para">{{ profile.detailedIntro }}</p>
      </div>

      <!-- ================================================================
           2. 实验四核心新增：个人成长历程与技术实践时间线 (el-timeline)
           ================================================================ -->
      <div class="content-section timeline-section">
        <div class="timeline-header-row">
          <h3 class="section-title">⏳ 个人技术成长与课程实训里程碑</h3>
          <el-tag type="warning" size="small" effect="plain">Element Plus 时间线组件驱动</el-tag>
        </div>
        <p class="section-para">
          记录在大学本科计算机专业学习期间，从前端开发新手到掌握 Vue 3 工程化全栈技术栈的关键推进轨迹：
        </p>

        <el-timeline class="growth-timeline">
          <el-timeline-item
            v-for="(item, index) in growthTimeline"
            :key="index"
            :timestamp="item.timestamp"
            :type="item.type"
            :hollow="item.hollow"
            placement="top"
          >
            <div class="timeline-card">
              <div class="timeline-title-row">
                <span class="timeline-title">{{ item.title }}</span>
                <el-tag :type="item.tagType" size="small" effect="light">{{ item.tag }}</el-tag>
              </div>
              <p class="timeline-desc">{{ item.desc }}</p>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 3. 实验成果总结 (el-alert) -->
      <div class="content-section">
        <h3 class="section-title">🚀 实验四：Pinia 状态管理与 Element Plus 综合应用成果</h3>
        <el-alert
          title="实验四核心架构亮点总结"
          type="success"
          :closable="false"
          show-icon
          description="系统基于 Pinia 重构数据层（userStore、articleStore、projectStore），结合 localStorage 实现全站持久化与路由守卫拦截；深度集成 Element Plus 组件库（涵盖 el-menu、el-timeline、el-table、el-dialog、el-form、el-card 等超 15 种核心组件），全面通过 GitHub Actions 自动化构建并稳定交付 GitHub Pages。"
        />

        <ul class="achievement-list">
          <li><strong>Pinia 全局集中管理：</strong>将博主资料、文章知识库、实战项目库完全交由 Store 驱动，替代局部传参；</li>
          <li><strong>响应式安全解构：</strong>规范使用 <code>storeToRefs</code> 保持响应式同步，全站增删改查实现无刷新联动；</li>
          <li><strong>数据持久化机制：</strong>深入集成 <code>localStorage</code>，解决单页面应用页面刷新数据重置痛点；</li>
          <li><strong>全局路由鉴权拦截：</strong>在 <code>router.beforeEach</code> 守卫中动态读取 <code>useUserStore()</code> 阻断未授权访问；</li>
          <li><strong>Element Plus 深度重构：</strong>全站统一采用 Element Plus 现代设计语言，交互质感与规范性全面升级；</li>
          <li><strong>GitHub Actions 持续部署：</strong>配置 <code>.github/workflows/deploy.yml</code>，自动化打包交付 GitHub Pages。</li>
        </ul>
      </div>

      <!-- 底部快捷跳转 (el-button) -->
      <div class="about-footer">
        <RouterLink :to="{ name: 'home' }">
          <el-button :icon="ArrowLeft">返回个人主页</el-button>
        </RouterLink>
        <div class="footer-right-btns">
          <RouterLink :to="{ name: 'articles-list' }">
            <el-button type="success" plain :icon="Reading">阅读技术博文</el-button>
          </RouterLink>
          <RouterLink :to="{ name: 'projects-list' }">
            <el-button type="primary" :icon="Position">浏览项目中心</el-button>
          </RouterLink>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ArrowLeft, Reading, Position } from '@element-plus/icons-vue'
import { useUserStore } from '../stores'

const userStore = useUserStore()
// 使用 storeToRefs 保持响应式解构
const { profile } = storeToRefs(userStore)

// 个人成长里程碑时间线数据 (Element Plus el-timeline)
const growthTimeline = [
  {
    title: '🎓 计算机专业启航 · 夯实全栈基础',
    timestamp: '2024.09',
    type: 'primary',
    hollow: false,
    tag: '基础奠基',
    tagType: 'primary',
    desc: '考入计算机科学与技术专业本科，系统研读数据结构、计算机网络及现代 Web 核心技术规范。'
  },
  {
    title: '💻 前端工程化初探 · 现代化交互界面',
    timestamp: '2025.03',
    type: 'success',
    hollow: true,
    tag: '工程进阶',
    tagType: 'success',
    desc: '熟练掌握 HTML5 语义化、CSS3 Flex/Grid 响应式设计与 ES6+ 现代 JavaScript 特性，开发首个响应式站点。'
  },
  {
    title: '⚡ Vue 3 核心生态深耕 · 组合式架构',
    timestamp: '2025.10',
    type: 'warning',
    hollow: true,
    tag: '框架实战',
    tagType: 'warning',
    desc: '全面转向 Vue 3 组合式 API (Composition API) 与 Vite 极速构建体系，掌握单文件组件响应式设计。'
  },
  {
    title: '🚀 路由体系与权限控制 · 实验三攻坚',
    timestamp: '2026.03',
    type: 'danger',
    hollow: true,
    tag: '路由工程化',
    tagType: 'danger',
    desc: '深度实现 Vue Router 4 声明式/编程式导航、动态传参、多级嵌套路由及全局导航守卫动态鉴权。'
  },
  {
    title: '📦 Pinia 全局状态与 Element Plus 重构 · 实验四全貌',
    timestamp: '2026.10',
    type: 'primary',
    hollow: false,
    tag: '企业级演进',
    tagType: 'primary',
    desc: '重构 Lume Blog：全面解耦 Pinia 状态层，落地数据持久化，深度重构超 15 种 Element Plus 企业级 UI 组件。'
  },
  {
    title: '🌐 GitHub Actions 持续集成与 Pages 全球上线',
    timestamp: '2026.10',
    type: 'success',
    hollow: false,
    tag: '云端部署',
    tagType: 'success',
    desc: '配置自动化 CI/CD 流水线，代码推送至 GitHub 即刻触发自动测试与打包，稳定交付 GitHub Pages 线上预览。'
  }
]
</script>

<style scoped>
.about-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-card {
  border-radius: 12px;
}

.about-header {
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 20px;
  flex-wrap: wrap;
}

.author-avatar {
  border: 2px solid var(--primary);
  background: var(--bg-hover);
}

.badge-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.author-name {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: var(--text-main);
}

.author-role {
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--text-muted);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  background: var(--bg-hover);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin: 20px 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 12px;
  color: var(--text-muted);
}

.item-val {
  font-size: 14px;
  color: var(--text-main);
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.timeline-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
}

.section-para {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-muted);
}

/* 时间线样式 */
.growth-timeline {
  padding: 16px 8px 0;
}

.timeline-card {
  background: var(--bg-hover);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 4px;
}

.timeline-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.timeline-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--text-main);
}

.timeline-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

.achievement-list {
  padding-left: 20px;
  margin: 8px 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13.5px;
  color: var(--text-main);
  line-height: 1.6;
}

.achievement-list code {
  background: var(--bg-hover);
  color: var(--primary);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.about-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 12px;
}

.footer-right-btns {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
