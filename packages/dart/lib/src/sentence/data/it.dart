// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for it.
final SentenceLanguageData it = SentenceLanguageData(
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
    SentenceQuote.single: <String>['“', '”'],
  },
  // The definite article, which Italian picks by gender and by the sound the
  // noun opens on: `l'` before a vowel, `lo` before an s plus a consonant, and
  // `il` for everything else. The elided form carries its own boundary.
  articles: const <WordGender, List<List<String>>>{
    WordGender.m: <List<String>>[
      <String>['a', 'l\''],
      <String>['e', 'l\''],
      <String>['i', 'l\''],
      <String>['o', 'l\''],
      <String>['u', 'l\''],
      <String>['gn', 'lo'],
      <String>['pn', 'lo'],
      <String>['ps', 'lo'],
      <String>['x', 'lo'],
      <String>['y', 'lo'],
      <String>['z', 'lo'],
      <String>['sb', 'lo'],
      <String>['sc', 'lo'],
      <String>['sd', 'lo'],
      <String>['sf', 'lo'],
      <String>['sg', 'lo'],
      <String>['sl', 'lo'],
      <String>['sm', 'lo'],
      <String>['sn', 'lo'],
      <String>['sp', 'lo'],
      <String>['sq', 'lo'],
      <String>['sr', 'lo'],
      <String>['st', 'lo'],
      <String>['sv', 'lo'],
      <String>['', 'il'],
    ],
    WordGender.f: <List<String>>[
      <String>['a', 'l\''],
      <String>['e', 'l\''],
      <String>['i', 'l\''],
      <String>['o', 'l\''],
      <String>['u', 'l\''],
      <String>['', 'la'],
    ],
  },
  predicateAgrees: true,
  verbs: <VerbGroup>[
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        corre cammina salta nuota vola striscia torna parte si_ferma riposa dorme ride piange
        canta balla si_nasconde aspetta si_alza si_siede rotola vaga passa si_avvicina ascolta
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      words: words(r'''
        mangia beve mastica assaggia cuoce scalda
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        guarda cerca raccoglie porta tocca custodisce sceglie sposta raduna
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        costruisce ripara pulisce vende compra dipinge
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        ricorda dimentica immagina conta
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        brilla scorre si_oscura si_schiarisce si_approfondisce si_calma
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        oscilla luccica cade rotola si_inclina invecchia
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        viaggia si_ferma passa torna parte scivola
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        si_diffonde svanisce rimane fluttua cresce
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        cresce appassisce fiorisce oscilla germoglia
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        trema si_muove si_intorpidisce guarisce
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        matura si_raffredda bolle si_scioglie si_guasta
      '''),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        grande piccolo veloce lento silenzioso rumoroso coraggioso pigro affamato assonnato
        feroce mite arguto sveglio
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
        bello strano nuovo comune raro
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        ampio stretto tranquillo profondo scuro chiaro lontano ripido
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        duro leggero pesante vecchio liscio trasparente robusto
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        dolce salato piccante aspro caldo freddo saporito
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        semplice evidente vago eterno fugace
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        verde rigoglioso profumato appassito
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        caldo freddo dolente rigido
      '''),
    ),
  ],
  manners: words(r'''
      in_silenzio lentamente rapidamente dolcemente improvvisamente appena di_nuovo insieme
      da_solo ancora brevemente costantemente audacemente con_cura avidamente
    '''),
  times: words(r'''
      all'alba al_mattino a_mezzogiorno di_sera di_notte oggi ieri domani in_primavera in_estate
      in_autunno in_inverno nel_fine_settimana poco_fa a_volte ogni_giorno al_tramonto
    '''),
  connectives: words(r'e_poi ma allora inoltre, tuttavia, dopo infine intanto,'),
  interjections: words(r'oh, ah, ehi, caspita, mamma_mia, guarda, davvero,'),
  // Pro-drop, the same as Spanish: `esso` exists and nobody writes it.
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
      SentencePart(SentenceSlot.place, head: 'in', modifiable: true, bare: true),
    ], 14),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: 'è'),
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
      SentencePart(SentenceSlot.place, head: 'in', modifiable: true, bare: true),
    ], 7),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.place, head: 'in', modifiable: true, bare: true),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
      SentencePart(SentenceSlot.manner),
    ], 5),
  ],
);
