// ====================================================================
// 统一 RESTful API 响应封装工具 (utils/response.js)
// 实验五核心技术点：
// - 规范全站统一 JSON 返回结构: { code, message, data }
// - 严格映射标准 HTTP 状态码: 200(OK), 201(Created), 400(Bad Request), 404(Not Found), 500(Internal Server Error)
// ====================================================================

/**
 * 成功响应封装
 * @param {object} res Express 响应对象
 * @param {any} data 承载数据
 * @param {string} message 提示文本
 * @param {number} code 业务状态码
 * @param {number} httpStatus HTTP 响应状态码
 */
function success(res, data = null, message = '操作成功', code = 200, httpStatus = 200) {
  return res.status(httpStatus).json({
    code,
    message,
    data
  });
}

/**
 * 失败响应封装
 * @param {object} res Express 响应对象
 * @param {string} message 错误提示信息
 * @param {number} code 业务状态码
 * @param {number} httpStatus HTTP 状态码
 * @param {any} data 附加调试数据
 */
function error(res, message = '服务器内部异常', code = 500, httpStatus = 500, data = null) {
  return res.status(httpStatus).json({
    code,
    message,
    data
  });
}

module.exports = {
  success,
  error
};
