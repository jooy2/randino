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
		{ field: 'rise', subject: ['creature', 'person'], words: words(`起床 醒来 起身 站起来`) },
		// Setting off: the verbs that need somewhere to go, and the ones that stand
		// on their own. The direction is in the verb — 去, 回到 — so the destination
		// follows it with nothing in between.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			words: words(`去 前往 走向 跑向 赶往`)
		},
		{ field: 'go', subject: ['creature', 'person'], words: words(`出发 离开 出门 动身`) },
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			words: words(`到达 抵达 回到 来到`)
		},
		{ field: 'arrive', subject: ['creature', 'person'], words: words(`返回 归来 回家`) },
		{
			field: 'move',
			subject: ['creature', 'person'],
			words: words(`奔跑 行走 跳跃 游泳 飞翔 爬行 徘徊 经过 散步 溜达`)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			words: words(`等待 躲藏 环顾 犹豫 停下 张望`)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			words: words(`休息 坐下 躺下 靠着 蜷缩 歇息`)
		},
		{ field: 'sleep', subject: ['creature', 'person'], words: words(`睡觉 入睡 打盹 睡着`) },
		{
			field: 'express',
			subject: ['creature', 'person'],
			words: words(`微笑 哭泣 打哈欠 叹气 哼歌 咕哝 喊叫 大笑`)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			words: words(`跳舞 歌唱 打滚 玩耍 蹦跳 嬉戏`)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			words: words(`记得 忘记 想象 数 想起 惦记`)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`观看 注视 打量 检查 触摸 抚摸 端详`)
		},
		{ field: 'search', subject: ['creature', 'person'], words: words(`寻找 搜寻 翻找 找寻`) },
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`找到 发现 捡起 寻得`)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`挑选 拿起 抓住 拿 取出 收下`)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`搬运 带回 抱着 提着 拿回`)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`藏起 收好 守护 埋起 藏好`)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`制作 建造 雕刻 绘制 编织 组装`)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`修理 擦拭 保养 整理 打磨 修补`)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`出售 卖掉 转让 摆卖`)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			words: words(`购买 买下 买回 采购`)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			words: words(`烘烤 加热 煮 烹饪 切 盛上`)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			words: words(`吃 咀嚼 品尝 啃 吃光`)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			words: words(`喝 啜饮 喝光 品饮`)
		},
		{
			field: 'change',
			subject: ['place'],
			words: words(`安静下来 变暗 变亮 热闹起来 沉寂 亮起来`)
		},
		{ field: 'change', subject: ['event'], words: words(`发光 流淌 加深 开始 结束 持续 过去`) },
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			words: words(`摇晃 闪耀 掉落 滚动 倾斜 老化`)
		},
		{ field: 'move', subject: ['vehicle'], words: words(`行驶 停下 经过 返回 出发 滑行`) },
		{ field: 'change', subject: ['idea', 'event'], words: words(`蔓延 消失 留下 飘荡 加深`) },
		{ field: 'change', subject: ['plant'], words: words(`生长 枯萎 开花 摇曳 舒展`) },
		{ field: 'change', subject: ['body'], words: words(`颤抖 移动 麻木 僵硬`) },
		{ field: 'change', subject: ['edible'], words: words(`成熟 冷却 沸腾 融化 变质`) }
	],
	// A bare adjective cannot stand as a predicate on its own, so the shape that
	// uses one writes 很 in front of it.
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`大 小 快 慢 安静 吵闹 勇敢 懒 忙 凶 温和 聪明`)
		},
		{ subject: ['creature', 'person'], condition: 'hungry', words: words(`饿 饥饿`) },
		{ subject: ['creature', 'person'], condition: 'full', words: words(`饱 饱足`) },
		{ subject: ['creature', 'person'], condition: 'tired', words: words(`累 困 疲倦 乏`) },
		{ subject: ['creature', 'person'], condition: 'rested', words: words(`精神 神清气爽 有精神`) },
		{
			subject: ['creature', 'person'],
			condition: 'content',
			words: words(`高兴 开心 快乐 满足 舒心`)
		},
		{ subject: ['creature', 'person'], condition: 'restless', words: words(`无聊 好奇 焦急 不安`) },
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
			words: words(`美丽 陌生 新 常见 罕见`)
		},
		{
			subject: ['place', 'event'],
			words: words(`宽阔 狭窄 平静 深 暗 亮 遥远 陡峭`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`坚硬 轻 重 旧 光滑 透明 结实`)
		},
		{
			subject: ['edible'],
			words: words(`甜 咸 辣 酸 烫 凉 香`)
		},
		{
			subject: ['idea'],
			words: words(`简单 明显 模糊 永恒 短暂`)
		},
		{
			subject: ['plant'],
			words: words(`青翠 茂盛 芬芳 枯黄`)
		},
		{
			subject: ['body'],
			words: words(`温暖 冰凉 酸痛 僵硬`)
		}
	],
	// Attributive, with 的 where an adjective of two syllables needs it in front of
	// its noun and none where one of a single syllable does not.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(
				`勇敢的 安静的 勤劳的 懒惰的 害羞的 聪明的 年轻的 年老的 小 大 活泼的 悠闲的 敏捷的 好奇的`
			)
		},
		{ subject: ['person'], words: words(`年轻的 亲切的 严厉的 认真的 忙碌的 诚实的`) },
		{ subject: ['creature'], words: words(`敏捷的 凶猛的 温顺的 胖胖的 小小的`) },
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(
				`甜甜的 香辣的 温热的 新鲜的 酥脆的 香喷喷的 热乎乎的 咸香的 软软的 熟透的 美味的`
			)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(`甜甜的 温热的 冰凉的 清凉的 热的 芬芳的 新鲜的 浓浓的 苦涩的`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`旧 新 小 大 轻巧的 沉重的 闪亮的 光滑的 透明的 坚硬的 漂亮的 珍贵的 古老的`)
		},
		{ subject: ['vehicle'], words: words(`快速的 缓慢的 结实的`) },
		{
			subject: ['place'],
			words: words(
				`安静的 宽阔的 昏暗的 明亮的 陌生的 古老的 温馨的 僻静的 热闹的 遥远的 附近的 空荡荡的 冷清的 阳光明媚的`
			)
		},
		{ subject: ['plant'], words: words(`翠绿的 茂盛的 芬芳的 幼小的 枯萎的 高大的 小小的 娇嫩的`) },
		{ subject: ['idea'], words: words(`模糊的 古老的 新 陌生的 清晰的 珍贵的 小小的 奇怪的`) },
		{ subject: ['event'], words: words(`漫长的 短暂的 安静的 晴朗的 阴沉的 喧闹的 突然的`) },
		{ subject: ['body'], words: words(`小小的 冰凉的 温暖的 纤细的 结实的`) },
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
			words: words(`美丽的 神秘的 陌生的 新`)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				安静地 慢慢地 迅速地 静静地 悄悄地 独自 稍稍 小心地 有力地 轻轻地 用力地 认真地 匆匆地 缓缓地 默默地 从容地 欢快地 稳稳地 淡淡地 欣然 悠然
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(`慢慢地 渐渐地 忽然 又 一直 总是 仍然 静静地 悄悄地 缓缓地 依旧 反复 逐渐 悄然`)
		}
	],
	times: {
		day: words(`黎明时 清晨 早晨 上午 中午 下午 黄昏时 傍晚 夜里 深夜 午夜`),
		any: words(`春天 夏天 秋天 冬天 周末 假日 整天`),
		past: words(`昨天 上周 从前 那天 当年 那晚`),
		present: words(`今天 刚才 明天 下周`),
		habitual: words(`最近 有时 每天 每晚`)
	},
	homes: words(`家`),
	// Two clauses are joined on a comma and 然后: `狐狸回到了家，然后吃了苹果。`
	join: { word: '，然后' },
	connectives: {
		additive: words(`而且 此外`),
		temporal: words(`然后 后来 接着 同时 终于 随后 不久`),
		contrastive: words(`但是 不过 可是 然而`),
		causal: words(`所以 于是 因此 结果`)
	},
	interjections: words(`
		啊， 哎呀， 哇， 唉， 天啊， 瞧， 咦， 呀， 嘿， 哟， 好家伙， 我的天，
	`),
	pronouns: { n: ['', '它'] },
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
