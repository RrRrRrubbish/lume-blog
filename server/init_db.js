const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '123456',
  multipleStatements: true
};

const DB_NAME = 'lume_blog_db';

const initialProjects = [
  {
    name: 'Lume Blog 个人博客与知识空间',
    category: '前端工程',
    description: '采用 Vue 3 单文件组件 (SFC)、Vue Router 4 与 Pinia 现代化工程架构构建，具备亮暗色主题、动态路由、文章知识库及后台权限管理。',
    full_detail: '本项目是《Web前端框架程序设计》课程的核心实验载体。在实验一、实验二、实验三的基础上，实验四全面接入 Pinia 状态管理，重构了跨组件、跨页面状态共享逻辑。系统支持文章与项目信息的完整增删改查、localStorage 手动持久化，并配置了 beforeEach 全局前置守卫对敏感后台实施权限拦截。实验五进一步将数据持久化迁移至 MySQL 数据库，由 Express 提供 RESTful 规范接口。',
    highlights: JSON.stringify([
      'Pinia 集中式状态管理与 storeToRefs 响应式解构',
      'Vue Router 4 声明式与编程式双模导航',
      '嵌套子路由架构与统一布局容器',
      '全局前置路由守卫与动态标题注入',
      'Express + MySQL2 连接池实现 RESTful 接口全栈交付'
    ]),
    technologies: JSON.stringify(['Vue 3', 'Pinia', 'Vue Router 4', 'Vite', 'Node.js', 'Express', 'MySQL 8.0']),
    status: '已完成',
    progress: 100,
    has_demo: 1,
    start_date: '2026-09-15',
    end_date: '2026-10-13'
  },
  {
    name: '学生成绩与学分统计分析系统',
    category: '数据可视化',
    description: '面向高校学子设计的学业成绩数据追踪与绩点可视化分析看板，支持快捷查询与图表直观展示。',
    full_detail: '针对高校学分绩点计算繁琐、历史成绩难以纵向对比的痛点开发。系统基于 Vue 3 + ECharts 绘制课程雷达图与每学期 GPA 走向折线图。支持导入成绩单自动生成预警提示，助力大学生清晰规划学业目标。',
    highlights: JSON.stringify([
      'ECharts 动态响应式图表看板',
      '学分加权平均分智能核算引擎',
      '挂科预警与薄弱科目雷达透视'
    ]),
    technologies: JSON.stringify(['Vue 3', 'ECharts', 'Pinia', 'TypeScript']),
    status: '进行中',
    progress: 85,
    has_demo: 0,
    start_date: '2026-09-20',
    end_date: '2026-11-15'
  },
  {
    name: '校园二手图书与闲置物品流转平台',
    category: '全栈应用',
    description: '包含物品分类检索、个人主页展示、在线留言意向沟通等核心功能，打造绿色循环校园生态。',
    full_detail: '为解决高校毕业生教材教材堆积与新生购书成本高的问题，打造了这款校园轻量闲置交易 Web 应用。采用 RESTful API 规范，支持按专业教材快速检索、一键收藏与校内当面交易意向预约，倡导低碳环保校园生活。',
    highlights: JSON.stringify([
      '图书 ISBN 扫码与快速录入',
      '实时留言意向交互卡片',
      '校区定位与自提地点智能推荐'
    ]),
    technologies: JSON.stringify(['Vue 3', 'REST API', 'Node.js', 'CSS Grid', 'Flexbox']),
    status: '进行中',
    progress: 60,
    has_demo: 1,
    start_date: '2026-09-28',
    end_date: '2026-12-01'
  },
  {
    name: '程序员极简技术周刊订阅聚合器',
    category: '工具效率',
    description: '聚合 GitHub 热门趋势、掘金优质技术博客与前端前沿动态，支持离线阅读标记与 RSS 订阅源定制。',
    full_detail: '旨在解决日常技术资讯获取碎片化、低效化问题。该聚合器支持自定义订阅源，通过异步任务定时拉取优质前端前沿资讯，支持暗色护眼阅读模式、技术文章重点笔记高亮标注及一键导出为 Markdown 格式。',
    highlights: JSON.stringify([
      '多源 RSS 异步订阅聚合与分类清洗',
      '全文本地缓存与离线已读标记',
      '优雅的排版排版与代码块高亮'
    ]),
    technologies: JSON.stringify(['Vue 3', 'Web Storage API', 'Fetch API', 'Markdown解析']),
    status: '进行中',
    progress: 70,
    has_demo: 1,
    start_date: '2026-10-01',
    end_date: '2026-11-30'
  }
];

const initialArticles = [
  {
    title: 'Vue 3 组合式 API (<script setup>) 最佳工程实践',
    author: '蓝健涛',
    category: '前端开发',
    summary: '系统梳理 ref、reactive、computed 以及生命周期钩子在真实工程中的优雅组织形态。',
    content: `组合式 API (Composition API) 为大型前端应用带来了更高的代码复用性和更清晰的关注点分离。

在 <script setup> 语法糖下，无需繁琐地声明 export default 和 return，所有顶层声明的变量和函数均可直接在 template 中使用。

核心建议：
1. 单一职责原则：将复杂业务逻辑拆分为独立的 composables 函数（如 useUserStore / useArticleStore）。
2. 正确解构响应式：对 Store 实例解构时，务必使用 storeToRefs 避免响应性丢失。
3. 状态分层管理：页面内私有状态留在组件内部，跨组件/跨页面状态坚决沉淀进 Pinia Store 中。`,
    status: 'published'
  },
  {
    title: 'Pinia 全局状态管理深度解析与落地指南',
    author: '蓝健涛',
    category: '状态管理',
    summary: '剖析 Pinia 去除 Mutations 后的扁平架构，配合 storeToRefs 与 localStorage 持久化。',
    content: `Pinia 作为 Vue 3 官方推荐的新一代状态管理库，摒弃了 Vuex 繁复冗余的 mutations 设计，精简为 state、getters 与 actions 三大核心要素。

为什么选择 Pinia？
- 极简的 TypeScript 与自动代码补全支持
- 扁平模块化：每个 Store 都是独立的模块，不再有全局命名空间冲突
- 自由组合：actions 支持同步和异步，可直接修改 state

持久化实践：
在 state 初始化时通过 JSON.parse 从 localStorage 读取已保存数据；在 actions 增删改查后通过 JSON.stringify 同步写入本地缓存，页面刷新后即可实现无缝数据恢复。`,
    status: 'published'
  },
  {
    title: 'Vue Router 4 路由守卫与后台动态鉴权实战',
    author: '蓝健涛',
    category: '路由原理',
    summary: '利用 beforeEach 全局前置守卫与路由元信息 meta 实现细粒度的身份校验与标题更新。',
    content: `单页面应用 (SPA) 中的敏感操作入口必须通过路由守卫进行严格控制。

在实验三与实验四的架构中，我们使用了两层保护：
1. 声明式元信息：通过 meta: { requiresAuth: true } 为后台管理路由加锁。
2. 全局前置守卫：在 router.beforeEach 守卫函数内调用 useUserStore() 动态获取登录凭证。若未登录则阻断跳转，并携带 redirect 原始目标路径引导用户前往登录页。

值得注意的是：必须在 beforeEach 回调函数体内调用 useUserStore()，不能在模块顶层直接调用，以确保 Pinia 实例已完全挂载！`,
    status: 'published'
  },
  {
    title: 'CSS 自定义属性与毛玻璃暗色模式系统设计',
    author: '蓝健涛',
    category: '界面设计',
    summary: '利用 CSS Variables 与媒体查询打造高品质全站主题切换方案，兼顾现代毛玻璃质感。',
    content: `现代 Web 设计越来越强调沉浸式的视觉交互与人机体验。

在 Lume Blog 中，我们通过 CSS 自定义属性 (:root / .dark-mode) 构建了统一的设计 Token：
- --bg-gradient: 背景动态渐变色
- --bg-card: 半透明毛玻璃卡片背景 (结合 backdrop-filter: blur)
- --primary: 品牌主色系，暗色下自适应提亮保证对比度

通过监听系统 prefers-color-scheme 以及持久化保存用户的 localStorage 偏好，实现了平滑无缝的主题切换动画。`,
    status: 'published'
  },
  {
    title: '现代前端工程化演进：从 Vite 构建到 GitHub Actions 自动化部署',
    author: '蓝健涛',
    category: '工程化',
    summary: '梳理前端生产环境持续集成 CI/CD 流程，构建现代全栈开发交付标准。',
    content: `前端工程化早已超越单纯的打包压缩，涵盖了依赖管理、代码规范、持续集成与自动化部署的全流程闭环。

核心实践步骤：
1. Vite 极速构建：基于 ES 模块原生的极速冷启动与热更新，大幅缩减本地开发等待时间。
2. 自动化测试与 Lint：提交前触发 ESLint 与 Prettier 校验，确保团队代码风格一致性。
3. GitHub Actions 工作流：配置 main.yml，当代码推送到 master 分支时，自动触发 runner 安装依赖、打包构建并将静态资源发布至 GitHub Pages。`,
    status: 'draft'
  }
];

const initialUsers = [
  {
    username: 'admin',
    password: 'password123',
    nickname: '蓝健涛',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: '专注 Vue 3 与现代前端工程化全栈开发的计算机科学学子'
  }
];

async function init() {
  console.log('🚀 开始连接 MySQL 并初始化数据库...');
  const connection = await mysql.createConnection(DB_CONFIG);

  try {
    // 1. 创建数据库
    console.log(`📦 创建数据库: ${DB_NAME}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${DB_NAME}\`;`);

    // 2. 创建 projects 表
    console.log('🔨 创建数据表: projects');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`projects\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY COMMENT '项目主键编号',
        \`name\` VARCHAR(100) NOT NULL COMMENT '项目名称',
        \`category\` VARCHAR(50) NOT NULL COMMENT '项目分类',
        \`description\` VARCHAR(255) NOT NULL COMMENT '项目简述',
        \`full_detail\` TEXT NULL COMMENT '项目深度详情描述',
        \`highlights\` JSON NULL COMMENT '技术亮点列表(JSON)',
        \`technologies\` JSON NULL COMMENT '技术栈标签(JSON)',
        \`status\` VARCHAR(20) NOT NULL DEFAULT '进行中' COMMENT '项目状态(已完成/进行中)',
        \`progress\` INT NOT NULL DEFAULT 0 COMMENT '完成进度百分比(0-100)',
        \`has_demo\` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否具有在线演示(1是/0否)',
        \`start_date\` DATE NULL COMMENT '启动日期',
        \`end_date\` DATE NULL COMMENT '交付日期',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='个人主页项目作品表';
    `);

    // 3. 创建 articles 表
    console.log('🔨 创建数据表: articles');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`articles\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY COMMENT '文章主键编号',
        \`title\` VARCHAR(150) NOT NULL COMMENT '文章标题',
        \`author\` VARCHAR(50) NOT NULL DEFAULT '蓝健涛' COMMENT '文章作者',
        \`category\` VARCHAR(50) NOT NULL COMMENT '技术分类',
        \`summary\` VARCHAR(255) NOT NULL COMMENT '摘要简述',
        \`content\` MEDIUMTEXT NOT NULL COMMENT 'Markdown文章正文',
        \`status\` VARCHAR(20) NOT NULL DEFAULT 'published' COMMENT '发布状态(published已发布/draft草稿)',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '发表时间',
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='个人主页技术文章表';
    `);

    // 4. 创建 users 表
    console.log('🔨 创建数据表: users');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户主键编号',
        \`username\` VARCHAR(50) NOT NULL UNIQUE COMMENT '登录账号',
        \`password\` VARCHAR(100) NOT NULL COMMENT '登录密码(明文或哈希)',
        \`nickname\` VARCHAR(50) NOT NULL COMMENT '用户姓名/昵称',
        \`role\` VARCHAR(20) NOT NULL DEFAULT 'admin' COMMENT '角色权限',
        \`avatar\` VARCHAR(255) NULL COMMENT '头像地址',
        \`bio\` VARCHAR(255) NULL COMMENT '个性签名/简介',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统管理员与用户信息表';
    `);

    // 5. 清理旧种子数据并重新填充
    console.log('🌱 正在录入实验四内置种子数据...');
    await connection.query('TRUNCATE TABLE `projects`;');
    for (const p of initialProjects) {
      await connection.query(
        `INSERT INTO \`projects\` 
          (name, category, description, full_detail, highlights, technologies, status, progress, has_demo, start_date, end_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, p.category, p.description, p.full_detail, p.highlights, p.technologies, p.status, p.progress, p.has_demo, p.start_date, p.end_date]
      );
    }

    await connection.query('TRUNCATE TABLE `articles`;');
    for (const a of initialArticles) {
      await connection.query(
        `INSERT INTO \`articles\` (title, author, category, summary, content, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [a.title, a.author, a.category, a.summary, a.content, a.status]
      );
    }

    await connection.query('TRUNCATE TABLE `users`;');
    for (const u of initialUsers) {
      await connection.query(
        `INSERT INTO \`users\` (username, password, nickname, role, avatar, bio) VALUES (?, ?, ?, ?, ?, ?)`,
        [u.username, u.password, u.nickname, u.role, u.avatar, u.bio]
      );
    }

    // 验证数据量
    const [[{ projectCount }]] = await connection.query('SELECT COUNT(*) AS projectCount FROM `projects`');
    const [[{ articleCount }]] = await connection.query('SELECT COUNT(*) AS articleCount FROM `articles`');
    const [[{ userCount }]] = await connection.query('SELECT COUNT(*) AS userCount FROM `users`');

    console.log(`✅ 数据库初始化完成！`);
    console.log(`📊 统计数据：项目数=${projectCount}，文章数=${articleCount}，用户数=${userCount}`);

  } catch (err) {
    console.error('❌ 初始化失败:', err);
  } finally {
    await connection.end();
  }
}

init();
