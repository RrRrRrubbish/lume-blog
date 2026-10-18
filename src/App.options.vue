<template>
  <div class="app-layout" :class="{ 'dark-mode': isDarkTheme }">
    <!-- ====================================================================
         1. 顶部导航栏 (Navbar)
         ==================================================================== -->
    <header class="navbar">
      <div class="nav-container">
        <a href="#" class="brand">
          <span>🌟 Lume Blog</span>
          <span class="brand-badge">Vue 3 选项式工程项目</span>
        </a>

        <div class="nav-controls">
          <!-- 拓展要求 1: 亮暗色主题切换 (v-on:click) -->
          <button class="btn btn-outline" @click="toggleTheme" title="点击切换亮暗色主题">
            <span v-if="isDarkTheme">☀️ 亮色模式</span>
            <span v-else>🌙 暗色模式</span>
          </button>

          <!-- 拓展要求 2: 编辑个人资料按钮 -->
          <button class="btn btn-primary" @click="openEditModal">
            ✏️ 编辑资料
          </button>
        </div>
      </div>
    </header>

    <!-- ====================================================================
         2. 主体内容展示区
         ==================================================================== -->
    <main class="main-wrapper">
      <!-- 个人基本信息卡片 (Hero Profile) -->
      <section class="card profile-card">
        <div class="profile-header">
          <div class="avatar-wrapper">
            <!-- 指令运用: v-bind:src 绑定动态头像图片 -->
            <img :src="profile.avatar" :alt="profile.name" class="avatar-img" />
            <span class="status-dot" title="活跃在线"></span>
          </div>

          <div class="profile-info">
            <div class="profile-name-row">
              <!-- 插值表达式展示姓名 -->
              <h1 class="profile-name">{{ profile.name }}</h1>
              <span class="profile-role-badge">{{ profile.role }}</span>
            </div>

            <div class="profile-meta">
              <span>🎓 <strong>学号：</strong>{{ profile.studentId }}</span>
              <span>💻 <strong>专业方向：</strong>{{ profile.major }}</span>
                          </div>

            <!-- 插值表达式展示个人简介 -->
            <p class="profile-bio">{{ profile.bio }}</p>
          </div>
        </div>

        <!-- 互动操作行 -->
        <div class="profile-actions">
          <div class="social-links">
            <!-- 指令运用: v-for 循环渲染社交与主页链接，:key 绑定唯一标识 -->
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

          <!-- 指令运用: v-on:click 绑定点击事件，控制个人详情展开与收起 -->
          <button class="btn btn-outline" @click="toggleDetails">
            <span v-if="showDetails">▲ 收起详细介绍</span>
            <span v-else>▼ 展开更多经历</span>
          </button>
        </div>

        <!-- 
          指令运用: v-show 条件渲染控制
          当 showDetails 为 true 时展示，为 false 时自动隐藏 
        -->
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

      <!-- 技能栈与兴趣标签板块 -->
      <section class="card">
        <div class="section-title-row">
          <div class="section-title">
            <span>⚡ 技术技能栈与兴趣领域</span>
            <!-- computed 计算属性展示筛选结果数量 -->
            <small style="font-size: 12px; font-weight: normal; color: var(--text-muted);">
              (共找到 {{ filteredSkills.length }} / {{ skills.length }} 项)
            </small>
          </div>

          <!-- 
            指令运用: v-model 双向数据绑定
            用户在搜索框中输入的关键词，将实时同步给 searchKeyword 变量
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

        <!-- 
          指令运用: v-if / v-else 条件渲染
          当计算属性 filteredSkills 有数据时渲染卡片网格，为空时显示无结果提示
        -->
        <div v-if="filteredSkills.length > 0" class="skills-grid">
          <!-- 
            指令运用: v-for 列表渲染
            循环渲染技能数组，且必须绑定 :key="skill.id" 
          -->
          <div 
            v-for="skill in filteredSkills" 
            :key="skill.id" 
            class="skill-card"
          >
            <div class="skill-header">
              <span class="skill-name">
                <span>{{ skill.icon }}</span>
                <span>{{ skill.name }}</span>
              </span>
              <!-- :class 动态类名绑定 -->
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
        </div>

        <!-- 搜索无结果时的空状态 -->
        <div v-else class="empty-state">
          <p>😿 抱歉，没有找到匹配 "<strong>{{ searchKeyword }}</strong>" 的技能或标签</p>
          <p style="font-size: 12px; margin-top: 6px;">您可以尝试搜索 "Vue"、"前端"、"后端" 或清空输入框~</p>
        </div>

        <!-- 
          指令运用: v-if 显示 watch 监听变化提示
          直观展示 watch 选项对 searchKeyword 属性的实时监听效果
        -->
        <div v-if="watchLogMessage" class="watch-notice">
          <span>👀 <strong>watch 监听中：</strong>{{ watchLogMessage }}</span>
        </div>
      </section>

      <!-- 底部注脚 -->
      <footer class="footer-note">
        <p>Lume Blog © 2026 · 基于 Vue 3 + Vite 工程化单文件组件构建</p>
        <p>架构模式：选项式 API (Options API) · data · methods · computed · watch · mounted</p>
      </footer>
    </main>

    <!-- ====================================================================
         3. 个人资料编辑弹窗模态框 (拓展要求 2)
         ==================================================================== -->
    <div v-if="isEditing" class="modal-backdrop" @click.self="closeEditModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">✏️ 编辑个人基本资料</h3>
          <button class="modal-close" @click="closeEditModal">✕</button>
        </div>

        <form @submit.prevent="saveProfile">
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
            <button type="button" class="btn btn-outline" @click="closeEditModal">取消</button>
            <button type="submit" class="btn btn-primary">保存修改</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * ====================================================================
 * 🌟 Vue 3 选项式 API (Options API) 核心逻辑
 * ====================================================================
 */
export default {
  name: 'App',

  // ------------------------------------------------------------------
  // 1. data 选项：声明响应式数据
  // ------------------------------------------------------------------
  data() {
    return {
      // 拓展要求 1：暗色模式状态
      isDarkTheme: false,

      // 核心要求：控制个人详情“展开/收起”
      showDetails: false,

      // 拓展要求 2：控制资料编辑弹窗显示
      isEditing: false,

      // 核心要求：技能搜索关键词（与搜索框双向绑定）
      searchKeyword: '',

      // 记录 watch 监听输出的提示语
      watchLogMessage: '',

      // 个人基本信息数据对象
      profile: {
        name: '蓝健涛',
        studentId: '249980413',
        role: '软件工程学子 · 前端开发者',
        major: '软件工程专业',
        
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=LanJiantao',
        bio: '热爱探索现代 Web 前端技术与用户体验设计。本学期将以 Lume Blog 为载体，一步步打造属于自己的全功能个人博客与作品集。',
        detailedIntro: '目前大三在读，系统学习了计算机网络、数据结构、Vue.js 核心技术栈。喜欢通过实战项目巩固编程基础，追求简洁高效的代码风格与美观流畅的交互体验。',
        goals: '熟练掌握 Vue 3 全家桶、开发完成 Lume Blog 博客系统',
        hobbies: '代码编程、开源探索、数码科技、轻音乐',
        blogVision: '打造优雅、极简、高交互性的现代个人知识花园',
        socialLinks: [
          { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
          { name: '技术笔记', icon: '📝', url: '#' },
          { name: '邮箱联系', icon: '📧', url: 'mailto:jiantao@example.com' }
        ]
      },

      // 资料编辑表单临时对象
      editForm: {},

      // 技能栈与兴趣数据列表
      skills: [
        {
          id: 1,
          name: 'Vue.js 3',
          icon: '🟢',
          level: '熟练',
          description: '熟悉 Vue 3 响应式原理、选项式/组合式 API 及常用指令与组件通信。',
          tags: ['Vue3', 'MVVM', '前端框架']
        },
        {
          id: 2,
          name: 'JavaScript (ES6+)',
          icon: '🟡',
          level: '熟练',
          description: '掌握 Promise、Async/Await、解构赋值与模块化开发。',
          tags: ['JS', 'ES6', '核心基础']
        },
        {
          id: 3,
          name: 'HTML5 & CSS3',
          icon: '🎨',
          level: '精通',
          description: '熟练掌握语义化标签、Flexbox / Grid 布局与响应式界面适配。',
          tags: ['HTML5', 'CSS3', '响应式布局']
        },
        {
          id: 4,
          name: 'Node.js & Vite',
          icon: '⚡',
          level: '学习中',
          description: '熟悉现代前端构建工具链与包管理器 npm/pnpm 的使用。',
          tags: ['Node', 'Vite', '工具链']
        },
        {
          id: 5,
          name: 'Git 版本控制',
          icon: '🌿',
          level: '熟练',
          description: '掌握 Git 分支管理、提交规范及 GitHub 协作流程。',
          tags: ['Git', '版本管理', '代码协作']
        },
        {
          id: 6,
          name: 'UI / UX 界面设计',
          icon: '✨',
          level: '学习中',
          description: '追求极简视觉风格，注重细节排版与人机交互体验。',
          tags: ['设计', 'UI/UX', '美感']
        }
      ]
    };
  },

  // ------------------------------------------------------------------
  // 2. computed 选项：计算属性
  // ------------------------------------------------------------------
  computed: {
    // 核心要求：按关键词实时过滤技能列表
    filteredSkills() {
      const keyword = this.searchKeyword.toLowerCase().trim();
      if (!keyword) {
        return this.skills;
      }
      return this.skills.filter(skill => {
        const nameMatch = skill.name.toLowerCase().includes(keyword);
        const descMatch = skill.description.toLowerCase().includes(keyword);
        const tagMatch = skill.tags.some(tag => tag.toLowerCase().includes(keyword));
        return nameMatch || descMatch || tagMatch;
      });
    }
  },

  // ------------------------------------------------------------------
  // 3. watch 选项：数据侦听器
  // ------------------------------------------------------------------
  watch: {
    // 核心要求：监听 searchKeyword 变化并输出日志
    searchKeyword(newVal, oldVal) {
      console.log(`[Watch 监听触发] 搜索关键词由 "${oldVal}" 变为 "${newVal}"`);
      if (newVal) {
        this.watchLogMessage = `正在筛选包含 "${newVal}" 的技能标签（共 ${this.filteredSkills.length} 项匹配）`;
      } else {
        this.watchLogMessage = `搜索关键词已清空，恢复完整展示全部 ${this.skills.length} 项技能`;
      }
    }
  },

  // ------------------------------------------------------------------
  // 4. methods 选项：业务处理方法
  // ------------------------------------------------------------------
  methods: {
    // 核心要求：切换个人详情展示状态
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },

    // 拓展要求 1：切换暗色/亮色主题
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      console.log(`[主题切换] 当前主题已切换为：${this.isDarkTheme ? '🌙 暗色模式' : '☀️ 亮色模式'}`);
    },

    // 拓展要求 2：打开编辑模态框
    openEditModal() {
      this.editForm = { ...this.profile };
      this.isEditing = true;
    },

    // 关闭模态框
    closeEditModal() {
      this.isEditing = false;
    },

    // 保存个人资料
    saveProfile() {
      this.profile.name = this.editForm.name;
      this.profile.role = this.editForm.role;
      this.profile.major = this.editForm.major;
      this.profile.avatar = this.editForm.avatar || this.profile.avatar;
      this.profile.bio = this.editForm.bio;
      this.isEditing = false;
      alert('🎉 个人资料修改成功！视图已实时同步更新。');
      console.log('[个人资料更新]', this.profile);
    },

    // 辅助样式方法
    getLevelClass(level) {
      switch (level) {
        case '精通': return 'level-master';
        case '熟练': return 'level-skilled';
        default: return 'level-learning';
      }
    }
  },

  // ------------------------------------------------------------------
  // 5. mounted 选项：生命周期钩子
  // ------------------------------------------------------------------
  mounted() {
    console.log(
      '%c🌟 Lume Blog (Vite + Vue 3 选项式工程) 启动成功！%c',
      'background:#2563eb;color:#fff;padding:4px 8px;border-radius:4px;font-weight:bold;',
      ''
    );
    console.log(`开发者：${this.profile.name} (${this.profile.studentId})`);
    console.log(`专业：${this.profile.major}`);
    console.log('工程化选项式单文件组件 (SFC) 运行就绪！');
  }
};
</script>

<style>
/* ====================================================================
   🌟 全局与暗色/亮色主题变量
   ==================================================================== */
:root {
  --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  --bg-card: rgba(255, 255, 255, 0.9);
  --bg-card-hover: #ffffff;
  --bg-input: #f1f5f9;
  --border-color: #e2e8f0;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --text-soft: #94a3b8;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-light: #eff6ff;
  --tag-bg: #f1f5f9;
  --tag-text: #334155;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
  --modal-mask: rgba(15, 23, 42, 0.5);
}

.dark-mode {
  --bg-gradient: linear-gradient(135deg, #0b0f19 0%, #1e293b 100%);
  --bg-card: rgba(30, 41, 59, 0.85);
  --bg-card-hover: rgba(30, 41, 59, 1);
  --bg-input: #0f172a;
  --border-color: #334155;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-soft: #64748b;
  --primary: #38bdf8;
  --primary-hover: #0ea5e9;
  --primary-light: rgba(56, 189, 248, 0.12);
  --tag-bg: #1e293b;
  --tag-text: #cbd5e1;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 10px 30px -5px rgba(0, 0, 0, 0.5);
  --modal-mask: rgba(0, 0, 0, 0.7);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  min-height: 100vh;
}

.app-layout {
  background: var(--bg-gradient);
  color: var(--text-main);
  min-height: 100vh;
  padding-bottom: 60px;
}

/* 顶部导航栏 */
.navbar {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 14px 24px;
  box-shadow: var(--shadow-sm);
}

.nav-container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
}

.brand-badge {
  font-size: 11px;
  font-weight: 600;
  background: var(--primary-light);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--primary);
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 按钮通用 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary);
  color: #ffffff;
}
.dark-mode .btn-primary {
  color: #0f172a;
}
.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  border-color: var(--border-color);
  color: var(--text-main);
}
.btn-outline:hover {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
}

/* 主容器 */
.main-wrapper {
  max-width: 960px;
  margin: 28px auto 0;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片 */
.card {
  background: var(--bg-card);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: var(--shadow-md);
}

/* 个人信息卡片 */
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

/* 展开详情 */
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

/* 技能与兴趣 */
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

/* 搜索框 */
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

/* 技能卡片 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

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

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 36px 16px;
  color: var(--text-soft);
  font-size: 14px;
}

/* watch 提示 */
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

/* 模态框 */
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
.modal-close:hover { color: var(--text-main); }

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

/* 底部 */
.footer-note {
  text-align: center;
  font-size: 12px;
  color: var(--text-soft);
  margin-top: 10px;
  line-height: 1.6;
}
</style>