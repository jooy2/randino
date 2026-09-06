// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for ru.
final SentenceLanguageData ru = SentenceLanguageData(
  space: ' ',
  capitalize: true,
  terminators: const <SentenceType, String>{
    SentenceType.statement: '.',
    SentenceType.question: '?',
    SentenceType.exclamation: '!',
    SentenceType.trailing: '…',
  },
  quotes: const <SentenceQuote, List<String>>{
    SentenceQuote.double: <String>['«', '»'],
    SentenceQuote.single: <String>['„', '“'],
  },
  predicateAgrees: true,
  pastAgreement: const <WordGender, List<List<String>>>{
    WordGender.f: <List<String>>[
      <String>['лся', 'лась'],
      <String>['л', 'ла'],
    ],
    WordGender.n: <List<String>>[
      <String>['лся', 'лось'],
      <String>['л', 'ло'],
    ],
  },
  verbs: <VerbGroup>[
    VerbGroup(
      field: VerbField.rise,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'просыпается встаёт поднимается'),
      past: PredicateTense(words: words(r'проснулся встал поднялся')),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'направляется удаляется отправляется спешит'),
      past: PredicateTense(words: words(r'направился удалился отправился поспешил')),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'возвращается прибывает появляется'),
      past: PredicateTense(words: words(r'вернулся прибыл появился')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'бежит прыгает плывёт летит ползёт бродит проходит гуляет шагает'),
      past: PredicateTense(
        words: words(r'бежал прыгал плыл летел ползал бродил проходил гулял шагал'),
      ),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'ждёт прячется оглядывается медлит останавливается'),
      past: PredicateTense(words: words(r'ждал прятался оглядывался медлил остановился')),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'отдыхает сидит лежит прислоняется устраивается'),
      past: PredicateTense(words: words(r'отдыхал сидел лежал прислонился устроился')),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'спит дремлет засыпает'),
      past: PredicateTense(words: words(r'спал дремал заснул')),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'смеётся плачет зевает вздыхает улыбается напевает бормочет кричит'),
      past: PredicateTense(
        words: words(r'смеялся плакал зевал вздыхал улыбался напевал бормотал кричал'),
      ),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'танцует поёт катается играет резвится подпрыгивает'),
      past: PredicateTense(words: words(r'танцевал пел катался играл резвился подпрыгивал')),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'ищет роется осматривается шарит'),
      past: PredicateTense(words: words(r'искал рылся осматривался шарил')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'успокаивается темнеет светлеет пустеет наполняется оживает'),
      past: PredicateTense(words: words(r'успокоился потемнел посветлел опустел наполнился ожил')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'светится струится углубляется начинается заканчивается длится проходит'),
      past: PredicateTense(
        words: words(r'светился струился углубился начался закончился длился проходил'),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'качается блестит падает катится клонится стареет'),
      past: PredicateTense(words: words(r'качался блестел упал катился клонился старел')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'едет останавливается проезжает возвращается отправляется скользит'),
      past: PredicateTense(
        words: words(r'ехал останавливался проезжал возвращался отправлялся скользил'),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'расходится исчезает остаётся плывёт нарастает'),
      past: PredicateTense(words: words(r'расходился исчезал остался плыл нарастал')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'подрастает вянет расцветает качается тянется'),
      past: PredicateTense(words: words(r'подрастал вял расцветал качался тянулся')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'дрожит движется немеет твердеет'),
      past: PredicateTense(words: words(r'дрожал двигался немел твердел')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'зреет остывает кипит тает портится'),
      past: PredicateTense(words: words(r'зрел остыл кипел растаял испортился')),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        большой маленький быстрый медленный тихий шумный смелый ленивый дикий кроткий умный
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'голодный'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'сытый'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'усталый сонный утомлённый'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'бодрый свежий отдохнувший'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'довольный счастливый радостный спокойный'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'скучающий любопытный беспокойный тревожный'),
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
      words: words(r'красивый странный новый редкий'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'широкий узкий спокойный глубокий тёмный светлый далёкий крутой'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'твёрдый лёгкий тяжёлый старый гладкий прозрачный прочный'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'сладкий солёный острый кислый горячий холодный'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'простой ясный смутный вечный мимолётный'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'зелёный пышный душистый увядший'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'тёплый холодный больной жёсткий'),
    ),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        смелый живой добрый занятой ленивый робкий умный молодой старый маленький большой тихий
        весёлый терпеливый ловкий любопытный
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'молодой добрый строгий серьёзный занятой честный'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'быстрый свирепый ручной пухлый крохотный'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        сладкий острый тёплый свежий хрустящий вкусный душистый горячий солёный мягкий спелый сытный
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'сладкий тёплый холодный прохладный горячий душистый свежий крепкий'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        старый новый маленький большой лёгкий тяжёлый блестящий гладкий прозрачный твёрдый красивый
        ценный древний
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'быстрый медленный крепкий'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        тихий широкий тёмный светлый чужой старый уютный укромный людный безмолвный далёкий близкий
        пустой одинокий солнечный
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'зелёный пышный душистый молодой увядший высокий маленький нежный свежий'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'смутный старый новый чужой ясный ценный маленький странный'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'долгий короткий тихий солнечный пасмурный шумный внезапный'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'маленький холодный тёплый тонкий крепкий'),
    ),
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
      words: words(r'красивый таинственный чужой новый'),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        тихо медленно быстро мягко вдруг едва одиноко ненадолго ровно смело осторожно жадно спокойно
        весело терпеливо легко чётко бодро лениво упрямо охотно шумно неспешно
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
      words: words(r'''
        тихо медленно мягко вдруг едва снова ещё мерно постепенно слабо понемногу всё_ещё чуть
      '''),
    ),
  ],
  times: SentenceTimes(
    day: words(r'''
      на_рассвете ранним_утром утром до_полудня в_полдень днём после_полудня в_сумерках вечером
      ночью поздней_ночью в_полночь
    '''),
    any: words(r'весной летом осенью зимой в_выходные в_праздники весь_день'),
    past: words(r'вчера на_прошлой_неделе давно однажды в_тот_день в_ту_ночь'),
    present: words(r'сегодня только_что завтра на_следующей_неделе'),
    habitual: words(r'нынче иногда каждый_день каждую_ночь'),
  ),
  homes: words(r'дом'),
  join: const SentenceJoin(word: 'и'),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'и_потом кроме_того'),
    ConnectiveKind.temporal: words(r'затем наконец потом тем_временем вскоре'),
    ConnectiveKind.contrastive: words(r'но однако а зато всё_же'),
    ConnectiveKind.causal: words(r'поэтому в_итоге значит'),
  },
  interjections: words(r'ах, ох, эх, ух, боже, гляди, право, ой, ух_ты, батюшки, надо_же, эй,'),
  pronouns: const <WordGender, WordPool>{
    WordGender.m: <String>['он'],
    WordGender.f: <String>['она'],
    WordGender.n: <String>['оно'],
  },
  frames: const <SentenceFrame>[
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 26),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
    ], 20),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, pastHead: 'был'),
    ], 20),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 18),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.manner),
    ], 16),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
    ], 12),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 14),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, pastHead: 'был'),
    ], 12),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.manner),
    ], 10),
  ],
);
