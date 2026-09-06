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
  quotes: const <SentenceQuote, List<String>>{
    SentenceQuote.double: <String>['“', '”'],
    SentenceQuote.single: <String>['‘', '’'],
  },
  pastMark: const SentencePastMark(tail: '了'),
  verbs: <VerbGroup>[
    VerbGroup(
      field: VerbField.rise,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'起床 醒来 起身 站起来'),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'去 前往 赶往'),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      requires: SentenceSlot.destination,
      words: words(r'走向 跑向'),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'出发 离开 出门 动身'),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'到达 抵达 回到 来到'),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'返回 归来 回家'),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      words: words(r'奔跑 行走 跳跃 散步 溜达'),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'徘徊 经过'),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.swimmer],
      words: words(r'游泳'),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature],
      subjectTraits: const <NounTrait>[NounTrait.flier],
      words: words(r'飞翔'),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.crawler],
      words: words(r'爬行'),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'等待 躲藏 环顾 犹豫 停下 张望'),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'休息 坐下 躺下 靠着 蜷缩 歇息'),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'睡觉 入睡 打盹 睡着'),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'微笑 哭泣 打哈欠 叹气 哼歌 咕哝 喊叫 大笑'),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'跳舞 歌唱 打滚 玩耍 蹦跳 嬉戏'),
    ),
    VerbGroup(
      field: VerbField.think,
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'记得 忘记 想象 数 想起 惦记'),
    ),
    VerbGroup(
      field: VerbField.look,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'观看 注视 打量 检查 触摸 抚摸 端详'),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'寻找 搜寻 翻找 找寻'),
    ),
    VerbGroup(
      field: VerbField.find,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'找到 发现 捡起 寻得'),
    ),
    VerbGroup(
      field: VerbField.take,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'挑选 拿起 抓住 拿 取出 收下'),
    ),
    VerbGroup(
      field: VerbField.carry,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'搬运 带回 抱着 提着 拿回'),
    ),
    VerbGroup(
      field: VerbField.hide,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'藏起 收好 守护 埋起 藏好'),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'制作 建造 雕刻 绘制 编织 组装'),
    ),
    VerbGroup(
      field: VerbField.tend,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'修理 擦拭 保养 整理 打磨 修补'),
    ),
    VerbGroup(
      field: VerbField.sell,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'出售 卖掉 转让 摆卖'),
    ),
    VerbGroup(
      field: VerbField.buy,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle, NounClass.edible],
      words: words(r'购买 买下 买回 采购'),
    ),
    VerbGroup(
      field: VerbField.cook,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'烘烤 加热 煮 烹饪 切 盛上'),
    ),
    VerbGroup(
      field: VerbField.eat,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'吃 咀嚼 品尝 啃 吃光'),
    ),
    VerbGroup(
      field: VerbField.drink,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'喝 啜饮 喝光 品饮'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'安静下来 变暗 变亮 热闹起来 沉寂 亮起来'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'发光 流淌 加深 开始 结束 持续 过去'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'摇晃 闪耀 掉落 滚动 倾斜 老化'),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'行驶 停下 经过 返回 出发 滑行'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'蔓延 消失 留下 飘荡 加深'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'生长 枯萎 开花 摇曳 舒展'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'颤抖 移动 麻木 僵硬'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'成熟 冷却 沸腾 融化 变质'),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'大 小 快 慢 安静 吵闹 勇敢 懒 忙 凶 温和 聪明'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'饿 饥饿'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'饱 饱足'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'累 困 疲倦 乏'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'精神 神清气爽 有精神'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'高兴 开心 快乐 满足 舒心'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'无聊 好奇 焦急 不安'),
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
      words: words(r'美丽 陌生 新 常见 罕见'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'宽阔 狭窄 平静 深 暗 亮 遥远 陡峭'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'坚硬 轻 重 旧 光滑 透明 结实'),
    ),
    StateGroup(subject: const <NounClass>[NounClass.edible], words: words(r'甜 咸 辣 酸 烫 凉 香')),
    StateGroup(subject: const <NounClass>[NounClass.idea], words: words(r'简单 明显 模糊 永恒 短暂')),
    StateGroup(subject: const <NounClass>[NounClass.plant], words: words(r'青翠 茂盛 芬芳 枯黄')),
    StateGroup(subject: const <NounClass>[NounClass.body], words: words(r'温暖 冰凉 酸痛 僵硬')),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'勇敢的 安静的 勤劳的 懒惰的 害羞的 聪明的 年轻的 年老的 小 大 活泼的 悠闲的 敏捷的 好奇的'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'年轻的 亲切的 严厉的 认真的 忙碌的 诚实的'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'敏捷的 凶猛的 温顺的 胖胖的 小小的'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'甜甜的 香辣的 温热的 新鲜的 酥脆的 香喷喷的 热乎乎的 咸香的 软软的 熟透的 美味的'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'甜甜的 温热的 冰凉的 清凉的 热的 芬芳的 新鲜的 浓浓的 苦涩的'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'旧 新 小 大 轻巧的 沉重的 闪亮的 光滑的 透明的 坚硬的 漂亮的 珍贵的 古老的'),
    ),
    ModifierGroup(subject: const <NounClass>[NounClass.vehicle], words: words(r'快速的 缓慢的 结实的')),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'安静的 宽阔的 昏暗的 明亮的 陌生的 古老的 温馨的 僻静的 热闹的 遥远的 附近的 空荡荡的 冷清的 阳光明媚的'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'翠绿的 茂盛的 芬芳的 幼小的 枯萎的 高大的 小小的 娇嫩的'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'模糊的 古老的 新 陌生的 清晰的 珍贵的 小小的 奇怪的'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'漫长的 短暂的 安静的 晴朗的 阴沉的 喧闹的 突然的'),
    ),
    ModifierGroup(subject: const <NounClass>[NounClass.body], words: words(r'小小的 冰凉的 温暖的 纤细的 结实的')),
    ModifierGroup(
      subject: const <NounClass>[
        NounClass.creature,
        NounClass.person,
        NounClass.plant,
        NounClass.thing,
        NounClass.vehicle,
        NounClass.place,
        NounClass.event,
        NounClass.idea,
        NounClass.body,
      ],
      words: words(r'美丽的 神秘的 陌生的 新'),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        安静地 慢慢地 迅速地 静静地 悄悄地 独自 稍稍 小心地 有力地 轻轻地 用力地 认真地 匆匆地 缓缓地 默默地 从容地 欢快地 稳稳地 淡淡地 欣然 悠然
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[
        NounClass.plant,
        NounClass.edible,
        NounClass.thing,
        NounClass.vehicle,
        NounClass.place,
        NounClass.event,
        NounClass.idea,
        NounClass.body,
      ],
      words: words(r'慢慢地 渐渐地 忽然 又 一直 总是 仍然 静静地 悄悄地 缓缓地 依旧 反复 逐渐 悄然'),
    ),
  ],
  times: SentenceTimes(
    day: words(r'黎明时 清晨 早晨 上午 中午 下午 黄昏时 傍晚 夜里 深夜 午夜'),
    any: words(r'春天 夏天 秋天 冬天 周末 假日 整天'),
    past: words(r'昨天 上周 从前 那天 当年 那晚'),
    present: words(r'今天 刚才 明天 下周'),
    habitual: words(r'最近 有时 每天 每晚'),
  ),
  homes: words(r'家'),
  join: const SentenceJoin(word: '，然后'),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'而且 此外'),
    ConnectiveKind.temporal: words(r'然后 后来 接着 同时 终于 随后 不久'),
    ConnectiveKind.contrastive: words(r'但是 不过 可是 然而'),
    ConnectiveKind.causal: words(r'所以 于是 因此 结果'),
  },
  traits: <NounTrait, WordPool>{
    NounTrait.flier: words(r'''
      猫头鹰 麻雀 喜鹊 燕子 老鹰 游隼 仙鹤 天鹅 鸭子 啄木鸟 鹦鹉 孔雀 蝴蝶 飞蛾 蜜蜂 蜻蜓 瓢虫 蝙蝠 白鹭 鹈鹕 大雁 乌鸦 云雀 夜莺 翠鸟 火烈鸟 萤火虫 金龟子 锹甲 萤火
      蜉蝣 苍蝇 蚊子 神龙 火龙 冰龙 黑龙 白龙 青龙 凤凰 妖精 精灵 仙女 天使 天马 神鸟 朱雀 三足乌 蛟龙 鸟女 石像鬼 小恶魔 小妖精 女武神
    '''),
    NounTrait.swimmer: words(r'''
      鲸鱼 海豚 鲨鱼 乌龟 海豹 企鹅 青蛙 章鱼 乌贼 海星 螃蟹 龙虾 鲤鱼 三文鱼 鳄鱼 蝌蚪 蟾蜍 雨蛙 鲫鱼 鲶鱼 黑鱼 鳜鱼 青鳉 泥鳅 鳗鱼 海鳗 带鱼 鲅鱼 秋刀鱼 凤尾鱼
      黄鱼 明太鱼 人鱼 美人鱼 海妖 巨乌贼 海兽王
    '''),
    NounTrait.crawler: words(r'''
      乌龟 蜥蜴 变色龙 蟒蛇 蜗牛 蚂蚁 蜘蛛 螃蟹 鳄鱼 螳螂 蚯蚓 蜈蚣 马陆 蝎子 壁虱 跳蚤 蚕蛹 毛虫 蝾螈 菜花蛇 蝮蛇 毒蛇 眼镜蛇 响尾蛇 鬣蜥 蛇王
    '''),
  },
  interjections: words(r'啊， 哎呀， 哇， 唉， 天啊， 瞧， 咦， 呀， 嘿， 哟， 好家伙， 我的天，'),
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>['', '它'],
  },
  pronounless: const <NounClass>[NounClass.person, NounClass.creature],
  objectPronouns: const SentenceObjectPronouns(
    words: <WordGender, WordPool>{
      WordGender.n: <String>[''],
    },
  ),
  speech: const SentenceSpeech(subject: '我'),
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
  calendar: SentenceCalendar(
    date: 'Y年M月D日',
    clock: 'h点mm分',
    years: const LengthRange(2020, 2030),
    copula: StateGroup(subject: const <NounClass>[NounClass.event], words: <String>['是']),
  ),
  frames: const <SentenceFrame>[
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
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, modifiable: true),
      ],
      10,
      fields: <VerbField>[VerbField.go, VerbField.arrive],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.time),
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, modifiable: true),
      ],
      5,
      fields: <VerbField>[VerbField.go, VerbField.arrive],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.manner),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, modifiable: true),
      ],
      4,
      fields: <VerbField>[VerbField.go, VerbField.arrive],
    ),
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
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
    ], 4),
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
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, modifiable: true),
      ],
      6,
      mood: SentenceMood.question,
      tag: '吗',
      fields: <VerbField>[VerbField.go, VerbField.arrive],
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
