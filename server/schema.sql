-- ====================================================================
-- 《Web前端框架程序设计》实验五：网络请求与前后端交互
-- 学生：蓝健涛 / 学号：249980413 / 班级：24计科1班
-- 数据库名：lume_blog_db
-- 编码：utf8mb4 / utf8mb4_unicode_ci
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `lume_blog_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lume_blog_db`;

-- ----------------------------
-- 1. 项目作品表 (projects)
-- ----------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '项目主键编号',
  `name` VARCHAR(100) NOT NULL COMMENT '项目名称',
  `category` VARCHAR(50) NOT NULL COMMENT '项目分类',
  `description` VARCHAR(255) NOT NULL COMMENT '项目简述',
  `full_detail` TEXT NULL COMMENT '项目深度详情描述',
  `highlights` JSON NULL COMMENT '技术亮点列表(JSON)',
  `technologies` JSON NULL COMMENT '技术栈标签(JSON)',
  `status` VARCHAR(20) NOT NULL DEFAULT '进行中' COMMENT '项目状态(已完成/进行中)',
  `progress` INT NOT NULL DEFAULT 0 COMMENT '完成进度百分比(0-100)',
  `has_demo` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否具有在线演示(1是/0否)',
  `start_date` DATE NULL COMMENT '启动日期',
  `end_date` DATE NULL COMMENT '交付日期',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='个人主页项目作品表';

-- ----------------------------
-- 2. 技术文章表 (articles)
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '文章主键编号',
  `title` VARCHAR(150) NOT NULL COMMENT '文章标题',
  `author` VARCHAR(50) NOT NULL DEFAULT '蓝健涛' COMMENT '文章作者',
  `category` VARCHAR(50) NOT NULL COMMENT '技术分类',
  `summary` VARCHAR(255) NOT NULL COMMENT '摘要简述',
  `content` MEDIUMTEXT NOT NULL COMMENT 'Markdown文章正文',
  `status` VARCHAR(20) NOT NULL DEFAULT 'published' COMMENT '发布状态(published已发布/draft草稿)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '发表时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='个人主页技术文章表';

-- ----------------------------
-- 3. 系统用户表 (users)
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户主键编号',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '登录账号',
  `password` VARCHAR(100) NOT NULL COMMENT '登录密码',
  `nickname` VARCHAR(50) NOT NULL COMMENT '用户姓名/昵称',
  `role` VARCHAR(20) NOT NULL DEFAULT 'admin' COMMENT '角色权限',
  `avatar` VARCHAR(255) NULL COMMENT '头像地址',
  `bio` VARCHAR(255) NULL COMMENT '个性签名/简介',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统管理员与用户信息表';
