import { words } from '../../_internal/parse.js';
import type { SentenceLanguageData } from './types.js';

export const JA: SentenceLanguageData = {
	space: '',
	capitalize: false,
	terminators: { statement: '。', question: '？', exclamation: '！', trailing: '…' },
	// The corner brackets, not the curly quotes: Japanese writes ãã first and
	// ãã for a quote inside one.
	quotes: { double: ['「', '」'], single: ['『', '』'] },
	// Dictionary form, which is the plain statement a written sentence ends on.
	verbs: [
		{
			subject: ['creature', 'person'],
			words: words(`
				走る 歩く 跳ぶ 泳ぐ 飛ぶ 這う 戻る 去る 止まる 休む 眠る 笑う 泣く 歌う 踊る
				隠れる 待つ 立つ 座る 転がる さまよう 通る 近づく 伸びる 聞く
			`),
			forms: {
				polite: words(`
					走ります 歩きます 跳びます 泳ぎます 飛びます 這います 戻ります 去ります 止まります 休みます 眠ります 笑います 泣きます 歌います 踊ります 隠れます
					待ちます 立ちます 座ります 転がります さまよいます 通ります 近づきます 伸びます 聞きます
				`)
			}
		},
		{
			subject: ['creature', 'person'],
			object: ['edible'],
			words: words(`食べる 飲む 噛む 味わう 焼く 温める`),
			forms: { polite: words(`食べます 飲みます 噛みます 味わいます 焼きます 温めます`) }
		},
		{
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`見る 探す 拾う 運ぶ 触る 守る 選ぶ 動かす 集める`),
			forms: {
				polite: words(
					`見ます 探します 拾います 運びます 触ります 守ります 選びます 動かします 集めます`
				)
			}
		},
		{
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`作る 直す 磨く 売る 買う 建てる`),
			forms: { polite: words(`作ります 直します 磨きます 売ります 買います 建てます`) }
		},
		{
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			words: words(`覚える 忘れる 想像する 数える`),
			forms: { polite: words(`覚えます 忘れます 想像します 数えます`) }
		},
		{
			subject: ['place', 'event'],
			words: words(`光る 流れる 暮れる 明ける 深まる 静まる 色づく`),
			forms: {
				polite: words(`光ります 流れます 暮れます 明けます 深まります 静まります 色づきます`)
			}
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`揺れる 輝く 落ちる 転がる 傾く 古びる`),
			forms: { polite: words(`揺れます 輝きます 落ちます 転がります 傾きます 古びます`) }
		},
		{
			subject: ['vehicle'],
			words: words(`走る 止まる 通る 戻る 出発する 滑る`),
			forms: { polite: words(`走ります 止まります 通ります 戻ります 出発します 滑ります`) }
		},
		{
			subject: ['idea', 'event'],
			words: words(`広がる 消える 残る 漂う 深まる`),
			forms: { polite: words(`広がります 消えます 残ります 漂います 深まります`) }
		},
		{
			subject: ['plant'],
			words: words(`育つ 枯れる 咲く 揺れる 伸びる`),
			forms: { polite: words(`育ちます 枯れます 咲きます 揺れます 伸びます`) }
		},
		{
			subject: ['body'],
			words: words(`震える 動く 痺れる 固まる`),
			forms: { polite: words(`震えます 動きます 痺れます 固まります`) }
		},
		{
			subject: ['edible'],
			words: words(`熟れる 冷める 煮える 溶ける 傷む`),
			forms: { polite: words(`熟れます 冷めます 煮えます 溶けます 傷みます`) }
		}
	],
	// Plain predicate forms, so a na-adjective closes on だ where an i-adjective
	// closes on itself. The `word` pools hold the attributive 静かな instead, which
	numeral: {
		order: 'after',
		counters: {
			creature: '匹',
			person: '人',
			plant: '本',
			edible: '個',
			thing: '個',
			vehicle: '台',
			place: '箇所',
			event: '回',
			idea: '種類',
			body: '本'
		},
		count: [2, 12],
		currency: '円',
		amounts: [1000, 5000, 10000, 30000, 50000, 100000, 300000, 500000, 1000000],
		group: ',',
		gap: ''
	},
	// cannot end a sentence.
	states: [
		{
			subject: ['creature', 'person'],
			words: words(
				`大きい 小さい 速い 遅い 静かだ うるさい 勇敢だ 元気だ 眠い 賢い 優しい 荒々しい`
			),
			forms: {
				polite: words(
					`大きいです 小さいです 速いです 遅いです 静かです うるさいです 勇敢です 元気です 眠いです 賢いです 優しいです 荒々しいです`
				)
			}
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
			words: words(`美しい 珍しい 新しい 見慣れない`),
			forms: { polite: words(`美しいです 珍しいです 新しいです 見慣れないです`) }
		},
		{
			subject: ['place', 'event'],
			words: words(`広い 狭い 静かだ 深い 暗い 明るい 遠い 険しい`),
			forms: {
				polite: words(`広いです 狭いです 静かです 深いです 暗いです 明るいです 遠いです 険しいです`)
			}
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`硬い 軽い 重い 古い 滑らかだ 透明だ 丈夫だ`),
			forms: { polite: words(`硬いです 軽いです 重いです 古いです 滑らかです 透明です 丈夫です`) }
		},
		{
			subject: ['edible'],
			words: words(`甘い しょっぱい 辛い 酸っぱい 熱い 冷たい 香ばしい`),
			forms: {
				polite: words(
					`甘いです しょっぱいです 辛いです 酸っぱいです 熱いです 冷たいです 香ばしいです`
				)
			}
		},
		{
			subject: ['idea'],
			words: words(`難しい 易しい 明らかだ 曖昧だ 永遠だ はかない`),
			forms: { polite: words(`難しいです 易しいです 明らかです 曖昧です 永遠です はかないです`) }
		},
		{
			subject: ['plant'],
			words: words(`青い 香しい 瑞々しい`),
			forms: { polite: words(`青いです 香しいです 瑞々しいです`) }
		},
		{
			subject: ['body'],
			words: words(`温かい 冷たい 痛い 硬い`),
			forms: { polite: words(`温かいです 冷たいです 痛いです 硬いです`) }
		}
	],
	manners: words(`
		静かに ゆっくり 速く じっと そっと ふと 一緒に ひとりで また ずっと しばらく 次第に 急に いつも まだ 慎重に 力強く 並んで 素早く 黙って 軽やかに 丁寧に 懸命に のんびり
		ぼんやり しっかり さらりと ひっそり 悠々と きちんと ゆるやかに 朗らかに
	`),
	times: words(`
		夜明けに 朝に 昼に 夕方に 夜に 真夜中に 今日 昨日 明日 春に 夏に 秋に 冬に 週末に さっき 時々 毎日 夕暮れに 真昼に 元日に 先週 来週 近頃 昔 休日に 一日中 毎晩
	`),
	connectives: words(`
		そして だから しかし ところが やがて すぐに ついに 一方 また しかも けれども それでも ところで その後 つまり
	`),
	interjections: words(`
		ああ、 おお、 まあ、 なんと、 やれやれ、 おや、 ほら、 へえ、 わあ、 あら、 おっと、 いやはや、
	`),
	pronouns: { n: ['', 'それ'] },
	pronounless: ['person'],
	// Japanese writes a date largest to smallest with nothing between the parts,
	// and its copula onto the end of what it equates the subject to.
	calendar: {
		date: 'Y年M月D日',
		clock: 'h時mm分',
		years: [2020, 2030],
		copula: {
			// An event is a thing that happens on a day, and a lion is not.
			subject: ['event'],
			words: words(`だ`),
			forms: { polite: words(`です`) }
		}
	},
	frames: [
		// A date and a clock, standing where an adverbial stands.
		{
			parts: [
				{ slot: 'date', tail: 'に' },
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'clock', tail: 'に' },
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		// And the shape that equates the subject to one: `試合は11時40分だ。`
		{
			parts: [
				{ slot: 'subject', tail: 'は' },
				{ slot: 'date', copula: 'tail' }
			],
			weight: 4
		},
		{
			parts: [
				{ slot: 'subject', tail: 'は' },
				{ slot: 'clock', copula: 'tail' }
			],
			weight: 4
		},
		{
			parts: [{ slot: 'subject', tail: 'が', modifiable: true }, { slot: 'verb' }],
			weight: 20
		},
		{
			parts: [
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'object', tail: 'を', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 18
		},
		{
			parts: [
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'place', tail: 'で', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 14
		},
		{
			parts: [{ slot: 'subject', tail: 'は', modifiable: true }, { slot: 'state' }],
			weight: 12
		},
		{
			parts: [
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'manner' },
				{ slot: 'verb' }
			],
			weight: 10
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 8
		},
		{
			parts: [
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'place', tail: 'で', modifiable: true },
				{ slot: 'object', tail: 'を', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 7
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'place', tail: 'で', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 6
		},
		{
			parts: [
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'manner' },
				{ slot: 'object', tail: 'を', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		// Japanese asks with か after the predicate, which is a tag rather than a
		// phrase — no slot could carry it, and the word order does not move.
		{
			parts: [{ slot: 'subject', tail: 'が', modifiable: true }, { slot: 'verb' }],
			weight: 20,
			mood: 'question',
			tag: 'か'
		},
		{
			parts: [
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'object', tail: 'を', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 16,
			mood: 'question',
			tag: 'か'
		},
		{
			parts: [{ slot: 'subject', tail: 'は', modifiable: true }, { slot: 'state' }],
			weight: 14,
			mood: 'question',
			tag: 'か'
		},
		{
			parts: [
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'place', tail: 'で', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 12,
			mood: 'question',
			tag: 'か'
		},
		{
			parts: [
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'quantity', tail: 'を' },
				{ slot: 'verb' }
			],
			weight: 6
		},
		{
			parts: [{ slot: 'quantity', tail: 'が' }, { slot: 'verb' }],
			weight: 5
		},
		{
			parts: [
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'money', tail: 'を' },
				{ slot: 'verb' }
			],
			weight: 5
		}
	]
};
