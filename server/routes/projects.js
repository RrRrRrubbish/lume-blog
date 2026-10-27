// ====================================================================
// 项目资源 RESTful 路由模块 (routes/projects.js)
// 实验五核心技术点：
// - 实现标准的 RESTful CRUD: GET(查列表/详情), POST(增), PUT(改), DELETE(删)
// - 使用参数化占位符 (?) 避免 SQL 注入
// - 规范集成 apidoc 注释，满足实验五拓展选做要求
// ====================================================================

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * 格式化数据库中的项目记录，确保 JSON 字段在前端可直接作为数组遍历
 */
function formatProject(p) {
  if (!p) return null;
  let highlights = [];
  let technologies = [];
  try {
    highlights = typeof p.highlights === 'string' ? JSON.parse(p.highlights) : (p.highlights || []);
  } catch (e) {
    highlights = [];
  }
  try {
    technologies = typeof p.technologies === 'string' ? JSON.parse(p.technologies) : (p.technologies || []);
  } catch (e) {
    technologies = [];
  }
  return {
    ...p,
    highlights,
    technologies,
    hasDemo: Boolean(p.has_demo),
    fullDetail: p.full_detail,
    startDate: p.start_date ? p.start_date.toISOString ? p.start_date.toISOString().split('T')[0] : String(p.start_date).slice(0, 10) : '',
    endDate: p.end_date ? p.end_date.toISOString ? p.end_date.toISOString().split('T')[0] : String(p.end_date).slice(0, 10) : ''
  };
}

/**
 * @api {get} /api/projects 1. 获取项目列表
 * @apiName GetProjects
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription 获取系统中的所有项目作品列表，支持按分类与关键字模糊筛选
 * 
 * @apiQuery {String} [category] 项目分类过滤（如：前端工程、数据可视化）
 * @apiQuery {String} [keyword] 搜索关键词（匹配项目名称与描述）
 * 
 * @apiSuccess {Number} code 业务状态码 200
 * @apiSuccess {String} message 提示信息
 * @apiSuccess {Object[]} data 项目作品数组
 */
router.get('/', async (req, res) => {
  try {
    const { category, keyword, status } = req.query;
    let sql = 'SELECT * FROM `projects` WHERE 1=1';
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
      sql += ' AND (`name` LIKE ? OR `description` LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    sql += ' ORDER BY `id` ASC';
    const rows = await db.query(sql, params);
    const list = rows.map(formatProject);
    return success(res, list, '获取项目列表成功');
  } catch (err) {
    return error(res, '获取项目列表失败: ' + err.message, 500, 500);
  }
});

/**
 * @api {get} /api/projects/:id 2. 获取指定项目详情
 * @apiName GetProjectById
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription 依据主键 ID 查询单个项目详情
 * 
 * @apiParam {Number} id 项目唯一编号
 * 
 * @apiSuccess {Number} code 业务状态码 200
 * @apiSuccess {Object} data 项目详情对象
 */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return error(res, '非法的项目编号', 400, 400);
    }
    const rows = await db.query('SELECT * FROM `projects` WHERE `id` = ?', [id]);
    if (!rows || rows.length === 0) {
      return error(res, `未找到编号为 ${id} 的项目`, 404, 404);
    }
    return success(res, formatProject(rows[0]), '获取项目详情成功');
  } catch (err) {
    return error(res, '获取项目详情异常: ' + err.message, 500, 500);
  }
});

/**
 * @api {post} /api/projects 3. 新增项目作品
 * @apiName CreateProject
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription 提交项目信息在数据库中新建一条项目记录
 * 
 * @apiBody {String} name 项目名称 (必填)
 * @apiBody {String} category 项目分类 (必填)
 * @apiBody {String} description 项目简述 (必填)
 * @apiBody {String} [fullDetail] 详细说明
 * @apiBody {Array} [highlights] 技术亮点
 * @apiBody {Array} [technologies] 技术栈
 * @apiBody {String} [status] 项目状态 (默认: 进行中)
 * @apiBody {Number} [progress] 进度百分比 (0-100)
 * @apiBody {Boolean} [hasDemo] 是否有演示地址
 * 
 * @apiSuccess (201) {Number} code 状态码 201
 * @apiSuccess (201) {Object} data 新建成功的完整项目记录(带自增ID)
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      fullDetail,
      highlights,
      technologies,
      status = '进行中',
      progress = 0,
      hasDemo = true,
      startDate = null,
      endDate = null
    } = req.body;

    if (!name || !name.trim()) {
      return error(res, '项目名称不能为空', 400, 400);
    }
    if (!category || !category.trim()) {
      return error(res, '项目分类不能为空', 400, 400);
    }
    if (!description || !description.trim()) {
      return error(res, '项目简要描述不能为空', 400, 400);
    }

    const hlJson = JSON.stringify(Array.isArray(highlights) ? highlights : []);
    const techJson = JSON.stringify(Array.isArray(technologies) ? technologies : []);
    const demoVal = hasDemo ? 1 : 0;
    const progVal = Math.min(100, Math.max(0, Number(progress) || 0));

    const insertSql = `
      INSERT INTO \`projects\` 
        (name, category, description, full_detail, highlights, technologies, status, progress, has_demo, start_date, end_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      name.trim(),
      category.trim(),
      description.trim(),
      fullDetail || '',
      hlJson,
      techJson,
      status,
      progVal,
      demoVal,
      startDate || null,
      endDate || null
    ];

    const result = await db.query(insertSql, params);
    const newId = result.insertId;

    const rows = await db.query('SELECT * FROM `projects` WHERE `id` = ?', [newId]);
    return success(res, formatProject(rows[0]), '新增项目成功', 201, 201);
  } catch (err) {
    return error(res, '新增项目失败: ' + err.message, 500, 500);
  }
});

/**
 * @api {put} /api/projects/:id 4. 修改项目信息
 * @apiName UpdateProject
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription 按指定 ID 更新已有项目的信息
 * 
 * @apiParam {Number} id 项目编号
 * @apiBody {String} [name] 项目名称
 * @apiBody {String} [category] 分类
 * @apiBody {String} [description] 描述
 * 
 * @apiSuccess {Number} code 业务状态码 200
 * @apiSuccess {Object} data 更新后的项目对象
 */
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return error(res, '非法的项目编号', 400, 400);
    }

    // 检查项目是否存在
    const existing = await db.query('SELECT * FROM `projects` WHERE `id` = ?', [id]);
    if (!existing || existing.length === 0) {
      return error(res, `未找到编号为 ${id} 的项目，修改失败`, 404, 404);
    }

    const current = existing[0];
    const {
      name,
      category,
      description,
      fullDetail,
      highlights,
      technologies,
      status,
      progress,
      hasDemo,
      startDate,
      endDate
    } = req.body;

    const updateSql = `
      UPDATE \`projects\` SET 
        name = ?, category = ?, description = ?, full_detail = ?, 
        highlights = ?, technologies = ?, status = ?, progress = ?, 
        has_demo = ?, start_date = ?, end_date = ?
      WHERE id = ?
    `;

    const params = [
      name !== undefined ? name.trim() : current.name,
      category !== undefined ? category.trim() : current.category,
      description !== undefined ? description.trim() : current.description,
      fullDetail !== undefined ? fullDetail : current.full_detail,
      highlights !== undefined 
        ? JSON.stringify(highlights) 
        : (typeof current.highlights === 'object' ? JSON.stringify(current.highlights) : current.highlights),
      technologies !== undefined 
        ? JSON.stringify(technologies) 
        : (typeof current.technologies === 'object' ? JSON.stringify(current.technologies) : current.technologies),
      status !== undefined ? status : current.status,
      progress !== undefined ? Math.min(100, Math.max(0, Number(progress) || 0)) : current.progress,
      hasDemo !== undefined ? (hasDemo ? 1 : 0) : current.has_demo,
      startDate !== undefined ? (startDate || null) : current.start_date,
      endDate !== undefined ? (endDate || null) : current.end_date,
      id
    ];

    const result = await db.query(updateSql, params);
    if (result.affectedRows === 0) {
      return error(res, '未能更新任何数据行', 400, 400);
    }

    const rows = await db.query('SELECT * FROM `projects` WHERE `id` = ?', [id]);
    return success(res, formatProject(rows[0]), '项目信息更新成功');
  } catch (err) {
    return error(res, '修改项目异常: ' + err.message, 500, 500);
  }
});

/**
 * @api {delete} /api/projects/:id 5. 删除指定项目
 * @apiName DeleteProject
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription 依据 ID 从数据库中物理删除对应项目
 * 
 * @apiParam {Number} id 项目编号
 * 
 * @apiSuccess {Number} code 业务状态码 200
 * @apiSuccess {Object} data 删除确认数据 { deletedId }
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return error(res, '非法的项目编号', 400, 400);
    }

    const result = await db.query('DELETE FROM \`projects\` WHERE \`id\` = ?', [id]);
    if (result.affectedRows === 0) {
      return error(res, `未找到编号为 ${id} 的项目，删除失败`, 404, 404);
    }

    return success(res, { deletedId: id }, `编号为 ${id} 的项目已成功删除`);
  } catch (err) {
    return error(res, '删除项目异常: ' + err.message, 500, 500);
  }
});

module.exports = router;
