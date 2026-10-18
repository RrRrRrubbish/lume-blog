<template>
  <!-- ====================================================================
       单个技能卡片组件 (SkillCard.vue)
       通信技术：
       - defineProps: 接收单个技能项对象进行展示
       ==================================================================== -->
  <div class="skill-card">
    <div class="skill-header">
      <span class="skill-name">
        <span>{{ skill.icon }}</span>
        <span>{{ skill.name }}</span>
      </span>
      <span class="skill-level-badge" :class="getLevelClass(skill.level)">
        {{ skill.level }}
      </span>
    </div>

    <p class="skill-desc">{{ skill.description }}</p>

    <div class="skill-tags">
      <span 
        v-for="(tag, tagIndex) in skill.tags" 
        :key="tagIndex" 
        class="skill-subtag"
      >
        #{{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  skill: {
    type: Object,
    required: true
  }
})

// 根据熟练度动态计算徽章样式类
const getLevelClass = (level) => {
  switch (level) {
    case '精通': return 'level-master'
    case '熟练': return 'level-skilled'
    default: return 'level-learning'
  }
}
</script>

<style scoped>
.skill-card {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s;
}

.skill-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-weight: 700;
  font-size: 15px;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 6px;
}

.skill-level-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.level-master { background: #dcfce7; color: #166534; }
.level-skilled { background: #dbeafe; color: #1e40af; }
.level-learning { background: #fef9c3; color: #854d0e; }

.skill-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.skill-subtag {
  font-size: 11px;
  padding: 1px 6px;
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 4px;
}
</style>
