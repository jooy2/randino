import { words } from '../../../_internal/parse.js';
import type { WordModifierData } from '../types.js';

// What `randModifier` needs of the language, apart from its nouns: the modifiers,
// how they agree, and the shapes they sit in. `zh.ts` spreads it into the whole
// dataset.
export const ZH_MODIFIERS = /*#__PURE__*/ ((): WordModifierData => ({
	joiner: '',
	capitalize: false,
	// Two-character modifiers, which sit directly in front of a noun without 的:
	// 快乐 + 熊猫, 神秘 + 森林.
	// Two-character descriptive compounds, which sit straight in front of a noun:
	// 神秘 + 森林, 蓝色 + 海洋.
	adjectives: words(`
		快乐 悲伤 聪明 神秘 温柔 勇敢 安静 热闹 优雅 自由 永恒 透明 甜美 苦涩 清凉 温暖
		寒冷 古老 崭新 明亮 黑暗 遥远 巨大 迷你 圆润 锋利 柔软 坚硬 轻盈 沉稳 闪亮 朦胧
		孤独 好奇 慵懒 淘气 高贵 朴素 疾速 缓慢 深邃 辽阔 蓝色 红色 金色 银色 白色 黑色
		绿色 紫色 星光 月光 晨光 夜色 云端 雨中 雪白 风中 梦中 彩虹 灿烂 璀璨 空灵 逍遥
		飘逸 灵动 俏皮 狂野 静谧 浩瀚 皎洁 绚丽 悠然 暮色 橙色 粉色 灰色 湛蓝 碧绿 绯红
		墨黑 淡紫 朱红 火红 金黄 漆黑 米白 藏青 靛蓝 青碧 开朗 活泼 沉默 冷静 温和 豪迈
		潇洒 洒脱 端庄 顽皮 机灵 敏捷 稳重 谦逊 恬静 从容 淡然 忧郁 欢快 雀跃 呆萌 娇俏
		傲然 超然 疏狂 晨曦 朝露 初雪 微雨 落霞 流云 清风 明月 春日 夏日 秋日 冬日 深夜
		破晓 薄暮 拂晓 子夜 秋霜 春风 无声 无名 酥脆 香甜 清爽 醇厚 绵软 蓬松
		光滑 湿润 冰凉 滚烫
		英勇 果敢 忠诚 耐心 警觉 灵巧 稳健 温润 豁达 爽朗 内敛 倔强 憨厚 狡黠 顽强 娴静
		雍容 毛茸茸 光溜溜 亮晶晶 圆滚滚 沉甸甸 轻飘飘 冷冰冰 热腾腾 香喷喷 甜丝丝
		酸溜溜 苦哈哈 斑驳 条纹 生锈 磨损 崭亮 陈旧 厚实 单薄 扁平 尖锐 弯曲 笔直 修长
		短粗 柔和 喧腾 静默 清脆 洪亮 低沉 悠扬 婉转 铿锵 沙哑 和煦 凛冽 闷热 干爽 湿冷
		阴沉 晴朗 多风 有雾 露重 霜白 星辉 月华 青苔 藤蔓 竹影 松涛 枫红 荷香 菊淡 兰幽
		芦白 苇黄 翡翠 珊瑚 象牙 黑曜 水晶 白银 青铜 锡白 铅灰 玛瑙 胭脂 石青 藤黄 赭石
		黛色 缃色 缥色 秋香 月白 天青 辽远 细微 壮丽 简朴 精巧 粗犷 纤弱 强健 宽厚 陡峭
	`),
	// Verbs, which a Chinese noun takes only through 的 — 奔跑的狮子, never
	// 奔跑狮子. The frame that uses them carries that 的, which is the reason the
	// two pools are apart.
	actions: words(`
		飞舞 奔跑 沉睡 微笑 歌唱 漂泊 隐匿 燃烧 冰封 绽放 凋零 摇曳 闪烁 徘徊 追逐 守望
		遗失 流浪 学习 工作 烹饪 绘画 书写 阅读 计数 建造 修补 种植 挖掘 垂钓 狩猎 等待
		守护 寻找 呼唤 呐喊 低语 凝视 窥探 聆听 铭记 想象 沉思 犹豫 决意 欢呼 问候 拥抱
		抚摸 安慰 唤醒 打盹 伸展 旅行 逃离 追赶 跃入 腾空 降落 盘旋 踱步 爬行 翻滚 嬉戏
		玩耍 进食 饮水 咀嚼 烧烤 敲击 搬运 推动 拉扯 投掷 抓取 掉落 藏匿 浮现 融化 流淌
		溢出 冻结 燃起 散落 倾泻 渗入 蔓延 成熟 生长 枯萎 低垂 点头 歇息 倚靠 悬挂 躺卧
		静坐 停驻 叹息 疾行 潜行 悬浮 摇摆 起伏 击鼓 弹奏 吹哨 吟唱 编织 雕刻 锻造 航行
		划桨 行军 竞逐 角力 抛接 消失 归来
		苏醒 起身 站起 坐下 蹲伏 依偎 回身 走近 后退 驻足 行走 迈步 疾走 穿过 折返 离去
		远去 潜步 踉跄 蹦跳 环顾 仰望 俯视 远眺 注视 轻触 抚平 整理 打理 清洗 擦拭 磨亮
		编结 缝制 裁剪 粘贴 折叠 展开 开启 关闭 填满 倒空 斟满 盛放 搅拌 熬煮 翻炒 加热
		放凉 品尝 吞咽 镌刻 染色 涂抹 削磨 掂量 回味
	`),
	frames: [
		{ slots: ['noun'], weight: 10 },
		{ slots: ['adjective', 'noun'], weight: 38 },
		{ slots: ['action', 'noun'], glue: ['的'], weight: 26 },
		{ slots: ['noun', 'part'], glue: ['的'], weight: 16 },
		{ slots: ['adjective', 'noun', 'part'], glue: ['', '的'], weight: 10 }
	],
	syn: {
		kind: 'pool',
		pool: words(`
			星 月 云 风 雨 雪 霜 雾 光 影 火 水 山 石 木 花 叶 鸟 兽 龙 虎 狼 鹿 鱼 玉 金 银
			铁 玄 幻 灵 神 圣 暗 明 夜 晨 昏 霞 岚 潮 渊 峰 谷 林 野 沙 川 洲 岛
		`),
		minSyllables: 2,
		maxSyllables: 3
	}
}))();
