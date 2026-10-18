<template>
  <!-- ====================================================================
       个人资料编辑弹窗组件 (EditProfileModal.vue)
       通信技术：
       - defineModel: 双向绑定弹窗的可见性 visible (父组件直接使用 v-model="isEditing")
       - defineProps: 接收待编辑的原始个人资料 initialData
       - defineEmits: 提交保存时派发 save 事件，将修改数据回传父组件更新
       ==================================================================== -->
  <div v-if="visible" class="modal-backdrop" @click.self="closeModal">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">✏️ 编辑个人基本资料</h3>
        <button class="modal-close" @click="closeModal">✕</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-item">
          <label>姓名：</label>
          <input type="text" v-model.trim="editForm.name" required />
        </div>

        <div class="form-item">
          <label>身份标签 / 职业头衔：</label>
          <input type="text" v-model.trim="editForm.role" required />
        </div>

        <div class="form-item">
          <label>专业班级：</label>
          <input type="text" v-model.trim="editForm.major" required />
        </div>

        <div class="form-item">
          <label>头像 URL：</label>
          <input type="text" v-model.trim="editForm.avatar" placeholder="可输入图片在线链接" />
        </div>

        <div class="form-item">
          <label>一句话简介：</label>
          <textarea rows="2" v-model.trim="editForm.bio"></textarea>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline" @click="closeModal">取消</button>
          <button type="submit" class="btn btn-primary">保存修改</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

/**
 * 🌟 使用 defineModel 双向同步弹窗显隐状态
 */
const visible = defineModel({
  type: Boolean,
  default: false
})

/**
 * 外部传入待编辑数据
 */
const props = defineProps({
  initialData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['save'])

// 内部表单副本，避免直接修改 props
const editForm = reactive({})

// 当弹窗打开时，同步初始数据到临时表单
watch(visible, (newVal) => {
  if (newVal) {
    Object.assign(editForm, props.initialData)
  }
})

const closeModal = () => {
  visible.value = false
}

const handleSubmit = () => {
  // 遵循 props 单向数据流，不直接篡改 props，通过 emit 向父组件提交
  emit('save', { ...editForm })
  visible.value = false
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--modal-mask);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 16px;
}

.modal-card {
  background: var(--bg-card-hover);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  animation: modalPop 0.25s ease;
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
}

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-soft);
}
.modal-close:hover { 
  color: var(--text-main); 
}

.form-item {
  margin-bottom: 14px;
}

.form-item label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 6px;
}

.form-item input, .form-item textarea {
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  background: var(--bg-input);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  outline: none;
}
.form-item input:focus, .form-item textarea:focus {
  border-color: var(--primary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
