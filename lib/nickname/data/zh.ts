import { words } from '../../_internal/parse.js';
import type { NicknameLanguageData } from './types.js';

export const ZH: NicknameLanguageData = {
	joiner: '',
	capitalize: false,
	// Two-character modifiers, which sit directly in front of a noun without 的:
	// 快乐 + 熊猫, 神秘 + 森林.
	modifiers: words(`
		快乐 悲伤 聪明 神秘 温柔 勇敢 安静 热闹 优雅 自由 永恒 透明 甜美 苦涩 清凉 温暖
		寒冷 古老 崭新 明亮 黑暗 遥远 巨大 迷你 圆润 锋利 柔软 坚硬 轻盈 沉稳 闪亮 朦胧
		孤独 好奇 慵懒 淘气 高贵 朴素 疾速 缓慢 深邃 辽阔 蓝色 红色 金色 银色 白色 黑色
		绿色 紫色 星光 月光 晨光 夜色 云端 雨中 雪白 风中 梦中 彩虹
	`),
	nouns: {
		animal: words(`
			狮子 老虎 豹子 猎豹 狐狸 灰狼 黑熊 熊猫 水獭 兔子 松鼠 猫咪 小狗 鲸鱼 海豚 鲨鱼
			乌龟 海豹 企鹅 猫头鹰 麻雀 喜鹊 燕子 老鹰 游隼 仙鹤 天鹅 鸭子 啄木鸟 鹦鹉 孔雀
			鸵鸟 骏马 小鹿 大象 长颈鹿 河马 猴子 大猩猩 青蛙 蜥蜴 变色龙 蟒蛇 蝴蝶 飞蛾
			蜜蜂 蜻蜓 瓢虫 蜗牛 蚂蚁 蜘蛛 章鱼 乌贼 海星 螃蟹 龙虾 鲤鱼 三文鱼 刺猬 浣熊
			猞猁 骆驼 树懒 蝙蝠 白鹭 鹈鹕
		`),
		object: words(`
			水瓶 铅笔 橡皮 雨伞 灯笼 台灯 时钟 镜子 钥匙 铜锁 书包 帽子 鞋子 手套 围巾 眼镜
			戒指 纽扣 绣针 丝线 剪刀 画笔 颜料 纸张 笔记 书签 信件 明信片 邮票 印章 罗盘
			地图 望远镜 显微镜 相机 胶卷 收音机 钢琴 吉他 提琴 战鼓 铜铃 气球 风筝 陀螺
			弹珠 骰子 卡片 拼图 积木 单车 火车 小船 船帆 铁锚 灯塔 帐篷 背包 火柴 蜡烛 花瓶
			茶壶 茶杯 勺子 盘子 铁锅 斧头 锯子 梯子 齿轮 磁铁 丝带 信封 枕头 毛毯 竹篮
			扫帚 哨子 绳结 木桶
		`),
		nature: words(`
			天空 白云 微风 细雨 白雪 霜花 冰晶 薄雾 露珠 彩虹 晚霞 朝阳 黎明 黄昏 星辰 月亮
			太阳 银河 彗星 流星 极光 闪电 雷鸣 阵雨 季风 台风 旋风 波浪 潮水 海洋 河流 湖泊
			瀑布 峡谷 高山 丘陵 草原 森林 树木 叶子 花朵 树根 种子 果实 苔藓 蕨类 竹林 松树
			枫叶 樱花 蒲公英 向日葵 洞穴 沙漠 沙粒 岩石 卵石 火山 地震 余烬 冰川 珊瑚 湿地
			回声 影子
		`),
		concept: words(`
			自由 和平 正义 真理 智慧 勇气 记忆 想象 故事 诗歌 歌曲 舞蹈 素描 语法 逻辑 物理
			化学 生物 哲学 数学 几何 代数 历史 神话 传说 寓言 谚语 谜语 秘密 承诺 友谊 旅程
			冒险 航行 发现 实验 问题 答案 辩论 集会 市场 广场 城市 村落 巷子 桥梁 花园
			图书馆 博物馆 剧院 学校 公园 节日 假日 季节 瞬间 永恒 宇宙 维度 平衡 和谐 节奏
			旋律 和弦 色板 对比 仪式 习俗 文化 语言 字母 密码 档案 图集 历法
		`)
	},
	// No `parts` pool: a Chinese noun-noun compound reads as garbled rather than
	// playful once the base noun is abstract, so nicknames stay at modifier + noun.
	syn: {
		kind: 'pool',
		pool: words(`
			星 月 云 风 雨 雪 霜 雾 光 影 火 水 山 石 木 花 叶 鸟 兽 龙 虎 狼 鹿 鱼 玉 金
			银 铁 玄 幻 灵 神 圣 暗 明 夜 晨 昏 霞 岚 潮 渊 峰 谷 林 野 沙 川 洲 岛
		`),
		minSyllables: 2,
		maxSyllables: 3
	}
};
