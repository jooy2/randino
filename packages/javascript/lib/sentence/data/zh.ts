import { words } from '../../_internal/parse.js';
import type { SentenceLanguageData } from './types.js';

export const ZH: SentenceLanguageData = {
	space: '',
	capitalize: false,
	terminators: { statement: '。', question: '？', exclamation: '！', trailing: '…' },
	// The curly quotes rather than ãã: these pools are written in simplified
	// Chinese, and horizontal simplified text uses ââ â the corner brackets are
	// what Taiwan and Hong Kong write.
	quotes: { double: ['“', '”'], single: ['‘', '’'] },
	// Chinese verbs take no form of their own — the same word stands whoever does
	// it and whenever it happened.
	verbs: [
		{
			subject: ['creature', 'person'],
			words: words(`
				奔跑 行走 跳跃 游泳 飞翔 爬行 返回 离开 停下 休息 睡觉 微笑 哭泣 歌唱 跳舞
				躲藏 等待 站立 坐下 打滚 徘徊 经过 靠近 倾听
			`)
		},
		{
			subject: ['creature', 'person'],
			object: ['edible'],
			words: words(`吃 喝 咀嚼 品尝 烘烤 加热`)
		},
		{
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`观看 寻找 捡起 搬运 触摸 守护 挑选 移动 收集`)
		},
		{
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`制作 修理 擦拭 出售 购买 建造`)
		},
		{
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			words: words(`记得 忘记 想象 数`)
		},
		{
			subject: ['place', 'event'],
			words: words(`发光 流淌 变暗 变亮 加深 沉寂 染色`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`摇晃 闪耀 掉落 滚动 倾斜 老化`)
		},
		{
			subject: ['vehicle'],
			words: words(`行驶 停下 经过 返回 出发 滑行`)
		},
		{
			subject: ['idea', 'event'],
			words: words(`蔓延 消失 留下 飘荡 加深`)
		},
		{
			subject: ['plant'],
			words: words(`生长 枯萎 开花 摇曳 舒展`)
		},
		{
			subject: ['body'],
			words: words(`颤抖 移动 麻木 僵硬`)
		},
		{
			subject: ['edible'],
			words: words(`成熟 冷却 沸腾 融化 变质`)
		}
	],
	// A bare adjective cannot stand as a predicate on its own, so the shape that
	// uses one writes 很 in front of it.
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`大 小 快 慢 安静 吵闹 勇敢 懒 忙 饿 困 凶 温和 聪明`)
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
	manners: words(`
		安静地 慢慢地 迅速地 静静地 悄悄地 忽然 一起 独自 又 一直 渐渐地 稍稍 总是 仍然
		小心地 有力地 并排
	`),
	times: words(`
		黎明时 早晨 中午 傍晚 夜里 深夜 今天 昨天 明天 春天 夏天 秋天 冬天 周末 刚才
		有时 每天 黄昏时
	`),
	connectives: words(`然后 所以 但是 不过 于是 后来 接着 同时 终于`),
	interjections: words(`啊， 哎呀， 哇， 唉， 天啊， 瞧， 咦，`),
	pronouns: { n: ['', '它'] },
	pronounless: ['person'],
	// Chinese puts its verb after the subject and everything that frames the
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
	// action — the place phrase included — in front of it.
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
