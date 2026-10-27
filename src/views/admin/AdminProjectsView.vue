<template>
  <!-- ====================================================================
       项目信息管理与运维视图 (AdminProjectsView.vue)
       实验四：Element Plus 组件库重构版
       - 使用 el-card, el-table, el-table-column 展示与管理项目列表
       - 使用 el-slider 实时拖拽更新研发进度，联动 Pinia projectStore
       - 使用 el-select, el-tag, el-button, el-dialog, el-form 实现项目 CRUD
       - 结合 ElMessage 与 ElMessageBox 实现无缝交互反馈
       ==================================================================== -->
  <div class="admin-projects-view">
    <el-card shadow="never" class="projects-card">
      <template #header>
        <div class="card-header">
          <div>
            <h3 class="header-title">🚀 项目作品与研发进度管理</h3>
            <p class="header-subtitle">
              基于 Pinia <code>projectStore</code> 响应式驱动，支持动态拖拽进度条、修改状态与增删项目。
            </p>
          </div>
          <el-button type="primary" :icon="Plus" @click="openAddDialog">
            新增项目作品
          </el-button>
        </div>
      </template>

      <!-- 项目管理数据表格 -->
      <el-table 
        :data="projects" 
        stripe 
        style="width: 100%"
        class="custom-table"
        empty-text="暂无项目数据"
      >
        <el-table-column prop="id" label="ID" width="70" align="center">
          <template #default="{ row }">
            <span class="id-badge">#{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="项目名称与技术栈" min-width="220">
          <template #default="{ row }">
            <div class="project-title-cell">
              <span class="project-name">{{ row.name }}</span>
              <div class="tech-tags">
                <el-tag 
                  v-for="(tech, idx) in row.technologies" 
                  :key="idx" 
                  size="small" 
                  type="info" 
                  effect="light"
                  class="tech-tag"
                >
                  {{ tech }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="category" label="分类" width="120" align="center">
          <template #default="{ row }">
            <el-tag effect="plain" type="primary" round size="small">
              {{ row.category }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="研发进度 (可拖动修改)" min-width="200">
          <template #default="{ row }">
            <div class="slider-wrapper">
              <el-slider 
                :model-value="row.progress" 
                :format-tooltip="val => val + '%'"
                :step="5"
                @change="val => handleProgressChange(row.id, val)"
                class="progress-slider"
              />
              <span class="progress-text">{{ row.progress }}%</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="130" align="center">
          <template #default="{ row }">
            <el-select 
              :model-value="row.status" 
              size="small"
              @change="val => handleStatusChange(row.id, val)"
            >
              <el-option label="进行中" value="进行中">
                <el-tag size="small" type="warning" effect="dark">进行中</el-tag>
              </el-option>
              <el-option label="已完成" value="已完成">
                <el-tag size="small" type="success" effect="dark">已完成</el-tag>
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="info" 
              plain 
              :icon="View" 
              @click="$router.push({ name: 'project-detail', params: { id: row.id } })"
            >
              详情
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              plain 
              :icon="Delete" 
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增项目对话框 -->
    <el-dialog 
      v-model="showAddModal" 
      title="➕ 新增项目作品" 
      width="540px" 
      destroy-on-close
    >
      <el-form :model="newForm" label-position="top" class="project-form">
        <el-form-item label="项目名称" required>
          <el-input v-model.trim="newForm.name" placeholder="请输入项目全称" clearable />
        </el-form-item>

        <div class="form-row-grid">
          <el-form-item label="分类领域" required>
            <el-select v-model="newForm.category" style="width: 100%">
              <el-option label="前端工程" value="前端工程" />
              <el-option label="数据可视化" value="数据可视化" />
              <el-option label="全栈应用" value="全栈应用" />
              <el-option label="工具效率" value="工具效率" />
            </el-select>
          </el-form-item>

          <el-form-item label="初始研发状态" required>
            <el-select v-model="newForm.status" style="width: 100%">
              <el-option label="进行中" value="进行中" />
              <el-option label="已完成" value="已完成" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="技术栈 (逗号分隔)" required>
          <el-input 
            v-model.trim="newForm.techInput" 
            placeholder="如：Vue 3, Element Plus, Pinia" 
            clearable 
          />
        </el-form-item>

        <el-form-item label="简要项目描述" required>
          <el-input 
            v-model.trim="newForm.description" 
            type="textarea" 
            :rows="2" 
            placeholder="简要概括该项目的技术核心与业务价值..." 
          />
        </el-form-item>

        <el-form-item label="详细架构与技术亮点">
          <el-input 
            v-model.trim="newForm.fullDetail" 
            type="textarea" 
            :rows="3" 
            placeholder="描述组件架构设计、响应式状态流、关键功能实现点..." 
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddModal = false">取消</el-button>
          <el-button type="primary" @click="submitAddProject">确认发布新项目</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, View, Delete } from '@element-plus/icons-vue'
import { useProjectStore } from '../../stores'

const projectStore = useProjectStore()
// 使用 storeToRefs 保持响应式
const { projects } = storeToRefs(projectStore)
// 直接解构 actions
const { addProject, updateProject, deleteProject } = projectStore

const showAddModal = ref(false)

// 新建表单初始状态
const newForm = reactive({
  name: '',
  category: '前端工程',
  status: '进行中',
  techInput: '',
  description: '',
  fullDetail: ''
})

const openAddDialog = () => {
  showAddModal.value = true
}

// 动态调整进度
const handleProgressChange = async (id, newProgress) => {
  const val = Number(newProgress)
  await updateProject(id, {
    progress: val,
    status: val >= 100 ? '已完成' : '进行中'
  })
  ElMessage.success({
    message: `项目进度已更新为 ${val}%，并同步写入数据库！`,
    duration: 1500
  })
}

// 修改状态
const handleStatusChange = async (id, newStatus) => {
  await updateProject(id, {
    status: newStatus,
    progress: newStatus === '已完成' ? 100 : 70
  })
  ElMessage.info(`项目状态已切换为【${newStatus}】并同步数据库`)
}

// 删除项目
const handleDelete = (item) => {
  ElMessageBox.confirm(
    `确定要删除项目【${item.name}】吗？删除后前台详情路由将无法访问。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    await deleteProject(item.id)
    ElMessage.success(`已从数据库中成功删除项目【${item.name}】！`)
  }).catch(() => {})
}

// 提交新增项目
const submitAddProject = async () => {
  if (!newForm.name || !newForm.description) {
    ElMessage.warning('请完善项目名称和简要描述！')
    return
  }

  const techArray = newForm.techInput
    .split(/[,，]/)
    .map(t => t.trim())
    .filter(Boolean)

  await addProject({
    name: newForm.name,
    category: newForm.category,
    status: newForm.status,
    progress: newForm.status === '已完成' ? 100 : 50,
    technologies: techArray.length ? techArray : ['Vue 3', 'Element Plus'],
    description: newForm.description,
    fullDetail: newForm.fullDetail || newForm.description,
    highlights: ['基于 Vue 3 SFC 架构设计', 'Pinia 状态持久化', 'Element Plus 深度重构'],
    hasDemo: false
  })

  ElMessage.success(`🎉 项目【${newForm.name}】添加成功并已存入数据库！`)
  showAddModal.value = false

  // 清空表单
  Object.assign(newForm, {
    name: '',
    category: '前端工程',
    status: '进行中',
    techInput: '',
    description: '',
    fullDetail: ''
  })
}
</script>

<style scoped>
.admin-projects-view {
  width: 100%;
}

.projects-card {
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.header-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
}

.header-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-muted);
}

.header-subtitle code {
  color: var(--primary);
  background: var(--bg-hover);
  padding: 2px 6px;
  border-radius: 4px;
}

.id-badge {
  font-family: monospace;
  font-weight: bold;
  color: var(--primary);
}

.project-title-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.project-name {
  font-weight: 600;
  color: var(--text-main);
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tech-tag {
  font-size: 11px;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-slider {
  flex: 1;
}

.progress-text {
  font-size: 12px;
  font-weight: bold;
  color: var(--primary);
  min-width: 36px;
}

.form-row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
