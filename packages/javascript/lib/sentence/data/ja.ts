import { words } from '../../_internal/parse.js';
import type { WordPool } from '../../word/data/types.js';
import type { PredicateTense, SentenceLanguageData } from './types.js';

// The four forms a Japanese verb group is written in: the dictionary form a plain
// statement ends on, its ます form, the past on た, and the past on ました. The
// て form that links a first clause to the one after it is written beside them.
function tensed(
	plain: string,
	polite: string,
	past: string,
	pastPolite: string,
	linking: string
): { words: WordPool; forms: { polite: WordPool; linking: WordPool }; past: PredicateTense } {
	return {
		words: words(plain),
		forms: { polite: words(polite), linking: words(linking) },
		past: { words: words(past), forms: { polite: words(pastPolite) } }
	};
}

// The same for an adjective, which has no て form a sentence here would use.
function described(
	plain: string,
	polite: string,
	past: string,
	pastPolite: string
): { words: WordPool; forms: { polite: WordPool }; past: PredicateTense } {
	return {
		words: words(plain),
		forms: { polite: words(polite) },
		past: { words: words(past), forms: { polite: words(pastPolite) } }
	};
}

export const JA: SentenceLanguageData = {
	space: '',
	capitalize: false,
	terminators: { statement: '。', question: '？', exclamation: '！', trailing: '…' },
	// The corner brackets, not the curly quotes: Japanese writes 「」 first and
	// 『』 for a quote inside one.
	quotes: { double: ['「', '」'], single: ['『', '』'] },
	// Dictionary form, which is the plain statement a written sentence ends on,
	// and the past beside it.
	verbs: [
		{
			field: 'rise',
			subject: ['creature', 'person'],
			...tensed(
				`起きる 目覚める 立ち上がる 起き上がる`,
				`起きます 目覚めます 立ち上がります 起き上がります`,
				`起きた 目覚めた 立ち上がった 起き上がった`,
				`起きました 目覚めました 立ち上がりました 起き上がりました`,
				`起きて 目覚めて 立ち上がって 起き上がって`
			)
		},
		// Setting off: the verbs that need somewhere to go, and the ones that stand
		// on their own.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`行く 向かう 出かける`,
				`行きます 向かいます 出かけます`,
				`行った 向かった 出かけた`,
				`行きました 向かいました 出かけました`,
				`行って 向かって 出かけて`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			// Running somewhere is for legs: a fish and a snake go, and do not run.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(
				`駆けていく 上る 下りる`,
				`駆けていきます 上ります 下ります`,
				`駆けていった 上った 下りた`,
				`駆けていきました 上りました 下りました`,
				`駆けていって 上って 下りて`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...tensed(
				`去る 出発する 出ていく`,
				`去ります 出発します 出ていきます`,
				`去った 出発した 出ていった`,
				`去りました 出発しました 出ていきました`,
				`去って 出発して 出ていって`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`着く 到着する 入る たどり着く 帰り着く`,
				`着きます 到着します 入ります たどり着きます 帰り着きます`,
				`着いた 到着した 入った たどり着いた 帰り着いた`,
				`着きました 到着しました 入りました たどり着きました 帰り着きました`,
				`着いて 到着して 入って たどり着いて 帰り着いて`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...tensed(
				`帰る 戻る 帰宅する`,
				`帰ります 戻ります 帰宅します`,
				`帰った 戻った 帰宅した`,
				`帰りました 戻りました 帰宅しました`,
				`帰って 戻って 帰宅して`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(
				`走る 歩く 跳ぶ 駆け回る 散歩する`,
				`走ります 歩きます 跳びます 駆け回ります 散歩します`,
				`走った 歩いた 跳んだ 駆け回った 散歩した`,
				`走りました 歩きました 跳びました 駆け回りました 散歩しました`,
				`走って 歩いて 跳んで 駆け回って 散歩して`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			...tensed(
				`さまよう 通る`,
				`さまよいます 通ります`,
				`さまよった 通った`,
				`さまよいました 通りました`,
				`さまよって 通って`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			...tensed(`泳ぐ`, `泳ぎます`, `泳いだ`, `泳ぎました`, `泳いで`)
		},
		{
			field: 'move',
			// Flying is a flier's alone: a sparrow's, a dragon's, never a fish's.
			subject: ['creature'],
			subjectTraits: ['flier'],
			...tensed(`飛ぶ`, `飛びます`, `飛んだ`, `飛びました`, `飛んで`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			...tensed(`這う`, `這います`, `這った`, `這いました`, `這って`)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...tensed(
				`待つ 隠れる 見回す ためらう 立ち止まる うろうろする`,
				`待ちます 隠れます 見回します ためらいます 立ち止まります うろうろします`,
				`待った 隠れた 見回した ためらった 立ち止まった うろうろした`,
				`待ちました 隠れました 見回しました ためらいました 立ち止まりました うろうろしました`,
				`待って 隠れて 見回して ためらって 立ち止まって うろうろして`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...tensed(
				`休む 座る 寝転ぶ もたれる うずくまる 横になる`,
				`休みます 座ります 寝転びます もたれます うずくまります 横になります`,
				`休んだ 座った 寝転んだ もたれた うずくまった 横になった`,
				`休みました 座りました 寝転びました もたれました うずくまりました 横になりました`,
				`休んで 座って 寝転んで もたれて うずくまって 横になって`
			)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...tensed(
				`眠る 寝る 眠り込む うたた寝する`,
				`眠ります 寝ます 眠り込みます うたた寝します`,
				`眠った 寝た 眠り込んだ うたた寝した`,
				`眠りました 寝ました 眠り込みました うたた寝しました`,
				`眠って 寝て 眠り込んで うたた寝して`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...tensed(
				`笑う 泣く あくびする 微笑む つぶやく 叫ぶ ため息をつく`,
				`笑います 泣きます あくびします 微笑みます つぶやきます 叫びます ため息をつきます`,
				`笑った 泣いた あくびした 微笑んだ つぶやいた 叫んだ ため息をついた`,
				`笑いました 泣きました あくびしました 微笑みました つぶやきました 叫びました ため息をつきました`,
				`笑って 泣いて あくびして 微笑んで つぶやいて 叫んで ため息をついて`
			)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...tensed(
				`踊る 歌う 転がる 遊ぶ はねる 跳ね回る じゃれる`,
				`踊ります 歌います 転がります 遊びます はねます 跳ね回ります じゃれます`,
				`踊った 歌った 転がった 遊んだ はねた 跳ね回った じゃれた`,
				`踊りました 歌いました 転がりました 遊びました はねました 跳ね回りました じゃれました`,
				`踊って 歌って 転がって 遊んで はねて 跳ね回って じゃれて`
			)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			...tensed(
				`覚える 忘れる 想像する 数える 思い出す 懐かしむ`,
				`覚えます 忘れます 想像します 数えます 思い出します 懐かしみます`,
				`覚えた 忘れた 想像した 数えた 思い出した 懐かしんだ`,
				`覚えました 忘れました 想像しました 数えました 思い出しました 懐かしみました`,
				`覚えて 忘れて 想像して 数えて 思い出して 懐かしんで`
			)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`見る 見つめる 眺める 調べる 触る なでる`,
				`見ます 見つめます 眺めます 調べます 触ります なでます`,
				`見た 見つめた 眺めた 調べた 触った なでた`,
				`見ました 見つめました 眺めました 調べました 触りました なでました`,
				`見て 見つめて 眺めて 調べて 触って なでて`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...tensed(
				`探し回る 探す うろつく 見て回る`,
				`探し回ります 探します うろつきます 見て回ります`,
				`探し回った 探した うろついた 見て回った`,
				`探し回りました 探しました うろつきました 見て回りました`,
				`探し回って 探して うろついて 見て回って`
			)
		},
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`見つける 発見する 拾う 見いだす`,
				`見つけます 発見します 拾います 見いだします`,
				`見つけた 発見した 拾った 見いだした`,
				`見つけました 発見しました 拾いました 見いだしました`,
				`見つけて 発見して 拾って 見いだして`
			)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`選ぶ 取る つかむ 手に取る 受け取る 取り出す`,
				`選びます 取ります つかみます 手に取ります 受け取ります 取り出します`,
				`選んだ 取った つかんだ 手に取った 受け取った 取り出した`,
				`選びました 取りました つかみました 手に取りました 受け取りました 取り出しました`,
				`選んで 取って つかんで 手に取って 受け取って 取り出して`
			)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`運ぶ 持ち帰る 抱える 持ってくる`,
				`運びます 持ち帰ります 抱えます 持ってきます`,
				`運んだ 持ち帰った 抱えた 持ってきた`,
				`運びました 持ち帰りました 抱えました 持ってきました`,
				`運んで 持ち帰って 抱えて 持ってきて`
			)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`隠す しまう 守る 埋める 取っておく`,
				`隠します しまいます 守ります 埋めます 取っておきます`,
				`隠した しまった 守った 埋めた 取っておいた`,
				`隠しました しまいました 守りました 埋めました 取っておきました`,
				`隠して しまって 守って 埋めて 取っておいて`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`作る 建てる 描く 編む 組み立てる 削る`,
				`作ります 建てます 描きます 編みます 組み立てます 削ります`,
				`作った 建てた 描いた 編んだ 組み立てた 削った`,
				`作りました 建てました 描きました 編みました 組み立てました 削りました`,
				`作って 建てて 描いて 編んで 組み立てて 削って`
			)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`直す 磨く 手入れする 整える 片付ける 修理する`,
				`直します 磨きます 手入れします 整えます 片付けます 修理します`,
				`直した 磨いた 手入れした 整えた 片付けた 修理した`,
				`直しました 磨きました 手入れしました 整えました 片付けました 修理しました`,
				`直して 磨いて 手入れして 整えて 片付けて 修理して`
			)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`売る 手渡す 譲る 並べる`,
				`売ります 手渡します 譲ります 並べます`,
				`売った 手渡した 譲った 並べた`,
				`売りました 手渡しました 譲りました 並べました`,
				`売って 手渡して 譲って 並べて`
			)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			...tensed(
				`買う 買い求める 手に入れる 仕入れる`,
				`買います 買い求めます 手に入れます 仕入れます`,
				`買った 買い求めた 手に入れた 仕入れた`,
				`買いました 買い求めました 手に入れました 仕入れました`,
				`買って 買い求めて 手に入れて 仕入れて`
			)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`焼く 温める 煮る 料理する 切る 盛る`,
				`焼きます 温めます 煮ます 料理します 切ります 盛ります`,
				`焼いた 温めた 煮た 料理した 切った 盛った`,
				`焼きました 温めました 煮ました 料理しました 切りました 盛りました`,
				`焼いて 温めて 煮て 料理して 切って 盛って`
			)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`食べる 噛む 味わう かじる 平らげる`,
				`食べます 噛みます 味わいます かじります 平らげます`,
				`食べた 噛んだ 味わった かじった 平らげた`,
				`食べました 噛みました 味わいました かじりました 平らげました`,
				`食べて 噛んで 味わって かじって 平らげて`
			)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			...tensed(
				`飲む すする 飲み干す 口にする`,
				`飲みます すすります 飲み干します 口にします`,
				`飲んだ すすった 飲み干した 口にした`,
				`飲みました すすりました 飲み干しました 口にしました`,
				`飲んで すすって 飲み干して 口にして`
			)
		},
		{
			field: 'change',
			subject: ['place'],
			...tensed(
				`静まる 暗くなる 明ける 賑わう 色づく 明るくなる`,
				`静まります 暗くなります 明けます 賑わいます 色づきます 明るくなります`,
				`静まった 暗くなった 明けた 賑わった 色づいた 明るくなった`,
				`静まりました 暗くなりました 明けました 賑わいました 色づきました 明るくなりました`,
				`静まって 暗くなって 明けて 賑わって 色づいて 明るくなって`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...tensed(
				`光る 流れる 暮れる 深まる 始まる 終わる 続く`,
				`光ります 流れます 暮れます 深まります 始まります 終わります 続きます`,
				`光った 流れた 暮れた 深まった 始まった 終わった 続いた`,
				`光りました 流れました 暮れました 深まりました 始まりました 終わりました 続きました`,
				`光って 流れて 暮れて 深まって 始まって 終わって 続いて`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			...tensed(
				`揺れる 輝く 落ちる 転がる 傾く 古びる`,
				`揺れます 輝きます 落ちます 転がります 傾きます 古びます`,
				`揺れた 輝いた 落ちた 転がった 傾いた 古びた`,
				`揺れました 輝きました 落ちました 転がりました 傾きました 古びました`,
				`揺れて 輝いて 落ちて 転がって 傾いて 古びて`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...tensed(
				`走る 止まる 通る 戻る 出発する 滑る`,
				`走ります 止まります 通ります 戻ります 出発します 滑ります`,
				`走った 止まった 通った 戻った 出発した 滑った`,
				`走りました 止まりました 通りました 戻りました 出発しました 滑りました`,
				`走って 止まって 通って 戻って 出発して 滑って`
			)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...tensed(
				`広がる 消える 残る 漂う 深まる`,
				`広がります 消えます 残ります 漂います 深まります`,
				`広がった 消えた 残った 漂った 深まった`,
				`広がりました 消えました 残りました 漂いました 深まりました`,
				`広がって 消えて 残って 漂って 深まって`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			...tensed(
				`育つ 枯れる 咲く 揺れる 伸びる`,
				`育ちます 枯れます 咲きます 揺れます 伸びます`,
				`育った 枯れた 咲いた 揺れた 伸びた`,
				`育ちました 枯れました 咲きました 揺れました 伸びました`,
				`育って 枯れて 咲いて 揺れて 伸びて`
			)
		},
		{
			field: 'change',
			subject: ['body'],
			...tensed(
				`震える 動く 痺れる 固まる`,
				`震えます 動きます 痺れます 固まります`,
				`震えた 動いた 痺れた 固まった`,
				`震えました 動きました 痺れました 固まりました`,
				`震えて 動いて 痺れて 固まって`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			...tensed(
				`熟れる 冷める 煮える 溶ける 傷む`,
				`熟れます 冷めます 煮えます 溶けます 傷みます`,
				`熟れた 冷めた 煮えた 溶けた 傷んだ`,
				`熟れました 冷めました 煮えました 溶けました 傷みました`,
				`熟れて 冷めて 煮えて 溶けて 傷んで`
			)
		}
	],
	// Plain predicate forms, so a na-adjective closes on だ where an i-adjective
	// closes on itself. The `word` pools hold the attributive 静かな instead, which
	// cannot end a sentence. The past is かった for one and だった for the other,
	// and the polite past かったです and でした.
	states: [
		{
			subject: ['creature', 'person'],
			...described(
				`大きい 小さい 速い 遅い 静かだ うるさい 勇敢だ 元気だ 賢い 優しい 荒々しい`,
				`大きいです 小さいです 速いです 遅いです 静かです うるさいです 勇敢です 元気です 賢いです 優しいです 荒々しいです`,
				`大きかった 小さかった 速かった 遅かった 静かだった うるさかった 勇敢だった 元気だった 賢かった 優しかった 荒々しかった`,
				`大きかったです 小さかったです 速かったです 遅かったです 静かでした うるさかったです 勇敢でした 元気でした 賢かったです 優しかったです 荒々しかったです`
			)
		},
		{
			subject: ['creature', 'person'],
			condition: 'hungry',
			...described(
				`空腹だ ひもじい`,
				`空腹です ひもじいです`,
				`空腹だった ひもじかった`,
				`空腹でした ひもじかったです`
			)
		},
		{
			subject: ['creature', 'person'],
			condition: 'full',
			...described(`満腹だ`, `満腹です`, `満腹だった`, `満腹でした`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			...described(
				`眠い くたくただ だるい`,
				`眠いです くたくたです だるいです`,
				`眠かった くたくただった だるかった`,
				`眠かったです くたくたでした だるかったです`
			)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			...described(
				`爽やかだ 元気いっぱいだ`,
				`爽やかです 元気いっぱいです`,
				`爽やかだった 元気いっぱいだった`,
				`爽やかでした 元気いっぱいでした`
			)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			...described(
				`嬉しい 楽しい 満足だ 幸せだ 穏やかだ`,
				`嬉しいです 楽しいです 満足です 幸せです 穏やかです`,
				`嬉しかった 楽しかった 満足だった 幸せだった 穏やかだった`,
				`嬉しかったです 楽しかったです 満足でした 幸せでした 穏やかでした`
			)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			...described(
				`退屈だ もどかしい 不安だ 気がかりだ`,
				`退屈です もどかしいです 不安です 気がかりです`,
				`退屈だった もどかしかった 不安だった 気がかりだった`,
				`退屈でした もどかしかったです 不安でした 気がかりでした`
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
				'idea',
				'body'
			],
			...described(
				`美しい 珍しい 新しい 見慣れない`,
				`美しいです 珍しいです 新しいです 見慣れないです`,
				`美しかった 珍しかった 新しかった 見慣れなかった`,
				`美しかったです 珍しかったです 新しかったです 見慣れなかったです`
			)
		},
		{
			subject: ['place', 'event'],
			...described(
				`広い 狭い 静かだ 深い 暗い 明るい 遠い 険しい`,
				`広いです 狭いです 静かです 深いです 暗いです 明るいです 遠いです 険しいです`,
				`広かった 狭かった 静かだった 深かった 暗かった 明るかった 遠かった 険しかった`,
				`広かったです 狭かったです 静かでした 深かったです 暗かったです 明るかったです 遠かったです 険しかったです`
			)
		},
		{
			subject: ['thing', 'vehicle'],
			...described(
				`硬い 軽い 重い 古い 滑らかだ 透明だ 丈夫だ`,
				`硬いです 軽いです 重いです 古いです 滑らかです 透明です 丈夫です`,
				`硬かった 軽かった 重かった 古かった 滑らかだった 透明だった 丈夫だった`,
				`硬かったです 軽かったです 重かったです 古かったです 滑らかでした 透明でした 丈夫でした`
			)
		},
		{
			subject: ['edible'],
			...described(
				`甘い しょっぱい 辛い 酸っぱい 熱い 冷たい 香ばしい`,
				`甘いです しょっぱいです 辛いです 酸っぱいです 熱いです 冷たいです 香ばしいです`,
				`甘かった しょっぱかった 辛かった 酸っぱかった 熱かった 冷たかった 香ばしかった`,
				`甘かったです しょっぱかったです 辛かったです 酸っぱかったです 熱かったです 冷たかったです 香ばしかったです`
			)
		},
		{
			subject: ['idea'],
			...described(
				`難しい 易しい 明らかだ 曖昧だ 永遠だ はかない`,
				`難しいです 易しいです 明らかです 曖昧です 永遠です はかないです`,
				`難しかった 易しかった 明らかだった 曖昧だった 永遠だった はかなかった`,
				`難しかったです 易しかったです 明らかでした 曖昧でした 永遠でした はかなかったです`
			)
		},
		{
			subject: ['plant'],
			...described(
				`青い 香しい 瑞々しい`,
				`青いです 香しいです 瑞々しいです`,
				`青かった 香しかった 瑞々しかった`,
				`青かったです 香しかったです 瑞々しかったです`
			)
		},
		{
			subject: ['body'],
			...described(
				`温かい 冷たい 痛い 硬い`,
				`温かいです 冷たいです 痛いです 硬いです`,
				`温かかった 冷たかった 痛かった 硬かった`,
				`温かかったです 冷たかったです 痛かったです 硬かったです`
			)
		}
	],
	// Attributive forms: an i-adjective as it is, a na-adjective on な.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				勇敢な 元気な 優しい 働き者の 怠け者の 恥ずかしがりの 賢い 若い 年老いた 小さな 大きな 静かな 陽気な のんびりした 素早い 好奇心旺盛な
			`)
		},
		{ subject: ['person'], words: words(`若い 親切な 厳しい 真面目な 忙しい 誠実な`) },
		{ subject: ['creature'], words: words(`素早い 荒々しい 大人しい 小柄な 丸々した`) },
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(
				`甘い 辛い 温かい 新鮮な 香ばしい 熱い しょっぱい 柔らかい みずみずしい 熟れた おいしそうな`
			)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(`甘い 温かい 冷たい 熱い 香り高い 新鮮な 濃い 苦い`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(
				`古い 新しい 小さな 大きな 軽い 重い きらめく 滑らかな 透明な 硬い 美しい 大切な 古びた`
			)
		},
		{ subject: ['vehicle'], words: words(`速い 遅い 頑丈な`) },
		{
			subject: ['place'],
			words: words(
				`静かな 広い 暗い 明るい 見知らぬ 古い 心地よい ひっそりした 賑やかな 遠い 近い 空っぽの 寂しい 日当たりのよい`
			)
		},
		{ subject: ['plant'], words: words(`青い 茂った 香しい 若い 枯れた 大きな 小さな 瑞々しい`) },
		{
			subject: ['idea'],
			words: words(`かすかな 古い 新しい 見知らぬ 明らかな 大切な 小さな 奇妙な 曖昧な`)
		},
		{ subject: ['event'], words: words(`長い 短い 静かな 晴れた 曇った 騒がしい 突然の`) },
		{ subject: ['body'], words: words(`小さな 冷たい 温かい 細い 丈夫な`) },
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
			words: words(`美しい 不思議な 見知らぬ 新しい`)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				静かに ゆっくり 速く じっと そっと ひとりで しばらく 急に 慎重に 力強く 素早く 黙って 軽やかに 丁寧に 懸命に のんびり ぼんやり しっかり さらりと ひっそり 悠々と
				きちんと 朗らかに 元気よく こっそり
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(
				`静かに ゆっくり 次第に ふと また ずっと しばらく 急に いつも まだ そっと じっと 少しずつ 徐々に だんだん ひっそり`
			)
		}
	],
	times: {
		day: words(`夜明けに 早朝に 朝に 昼前に 昼に 午後に 夕暮れに 夕方に 夜に 深夜に 真夜中に`),
		any: words(`春に 夏に 秋に 冬に 週末に 休日に 一日中 元日に`),
		past: words(`昨日 先週 昔 かつて その日 その夜`),
		present: words(`今日 さっき 明日 来週`),
		habitual: words(`近頃 時々 毎日 毎晩`)
	},
	homes: words(`家`),
	// Two clauses are joined on the first one's て form: `家に帰って林檎を食べた`.
	join: { form: 'linking' },
	connectives: {
		additive: words(`そして また しかも ところで`),
		temporal: words(`やがて すぐに ついに 一方 その後 しばらくして`),
		contrastive: words(`しかし ところが けれども それでも`),
		causal: words(`だから そこで それで`)
	},
	// What a noun can do that its theme does not say. A noun listed nowhere has no
	// trait, and takes any verb that asks for none.
	traits: {
		flier: words(`
		フクロウ スズメ カササギ ツバメ ワシ ハヤブサ ツル ハクチョウ カモ キツツキ インコ クジャク チョウ ガ ハチ トンボ テントウムシ コウモリ サギ
		ペリカン カラス ウグイス カワセミ カブトムシ ホタル 犬鷲 蝉 蜉蝣 黄金虫 鍬形虫 蛍火 蠅 蚊 蛾
		竜 鳳凰 天狗 妖精 精霊 天使 ドラゴン グリフォン 不死鳥 黒竜 白竜 青竜 朱雀 八咫烏 蛟竜 鳥女 天馬 小悪魔 小妖精 戦乙女 石像鬼
		`),
		swimmer: words(`
		クジラ イルカ サメ カメ アザラシ ペンギン カエル タコ イカ ヒトデ カニ エビ コイ サケ ワニ クラゲ 御玉杓子 蟇 雨蛙 鰐 鮒 鯰 雷魚 桂魚 目高
		泥鰌 鰻 穴子 太刀魚 鰆 秋刀魚 片口鰯 石持 介党鱈
		人魚 海妖 巨烏賊 海獣王 河童
		`),
		crawler: words(`
		カメ トカゲ カメレオン ヘビ カタツムリ アリ クモ カニ ワニ 蟷螂 蚯蚓 百足 馬陸 蠍 壁蝨 蚤 蚕 蛹 芋虫 山椒魚 青大将 蝮 毒蛇 眼鏡蛇
		響尾蛇 錦蛇 鰐 鬣蜥
		蛇王
		`)
	},
	interjections: words(`
		ああ、 おお、 まあ、 なんと、 やれやれ、 おや、 ほら、 へえ、 わあ、 あら、 おっと、 いやはや、
	`),
	pronouns: { n: ['', 'それ'] },
	// And an object it has named is left out the next time: `煮て食べた`.
	objectPronouns: { words: { n: [''] } },
	// それ is a thing: a person and an animal are referred to by leaving the
	// subject out.
	pronounless: ['person', 'creature'],
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
			forms: { polite: words(`です`) },
			past: { words: words(`だった`), forms: { polite: words(`でした`) } }
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
		// Where the subject is going, on へ, and where it arrives, on に.
		{
			parts: [
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'destination', tail: 'へ', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 8,
			fields: ['go']
		},
		{
			parts: [
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'destination', tail: 'に', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 8,
			fields: ['arrive']
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'destination', tail: 'へ', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 4,
			fields: ['go']
		},
		{
			parts: [
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'manner' },
				{ slot: 'destination', tail: 'に', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 3,
			fields: ['arrive']
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
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', tail: 'が', modifiable: true },
				{ slot: 'object', tail: 'を', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 4
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
				{ slot: 'destination', tail: 'へ', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 6,
			mood: 'question',
			tag: 'か',
			fields: ['go']
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
