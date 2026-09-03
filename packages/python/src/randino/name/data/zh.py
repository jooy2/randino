"""Chinese name pools."""

from randino._internal.parse import tokens, weights
from randino.name.data._types import NameLanguageData, NameLengthSpec

ZH = NameLanguageData(
    order="family-first",
    joiner="",
    has_middle=False,
    roman="token",
    length_spec=NameLengthSpec(given=(1, 2), last=(1, 1), middle=(0, 0)),
    given_len_weights={1: 45, 2: 55},
    # Share of the population carrying each surname, in tenths of a percent. The
    # pool is the top fifty and every entry is listed, because none of them is a
    # rare surname: 王 and 李 each cover a twelfth of the country, 薛 a
    # five-hundredth.
    last_weights=weights("""
        王:79 李:79 张:71 刘:54 陈:45 杨:31 黄:22 赵:21 吴:21 周:20 徐:17 孙:15 马:14
        胡:13 朱:13 高:12 林:12 何:12 郭:12 郑:9 罗:9 梁:9 宋:8 谢:8 韩:7 唐:7 冯:6 曹:6
        萧:5 袁:5 邓:5 曾:5 彭:5 苏:5 蒋:5 蔡:5 于:4 董:4 程:4 沈:4 丁:4 魏:4 叶:4 傅:2
        薛:2
    """),
    last=tokens("""
        王:Wang 李:Li 张:Zhang 刘:Liu 陈:Chen 杨:Yang 赵:Zhao 黄:Huang 周:Zhou 吴:Wu
        徐:Xu 孙:Sun 胡:Hu 朱:Zhu 高:Gao 林:Lin 何:He 郭:Guo 马:Ma 罗:Luo 梁:Liang
        宋:Song 郑:Zheng 谢:Xie 韩:Han 唐:Tang 冯:Feng 于:Yu 董:Dong 萧:Xiao 程:Cheng
        曹:Cao 袁:Yuan 邓:Deng 傅:Fu 沈:Shen 曾:Zeng 彭:Peng 苏:Su 蒋:Jiang 蔡:Cai
        丁:Ding 魏:Wei 薛:Xue 叶:Ye 潘:Pan 杜:Du 戴:Dai 夏:Xia 钟:Zhong 汪:Wang 田:Tian
        任:Ren 姜:Jiang 范:Fan 方:Fang 石:Shi 姚:Yao 谭:Tan 廖:Liao 邹:Zou 熊:Xiong
        金:Jin 陆:Lu 郝:Hao 孔:Kong 白:Bai 崔:Cui 康:Kang 毛:Mao 邱:Qiu 秦:Qin 江:Jiang
        史:Shi 顾:Gu 侯:Hou 邵:Shao 孟:Meng 龙:Long 万:Wan 段:Duan 钱:Qian 汤:Tang
        尹:Yin 易:Yi 常:Chang 乔:Qiao 赖:Lai 龚:Gong 文:Wen 武:Wu 贺:He 黎:Li 余:Yu
        卢:Lu
    """),
    # Whole given names, spanning the generations the registry actually holds: 建国
    # / 秀英 for the older half, 奕辰 / 一诺 for the newer. Both lengths are
    # covered, because a one-character name is not any character of a two-character
    # one — 张伟 is a name, 苏子 is half of one.
    given_male=tokens("""
        奕辰:Yichen 宇轩:Yuxuan 浩宇:Haoyu 子墨:Zimo 宇航:Yuhang 浩然:Haoran 梓豪:Zihao
        子轩:Zixuan 俊杰:Junjie 志强:Zhiqiang 建国:Jianguo 建军:Jianjun 志明:Zhiming
        家豪:Jiahao 泽宇:Zeyu 雨泽:Yuze 思远:Siyuan 文博:Wenbo 国强:Guoqiang
        晓明:Xiaoming 伟:Wei 强:Qiang 磊:Lei 军:Jun 洋:Yang 勇:Yong 杰:Jie 涛:Tao
        明:Ming 超:Chao 刚:Gang 平:Ping 辉:Hui 鹏:Peng 斌:Bin 波:Bo 峰:Feng 健:Jian
        龙:Long 亮:Liang 伟强:Weiqiang 建华:Jianhua 志伟:Zhiwei 海涛:Haitao 立军:Lijun
        春林:Chunlin 国华:Guohua 建平:Jianping 永强:Yongqiang 卫东:Weidong 建斌:Jianbin
        志刚:Zhigang 天佑:Tianyou 皓宇:Haoyu 铭轩:Mingxuan 承轩:Chengxuan 睿轩:Ruixuan
        泽楷:Zekai 嘉豪:Jiahao 俊熙:Junxi 明轩:Mingxuan 子航:Zihang 雨轩:Yuxuan
        佳明:Jiaming 振华:Zhenhua 建强:Jianqiang 学军:Xuejun 兴国:Xingguo 立新:Lixin
        红兵:Hongbing 岩:Yan 帆:Fan 睿:Rui 楷:Kai 骏:Jun 珩:Heng 澈:Che 屹:Yi
    """),
    given_female=tokens("""
        一诺:Yinuo 欣怡:Xinyi 梓涵:Zihan 语桐:Yutong 欣妍:Xinyan 可欣:Kexin 梦瑶:Mengyao
        诗涵:Shihan 若曦:Ruoxi 佳怡:Jiayi 梓萱:Zixuan 雅婷:Yating 思琪:Siqi 秀英:Xiuying
        桂英:Guiying 秀兰:Xiulan 淑芬:Shufen 丽娟:Lijuan 春梅:Chunmei 晓燕:Xiaoyan
        芳:Fang 娜:Na 敏:Min 静:Jing 丽:Li 娟:Juan 燕:Yan 霞:Xia 秀:Xiu 英:Ying 玲:Ling
        艳:Yan 梅:Mei 兰:Lan 红:Hong 萍:Ping 慧:Hui 洁:Jie 颖:Ying 婷:Ting 丽华:Lihua
        秀珍:Xiuzhen 桂芳:Guifang 淑珍:Shuzhen 玉兰:Yulan 秀梅:Xiumei 金花:Jinhua
        桂香:Guixiang 秀云:Xiuyun 玉珍:Yuzhen 春花:Chunhua 秀芳:Xiufang 思彤:Sitong
        雨萱:Yuxuan 若涵:Ruohan 依诺:Yinuo 语嫣:Yuyan 沐辰:Muchen 芷若:Zhiruo 雨薇:Yuwei
        心怡:Xinyi 佳琪:Jiaqi 梦洁:Mengjie 婉清:Wanqing 淑华:Shuhua 桂珍:Guizhen
        秀清:Xiuqing 玉华:Yuhua 春兰:Chunlan 素芬:Sufen 薇:Wei 涵:Han 彤:Tong 萱:Xuan
        珊:Shan 蓉:Rong 岚:Lan 淇:Qi 妍:Yan
    """),
    first_male=tokens("""
        伟:wei 强:qiang 磊:lei 军:jun 洋:yang 勇:yong 杰:jie 涛:tao 明:ming 超:chao
        浩:hao 宇:yu 泽:ze 鑫:xin 鹏:peng 博:bo 文:wen 建:jian 俊:jun 志:zhi 天:tian
        子:zi 海:hai 立:li 春:chun 国:guo 永:yong 卫:wei 振:zhen 学:xue 兴:xing 红:hong
        皓:hao 铭:ming 承:cheng 睿:rui 嘉:jia
    """),
    rest_male=tokens("""
        然:ran 轩:xuan 宇:yu 杰:jie 豪:hao 文:wen 华:hua 强:qiang 明:ming 峰:feng 涛:tao
        伟:wei 龙:long 飞:fei 鹏:peng 阳:yang 波:bo 军:jun 林:lin 平:ping 斌:bin 刚:gang
        佑:you 楷:kai 熙:xi 航:hang 新:xin 兵:bing 国:guo
    """),
    first_female=tokens("""
        芳:fang 娜:na 敏:min 静:jing 丽:li 娟:juan 燕:yan 婷:ting 雅:ya 欣:xin 怡:yi
        梓:zi 诗:shi 雨:yu 思:si 佳:jia 玲:ling 美:mei 婉:wan 雪:xue 琳:lin 晓:xiao
        秀:xiu 桂:gui 淑:shu 玉:yu 金:jin 春:chun 若:ruo 依:yi 语:yu 沐:mu 芷:zhi 心:xin
        梦:meng 素:su 薇:wei
    """),
    rest_female=tokens("""
        婷:ting 怡:yi 涵:han 欣:xin 颖:ying 玲:ling 丽:li 娜:na 雅:ya 云:yun 洁:jie
        琳:lin 悦:yue 华:hua 芳:fang 敏:min 梦:meng 瑶:yao 珍:zhen 兰:lan 梅:mei 花:hua
        香:xiang 彤:tong 萱:xuan 诺:nuo 嫣:yan 辰:chen 若:ruo 琪:qi 清:qing 芬:fen
    """),
)
