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
  openers: const <SentenceType, String>{SentenceType.question: '¿', SentenceType.exclamation: '¡'},
  quotes: const <SentenceQuote, List<String>>{
    SentenceQuote.double: <String>['«', '»'],
    SentenceQuote.single: <String>['“', '”'],
  },
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
      field: VerbField.rise,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'se_despierta se_levanta se_incorpora'),
      past: PredicateTense(words: words(r'se_despertó se_levantó se_incorporó')),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'va corre camina se_dirige sube baja'),
      past: PredicateTense(words: words(r'fue corrió caminó se_dirigió subió bajó')),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'parte se_marcha sale'),
      past: PredicateTense(words: words(r'partió se_marchó salió')),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'llega vuelve regresa'),
      past: PredicateTense(words: words(r'llegó volvió regresó')),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'retorna vuelve_a_casa regresa_a_casa'),
      past: PredicateTense(words: words(r'retornó volvió_a_casa regresó_a_casa')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'corre camina salta nada vuela repta vaga pasa pasea deambula'),
      past: PredicateTense(
        words: words(r'corrió caminó saltó nadó voló reptó vagó pasó paseó deambuló'),
      ),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'espera se_esconde mira_alrededor vacila se_detiene aguarda'),
      past: PredicateTense(
        words: words(r'esperó se_escondió miró_alrededor vaciló se_detuvo aguardó'),
      ),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'descansa se_sienta se_acuesta se_apoya se_acurruca reposa'),
      past: PredicateTense(
        words: words(r'descansó se_sentó se_acostó se_apoyó se_acurrucó reposó'),
      ),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'duerme se_adormece se_duerme dormita'),
      past: PredicateTense(words: words(r'durmió se_adormeció se_durmió dormitó')),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'ríe llora bosteza suspira sonríe tararea murmura grita'),
      past: PredicateTense(words: words(r'rió lloró bostezó suspiró sonrió tarareó murmuró gritó')),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'baila canta rueda juega brinca retoza'),
      past: PredicateTense(words: words(r'bailó cantó rodó jugó brincó retozó')),
    ),
    VerbGroup(
      field: VerbField.think,
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'recuerda olvida imagina cuenta evoca añora'),
      past: PredicateTense(words: words(r'recordó olvidó imaginó contó evocó añoró')),
    ),
    VerbGroup(
      field: VerbField.look,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'mira observa contempla examina toca acaricia'),
      past: PredicateTense(words: words(r'miró observó contempló examinó tocó acarició')),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'busca rebusca husmea explora'),
      past: PredicateTense(words: words(r'buscó rebuscó husmeó exploró')),
    ),
    VerbGroup(
      field: VerbField.find,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'encuentra descubre halla recoge'),
      past: PredicateTense(words: words(r'encontró descubrió halló recogió')),
    ),
    VerbGroup(
      field: VerbField.take,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'elige toma agarra coge saca recibe'),
      past: PredicateTense(words: words(r'eligió tomó agarró cogió sacó recibió')),
    ),
    VerbGroup(
      field: VerbField.carry,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'lleva trae carga acarrea'),
      past: PredicateTense(words: words(r'llevó trajo cargó acarreó')),
    ),
    VerbGroup(
      field: VerbField.hide,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'esconde guarda oculta entierra conserva'),
      past: PredicateTense(words: words(r'escondió guardó ocultó enterró conservó')),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'hace construye talla pinta teje arma'),
      past: PredicateTense(words: words(r'hizo construyó talló pintó tejió armó')),
    ),
    VerbGroup(
      field: VerbField.tend,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'repara limpia pule arregla ordena ajusta'),
      past: PredicateTense(words: words(r'reparó limpió pulió arregló ordenó ajustó')),
    ),
    VerbGroup(
      field: VerbField.sell,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'vende entrega cede ofrece'),
      past: PredicateTense(words: words(r'vendió entregó cedió ofreció')),
    ),
    VerbGroup(
      field: VerbField.buy,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle, NounClass.edible],
      words: words(r'compra adquiere encarga consigue'),
      past: PredicateTense(words: words(r'compró adquirió encargó consiguió')),
    ),
    VerbGroup(
      field: VerbField.cook,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'hornea calienta cocina corta asa sirve'),
      past: PredicateTense(words: words(r'horneó calentó cocinó cortó asó sirvió')),
    ),
    VerbGroup(
      field: VerbField.eat,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'come mastica prueba mordisquea devora'),
      past: PredicateTense(words: words(r'comió masticó probó mordisqueó devoró')),
    ),
    VerbGroup(
      field: VerbField.drink,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'bebe sorbe apura saborea'),
      past: PredicateTense(words: words(r'bebió sorbió apuró saboreó')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'se_calma oscurece se_ilumina se_llena se_vacía se_anima'),
      past: PredicateTense(
        words: words(r'se_calmó oscureció se_iluminó se_llenó se_vació se_animó'),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'brilla fluye se_ahonda empieza termina continúa pasa'),
      past: PredicateTense(words: words(r'brilló fluyó se_ahondó empezó terminó continuó pasó')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'se_mece reluce cae rueda se_inclina envejece'),
      past: PredicateTense(words: words(r'se_meció relució cayó rodó se_inclinó envejeció')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'circula se_detiene pasa regresa parte resbala'),
      past: PredicateTense(words: words(r'circuló se_detuvo pasó regresó partió resbaló')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'se_extiende desaparece permanece flota se_ahonda'),
      past: PredicateTense(words: words(r'se_extendió desapareció permaneció flotó se_ahondó')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'crece se_marchita florece se_mece brota'),
      past: PredicateTense(words: words(r'creció se_marchitó floreció se_meció brotó')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'tiembla se_mueve se_entumece sana'),
      past: PredicateTense(words: words(r'tembló se_movió se_entumeció sanó')),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'madura se_enfría hierve se_derrite se_estropea'),
      past: PredicateTense(words: words(r'maduró se_enfrió hirvió se_derritió se_estropeó')),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        grande pequeño rápido lento silencioso ruidoso valiente perezoso ocupado fiero manso listo
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      head: 'está',
      pastHead: 'estaba',
      words: words(r'hambriento famélico'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      head: 'está',
      pastHead: 'estaba',
      words: words(r'satisfecho lleno'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      head: 'está',
      pastHead: 'estaba',
      words: words(r'cansado soñoliento agotado'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      head: 'está',
      pastHead: 'estaba',
      words: words(r'descansado fresco animado'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      head: 'está',
      pastHead: 'estaba',
      words: words(r'feliz contento alegre tranquilo'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      head: 'está',
      pastHead: 'estaba',
      words: words(r'aburrido curioso inquieto nervioso'),
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
      words: words(r'hermoso extraño nuevo común raro'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'ancho estrecho tranquilo profundo oscuro claro lejano empinado'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'duro ligero pesado viejo liso transparente robusto'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'dulce salado picante ácido caliente frío sabroso'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'sencillo evidente vago eterno fugaz'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'verde frondoso fragante marchito'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'cálido frío dolorido rígido'),
    ),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        valiente animado amable ocupado perezoso tímido listo joven viejo pequeño grande silencioso
        alegre paciente ágil curioso
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'joven amable severo serio ocupado sincero'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'veloz feroz manso rechoncho pequeñito'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        dulce picante tibio fresco crujiente sabroso fragante caliente salado blando maduro rico
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'dulce tibio frío fresco caliente fragante espumoso fuerte'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        viejo nuevo pequeño grande ligero pesado brillante liso transparente duro bonito precioso
        antiguo
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'rápido lento robusto'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        tranquilo amplio oscuro luminoso extraño viejo acogedor apartado bullicioso silencioso
        remoto lejano cercano vacío solitario soleado
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'verde frondoso fragante joven marchito alto pequeño tierno fresco'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'vago viejo nuevo extraño claro precioso pequeño raro'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'largo breve tranquilo soleado nublado ruidoso repentino'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'pequeño frío cálido esbelto robusto'),
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
      words: words(r'hermoso misterioso extraño nuevo'),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        en_silencio despacio rápidamente suavemente de_repente apenas a_solas brevemente firmemente
        audazmente con_cuidado ansiosamente tranquilamente alegremente torpemente fuertemente
        pacientemente ligeramente serenamente vivamente con_calma
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
        en_silencio despacio suavemente de_repente apenas otra_vez todavía de_nuevo poco_a_poco
        lentamente débilmente aún gradualmente
      '''),
    ),
  ],
  times: SentenceTimes(
    day: words(r'''
      al_amanecer de_madrugada por_la_mañana a_mediodía al_mediodía por_la_tarde al_anochecer
      por_la_noche de_noche a_medianoche
    '''),
    any: words(r'''
      en_primavera en_verano en_otoño en_invierno los_fines_de_semana en_los_días_festivos
      todo_el_día
    '''),
    past: words(r'ayer la_semana_pasada hace_tiempo aquel_día aquella_noche una_vez'),
    present: words(r'''
      hoy estos_días hace_poco mañana la_semana_que_viene a_veces cada_día cada_noche
    '''),
  ),
  homes: words(r'casa cabaña'),
  join: const SentenceJoin(word: 'y'),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'y_luego además,'),
    ConnectiveKind.temporal: words(
      r'después por_fin mientras_tanto, más_tarde al_final poco_después',
    ),
    ConnectiveKind.contrastive: words(r'pero sin_embargo, aun_así en_cambio, no_obstante,'),
    ConnectiveKind.causal: words(r'entonces por_eso así_que'),
  },
  interjections: words(r'''
    ay, oh, vaya, caramba, madre_mía, mira, desde_luego, uy, anda, hombre, cielos, vamos,
  '''),
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>[''],
  },
  numeral: const SentenceNumeral(
    order: NumeralOrder.before,
    counters: <NounClass, String>{},
    count: LengthRange(2, 12),
    currency: 'euros',
    amounts: <int>[100, 500, 1000, 5000, 12000, 25000, 50000, 100000],
    group: '.',
    gap: ' ',
  ),
  calendar: SentenceCalendar(
    date: 'D de MMMM de Y',
    months: words(r'''
      enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre
    '''),
    clock: 'h:mm',
    years: const LengthRange(2020, 2030),
    copula: StateGroup(
      subject: const <NounClass>[NounClass.event],
      words: <String>['es'],
      past: PredicateTense(words: <String>['fue']),
    ),
  ),
  frames: const <SentenceFrame>[
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.date, head: 'el', tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.clock, head: 'a las', tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.date, head: 'el', copula: CopulaSide.head),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.clock, head: 'a las', copula: CopulaSide.head),
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
      SentencePart(SentenceSlot.place, head: 'en', modifiable: true),
    ], 14),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'hacia', modifiable: true),
      ],
      8,
      fields: <VerbField>[VerbField.go],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'hasta', modifiable: true),
      ],
      8,
      fields: <VerbField>[VerbField.arrive],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.time, tail: ','),
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'hacia', modifiable: true),
      ],
      4,
      fields: <VerbField>[VerbField.go],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'hasta', modifiable: true),
        SentencePart(SentenceSlot.manner),
      ],
      3,
      fields: <VerbField>[VerbField.arrive],
    ),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: 'es', pastHead: 'era'),
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
