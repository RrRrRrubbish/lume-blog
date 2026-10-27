// ====================================================================
// Express 服务端主入口文件 (index.js)
// 实验五核心技术点：
// - 基于 Express 搭建 RESTful Web 服务
// - 配置 cors 允许前端 Vue 应用跨域网络访问
// - 自动解析 application/json 请求体
// - 模块化挂载 projects、articles、auth 与 export 路由
// - 托管 apidoc 生成的 HTML 在线接口文档
// ====================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('./config/db');
const { success, error } = require('./utils/response');

const projectsRouter = require('./routes/projects');
const articlesRouter = require('./routes/articles');
const authRouter = require('./routes/auth');
const exportRouter = require('./routes/export');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. 全局中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. 静态托管 apidoc 生成的 HTML 文档
app.use('/apidoc', express.static(path.join(__dirname, 'public/apidoc')));

// 3. 根路径欢迎与健康探针
app.get('/', (req, res) => {
  return success(res, {
    service: 'Lume Blog RESTful API Server',
    status: 'online',
    version: '1.0.0',
    developer: '蓝健涛 (249980413)',
    documentationUrl: `http://localhost:${PORT}/apidoc`,
    endpoints: [
      '/api/projects',
      '/api/articles',
      '/api/auth/login',
      '/api/export'
    ]
  }, 'Lume Blog 后端服务运行正常');
});

// 4. 挂载业务路由
app.use('/api/projects', projectsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/auth', authRouter);
app.use('/api/export', exportRouter);

// 5. 404 兜底处理
app.use((req, res) => {
  return error(res, `接口路径 ${req.method} ${req.originalUrl} 不存在`, 404, 404);
});

// 6. 全局异常处理中间件
app.use((err, req, res, next) => {
  console.error('🔥 服务器未捕获异常:', err);
  return error(res, err.message || '服务器内部异常', 500, 500);
});

// 7. 启动服务监听
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 Lume Blog API 服务器已启动: http://127.0.0.1:${PORT}`);
  console.log(`📖 apidoc 接口文档访问地址: http://127.0.0.1:${PORT}/apidoc`);
  console.log(`====================================================`);
  await testConnection();
});
