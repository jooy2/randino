// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/organization/data/types.dart';
import 'package:randino/src/types.dart';

/// The Japanese organization dataset.
final OrganizationLanguageData ja = OrganizationLanguageData(
  stems: words(r'''
    青葉 若葉 白鷺 白樺 東雲 朝霧 夕凪 宝来 葵 紫苑 翠山 碧水 陽光 昌栄 恵和
    翔栄 緑風 白峰 暁 黎明 蒼天 天陽 桜花 楓 若竹 秋桜 白雲 青嵐 澄川 静峰
    光風 瑞雲 和泉 花水木 星影 月見 清流 麗泉 晴嵐 錦
  '''),
  syn: OrganizationPoolSynthesis(
    pool: words(r'''
      青 葉 明 栄 翔 清 瑞 雅 晴 澄 碧 翠 陽 月 雲 嵐 泉 峰 川 森 恵 昌
      誠 豊 松 若 白 錦 紫 朝 夕 暁 凪 楓 葵 桜
    '''),
    avoid: words(r'光栄 和光 森永 明星'),
    joiner: '',
    minSyllables: 2,
    maxSyllables: 2,
  ),
  industries: <OrganizationIndustry, List<String>>{
    OrganizationIndustry.tech: words(r'テクノロジー システム ソフト 情報システム 電子 ネットワーク データ ソリューションズ'),
    OrganizationIndustry.manufacturing: words(r'製作所 工業 精機 化学 金属 製造 工機'),
    OrganizationIndustry.food: words(r'食品 製菓 水産 フーズ 乳業 酒造 農園'),
    OrganizationIndustry.retail: words(r'商事 商店 物産 ストア 商会 流通'),
    OrganizationIndustry.finance: words(r'証券 ファイナンス キャピタル 投資 信託 保険'),
    OrganizationIndustry.construction: words(r'建設 工務店 建築 土木 ハウス 不動産'),
    OrganizationIndustry.logistics: words(r'運輸 物流 倉庫 海運 エクスプレス 運送'),
    OrganizationIndustry.media: words(r'出版 放送 メディア スタジオ 企画 広告 映像'),
    OrganizationIndustry.health: words(r'製薬 薬品 メディカル ヘルスケア バイオ 医療器'),
    OrganizationIndustry.energy: words(r'エネルギー 電力 ガス 石油 ソーラー 電工'),
  },
  generic: words(r'産業 ホールディングス グループ 興業 インターナショナル'),
  templates: <OrganizationType, List<String>>{
    OrganizationType.company: <String>['{stem}{industry}'],
    OrganizationType.nonprofit: <String>[
      '{stem}財団',
      '{stem}協会',
      '{stem}振興会',
      '{stem}文化財団',
      '{stem}育英会',
      '{stem}保存会',
      '{stem}友の会',
      '{stem}福祉会',
    ],
    OrganizationType.school: <String>[
      '{stem}幼稚園',
      '{stem}小学校',
      '{stem}中学校',
      '{stem}高等学校',
      '{stem}女子高等学校',
      '{stem}工業高等学校',
      '{stem}大学',
      '{stem}短期大学',
      '{stem}学園',
      '{stem}看護専門学校',
    ],
    OrganizationType.government: <String>[
      '{stem}市役所',
      '{stem}区役所',
      '{stem}町役場',
      '{stem}警察署',
      '{stem}消防署',
      '{stem}税務署',
      '{stem}地方裁判所',
      '{stem}保健所',
      '{stem}市教育委員会',
    ],
    OrganizationType.public: <String>[
      '{stem}市立図書館',
      '{stem}美術館',
      '{stem}博物館',
      '{stem}市民病院',
      '{stem}交通局',
      '{stem}水道局',
      '{stem}文化会館',
      '{stem}市民会館',
    ],
  },
  legalForms: <String>['株式会社{name}', '{name}株式会社', '有限会社{name}', '合同会社{name}'],
);
