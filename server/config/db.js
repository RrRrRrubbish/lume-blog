// ====================================================================
// 数据库连接池模块 (config/db.js)
// 实验五核心技术点：
// - 使用 mysql2/promise 创建连接池 (Pool)，复用数据库连接，避免高频握手开销
// - 封装统一的 query(sql, params) 方法，强制使用参数化查询 (? 占位符)
// - 杜绝 SQL 注入隐患，提供规范的异步 Promise 调用体验
// ====================================================================

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'lume_blog_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

/**
 * 封装统一的参数化 SQL 执行方法
 * @param {string} sql 带 ? 占位符的 SQL 语句
 * @param {Array} params 参数数组
 * @returns {Promise<any>}
 */
async function query(sql, params = []) {
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (error) {
    console.error('❌ SQL 执行异常:', error.message, '| SQL:', sql, '| Params:', params);
    throw error;
  }
}

/**
 * 验证数据库连接健康度
 */
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL 数据库连接池就绪 (127.0.0.1:3306 / lume_blog_db)');
    conn.release();
    return true;
  } catch (err) {
    console.error('❌ MySQL 连接池建立失败:', err.message);
    return false;
  }
}

module.exports = {
  pool,
  query,
  testConnection
};
