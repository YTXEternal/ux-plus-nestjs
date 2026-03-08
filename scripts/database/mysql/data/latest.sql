-- MySQL Dump generated at 2026-03-08T11:45:46.584Z
-- Database: platform

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Create Database `platform` if not exists
CREATE DATABASE IF NOT EXISTS `platform` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `platform`;

-- Table structure for table `arrange`
DROP TABLE IF EXISTS `arrange`;
CREATE TABLE `arrange` (
  `arrange_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '排场名称',
  `drama_id` bigint NOT NULL COMMENT '剧本ID',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `price` decimal(10,2) DEFAULT '0.00' COMMENT '票价',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `total_tickets` int DEFAULT '0' COMMENT '总票数',
  `remaining_tickets` int DEFAULT '0' COMMENT '剩余票数',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `shop_id` bigint NOT NULL COMMENT '门店ID',
  PRIMARY KEY (`arrange_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='排场表';

-- Dumping data for table `arrange`
INSERT INTO `arrange` VALUES (1, '古木吟 周末下午场', 1, '0', '128.00', '2026-03-09 19:42:16', '2026-03-09 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 1), (2, '年轮 硬核推理车', 2, '0', '138.00', '2026-03-09 19:42:16', '2026-03-10 00:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 2), (3, '在此刻 情感沉浸车', 3, '0', '158.00', '2026-03-10 19:42:16', '2026-03-10 23:42:16', 7, 7, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 3), (4, '拆迁 欢乐撕逼车', 4, '0', '98.00', '2026-03-10 19:42:16', '2026-03-10 23:42:16', 8, 8, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 4), (5, '告别诗 校园回忆车', 5, '0', '118.00', '2026-03-11 19:42:16', '2026-03-11 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 5), (6, '漓川怪谈簿 日式恐怖车', 6, '0', '128.00', '2026-03-11 19:42:16', '2026-03-11 23:42:16', 7, 7, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 6), (7, '就像水消失在水中 情感车', 7, '0', '138.00', '2026-03-12 19:42:16', '2026-03-12 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 7), (8, '病娇男孩的精分日记 变格车', 8, '0', '108.00', '2026-03-12 19:42:16', '2026-03-12 23:42:16', 7, 7, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 8), (9, '窗边的女人 恐怖车', 9, '0', '128.00', '2026-03-13 19:42:16', '2026-03-13 23:42:16', 5, 5, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 9), (10, '一点半 微恐推理车', 10, '0', '118.00', '2026-03-13 19:42:16', '2026-03-13 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 10), (11, '狐狸旅馆 童话推理车', 11, '0', '108.00', '2026-03-14 19:42:16', '2026-03-14 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 11), (12, '舍离 古风情感车', 12, '0', '128.00', '2026-03-14 19:42:16', '2026-03-14 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 12), (13, '极夜 机制阵营车', 13, '0', '138.00', '2026-03-15 19:42:16', '2026-03-16 00:42:16', 8, 8, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 13), (14, '孤城 民国阵营车', 14, '0', '128.00', '2026-03-15 19:42:16', '2026-03-15 23:42:16', 7, 7, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 14), (15, '刀鞘 谍战阵营车', 15, '0', '138.00', '2026-03-16 19:42:16', '2026-03-16 23:42:16', 7, 7, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 15), (16, '涂川 仙侠情感车', 16, '0', '148.00', '2026-03-16 19:42:16', '2026-03-16 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 16), (17, '鸢飞戾天 权谋机制车', 17, '0', '138.00', '2026-03-17 19:42:16', '2026-03-18 00:42:16', 7, 7, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 17), (18, '破晓 刑侦推理车', 18, '0', '118.00', '2026-03-17 19:42:16', '2026-03-17 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 18), (19, '归途 公路情感车', 19, '0', '128.00', '2026-03-18 19:42:16', '2026-03-18 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 19), (20, '局中人 谍战烧脑车', 20, '0', '128.00', '2026-03-18 19:42:16', '2026-03-18 23:42:16', 7, 7, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 20), (21, '傀儡 恐怖悬疑车', 21, '0', '118.00', '2026-03-19 19:42:16', '2026-03-19 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 21), (22, '蛊魂铃 中式恐怖车', 22, '0', '128.00', '2026-03-19 19:42:16', '2026-03-19 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 22), (23, '鬼影迷踪 本格推理车', 23, '0', '108.00', '2026-03-20 19:42:16', '2026-03-20 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 23), (24, '幽灵岛 暴风雪山庄车', 24, '0', '118.00', '2026-03-20 19:42:16', '2026-03-20 23:42:16', 7, 7, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 24), (25, '致命游戏 生存挑战车', 25, '0', '138.00', '2026-03-21 19:42:16', '2026-03-21 23:42:16', 8, 8, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 25), (26, '黑暗童话 暗黑反转车', 26, '0', '128.00', '2026-03-21 19:42:16', '2026-03-21 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 26), (27, '梦魇 心理惊悚车', 27, '0', '128.00', '2026-03-22 19:42:16', '2026-03-22 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 27), (28, '灵魂摆渡 奇幻情感车', 28, '0', '138.00', '2026-03-22 19:42:16', '2026-03-22 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 28), (29, '第八号当铺 交易机制车', 29, '0', '138.00', '2026-03-23 19:42:16', '2026-03-23 23:42:16', 8, 8, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 29), (30, '无尽循环 科幻脑洞车', 30, '0', '128.00', '2026-03-23 19:42:16', '2026-03-23 23:42:16', 6, 6, '2026-03-08 19:42:16', '2026-03-08 19:42:16', 30);

-- Table structure for table `event`
DROP TABLE IF EXISTS `event`;
CREATE TABLE `event` (
  `event_id` bigint NOT NULL AUTO_INCREMENT COMMENT '剧本ID',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '剧本名称',
  `desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '剧本描述',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '状态（0启用 1停用）',
  `del_flag` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`event_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='剧本信息表';

-- Table structure for table `event_label`
DROP TABLE IF EXISTS `event_label`;
CREATE TABLE `event_label` (
  `event_id` bigint NOT NULL COMMENT '剧本ID',
  `label_id` bigint NOT NULL COMMENT '标签ID',
  PRIMARY KEY (`event_id`,`label_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='剧本标签关联表';

-- Table structure for table `event_shop`
DROP TABLE IF EXISTS `event_shop`;
CREATE TABLE `event_shop` (
  `event_id` bigint NOT NULL COMMENT '剧本ID',
  `shop_id` bigint NOT NULL COMMENT '门店ID',
  PRIMARY KEY (`event_id`,`shop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='剧本门店关联表';

-- Table structure for table `home_statistics`
DROP TABLE IF EXISTS `home_statistics`;
CREATE TABLE `home_statistics` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `shop_id` bigint NOT NULL COMMENT '店铺ID',
  `stats_time` datetime NOT NULL COMMENT '统计时间点',
  `member_growth` int DEFAULT '0' COMMENT '会员增长人数',
  `ticket_sales` decimal(10,2) DEFAULT '0.00' COMMENT '卖票营业额',
  `refund_amount` decimal(10,2) DEFAULT '0.00' COMMENT '退款金额',
  `refund_count` int DEFAULT '0' COMMENT '退款单数',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_shop_time` (`shop_id`,`stats_time`),
  KEY `idx_shop_time` (`shop_id`,`stats_time`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='首页统计数据表';

-- Table structure for table `label`
DROP TABLE IF EXISTS `label`;
CREATE TABLE `label` (
  `label_id` bigint NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标签名称',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`label_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签管理表';

-- Dumping data for table `label`
INSERT INTO `label` VALUES (1, '恐怖', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (2, '悬疑', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (3, '情感', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (4, '欢乐', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (5, '机制', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (6, '阵营', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (7, '还原', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (8, '硬核', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (9, '沉浸', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (10, '实景', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (11, '换装', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (12, '独家', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (13, '城市限定', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (14, '盒装', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (15, '剧场', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (16, '演绎', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (17, '惊悚', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (18, '科幻', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (19, '校园', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (20, '古风', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (21, '欧式', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (22, '日式', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (23, '现代', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (24, '民国', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (25, '奇幻', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (26, '仙侠', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (27, '武侠', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (28, '战争', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (29, '谍战', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46'), (30, '益智', '0', '0', '2026-03-08 19:40:46', '2026-03-08 19:40:46');

-- Table structure for table `member`
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `member_id` bigint NOT NULL AUTO_INCREMENT COMMENT '会员ID',
  `name` varchar(50) NOT NULL COMMENT '会员姓名',
  `phone` varchar(20) DEFAULT '' COMMENT '联系电话',
  `email` varchar(50) DEFAULT '' COMMENT '邮箱',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `shop_id` bigint DEFAULT NULL COMMENT '所属店铺ID',
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `idx_member_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='会员信息表';

-- Dumping data for table `member`
INSERT INTO `member` VALUES (1, '张三', '13900139001', 'zhangsan@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 1), (2, '李四', '13900139002', 'lisi@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 2), (3, '王五', '13900139003', 'wangwu@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 3), (4, '赵六', '13900139004', 'zhaoliu@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 4), (5, '钱七', '13900139005', 'qianqi@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 5), (6, '孙八', '13900139006', 'sunba@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 6), (7, '周九', '13900139007', 'zhoujiu@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 7), (8, '吴十', '13900139008', 'wushi@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 8), (9, '郑十一', '13900139009', 'zhengshiyi@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 9), (10, '王十二', '13900139010', 'wangshier@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 10), (11, '陈一', '13900139011', 'chenyi@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 11), (12, '褚二', '13900139012', 'chuer@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 12), (13, '卫三', '13900139013', 'weisan@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 13), (14, '蒋四', '13900139014', 'jiangsi@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 14), (15, '沈五', '13900139015', 'shenwu@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 15), (16, '韩六', '13900139016', 'hanliu@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 16), (17, '杨七', '13900139017', 'yangqi@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 17), (18, '朱八', '13900139018', 'zhuba@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 18), (19, '秦九', '13900139019', 'qinjiu@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 19), (20, '尤十', '13900139020', 'youshi@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 20), (21, '许十一', '13900139021', 'xushiyi@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 21), (22, '何十二', '13900139022', 'heshier@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 22), (23, '吕十三', '13900139023', 'lvshisan@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 23), (24, '施十四', '13900139024', 'shishisi@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 24), (25, '张十五', '13900139025', 'zhangshiwu@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 25), (26, '孔十六', '13900139026', 'kongshiliu@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 26), (27, '曹十七', '13900139027', 'caoshiqi@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 27), (28, '严十八', '13900139028', 'yanshiba@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 28), (29, '华十九', '13900139029', 'huashijiu@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 29), (30, '金二十', '13900139030', 'jinershi@example.com', '0', '2026-03-08 19:41:37', '2026-03-08 19:41:37', 30);

-- Table structure for table `shop`
DROP TABLE IF EXISTS `shop`;
CREATE TABLE `shop` (
  `shop_id` bigint NOT NULL AUTO_INCREMENT COMMENT '门店ID',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '门店名称',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '门店地址',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '联系电话',
  `del_flag` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `conductor` bigint NOT NULL COMMENT '管理人ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`shop_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='门店信息表';

-- Dumping data for table `shop`
INSERT INTO `shop` VALUES (1, '迷雾剧本杀', '北京市朝阳区建国路88号', '13800138001', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (2, '第七感探案馆', '上海市浦东新区张杨路500号', '13800138002', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (3, '沉浸社', '广州市天河区天河路208号', '13800138003', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (4, '剧本梦工厂', '深圳市南山区深南大道9028号', '13800138004', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (5, '异次元推理馆', '成都市锦江区春熙路1号', '13800138005', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (6, '谜题大陆', '杭州市下城区武林广场1号', '13800138006', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (7, '侦探俱乐部', '武汉市江汉区解放大道688号', '13800138007', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (8, '真相只有一个', '重庆市渝中区解放碑1号', '13800138008', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (9, '烧脑风暴', '南京市鼓楼区中山北路1号', '13800138009', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (10, '戏精学院', '西安市碑林区南大街1号', '13800138010', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (11, '角色扮演大师', '长沙市芙蓉区五一大道1号', '13800138011', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (12, '沉浸式体验中心', '郑州市金水区花园路1号', '13800138012', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (13, '剧本杀研究所', '青岛市市南区香港中路1号', '13800138013', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (14, '推理之王', '苏州市姑苏区观前街1号', '13800138014', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (15, '谜案追踪', '天津市和平区南京路1号', '13800138015', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (16, '谁是凶手', '沈阳市沈河区青年大街1号', '13800138016', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (17, '剧本世界', '大连市中山区中山广场1号', '13800138017', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (18, '探案大师', '哈尔滨市道里区中央大街1号', '13800138018', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (19, '谜团重重', '长春市朝阳区红旗街1号', '13800138019', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (20, '剧本迷宫', '济南市历下区泉城路1号', '13800138020', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (21, '侦探联盟', '福州市鼓楼区五四路1号', '13800138021', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (22, '剧本乐园', '厦门市思明区中山路1号', '13800138022', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (23, '沉浸空间', '昆明市五华区南屏街1号', '13800138023', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (24, '剧本工坊', '贵阳市南明区中华南路1号', '13800138024', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (25, '探案基地', '南宁市青秀区民族大道1号', '13800138025', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (26, '谜题工场', '合肥市蜀山区长江西路1号', '13800138026', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (27, '剧本之家', '石家庄市长安区中山东路1号', '13800138027', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (28, '侦探社', '太原市迎泽区迎泽大街1号', '13800138028', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (29, '真相大白', '呼和浩特市新城区新华大街1号', '13800138029', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10'), (30, '剧本之夜', '乌鲁木齐市天山区中山路1号', '13800138030', '0', 1, '2026-03-08 19:41:10', '2026-03-08 19:41:10');

-- Table structure for table `sys_dept`
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept` (
  `dept_id` bigint NOT NULL AUTO_INCREMENT COMMENT '部门id',
  `parent_id` bigint DEFAULT '0' COMMENT '父部门id',
  `ancestors` varchar(50) DEFAULT '' COMMENT '祖级列表',
  `dept_name` varchar(30) DEFAULT '' COMMENT '部门名称',
  `order_num` int DEFAULT '0' COMMENT '显示顺序',
  `leader` varchar(20) DEFAULT NULL COMMENT '负责人',
  `phone` varchar(11) DEFAULT NULL COMMENT '联系电话',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `status` char(1) DEFAULT '0' COMMENT '部门状态（0正常 1停用）',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='部门表';

-- Table structure for table `sys_dict_data`
DROP TABLE IF EXISTS `sys_dict_data`;
CREATE TABLE `sys_dict_data` (
  `dict_code` bigint NOT NULL AUTO_INCREMENT COMMENT '字典编码',
  `dict_sort` int DEFAULT '0' COMMENT '字典排序',
  `dict_label` varchar(100) DEFAULT '' COMMENT '字典标签',
  `dict_value` varchar(100) DEFAULT '' COMMENT '字典键值',
  `dict_type` varchar(100) DEFAULT '' COMMENT '字典类型',
  `css_class` varchar(100) DEFAULT NULL COMMENT '样式属性（其他样式扩展）',
  `list_class` varchar(100) DEFAULT NULL COMMENT '表格回显样式',
  `is_default` char(1) DEFAULT 'N' COMMENT '是否默认（Y是 N否）',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  PRIMARY KEY (`dict_code`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='字典数据表';

-- Table structure for table `sys_dict_type`
DROP TABLE IF EXISTS `sys_dict_type`;
CREATE TABLE `sys_dict_type` (
  `dict_id` bigint NOT NULL AUTO_INCREMENT COMMENT '字典主键',
  `dict_name` varchar(100) DEFAULT '' COMMENT '字典名称',
  `dict_type` varchar(100) DEFAULT '' COMMENT '字典类型',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  PRIMARY KEY (`dict_id`),
  UNIQUE KEY `dict_type` (`dict_type`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='字典类型表';

-- Table structure for table `sys_drama`
DROP TABLE IF EXISTS `sys_drama`;
CREATE TABLE `sys_drama` (
  `event_id` bigint NOT NULL AUTO_INCREMENT COMMENT '剧本ID',
  `name` varchar(30) NOT NULL COMMENT '剧本名称',
  `desc` varchar(500) DEFAULT NULL COMMENT '剧本描述',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `status` char(1) DEFAULT '0' COMMENT '状态（0启用 1停用）',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`event_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='剧本信息表';

-- Dumping data for table `sys_drama`
INSERT INTO `sys_drama` VALUES (1, '古木吟', '关于校园霸凌的恐怖本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (2, '年轮', '经典硬核推理本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (3, '在此刻', '情感沉浸本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (4, '拆迁', '欢乐机制本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (5, '告别诗', '校园情感本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (6, '漓川怪谈簿', '日式怪谈本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (7, '就像水消失在水中', '现代情感本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (8, '病娇男孩的精分日记', '变格推理本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (9, '窗边的女人', '恐怖惊悚本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (10, '一点半', '微恐推理本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (11, '狐狸旅馆', '童话风格推理本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (12, '舍离', '古风情感本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (13, '极夜', '末日生存机制本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (14, '孤城', '民国阵营本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (15, '刀鞘', '谍战阵营本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (16, '涂川', '古风仙侠本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (17, '鸢飞戾天', '古风权谋本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (18, '破晓', '现代刑侦本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (19, '归途', '公路情感本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (20, '局中人', '谍战烧脑本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (21, '傀儡', '悬疑恐怖本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (22, '蛊魂铃', '中式恐怖本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (23, '鬼影迷踪', '本格推理本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (24, '幽灵岛', '暴风雪山庄模式', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (25, '致命游戏', '生存游戏本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (26, '黑暗童话', '暗黑童话本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (27, '梦魇', '心理恐怖本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (28, '灵魂摆渡', '奇幻情感本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (29, '第八号当铺', '奇幻交易本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23'), (30, '无尽循环', '科幻循环本', '0', '0', '2026-03-08 19:41:23', '2026-03-08 19:41:23');

-- Table structure for table `sys_drama_label`
DROP TABLE IF EXISTS `sys_drama_label`;
CREATE TABLE `sys_drama_label` (
  `drama_id` bigint NOT NULL COMMENT '剧本ID',
  `label_id` bigint NOT NULL COMMENT '标签ID',
  PRIMARY KEY (`drama_id`,`label_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='剧本-标签关联表';

-- Dumping data for table `sys_drama_label`
INSERT INTO `sys_drama_label` VALUES (1, 1), (1, 17), (2, 2), (2, 8), (3, 3), (3, 9), (4, 4), (4, 5), (5, 3), (5, 19), (6, 2), (6, 22), (7, 3), (7, 23), (8, 2), (8, 17), (9, 1), (9, 17), (10, 2), (10, 17), (11, 2), (11, 15), (12, 3), (12, 20), (13, 5), (13, 25), (14, 6), (14, 24), (15, 6), (15, 29), (16, 20), (16, 26), (17, 20), (17, 27), (18, 2), (18, 23), (19, 3), (19, 23), (20, 2), (20, 29), (21, 1), (21, 2), (22, 1), (22, 20), (23, 2), (23, 7), (24, 2), (24, 15), (25, 5), (25, 17), (26, 17), (26, 25), (27, 1), (27, 8), (28, 3), (28, 25), (29, 25), (29, 30), (30, 8), (30, 18);

-- Table structure for table `sys_drama_shop`
DROP TABLE IF EXISTS `sys_drama_shop`;
CREATE TABLE `sys_drama_shop` (
  `drama_id` bigint NOT NULL COMMENT '剧本ID',
  `shop_id` bigint NOT NULL COMMENT '门店ID',
  PRIMARY KEY (`drama_id`,`shop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='剧本-门店关联表';

-- Dumping data for table `sys_drama_shop`
INSERT INTO `sys_drama_shop` VALUES (1, 1), (1, 2), (2, 2), (2, 3), (3, 3), (3, 4), (4, 4), (4, 5), (5, 5), (5, 6), (6, 6), (6, 7), (7, 7), (7, 8), (8, 8), (8, 9), (9, 9), (9, 10), (10, 10), (10, 11), (11, 11), (11, 12), (12, 12), (12, 13), (13, 13), (13, 14), (14, 14), (14, 15), (15, 15), (15, 16), (16, 16), (16, 17), (17, 17), (17, 18), (18, 18), (18, 19), (19, 19), (19, 20), (20, 20), (20, 21), (21, 21), (21, 22), (22, 22), (22, 23), (23, 23), (23, 24), (24, 24), (24, 25), (25, 25), (25, 26), (26, 26), (26, 27), (27, 27), (27, 28), (28, 28), (28, 29), (29, 29), (29, 30), (30, 1), (30, 30);

-- Table structure for table `sys_file`
DROP TABLE IF EXISTS `sys_file`;
CREATE TABLE `sys_file` (
  `file_id` bigint NOT NULL AUTO_INCREMENT COMMENT '文件主键ID',
  `name` varchar(1024) NOT NULL COMMENT '文件名称',
  `type` varchar(50) DEFAULT '' COMMENT '文件类型',
  `url` varchar(1024) DEFAULT '' COMMENT '文件路径',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='文件管理表';

-- Dumping data for table `sys_file`
INSERT INTO `sys_file` VALUES (100, 'file-1772967234373-643343866.png', 'image/png', 'http://127.0.0.1:3000/static/uploads/file-1772967234373-643343866.png', '0', '2026-03-08 10:53:54', '2026-03-08 10:53:54');

-- Table structure for table `sys_logininfor`
DROP TABLE IF EXISTS `sys_logininfor`;
CREATE TABLE `sys_logininfor` (
  `info_id` bigint NOT NULL AUTO_INCREMENT COMMENT '访问ID',
  `user_name` varchar(50) DEFAULT '' COMMENT '用户账号',
  `ipaddr` varchar(128) DEFAULT '' COMMENT '登录IP地址',
  `login_location` varchar(255) DEFAULT '' COMMENT '登录地点',
  `browser` varchar(50) DEFAULT '' COMMENT '浏览器类型',
  `os` varchar(50) DEFAULT '' COMMENT '操作系统',
  `status` char(1) DEFAULT '0' COMMENT '登录状态（0成功 1失败）',
  `msg` varchar(255) DEFAULT '' COMMENT '提示消息',
  `login_time` datetime DEFAULT NULL COMMENT '访问时间',
  PRIMARY KEY (`info_id`),
  KEY `idx_sys_logininfor_s` (`status`),
  KEY `idx_sys_logininfor_lt` (`login_time`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统访问记录';

-- Table structure for table `sys_menu`
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `menu_id` bigint NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `menu_name` varchar(50) NOT NULL COMMENT '菜单名称',
  `parent_id` bigint DEFAULT '0' COMMENT '父菜单ID',
  `order_num` int DEFAULT '0' COMMENT '显示顺序',
  `path` varchar(200) DEFAULT '' COMMENT '路由地址',
  `component` varchar(255) DEFAULT NULL COMMENT '组件路径',
  `query` varchar(255) DEFAULT NULL COMMENT '路由参数',
  `route_name` varchar(50) DEFAULT '' COMMENT '路由名称',
  `is_frame` int DEFAULT '1' COMMENT '是否为外链（0是 1否）',
  `is_cache` int DEFAULT '0' COMMENT '是否缓存（0缓存 1不缓存）',
  `menu_type` char(1) DEFAULT '' COMMENT '菜单类型（M目录 C菜单 F按钮）',
  `visible` char(1) DEFAULT '0' COMMENT '菜单状态（0显示 1隐藏）',
  `status` char(1) DEFAULT '0' COMMENT '菜单状态（0正常 1停用）',
  `perms` varchar(100) DEFAULT NULL COMMENT '权限标识',
  `icon` varchar(100) DEFAULT '#' COMMENT '菜单图标',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT '' COMMENT '备注',
  `constant` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是固定路由，1为固定，0为不固定，默认为0，固定路由不需要校验权限',
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2041 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='菜单权限表';

-- Dumping data for table `sys_menu`
INSERT INTO `sys_menu` VALUES (1, '系统管理', 0, 1, '/system', NULL, '', 'system', 1, 0, 'M', '0', '0', '', 'material-symbols:settings', 'admin', '2026-01-31 00:39:19', '', '2026-03-05 12:29:07', '系统管理目录', 0), (100, '用户管理', 1, 1, '/system/user', 'page.(base)_system_user', '', 'system_user', 1, 0, 'C', '0', '0', 'system:user:list', 'material-symbols:group', 'admin', '2026-01-31 00:39:22', '', '2026-03-05 12:29:24', '用户管理菜单', 0), (101, '角色管理', 1, 2, '/system/role', 'page.(base)_system_roles', '', 'system_role', 1, 0, 'C', '0', '0', 'system:role:list', 'material-symbols:group', 'admin', '2026-01-31 00:39:22', '', '2026-03-05 12:29:30', '角色管理菜单', 0), (102, '菜单管理', 1, 3, '/system/menu', 'page.(base)_system_menu', '', 'system_menu', 1, 0, 'C', '0', '0', 'system:menu:list', 'material-symbols:menu', 'admin', '2026-01-31 00:39:22', '', '2026-03-05 12:32:06', '菜单管理菜单', 0), (103, '部门管理', 1, 4, '/system/dept', 'page.(base)_system_dept', '', 'system_dept', 1, 0, 'C', '0', '0', 'system:dept:list', 'material-symbols:person', 'admin', '2026-01-31 00:39:22', '', '2026-03-05 12:30:53', '部门管理菜单', 0), (600, '首页', 0, 0, '/home', 'page.(base)_home', '', 'home', 1, 0, 'C', '0', '0', 'home', 'material-symbols-light:home', 'admin', '2026-01-31 00:39:25', '', NULL, '首页', 1), (1000, '用户查询', 100, 1, '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:query', '#', 'admin', '2026-01-31 00:39:27', '', NULL, '', 0), (1001, '用户新增', 100, 2, '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:add', '#', 'admin', '2026-01-31 00:39:27', '', NULL, '', 0), (1002, '用户修改', 100, 3, '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:edit', '#', 'admin', '2026-01-31 00:39:27', '', NULL, '', 0), (1003, '用户删除', 100, 4, '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:remove', '#', 'admin', '2026-01-31 00:39:27', '', NULL, '', 0), (1006, '重置密码', 100, 7, '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:resetPwd', '#', 'admin', '2026-01-31 00:39:27', '', NULL, '', 0), (1007, '角色查询', 101, 1, '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:query', '#', 'admin', '2026-01-31 00:39:29', '', NULL, '', 0), (1008, '角色新增', 101, 2, '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:add', '#', 'admin', '2026-01-31 00:39:29', '', NULL, '', 0), (1009, '角色修改', 101, 3, '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:edit', '#', 'admin', '2026-01-31 00:39:29', '', NULL, '', 0), (1010, '角色删除', 101, 4, '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:remove', '#', 'admin', '2026-01-31 00:39:29', '', NULL, '', 0), (1012, '菜单查询', 102, 1, '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:query', '#', 'admin', '2026-01-31 00:39:32', '', NULL, '', 0), (1013, '菜单新增', 102, 2, '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:add', '#', 'admin', '2026-01-31 00:39:32', '', NULL, '', 0), (1014, '菜单修改', 102, 3, '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:edit', '#', 'admin', '2026-01-31 00:39:32', '', NULL, '', 0), (1015, '菜单删除', 102, 4, '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:remove', '#', 'admin', '2026-01-31 00:39:32', '', NULL, '', 0), (1016, '部门查询', 103, 1, '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:query', '#', 'admin', '2026-01-31 00:39:35', '', NULL, '', 0), (1017, '部门新增', 103, 2, '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:add', '#', 'admin', '2026-01-31 00:39:35', '', NULL, '', 0), (1018, '部门修改', 103, 3, '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:edit', '#', 'admin', '2026-01-31 00:39:35', '', NULL, '', 0), (1019, '部门删除', 103, 4, '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:remove', '#', 'admin', '2026-01-31 00:39:35', '', NULL, '', 0), (2003, '附件管理', 0, 0, '/file', 'page.(base)_file', NULL, 'file', 1, 0, 'M', '0', '0', 'file', 'material-symbols:folder', '', '2026-03-05 13:21:52', '', '2026-03-05 13:44:03', '', 0), (2004, '附件删除', 2003, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'file:remove', 'material-symbols:menu', '', '2026-03-05 13:46:42', '', '2026-03-05 13:49:13', '', 0), (2005, '附件详情', 2003, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'file:query', 'material-symbols:menu', '', '2026-03-05 13:48:03', '', '2026-03-05 13:49:56', '', 0), (2006, '附件列表', 2003, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'file:list', 'material-symbols:menu', '', '2026-03-05 13:48:52', '', '2026-03-05 13:49:25', '', 0), (2008, '标签管理', 0, 0, '/tag', 'page.(base)_tag', NULL, 'tag', 1, 0, 'C', '0', '0', 'label:list', 'material-symbols:bookmark', '', '2026-03-05 18:06:39', '', '2026-03-08 05:52:59', '', 0), (2009, '新增标签', 2008, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'label:add', 'material-symbols:menu', '', '2026-03-05 18:18:41', '', '2026-03-05 18:29:56', '', 0), (2010, '删除标签', 2008, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'label:remove', 'material-symbols:menu', '', '2026-03-05 18:19:11', '', '2026-03-05 18:30:01', '', 0), (2011, '修改标签', 2008, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'label:edit', 'material-symbols:menu', '', '2026-03-05 18:19:32', '', '2026-03-05 18:30:07', '', 0), (2012, '标签详情', 2008, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'label:query', 'material-symbols:menu', '', '2026-03-05 18:39:05', '', '2026-03-05 18:39:05', '', 0), (2013, '剧本管理', 0, 0, '/drama', 'page.(base)_drama', NULL, 'drama', 1, 0, 'C', '0', '0', 'drama:list', 'material-symbols:folder-open', '', '2026-03-05 18:51:20', '', '2026-03-08 05:52:22', '', 0), (2014, '新增剧本', 2013, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'drama:add', 'material-symbols:menu', '', '2026-03-05 18:52:14', '', '2026-03-05 18:52:14', '', 0), (2015, '剧本详情', 2013, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'drama:query', 'material-symbols:menu', '', '2026-03-05 18:52:35', '', '2026-03-05 18:52:35', '', 0), (2016, '编辑剧本', 2013, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'drama:edit', 'material-symbols:menu', '', '2026-03-05 18:52:59', '', '2026-03-05 18:52:59', '', 0), (2017, '删除剧本', 2013, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'drama:remove', 'material-symbols:menu', '', '2026-03-05 18:53:33', '', '2026-03-05 18:53:33', '', 0), (2018, '会员管理', 0, 0, '/member', 'page.(base)_member', NULL, 'member', 1, 0, 'C', '0', '0', 'member:list', 'material-symbols:person', '', '2026-03-05 18:54:57', '', '2026-03-08 05:52:38', '', 0), (2019, '删除会员', 2018, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'member:remove', 'material-symbols:menu', '', '2026-03-05 18:55:20', '', '2026-03-05 18:55:20', '', 0), (2020, '会员详情', 2018, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'member:query', 'material-symbols:menu', '', '2026-03-05 18:55:47', '', '2026-03-05 18:55:47', '', 0), (2021, '编辑会员', 2018, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'member:edit', 'material-symbols:menu', '', '2026-03-05 18:56:25', '', '2026-03-05 18:56:25', '', 0), (2022, '新增会员', 2018, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'member:add', 'material-symbols:menu', '', '2026-03-05 18:56:53', '', '2026-03-05 18:56:53', '', 0), (2023, '门店管理', 0, 0, '/shop', 'page.(base)_shop', NULL, 'shop', 1, 0, 'C', '0', '0', 'shop:list', 'material-symbols:store', '', '2026-03-05 18:57:46', '', '2026-03-08 05:54:10', '', 0), (2024, '新增门店', 2023, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'shop:add', 'material-symbols:menu', '', '2026-03-05 18:58:10', '', '2026-03-05 18:58:10', '', 0), (2025, '删除门店', 2023, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'shop:remove', 'material-symbols:menu', '', '2026-03-05 18:58:30', '', '2026-03-05 18:58:30', '', 0), (2026, '编辑门店', 2023, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'shop:edit', 'material-symbols:menu', '', '2026-03-05 18:58:53', '', '2026-03-05 18:58:53', '', 0), (2027, '门店详情', 2023, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'shop:query', 'material-symbols:menu', '', '2026-03-05 18:59:26', '', '2026-03-05 18:59:26', '', 0), (2028, '剧本杀排场管理', 0, 0, '/arrange', '', NULL, '', 1, 0, 'M', '0', '0', '', 'material-symbols:store', '', '2026-03-06 11:52:39', '', '2026-03-08 05:53:21', '', 0), (2029, '排场管理', 2028, 0, '/arrange/lr', 'page.(base)_arrange_lr', NULL, 'arrange_lr', 1, 0, 'C', '0', '0', 'arrange:lr:list', 'material-symbols:upload', '', '2026-03-06 11:55:04', '', '2026-03-08 05:53:32', '', 0), (2030, '购票', 2028, 0, '/arrange/ticket', 'page.(base)_arrange_ticket', NULL, 'arrange_ticket', 1, 0, 'C', '0', '0', 'arrange:ticket:list', 'material-symbols:menu', '', '2026-03-06 11:58:34', '', '2026-03-07 09:53:12', '', 0), (2032, '购票', 2030, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'arrange:ticket:add', 'material-symbols:menu', '', '2026-03-06 12:37:54', '', '2026-03-06 12:37:54', '', 0), (2033, '购票详情', 2030, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'arrange:ticket:query', 'material-symbols:menu', '', '2026-03-06 12:39:16', '', '2026-03-06 12:39:16', '', 0), (2034, '新增排场', 2029, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'arrange:lr:add', 'material-symbols:menu', '', '2026-03-06 17:05:15', '', '2026-03-06 17:05:15', '', 0), (2035, '删除排场', 2029, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'arrange:lr:remove', 'material-symbols:menu', '', '2026-03-06 17:05:32', '', '2026-03-06 17:05:32', '', 0), (2036, '排场详情', 2029, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'arrange:lr:query', 'material-symbols:menu', '', '2026-03-06 17:05:50', '', '2026-03-06 17:05:50', '', 0), (2037, '编辑排场', 2029, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'arrange:lr:edit', 'material-symbols:menu', '', '2026-03-06 17:06:11', '', '2026-03-06 17:06:11', '', 0), (2038, '购票支付', 2030, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'arrange:ticket:pay', 'material-symbols:menu', '', '2026-03-07 15:57:44', '', '2026-03-07 15:57:44', '', 0), (2039, '购票退款', 2030, 0, '', '', NULL, '', 1, 0, 'F', '0', '0', 'arrange:ticket:refund', 'material-symbols:menu', '', '2026-03-07 15:58:09', '', '2026-03-07 15:58:09', '', 0), (2040, '个人中心', 0, 0, '/user-center', 'page.(base)_user-center', NULL, 'user-center', 1, 0, 'C', '1', '0', '', 'material-symbols:person', '', '2026-03-08 05:48:42', '', '2026-03-08 05:52:52', '', 0);

-- Table structure for table `sys_oper_log`
DROP TABLE IF EXISTS `sys_oper_log`;
CREATE TABLE `sys_oper_log` (
  `oper_id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志主键',
  `title` varchar(50) DEFAULT '' COMMENT '模块标题',
  `business_type` int DEFAULT '0' COMMENT '业务类型（0其它 1新增 2修改 3删除）',
  `method` varchar(100) DEFAULT '' COMMENT '方法名称',
  `request_method` varchar(10) DEFAULT '' COMMENT '请求方式',
  `operator_type` int DEFAULT '0' COMMENT '操作类别（0其它 1后台用户 2手机端用户）',
  `oper_name` varchar(50) DEFAULT '' COMMENT '操作人员',
  `dept_name` varchar(50) DEFAULT '' COMMENT '部门名称',
  `oper_url` varchar(255) DEFAULT '' COMMENT '请求URL',
  `oper_ip` varchar(128) DEFAULT '' COMMENT '主机地址',
  `oper_location` varchar(255) DEFAULT '' COMMENT '操作地点',
  `oper_param` varchar(2000) DEFAULT '' COMMENT '请求参数',
  `json_result` varchar(2000) DEFAULT '' COMMENT '返回参数',
  `status` int DEFAULT '0' COMMENT '操作状态（0正常 1异常）',
  `error_msg` varchar(2000) DEFAULT '' COMMENT '错误消息',
  `oper_time` datetime DEFAULT NULL COMMENT '操作时间',
  `cost_time` bigint DEFAULT '0' COMMENT '消耗时间',
  PRIMARY KEY (`oper_id`),
  KEY `idx_sys_oper_log_bt` (`business_type`),
  KEY `idx_sys_oper_log_s` (`status`),
  KEY `idx_sys_oper_log_ot` (`oper_time`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='操作日志记录';

-- Table structure for table `sys_role`
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `role_id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(30) NOT NULL COMMENT '角色名称',
  `role_key` varchar(100) NOT NULL COMMENT '角色权限字符串',
  `role_sort` int NOT NULL COMMENT '显示顺序',
  `data_scope` char(1) DEFAULT '1' COMMENT '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
  `menu_check_strictly` tinyint(1) DEFAULT '1' COMMENT '菜单树选择项是否关联显示',
  `dept_check_strictly` tinyint(1) DEFAULT '1' COMMENT '部门树选择项是否关联显示',
  `status` char(1) NOT NULL COMMENT '角色状态（0正常 1停用）',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_key` (`role_key`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色信息表';

-- Dumping data for table `sys_role`
INSERT INTO `sys_role` VALUES (100, '超级管理员', 'SUPERADMIN', 0, '1', 1, 1, '0', '0', '', '2026-01-30 19:34:16', '', '2026-02-26 15:38:14', '拥有所有权限的超级管理员'), (143, '普通用户角色', 'USER', 0, '1', 1, 1, '0', '0', '', '2026-03-08 10:53:37', '', '2026-03-08 10:53:37', '');

-- Table structure for table `sys_role_menu`
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `menu_id` bigint NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`,`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色和菜单关联表';

-- Dumping data for table `sys_role_menu`
INSERT INTO `sys_role_menu` VALUES (102, 1), (102, 2), (102, 600), (103, 1), (103, 2), (103, 600), (119, 1), (119, 2), (119, 600), (125, 1), (125, 2), (125, 600), (130, 1), (130, 2), (130, 600), (143, 600);

-- Table structure for table `sys_user`
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `user_id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `dept_id` bigint DEFAULT NULL COMMENT '部门ID',
  `user_name` varchar(30) NOT NULL COMMENT '用户账号',
  `nick_name` varchar(30) NOT NULL COMMENT '用户昵称',
  `user_type` varchar(2) DEFAULT '00' COMMENT '用户类型（00系统用户）',
  `email` varchar(50) DEFAULT '' COMMENT '用户邮箱',
  `phonenumber` varchar(11) DEFAULT '' COMMENT '手机号码',
  `sex` char(1) DEFAULT '0' COMMENT '用户性别（0男 1女 2未知）',
  `avatar` varchar(100) DEFAULT '' COMMENT '头像地址',
  `password` text COMMENT '密码',
  `status` char(1) DEFAULT '0' COMMENT '账号状态（0正常 1停用）',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `login_ip` varchar(128) DEFAULT '' COMMENT '最后登录IP',
  `login_date` datetime DEFAULT NULL COMMENT '最后登录时间',
  `pwd_update_date` datetime DEFAULT NULL COMMENT '密码最后更新时间',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户信息表';

-- Dumping data for table `sys_user`
INSERT INTO `sys_user` VALUES (1, 103, 'admin', 'en', '00', 'en@163.com', '15888888888', '1', 'http://127.0.0.1:3000/static/uploads/file-1772961569434-495070850.jpg', 'VhnZpKzCmz1/k3IZjKq1VXtGdA4YX4euYgs4RdeyzqNDoQGJsF7yHgPG3U9PN3KB58hu9e+PYzgVwr//R1dMuq0kxp59LvugrlbikrOOYvUFVje9tnI0wYl6+nyXi+8kFVYRP3/quadthzHfY6mOysKybjZpEGjUPEdKCV32BZu2qcFoWn1T6mAD3brME+wkpg6s8L0luR0e74W28ey4hM/gU+tqSesJl08eFHPCPDwVUHsPwXBdKsnrPJjOIbdJw/hF8/SU4N6G+ayRP5STGrBz9pRi4CiGgjbXZglXYLt9+orrdrV0C/pUZm8VpOtmNQt/EB6SDhNIZalMryaNAluV1y/4uW447z/ca4ToYEjdB4ztdw2bi5Gz9hR3tlHuAxAVT5bcGPiiaJzhnNoI8BbyJzJvK8QqAtBcocSJ0Tfd7OzMT0kUWirJ6JYo5HARh6TRhB04xLdxo4j06YgIEtKjsa2qsjPjIpsuYqaGCgE1jG1VJLU+H7CUc5hCCgnO', '0', '0', '127.0.0.1', '2026-01-31 00:37:36', '2026-01-31 00:37:36', 'admin', '2026-01-31 00:37:36', '', '2026-03-08 09:26:44', '管理员'), (114, NULL, 'user', 'user', '00', NULL, '', '0', 'http://127.0.0.1:3000/static/uploads/file-1772967234373-643343866.png', 'rLk8T59NF48BDy1P14SqmG4GjwXe3mftxUDgJFEZRZpZ4XqWtvPDtc/6E9q0u37QGj492nd553lFq/rX2CuTrPZr8jDKq0151xuTHDv2Ih89NJJGckUW7V+wR296bixIVJr++jckiuRGHFyDyFGgwKAfw0OI4Rf+WSM6fpAIB2NLydohz1dJM3YSgqrwDC3+y8VLN0MFq1SLozPmpwGndGt/aqSaz19VZx/XBOUnQSLnCiZPsmLzn9rhb3H0ZSZmmF3GFoFCdm/9Nk3IGDqI0QPiOHBysttf58LCNDOcYs3pUtNdHeMTFRLd3ksRDlH2WJd4TGUWUBJL1KUunF4r7+5bidI1GRXsscBUWtUsUhUP1YfP+1plY7qQJLAGQJPibQodvYX/wCo5cam6rWp+7QzQhEil8jqQMAlQaq1lkiVMN5a0On91UomEcNttgxWXlMeysOH5cpIaa2lmCkJ/ZpOZyWwr2LyYXvogIt4fl1mDriLedXU/2afBlLIpyY0R', '0', '0', '', NULL, '2026-03-08 10:54:18', '', '2026-03-08 10:54:04', '', '2026-03-08 10:54:18', '');

-- Table structure for table `sys_user_dept`
DROP TABLE IF EXISTS `sys_user_dept`;
CREATE TABLE `sys_user_dept` (
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `dept_id` bigint NOT NULL COMMENT '部门ID',
  PRIMARY KEY (`user_id`,`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户和部门关联表';

-- Dumping data for table `sys_user_dept`
INSERT INTO `sys_user_dept` VALUES (100, 200);

-- Table structure for table `sys_user_role`
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户和角色关联表';

-- Dumping data for table `sys_user_role`
INSERT INTO `sys_user_role` VALUES (1, 100), (114, 143);

-- Table structure for table `ticket`
DROP TABLE IF EXISTS `ticket`;
CREATE TABLE `ticket` (
  `ticket_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL COMMENT '会员ID',
  `arrange_id` bigint NOT NULL COMMENT '排场ID',
  `shop_id` bigint NOT NULL,
  `count` int DEFAULT '1' COMMENT '购买张数',
  `pay_amount` decimal(10,2) DEFAULT '0.00' COMMENT '支付金额',
  `status` char(1) DEFAULT '0' COMMENT '状态（0未支付 1已支付 2已过期 3已退款）',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `trade_no` varchar(255) DEFAULT NULL COMMENT '支付宝交易号',
  `order_no` varchar(255) NOT NULL COMMENT '订单编号',
  `pay_time` date DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  UNIQUE KEY `ticket_pk` (`order_no`),
  KEY `ticket_shop_shop_id_fk` (`shop_id`),
  CONSTRAINT `ticket_shop_shop_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`shop_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='购票表';

SET FOREIGN_KEY_CHECKS = 1;
