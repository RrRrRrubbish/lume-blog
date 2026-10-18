<template>
  <!-- ====================================================================
       底部注脚组件 (FooterNote.vue)
       通信技术：
       - defineProps: 接收父组件传入的版权信息与年份等
       ==================================================================== -->
  <footer class="footer-note">
    <p>Lume Blog © {{ year }} · {{ author }} · 基于 Vue 3 + Vite 工程化单文件组件构建</p>
    <p>架构模式：组件化开发 (SFC) · defineProps · defineEmits · defineModel · 状态分层管理</p>
  </footer>
</template>

<script setup>
const props = defineProps({
  author: {
    type: String,
    default: '蓝健涛'
  },
  year: {
    type: [Number, String],
    default: 2026
  }
})
</script>

<style scoped>
.footer-note {
  text-align: center;
  font-size: 12px;
  color: var(--text-soft);
  margin-top: 10px;
  line-height: 1.6;
}
</style>
