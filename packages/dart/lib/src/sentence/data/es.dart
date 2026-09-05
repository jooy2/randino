// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for es.
final SentenceLanguageData es = SentenceLanguageData(
  space: ' ',
  capitalize: true,
  terminators: const <SentenceType, String>{
    SentenceType.statement: '.',
    SentenceType.question: '?',
    SentenceType.exclamation: '!',
    SentenceType.trailing: '…',
  },
  // Guillemets first, and the curly quotes for a quote inside one.
  quotes: const <SentenceQuote, List<String>>{
    SentenceQuote.double: <String>['«', '»'],
    SentenceQuote.single: <String>['“', '”'],
  },
  // The one language here that marks a question and an exclamation at both
  // ends, which is why the openers exist at all.
  openers: const <SentenceType, String>{SentenceType.question: '¿', SentenceType.exclamation: '¡'},
  // The definite article, by the noun's gender. The feminine entries in front of
  // the default are the nouns that begin on a stressed a- and take `el` for the
  // sound of it; the two that only start the same way are listed above them, so
  // the first match is still the right one.
  articles: const <WordGender, List<List<String>>>{
    WordGender.m: <List<String>>[
      <String>['', 'el'],
    ],
    WordGender.f: <List<String>>[
      <String>['aguamarina', 'la'],
      <String>['aguanieve', 'la'],
      <String>['agua', 'el'],
      <String>['alma', 'el'],
      <String>['ancla', 'el'],
      <String>['hacha', 'el'],
      <String>['águila', 'el'],
      <String>['', 'la'],
    ],
  },
  predicateAgrees: true,
  verbs: <VerbGroup>[
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        corre camina salta nada vuela repta regresa parte se_detiene descansa duerme ríe llora
        canta baila se_esconde espera se_levanta se_sienta rueda vaga pasa se_acerca escucha
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      words: words(r'''
        come bebe mastica prueba hornea calienta
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        mira busca recoge lleva toca guarda elige mueve reúne
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        hace repara limpia vende compra construye
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        recuerda olvida imagina cuenta
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        brilla fluye oscurece aclara se_ahonda se_calma
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        se_mece reluce cae rueda se_inclina envejece
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        circula se_detiene pasa regresa parte resbala
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        se_extiende desaparece permanece flota se_ahonda
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        crece se_marchita florece se_mece brota
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        tiembla se_mueve se_entumece sana
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        madura se_enfría hierve se_derrite se_estropea
      '''),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        grande pequeño rápido lento silencioso ruidoso valiente perezoso ocupado hambriento
        soñoliento fiero manso listo
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
        hermoso extraño nuevo común raro
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        ancho estrecho tranquilo profundo oscuro claro lejano empinado
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        duro ligero pesado viejo liso transparente robusto
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        dulce salado picante ácido caliente frío sabroso
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        sencillo evidente vago eterno fugaz
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        verde frondoso fragante marchito
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        cálido frío dolorido rígido
      '''),
    ),
  ],
  manners: words(r'''
      en_silencio despacio rápidamente suavemente de_repente apenas otra_vez juntos a_solas
      todavía brevemente firmemente audazmente con_cuidado ansiosamente de_nuevo
    '''),
  times: words(r'''
      al_amanecer por_la_mañana al_mediodía por_la_tarde por_la_noche hoy ayer mañana
      en_primavera en_verano en_otoño en_invierno los_fines_de_semana hace_poco a_veces cada_día
      al_anochecer
    '''),
  // Written with the comma the ones that need one take.
  connectives: words(r'y_luego pero entonces además, sin_embargo, después por_fin mientras_tanto,'),
  interjections: words(r'ay, oh, vaya, caramba, madre_mía, mira, desde_luego,'),
  // Spanish carries its subject in the verb ending, so a second sentence about
  // Money only, for the reason English has: a counted phrase would need a plural
  // noun, and most of these pools are not countable at all.
  numeral: const SentenceNumeral(
    order: NumeralOrder.before,
    counters: <NounClass, String>{},
    count: LengthRange(2, 12),
    currency: 'euros',
    amounts: <int>[100, 500, 1000, 5000, 12000, 25000, 50000, 100000],
    group: '.',
    gap: ' ',
  ),
  // the same thing writes no pronoun at all.
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>[''],
  },
  frames: const <SentenceFrame>[
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
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.place, head: 'en', modifiable: true),
    ], 14),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: 'es'),
    ], 12),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.manner),
    ], 10),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 8),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
      SentencePart(SentenceSlot.place, head: 'en', modifiable: true),
    ], 7),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.place, head: 'en', modifiable: true),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
      SentencePart(SentenceSlot.manner),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.money),
    ], 6),
  ],
);
