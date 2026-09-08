import { words } from '../../_internal/parse.js';
import type { SentenceLanguageData } from './types.js';

export const ZH: SentenceLanguageData = {
	space: '',
	capitalize: false,
	terminators: { statement: '。', question: '？', exclamation: '！', trailing: '…' },
	// The curly quotes rather than 「」: these pools are written in simplified
	// Chinese, and horizontal simplified text uses “” — the corner brackets are
	// what Taiwan and Hong Kong write.
	quotes: { double: ['“', '”'], single: ['‘', '’'] },
	// Chinese marks the past beside the verb rather than on it: `狮子跑了`,
	// `狐狸吃了苹果`. A state takes no mark at all.
	pastMark: { tail: '了' },
	// Chinese verbs take no form of their own — the same word stands whoever does
	// it and whenever it happened.
	verbs: [
		{
			field: 'rise',
			subject: ['creature', 'person'],
			words: words(`起床 醒来 起身 站起来 苏醒 坐起来 爬起来 醒过来 睁开眼 翻身起来 伸懒腰`)
		},
		// Setting off: the verbs that need somewhere to go, and the ones that stand
		// on their own. The direction is in the verb — 去, 回到 — so the destination
		// follows it with nothing in between.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			words: words(`去 前往 赶往 去往 前去 奔赴 走进 进入 走过去 赶去 转到 靠近 溜达到`)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			// Running somewhere is for legs: a fish and a snake go, and do not run.
			subjectWithout: ['swimmer', 'crawler'],
			words: words(`走向 跑向 跑到 走去 跑去 跑进 走上 爬上 冲向 冲进 奔向 步行去`)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			words: words(
				`出发 离开 出门 动身 起程 启程 上路 离去 走开 走掉 溜走 跑开 出去 走出去 迈开步子`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			words: words(`到达 抵达 回到 来到 赶到 走到 跑到 返回到 转回 溜回 赶回 跑回 走回`)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			words: words(`返回 归来 回家 回来 归家 到家 返家 现身 露面 回到家 归去 返程`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			words: words(
				`奔跑 行走 跳跃 散步 溜达 慢跑 快跑 小跑 踱步 漫步 疾走 大步走 蹦跳 跳 跑 走 闲逛 踮脚走 蹒跚 昂首阔步 转悠 跑来跑去 蹦蹦跳跳 疾跑 拔腿就跑`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			words: words(`徘徊 经过 移动 转身 打转 走动 挪动 后退 来回走 掠过 穿过 游荡 漂泊 兜圈子`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			words: words(`游泳 游 潜水 浮出水面 漂浮 游动 划水 游来游去 扑腾`)
		},
		{
			field: 'move',
			// Flying is a flier's alone: a sparrow's, a dragon's, never a fish's.
			subject: ['creature'],
			subjectTraits: ['flier'],
			words: words(
				`飞翔 飞 起飞 飞起 盘旋 滑翔 扑腾翅膀 拍打翅膀 飞走 飞过 掠过 降落 落下 栖息 飞来飞去 振翅 翱翔`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			words: words(`爬行 爬 蠕动 蜿蜒 爬来爬去 爬出来 爬上去 缠绕 钻洞 匍匐 扭动`)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			words: words(
				`等待 躲藏 环顾 犹豫 停下 张望 倾听 屏息 静候 停留 逗留 徘徊不前 站着不动 偷看 窥视 观望 发呆 迟疑 磨蹭 守候 呆立 张望四周`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			words: words(
				`休息 坐下 躺下 靠着 蜷缩 歇息 歇一歇 歇脚 坐着 躺着 斜靠 倚靠 跪下 蹲下 伸腿 舒展 放松 趴下 仰躺 歇口气 喘口气 小憩`
			)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			words: words(
				`睡觉 入睡 打盹 睡着 睡 小睡 午睡 打瞌睡 昏睡 熟睡 沉睡 打呼噜 做梦 闭眼 进入梦乡 睡熟 迷迷糊糊睡去 酣睡`
			)
		},
		// What somebody shows, split by what it shows — see the Korean data.
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'content',
			words: words(
				`微笑 哼歌 大笑 咯咯笑 傻笑 欢呼 点头 拍手 眨眼 咧嘴笑 眉开眼笑 笑出声 轻笑 哼着小曲`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'restless',
			words: words(
				`哭泣 叹气 咕哝 抽泣 呜咽 抱怨 嘀咕 皱眉 摇头 自言自语 流泪 踱步 咬嘴唇 挠头 撇嘴 坐立不安 唉声叹气 发牢骚`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'tired',
			words: words(`打哈欠 揉眼睛 伸懒腰 揉肩膀 转脖子 捶背`)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'hungry',
			words: words(`咽口水 舔嘴唇 摸肚子 吸鼻子 流口水`)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			words: words(`喊叫 倒吸一口气 耸肩 挥手 脸红 尖叫 叫喊 歪头 瞪大眼睛 回头 抬头 一愣`)
		},
		{
			field: 'talk',
			subject: ['creature', 'person'],
			words: words(
				`聊天 说话 谈话 交谈 闲聊 攀谈 低语 耳语 絮叨 唠叨 闲谈 寒暄 打招呼 谈天 叙旧 说笑 交流`
			)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			words: words(
				`跳舞 歌唱 打滚 玩耍 蹦跳 嬉戏 玩 唱歌 翻滚 转圈 撒欢 玩闹 嬉闹 捉迷藏 踢球 戏水 翻跟头 蹦来蹦去 打闹 撒野 疯玩`
			)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			words: words(
				`记得 忘记 想象 数 想起 惦记 思考 想 回忆 回想 琢磨 担心 相信 期待 理解 明白 梦见 怀念 向往 思念 牵挂 惦念 领悟 揣摩 憧憬 记住 忘掉 想念`
			)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(
				`观看 注视 打量 检查 触摸 抚摸 端详 看 瞧 盯着 瞅 细看 凝视 审视 观察 瞥 扫视 察看 查看 摸 拍 敲 闻 摆弄 掂量 欣赏 翻看 瞧瞧 摸摸 看看`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			words: words(
				`寻找 搜寻 翻找 找寻 找 搜索 搜查 摸索 探索 探寻 四处找 到处找 翻箱倒柜 觅食 寻觅 搜罗 查找 挖掘 探路`
			)
		},
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(
				`找到 发现 捡起 寻得 找出 找回 拾起 拾到 挖出 掏出 翻出 找着 觅得 搜到 捡到 发掘 寻到 撞见 得到 捞到`
			)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(
				`挑选 拿起 抓住 拿 取出 收下 拿走 拿到 抓起 抓取 握住 握着 拾取 取 选 挑 捡 摘 领取 接过 接住 提起 端起 捧起 举起 攥住 拽住 抱起 叼起 拿下`
			)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(
				`搬运 带回 抱着 提着 拿回 搬 带 带走 带来 带上 拿着 扛 扛着 背 背着 拖 拉 推 提 抱 端 捧 运 运送 运走 搬走 搬来 扛走 背回 拖走 驮`
			)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(
				`藏起 收好 守护 埋起 藏好 藏 收起 收藏 保存 储存 储藏 保管 存放 放好 塞进 塞好 掩藏 遮住 盖住 包好 包起来 藏起来 收起来 埋好 珍藏 留着 看守 藏匿 掖好`
			)
		},
		{
			field: 'lose',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`弄丢 丢失 丢下 丢 丢掉 掉落 遗失 遗落 弄掉 遗忘 弄没 忘带 弄不见`)
		},
		{
			field: 'meet',
			subject: ['creature', 'person'],
			object: ['person'],
			words: words(
				`遇见 碰见 见到 遇到 碰到 遇上 碰上 看见 会见 拜访 探望 看望 迎接 欢迎 问候 招呼 拥抱 邂逅 结识 约见 会面`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(
				`制作 建造 雕刻 绘制 编织 组装 做 造 制造 打造 建 修建 搭建 拼装 设计 创作 做出 造出 做成 做好 完成 装饰 塑造 捏 刻 雕 画`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			// Forged, cast and welded: metal and wood, never a coat or a jewel.
			objectThemes: ['object', 'tool', 'vehicle'],
			words: words(`锻造 铸造 焊接 打制 钉 拼接 组合 加工`)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing'],
			// Sewn and knitted: what is worn.
			objectThemes: ['clothing'],
			words: words(`缝制 缝 织 编 裁剪 绣 钩织 缝合`)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(
				`修理 擦拭 保养 整理 打磨 修补 修 修好 擦 擦干净 清洗 清洁 打扫 洗 刷 抹 擦亮 上油 拧紧 调整 校准 检查 检修 维修 维护 照料 打理 收拾 晾干 擦掉灰尘 缝补 熨 整修 翻新`
			)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(
				`出售 卖掉 转让 摆卖 卖 卖出 售出 贩卖 兜售 叫卖 转手 出手 让出 拍卖 交易 议价 标价 摆出 陈列 摆摊卖 交出 递出 递交`
			)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			words: words(
				`购买 买下 买回 采购 买 买到 买来 买进 购入 订购 预订 选购 采买 置办 添置 囤 抢购 付款买下 买好 买上`
			)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			words: words(
				`烘烤 加热 煮 烹饪 切 盛上 烤 炒 炸 蒸 炖 煎 煮熟 焖 烧 煲 熬 拌 腌 调味 加盐 撒盐 翻炒 搅拌 翻面 端上 端出 盛出 摆盘 准备 热一热 温热 切碎 切片 剁 削皮 洗净 烹调 烧好 熘 涮 焯 烩 卤 煨 烙 烹`
			)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			words: words(
				`吃 咀嚼 品尝 啃 吃光 吃掉 吃完 尝 尝尝 吃下 咬 咬一口 嚼 大口吃 狼吞虎咽 细嚼慢咽 吞下 吞 舔 啃食 嚼着 尝一口 吃个精光 吃个饱 慢慢吃 大快朵颐 享用 品味 咬下 撕咬 吸溜 舀着吃 吃起来`
			)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			words: words(
				`喝 啜饮 喝光 品饮 喝掉 喝完 喝下 饮 饮用 品 抿 抿一口 喝一口 小口喝 大口喝 猛喝 灌 灌下 咕咚咕咚喝 一饮而尽 慢慢喝 喝干 啜 呷 品尝 享用 慢饮 畅饮 痛饮 喝起来`
			)
		},
		{
			field: 'change',
			subject: ['place'],
			words: words(
				`安静下来 变暗 变亮 热闹起来 沉寂 亮起来 苏醒 醒来 入睡 沉睡 静下来 热闹 喧闹起来 冷清下来 空了 空下来 挤满人 人来人往 闪烁 发亮 发光 结冰 融化 变湿 变干 被雾笼罩 变了样 焕然一新 忙碌起来 沸腾起来 暗下来 明亮起来 生机勃勃 热闹非凡`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			words: words(
				`发光 流淌 加深 开始 结束 持续 过去 继续 停止 临近 到来 来临 降临 逼近 远去 消退 平息 展开 进行 延续 重复 拖延 落幕 接近尾声 反复 流逝 推进`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a time of day or a season does: it wears on, turns, settles.
			subjectThemes: ['time'],
			words: words(`破晓 变深 转凉 转暖 消逝 溜走 更替 交替 悄然来临 渐渐过去 慢慢流逝 迎来 逝去`)
		},
		{
			field: 'change',
			subject: ['event'],
			// What weather does: it rolls in, thickens, lets up.
			subjectThemes: ['weather'],
			words: words(
				`袭来 散去 消散 减弱 增强 加剧 放晴 停歇 肆虐 弥漫 笼罩 飘过 掠过 涌来 席卷 减退 转晴 变大 变小`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a match does: it kicks off, heats up, wraps up.
			subjectThemes: ['sport'],
			words: words(
				`开赛 开幕 白热化 升温 闭幕 收场 重新开始 恢复 举行 举办 延长 进入高潮 进入尾声 开打 开场 收官`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What a thing one can hold does. A song is a thing of another kind, below.
			subjectThemes: [
				'object',
				'tool',
				'clothing',
				'product',
				'toy',
				'furniture',
				'gem',
				'vehicle'
			],
			words: words(
				`摇晃 闪耀 掉落 滚动 倾斜 老化 发亮 晃动 晃 摆动 摇摆 晃来晃去 滑落 滑下 掉下 落下 翻倒 倒下 翻滚 滚落 转动 旋转 停下 静止 移动 褪色 磨损 变旧 蒙尘 失去光泽 变形 弯曲 飞走 飞起 弹起 弹跳 抖动 颤动`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What only something made of metal and wood does: a jewel never rusts.
			subjectThemes: ['object', 'tool', 'vehicle'],
			words: words(
				`生锈 嘎吱作响 咯吱响 吱嘎作响 损坏 坏掉 破损 破碎 碎裂 开裂 断裂 折断 卡住 松动 脱落 散架 报废 失灵 冒烟 哐当响 叮当响`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'event'],
			// What a song or a drum does: it plays, rings out, dies away.
			subjectThemes: ['music', 'sound'],
			words: words(
				`响起 奏响 回荡 回响 飘荡 飘扬 传来 播放 响 鸣响 停止 停下 消失 渐渐消失 变响 变轻 高涨 低沉下去 重复 延续 继续 萦绕 缭绕 荡漾 传遍 奏起 唱响`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			words: words(
				`行驶 停下 经过 返回 出发 滑行 开动 启动 开走 驶离 驶过 驶来 驶入 驶出 驶向 开来 开过 开进 开出 加速 减速 转弯 拐弯 掉头 倒车 停车 停靠 靠站 到站 到达 离开 前进 后退 缓缓前行 疾驰 飞驰 颠簸 摇晃 摇摇晃晃 滑动 滑过 靠近 远去 熄火 空转 鸣笛 减慢 冲过去`
			)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			words: words(
				`蔓延 消失 留下 飘荡 加深 扩散 传播 散去 消散 淡去 淡化 褪去 变淡 变浓 增强 减弱 上升 下降 浮现 涌现 涌起 涌上心头 涌来 复苏 苏醒 重现 回来 回归 消退 平息 沉淀 积累 堆积 弥漫 萦绕 盘旋 闪现 闪过 扎根 生根 滋长 滋生 减退 升温 降温 波动 起伏 延续 持续`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			words: words(
				`生长 枯萎 开花 摇曳 舒展 发芽 抽芽 出芽 萌芽 长出 长大 长高 绽放 盛开 开放 怒放 凋谢 凋零 枯黄 干枯 变黄 变绿 转绿 泛黄 摆动 摇动 摇晃 摇摆 随风摇曳 随风摆动 飘动 招展 伸展 蔓延 攀爬 攀缘 扎根 生根 结果 结果子 挂果 成熟 散发香气 飘香 低垂 垂下 弯下 挺立 变茂盛 落叶 掉叶 抽枝 长叶 吐蕊 含苞 打苞 枯死 复苏 返青`
			)
		},
		{
			field: 'change',
			subject: ['body'],
			words: words(
				`颤抖 移动 麻木 僵硬 发抖 哆嗦 抖动 抽搐 抽动 刺痛 疼痛 疼 痛 酸痛 发酸 发麻 发痒 痒 发热 发烫 发冷 发凉 变冷 变暖 变热 放松 松弛 绷紧 紧绷 僵住 舒展 伸展 弯曲 出汗 冒汗 肿 肿胀 肿起来 消肿 愈合 康复 恢复 发软 发沉 变沉 变轻 跳动 抖 缩 蜷缩 伸直 弯下 抬起 垂下 眨动 转动 摆动 挥动 晃动 颤动 动弹 舒缓 恢复过来`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			words: words(
				`成熟 冷却 沸腾 融化 变质 变凉 变冷 变热 变温 变烫 热起来 凉下来 冒热气 冒气 冒烟 飘香 散发香气 散发香味 香气四溢 变少 减少 剩下 剩余 用完 用光 变多 端上来 上桌 摆上桌 摆好 准备好 做好 凝固 变硬 变软 变坏 变馊 发酵 结冰 变稠 变稀 沉淀 冒着热气`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a dish does and a drink does not: it sizzles, crumbles, goes stale.
			subjectThemes: ['food'],
			words: words(
				`烤焦 烧焦 烧糊 变脆 变酥 变干 受潮 发霉 变酸 膨胀 发起来 煮熟 煮烂 烤好 烤熟 蒸熟 炸酥 出炉 出锅 上色 掉渣 散开 碎掉 塌下去`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a drink does and a dish does not: it fizzes, spills, goes flat.
			subjectThemes: ['drink'],
			words: words(
				`冒泡 起泡 冒气泡 起泡沫 泛起泡沫 洒出 泼出 晃荡 荡漾 晃出来 变浑 变浊 澄清 走气 跑气 变淡 变浓 冒着泡 溢出`
			)
		}
	],
	// A bare adjective cannot stand as a predicate on its own, so the shape that
	// uses one writes 很 in front of it.
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`
				大 小 快 慢 安静 吵闹 勇敢 懒 忙 凶 温和 聪明
				年轻 年老 强壮 虚弱 大胆 胆小 害羞 骄傲 活泼 稳重 固执 敏捷 警觉 结实 老实 机灵
			`)
		},
		{ subject: ['creature', 'person'], condition: 'hungry', words: words(`饿 饥饿 饥肠辘辘`) },
		{ subject: ['creature', 'person'], condition: 'full', words: words(`饱 饱足 饱胀 满腹`) },
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			words: words(`累 困 疲倦 乏 疲惫 疲乏 困倦 乏力`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			words: words(`精神 神清气爽 有精神 清爽 轻松 精力充沛`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			words: words(`高兴 开心 快乐 满足 舒心 愉快 欣喜 惬意 得意 安心`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			words: words(`无聊 好奇 焦急 不安 烦躁 忐忑 心慌 心神不宁`)
		},
		{
			subject: [
				'creature',
				'person',
				'plant',
				'edible',
				'thing',
				'vehicle',
				'place',
				'event',
				'idea',
				'body'
			],
			words: words(`美丽 陌生 新 常见 罕见 可爱 眼熟 奇特 普通 特别 珍稀`)
		},
		{
			subject: ['place', 'event'],
			words: words(`
				宽阔 狭窄 平静 深 暗 亮 遥远 陡峭
				热闹 冷清 拥挤 空旷 辽阔 幽深 昏暗 平坦 漫长 短暂 明媚
			`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`
				坚硬 轻 重 旧 光滑 透明 结实
				圆 扁 尖 薄 厚 脆弱 华丽 朴素 精致 粗糙 沉甸甸
			`)
		},
		{
			subject: ['edible'],
			words: words(`甜 咸 辣 酸 烫 凉 香 苦 浓 淡 温热 鲜美 清爽 油腻 软 脆`)
		},
		{
			subject: ['idea'],
			words: words(`简单 明显 模糊 永恒 短暂 复杂 清晰 深奥 熟悉 珍贵 隐秘 微小 有趣 难 容易`)
		},
		{
			subject: ['plant'],
			words: words(`青翠 茂盛 芬芳 枯黄 高大 娇嫩 细长 苍翠 稀疏 繁密`)
		},
		{
			subject: ['body'],
			words: words(`温暖 冰凉 酸痛 僵硬 柔软 粗糙 光滑 苍白 有力 麻木 沉重`)
		}
	],
	// Attributive, with 的 where an adjective of two syllables needs it in front of
	// its noun and none where one of a single syllable does not.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				勇敢的 安静的 勤劳的 懒惰的 害羞的 聪明的 年轻的 年老的 小 大 活泼的 悠闲的 敏捷的 好奇的
				大胆的 胆小的 谨慎的 固执的 温顺的 吵闹的 强壮的 瘦弱的 胖乎乎的 困倦的 狡黠的 警觉的 沉默的 骄傲的 天真的 老实的 机灵的 稳重的
			`)
		},
		{
			subject: ['person'],
			words: words(`
				年轻的 亲切的 严厉的 认真的 忙碌的 诚实的
				睿智的 谦逊的 沉默寡言的 健谈的 熟练的 有名的 贫穷的 富有的 正直的 和气的 严肃的 年迈的 爽朗的 精明的
			`)
		},
		{
			subject: ['creature'],
			words: words(`
				敏捷的 凶猛的 温顺的 胖胖的 小小的
				毛茸茸的 斑驳的 有条纹的 瘦削的 巨大的 灵巧的 圆滚滚的 油亮的 细长的
			`)
		},
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(`
				甜甜的 香辣的 温热的 新鲜的 酥脆的 香喷喷的 热乎乎的 咸香的 软软的 熟透的 美味的
				金黄的 焦香的 绵软的 弹牙的 浓郁的 清淡的 刚出炉的 冒着热气的 酸甜的 油润的 朴素的
			`)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(`
				甜甜的 温热的 冰凉的 清凉的 热的 芬芳的 新鲜的 浓浓的 苦涩的
				温吞的 冒泡的 澄澈的 浑浊的 醇厚的 清淡的 酸甜的 滚烫的 微凉的
			`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`
				旧 新 小 大 轻巧的 沉重的 闪亮的 光滑的 透明的 坚硬的 漂亮的 珍贵的 古老的
				生锈的 磨损的 擦亮的 朴素的 华丽的 细长的 扁平的 圆圆的 尖尖的 薄薄的 厚厚的 易碎的 蒙尘的 弯曲的 精巧的
			`)
		},
		{
			subject: ['vehicle'],
			words: words(`快速的 缓慢的 结实的 吱呀作响的 锃亮的 锈迹斑斑的 摇晃的 庞大的 破旧的 崭新的`)
		},
		{
			subject: ['place'],
			words: words(`
				安静的 宽阔的 昏暗的 明亮的 陌生的 古老的 温馨的 僻静的 热闹的 遥远的 附近的 空荡荡的 冷清的 阳光明媚的
				狭窄的 拥挤的 多风的 雾蒙蒙的 阴凉的 尘土飞扬的 潮湿的 布满岩石的 陡峭的 平坦的 荒凉的 绿意盎然的 无人的 开阔的
			`)
		},
		{
			subject: ['plant'],
			words: words(`
				翠绿的 茂盛的 芬芳的 幼小的 枯萎的 高大的 小小的 娇嫩的
				带刺的 盛开的 初绽的 攀爬的 野生的 细长的 苍白的 低垂的 繁茂的
			`)
		},
		{
			subject: ['idea'],
			words: words(`
				模糊的 古老的 新 陌生的 清晰的 珍贵的 小小的 奇怪的
				淡淡的 简单的 复杂的 固执的 短暂的 遥远的 大胆的 隐秘的 安静的 熟悉的
			`)
		},
		{
			subject: ['event'],
			words: words(`
				漫长的 短暂的 安静的 晴朗的 阴沉的 喧闹的 突然的
				盛大的 简朴的 庄严的 欢乐的 无聊的 下雨的 平静的 忙碌的 拥挤的 热闹的
			`)
		},
		{
			subject: ['body'],
			words: words(
				`小小的 冰凉的 温暖的 纤细的 结实的 柔软的 僵硬的 酸痛的 粗糙的 光滑的 苍白的 有力的`
			)
		},
		{
			subject: [
				'creature',
				'person',
				'plant',
				'thing',
				'vehicle',
				'place',
				'event',
				'idea',
				'body'
			],
			words: words(`美丽的 神秘的 陌生的 新 可爱的 眼熟的 奇特的 普通的 出色的 朴素的`)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				安静地 慢慢地 迅速地 静静地 悄悄地 独自 稍稍 小心地 有力地 轻轻地 用力地 认真地 匆匆地 缓缓地 默默地 从容地 欢快地 稳稳地 淡淡地 欣然 悠然
				蹑手蹑脚地 慌慌张张地 犹犹豫豫地 东张西望地 一步一步地 大步地 快步地 慢吞吞地 急急忙忙地 小心翼翼地 全神贯注地 若无其事地
				得意地 骄傲地 羞怯地 温柔地 粗鲁地 笨拙地 灵巧地 熟练地 勉强地 特意地 顺手地 轻快地 沉稳地 兴冲冲地 气呼呼地 乐呵呵地
				静悄悄地 一声不响地 头也不回地 满心欢喜地 无精打采地 心不在焉地
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(`
				慢慢地 渐渐地 忽然 又 一直 总是 仍然 静静地 悄悄地 缓缓地 依旧 反复 逐渐 悄然
				突然 顷刻间 许久 良久 格外 分外 越发 渐次 隐隐地 淡淡地 清晰地 隐约地 轻柔地 缓慢地
				不断地 持续地 一点点地 层层地 微微地 摇摇晃晃地 闪闪地 悠悠地 沙沙地 飘飘地
			`)
		}
	],
	times: {
		day: words(`黎明时 清晨 早晨 上午 中午 下午 黄昏时 傍晚 夜里 深夜 午夜`),
		any: words(`
			春天 夏天 秋天 冬天 周末 假日 整天
			初春 暮春 初夏 盛夏 晚夏 初秋 深秋 隆冬 残冬 梅雨季 花开时节 红叶时节 收获时节
			节日里 集市日 满月之夜 雨天 雪天 大风天 晴天 阴天 雾天 长假里
		`),
		past: words(`
			昨天 上周 从前 那天 当年 那晚
			前天 上个月 去年 前年 上上周 很久以前 前不久 那天早上 那天晚上 那会儿 当时
			去年春天 去年夏天 去年秋天 去年冬天 几天前 片刻前
		`),
		present: words(
			`今天 刚才 明天 下周 现在 今早 今晚 后天 下个月 明年 今年 这周 这个周末 马上 一会儿`
		),
		habitual: words(
			`最近 有时 每天 每晚 常常 时常 偶尔 很少 难得 每早 每周 每年 平时 通常 一向 素来`
		)
	},
	homes: words(`家`),
	// Two clauses are joined on a comma and 然后: `狐狸回到了家，然后吃了苹果。`
	join: { word: '，然后' },
	connectives: {
		additive: words(`而且 此外 并且 再者 另外 还有`),
		temporal: words(`然后 后来 接着 同时 终于 随后 不久 那时 转眼间 过了一会儿 稍后 紧接着 不多时`),
		contrastive: words(`但是 不过 可是 然而 反倒 相反 尽管如此 话说回来 只是`),
		causal: words(`所以 于是 因此 结果 因而 故而 由此`)
	},
	// What a noun can do that its theme does not say. A noun listed nowhere has no
	// trait, and takes any verb that asks for none.
	traits: {
		flier: words(`
		猫头鹰 麻雀 喜鹊 燕子 老鹰 游隼 仙鹤 天鹅 鸭子 啄木鸟 鹦鹉 孔雀 蝴蝶 飞蛾 蜜蜂 蜻蜓 瓢虫 蝙蝠 白鹭 鹈鹕 大雁 乌鸦 云雀 夜莺 翠鸟
		火烈鸟 萤火虫 金龟子 锹甲 萤火 蜉蝣 苍蝇 蚊子
		神龙 火龙 冰龙 黑龙 白龙 青龙 凤凰 妖精 精灵 仙女 天使 天马 神鸟 朱雀 三足乌 蛟龙 鸟女 石像鬼 小恶魔 小妖精 女武神
		`),
		swimmer: words(`
		鲸鱼 海豚 鲨鱼 乌龟 海豹 企鹅 青蛙 章鱼 乌贼 海星 螃蟹 龙虾 鲤鱼 三文鱼 鳄鱼 蝌蚪 蟾蜍 雨蛙 鲫鱼 鲶鱼 黑鱼 鳜鱼 青鳉 泥鳅 鳗鱼
		海鳗 带鱼 鲅鱼 秋刀鱼 凤尾鱼 黄鱼 明太鱼
		人鱼 美人鱼 海妖 巨乌贼 海兽王
		`),
		crawler: words(`
		乌龟 蜥蜴 变色龙 蟒蛇 蜗牛 蚂蚁 蜘蛛 螃蟹 鳄鱼 螳螂 蚯蚓 蜈蚣 马陆 蝎子 壁虱 跳蚤 蚕蛹 毛虫 蝾螈 菜花蛇 蝮蛇 毒蛇 眼镜蛇 响尾蛇 鬣蜥
		蛇王
		`),
		// A word of a creature theme that is no creature: it takes no verb and no state.
		lifeless: words(`
			魔法 魔力 咒语 诅咒 预言 神谕 结界 护符 封印 幻影 陶俑 女神像 御守 咒文字 符咒 阵法 巫术 祈福 前兆 预兆 预言书 神话集 传说集 奇谭集
		`),
		// A word of the place class that is no place.
		placeless: words(`
			朝阳 波浪 潮水 沙粒 卵石 地震 余烬 珊瑚 回声 影子 冰碛 岩屑 岩盘 间歇泉 喷气孔 钟乳石 石笋 地平 水平
			星辰 太阳 彗星 流星 极光 新月 星尘 日食 月食 天顶 月明 星明 卫星 星团 星座 轨道 引力 自转 公转 黑子 太阳风 光年 天体 恒星 天球 黄道
			超新星 流星雨 宇宙尘 失重 满月 朔月 半月 上弦 下弦 月光 星光 北极星 日冕 月晕 星轨
		`)
	},
	interjections: words(`
		啊， 哎呀， 哇， 唉， 天啊， 瞧， 咦， 呀， 嘿， 哟， 好家伙， 我的天，
		哎哟， 嗬， 呵， 噢， 唔， 原来如此， 不得了， 真是的， 哈， 喔， 竟然， 果然，
	`),
	pronouns: { n: ['', '它'] },
	// And an object it has named is left out the next time: `煮了，然后吃了`.
	objectPronouns: { words: { n: [''] } },
	// A line of the hero's own opens on 我.
	speech: { subject: '我' },
	// What somebody answers with. One pool, because Chinese marks no level here.
	replies: {
		casual: {
			agree: words(`
				是啊 对 就是 我也是 说得对 没错 是这样 可不是嘛 嗯 确实
			`),
			cheer: words(`
				太好了! 真棒! 厉害! 真羡慕 干得好 不错嘛! 恭喜 辛苦了 好极了! 真行!
			`),
			care: words(`
				还好吗? 歇一会儿吧 别太累了 吃点东西吧 真辛苦 慢慢来 别担心 小心点 加油 坐一下吧 喝点水 我帮你
			`),
			wonder: words(`
				真的? 是吗? 在哪儿? 什么时候? 然后呢? 不会吧! 怎么弄的? 为什么? 是这样? 后来呢? 你说什么?
			`),
			answer: words(`
				嗯，有点 不，还好 嗯，很 一般般 不，还没 嗯，太 有一点 不太 嗯，非常 不，一点也不 还行吧 嗯，其实
			`)
		}
	},
	// And the person beside them is 你: 「你累吗？」.
	listener: { subject: '你' },
	// What somebody says on coming home: 我回来了.
	homecomings: {
		casual: words(`我回来了 到家了! 我到家了 回来啦`)
	},
	// How much a state holds, in front of it, standing where 很 stands: `狮子非常勇敢`.
	degrees: words(`非常 特别 真 有点 相当 十分 挺 极其 格外 稍微 蛮 分外`),
	// 它 is a thing: a person is referred to by leaving the subject out, and an
	// animal is left out too, because the stories it is in read that way.
	pronounless: ['person', 'creature'],
	numeral: {
		order: 'after',
		counters: {
			creature: '只',
			person: '位',
			plant: '棵',
			edible: '个',
			thing: '个',
			vehicle: '辆',
			place: '处',
			event: '次',
			idea: '种',
			body: '个'
		},
		count: [2, 12],
		currency: '元',
		amounts: [100, 500, 1000, 3000, 5000, 10000, 30000, 50000, 100000],
		group: ',',
		gap: ''
	},
	// Chinese writes a date largest to smallest and its copula as a word of its
	// own, in front of what it equates the subject to.
	calendar: {
		date: 'Y年M月D日',
		clock: 'h点mm分',
		years: [2020, 2030],
		copula: {
			// An event is a thing that happens on a day, and a lion is not.
			subject: ['event'],
			words: words(`是`)
		}
	},
	// Chinese puts its verb after the subject and everything that frames the
	// action — the place phrase included — in front of it. A destination is the
	// one phrase that follows the verb, because the verb is what points at it.
	frames: [
		// A date and a clock, standing where an adverbial stands.
		{
			parts: [
				{ slot: 'date', head: '在' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'clock', head: '在' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		// And the shape that equates the subject to one: `比赛是11点40分。`
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'date', copula: 'head' }
			],
			weight: 4
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'clock', copula: 'head' }
			],
			weight: 4
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 20
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 18
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'place', head: '在', tail: '里', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 14
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', modifiable: true }
			],
			weight: 10,
			fields: ['go', 'arrive']
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', modifiable: true }
			],
			weight: 5,
			fields: ['go', 'arrive']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'manner' },
				{ slot: 'verb' },
				{ slot: 'destination', modifiable: true }
			],
			weight: 4,
			fields: ['go', 'arrive']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: '很' }
			],
			weight: 12
		},
		// A state with how much of it, and one with when: `狮子非常勇敢`, `傍晚狮子很累`.
		// The degree stands where 很 stood, so the shape writes no 很 of its own.
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'degree' }, { slot: 'state' }],
			weight: 9
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: '很' }
			],
			weight: 5
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'manner' }, { slot: 'verb' }],
			weight: 10
		},
		{
			parts: [{ slot: 'time' }, { slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 8
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'place', head: '在', tail: '里', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 7
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'place', head: '在', tail: '里', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 6
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'manner' },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 4
		},
		// Chinese asks with 吗 after the whole clause, which is a tag rather than a
		// phrase, and leaves everything in front of it alone.
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 20,
			mood: 'question',
			tag: '吗'
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 16,
			mood: 'question',
			tag: '吗'
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: '很' }
			],
			weight: 14,
			mood: 'question',
			tag: '吗'
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'degree' }, { slot: 'state' }],
			weight: 6,
			mood: 'question',
			tag: '吗'
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'place', head: '在', tail: '里', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 12,
			mood: 'question',
			tag: '吗'
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', modifiable: true }
			],
			weight: 6,
			mood: 'question',
			tag: '吗',
			fields: ['go', 'arrive']
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'quantity' }],
			weight: 6
		},
		{
			parts: [{ slot: 'quantity' }, { slot: 'verb' }],
			weight: 5
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'money' }],
			weight: 5
		}
	]
};
