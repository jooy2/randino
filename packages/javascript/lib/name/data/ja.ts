// Generated from `data/name/ja.yaml` by `tools/codegen`.
// Edit that file and re-run the generator; edits here are overwritten.

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
		石川:Ishikawa 山下:Yamashita 中島:Nakajima 石井:Ishii 小川:Ogawa 前田:Maeda
		岡田:Okada 長谷川:Hasegawa 藤田:Fujita 後藤:Goto 近藤:Kondo 村上:Murakami
		遠藤:Endo 青木:Aoki 坂本:Sakamoto 福田:Fukuda 太田:Ota 西村:Nishimura
		中川:Nakagawa 三浦:Miura
	`),
	// Whole given names, romanized the way the reading is actually written, so the
	// realistic end of `style` hands out names people have rather than assembled
	// kanji. Two- and three-character names only: `givenLenWeights` never asks for a
	// one-character name, and the syllable pools below still cover every length.
	givenMale: tokens(`
		陽翔:Haruto 悠真:Yuma 大翔:Hiroto 湊斗:Minato 朝陽:Asahi 蒼空:Sora 颯太:Sota
		大和:Yamato 陸斗:Rikuto 大輝:Daiki 拓海:Takumi 翔太:Shota 直樹:Naoki 和也:Kazuya
		隼人:Hayato 健太:Kenta 健太郎:Kentaro 慎太郎:Shintaro 龍太郎:Ryutaro
		悠太郎:Yutaro 龍之介:Ryunosuke 幸之助:Konosuke 健一郎:Kenichiro 宗一郎:Soichiro
	`),
	givenFemale: tokens(`
		陽菜:Hina 結愛:Yua 結衣:Yui 咲良:Sakura 莉子:Riko 美咲:Misaki 芽依:Mei
		心春:Koharu 陽葵:Himari 美月:Mizuki 彩花:Ayaka 優花:Yuka 香織:Kaori 直美:Naomi
		麻衣:Mai 詩織:Shiori 由紀子:Yukiko 美智子:Michiko 真理子:Mariko 恵理子:Eriko
		奈々子:Nanako 美奈子:Minako 佐和子:Sawako 加奈子:Kanako
	`),
	firstMale: tokens(`
		健:ken 翔:sho 悠:yu 直:nao 拓:taku 亮:ryo 隼:haya 大:dai 陽:yo 和:kazu 智:tomo
		貴:taka
	`),
	restMale: tokens('太:ta 郎:ro 斗:to 介:suke 也:ya 樹:ki 人:to 平:hei 輝:ki 之:yuki'),
	firstFemale: tokens('美:mi 結:yu 彩:aya 咲:saki 愛:ai 千:chi 真:ma 莉:ri 陽:hi 花:hana 楓:kae'),
	restFemale: tokens('子:ko 奈:na 香:ka 音:ne 乃:no 衣:i 愛:a 咲:saki 美:mi 帆:ho')
};
