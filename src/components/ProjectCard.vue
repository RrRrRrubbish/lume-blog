<template>
  <!-- ====================================================================
       可复用项目卡片组件 (ProjectCard.vue)
       实验二核心技术点：
       - defineProps: 接收父组件传递的项目数据对象
       - 具名插槽 #header: 供父组件定制项目标题、序号与状态徽章
       - 默认插槽 #default: 供父组件定制项目描述与技术标签
       - 具名插槽 #footer: 供父组件定制操作栏按钮，实现样式与逻辑解耦
       ==================================================================== -->
  <article class="project-card">
    <!-- 1. 头部具名插槽 -->
    <header class="card-header">
      <slot name="header" :project="project">
        <!-- 默认后备内容 -->
        <div class="header-main">
          <span class="project-title">{{ project.name }}</span>
        </div>
        <span class="status-badge" :class="project.status === '已完成' ? 'status-done' : 'status-progress'">
          {{ project.status }}
        </span>
      </slot>
    </header>

    <!-- 2. 主体默认插槽 -->
    <div class="card-body">
      <slot :project="project">
        <p class="description">{{ project.description }}</p>
        <div v-if="project.technologies" class="tag-list">
          <span v-for="tag in project.technologies" :key="tag" class="tag-item">{{ tag }}</span>
        </div>
      </slot>
    </div>

    <!-- 3. 底部具名插槽 -->
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" :project="project"></slot>
    </footer>
  </article>
</template>

<script setup>
/**
 * 接收父组件传入的项目数据
 */
const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.project-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.25s ease;
  box-shadow: var(--shadow-sm);
}

.project-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
  background: var(--bg-card-hover);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--border-color);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-footer {
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
}

.status-done {
  background: #dcfce7;
  color: #166534;
}

.status-progress {
  background: #fef3c7;
  color: #92400e;
}
</style>
