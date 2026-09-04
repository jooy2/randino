// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';

/// The sentence dataset for ru.
final SentenceLanguageData ru = SentenceLanguageData(
  space: ' ',
  capitalize: true,
  terminator: '.',
  predicateAgrees: true,
  verbs: <VerbGroup>[
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        бежит идёт прыгает плывёт летит ползёт возвращается уходит останавливается отдыхает спит
        смеётся плачет поёт танцует прячется ждёт стоит сидит катится бродит проходит
        приближается слушает
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        светится течёт темнеет светлеет углубляется затихает
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        качается блестит падает катится клонится стареет
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        едет останавливается проезжает возвращается отправляется скользит
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        расходится исчезает остаётся плывёт нарастает
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        растёт вянет цветёт качается тянется
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        дрожит движется немеет твердеет
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        зреет остывает кипит тает портится
      '''),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        большой маленький быстрый медленный тихий шумный смелый ленивый голодный сонный дикий
        кроткий умный
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
        красивый странный новый редкий
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        широкий узкий спокойный глубокий тёмный светлый далёкий крутой
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        твёрдый лёгкий тяжёлый старый гладкий прозрачный прочный
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        сладкий солёный острый кислый горячий холодный
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        простой ясный смутный вечный мимолётный
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        зелёный пышный душистый увядший
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        тёплый холодный больной жёсткий
      '''),
    ),
  ],
  manners: words(r'''
      тихо медленно быстро мягко вдруг едва снова вместе одиноко ещё ненадолго ровно смело
      осторожно жадно
    '''),
  times: words(r'''
      на_рассвете утром днём вечером ночью сегодня вчера завтра весной летом осенью зимой
      в_выходные только_что иногда каждый_день в_сумерках
    '''),
  // Nominative only, which is why there is neither an object nor a place here: a
  // Russian noun changes its own ending for both, and the endings are the noun's
  // own rather than a rule the pools could carry.
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
      SentencePart(SentenceSlot.state),
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
  ],
);
