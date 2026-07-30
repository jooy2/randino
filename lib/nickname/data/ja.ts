import { words } from '../../_internal/parse.js';
import type { NicknameLanguageData } from './types.js';

export const JA: NicknameLanguageData = {
	joiner: '',
	capitalize: false,
	// Attributive forms only, so the modifier can precede the noun as it stands:
	// 青い + ライオン, 静かな + 海, 星の + 影.
	modifiers: words(`
		青い 赤い 白い 黒い 黄色い 緑の 銀の 金の 星の 月の 夜の 朝の 夢の 虹の 霧の 雪の
		風の 海の 森の 静かな 賑やかな 不思議な 自由な 透明な 永遠の 大きな 小さな 可愛い
		勇敢な 優しい 冷たい 温かい 眠い 寂しい 丸い 鋭い 柔らかい 甘い 苦い 辛い 涼しい
		暖かい 古い 新しい 速い 遅い 明るい 暗い 眩しい 遠い 近い 高い 深い 浅い 踊る 走る
		飛ぶ 歌う 光る 眠る 笑う 隠れた 迷う
	`),
	nouns: {
		animal: words(`
			ライオン トラ ヒョウ チーター キツネ オオカミ クマ パンダ カワウソ ウサギ リス
			ネコ イヌ クジラ イルカ サメ カメ アザラシ ペンギン フクロウ スズメ カササギ
			ツバメ ワシ ハヤブサ ツル ハクチョウ カモ キツツキ インコ クジャク ダチョウ ウマ
			シカ ゾウ キリン カバ サル ゴリラ カエル トカゲ カメレオン ヘビ チョウ ガ ハチ
			トンボ テントウムシ カタツムリ アリ クモ タコ イカ ヒトデ カニ エビ コイ サケ
			ハリネズミ タヌキ モグラ コウモリ サギ ペリカン
		`),
		object: words(`
			水筒 鉛筆 傘 提灯 時計 鏡 鍵 鞄 帽子 靴 手袋 眼鏡 指輪 針 糸 鋏 筆 絵具 手帳 栞
			手紙 葉書 切手 印章 地図 望遠鏡 顕微鏡 写真機 ラジオ ピアノ ギター 太鼓 鈴 風船
			凧 独楽 ビー玉 サイコロ 積木 自転車 汽車 小舟 帆 錨 灯台 天幕 懐中電灯 マッチ
			蝋燭 花瓶 湯呑 匙 皿 鍋 斧 鋸 梯子 歯車 磁石 リボン 封筒 枕 毛布 籠 箒 笛 縄 桶
		`),
		nature: words(`
			空 雲 風 雨 雪 霜 氷 霧 露 虹 夕焼け 朝焼け 夜明け 黄昏 星 月 太陽 銀河 彗星
			流星 極光 雷 稲妻 雷鳴 夕立 梅雨 台風 旋風 波 潮 海 川 湖 滝 谷 山 丘 草原 森
			木 葉 花 根 種 実 苔 羊歯 竹 松 紅葉 桜 蒲公英 向日葵 洞窟 砂漠 砂 岩 小石 火山
			地震 残り火 氷河 珊瑚 湿原 木霊 影
		`),
		concept: words(`
			自由 平和 正義 真理 知恵 勇気 記憶 想像 物語 詩 歌 踊り 素描 文法 論理 物理
			化学 生物 哲学 数学 幾何 代数 歴史 神話 伝説 寓話 諺 謎 秘密 約束 友情 旅 冒険
			航海 発見 実験 質問 答 討論 会議 市場 広場 都市 村 路地 橋 庭 図書館 博物館
			劇場 学校 公園 祭 祝日 季節 瞬間 永遠 宇宙 次元 均衡 調和 律動 旋律 和音 色彩
			明暗 儀式 習慣 文化 言葉 文字 暗号 記録 暦
		`)
	},
	// No `parts` pool: a Japanese noun-noun compound needs a particle or a reading
	// change more often than not, so nicknames stay at modifier + noun.
	syn: {
		kind: 'pool',
		pool: words(`
			ラ リ ル レ ロ カ キ ク ケ コ サ シ ス セ ソ タ チ ツ テ ト ナ ニ ヌ ネ ノ ハ ヒ
			フ ヘ ホ マ ミ ム メ モ ヤ ユ ヨ ワ ガ ギ グ ゲ ゴ ザ ジ ズ ゼ ゾ デ ド バ ビ ブ ベ
			ボ パ ピ プ ペ ポ
		`),
		minSyllables: 2,
		maxSyllables: 3
	}
};
