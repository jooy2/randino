// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for ja.
final SentenceLanguageData ja = SentenceLanguageData(
  space: '',
  capitalize: false,
  terminator: '。',
  verbs: <VerbGroup>[
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        走る 歩く 跳ぶ 泳ぐ 飛ぶ 這う 戻る 去る 止まる 休む 眠る 笑う 泣く 歌う 踊る 隠れる 待つ
        立つ 座る 転がる さまよう 通る 近づく 伸びる 聞く
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      words: words(r'''
        食べる 飲む 噛む 味わう 焼く 温める
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        見る 探す 拾う 運ぶ 触る 守る 選ぶ 動かす 集める
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        作る 直す 磨く 売る 買う 建てる
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        覚える 忘れる 想像する 数える
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        光る 流れる 暮れる 明ける 深まる 静まる 色づく
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        揺れる 輝く 落ちる 転がる 傾く 古びる
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        走る 止まる 通る 戻る 出発する 滑る
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        広がる 消える 残る 漂う 深まる
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        育つ 枯れる 咲く 揺れる 伸びる
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        震える 動く 痺れる 固まる
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        熟れる 冷める 煮える 溶ける 傷む
      '''),
    ),
  ],
  // Plain predicate forms, so a na-adjective closes on だ where an i-adjective
  // closes on itself. The `word` pools hold the attributive 静かな instead,
  // which cannot end a sentence.
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        大きい 小さい 速い 遅い 静かだ うるさい 勇敢だ 元気だ 眠い 賢い 優しい 荒々しい
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
        美しい 珍しい 新しい 見慣れない
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        広い 狭い 静かだ 深い 暗い 明るい 遠い 険しい
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        硬い 軽い 重い 古い 滑らかだ 透明だ 丈夫だ
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        甘い しょっぱい 辛い 酸っぱい 熱い 冷たい 香ばしい
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        難しい 易しい 明らかだ 曖昧だ 永遠だ はかない
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        青い 香しい 瑞々しい
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        温かい 冷たい 痛い 硬い
      '''),
    ),
  ],
  manners: words(r'''
      静かに ゆっくり 速く じっと そっと ふと 一緒に ひとりで また ずっと しばらく 次第に 急に
      いつも まだ 慎重に 力強く 並んで
    '''),
  times: words(r'''
      夜明けに 朝に 昼に 夕方に 夜に 真夜中に 今日 昨日 明日 春に 夏に 秋に 冬に 週末に さっき
      時々 毎日 夕暮れに
    '''),
  connectives: words(r'そして だから しかし ところが やがて すぐに ついに 一方 また'),
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>['', 'それ'],
  },
  pronounless: const <NounClass>[NounClass.person],
  frames: const <SentenceFrame>[
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
  ],
);
