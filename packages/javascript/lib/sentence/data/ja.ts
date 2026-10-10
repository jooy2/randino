import { words } from '../../_internal/parse.js';
import type { WordPool } from '../../word/data/types.js';
import type { PredicateTense, SentenceLanguageData } from './types.js';

// The godan endings: the kana a ます form puts in place of the last one, and the
// endings of the た and て forms.
const GODAN: Readonly<Record<string, readonly [string, string, string]>> = {
	う: ['い', 'った', 'って'],
	つ: ['ち', 'った', 'って'],
	る: ['り', 'った', 'って'],
	む: ['み', 'んだ', 'んで'],
	ぶ: ['び', 'んだ', 'んで'],
	ぬ: ['に', 'んだ', 'んで'],
	く: ['き', 'いた', 'いて'],
	ぐ: ['ぎ', 'いだ', 'いで'],
	す: ['し', 'した', 'して']
};

/**
 * A verb's ます stem and its た and て forms, from its dictionary form. A verb
 * written `:i` is ichidan, which its kanji cannot say: `起きる:i` but `帰る`. One
 * written `:g` is godan even where its ending reads as an irregular verb, which
 * is how `すする` is not taken for `する`. Anything else is read off its ending.
 */
function conjugated(entry: string): [stem: string, past: string, linking: string] {
	const [word, kind] = entry.split(':');
	const base = (cut: number) => word.slice(0, word.length - cut);

	if (kind === 'i') {
		return [base(1), `${base(1)}た`, `${base(1)}て`];
	}

	if (kind !== 'g') {
		if (word.endsWith('する')) {
			return [`${base(2)}し`, `${base(2)}した`, `${base(2)}して`];
		}

		if (word.endsWith('来る')) {
			return [`${base(2)}来`, `${base(2)}来た`, `${base(2)}来て`];
		}

		if (word.endsWith('くる')) {
			return [`${base(2)}き`, `${base(2)}きた`, `${base(2)}きて`];
		}

		// 行く is godan with the て and た of a verb on う.
		if (word.endsWith('行く') || word.endsWith('いく')) {
			return [`${base(1)}き`, `${base(1)}った`, `${base(1)}って`];
		}
	}

	const [stem, past, linking] = GODAN[word.slice(-1)];

	return [base(1) + stem, base(1) + past, base(1) + linking];
}

// The four forms a Japanese verb group is written in, all out of its dictionary
// form: the dictionary form a plain statement ends on, its ます form, the past on
// た, and the past on ました. The て form that links a first clause to the one
// after it is written beside them. Spelt out, the five were most of this file.
function tensed(entries: string): {
	words: WordPool;
	forms: { polite: WordPool; linking: WordPool };
	past: PredicateTense;
} {
	const listed = words(entries);
	const verbs = listed.map(conjugated);

	return {
		words: listed.map((entry) => entry.split(':')[0]),
		forms: {
			polite: verbs.map(([stem]) => `${stem}ます`),
			linking: verbs.map(([, , linking]) => linking)
		},
		past: {
			words: verbs.map(([, past]) => past),
			forms: { polite: verbs.map(([stem]) => `${stem}ました`) }
		}
	};
}

// The same for an adjective, which has no て form a sentence here would use. A
// na-adjective closes on だ and an i-adjective on itself, so the ending says which.
function described(entries: string): {
	words: WordPool;
	forms: { polite: WordPool };
	past: PredicateTense;
} {
	const plain = words(entries);
	const base = plain.map((word) => word.slice(0, -1));
	const na = plain.map((word) => word.endsWith('だ'));

	return {
		words: plain,
		forms: { polite: plain.map((word, at) => (na[at] ? `${base[at]}です` : `${word}です`)) },
		past: {
			words: base.map((stem, at) => (na[at] ? `${stem}だった` : `${stem}かった`)),
			forms: { polite: base.map((stem, at) => (na[at] ? `${stem}でした` : `${stem}かったです`)) }
		}
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
			...tensed(`起きる:i 目覚める:i 立ち上がる 起き上がる 起き出す 飛び起きる:i 身を起こす`)
		},
		// Setting off: the verbs that need somewhere to go, and the ones that stand
		// on their own.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`行く 向かう 出かける:i 訪れる:i 訪ねていく 近づく 進む 入っていく 渡る 立ち寄る 足を運ぶ`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			// Running somewhere is for legs: a fish and a snake go, and do not run.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(`駆けていく 上る 下りる:i 歩いていく 走っていく 急いでいく 駆けつける:i`)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...tensed(
				`去る 出発する 出ていく 出る:i 立ち去る 旅立つ 歩き出す 出かけていく 動き出す 家を出る:i 抜け出す 飛び出す`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`着く 到着する 入る たどり着く 帰り着く 近づいてくる 行き着く 到達する 帰っていく 戻っていく`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...tensed(
				`帰る 戻る 帰宅する 姿を見せる:i 顔を出す 帰路につく 家に帰る 舞い戻る 帰ってくる 戻ってくる`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(
				`走る 歩く 跳ぶ 駆け回る 散歩する 駆ける:i 歩き回る 跳ねる:i 走り回る うろつく 駆け出す 飛び跳ねる:i よたよた歩く のしのし歩く つま先立ちで歩く 行進する ジョギングする 練り歩く 早足で歩く 駆け抜ける:i 大股で歩く`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			...tensed(
				`さまよう 通る 動く 移動する 旋回する 進む 退く 近寄る 遠ざかる 行き来する 通り過ぎる:i`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			...tensed(`泳ぐ 泳ぎ回る 潜る 浮かぶ 水面に出る:i 泳いでいく 水を切る`)
		},
		{
			field: 'move',
			// Flying is a flier's alone: a sparrow's, a dragon's, never a fish's.
			subject: ['creature'],
			subjectTraits: ['flier'],
			...tensed(
				`飛ぶ 飛び立つ 舞い上がる 羽ばたく 滑空する 舞い降りる:i 飛び回る 飛び去る 旋回する 羽を休める:i 舞う 空を切る 降り立つ`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			...tensed(`這う 這い回る 這い出す くねる 身をよじる とぐろを巻く 這い上がる 這い進む`)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...tensed(
				`待つ 隠れる:i 見回す ためらう 立ち止まる うろうろする 息をひそめる:i じっとする 立ちすくむ ぐずぐずする 佇む 様子をうかがう 覗く 身を潜める:i 静かに待つ 足を止める:i 待ちぼうけする 目を凝らす`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...tensed(
				`休む 座る 寝転ぶ もたれる:i うずくまる 横になる 腰を下ろす 寝そべる もたれかかる 膝をつく しゃがむ 腰かける:i くつろぐ 一息つく のんびりする ひと休みする 足を伸ばす 横たわる 身を休める:i うつ伏せになる`
			)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...tensed(
				`眠る 寝る:i 眠り込む うたた寝する 昼寝する 寝入る 寝込む まどろむ うとうとする いびきをかく ぐっすり眠る 寝落ちする 夢を見る:i 眠りに落ちる:i 目を閉じる:i`
			)
		},
		// What somebody shows, split by what it shows — see the Korean data.
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'content',
			...tensed(
				`笑う 微笑む くすくす笑う にっこりする 口笛を吹く 歓声を上げる:i うなずく 手を叩く ウインクする 鼻歌を歌う にやりとする 手を振る ほほえむ`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'restless',
			...tensed(
				`泣く つぶやく ため息をつく 泣きじゃくる:g うめく ぼやく 顔をしかめる:i 鼻をすする:g 独り言を言う 涙ぐむ 首を振る 舌打ちする 眉をひそめる:i そわそわする 唇をかむ 頭をかく`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'tired',
			...tensed(`あくびする 目をこする:g 伸びをする 肩を回す 首を回す まばたきする`)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'hungry',
			...tensed(`つばを飲み込む お腹をさする:g 舌なめずりする 鼻をひくつかせる:i`)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...tensed(
				`叫ぶ 声を上げる:i はっとする 肩をすくめる:i 首をかしげる:i 目を丸くする 息をのむ 振り返る 顔を上げる:i`
			)
		},
		{
			field: 'talk',
			subject: ['creature', 'person'],
			...tensed(
				`話す おしゃべりする 語り合う しゃべる 会話する 雑談する ささやく つぶやき合う 語る 話し込む 立ち話する 声をかける:i 言葉を交わす 談笑する`
			)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...tensed(
				`踊る 歌う 転がる 遊ぶ はねる:i 跳ね回る じゃれる:i はしゃぐ 駆け回って遊ぶ ぐるぐる回る くるくる回る 飛び跳ねる:i ふざける:i 遊び回る かくれんぼする ボール遊びする 水遊びする 戯れる:i でんぐり返しする 転げ回る`
			)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			...tensed(
				`覚える:i 忘れる:i 想像する 数える:i 思い出す 懐かしむ 考える:i 思い描く 夢に見る:i 思いを巡らす 気にかける:i 心配する 信じる:i 期待する 理解する 悟る 恋しがる 懐かしがる 思い返す 反芻する 案じる:i 恋い焦がれる:i 想う`
			)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`見る:i 見つめる:i 眺める:i 調べる:i 触る なでる:i 眺め回す 見渡す 観察する じっと見る:i 覗き込む 見下ろす 見上げる:i 見比べる:i さする 叩く 嗅ぐ 手に取って見る:i いじる 持ち上げてみる:i 品定めする 鑑賞する 睨む 見守る ちらりと見る:i`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...tensed(
				`探し回る 探す うろつく 見て回る 捜す 探し出す 漁る 掘り返す 手探りする 隅々まで探す 探索する 探検する 詮索する 嗅ぎ回る 見回って探す 引っかき回す`
			)
		},
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`見つける:i 発見する 拾う 見いだす 探し当てる:i 掘り出す 見つけ出す 手に入れる:i 拾い上げる:i 拾い集める:i すくい上げる:i 引き当てる:i 突き止める:i 取り戻す 探り当てる:i`
			)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`選ぶ 取る つかむ 手に取る 受け取る 取り出す 握る つかみ取る 持つ 持ち上げる:i 抱く 集める:i 拾う 選び取る 受け入れる:i 得る:i 手にする 引き寄せる:i 抱え上げる:i 取り上げる:i くわえる:i 抜き取る 選び出す`
			)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`運ぶ 持ち帰る 抱える:i 持ってくる 持っていく 持ち上げる:i 抱えていく 背負う 担ぐ 引きずる 押す 引く 引っ張る 運び込む 運び出す 持ち運ぶ 抱きかかえる:i 担いでいく 引きずっていく`
			)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`隠す しまう 守る 埋める:i 取っておく しまい込む 保管する 蓄える:i 貯める:i 片付ける:i 押し込む 詰め込む 覆う 包む 収める:i 大事にする 見守る 隠しておく 置いておく 仕舞っておく 埋めておく 蓋をする`
			)
		},
		{
			field: 'lose',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`なくす 落とす 失う 置き忘れる:i 落としてしまう 取り落とす 置いてくる 忘れる:i 見失う 手放す 落っことす 紛失する`
			)
		},
		{
			field: 'meet',
			subject: ['creature', 'person'],
			object: ['person'],
			// Verbs that take を: 会う takes に, and the object frame writes を.
			...tensed(
				`訪ねる:i 見かける:i 迎える:i 出会う 出くわす 会う 挨拶する 迎え入れる:i 歓迎する 見つける:i 待ち合わせる:i 抱きしめる:i 手を振る 声をかける:i 顔を合わせる:i`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`作る 建てる:i 描く 編む 組み立てる:i 削る こしらえる:i 仕上げる:i 組む 設計する 製作する 作り上げる:i 形作る 彫る 織る 磨き上げる:i 創る 生み出す 飾り付ける:i 描き上げる:i 完成させる:i`
			)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`直す 磨く 手入れする 整える:i 片付ける:i 修理する 修繕する 掃除する 拭く 洗う 手を入れる:i 調整する 締める:i 油を差す 点検する 整備する 世話する 大切にする 洗い流す 乾かす 拭き取る 磨き直す 修理し直す`
			)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`売る 手渡す 譲る 並べる:i 売り払う 売りさばく 売り渡す 差し出す 引き渡す 手放す 売り出す 譲り渡す 取引する 値をつける:i 陳列する 並べて売る 卸す`
			)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			...tensed(
				`買う 買い求める:i 手に入れる:i 仕入れる:i 購入する 注文する 買い込む 買い付ける:i 買い占める:i 買い揃える:i 買い足す 支払う 買って帰る 値切る 予約する`
			)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`焼く 温める:i 煮る:i 料理する 切る 盛る 炒める:i 煮込む 蒸す 揚げる:i 茹でる:i 刻む 混ぜる:i 味付けする 調理する 炊く 温め直す 盛り付ける:i 味見する かき混ぜる:i ひっくり返す 注ぐ 皮をむく 刻んで入れる:i 仕込む 用意する`
			)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`食べる:i 噛む 味わう かじる 平らげる:i 頬張る かじりつく 食べ尽くす つまむ 口に運ぶ 舐める:i 飲み込む むしゃむしゃ食べる:i ぱくつく 一口食べる:i 貪る 噛みしめる:i 食べてみる:i`
			)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			...tensed(
				`飲む すする:g 飲み干す 口にする 飲んでみる:i ごくごく飲む 一口飲む 飲み込む すすり込む 喉に流し込む 味わって飲む 飲み終える:i こくりと飲む がぶ飲みする ちびちび飲む 一杯やる`
			)
		},
		{
			field: 'change',
			subject: ['place'],
			...tensed(
				`静まる 暗くなる 明ける:i 賑わう 色づく 明るくなる 目覚める:i 眠る 静まり返る にぎやかになる 華やぐ 息を吹き返す 眠りにつく 輝く きらめく 凍りつく 溶ける:i 濡れる:i 乾く 霧に包まれる:i 光に満ちる:i 空っぽになる 人であふれる:i ざわめく 沈む`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...tensed(
				`光る 流れる:i 暮れる:i 深まる 始まる 終わる 続く 過ぎる:i 止まる 近づく 遠ざかる 訪れる:i 終わりに近づく 繰り返す 長引く 終わりを迎える:i 移ろう 巡る 過ぎ去る 明ける:i 迫る`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a time of day or a season does: it wears on, turns, settles.
			subjectThemes: ['time'],
			...tensed(
				`更ける:i 暮れていく 深まっていく 傾く 過ぎていく 巡ってくる 明け始める:i 暮れ始める:i 移り変わる 幕を開ける:i`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What weather does: it rolls in, thickens, lets up.
			subjectThemes: ['weather'],
			...tensed(
				`やってくる 近づいてくる 遠のく 収まる 強まる 弱まる 晴れる:i 吹き荒れる:i 立ち込める:i 去っていく 通り過ぎる:i 迫ってくる`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a match does: it kicks off, heats up, wraps up.
			subjectThemes: ['sport'],
			...tensed(
				`開幕する 白熱する 盛り上がる 終了する 幕を閉じる:i 再開する 行われる:i 佳境に入る 幕が上がる`
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
			...tensed(
				`揺れる:i 輝く 落ちる:i 転がる 傾く 古びる:i 光る きらめく ぐらつく 倒れる:i 滑る 落下する 回る 止まる 揺らめく 色あせる:i すり減る 曇る くすむ 転がり落ちる:i 飛んでいく 跳ね上がる 動く 静止する 揺れ動く ずれる:i`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What only something made of metal and wood does: a jewel never rusts.
			subjectThemes: ['object', 'tool', 'vehicle'],
			...tensed(
				`錆びる:i きしむ がたつく 壊れる:i 砕ける:i 割れる:i ひび割れる:i 折れる:i ひっくり返る 詰まる 引っかかる 音を立てる:i`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'event'],
			// What a song or a drum does: it plays, rings out, dies away.
			subjectThemes: ['music', 'sound'],
			...tensed(
				`響く 鳴る 流れる:i 響き渡る 聞こえてくる 止まる 静まる 消えていく 高まる 弱まる 繰り返す 漂う 反響する 鳴り響く 続く 始まる 終わる 沈む 広がる 満ちる:i`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...tensed(
				`走る 止まる 通る 戻る 出発する 滑る 動く 進む 出ていく 到着する 去る 発車する 停車する 加速する 減速する 曲がる 揺れる:i がたがた揺れる:i 通り過ぎる:i 近づく 遠ざかる 引き返す 入ってくる 走り去る 滑り込む 速度を落とす 走り出す 停まる`
			)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...tensed(
				`広がる 消える:i 残る 漂う 深まる 育つ 薄れる:i 浮かぶ 蘇る 積もる 湧く 押し寄せる:i 沈む 立ち上る 散る 消え去る 静まる 戻ってくる 膨らむ 揺らぐ 芽生える:i 募る 薄らぐ 沸き上がる 忍び寄る 過ぎ去る 高まる`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			...tensed(
				`育つ 枯れる:i 咲く 揺れる:i 伸びる:i 芽吹く 芽を出す 花開く ほころぶ 茂る 生い茂る 枯れていく しおれる:i 乾く 色づく そよぐ なびく 蔓を伸ばす 根を張る 実をつける:i 実る 青々と茂る 香る 揺らぐ 花をつける:i うなだれる:i 芽生える:i 咲き誇る 咲き乱れる:i`
			)
		},
		{
			field: 'change',
			subject: ['body'],
			...tensed(
				`震える:i 動く 痺れる:i 固まる 疼く ずきずきする ひりひりする こわばる ほぐれる:i ゆるむ 温まる 冷える:i むくむ 腫れる:i かゆくなる 汗ばむ 鳴る 疲れる:i 休まる 軽くなる 重くなる 縮む 伸びる:i ぴくぴくする ほてる`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			...tensed(
				`熟れる:i 冷める:i 煮える:i 溶ける:i 傷む 温まる 湯気を立てる:i 冷たくなる 温かくなる ぬるくなる 減る 尽きる:i 残る 香る 匂う 用意される:i 出てくる 並ぶ 固まる 腐る 変わる`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a dish does and a drink does not: it sizzles, crumbles, goes stale.
			subjectThemes: ['food'],
			...tensed(
				`焦げる:i 焼ける:i 崩れる:i 乾く 硬くなる 柔らかくなる 膨らむ さくさくになる 冷めていく 焼き上がる 炊ける:i 蒸れる:i`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a drink does and a dish does not: it fizzes, spills, goes flat.
			subjectThemes: ['drink'],
			...tensed(
				`泡立つ こぼれる:i あふれる:i 揺れる:i 波打つ 凍る 冷めていく 湯気を上げる:i 気が抜ける:i 濁る 澄む 泡が消える:i`
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
				`大きい 小さい 速い 遅い 静かだ うるさい 勇敢だ 元気だ 賢い 優しい 荒々しい 若い 幼い 強い 弱い 大胆だ 臆病だ おとなしい 頑固だ 用心深い たくましい 陽気だ 無口だ`
			)
		},
		{
			subject: ['creature', 'person'],
			condition: 'hungry',
			...described(`空腹だ ひもじい ぺこぺこだ`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'full',
			...described(`満腹だ お腹いっぱいだ`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			...described(`眠い くたくただ だるい へとへとだ 気だるい 眠たい`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			...described(`爽やかだ 元気いっぱいだ 軽やかだ 晴れやかだ`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			...described(`嬉しい 楽しい 満足だ 幸せだ 穏やかだ 上機嫌だ 心地よい 誇らしい`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			...described(`退屈だ もどかしい 不安だ 気がかりだ 落ち着かない 心細い`)
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
			...described(`美しい 珍しい 新しい 見慣れない 愛らしい 不思議だ 立派だ 奇妙だ`)
		},
		{
			subject: ['place', 'event'],
			...described(
				`広い 狭い 静かだ 深い 暗い 明るい 遠い 険しい 賑やかだ 寂しい 近い 平らだ 薄暗い のどかだ`
			)
		},
		{
			subject: ['thing', 'vehicle'],
			...described(
				`硬い 軽い 重い 古い 滑らかだ 透明だ 丈夫だ 平たい 丸い 鋭い 薄い 分厚い 華やかだ 質素だ 精巧だ`
			)
		},
		{
			subject: ['edible'],
			...described(
				`甘い しょっぱい 辛い 酸っぱい 熱い 冷たい 香ばしい 苦い ぬるい 濃い まろやかだ 柔らかい 新鮮だ`
			)
		},
		{
			subject: ['idea'],
			...described(
				`難しい 易しい 明らかだ 曖昧だ 永遠だ はかない 単純だ 複雑だ 懐かしい 密かだ 些細だ`
			)
		},
		{
			subject: ['plant'],
			...described(`青い 香しい 瑞々しい 高い 細い 淡い 大きい`)
		},
		{
			subject: ['body'],
			...described(`温かい 冷たい 痛い 硬い しなやかだ 青白い 力強い 細い`)
		}
	],
	// Attributive forms: an i-adjective as it is, a na-adjective on な.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				勇敢な 元気な 優しい 働き者の 怠け者の 恥ずかしがりの 賢い 若い 年老いた 小さな 大きな 静かな 陽気な のんびりした 素早い 好奇心旺盛な
				大胆な 臆病な 用心深い 気ままな 律儀な 頑固な おとなしい 騒がしい たくましい ひょろ長い ふくよかな 痩せた 眠そうな ずる賢い 落ち着いた
				無邪気な 生意気な 誇らしげな 物静かな
			`)
		},
		{
			subject: ['person'],
			words: words(`
				若い 親切な 厳しい 真面目な 忙しい 誠実な
				賢明な 気さくな 無口な おしゃべりな 慎ましい 腕利きの 名高い 貧しい 裕福な 正直な 老いた 若々しい 温厚な 気難しい
			`)
		},
		{
			subject: ['creature'],
			words: words(`
				素早い 荒々しい 大人しい 小柄な 丸々した
				毛むくじゃらの 斑の 縞模様の 痩せこけた つやつやした 巨大な すばしこい ふさふさの 細長い
			`)
		},
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(`
				甘い 辛い 温かい 新鮮な 香ばしい 熱い しょっぱい 柔らかい みずみずしい 熟れた おいしそうな
				こんがりした もちもちの さくさくの こってりした あっさりした 濃厚な 香り高い 焼きたての 湯気の立つ 素朴な 彩り豊かな ぴりっとした 冷めた
			`)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(`
				甘い 温かい 冷たい 熱い 香り高い 新鮮な 濃い 苦い
				ぬるい 冷えた 泡立つ 澄んだ 濁った 甘酸っぱい 香ばしい 渋い すっきりした まろやかな
			`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`
				古い 新しい 小さな 大きな 軽い 重い きらめく 滑らかな 透明な 硬い 美しい 大切な 古びた
				錆びた 使い込んだ 磨かれた 質素な 華やかな 細長い 平たい 丸い 尖った 薄い 分厚い 壊れやすい 埃をかぶった 曲がった 精巧な
			`)
		},
		{
			subject: ['vehicle'],
			words: words(`速い 遅い 頑丈な がたがたの 軋む 光る 錆びついた 静かな 揺れる 立派な`)
		},
		{
			subject: ['place'],
			words: words(`
				静かな 広い 暗い 明るい 見知らぬ 古い 心地よい ひっそりした 賑やかな 遠い 近い 空っぽの 寂しい 日当たりのよい
				狭い 混み合った 風の強い 霧深い 木陰の 埃っぽい 湿った 岩だらけの 険しい 平らな 荒れ果てた 緑豊かな 人けのない 見晴らしのよい
			`)
		},
		{
			subject: ['plant'],
			words: words(`
				青い 茂った 香しい 若い 枯れた 大きな 小さな 瑞々しい
				とげのある 花盛りの 芽吹いた 這う 野生の 細い 色あせた 垂れ下がった よじ登る 咲き誇る
			`)
		},
		{
			subject: ['idea'],
			words: words(`
				かすかな 古い 新しい 見知らぬ 明らかな 大切な 小さな 奇妙な 曖昧な
				淡い 単純な 込み入った 頑なな はかない 遠い 大胆な 密かな 静かな 懐かしい
			`)
		},
		{
			subject: ['event'],
			words: words(`
				長い 短い 静かな 晴れた 曇った 騒がしい 突然の
				華やかな 厳かな 楽しい 退屈な 雨の 嵐の 穏やかな 忙しない のどかな 賑やかな
			`)
		},
		{
			subject: ['body'],
			words: words(
				`小さな 冷たい 温かい 細い 丈夫な しなやかな こわばった 痛む 荒れた 滑らかな 青白い 力強い`
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
			words: words(
				`美しい 不思議な 見知らぬ 新しい 愛らしい 見慣れた 奇妙な ありふれた 立派な 慎ましい`
			)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				静かに ゆっくり 速く じっと そっと ひとりで しばらく 急に 慎重に 力強く 素早く 黙って 軽やかに 丁寧に 懸命に のんびり ぼんやり しっかり さらりと ひっそり 悠々と
				きちんと 朗らかに 元気よく こっそり
				そろそろと こそこそ とぼとぼ せかせか あたふた もじもじ きょろきょろ うろうろ じっくり しみじみ わざと うっかり 思わず ふらりと ひょいと
				さっと ぱっと すたすた のろのろ どっしり 堂々と 誇らしげに 恥ずかしそうに 嬉しそうに 悲しそうに 楽しげに 静々と 淡々と 黙々と 律儀に
				丹念に 巧みに 不器用に 必死に かろうじて ようやく わざわざ しぶしぶ 自然に 器用に 優しく 荒っぽく 冷ややかに 熱心に 夢中で ぼそぼそ
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(`
				静かに ゆっくり 次第に ふと  ずっと しばらく 急に いつも まだ そっと じっと 少しずつ 徐々に だんだん ひっそり
				ふいに たちまち しばし 長らく ずいぶん やけに ひときわ すっかり 淡く ほのかに かすかに はっきり くっきり ぼんやり
				ゆらゆら きらきら さらさら ふわふわ そよそよ しんしん ざわざわ ひらひら もくもく ゆったり しっとり 静々と 果てしなく 絶え間なく
			`)
		}
	],
	times: {
		day: words(`夜明けに 早朝に 朝に 昼前に 昼に 午後に 夕暮れに 夕方に 夜に 深夜に 真夜中に`),
		any: words(`
			春に 夏に 秋に 冬に 週末に 休日に 一日中 元日に
			早春に 晩春に 初夏に 真夏に 晩夏に 初秋に 晩秋に 真冬に 晩冬に 梅雨に 花見の頃に 紅葉の頃に 収穫の頃に
			祭りの日に 市の立つ日に 満月の夜に 雨の日に 雪の日に 風の強い日に 晴れた日に 曇りの日に 霧の日に 連休に 休みの日に
		`),
		past: words(`
			昨日 先週 昔 かつて その日 その夜
			一昨日 先月 去年 一昨年 先々週 ずっと昔に しばらく前に その朝 その晩 あの頃 当時
			去年の春に 去年の夏に 去年の秋に 去年の冬に 数日前に 少し前に
		`),
		present: words(
			`今日 さっき 明日 来週 今 今朝 今晩 今夜 明後日 来月 来年 今年 今週 今週末 もうすぐ`
		),
		habitual: words(`
			近頃 時々 毎日 毎晩
			たいてい しばしば めったに まれに 時折 たまに 毎朝 毎週 毎年 一日おきに 普段は 常に 折に触れて
		`)
	},
	homes: words(`家`),
	// Two clauses are joined on the first one's て form: `家に帰って林檎を食べた`.
	join: { form: 'linking' },
	connectives: {
		additive: words(`そして また しかも ところで さらに その上 それに おまけに なお`),
		temporal: words(
			`やがて すぐに ついに 一方 その後 しばらくして そのうち 次に それから ほどなく 間もなく そのとき`
		),
		contrastive: words(
			`しかし ところが けれども それでも だが でも とはいえ それなのに 逆に 一方で`
		),
		causal: words(`だから そこで それで したがって ゆえに その結果 そのため`)
	},
	// What a noun can do that its theme does not say. A noun listed nowhere has no
	// trait, and takes any verb that asks for none.
	traits: {
		flier: words(`
		フクロウ スズメ カササギ ツバメ ワシ ハヤブサ ツル ハクチョウ カモ キツツキ インコ クジャク チョウ ガ ハチ トンボ テントウムシ コウモリ サギ
		ペリカン カラス ウグイス カワセミ カブトムシ ホタル 犬鷲 蝉 蜉蝣 黄金虫 鍬形虫 蛍火 蠅 蚊 蛾
		竜 鳳凰 天狗 妖精 精霊 天使 ドラゴン グリフォン 不死鳥 黒竜 白竜 青竜 朱雀 八咫烏 蛟竜 鳥女 天馬 小悪魔 小妖精 戦乙女 石像鬼
		ハト カモメ 天女 鵺
		`),
		swimmer: words(`
		クジラ イルカ サメ カメ アザラシ ペンギン カエル タコ イカ ヒトデ カニ エビ コイ サケ ワニ クラゲ 御玉杓子 蟇 雨蛙 鰐 鮒 鯰 雷魚 桂魚 目高
		泥鰌 鰻 穴子 太刀魚 鰆 秋刀魚 片口鰯 石持 介党鱈
		人魚 海妖 巨烏賊 海獣王 河童
		マグロ タイ サバ イワシ 金魚 ラッコ
		`),
		crawler: words(`
		カメ トカゲ カメレオン ヘビ カタツムリ アリ クモ カニ ワニ 蟷螂 蚯蚓 百足 馬陸 蠍 壁蝨 蚤 蚕 蛹 芋虫 山椒魚 青大将 蝮 毒蛇 眼鏡蛇
		響尾蛇 錦蛇 鰐 鬣蜥
		蛇王
		`),
		// A word of a creature theme that is no creature: it takes no verb and no state.
		lifeless: words(`
			魔法 魔力 呪文 呪い 予言 神託 結界 護符 封印 幻影 女神像 土偶 傀儡 御守 呪詛 加護 前兆 予兆 予言書 神話集 伝説集 奇譚集
			鬼火 妖術 魔法陣 秘薬 聖杯 魔剣
		`),
		// A word of the place class that is no place.
		placeless: words(`
			氷 波 潮 砂 小石 地震 残り火 珊瑚 木霊 影 氷堆石 岩屑 岩盤 間欠泉 噴気孔 鍾乳石 石筍 地平 水平
			星 太陽 彗星 流星 極光 三日月 星屑 日食 月食 天頂 星明 衛星 星団 星座 軌道 重力 自転 公転 黒点 太陽風 光年 天体 恒星 天球 黄道 超新星
			流星群 宇宙塵 満月 新月 半月 上弦 下弦 月光 北極星 星霜 星影 月影 日輪 月輪
			土 泥 砂利 埃 空気 光 闇 化石 渦 泡 しぶき さざ波 海流 満潮 干潮 津波 雪崩 洪水 溶岩 地層 断層 ブラックホール 北斗七星 南十字星 明星 一番星 人工衛星 準惑星 赤色巨星 白色矮星 中性子星
			クエーサー 銀河団 暗黒物質 宇宙線 連星 光速 コロナ 磁気嵐 宇宙ゴミ
		`)
	},
	interjections: words(`
		ああ、 おお、 まあ、 なんと、 やれやれ、 おや、 ほら、 へえ、 わあ、 あら、 おっと、 いやはや、
		おやおや、 ふむ、 なるほど、 これは、 ええっ、 うわあ、 まさか、 あれ、 ほう、 さては、 なんてこと、
	`),
	pronouns: { n: ['', 'それ'] },
	// And an object it has named is left out the next time: `煮て食べた`.
	objectPronouns: { words: { n: [''] } },
	// A line of the hero's own drops its subject, the way a spoken sentence does.
	speech: { subject: '' },
	// What somebody answers with: the plain form for `casual`, and the です・ます
	// form for `polite`, which `formal` falls back to.
	replies: {
		casual: {
			agree: words(`
				そうだね そうだよね 私も だよね たしかに そっか なるほど そうそう うん ほんとだね
			`),
			cheer: words(`
				よかった! やったね! すごい! いいなあ よくやった さすが! おめでとう おつかれ 最高! えらい!
			`),
			care: words(`
				大丈夫? 少し休んで 無理しないで 何か食べよう 大変だね ゆっくりでいいよ 心配しないで 気をつけて 元気出して ちょっと座って 水飲んで 手伝うよ
			`),
			wonder: words(`
				本当? まじで? どこで? いつ? それで? まさか! どうやって? どうして? そう? そうなの? それから? なんて?
			`),
			answer: words(`
				うん、少し ううん、大丈夫 うん、かなり まあまあ ううん、まだ うん、すごく ちょっとね あんまり うん、とても ううん、全然 まあね うん、実は
			`)
		},
		polite: {
			agree: words(`
				そうですね そうですよね 私もです たしかに なるほど はい 本当ですね そうなんですね
			`),
			cheer: words(`
				よかったですね! やりましたね! すごいですね! いいですね よくやりましたね さすがですね! おめでとうございます お疲れさまでした 最高ですね!
			`),
			care: words(`
				大丈夫ですか? 少し休んでください 無理しないでください 何か食べましょう 大変ですね ゆっくりでいいですよ 心配しないでください 気をつけてください 元気を出してください 少し座ってください 水を飲んでください 手伝いますよ
			`),
			wonder: words(`
				本当ですか? どこでですか? いつですか? それで? まさか! どうやって? どうしてですか? そうですか? そうなんですか? それから? なんですって?
			`),
			answer: words(`
				はい、少し いいえ、大丈夫です はい、かなり まあまあです いいえ、まだです はい、とても 少しだけ あまり はい、すごく いいえ、全然 まあ、そうですね はい、実は
			`)
		}
	},
	// And the person beside them is asked with no subject written either: 「疲れた？」.
	listener: { subject: '' },
	// What somebody says on coming home: ただいま.
	homecomings: {
		casual: words(`ただいま ただいま！ 帰ったよ やっと家だ 戻ったよ`),
		polite: words(`ただいま戻りました 帰りました ただいまです やっと帰りました`)
	},
	// How much a state holds, in front of it: `とても疲れた`.
	degrees: words(`
		とても すごく かなり 少し 本当に ずいぶん 実に なんとも ひどく やけに 大変 相当 ちょっと なかなか 割と 極めて
	`),
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
		// A state with how much of it, and one with when: `狐はとても静かだ`, `夕方に
		// 狐は静かだった`.
		{
			parts: [
				{ slot: 'subject', tail: 'は', modifiable: true },
				{ slot: 'degree' },
				{ slot: 'state' }
			],
			weight: 9
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', tail: 'は', modifiable: true },
				{ slot: 'state' }
			],
			weight: 5
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
				{ slot: 'subject', tail: 'は', modifiable: true },
				{ slot: 'degree' },
				{ slot: 'state' }
			],
			weight: 6,
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
