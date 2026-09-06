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
  articles: const <WordGender, List<List<String>>>{
    WordGender.m: <List<String>>[
      <String>['a', "l'"],
      <String>['e', "l'"],
      <String>['i', "l'"],
      <String>['o', "l'"],
      <String>['u', "l'"],
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
      <String>['a', "l'"],
      <String>['e', "l'"],
      <String>['i', "l'"],
      <String>['o', "l'"],
      <String>['u', "l'"],
      <String>['', 'la'],
    ],
  },
  predicateAgrees: true,
  verbs: <VerbGroup>[
    VerbGroup(
      field: VerbField.rise,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'si_sveglia si_alza si_desta'),
      past: PredicateTense(words: words(r'si_svegliò si_alzò si_destò')),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'va corre cammina si_dirige sale scende'),
      past: PredicateTense(words: words(r'andò corse camminò si_diresse salì scese')),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'parte se_ne_va esce'),
      past: PredicateTense(words: words(r'partì se_ne_andò uscì')),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'torna arriva rientra giunge'),
      past: PredicateTense(words: words(r'tornò arrivò rientrò giunse')),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'ritorna rincasa riappare'),
      past: PredicateTense(words: words(r'ritornò rincasò riapparve')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'corre cammina salta nuota vola striscia vaga passa passeggia gironzola'),
      past: PredicateTense(
        words: words(r'corse camminò saltò nuotò volò strisciò vagò passò passeggiò gironzolò'),
      ),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'aspetta si_nasconde si_guarda_intorno esita si_ferma attende'),
      past: PredicateTense(
        words: words(r'aspettò si_nascose si_guardò_intorno esitò si_fermò attese'),
      ),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'riposa si_siede si_sdraia si_appoggia si_rannicchia si_riposa'),
      past: PredicateTense(
        words: words(r'riposò si_sedette si_sdraiò si_appoggiò si_rannicchiò si_riposò'),
      ),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'dorme si_addormenta sonnecchia si_assopisce'),
      past: PredicateTense(words: words(r'dormì si_addormentò sonnecchiò si_assopì')),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'ride piange sbadiglia sospira sorride canticchia borbotta grida'),
      past: PredicateTense(
        words: words(r'rise pianse sbadigliò sospirò sorrise canticchiò borbottò gridò'),
      ),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'balla canta rotola gioca saltella scherza'),
      past: PredicateTense(words: words(r'ballò cantò rotolò giocò saltellò scherzò')),
    ),
    VerbGroup(
      field: VerbField.think,
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'ricorda dimentica immagina conta rievoca rimpiange'),
      past: PredicateTense(words: words(r'ricordò dimenticò immaginò contò rievocò rimpianse')),
    ),
    VerbGroup(
      field: VerbField.look,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'guarda osserva contempla esamina tocca accarezza'),
      past: PredicateTense(words: words(r'guardò osservò contemplò esaminò toccò accarezzò')),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'cerca rovista fruga esplora'),
      past: PredicateTense(words: words(r'cercò rovistò frugò esplorò')),
    ),
    VerbGroup(
      field: VerbField.find,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'trova scopre scorge raccoglie'),
      past: PredicateTense(words: words(r'trovò scoprì scorse raccolse')),
    ),
    VerbGroup(
      field: VerbField.take,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'sceglie prende afferra piglia tira_fuori riceve'),
      past: PredicateTense(words: words(r'scelse prese afferrò pigliò tirò_fuori ricevette')),
    ),
    VerbGroup(
      field: VerbField.carry,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'porta reca trasporta trascina'),
      past: PredicateTense(words: words(r'portò recò trasportò trascinò')),
    ),
    VerbGroup(
      field: VerbField.hide,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'nasconde ripone custodisce sotterra conserva'),
      past: PredicateTense(words: words(r'nascose ripose custodì sotterrò conservò')),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'costruisce fabbrica intaglia dipinge tesse monta'),
      past: PredicateTense(words: words(r'costruì fabbricò intagliò dipinse tessé montò')),
    ),
    VerbGroup(
      field: VerbField.tend,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'ripara pulisce lucida sistema riordina aggiusta'),
      past: PredicateTense(words: words(r'riparò pulì lucidò sistemò riordinò aggiustò')),
    ),
    VerbGroup(
      field: VerbField.sell,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'vende consegna cede offre'),
      past: PredicateTense(words: words(r'vendette consegnò cedette offrì')),
    ),
    VerbGroup(
      field: VerbField.buy,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle, NounClass.edible],
      words: words(r'compra acquista ordina procura'),
      past: PredicateTense(words: words(r'comprò acquistò ordinò procurò')),
    ),
    VerbGroup(
      field: VerbField.cook,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'cuoce scalda cucina taglia arrostisce serve'),
      past: PredicateTense(words: words(r'cosse scaldò cucinò tagliò arrostì servì')),
    ),
    VerbGroup(
      field: VerbField.eat,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'mangia mastica assaggia rosicchia divora'),
      past: PredicateTense(words: words(r'mangiò masticò assaggiò rosicchiò divorò')),
    ),
    VerbGroup(
      field: VerbField.drink,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'beve sorseggia tracanna gusta'),
      past: PredicateTense(words: words(r'bevve sorseggiò tracannò gustò')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'si_calma si_oscura si_illumina si_riempie si_svuota si_anima'),
      past: PredicateTense(
        words: words(r'si_calmò si_oscurò si_illuminò si_riempì si_svuotò si_animò'),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'brilla scorre si_approfondisce inizia finisce continua passa'),
      past: PredicateTense(words: words(r'brillò scorse si_approfondì iniziò finì continuò passò')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'oscilla luccica cade rotola si_inclina invecchia'),
      past: PredicateTense(words: words(r'oscillò luccicò cadde rotolò si_inclinò invecchiò')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'viaggia si_ferma passa torna parte scivola'),
      past: PredicateTense(words: words(r'viaggiò si_fermò passò tornò partì scivolò')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'si_diffonde svanisce rimane fluttua cresce'),
      past: PredicateTense(words: words(r'si_diffuse svanì rimase fluttuò crebbe')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'cresce appassisce fiorisce oscilla germoglia'),
      past: PredicateTense(words: words(r'crebbe appassì fiorì oscillò germogliò')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'trema si_muove si_intorpidisce guarisce'),
      past: PredicateTense(words: words(r'tremò si_mosse si_intorpidì guarì')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'matura si_raffredda bolle si_scioglie si_guasta'),
      past: PredicateTense(words: words(r'maturò si_raffreddò bollì si_sciolse si_guastò')),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        grande piccolo veloce lento silenzioso rumoroso coraggioso pigro feroce mite arguto sveglio
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'affamato famelico'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'sazio pieno'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'stanco assonnato esausto'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'riposato fresco vispo'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'felice contento allegro sereno'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'annoiato curioso inquieto agitato'),
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
      words: words(r'bello strano nuovo comune raro'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'ampio stretto tranquillo profondo scuro chiaro lontano ripido'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'duro leggero pesante vecchio liscio trasparente robusto'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'dolce salato piccante aspro caldo freddo saporito'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'semplice evidente vago eterno fugace'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'verde rigoglioso profumato appassito'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'caldo freddo dolente rigido'),
    ),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        coraggioso vivace gentile occupato pigro timido sveglio giovane vecchio piccolo grande
        silenzioso allegro paziente agile curioso
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'giovane gentile severo serio occupato sincero'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'veloce feroce mansueto paffuto piccolino'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        dolce piccante tiepido fresco croccante saporito fragrante caldo salato morbido maturo
        gustoso
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'dolce tiepido freddo fresco caldo fragrante forte amaro'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        vecchio nuovo piccolo grande leggero pesante lucente liscio trasparente duro bello prezioso
        antico
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'veloce lento robusto'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        tranquillo ampio scuro luminoso strano vecchio accogliente isolato affollato silenzioso
        remoto lontano vicino vuoto solitario soleggiato
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'verde rigoglioso profumato giovane appassito alto piccolo tenero fresco'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'vago vecchio nuovo strano chiaro prezioso piccolo curioso'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'lungo breve tranquillo soleggiato nuvoloso rumoroso improvviso'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'piccolo freddo caldo esile robusto'),
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
      words: words(r'bello misterioso strano nuovo'),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        in_silenzio lentamente rapidamente dolcemente improvvisamente appena da_solo brevemente
        costantemente audacemente con_cura avidamente tranquillamente allegramente fortemente
        pazientemente leggermente serenamente vivacemente goffamente con_calma
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
        in_silenzio lentamente dolcemente improvvisamente appena di_nuovo ancora piano_piano
        debolmente a_poco_a_poco gradualmente
      '''),
    ),
  ],
  times: SentenceTimes(
    day: words(r"""
      all'alba di_prima_mattina al_mattino a_mezzogiorno nel_pomeriggio al_tramonto di_sera di_notte
      a_notte_fonda a_mezzanotte
    """),
    any: words(r'''
      in_primavera in_estate in_autunno in_inverno nel_fine_settimana nei_giorni_festivi
      tutto_il_giorno
    '''),
    past: words(r'ieri la_settimana_scorsa tempo_fa quel_giorno quella_notte una_volta'),
    present: words(r'oggi poco_fa domani la_settimana_prossima'),
    habitual: words(r'di_questi_tempi a_volte ogni_giorno ogni_notte'),
  ),
  homes: words(r'casa'),
  join: const SentenceJoin(word: 'e'),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'e_poi inoltre,'),
    ConnectiveKind.temporal: words(r'dopo infine intanto, più_tardi alla_fine poco_dopo'),
    ConnectiveKind.contrastive: words(r'ma tuttavia, eppure invece,'),
    ConnectiveKind.causal: words(r'allora perciò così'),
  },
  interjections: words(r'''
    oh, ah, ehi, caspita, mamma_mia, guarda, davvero, ohi, accidenti, cavolo, santo_cielo, dai,
  '''),
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>[''],
  },
  numeral: const SentenceNumeral(
    order: NumeralOrder.before,
    counters: <NounClass, String>{},
    count: LengthRange(2, 12),
    currency: 'euro',
    amounts: <int>[100, 500, 1000, 5000, 12000, 25000, 50000, 100000],
    group: '.',
    gap: ' ',
  ),
  calendar: SentenceCalendar(
    date: 'D MMMM Y',
    months: words(r'''
      gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre dicembre
    '''),
    clock: 'h:mm',
    years: const LengthRange(2020, 2030),
    copula: StateGroup(
      subject: const <NounClass>[NounClass.event],
      words: <String>['è'],
      past: PredicateTense(words: <String>['fu']),
    ),
  ),
  frames: const <SentenceFrame>[
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.date, head: 'il', tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.clock, head: 'alle', tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.date, head: 'il', copula: CopulaSide.head),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.clock, head: 'alle', copula: CopulaSide.head),
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
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.place, head: 'in', modifiable: true, bare: true),
    ], 14),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'verso', modifiable: true),
      ],
      8,
      fields: <VerbField>[VerbField.go],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'a', modifiable: true, bare: true),
      ],
      8,
      fields: <VerbField>[VerbField.arrive],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.time, tail: ','),
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'verso', modifiable: true),
      ],
      4,
      fields: <VerbField>[VerbField.go],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'a', modifiable: true, bare: true),
        SentencePart(SentenceSlot.manner),
      ],
      3,
      fields: <VerbField>[VerbField.arrive],
    ),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: 'è', pastHead: 'era'),
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
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.money),
    ], 6),
  ],
);
