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
		郑:Zheng 谢:Xie 韩:Han 唐:Tang 冯:Feng 于:Yu 董:Dong 萧:Xiao 程:Cheng 曹:Cao
		袁:Yuan 邓:Deng 傅:Fu 沈:Shen 曾:Zeng 彭:Peng 苏:Su 蒋:Jiang 蔡:Cai 丁:Ding
		魏:Wei 薛:Xue 叶:Ye
	`),
	// Whole given names, spanning the generations the registry actually holds: 建国
	// / 秀英 for the older half, 奕辰 / 一诺 for the newer. Both lengths are covered,
	// because a one-character name is not any character of a two-character one —
	// 张伟 is a name, 苏子 is half of one.
	givenMale: tokens(`
		奕辰:Yichen 宇轩:Yuxuan 浩宇:Haoyu 子墨:Zimo 宇航:Yuhang 浩然:Haoran 梓豪:Zihao
		子轩:Zixuan 俊杰:Junjie 志强:Zhiqiang 建国:Jianguo 建军:Jianjun 志明:Zhiming
		家豪:Jiahao 泽宇:Zeyu 雨泽:Yuze 思远:Siyuan 文博:Wenbo 国强:Guoqiang
		晓明:Xiaoming 伟:Wei 强:Qiang 磊:Lei 军:Jun 洋:Yang 勇:Yong 杰:Jie 涛:Tao
		明:Ming 超:Chao 刚:Gang 平:Ping 辉:Hui 鹏:Peng 斌:Bin 波:Bo 峰:Feng 健:Jian
		龙:Long 亮:Liang
	`),
	givenFemale: tokens(`
		一诺:Yinuo 欣怡:Xinyi 梓涵:Zihan 语桐:Yutong 欣妍:Xinyan 可欣:Kexin 梦瑶:Mengyao
		诗涵:Shihan 若曦:Ruoxi 佳怡:Jiayi 梓萱:Zixuan 雅婷:Yating 思琪:Siqi 秀英:Xiuying
		桂英:Guiying 秀兰:Xiulan 淑芬:Shufen 丽娟:Lijuan 春梅:Chunmei 晓燕:Xiaoyan
		芳:Fang 娜:Na 敏:Min 静:Jing 丽:Li 娟:Juan 燕:Yan 霞:Xia 秀:Xiu 英:Ying
		玲:Ling 艳:Yan 梅:Mei 兰:Lan 红:Hong 萍:Ping 慧:Hui 洁:Jie 颖:Ying 婷:Ting
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
