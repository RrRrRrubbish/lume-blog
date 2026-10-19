<template>
  <!-- ====================================================================
       顶部导航栏组件 (Navbar.vue)
       实验四核心重构点：
       - 使用 Element Plus el-menu 与 el-menu-item 实现企业级现代化导航体系
       - 结合 el-badge、el-tag 与 el-avatar 增强视觉层次
       - 集成 Pinia userStore 登录态与 ElMessageBox 退出提示
       ==================================================================== -->
  <header class="navbar">
    <div class="nav-container">
      <!-- 品牌 Logo -->
      <RouterLink :to="{ name: 'home' }" class="brand">
        <img src="/favicon.webp" alt="Lume Blog Logo" class="brand-logo" />
        <span class="brand-text">Lume Blog</span>
        <el-tag type="primary" size="small" effect="light" round>Pinia + Element Plus</el-tag>
      </RouterLink>

      <!-- 核心导航菜单：基于 Element Plus el-menu 实现 -->
      <el-menu
        :default-active="activeRouteName"
        mode="horizontal"
        :ellipsis="false"
        class="nav-el-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="home">
          <el-icon><HomeFilled /></el-icon>
          <span>个人主页</span>
        </el-menu-item>

        <el-menu-item index="projects-list">
          <el-icon><Briefcase /></el-icon>
          <span>项目中心</span>
        </el-menu-item>

        <el-menu-item index="articles-list">
          <el-icon><Document /></el-icon>
          <span>技术文章</span>
        </el-menu-item>

        <el-menu-item index="about">
          <el-icon><User /></el-icon>
          <span>关于博主</span>
        </el-menu-item>

        <el-menu-item index="admin-profile" class="admin-menu-item">
          <el-icon><Setting /></el-icon>
          <span>后台管理</span>
        </el-menu-item>
      </el-menu>

      <!-- 右侧控制区 -->
      <div class="nav-controls">
        <!-- 主题切换按钮 -->
        <el-button
          circle
          :icon="isDark ? Sunny : Moon"
          @click="emit('toggle-theme')"
          :title="isDark ? '切换为亮色模式' : '切换为暗色模式'"
        />

        <!-- 身份认证感知 -->
        <div v-if="isLoggedIn" class="auth-box">
          <el-avatar :size="28" :src="profile?.avatar || defaultAvatar" class="nav-avatar" />
          <el-tag type="success" size="small" effect="plain">{{ bloggerName }}</el-tag>
          <el-button type="danger" link size="small" @click="handleLogout">
            退出
          </el-button>
        </div>

        <RouterLink v-else :to="{ name: 'login' }">
          <el-button type="primary" size="small" round :icon="Key">
            博主登录
          </el-button>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  HomeFilled,
  Briefcase,
  Document,
  User,
  Setting,
  Sunny,
  Moon,
  Key
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import defaultAvatar from '../assets/Ark1.jpg'
import { useUserStore } from '../stores'

const props = defineProps({
  isDark: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-theme'])
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 使用 storeToRefs 保持响应式
const { isLoggedIn, bloggerName, profile } = storeToRefs(userStore)

// 动态高亮当前路由对应菜单项
const activeRouteName = computed(() => {
  const name = route.name || ''
  if (name.startsWith('projects')) return 'projects-list'
  if (name.startsWith('articles')) return 'articles-list'
  if (name.startsWith('admin')) return 'admin-profile'
  return name || 'home'
})

// 菜单点击导航
const handleMenuSelect = (index) => {
  router.push({ name: index })
}

// 退出登录处理 (ElMessageBox)
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出当前博主身份吗？退出后后台管理受限页面将不可直接访问。',
    '退出登录确认',
    {
      confirmButtonText: '确定退出',
      cancelButtonText: '点错了',
      type: 'warning'
    }
  )
    .then(() => {
      userStore.logout()
      ElMessage.success('已成功退出博主登录状态！')
      router.push({ name: 'home' })
    })
    .catch(() => {})
}
</script>

<style scoped>
.navbar {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 4px 24px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-weight: 800;
  font-size: 18px;
  color: var(--text-main);
  flex-shrink: 0;
}

.brand-logo {
  width: 30px;
  height: 30px;
  border-radius: 6px;
}

.brand-text {
  letter-spacing: -0.3px;
}

/* Element Plus 导航菜单深度整合 */
.nav-el-menu {
  border-bottom: none !important;
  background: transparent !important;
  flex: 1;
  justify-content: center;
}

:deep(.el-menu-item) {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted) !important;
  background: transparent !important;
  border-bottom: 2px solid transparent !important;
  padding: 0 16px;
  height: 52px;
  line-height: 52px;
}

:deep(.el-menu-item:hover) {
  color: var(--primary) !important;
  background: var(--bg-hover) !important;
}

:deep(.el-menu-item.is-active) {
  color: var(--primary) !important;
  border-bottom-color: var(--primary) !important;
  font-weight: 700;
}

.admin-menu-item {
  color: #f59e0b !important;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.auth-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-avatar {
  border: 1px solid var(--border-color);
}

@media (max-width: 820px) {
  .nav-el-menu {
    display: none;
  }
}
</style>
