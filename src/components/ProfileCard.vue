<template>
  <!-- ====================================================================
       个人基本信息卡片组件 (ProfileCard.vue)
       通信与状态原则：
       - defineProps: 接收父组件传递的 profile 响应式对象，遵循 props 单向数据流
       - 私有状态: showDetails 保留在组件内部，控制经历详情的展开与收起
       ==================================================================== -->
  <section id="profile" class="card profile-card">
    <div class="profile-header">
      <div class="avatar-wrapper">
        <img :src="profile.avatar" :alt="profile.name" class="avatar-img" />
        <span class="status-dot" title="活跃在线"></span>
      </div>

      <div class="profile-info">
        <div class="profile-name-row">
          <h1 class="profile-name">{{ profile.name }}</h1>
          <span class="profile-role-badge">{{ profile.role }}</span>
        </div>

        <div class="profile-meta">
          <span>🎓 <strong>学号：</strong>{{ profile.studentId }}</span>
          <span>💻 <strong>专业方向：</strong>{{ profile.major }}</span>
        </div>

        <p class="profile-bio">{{ profile.bio }}</p>
      </div>
    </div>

    <!-- 互动操作行 -->
    <div class="profile-actions">
      <div class="social-links">
        <a 
          v-for="link in profile.socialLinks" 
          :key="link.name" 
          :href="link.url" 
          target="_blank" 
          class="social-btn"
        >
          <span>{{ link.icon }}</span>
          <span>{{ link.name }}</span>
        </a>
      </div>

      <!-- 控制内部私有状态：展开/收起更多经历 -->
      <button class="btn btn-outline" @click="toggleDetails">
        <span v-if="showDetails">▲ 收起详细介绍</span>
        <span v-else>▼ 展开更多经历</span>
      </button>
    </div>

    <!-- 详细经历展示盒 (受私有状态 showDetails 控制) -->
    <div v-show="showDetails" class="details-box">
      <h4 style="margin-bottom: 8px;">📖 个人详细经历与学习规划：</h4>
      <p>{{ profile.detailedIntro }}</p>
      <div class="details-grid">
        <div class="detail-item">
          <strong>🎯 本学期目标：</strong>{{ profile.goals }}
        </div>
        <div class="detail-item">
          <strong>💡 兴趣爱好：</strong>{{ profile.hobbies }}
        </div>
        <div class="detail-item">
          <strong>🚀 博客定位：</strong>{{ profile.blogVision }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

/**
 * 外部传入属性：遵循单向数据流
 */
const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})

/**
 * 组件内部私有状态：不影响父组件，独立维护
 */
const showDetails = ref(false)

const toggleDetails = () => {
  showDetails.value = !showDetails.value
}
</script>

<style scoped>
.profile-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #ffffff;
}

.status-dot {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 16px;
  height: 16px;
  background: #10b981;
  border: 3px solid var(--bg-card);
  border-radius: 50%;
}

.profile-info {
  flex: 1;
}

.profile-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.profile-name {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
}

.profile-role-badge {
  font-size: 12px;
  background: var(--primary-light);
  color: var(--primary);
  padding: 2px 10px;
  border-radius: 6px;
  font-weight: 600;
}

.profile-meta {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.profile-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.profile-bio {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
}

.profile-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px dashed var(--border-color);
  padding-top: 16px;
}

.social-links {
  display: flex;
  gap: 10px;
}

.social-btn {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 6px;
  background: var(--tag-bg);
  color: var(--tag-text);
  text-decoration: none;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 4px;
}

.social-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.details-box {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px 20px;
  margin-top: 14px;
  line-height: 1.8;
  font-size: 13px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.detail-item strong {
  color: var(--text-main);
}
</style>
