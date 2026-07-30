import { tokens } from '../../_internal/parse.js';
import type { NameLanguageData } from './types.js';

export const JA: NameLanguageData = {
	order: 'family-first',
	joiner: '',
	hasMiddle: false,
	roman: 'token',
	lengthSpec: { given: [2, 2], last: [1, 3], middle: [0, 0] },
	givenLenWeights: { 2: 70, 3: 30 },
	last: tokens(`
		佐藤:Sato 鈴木:Suzuki 高橋:Takahashi 田中:Tanaka 渡辺:Watanabe 伊藤:Ito
		山本:Yamamoto 中村:Nakamura 小林:Kobayashi 加藤:Kato 吉田:Yoshida 山田:Yamada
		佐々木:Sasaki 山口:Yamaguchi 松本:Matsumoto 井上:Inoue 木村:Kimura 林:Hayashi
		清水:Shimizu 斎藤:Saito 山崎:Yamazaki 森:Mori 池田:Ikeda 橋本:Hashimoto 阿部:Abe
		石川:Ishikawa 山下:Yamashita 中島:Nakajima 石井:Ishii 小川:Ogawa
	`),
	firstMale: tokens(`
		健:ken 翔:sho 悠:yu 直:nao 拓:taku 亮:ryo 隼:haya 大:dai 陽:yo 和:kazu 智:tomo
		貴:taka
	`),
	restMale: tokens(`
		太:ta 郎:ro 斗:to 介:suke 也:ya 樹:ki 人:to 平:hei 輝:ki 之:yuki
	`),
	firstFemale: tokens(`
		美:mi 結:yu 彩:aya 咲:saki 愛:ai 千:chi 真:ma 莉:ri 陽:hi 花:hana 楓:kae
	`),
	restFemale: tokens(`
		子:ko 奈:na 香:ka 音:ne 乃:no 衣:i 愛:a 咲:saki 美:mi 帆:ho
	`)
};
