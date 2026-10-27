// ====================================================================
// 文章资源 RESTful 路由模块 (routes/articles.js)
// 实验五核心技术点：
// - 实现文章增删改查 RESTful API 接口
// - 支持状态过滤 (published / draft) 与关键字检索
// - 规范集成 apidoc 注释，满足实验五拓展选做要求
// ====================================================================

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * 格式化文章数据
 */
function formatArticle(a) {
  if (!a) return null;
  return {
    ...a,
    updatedAt: a.updated_at ? a.updated_at.toISOString ? a.updated_at.toISOString().split('T')[0] : String(a.updated_at).slice(0, 10) : '',
    createdAt: a.created_at ? a.created_at.toISOString ? a.created_at.toISOString().split('T')[0] : String(a.created_at).slice(0, 10) : ''
  };
}

/**
 * @api {get} /api/articles 1. 获取文章列表
 * @apiName GetArticles
 * @apiGroup Articles
 * @apiVersion 1.0.0
 * @apiDescription 获取系统中的技术文章列表，支持按分类、发布状态与关键词检索
 * 
 * @apiQuery {String} [category] 分类过滤
 * @apiQuery {String} [status] 状态过滤 (published / draft)
 * @apiQuery {String} [keyword] 检索关键词
 * 
 * @apiSuccess {Number} code 业务状态码 200
 * @apiSuccess {Object[]} data 文章数组
 */
router.get('/', async (req, res) => {
  try {
    const { category, status, keyword } = req.query;
    let sql = 'SELECT * FROM `articles` WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND `category` = ?';
      params.push(category);
    }
    if (status) {
      sql += ' AND `status` = ?';
      params.push(status);
    }
    if (keyword) {
      sql += ' AND (`title` LIKE ? OR `summary` LIKE ? OR `content` LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    sql += ' ORDER BY `id` DESC';
    const rows = await db.query(sql, params);
    return success(res, rows.map(formatArticle), '获取文章列表成功');
  } catch (err) {
    return error(res, '获取文章列表失败: ' + err.message, 500, 500);
  }
});

/**
 * @api {get} /api/articles/:id 2. 获取指定文章详情
 * @apiName GetArticleById
 * @apiGroup Articles
 * @apiVersion 1.0.0
 * @apiDescription 依据主键 ID 查询单篇文章详情
 * 
 * @apiParam {Number} id 文章唯一编号
 * 
 * @apiSuccess {Number} code 业务状态码 200
 * @apiSuccess {Object} data 文章详情对象
 */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return error(res, '非法的文章编号', 400, 400);
    }
    const rows = await db.query('SELECT * FROM `articles` WHERE `id` = ?', [id]);
    if (!rows || rows.length === 0) {
      return error(res, `未找到编号为 ${id} 的文章`, 404, 404);
    }
    return success(res, formatArticle(rows[0]), '获取文章详情成功');
  } catch (err) {
    return error(res, '获取文章详情异常: ' + err.message, 500, 500);
  }
});

/**
 * @api {post} /api/articles 3. 新增技术文章
 * @apiName CreateArticle
 * @apiGroup Articles
 * @apiVersion 1.0.0
 * @apiDescription 在数据库中新建一篇技术博客文章
 * 
 * @apiBody {String} title 文章标题 (必填)
 * @apiBody {String} [author] 作者 (默认: 蓝健涛)
 * @apiBody {String} category 技术分类 (必填)
 * @apiBody {String} summary 文章摘要 (必填)
 * @apiBody {String} content 文章正文 Markdown (必填)
 * @apiBody {String} [status] 发布状态 (published/draft)
 * 
 * @apiSuccess (201) {Number} code 状态码 201
 * @apiSuccess (201) {Object} data 创建成功的完整文章对象
 */
router.post('/', async (req, res) => {
  try {
    const {
      title,
      author = '蓝健涛',
      category,
      summary,
      content,
      status = 'published'
    } = req.body;

    if (!title || !title.trim()) {
      return error(res, '文章标题不能为空', 400, 400);
    }
    if (!category || !category.trim()) {
      return error(res, '技术分类不能为空', 400, 400);
    }
    if (!summary || !summary.trim()) {
      return error(res, '文章摘要不能为空', 400, 400);
    }
    if (!content || !content.trim()) {
      return error(res, '文章正文不能为空', 400, 400);
    }

    const insertSql = `
      INSERT INTO \`articles\` (title, author, category, summary, content, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      title.trim(),
      (author && author.trim()) || '蓝健涛',
      category.trim(),
      summary.trim(),
      content.trim(),
      status === 'draft' ? 'draft' : 'published'
    ];

    const result = await db.query(insertSql, params);
    const newId = result.insertId;

    const rows = await db.query('SELECT * FROM `articles` WHERE `id` = ?', [newId]);
    return success(res, formatArticle(rows[0]), '新增文章成功', 201, 201);
  } catch (err) {
    return error(res, '新增文章失败: ' + err.message, 500, 500);
  }
});

/**
 * @api {put} /api/articles/:id 4. 修改技术文章
 * @apiName UpdateArticle
 * @apiGroup Articles
 * @apiVersion 1.0.0
 * @apiDescription 更新已有文章的标题、正文、分类或发布状态
 * 
 * @apiParam {Number} id 文章编号
 * @apiBody {String} [title] 文章标题
 * @apiBody {String} [category] 分类
 * @apiBody {String} [summary] 摘要
 * @apiBody {String} [content] 正文
 * @apiBody {String} [status] 状态
 * 
 * @apiSuccess {Number} code 业务状态码 200
 * @apiSuccess {Object} data 更新后的文章对象
 */
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return error(res, '非法的文章编号', 400, 400);
    }

    const existing = await db.query('SELECT * FROM `articles` WHERE `id` = ?', [id]);
    if (!existing || existing.length === 0) {
      return error(res, `未找到编号为 ${id} 的文章，更新失败`, 404, 404);
    }

    const current = existing[0];
    const { title, author, category, summary, content, status } = req.body;

    const updateSql = `
      UPDATE \`articles\` SET 
        title = ?, author = ?, category = ?, summary = ?, content = ?, status = ?
      WHERE id = ?
    `;

    const params = [
      title !== undefined ? title.trim() : current.title,
      author !== undefined ? author.trim() : current.author,
      category !== undefined ? category.trim() : current.category,
      summary !== undefined ? summary.trim() : current.summary,
      content !== undefined ? content.trim() : current.content,
      status !== undefined ? status : current.status,
      id
    ];

    const result = await db.query(updateSql, params);
    if (result.affectedRows === 0) {
      return error(res, '未能更新任何数据行', 400, 400);
    }

    const rows = await db.query('SELECT * FROM `articles` WHERE `id` = ?', [id]);
    return success(res, formatArticle(rows[0]), '文章更新成功');
  } catch (err) {
    return error(res, '更新文章异常: ' + err.message, 500, 500);
  }
});

/**
 * @api {delete} /api/articles/:id 5. 删除技术文章
 * @apiName DeleteArticle
 * @apiGroup Articles
 * @apiVersion 1.0.0
 * @apiDescription 依据 ID 从数据库中物理删除对应文章
 * 
 * @apiParam {Number} id 文章编号
 * 
 * @apiSuccess {Number} code 业务状态码 200
 * @apiSuccess {Object} data 删除确认数据 { deletedId }
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return error(res, '非法的文章编号', 400, 400);
    }

    const result = await db.query('DELETE FROM `articles` WHERE `id` = ?', [id]);
    if (result.affectedRows === 0) {
      return error(res, `未找到编号为 ${id} 的文章，删除失败`, 404, 404);
    }

    return success(res, { deletedId: id }, `编号为 ${id} 的文章已成功删除`);
  } catch (err) {
    return error(res, '删除文章异常: ' + err.message, 500, 500);
  }
});

module.exports = router;
