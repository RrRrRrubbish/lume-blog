<template>
  <!-- ====================================================================
       404 错误兜底视图组件 (NotFoundView.vue)
       实验三任务要求：创建 404 页面并配置通配符路由 /:pathMatch(.*)*
       ==================================================================== -->
  <div class="card not-found-view">
    <div class="not-found-content">
      <span class="error-code">404</span>
      <h2 class="error-title">页面未找到 (Page Not Found)</h2>
      <p class="error-desc">
        抱歉，你访问的路由路径 <code class="error-path">{{ route.fullPath }}</code> 在本博客中不存在或已被移除。
      </p>

      <div class="error-actions">
        <button class="btn btn-outline" @click="handleGoBack">
          ⬅ 返回上一页 (router.go(-1))
        </button>
        <button class="btn btn-primary" @click="handleGoHome">
          🏠 返回博客首页 (router.push)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const handleGoBack = () => {
  console.log('[编程式导航] 404 页面执行 router.go(-1)')
  router.go(-1)
}

const handleGoHome = () => {
  console.log('[编程式导航] 404 页面执行 router.push({ name: "home" })')
  router.push({ name: 'home' })
}
</script>

<style scoped>
.not-found-view {
  padding: 60px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 500px;
}

.error-code {
  font-size: 80px;
  font-weight: 900;
  color: var(--primary);
  line-height: 1;
  letter-spacing: -2px;
}

.error-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-main);
}

.error-desc {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
}

.error-path {
  background: var(--bg-hover);
  color: #ef4444;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-family: monospace;
}

.error-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
