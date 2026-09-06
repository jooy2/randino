// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for de.
final SentenceLanguageData de = SentenceLanguageData(
  space: ' ',
  capitalize: true,
  terminators: const <SentenceType, String>{
    SentenceType.statement: '.',
    SentenceType.question: '?',
    SentenceType.exclamation: '!',
    SentenceType.trailing: '…',
  },
  quotes: const <SentenceQuote, List<String>>{
    SentenceQuote.double: <String>['„', '“'],
    SentenceQuote.single: <String>['‚', '‘'],
  },
  articles: const <WordGender, List<List<String>>>{
    WordGender.m: <List<String>>[
      <String>['', 'ein'],
    ],
    WordGender.f: <List<String>>[
      <String>['', 'eine'],
    ],
    WordGender.n: <List<String>>[
      <String>['', 'ein'],
    ],
  },
  verbs: <VerbGroup>[
    VerbGroup(
      field: VerbField.rise,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'erwacht erhebt_sich regt_sich'),
      past: PredicateTense(words: words(r'erwachte erhob_sich regte_sich')),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'geht wandert eilt reist'),
      past: PredicateTense(words: words(r'ging wanderte eilte reiste')),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'kommt erscheint'),
      past: PredicateTense(words: words(r'kam erschien')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      words: words(r'läuft springt bummelt trabt spaziert'),
      past: PredicateTense(words: words(r'lief sprang bummelte trabte spazierte')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'streift'),
      past: PredicateTense(words: words(r'streifte')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.swimmer],
      words: words(r'schwimmt'),
      past: PredicateTense(words: words(r'schwamm')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature],
      subjectTraits: const <NounTrait>[NounTrait.flier],
      words: words(r'fliegt'),
      past: PredicateTense(words: words(r'flog')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.crawler],
      words: words(r'kriecht'),
      past: PredicateTense(words: words(r'kroch')),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'wartet zögert verharrt lauscht lauert'),
      past: PredicateTense(words: words(r'wartete zögerte verharrte lauschte lauerte')),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'ruht sitzt liegt rastet lehnt'),
      past: PredicateTense(words: words(r'ruhte saß lag rastete lehnte')),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'schläft schlummert dämmert döst'),
      past: PredicateTense(words: words(r'schlief schlummerte dämmerte döste')),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'lacht weint gähnt seufzt lächelt summt murmelt ruft'),
      past: PredicateTense(
        words: words(r'lachte weinte gähnte seufzte lächelte summte murmelte rief'),
      ),
    ),
    VerbGroup(
      field: VerbField.talk,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'plaudert redet schwatzt'),
      past: PredicateTense(words: words(r'plauderte redete schwatzte')),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'tanzt singt tollt spielt hüpft rollt'),
      past: PredicateTense(words: words(r'tanzte sang tollte spielte hüpfte rollte')),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'sucht stöbert kramt'),
      past: PredicateTense(words: words(r'suchte stöberte kramte')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'verstummt dunkelt erhellt_sich leert_sich füllt_sich belebt_sich'),
      past: PredicateTense(
        words: words(r'verstummte dunkelte erhellte_sich leerte_sich füllte_sich belebte_sich'),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'leuchtet fließt vertieft_sich beginnt endet dauert vergeht'),
      past: PredicateTense(
        words: words(r'leuchtete floss vertiefte_sich begann endete dauerte verging'),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'schwankt glänzt fällt rollt neigt_sich altert'),
      past: PredicateTense(words: words(r'schwankte glänzte fiel rollte neigte_sich alterte')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'fährt hält rollt wendet gleitet'),
      past: PredicateTense(words: words(r'fuhr hielt rollte wendete glitt')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'wächst verschwindet bleibt schwebt vertieft_sich'),
      past: PredicateTense(words: words(r'wuchs verschwand blieb schwebte vertiefte_sich')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'wächst welkt blüht schwankt sprießt'),
      past: PredicateTense(words: words(r'wuchs welkte blühte schwankte spross')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'zittert bebt erstarrt heilt'),
      past: PredicateTense(words: words(r'zitterte bebte erstarrte heilte')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'reift kühlt kocht schmilzt verdirbt'),
      past: PredicateTense(words: words(r'reifte kühlte kochte schmolz verdarb')),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'groß klein schnell langsam still laut mutig faul sanft klug wild'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'hungrig ausgehungert'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'satt gesättigt'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'müde schläfrig erschöpft'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'ausgeruht frisch munter'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'froh zufrieden glücklich heiter'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'gelangweilt neugierig unruhig rastlos'),
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
      words: words(r'schön fremd neu häufig selten'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'weit eng ruhig tief dunkel hell fern steil'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'hart leicht schwer alt glatt klar stabil'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'süß salzig scharf sauer heiß kalt herzhaft'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'einfach deutlich vage ewig flüchtig'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'grün üppig duftend welk'),
    ),
    StateGroup(subject: const <NounClass>[NounClass.body], words: words(r'warm kalt wund steif')),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        mutig lebhaft sanft fleißig faul schüchtern klug jung alt klein groß still fröhlich geduldig
        flink neugierig
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'jung freundlich streng ernst beschäftigt aufrichtig'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'flink wild zahm rundlich winzig'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        süß scharf warm frisch knusprig würzig duftend heiß salzig weich reif lecker
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'süß warm kalt kühl heiß duftend frisch stark'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        alt neu klein groß leicht schwer glänzend glatt klar stabil hübsch kostbar uralt
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'schnell langsam robust'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        still weit dunkel hell fremd alt gemütlich abgelegen belebt leise fern nah leer einsam
        sonnig
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'grün üppig duftend jung welk klein zart frisch'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'vage alt neu fremd klar kostbar klein seltsam'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'lang kurz still sonnig trüb laut plötzlich'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'klein kalt warm schlank kräftig'),
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
      words: words(r'schön geheimnisvoll fremd neu'),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        leise langsam schnell sanft plötzlich kaum allein kurz kühn sorgsam eifrig ruhig heftig
        geduldig leicht fröhlich munter schwerfällig gelassen emsig zügig vergnügt
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
        leise langsam sanft plötzlich kaum wieder noch stetig allmählich nach_und_nach schwach
        weiter
      '''),
    ),
  ],
  times: SentenceTimes(
    day: words(r'''
      bei_Tagesanbruch am_frühen_Morgen am_Morgen am_Vormittag am_Mittag am_Nachmittag
      in_der_Dämmerung am_Abend in_der_Nacht spät_in_der_Nacht um_Mitternacht
    '''),
    any: words(r'''
      im_Frühling im_Sommer im_Herbst im_Winter am_Wochenende an_Feiertagen den_ganzen_Tag
    '''),
    past: words(r'gestern letzte_Woche vor_langer_Zeit einst an_jenem_Tag in_jener_Nacht'),
    present: words(r'heute gerade_eben morgen nächste_Woche'),
    habitual: words(r'heutzutage manchmal jeden_Tag jede_Nacht'),
  ),
  homes: words(r'Haus'),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'und'),
    ConnectiveKind.contrastive: words(r'aber doch'),
    ConnectiveKind.causal: words(r'denn'),
  },
  traits: <NounTrait, WordPool>{
    NounTrait.flier: words(r'''
      Vogel Schwalbe Spatz Rabe Falke Adler Pfau Papagei Eule Taube Kranich Schwan Ente Gans Biene
      Libelle Zikade Fliege Mücke Fledermaus Reiher Pelikan Drache Phönix Fee Greif Pegasus Engel
      Walküre
    '''),
    NounTrait.swimmer: words(r'''
      Krokodil Schildkröte Frosch Kröte Fisch Wal Delfin Hai Krake Tintenfisch Garnele Krabbe
      Walross Robbe Pinguin Meerjungfrau Najade
    '''),
    NounTrait.crawler: words(r'''
      Krokodil Schlange Eidechse Schildkröte Schnecke Ameise Spinne Wurm Krabbe Basilisk
    '''),
  },
  interjections: words(r'''
    oh, ach, na, mensch, oje, sieh_an, wahrhaftig, hui, herrje, du_meine_Güte, nanu,
  '''),
  pronouns: const <WordGender, WordPool>{
    WordGender.m: <String>['er'],
    WordGender.f: <String>['sie'],
    WordGender.n: <String>['es'],
  },
  calendar: SentenceCalendar(
    date: 'D. MMMM Y',
    months: words(r'''
      Januar Februar März April Mai Juni Juli August September Oktober November Dezember
    '''),
    clock: 'h:mm Uhr',
    years: const LengthRange(2020, 2030),
    copula: StateGroup(
      subject: const <NounClass>[NounClass.event],
      words: <String>['ist'],
      past: PredicateTense(words: <String>['war']),
    ),
  ),
  frames: const <SentenceFrame>[
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.date, head: 'am'),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.subject, modifiable: true),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.clock, head: 'um'),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.subject, modifiable: true),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.date, head: 'am', copula: CopulaSide.head),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.clock, head: 'um', copula: CopulaSide.head),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 26),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.manner),
    ], 22),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: 'ist', pastHead: 'war'),
    ], 20),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.subject, modifiable: true),
    ], 18),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.manner),
    ], 14),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.subject, modifiable: true),
    ], 16),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.time),
    ], 10),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.subject, modifiable: true),
      ],
      26,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.manner),
      ],
      20,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'ist', pastHead: 'war', modifiable: true),
        SentencePart(SentenceSlot.state),
      ],
      18,
      mood: SentenceMood.question,
    ),
  ],
);
