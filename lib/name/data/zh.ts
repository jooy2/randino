import { tokens } from '../../_internal/parse.js';
import type { NameLanguageData } from './types.js';

export const ZH: NameLanguageData = {
	order: 'family-first',
	joiner: '',
	hasMiddle: false,
	roman: 'token',
	lengthSpec: { given: [1, 2], last: [1, 1], middle: [0, 0] },
	givenLenWeights: { 1: 45, 2: 55 },
	last: tokens(`
		王:Wang 李:Li 张:Zhang 刘:Liu 陈:Chen 杨:Yang 赵:Zhao 黄:Huang 周:Zhou 吴:Wu
		徐:Xu 孙:Sun 胡:Hu 朱:Zhu 高:Gao 林:Lin 何:He 郭:Guo 马:Ma 罗:Luo 梁:Liang 宋:Song
		郑:Zheng 谢:Xie 韩:Han 唐:Tang 冯:Feng 于:Yu 董:Dong 萧:Xiao
	`),
	firstMale: tokens(`
		伟:wei 强:qiang 磊:lei 军:jun 洋:yang 勇:yong 杰:jie 涛:tao 明:ming 超:chao 浩:hao
		宇:yu 泽:ze 鑫:xin 鹏:peng 博:bo 文:wen 建:jian 俊:jun 志:zhi 天:tian 子:zi
	`),
	restMale: tokens(`
		然:ran 轩:xuan 宇:yu 杰:jie 豪:hao 文:wen 华:hua 强:qiang 明:ming 峰:feng 涛:tao
		伟:wei 龙:long 飞:fei 鹏:peng 阳:yang 波:bo
	`),
	firstFemale: tokens(`
		芳:fang 娜:na 敏:min 静:jing 丽:li 娟:juan 燕:yan 婷:ting 雅:ya 欣:xin 怡:yi 梓:zi
		诗:shi 雨:yu 思:si 佳:jia 玲:ling 美:mei 婉:wan 雪:xue 琳:lin 晓:xiao
	`),
	restFemale: tokens(`
		婷:ting 怡:yi 涵:han 欣:xin 颖:ying 玲:ling 丽:li 娜:na 雅:ya 云:yun 洁:jie 琳:lin
		悦:yue 华:hua 芳:fang 敏:min 梦:meng 瑶:yao
	`)
};
