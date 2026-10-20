<template>
  <!-- ====================================================================
       根组件 App.vue (组织全局布局、主题与路由视图出口 RouterView)
       实验三架构改造：
       - 将原本集中式单页静态渲染解耦为 Vue Router 驱动的动态视图体系
       - 在 main.main-wrapper 容器中挂载 <RouterView /> 作为主出口
       - 保留亮/暗色双主题响应式控制与公共底部注脚
       ==================================================================== -->
  <div class="app-layout" :class="{ 'dark-mode': isDarkTheme }">
    <!-- 1. 全局顶部导航栏组件 (集成 RouterLink 与鉴权按钮) -->
    <Navbar 
      :is-dark="isDarkTheme" 
      @toggle-theme="toggleTheme" 
    />

    <!-- 2. 主体内容展示区：RouterView 路由组件渲染出口 -->
    <main class="main-wrapper">
      <RouterView />
    </main>

    <!-- 3. 底部公共注脚组件 -->
    <FooterNote 
      :author="profile.name" 
      year="2026" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import Navbar from './components/Navbar.vue'
import FooterNote from './components/FooterNote.vue'
import { useUserStore } from './stores'

const userStore = useUserStore()
const { profile } = storeToRefs(userStore)

// 全局暗色主题响应式状态
const isDarkTheme = ref(false)

// 切换主题模式
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  if (isDarkTheme.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('lume_theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('lume_theme', 'light')
  }
  console.log(`[主题切换] 当前主题已切换为：${isDarkTheme.value ? '🌙 暗色模式' : '☀️ 亮色模式'}`)
}

onMounted(() => {
  // 恢复之前持久化的主题偏好
  const savedTheme = localStorage.getItem('lume_theme')
  if (savedTheme === 'dark') {
    isDarkTheme.value = true
    document.documentElement.classList.add('dark')
  }

  console.log(
    '%c🌟 Lume Blog (Vue Router 4 工程化) 初始化成功！%c',
    'background:#2563eb;color:#fff;padding:4px 8px;border-radius:4px;font-weight:bold;',
    ''
  )
  console.log(`开发者：${profile.name} (${profile.studentId}) · ${profile.class}`)
  console.log('路由表与视图组件体系已全部就绪！')
})
</script>

<style scoped>
/* 主容器排版 */
.main-wrapper {
  max-width: 960px;
  margin: 28px auto 0;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: calc(100vh - 170px);
}
</style>
