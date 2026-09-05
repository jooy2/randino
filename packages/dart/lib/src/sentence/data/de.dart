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
  // The indefinite article, and it is what makes the modifiers come out right:
  // after `ein` a German adjective takes the same endings it takes with no
  // article at all — `ein blauer Wal`, `eine blaue Katze`, `ein blaues Haus` —
  // which is exactly what `word/data`'s agreement already writes.
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
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        läuft geht springt schwimmt fliegt kriecht ruht schläft lacht weint singt tanzt wartet
        steht sitzt rollt wandert lauscht zögert eilt
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        leuchtet fließt dunkelt erhellt vertieft verstummt
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        schwankt glänzt fällt rollt neigt altert
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        fährt hält rollt wendet gleitet
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        wächst verschwindet bleibt schwebt vertieft
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        wächst welkt blüht schwankt sprießt
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        zittert bebt erstarrt heilt
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        reift kühlt kocht schmilzt verdirbt
      '''),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        groß klein schnell langsam still laut mutig faul müde hungrig sanft klug wild
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
        schön fremd neu häufig selten
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        weit eng ruhig tief dunkel hell fern steil
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        hart leicht schwer alt glatt klar stabil
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        süß salzig scharf sauer heiß kalt herzhaft
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        einfach deutlich vage ewig flüchtig
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        grün üppig duftend welk
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        warm kalt wund steif
      '''),
    ),
  ],
  manners: words(r'''
      leise langsam schnell sanft plötzlich kaum wieder gemeinsam allein noch kurz stetig kühn
      sorgsam eifrig
    '''),
  times: words(r'''
      bei_Tagesanbruch am_Morgen am_Mittag am_Abend in_der_Nacht heute gestern morgen
      im_Frühling im_Sommer im_Herbst im_Winter am_Wochenende gerade_eben manchmal jeden_Tag
      in_der_Dämmerung
    '''),
  // Only the coordinating ones. German puts its finite verb second and counts
  // whatever opens the clause towards that, so `dann` or `danach` in front would
  // need the verb and the subject the other way round — a shape the frames write,
  // not something a connective can bolt on. `und`, `aber`, `doch` and `denn` sit
  // outside the clause and leave the order alone.
  connectives: words(r'und aber doch denn'),
  interjections: words(r'oh, ach, na, mensch, oje, sieh_an, wahrhaftig,'),
  pronouns: <WordGender, WordPool>{
    WordGender.m: words(r'er'),
    WordGender.f: words(r'sie'),
    WordGender.n: words(r'es'),
  },
  // German declares the fewest shapes here, and both reasons are its cases. An
  // object would be accusative and a place dative, and each changes the article
  // and the modifier ending together. What is left is the nominative, and the
  // rule German never breaks: the verb stands second, so a shape that opens on a
  // time puts the subject behind it.
  frames: const <SentenceFrame>[
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
      SentencePart(SentenceSlot.state, head: 'ist'),
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
    // German asks by moving the finite verb to the front, which is the same rule
    // that keeps it second in a statement — the question is what happens when
    // nothing stands in the first position at all.
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
        SentencePart(SentenceSlot.subject, head: 'ist', modifiable: true),
        SentencePart(SentenceSlot.state),
      ],
      18,
      mood: SentenceMood.question,
    ),
  ],
);
