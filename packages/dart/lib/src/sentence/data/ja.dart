// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for ja.
final SentenceLanguageData ja = SentenceLanguageData(
  space: '',
  capitalize: false,
  terminators: const <SentenceType, String>{
    SentenceType.statement: '。',
    SentenceType.question: '？',
    SentenceType.exclamation: '！',
    SentenceType.trailing: '…',
  },
  // The corner brackets, not the curly quotes: Japanese writes 「」 first and
  // 『』 for a quote inside one.
  quotes: const <SentenceQuote, List<String>>{
    SentenceQuote.double: <String>['「', '」'],
    SentenceQuote.single: <String>['『', '』'],
  },
  verbs: <VerbGroup>[
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        走る 歩く 跳ぶ 泳ぐ 飛ぶ 這う 戻る 去る 止まる 休む 眠る 笑う 泣く 歌う 踊る 隠れる 待つ
        立つ 座る 転がる さまよう 通る 近づく 伸びる 聞く
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          走ります 歩きます 跳びます 泳ぎます 飛びます 這います 戻ります 去ります 止まります 休みます 眠ります 笑います 泣きます 歌います 踊ります
          隠れます 待ちます 立ちます 座ります 転がります さまよいます 通ります 近づきます 伸びます 聞きます
        '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      words: words(r'''
        食べる 飲む 噛む 味わう 焼く 温める
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'食べます 飲みます 噛みます 味わいます 焼きます 温めます'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        見る 探す 拾う 運ぶ 触る 守る 選ぶ 動かす 集める
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'見ます 探します 拾います 運びます 触ります 守ります 選びます 動かします 集めます'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        作る 直す 磨く 売る 買う 建てる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'作ります 直します 磨きます 売ります 買います 建てます'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        覚える 忘れる 想像する 数える
      '''),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'覚えます 忘れます 想像します 数えます')},
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        光る 流れる 暮れる 明ける 深まる 静まる 色づく
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'光ります 流れます 暮れます 明けます 深まります 静まります 色づきます'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        揺れる 輝く 落ちる 転がる 傾く 古びる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'揺れます 輝きます 落ちます 転がります 傾きます 古びます'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        走る 止まる 通る 戻る 出発する 滑る
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'走ります 止まります 通ります 戻ります 出発します 滑ります'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        広がる 消える 残る 漂う 深まる
      '''),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'広がります 消えます 残ります 漂います 深まります')},
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        育つ 枯れる 咲く 揺れる 伸びる
      '''),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'育ちます 枯れます 咲きます 揺れます 伸びます')},
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        震える 動く 痺れる 固まる
      '''),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'震えます 動きます 痺れます 固まります')},
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        熟れる 冷める 煮える 溶ける 傷む
      '''),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'熟れます 冷めます 煮えます 溶けます 傷みます')},
    ),
  ],
  // Plain predicate forms, so a na-adjective closes on だ where an i-adjective
  // closes on itself. The `word` pools hold the attributive 静かな instead,
  numeral: const SentenceNumeral(
    order: NumeralOrder.after,
    counters: <NounClass, String>{
      NounClass.creature: '匹',
      NounClass.person: '人',
      NounClass.plant: '本',
      NounClass.edible: '個',
      NounClass.thing: '個',
      NounClass.vehicle: '台',
      NounClass.place: '箇所',
      NounClass.event: '回',
      NounClass.idea: '種類',
      NounClass.body: '本',
    },
    count: LengthRange(2, 12),
    currency: '円',
    amounts: <int>[1000, 5000, 10000, 30000, 50000, 100000, 300000, 500000, 1000000],
    group: ',',
    gap: '',
  ),
  // which cannot end a sentence.
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        大きい 小さい 速い 遅い 静かだ うるさい 勇敢だ 元気だ 眠い 賢い 優しい 荒々しい
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(
          r'大きいです 小さいです 速いです 遅いです 静かです うるさいです 勇敢です 元気です 眠いです 賢いです 優しいです 荒々しいです',
        ),
      },
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
        美しい 珍しい 新しい 見慣れない
      '''),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'美しいです 珍しいです 新しいです 見慣れないです')},
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        広い 狭い 静かだ 深い 暗い 明るい 遠い 険しい
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'広いです 狭いです 静かです 深いです 暗いです 明るいです 遠いです 険しいです'),
      },
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        硬い 軽い 重い 古い 滑らかだ 透明だ 丈夫だ
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'硬いです 軽いです 重いです 古いです 滑らかです 透明です 丈夫です'),
      },
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        甘い しょっぱい 辛い 酸っぱい 熱い 冷たい 香ばしい
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'甘いです しょっぱいです 辛いです 酸っぱいです 熱いです 冷たいです 香ばしいです'),
      },
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        難しい 易しい 明らかだ 曖昧だ 永遠だ はかない
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'難しいです 易しいです 明らかです 曖昧です 永遠です はかないです'),
      },
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        青い 香しい 瑞々しい
      '''),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'青いです 香しいです 瑞々しいです')},
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        温かい 冷たい 痛い 硬い
      '''),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'温かいです 冷たいです 痛いです 硬いです')},
    ),
  ],
  manners: words(r'''
    静かに ゆっくり 速く じっと そっと ふと 一緒に ひとりで また ずっと しばらく 次第に 急に いつも まだ 慎重に 力強く 並んで 素早く 黙って 軽やかに 丁寧に 懸命に
    のんびり ぼんやり しっかり さらりと ひっそり 悠々と きちんと ゆるやかに 朗らかに
  '''),
  times: words(r'''
    夜明けに 朝に 昼に 夕方に 夜に 真夜中に 今日 昨日 明日 春に 夏に 秋に 冬に 週末に さっき 時々 毎日 夕暮れに 真昼に 元日に 先週 来週 近頃 昔 休日に 一日中 毎晩
  '''),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'そして また しかも ところで'),
    ConnectiveKind.temporal: words(r'やがて すぐに ついに 一方 その後'),
    ConnectiveKind.contrastive: words(r'しかし ところが けれども それでも'),
    ConnectiveKind.causal: words(r'だから つまり'),
  },
  interjections: words(r'''
    ああ、 おお、 まあ、 なんと、 やれやれ、 おや、 ほら、 へえ、 わあ、 あら、 おっと、 いやはや、
  '''),
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>['', 'それ'],
  },
  pronounless: const <NounClass>[NounClass.person],
  // Japanese writes a date largest to smallest with nothing between the parts,
  // and its copula onto the end of what it equates the subject to.
  calendar: SentenceCalendar(
    date: 'Y年M月D日',
    clock: 'h時mm分',
    years: LengthRange(2020, 2030),
    copula: StateGroup(
      // An event is a thing that happens on a day, and a lion is not.
      subject: <NounClass>[NounClass.event],
      words: <String>['だ'],
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: <String>['です'],
      },
    ),
  ),
  frames: const <SentenceFrame>[
    // A date and a clock, standing where an adverbial stands.
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.date, tail: 'に'),
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.clock, tail: 'に'),
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    // And the shape that equates the subject to one: `試合は11時40分だ。`
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'は'),
      SentencePart(SentenceSlot.date, copula: CopulaSide.tail),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'は'),
      SentencePart(SentenceSlot.clock, copula: CopulaSide.tail),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 20),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.object, tail: 'を', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 18),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.place, tail: 'で', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 14),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'は', modifiable: true),
      SentencePart(SentenceSlot.state),
    ], 12),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
    ], 10),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 8),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.place, tail: 'で', modifiable: true),
      SentencePart(SentenceSlot.object, tail: 'を', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 7),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.place, tail: 'で', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.object, tail: 'を', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    // Japanese asks with か after the predicate, which is a tag rather than a
    // phrase — no slot could carry it, and the word order does not move.
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      20,
      mood: SentenceMood.question,
      tag: 'か',
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
        SentencePart(SentenceSlot.object, tail: 'を', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      16,
      mood: SentenceMood.question,
      tag: 'か',
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: 'は', modifiable: true),
        SentencePart(SentenceSlot.state),
      ],
      14,
      mood: SentenceMood.question,
      tag: 'か',
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
        SentencePart(SentenceSlot.place, tail: 'で', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      12,
      mood: SentenceMood.question,
      tag: 'か',
    ),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.quantity, tail: 'を'),
      SentencePart(SentenceSlot.verb),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.quantity, tail: 'が'),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.money, tail: 'を'),
      SentencePart(SentenceSlot.verb),
    ], 5),
  ],
);
