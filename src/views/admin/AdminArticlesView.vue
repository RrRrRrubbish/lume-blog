<template>
  <!-- ====================================================================
       后台文章内容管理视图 (AdminArticlesView.vue)
       实验四核心重构点：
       - 基于 Element Plus el-table + el-table-column 渲染文章管理列表
       - 使用 el-dialog + el-form 实现新增与编辑文章
       - 结合 el-tag、el-button、el-input、el-select、el-pagination、el-empty
       - Pinia articleStore 集中管理与持久化，操作实时同步全站
       ==================================================================== -->
  <div class="admin-articles-view">
    <!-- 顶部操作条卡片 (el-card, el-button) -->
    <el-card shadow="hover" class="admin-header-card">
      <div class="header-left">
        <h3 class="section-title">📝 博文内容管理面板</h3>
        <p class="section-subtitle">
          基于 Element Plus 数据表格与表单弹窗组件重构，支持博文的新增、编辑、删除与发布状态无缝切换。
        </p>
      </div>
      <el-button type="primary" :icon="Plus" @click="openAddDialog">
        撰写新文章
      </el-button>
    </el-card>

    <!-- 检索与分类筛选工具卡片 (el-card, el-input, el-select, el-radio-group) -->
    <el-card shadow="hover" class="toolbar-card">
      <div class="toolbar-content">
        <div class="filter-radio-group">
          <el-radio-group v-model="currentTab">
            <el-radio-button value="all">全部文章 ({{ totalCount }})</el-radio-button>
            <el-radio-button value="published">已发布 ({{ publishedCount }})</el-radio-button>
            <el-radio-button value="draft">草稿箱 ({{ draftCount }})</el-radio-button>
          </el-radio-group>
        </div>

        <div class="filter-right-inputs">
          <el-select
            v-model="selectedCategory"
            placeholder="按分类筛选"
            clearable
            style="width: 160px"
          >
            <el-option label="全部分类" value="" />
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>

          <el-input
            v-model.trim="searchKeyword"
            placeholder="按标题或摘要快速检索..."
            clearable
            :prefix-icon="Search"
            style="width: 260px"
          />
        </div>
      </div>
    </el-card>

    <!-- 文章表格展示卡片 (el-card, el-table, el-tag, el-pagination, el-empty) -->
    <el-card shadow="hover" class="list-card">
      <el-table
        :data="paginatedArticles"
        stripe
        border
        style="width: 100%"
        empty-text="暂无匹配文章数据"
      >
        <el-table-column prop="id" label="ID" width="70" align="center" />

        <el-table-column label="文章标题与摘要" min-width="260">
          <template #default="{ row }">
            <div class="table-title">{{ row.title }}</div>
            <div class="table-summary">{{ row.summary }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="category" label="分类" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="primary" effect="plain">{{ row.category }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="author" label="作者" width="100" align="center" />

        <el-table-column label="发布状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'published' ? 'success' : 'info'"
              size="small"
              effect="light"
            >
              {{ row.status === 'published' ? '● 已发布' : '○ 草稿' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="updatedAt" label="更新日期" width="120" align="center" />

        <el-table-column label="管理操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              :icon="row.status === 'published' ? DocumentRemove : DocumentChecked"
              @click="handleToggle(row.id)"
            >
              {{ row.status === 'published' ? '转草稿' : '发布' }}
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              :icon="Edit"
              @click="openEditDialog(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              :icon="Delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 (el-pagination) -->
      <div v-if="filteredArticles.length > 0" class="pagination-box">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredArticles.length"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>

    <!-- ================================================================
         文章编辑/新增对话框 (el-dialog + el-form)
         ================================================================ -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '✏️ 编辑博文内容' : '➕ 撰写并发布新文章'"
      width="680px"
      destroy-on-close
      top="8vh"
    >
      <el-form
        ref="articleFormRef"
        :model="form"
        :rules="formRules"
        label-width="90px"
        status-icon
      >
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入文章标题（例如：Vue 3 组合式 API 实战）"
            clearable
          />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="文章分类" prop="category">
              <el-select v-model="form.category" placeholder="请选择或输入分类" style="width: 100%" filterable allow-create>
                <el-option label="前端开发" value="前端开发" />
                <el-option label="状态管理" value="状态管理" />
                <el-option label="路由原理" value="路由原理" />
                <el-option label="界面设计" value="界面设计" />
                <el-option label="工程化实战" value="工程化实战" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="署名作者" prop="author">
              <el-input v-model="form.author" placeholder="作者姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="文章摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="2"
            placeholder="简要概括文章的核心要点..."
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="文章正文" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="8"
            placeholder="支持 Markdown 格式技术文章正文输入..."
          />
        </el-form-item>

        <el-form-item label="发布状态">
          <el-switch
            v-model="form.isPublished"
            active-text="立即公开（发布）"
            inactive-text="暂存草稿"
            inline-prompt
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :icon="Check" @click="handleSaveArticle(articleFormRef)">
            {{ isEditing ? '保存修改' : '确认发布' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Plus,
  Search,
  Edit,
  Delete,
  Check,
  DocumentChecked,
  DocumentRemove
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useArticleStore } from '../../stores'

const articleStore = useArticleStore()

// 使用 storeToRefs 保持响应式
const {
  articles,
  totalCount,
  publishedCount,
  draftCount,
  categories
} = storeToRefs(articleStore)

// 过滤筛选状态
const currentTab = ref('all')
const searchKeyword = ref('')
const selectedCategory = ref('')

// 分页状态
const currentPage = ref(1)
const pageSize = ref(5)

// 组合过滤后的文章列表
const filteredArticles = computed(() => {
  return articles.value.filter((item) => {
    // 1. Tab 状态筛选
    if (currentTab.value === 'published' && item.status !== 'published') return false
    if (currentTab.value === 'draft' && item.status !== 'draft') return false

    // 2. 分类筛选
    if (selectedCategory.value && item.category !== selectedCategory.value) return false

    // 3. 关键词模糊检索
    if (searchKeyword.value) {
      const q = searchKeyword.value.toLowerCase()
      const inTitle = item.title.toLowerCase().includes(q)
      const inSummary = item.summary.toLowerCase().includes(q)
      if (!inTitle && !inSummary) return false
    }

    return true
  })
})

// 分页切片计算
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredArticles.value.slice(start, start + pageSize.value)
})

// 弹窗表单状态
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const articleFormRef = ref()

const form = reactive({
  title: '',
  author: '蓝健涛',
  category: '前端开发',
  summary: '',
  content: '',
  isPublished: true
})

// 表单验证规则
const formRules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 3, max: 60, message: '标题长度在 3 到 60 个字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择或指定技术分类', trigger: 'change' }
  ],
  author: [
    { required: true, message: '请输入署名作者', trigger: 'blur' }
  ],
  summary: [
    { required: true, message: '请输入文章摘要', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '文章正文不能为空', trigger: 'blur' }
  ]
})

// 打开新增弹窗
const openAddDialog = () => {
  isEditing.value = false
  editingId.value = null
  Object.assign(form, {
    title: '',
    author: '蓝健涛',
    category: '前端开发',
    summary: '',
    content: '',
    isPublished: true
  })
  dialogVisible.value = true
}

// 打开编辑弹窗
const openEditDialog = (row) => {
  isEditing.value = true
  editingId.value = row.id
  Object.assign(form, {
    title: row.title,
    author: row.author,
    category: row.category,
    summary: row.summary,
    content: row.content,
    isPublished: row.status === 'published'
  })
  dialogVisible.value = true
}

// 保存文章（新增/编辑）并校验
const handleSaveArticle = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      const payload = {
        title: form.title,
        author: form.author,
        category: form.category,
        summary: form.summary,
        content: form.content,
        status: form.isPublished ? 'published' : 'draft',
        updatedAt: new Date().toISOString().slice(0, 10)
      }

      if (isEditing.value) {
        articleStore.updateArticle(editingId.value, payload)
        ElMessage.success(`博文【${form.title}】修改成功！`)
      } else {
        articleStore.addArticle(payload)
        ElMessage.success(`新博文【${form.title}】发布成功！已实时同步全站。`)
      }

      dialogVisible.value = false
    } else {
      ElMessage.error('表单输入不完整或格式不正确，请查看红字提示！')
    }
  })
}

// 切换发布/草稿状态 (actions: togglePublish)
const handleToggle = (id) => {
  articleStore.togglePublish(id)
  ElMessage.info('博文发布状态已更新')
}

// 删除文章 (ElMessageBox.confirm + actions: removeArticle)
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要永久删除博文《${row.title}》吗？删除后将无法恢复。`,
    '删除确认警示',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      articleStore.removeArticle(row.id)
      ElMessage.success(`文章《${row.title}》已删除！`)
    })
    .catch(() => {})
}
</script>

<style scoped>
.admin-articles-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-header-card {
  border-radius: 10px;
}

:deep(.admin-header-card .el-card__body) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px 24px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
}

.section-subtitle {
  margin: 6px 0 0;
  font-size: 13.5px;
  color: var(--text-muted);
}

.toolbar-card {
  border-radius: 10px;
}

:deep(.toolbar-card .el-card__body) {
  padding: 14px 20px;
}

.toolbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-right-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.list-card {
  border-radius: 10px;
}

.table-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
}

.table-summary {
  font-size: 12.5px;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pagination-box {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
