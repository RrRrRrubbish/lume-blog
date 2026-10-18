<template>
  <!-- ====================================================================
       博主身份认证页面 (LoginView.vue)
       实验四：Element Plus 组件库重构版
       - 使用 el-card, el-alert, el-form, el-form-item, el-input, el-button
       - 路由守卫与鉴权配合：未登录访问受限路由时自动跳转并记录 redirect 目标路径
       - 编程式导航 router.replace()：登录成功后替换当前历史栈，直接送达目标页面
       - 采用 ElMessage 给予丝滑的交互反馈
       ==================================================================== -->
  <div class="login-container">
    <el-card shadow="hover" class="login-card">
      <div class="login-header">
        <div class="auth-icon-wrapper">
          <el-icon :size="42" color="#6366f1"><Key /></el-icon>
        </div>
        <h2 class="login-title">博主身份认证</h2>
        <p class="login-subtitle">
          后台管理中心仅对博主 <strong>蓝健涛</strong> 开放，请输入凭证进行身份鉴权
        </p>
      </div>

      <!-- 快速测试提示卡片 -->
      <el-alert
        title="实验测试账号凭证"
        type="info"
        description="账号：lanjiantao ｜ 密码：123456"
        show-icon
        :closable="false"
        class="test-tip"
      />

      <!-- 登录表单 -->
      <el-form 
        :model="loginForm" 
        label-position="top" 
        size="large"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="管理员账号">
          <el-input 
            v-model.trim="loginForm.username" 
            :prefix-icon="User"
            placeholder="请输入管理员账号"
            clearable 
          />
        </el-form-item>

        <el-form-item label="管理员密码">
          <el-input 
            v-model.trim="loginForm.password" 
            type="password"
            :prefix-icon="Lock"
            placeholder="请输入管理员密码"
            show-password
          />
        </el-form-item>

        <el-button 
          type="primary" 
          size="large" 
          :loading="loading" 
          class="login-submit-btn"
          @click="handleLogin"
        >
          {{ loading ? '正在验证身份...' : '确认登录并进入后台' }}
        </el-button>
      </el-form>

      <div class="login-footer">
        <el-button 
          link 
          type="info" 
          :icon="ArrowLeft" 
          @click="$router.push({ name: 'home' })"
        >
          返回前台博客主页
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Key, ArrowLeft } from '@element-plus/icons-vue'
import { useUserStore } from '../stores'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 表单输入状态（预填测试账号便于直接演示）
const loginForm = reactive({
  username: 'lanjiantao',
  password: '123456'
})

const loading = ref(false)

// 提交登录逻辑
const handleLogin = () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('请输入管理员账号与密码！')
    return
  }

  loading.value = true

  setTimeout(() => {
    const res = userStore.login(loginForm.username, loginForm.password)
    loading.value = false

    if (res.success) {
      ElMessage.success('🎉 博主身份验证成功！欢迎进入后台管理中心。')
      
      // 提取重定向目标（如通过路由守卫拦截存入的 query.redirect）
      const redirectPath = route.query.redirect || '/admin/profile'
      console.log(`[编程式导航] 登录成功，执行 router.replace(${redirectPath})`)
      
      // 使用 router.replace 避免浏览器后退回到登录页
      router.replace(redirectPath)
    } else {
      ElMessage.error(res.message || '登录失败，账号或密码错误！')
    }
  }, 400)
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 40px 16px;
}

.login-card {
  width: 100%;
  max-width: 440px;
  border-radius: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 10px 16px;
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.auth-icon-wrapper {
  display: inline-flex;
  padding: 14px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.1);
  margin-bottom: 12px;
}

.login-title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 800;
  color: var(--text-main);
}

.login-subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

.test-tip {
  margin-bottom: 20px;
  border-radius: 8px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-submit-btn {
  width: 100%;
  margin-top: 10px;
  font-weight: 600;
  border-radius: 8px;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px dashed var(--border-color);
}
</style>
