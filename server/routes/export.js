// ====================================================================
// 数据导出模块 (routes/export.js)
// 实验五拓展选做任务 2:
// - 提供数据导出接口，支持全站项目、文章与系统配置一键导出为 JSON
// ====================================================================

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * @api {get} /api/export 导出系统全量数据
 * @apiName ExportAllData
 * @apiGroup Export
 * @apiVersion 1.0.0
 * @apiDescription 一键导出当前数据库中的项目作品集、技术博客文章和系统基础配置
 * 
 * @apiSuccess {Number} code 业务状态码 200
 * @apiSuccess {Object} data 导出数据包 (包含 projects, articles, exportTime, version)
 */
router.get('/', async (req, res) => {
  try {
    const projects = await db.query('SELECT * FROM `projects` ORDER BY `id` ASC');
    const articles = await db.query('SELECT * FROM `articles` ORDER BY `id` ASC');

    const exportData = {
      meta: {
        systemName: 'Lume Blog 数据备份导出包',
        developer: '蓝健涛 (学号: 249980413)',
        exportTime: new Date().toISOString(),
        version: '1.0.0'
      },
      summary: {
        totalProjects: projects.length,
        totalArticles: articles.length
      },
      data: {
        projects,
        articles
      }
    };

    if (req.query.download === 'true') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="lume_blog_export_${Date.now()}.json"`);
      return res.send(JSON.stringify(exportData, null, 2));
    }

    return success(res, exportData, '全量数据导出成功');
  } catch (err) {
    return error(res, '数据导出异常: ' + err.message, 500, 500);
  }
});

module.exports = router;
