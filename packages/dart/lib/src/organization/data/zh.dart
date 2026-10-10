// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/organization/data/types.dart';
import 'package:randino/src/types.dart';

/// The Chinese organization dataset.
final OrganizationLanguageData zh = OrganizationLanguageData(
  stems: words(r'''
    明辉 鑫达 天成 新元 海峰 远航 东升 鼎盛 瑞祥 云帆 清源 博远 金鼎 广源 泰和
    佳和 永盛 德润 鸿运 正源 和美 翠峰 春晖 宏盛 华辰 盈泰 锦华 腾远 晨曦 卓信
    弘远 启航 新航 恒远 天晟 昌盛 盛源 文澜 松涛 晴川 景程
  '''),
  syn: OrganizationPoolSynthesis(
    pool: words(r'''
      明 鑫 成 新 元 峰 远 航 升 鼎 盛 瑞 祥 帆 清 源 博 泰 佳 德 润 鸿
      翠 晖 辰 盈 锦 腾 晨 曦 卓 弘 启 晟 昌 澜 涛 景 睿 琪 璟 煜 舟
    '''),
    avoid: words(r'海信 恒瑞 永辉 正泰 宏达 泰禾 嘉德 锦程 辉瑞 瑞达'),
    joiner: '',
    minSyllables: 2,
    maxSyllables: 2,
  ),
  places: words(r'''
    北京 上海 广州 深圳 杭州 成都 武汉 南京 苏州 天津 重庆 西安 长沙 青岛 厦门
    宁波 郑州 合肥 济南 昆明
  '''),
  industries: <OrganizationIndustry, List<String>>{
    OrganizationIndustry.tech: words(r'科技 信息技术 软件 电子 网络科技 数据科技 智能科技'),
    OrganizationIndustry.manufacturing: words(r'机械 精密制造 化工 新材料 机电 模具 五金'),
    OrganizationIndustry.food: words(r'食品 餐饮管理 农业 乳业 饮品 粮油 茶业'),
    OrganizationIndustry.retail: words(r'商贸 贸易 百货 超市 零售 商行'),
    OrganizationIndustry.finance: words(r'投资 资本 资产管理 融资租赁 保险代理 金融服务'),
    OrganizationIndustry.construction: words(r'建设 建筑工程 房地产开发 装饰工程 置业 工程'),
    OrganizationIndustry.logistics: words(r'物流 运输 供应链 快运 航运 仓储'),
    OrganizationIndustry.media: words(r'文化传媒 传媒 影视 广告 出版 文化'),
    OrganizationIndustry.health: words(r'医药 生物科技 医疗器械 健康管理 制药 药业'),
    OrganizationIndustry.energy: words(r'能源 新能源 电力 燃气 光伏 环保能源'),
  },
  generic: words(r'实业 集团 控股 国际 发展'),
  templates: <OrganizationType, List<String>>{
    OrganizationType.company: <String>['{place}{stem}{industry}', '{stem}{industry}'],
    OrganizationType.nonprofit: <String>[
      '{stem}基金会',
      '{stem}协会',
      '{stem}慈善会',
      '{stem}志愿者协会',
      '{stem}商会',
      '{stem}研究会',
      '{stem}促进会',
    ],
    OrganizationType.school: <String>[
      '{stem}幼儿园',
      '{stem}小学',
      '{stem}中学',
      '{stem}实验学校',
      '{stem}外国语学校',
      '{stem}大学',
      '{stem}学院',
      '{stem}职业技术学院',
    ],
    OrganizationType.government: <String>[
      '{stem}区人民政府',
      '{stem}镇人民政府',
      '{stem}街道办事处',
      '{stem}派出所',
      '{stem}消防救援站',
      '{stem}税务所',
      '{stem}区人民法院',
    ],
    OrganizationType.public: <String>[
      '{stem}图书馆',
      '{stem}博物馆',
      '{stem}美术馆',
      '{stem}人民医院',
      '{stem}中心医院',
      '{stem}文化馆',
      '{stem}科技馆',
      '{stem}体育中心',
    ],
  },
  legalForms: <String>['{name}有限公司', '{name}股份有限公司', '{name}有限责任公司'],
);
