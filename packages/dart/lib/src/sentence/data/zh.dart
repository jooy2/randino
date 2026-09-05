// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for zh.
final SentenceLanguageData zh = SentenceLanguageData(
  space: '',
  capitalize: false,
  terminators: const <SentenceType, String>{
    SentenceType.statement: '。',
    SentenceType.question: '？',
    SentenceType.exclamation: '！',
    SentenceType.trailing: '…',
  },
  // The curly quotes rather than 「」: these pools are written in simplified
  // Chinese, and horizontal simplified text uses “” — the corner brackets are
  // what Taiwan and Hong Kong write.
  quotes: const <SentenceQuote, List<String>>{
    SentenceQuote.double: <String>['“', '”'],
    SentenceQuote.single: <String>['‘', '’'],
  },
  verbs: <VerbGroup>[
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        奔跑 行走 跳跃 游泳 飞翔 爬行 返回 离开 停下 休息 睡觉 微笑 哭泣 歌唱 跳舞 躲藏 等待
        站立 坐下 打滚 徘徊 经过 靠近 倾听
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      words: words(r'''
        吃 喝 咀嚼 品尝 烘烤 加热
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        观看 寻找 捡起 搬运 触摸 守护 挑选 移动 收集
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        制作 修理 擦拭 出售 购买 建造
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        记得 忘记 想象 数
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        发光 流淌 变暗 变亮 加深 沉寂 染色
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        摇晃 闪耀 掉落 滚动 倾斜 老化
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        行驶 停下 经过 返回 出发 滑行
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        蔓延 消失 留下 飘荡 加深
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        生长 枯萎 开花 摇曳 舒展
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        颤抖 移动 麻木 僵硬
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        成熟 冷却 沸腾 融化 变质
      '''),
    ),
  ],
  // A bare adjective cannot stand as a predicate on its own, so the shape that
  numeral: const SentenceNumeral(
    order: NumeralOrder.after,
    counters: <NounClass, String>{
      NounClass.creature: '只',
      NounClass.person: '位',
      NounClass.plant: '棵',
      NounClass.edible: '个',
      NounClass.thing: '个',
      NounClass.vehicle: '辆',
      NounClass.place: '处',
      NounClass.event: '次',
      NounClass.idea: '种',
      NounClass.body: '个',
    },
    count: LengthRange(2, 12),
    currency: '元',
    amounts: <int>[100, 500, 1000, 3000, 5000, 10000, 30000, 50000, 100000],
    group: ',',
    gap: '',
  ),
  // uses one writes 很 in front of it.
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        大 小 快 慢 安静 吵闹 勇敢 懒 忙 饿 困 凶 温和 聪明
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[
        NounClass.creature,
        NounClass.person,
        NounClass.plant,
        NounClass.edible,
        NounClass.thing,
        NounClass.vehicle,
        NounClass.place,
        NounClass.event,
        NounClass.idea,
        NounClass.body,
      ],
      words: words(r'''
        美丽 陌生 新 常见 罕见
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        宽阔 狭窄 平静 深 暗 亮 遥远 陡峭
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        坚硬 轻 重 旧 光滑 透明 结实
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        甜 咸 辣 酸 烫 凉 香
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        简单 明显 模糊 永恒 短暂
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        青翠 茂盛 芬芳 枯黄
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        温暖 冰凉 酸痛 僵硬
      '''),
    ),
  ],
  manners: words(r'''
    安静地 慢慢地 迅速地 静静地 悄悄地 忽然 一起 独自 又 一直 渐渐地 稍稍 总是 仍然 小心地 有力地 并排 轻轻地 用力地 认真地 匆匆地 缓缓地 默默地 从容地 欢快地
    稳稳地 淡淡地 反复 依旧
  '''),
  times: words(r'''
    黎明时 早晨 中午 傍晚 夜里 深夜 今天 昨天 明天 春天 夏天 秋天 冬天 周末 刚才 有时 每天 黄昏时 正午 午夜 上周 下周 最近 从前 假日 整天 每晚
  '''),
  connectives: words(r'''
    然后 所以 但是 不过 于是 后来 接着 同时 终于 而且 可是 因此 然而 结果 随后
  '''),
  interjections: words(r'''
    啊， 哎呀， 哇， 唉， 天啊， 瞧， 咦， 呀， 嘿， 哟， 好家伙， 我的天，
  '''),
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>['', '它'],
  },
  pronounless: const <NounClass>[NounClass.person],
  // Chinese writes a date largest to smallest and its copula as a word of its
  // own, in front of what it equates the subject to.
  calendar: SentenceCalendar(
    date: 'Y年M月D日',
    clock: 'h点mm分',
    years: LengthRange(2020, 2030),
    copula: StateGroup(
      // An event is a thing that happens on a day, and a lion is not.
      subject: <NounClass>[NounClass.event],
      words: <String>['是'],
    ),
  ),
  frames: const <SentenceFrame>[
    // A date and a clock, standing where an adverbial stands.
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.date, head: '在'),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.clock, head: '在'),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    // And the shape that equates the subject to one: `比赛是11点40分。`
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.date, copula: CopulaSide.head),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.clock, copula: CopulaSide.head),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 20),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
    ], 18),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.place, head: '在', tail: '里', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 14),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: '很'),
    ], 12),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
    ], 10),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 8),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.place, head: '在', tail: '里', modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
    ], 7),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.place, head: '在', tail: '里', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
    ], 5),
    // Chinese asks with 吗 after the whole clause, which is a tag rather than a
    // phrase, and leaves everything in front of it alone.
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      20,
      mood: SentenceMood.question,
      tag: '吗',
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.object, modifiable: true),
      ],
      16,
      mood: SentenceMood.question,
      tag: '吗',
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.state, head: '很'),
      ],
      14,
      mood: SentenceMood.question,
      tag: '吗',
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.place, head: '在', tail: '里', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      12,
      mood: SentenceMood.question,
      tag: '吗',
    ),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.quantity),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.quantity),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.money),
    ], 5),
  ],
);
