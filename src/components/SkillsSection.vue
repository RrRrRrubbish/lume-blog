<template>
  <!-- ====================================================================
       技能板块容器组件 (SkillsSection.vue)
       通信技术：
       - defineModel: 实现与父组件的搜索词双向绑定 (v-model="searchKeyword")
       - defineProps: 接收父组件传入的技能列表 skills
       - 子组件引用: 内部使用 SkillCard 渲染各个技能卡片
       ==================================================================== -->
  <section id="skills" class="card">
    <div class="section-title-row">
      <div class="section-title">
        <span>⚡ 技术技能栈与兴趣领域</span>
        <!-- computed 计算属性展示筛选结果数量 -->
        <small style="font-size: 12px; font-weight: normal; color: var(--text-muted);">
          (共找到 {{ filteredSkills.length }} / {{ skills.length }} 项)
        </small>
      </div>

      <!-- 
        使用 defineModel 绑定的 searchKeyword
        在输入时自动与父组件双向同步
      -->
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model.trim="searchKeyword" 
          placeholder="按名称或标签搜索技能..." 
          class="search-input"
        />
      </div>
    </div>

    <!-- 技能卡片列表渲染 -->
    <div v-if="filteredSkills.length > 0" class="skills-grid">
      <SkillCard 
        v-for="skill in filteredSkills" 
        :key="skill.id" 
        :skill="skill" 
      />
    </div>

    <!-- 搜索无结果时的空状态 -->
    <div v-else class="empty-state">
      <p>😿 抱歉，没有找到匹配 "<strong>{{ searchKeyword }}</strong>" 的技能或标签</p>
      <p style="font-size: 12px; margin-top: 6px;">您可以尝试搜索 "Vue"、"前端"、"后端" 或清空输入框~</p>
    </div>

    <!-- watch 监听提示信息 -->
    <div v-if="watchLogMessage" class="watch-notice">
      <span>👀 <strong>watch 监听中：</strong>{{ watchLogMessage }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SkillCard from './SkillCard.vue'

/**
 * 外部传入的基础技能数据
 */
const props = defineProps({
  skills: {
    type: Array,
    required: true,
    default: () => []
  }
})

/**
 * 🌟 指导书重点要求：使用 defineModel 实现父子组件双向绑定
 * 父组件可直接通过 v-model="searchKeyword" 实现搜索词双向同步
 */
const searchKeyword = defineModel({
  type: String,
  default: ''
})

// 监听日志提示
const watchLogMessage = ref('')

// 计算属性：根据当前双向绑定的关键词进行技能筛选
const filteredSkills = computed(() => {
  const keyword = (searchKeyword.value || '').toLowerCase().trim()
  if (!keyword) {
    return props.skills
  }
  return props.skills.filter(skill => {
    const nameMatch = skill.name.toLowerCase().includes(keyword)
    const descMatch = skill.description.toLowerCase().includes(keyword)
    const tagMatch = skill.tags.some(tag => tag.toLowerCase().includes(keyword))
    return nameMatch || descMatch || tagMatch
  })
})

// 侦听器：监听 searchKeyword 变化并记录反馈
watch(searchKeyword, (newVal, oldVal) => {
  console.log(`[Watch 监听触发] 搜索关键词由 "${oldVal || ''}" 变为 "${newVal || ''}"`)
  if (newVal) {
    watchLogMessage.value = `正在筛选包含 "${newVal}" 的技能标签（共 ${filteredSkills.value.length} 项匹配）`
  } else {
    watchLogMessage.value = `搜索关键词已清空，恢复完整展示全部 ${props.skills.length} 项技能`
  }
})
</script>

<style scoped>
.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-box {
  position: relative;
  min-width: 240px;
}

.search-input {
  width: 100%;
  padding: 8px 14px 8px 34px;
  font-size: 13px;
  background: var(--bg-input);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  outline: none;
}
.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: var(--text-soft);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.empty-state {
  text-align: center;
  padding: 36px 16px;
  color: var(--text-soft);
  font-size: 14px;
}

.watch-notice {
  background: var(--primary-light);
  border: 1px solid var(--primary);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 12px;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
}
</style>
