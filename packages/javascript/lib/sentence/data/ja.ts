import { words } from '../../_internal/parse.js';
import type { SentenceLanguageData } from './types.js';

export const JA: SentenceLanguageData = {
	space: '',
	capitalize: false,
	terminator: '。',
	// Dictionary form, which is the plain statement a written sentence ends on.
	verbs: [
		{
			subject: ['creature', 'person'],
			words: words(`
				走る 歩く 跳ぶ 泳ぐ 飛ぶ 這う 戻る 去る 止まる 休む 眠る 笑う 泣く 歌う 踊る
				隠れる 待つ 立つ 座る 転がる さまよう 通る 近づく 伸びる 聞く
			`)
		},
		{
			subject: ['creature', 'person'],
			object: ['edible'],
			words: words(`食べる 飲む 噛む 味わう 焼く 温める`)
		},
		{
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`見る 探す 拾う 運ぶ 触る 守る 選ぶ 動かす 集める`)
		},
		{
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`作る 直す 磨く 売る 買う 建てる`)
		},
		{
			subject: ['person', 'creature'],
			object: ['abstract', 'event', 'place'],
			words: words(`覚える 忘れる 想像する 数える`)
		},
		{
			subject: ['place', 'event'],
			words: words(`光る 流れる 暮れる 明ける 深まる 静まる 色づく`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`揺れる 輝く 落ちる 転がる 傾く 古びる`)
		},
		{
			subject: ['vehicle'],
			words: words(`走る 止まる 通る 戻る 出発する 滑る`)
		},
		{
			subject: ['abstract', 'event'],
			words: words(`広がる 消える 残る 漂う 深まる`)
		},
		{
			subject: ['plant'],
			words: words(`育つ 枯れる 咲く 揺れる 伸びる`)
		},
		{
			subject: ['body'],
			words: words(`震える 動く 痺れる 固まる`)
		},
		{
			subject: ['edible'],
			words: words(`熟れる 冷める 煮える 溶ける 傷む`)
		}
	],
	// Plain predicate forms, so a na-adjective closes on だ where an i-adjective
	// closes on itself. The `word` pools hold the attributive 静かな instead, which
	// cannot end a sentence.
	states: [
		{
			subject: ['creature', 'person'],
			words: words(
				`大きい 小さい 速い 遅い 静かだ うるさい 勇敢だ 元気だ 眠い 賢い 優しい 荒々しい`
			)
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
				'abstract',
				'body'
			],
			words: words(`美しい 珍しい 新しい 見慣れない`)
		},
		{
			subject: ['place', 'event'],
			words: words(`広い 狭い 静かだ 深い 暗い 明るい 遠い 険しい`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`硬い 軽い 重い 古い 滑らかだ 透明だ 丈夫だ`)
		},
		{
			subject: ['edible'],
			words: words(`甘い しょっぱい 辛い 酸っぱい 熱い 冷たい 香ばしい`)
		},
		{
			subject: ['abstract'],
			words: words(`難しい 易しい 明らかだ 曖昧だ 永遠だ はかない`)
		},
		{
			subject: ['plant'],
			words: words(`青い 香しい 瑞々しい`)
		},
		{
			subject: ['body'],
			words: words(`温かい 冷たい 痛い 硬い`)
		}
	],
	manners: words(`
		静かに ゆっくり 速く じっと そっと ふと 一緒に ひとりで また ずっと しばらく 次第に
		急に いつも まだ 慎重に 力強く 並んで
	`),
	times: words(`
		夜明けに 朝に 昼に 夕方に 夜に 真夜中に 今日 昨日 明日 春に 夏に 秋に 冬に 週末に
		さっき 時々 毎日 夕暮れに
	`),
	frames: [
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
		}
	]
};
