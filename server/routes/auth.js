// ====================================================================
// 用户认证模块 (routes/auth.js)
// 实验五核心技术点：
// - 提供管理员登录认证接口 POST /api/auth/login
// - 校验数据库 users 表中的用户凭证
// ====================================================================

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * @api {post} /api/auth/login 用户登录
 * @apiName UserLogin
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiDescription 提交用户名与密码进行登录鉴权
 * 
 * @apiBody {String} username 用户名 (如: admin)
 * @apiBody {String} password 密码 (如: password123)
 * 
 * @apiSuccess {Number} code 业务状态码 200
 * @apiSuccess {Object} data 包含用户信息与 Mock Token
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return error(res, '用户名和密码均不能为空', 400, 400);
    }

    const rows = await db.query(
      'SELECT id, username, nickname, role, avatar, bio FROM `users` WHERE `username` = ? AND `password` = ?',
      [username.trim(), password.trim()]
    );

    if (!rows || rows.length === 0) {
      return error(res, '用户名或密码不正确', 401, 401);
    }

    const user = rows[0];
    const token = 'mock-jwt-token-' + Buffer.from(username + ':' + Date.now()).toString('base64');

    return success(res, {
      token,
      user
    }, '登录成功');
  } catch (err) {
    return error(res, '登录服务异常: ' + err.message, 500, 500);
  }
});

module.exports = router;
