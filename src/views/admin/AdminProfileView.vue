<template>
  <!-- ====================================================================
       个人简介与档案编辑视图 (AdminProfileView.vue)
       实验三任务要求：设计个人简介或项目信息的编辑页面，配合路由守卫控制入口
       ==================================================================== -->
  <div class="card admin-profile-view">
    <div class="view-header">
      <div>
        <h3 class="view-title">👤 个人简介与核心档案编辑</h3>
        <p class="view-desc">修改博主对外展示的基础资料，提交后将实时更新全局响应式状态。</p>
      </div>
      <button class="btn btn-outline btn-sm" @click="resetForm">
        🔄 重置内容
      </button>
    </div>

    <form class="profile-form" @submit.prevent="handleSave">
      <div class="form-row">
        <div class="form-group">
          <label for="p-name">真实姓名 *</label>
          <input id="p-name" v-model.trim="formData.name" type="text" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="p-id">学号 *</label>
          <input id="p-id" v-model.trim="formData.studentId" type="text" class="form-input" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="p-role">身份定位 / 职业目标 *</label>
          <input id="p-role" v-model.trim="formData.role" type="text" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="p-major">专业班级 *</label>
          <input id="p-major" v-model.trim="formData.major" type="text" class="form-input" required />
        </div>
      </div>

      <div class="form-group">
        <label for="p-bio">一句话座右铭 / 个人签名 *</label>
        <textarea id="p-bio" v-model.trim="formData.bio" rows="2" class="form-textarea" required></textarea>
      </div>

      <div class="form-group">
        <label for="p-detail">深度简介与技术追求 *</label>
        <textarea id="p-detail" v-model.trim="formData.detailedIntro" rows="3" class="form-textarea" required></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="p-goals">本学期学习目标</label>
          <input id="p-goals" v-model.trim="formData.goals" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label for="p-hobbies">兴趣爱好</label>
          <input id="p-hobbies" v-model.trim="formData.hobbies" type="text" class="form-input" />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          💾 保存并同步个人资料
        </button>
        <RouterLink :to="{ name: 'home' }" class="btn btn-outline">
          👀 前往首页查看修改效果
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../../stores'

const userStore = useUserStore()
// 使用 storeToRefs 保持响应式
const { profile } = storeToRefs(userStore)
// 直接解构 action
const { updateProfile } = userStore

// 深拷贝一份当前 profile 数据作为表单初始值
const formData = reactive({
  name: profile.name,
  studentId: profile.studentId,
  role: profile.role,
  major: profile.major,
  bio: profile.bio,
  detailedIntro: profile.detailedIntro,
  goals: profile.goals,
  hobbies: profile.hobbies
})

// 重置表单
const resetForm = () => {
  if (confirm('确定恢复为当前已保存的资料吗？')) {
    Object.assign(formData, {
      name: profile.name,
      studentId: profile.studentId,
      role: profile.role,
      major: profile.major,
      bio: profile.bio,
      detailedIntro: profile.detailedIntro,
      goals: profile.goals,
      hobbies: profile.hobbies
    })
  }
}

// 保存逻辑
const handleSave = () => {
  if (!formData.name || !formData.studentId) {
    alert('⚠️ 姓名与学号为必填项！')
    return
  }

  updateProfile(formData)
  alert('🎉 个人资料已成功保存！前台所有页面将即时同步更新。')
  console.log('[后台管理] 个人档案已同步更新：', formData)
}
</script>

<style scoped>
.admin-profile-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 14px;
}

.view-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
}

.view-desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-muted);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.form-input,
.form-textarea {
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  background: var(--bg-hover);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-main);
  outline: none;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--primary);
  background: var(--bg-card);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.form-textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  flex-wrap: wrap;
}
</style>
