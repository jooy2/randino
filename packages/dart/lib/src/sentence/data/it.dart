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
      words: words(r'''
        si_sveglia si_alza si_desta si_ridesta si_tira_su si_mette_seduto apre_gli_occhi
        si_stiracchia si_mette_in_piedi balza_in_piedi
      '''),
      past: PredicateTense(
        words: words(r'''
          si_svegliò si_alzò si_destò si_ridestò si_tirò_su si_mise_seduto aprì_gli_occhi
          si_stiracchiò si_mise_in_piedi balzò_in_piedi
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'''
        va si_dirige si_avvia si_avvicina avanza si_incammina si_muove viaggia si_affretta si_lancia
        procede si_sposta
      '''),
      past: PredicateTense(
        words: words(r'''
          andò si_diresse si_avviò si_avvicinò avanzò si_incamminò si_mosse viaggiò si_affrettò
          si_lanciò procedette si_spostò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      requires: SentenceSlot.destination,
      words: words(r'''
        corre cammina sale scende trotta passeggia salta zoppica si_arrampica marcia
      '''),
      past: PredicateTense(
        words: words(r'''
          corse camminò salì scese trottò passeggiò saltò zoppicò si_arrampicò marciò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        parte se_ne_va esce se_ne_esce si_allontana si_ritira si_mette_in_cammino
        si_mette_in_viaggio sgattaiola_via svanisce se_la_svigna si_avvia si_incammina
      '''),
      past: PredicateTense(
        words: words(r'''
          partì se_ne_andò uscì se_ne_uscì si_allontanò si_ritirò si_mise_in_cammino
          si_mise_in_viaggio sgattaiolò_via svanì se_la_svignò si_avviò si_incamminò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'''
        torna arriva rientra giunge viene si_avvicina avanza raggiunge si_sposta ritorna
      '''),
      past: PredicateTense(
        words: words(r'''
          tornò arrivò rientrò giunse venne si_avvicinò avanzò raggiunse si_spostò ritornò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        ritorna rincasa riappare arriva_a_casa compare ricompare si_presenta si_affaccia entra
        fa_ritorno torna_a_casa si_fa_vivo
      '''),
      past: PredicateTense(
        words: words(r'''
          ritornò rincasò riapparve arrivò_a_casa comparve ricomparve si_presentò si_affacciò entrò
          fece_ritorno tornò_a_casa si_fece_vivo
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      words: words(r'''
        corre cammina salta passeggia gironzola trotta corricchia saltella marcia zoppica
        si_arrampica fa_un_salto fa_due_passi cammina_in_punta_di_piedi avanza_a_grandi_passi
        scalpita zampetta sgambetta
      '''),
      past: PredicateTense(
        words: words(r'''
          corse camminò saltò passeggiò gironzolò trottò corricchiò saltellò marciò zoppicò
          si_arrampicò fece_un_salto fece_due_passi camminò_in_punta_di_piedi avanzò_a_grandi_passi
          scalpitò zampettò sgambettò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        vaga passa si_muove avanza indietreggia gira gira_in_tondo si_sposta scivola si_aggira ronza
        si_avvicina si_allontana attraversa sguscia_via
      '''),
      past: PredicateTense(
        words: words(r'''
          vagò passò si_mosse avanzò indietreggiò girò girò_in_tondo si_spostò scivolò si_aggirò
          ronzò si_avvicinò si_allontanò attraversò sgusciò_via
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.swimmer],
      words: words(r'nuota si_tuffa sguazza galleggia si_immerge riemerge nuota_in_tondo'),
      past: PredicateTense(
        words: words(r'nuotò si_tuffò sguazzò galleggiò si_immerse riemerse nuotò_in_tondo'),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature],
      subjectTraits: const <NounTrait>[NounTrait.flier],
      words: words(r'''
        vola decolla plana svolazza sbatte_le_ali si_alza_in_volo si_posa atterra si_libra sorvola
        spicca_il_volo plana_in_basso volteggia
      '''),
      past: PredicateTense(
        words: words(r'''
          volò decollò planò svolazzò sbatté_le_ali si_alzò_in_volo si_posò atterrò si_librò sorvolò
          spiccò_il_volo planò_in_basso volteggiò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.crawler],
      words: words(r'''
        striscia si_trascina serpeggia scivola si_attorciglia si_contorce gattona sguscia
        avanza_strisciando scava
      '''),
      past: PredicateTense(
        words: words(r'''
          strisciò si_trascinò serpeggiò scivolò si_attorcigliò si_contorse gattonò sgusciò
          avanzò_strisciando scavò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r"""
        aspetta si_nasconde si_guarda_intorno esita si_ferma attende ascolta tentenna dubita
        resta_fermo rimane_immobile si_acquatta spia fa_capolino dà_un'occhiata indugia bighellona
        ciondola si_blocca fa_una_pausa osserva_in_silenzio resta_in_attesa
      """),
      past: PredicateTense(
        words: words(r"""
          aspettò si_nascose si_guardò_intorno esitò si_fermò attese ascoltò tentennò dubitò
          restò_fermo rimase_immobile si_acquattò spiò fece_capolino diede_un'occhiata indugiò
          bighellonò ciondolò si_bloccò fece_una_pausa osservò_in_silenzio restò_in_attesa
        """),
      ),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r"""
        riposa si_siede si_sdraia si_appoggia si_rannicchia si_riposa si_stende si_distende
        si_rilassa si_inginocchia si_accovaccia si_stiracchia si_accascia riprende_fiato si_accomoda
        si_mette_comodo fa_una_sosta si_adagia si_riposa_un_po' si_abbandona
      """),
      past: PredicateTense(
        words: words(r"""
          riposò si_sedette si_sdraiò si_appoggiò si_rannicchiò si_riposò si_stese si_distese
          si_rilassò si_inginocchiò si_accovacciò si_stiracchiò si_accasciò riprese_fiato
          si_accomodò si_mise_comodo fece_una_sosta si_adagiò si_riposò_un_po' si_abbandonò
        """),
      ),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        dorme si_addormenta sonnecchia si_assopisce schiaccia_un_pisolino ciondola_il_capo
        crolla_dal_sonno russa sogna si_appisola chiude_gli_occhi dorme_profondamente
        cade_addormentato dorme_della_grossa
      '''),
      past: PredicateTense(
        words: words(r'''
          dormì si_addormentò sonnecchiò si_assopì schiacciò_un_pisolino ciondolò_il_capo
          crollò_dal_sonno russò sognò si_appisolò chiuse_gli_occhi dormì_profondamente
          cadde_addormentato dormì_della_grossa
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r"""
        ride piange sbadiglia sospira sorride canticchia borbotta grida ridacchia singhiozza geme
        brontola fischietta esclama esulta ansima si_stringe_nelle_spalle annuisce
        aggrotta_la_fronte starnutisce ha_il_singhiozzo applaude fa_l'occhiolino arrossisce
        scoppia_a_ridere piagnucola sbuffa strilla balbetta fa_una_smorfia scuote_la_testa
        saluta_con_la_mano mugugna
      """),
      past: PredicateTense(
        words: words(r"""
          rise pianse sbadigliò sospirò sorrise canticchiò borbottò gridò ridacchiò singhiozzò
          gemette brontolò fischiettò esclamò esultò ansimò si_strinse_nelle_spalle annuì
          aggrottò_la_fronte starnutì ebbe_il_singhiozzo applaudì fece_l'occhiolino arrossì
          scoppiò_a_ridere piagnucolò sbuffò strillò balbettò fece_una_smorfia scosse_la_testa
          salutò_con_la_mano mugugnò
        """),
      ),
    ),
    VerbGroup(
      field: VerbField.talk,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        chiacchiera parla conversa discorre spettegola ciarla sussurra bisbiglia dialoga
        si_intrattiene racconta_storie saluta scambia_due_parole parlotta confabula
      '''),
      past: PredicateTense(
        words: words(r'''
          chiacchierò parlò conversò discorse spettegolò ciarlò sussurrò bisbigliò dialogò
          si_intrattenne raccontò_storie salutò scambiò_due_parole parlottò confabulò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        balla canta rotola gioca saltella scherza salta fa_capriole gira fa_giravolte si_rotola
        gioca_a_nascondino fa_il_buffone si_diverte fa_piroette si_dondola ruzzola schiamazza
        fa_salti_di_gioia si_scatena
      '''),
      past: PredicateTense(
        words: words(r'''
          ballò cantò rotolò giocò saltellò scherzò saltò fece_capriole girò fece_giravolte
          si_rotolò giocò_a_nascondino fece_il_buffone si_divertì fece_piroette si_dondolò ruzzolò
          schiamazzò fece_salti_di_gioia si_scatenò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.think,
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        ricorda dimentica immagina conta rievoca rimpiange pensa_a sogna medita_su riflette_su
        considera contempla crede_in confida_in brama sente_la_mancanza_di si_ricorda_di
        si_chiede_di si_preoccupa_per capisce comprende visualizza si_immagina teme desidera
      '''),
      past: PredicateTense(
        words: words(r'''
          ricordò dimenticò immaginò contò rievocò rimpianse pensò_a sognò meditò_su rifletté_su
          considerò contemplò credette_in confidò_in bramò sentì_la_mancanza_di si_ricordò_di
          si_chiese_di si_preoccupò_per capì comprese visualizzò si_immaginò temette desiderò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.look,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r"""
        guarda osserva contempla esamina tocca accarezza vede sorveglia studia ispeziona scruta
        sbircia dà_un'occhiata_a ammira analizza controlla palpa sfiora tasta bussa_su annusa fiuta
        soppesa maneggia adocchia intravede riguarda
      """),
      past: PredicateTense(
        words: words(r"""
          guardò osservò contemplò esaminò toccò accarezzò vide sorvegliò studiò ispezionò scrutò
          sbirciò diede_un'occhiata_a ammirò analizzò controllò palpò sfiorò tastò bussò_su annusò
          fiutò soppesò maneggiò adocchiò intravide riguardò
        """),
      ),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        cerca rovista fruga esplora scava curiosa perlustra indaga ficcanasa mette_tutto_sottosopra
        guarda_dappertutto annusa_in_giro scandaglia setaccia ispeziona_il_posto va_in_cerca
      '''),
      past: PredicateTense(
        words: words(r'''
          cercò rovistò frugò esplorò scavò curiosò perlustrò indagò ficcanasò mise_tutto_sottosopra
          guardò_dappertutto annusò_in_giro scandagliò setacciò ispezionò_il_posto andò_in_cerca
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.find,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        trova scopre scorge raccoglie individua dissotterra si_imbatte_in inciampa_in recupera salva
        porta_alla_luce solleva_da_terra scopre_per_caso rinviene tira_fuori
      '''),
      past: PredicateTense(
        words: words(r'''
          trovò scoprì scorse raccolse individuò dissotterrò si_imbatté_in inciampò_in recuperò
          salvò portò_alla_luce sollevò_da_terra scoprì_per_caso rinvenne tirò_fuori
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.take,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        sceglie prende afferra piglia tira_fuori riceve acchiappa stringe regge solleva alza
        raccoglie raduna seleziona accetta ottiene si_porta_via si_tiene si_mette_in_tasca impugna
        agguanta ghermisce strappa si_impossessa_di arraffa accumula
      '''),
      past: PredicateTense(
        words: words(r'''
          scelse prese afferrò pigliò tirò_fuori ricevette acchiappò strinse resse sollevò alzò
          raccolse radunò selezionò accettò ottenne si_portò_via si_tenne si_mise_in_tasca impugnò
          agguantò ghermì strappò si_impossessò_di arraffò accumulò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.carry,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        porta reca trasporta trascina spinge tira rimorchia porta_in_spalla si_carica_di
        porta_con_sé si_porta_dietro sposta trasferisce solleva trascina_via
      '''),
      past: PredicateTense(
        words: words(r'''
          portò recò trasportò trascinò spinse tirò rimorchiò portò_in_spalla si_caricò_di
          portò_con_sé si_portò_dietro spostò trasferì sollevò trascinò_via
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.hide,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        nasconde ripone custodisce sotterra conserva immagazzina accumula tesaurizza mette_da_parte
        riserva avvolge copre tappa dissimula mette_al_sicuro chiude_a_chiave infila_in_un_cassetto
        lascia_al_sicuro sorveglia protegge rinchiude archivia impacchetta occulta
      '''),
      past: PredicateTense(
        words: words(r'''
          nascose ripose custodì sotterrò conservò immagazzinò accumulò tesaurizzò mise_da_parte
          riservò avvolse coprì tappò dissimulò mise_al_sicuro chiuse_a_chiave infilò_in_un_cassetto
          lasciò_al_sicuro sorvegliò protesse rinchiuse archiviò impacchettò occultò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.lose,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        perde smarrisce dimentica lascia_cadere molla lascia_indietro si_dimentica_di trascura
        lascia_lì perde_di_vista fa_cadere scorda
      '''),
      past: PredicateTense(
        words: words(r'''
          perse smarrì dimenticò lasciò_cadere mollò lasciò_indietro si_dimenticò_di trascurò
          lasciò_lì perse_di_vista fece_cadere scordò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.meet,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.person],
      words: words(r'''
        incontra saluta si_imbatte_in incrocia raggiunge va_a_trovare fa_visita_a accoglie
        dà_il_benvenuto_a rivede vede abbraccia saluta_con_la_mano si_ritrova_con si_unisce_a
      '''),
      past: PredicateTense(
        words: words(r'''
          incontrò salutò si_imbatté_in incrociò raggiunse andò_a_trovare fece_visita_a accolse
          diede_il_benvenuto_a rivide vide abbracciò salutò_con_la_mano si_ritrovò_con si_unì_a
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        costruisce fabbrica intaglia dipinge tesse monta fa crea disegna realizza assembla modella
        scolpisce inventa produce finisce idea progetta dà_forma_a completa perfeziona decora
        abbellisce plasma compone
      '''),
      past: PredicateTense(
        words: words(r'''
          costruì fabbricò intagliò dipinse tessé montò fece creò disegnò realizzò assemblò modellò
          scolpì inventò produsse finì ideò progettò diede_forma_a completò perfezionò decorò
          abbellì plasmò compose
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      objectThemes: const <WordTheme>[WordTheme.object, WordTheme.tool, WordTheme.vehicle],
      words: words(r'forgia fonde salda martella ribatte avvita lavora lima'),
      past: PredicateTense(words: words(r'forgiò fuse saldò martellò ribatté avvitò lavorò limò')),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing],
      objectThemes: const <WordTheme>[WordTheme.clothing],
      words: words(r'''
        cuce confeziona ricama rammenda imbastisce cuce_a_mano lavora_a_maglia sferruzza
      '''),
      past: PredicateTense(
        words: words(r'''
          cucì confezionò ricamò rammendò imbastì cucì_a_mano lavorò_a_maglia sferruzzò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.tend,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        ripara pulisce lucida sistema riordina aggiusta strofina lava sfrega scuote spolvera
        sciacqua asciuga lustra fa_brillare accorda stringe ingrassa lubrifica rattoppa restaura
        rinnova controlla mantiene cura si_prende_cura_di vernicia spazzola stira rimette_a_posto
        ritocca sgrassa
      '''),
      past: PredicateTense(
        words: words(r'''
          riparò pulì lucidò sistemò riordinò aggiustò strofinò lavò sfregò scosse spolverò sciacquò
          asciugò lustrò fece_brillare accordò strinse ingrassò lubrificò rattoppò restaurò rinnovò
          controllò mantenne curò si_prese_cura_di verniciò spazzolò stirò rimise_a_posto ritoccò
          sgrassò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.sell,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r"""
        vende consegna cede offre smercia mette_all'asta commercia liquida piazza svende
        mette_in_vendita si_sbarazza_di rivende espone mostra contratta_su scambia baratta cede_via
      """),
      past: PredicateTense(
        words: words(r"""
          vendette consegnò cedette offrì smerciò mise_all'asta commerciò liquidò piazzò svendette
          mise_in_vendita si_sbarazzò_di rivendette espose mostrò contrattò_su scambiò barattò
          cedette_via
        """),
      ),
    ),
    VerbGroup(
      field: VerbField.buy,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle, NounClass.edible],
      words: words(r'''
        compra acquista ordina procura paga si_procura si_aggiudica prenota si_compra si_assicura
        investe_in fa_incetta_di si_prende sceglie_e_paga
      '''),
      past: PredicateTense(
        words: words(r'''
          comprò acquistò ordinò procurò pagò si_procurò si_aggiudicò prenotò si_comprò si_assicurò
          investì_in fece_incetta_di si_prese scelse_e_pagò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.cook,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        cuoce scalda cucina taglia arrostisce serve frigge bolle lessa salta_in_padella condisce
        insaporisce sala mescola rimesta sbatte stufa brasa tosta gratina sbuccia trita affetta
        grattugia riscalda prepara impiatta marina griglia inforna spezzetta pela
      '''),
      past: PredicateTense(
        words: words(r'''
          cosse scaldò cucinò tagliò arrostì servì frisse bollì lessò saltò_in_padella condì
          insaporì salò mescolò rimestò sbatté stufò brasò tostò gratinò sbucciò tritò affettò
          grattugiò riscaldò preparò impiattò marinò grigliò infornò spezzettò pelò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.eat,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        mangia mastica assaggia rosicchia divora gusta degusta inghiotte ingoia trangugia morde rode
        lecca sbocconcella dà_un_morso_a si_mangia finisce si_pappa spazzola ingurgita pilucca
        si_gode fa_fuori consuma
      '''),
      past: PredicateTense(
        words: words(r'''
          mangiò masticò assaggiò rosicchiò divorò gustò degustò inghiottì ingoiò trangugiò morse
          rose leccò sbocconcellò diede_un_morso_a si_mangiò finì si_pappò spazzolò ingurgitò
          piluccò si_godette fece_fuori consumò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.drink,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r"""
        beve sorseggia tracanna gusta inghiotte si_beve si_scola prende assapora assaggia centellina
        beve_a_piccoli_sorsi beve_d'un_fiato dà_un_sorso_a svuota finisce si_gode manda_giù sorbisce
        trangugia
      """),
      past: PredicateTense(
        words: words(r"""
          bevve sorseggiò tracannò gustò inghiottì si_bevve si_scolò prese assaporò assaggiò
          centellinò bevve_a_piccoli_sorsi bevve_d'un_fiato diede_un_sorso_a svuotò finì si_godette
          mandò_giù sorbì trangugiò
        """),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        si_calma si_oscura si_illumina si_riempie si_svuota si_anima si_sveglia si_addormenta
        si_zittisce ammutolisce si_acquieta si_agita brulica si_affolla si_riempie_di_gente
        si_svuota_del_tutto resta_in_silenzio brilla risplende riluce si_gela si_ghiaccia si_sgela
        si_bagna si_asciuga si_allaga si_spegne si_accende si_trasforma cambia albeggia imbrunisce
        si_copre_di_nebbia si_copre_di_neve si_ripopola si_rasserena si_rianima
      '''),
      past: PredicateTense(
        words: words(r'''
          si_calmò si_oscurò si_illuminò si_riempì si_svuotò si_animò si_svegliò si_addormentò
          si_zittì ammutolì si_acquietò si_agitò brulicò si_affollò si_riempì_di_gente
          si_svuotò_del_tutto restò_in_silenzio brillò risplendette rilusse si_gelò si_ghiacciò
          si_sgelò si_bagnò si_asciugò si_allagò si_spense si_accese si_trasformò cambiò albeggiò
          imbrunì si_coprì_di_nebbia si_coprì_di_neve si_ripopolò si_rasserenò si_rianimò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'''
        brilla scorre si_approfondisce inizia finisce continua passa prosegue trascorre avanza
        si_avvicina arriva si_allontana si_prolunga si_protrae indugia si_ripete svanisce
        si_conclude termina si_svolge si_intensifica si_placa si_attenua persiste dura cessa
      '''),
      past: PredicateTense(
        words: words(r'''
          brillò scorse si_approfondì iniziò finì continuò passò proseguì trascorse avanzò
          si_avvicinò arrivò si_allontanò si_prolungò si_protrasse indugiò si_ripeté svanì
          si_concluse terminò si_svolse si_intensificò si_placò si_attenuò persistette durò cessò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.time],
      words: words(r'''
        albeggia imbrunisce spunta declina cala scorre_via se_ne_va fugge vola scivola_via
        avanza_lentamente si_insedia cambia si_accorcia si_allunga si_spegne muore rinasce
        volge_al_termine
      '''),
      past: PredicateTense(
        words: words(r'''
          albeggiò imbrunì spuntò declinò calò scorse_via se_ne_andò fuggì volò scivolò_via
          avanzò_lentamente si_insediò cambiò si_accorciò si_allungò si_spense morì rinacque
          volse_al_termine
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.weather],
      words: words(r'''
        arriva si_avvicina incombe scoppia infuria si_placa spiove si_schiarisce si_dissolve si_alza
        si_allontana passa_oltre sferza imperversa si_scatena cessa si_intensifica si_indebolisce
        copre_il_cielo avvolge_tutto cade si_attenua
      '''),
      past: PredicateTense(
        words: words(r'''
          arrivò si_avvicinò incombé scoppiò infuriò si_placò spiovve si_schiarì si_dissolse si_alzò
          si_allontanò passò_oltre sferzò imperversò si_scatenò cessò si_intensificò si_indebolì
          coprì_il_cielo avvolse_tutto cadde si_attenuò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.sport],
      words: words(r'''
        comincia prende_il_via si_apre riprende si_interrompe viene_sospeso va_ai_supplementari
        si_infiamma si_decide si_disputa si_svolge si_gioca si_chiude volge_al_termine
        entra_nel_vivo si_fa_emozionante
      '''),
      past: PredicateTense(
        words: words(r'''
          cominciò prese_il_via si_aprì riprese si_interruppe venne_sospeso andò_ai_supplementari
          si_infiammò si_decise si_disputò si_svolse si_giocò si_chiuse volse_al_termine
          entrò_nel_vivo si_fece_emozionante
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      subjectThemes: const <WordTheme>[
        WordTheme.object,
        WordTheme.tool,
        WordTheme.clothing,
        WordTheme.product,
        WordTheme.gem,
        WordTheme.vehicle,
      ],
      words: words(r'''
        oscilla luccica cade rotola si_inclina invecchia brilla risplende scintilla trema vibra
        barcolla traballa si_ribalta crolla scivola sdrucciola precipita gira ruota si_ferma
        si_arresta si_muove si_sposta si_consuma sbiadisce si_spegne si_appanna si_deforma si_piega
        si_storce vola_via rimbalza salta sussulta dondola si_assesta resta_fermo si_sciupa
        si_sporca si_copre_di_polvere
      '''),
      past: PredicateTense(
        words: words(r'''
          oscillò luccicò cadde rotolò si_inclinò invecchiò brillò risplendette scintillò tremò
          vibrò barcollò traballò si_ribaltò crollò scivolò sdrucciolò precipitò girò ruotò si_fermò
          si_arrestò si_mosse si_spostò si_consumò sbiadì si_spense si_appannò si_deformò si_piegò
          si_storse volò_via rimbalzò saltò sussultò dondolò si_assestò restò_fermo si_sciupò
          si_sporcò si_coprì_di_polvere
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      subjectThemes: const <WordTheme>[WordTheme.object, WordTheme.tool, WordTheme.vehicle],
      words: words(r'''
        si_arrugginisce cigola scricchiola sferraglia stride tintinna si_rompe si_spezza si_crepa
        si_incrina si_spacca si_inceppa si_blocca si_allenta si_stacca si_smonta si_guasta
        si_danneggia fa_fumo si_ammacca va_in_pezzi
      '''),
      past: PredicateTense(
        words: words(r'''
          si_arrugginì cigolò scricchiolò sferragliò stridette tintinnò si_ruppe si_spezzò si_crepò
          si_incrinò si_spaccò si_inceppò si_bloccò si_allentò si_staccò si_smontò si_guastò
          si_danneggiò fece_fumo si_ammaccò andò_in_pezzi
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing],
      subjectThemes: const <WordTheme>[WordTheme.music],
      words: words(r'''
        suona risuona rimbomba fluttua si_leva si_spegne svanisce si_estingue tace si_ferma
        si_ripete continua prosegue si_prolunga si_propaga si_espande si_sente arriva_da_lontano
        fa_eco riecheggia cresce cala sale scende si_alza si_impone
      '''),
      past: PredicateTense(
        words: words(r'''
          suonò risuonò rimbombò fluttuò si_levò si_spense svanì si_estinse tacque si_fermò
          si_ripeté continuò proseguì si_prolungò si_propagò si_espanse si_sentì arrivò_da_lontano
          fece_eco riecheggiò crebbe calò salì scese si_alzò si_impose
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        viaggia si_ferma passa torna parte scivola parte_in_corsa avanza rotola accelera frena
        si_arresta si_allontana si_avvicina gira svolta fa_inversione indietreggia parcheggia
        si_posteggia arriva esce entra si_muove sferraglia vibra sbanda slitta ronza ruggisce
        si_mette_in_moto si_ferma_di_colpo prosegue_la_corsa va_piano sfreccia
      '''),
      past: PredicateTense(
        words: words(r'''
          viaggiò si_fermò passò tornò partì scivolò partì_in_corsa avanzò rotolò accelerò frenò
          si_arrestò si_allontanò si_avvicinò girò svoltò fece_inversione indietreggiò parcheggiò
          si_posteggiò arrivò uscì entrò si_mosse sferragliò vibrò sbandò slittò ronzò ruggì
          si_mise_in_moto si_fermò_di_colpo proseguì_la_corsa andò_piano sfrecciò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        si_diffonde svanisce rimane fluttua cresce si_dissolve sfuma si_diluisce si_indebolisce
        si_rafforza si_intensifica sorge affiora emerge risorge rinasce torna ritorna si_spegne
        si_assesta si_insedia si_accumula si_radica mette_radici si_agita si_calma si_placa
        si_ravviva si_accende si_propaga si_espande persiste perdura si_dilegua sale scende cambia
        oscilla si_ingigantisce si_riduce si_trasforma si_perde si_cancella
      '''),
      past: PredicateTense(
        words: words(r'''
          si_diffuse svanì rimase fluttuò crebbe si_dissolse sfumò si_diluì si_indebolì si_rafforzò
          si_intensificò sorse affiorò emerse risorse rinacque tornò ritornò si_spense si_assestò
          si_insediò si_accumulò si_radicò mise_radici si_agitò si_calmò si_placò si_ravvivò
          si_accese si_propagò si_espanse persistette perdurò si_dileguò salì scese cambiò oscillò
          si_ingigantì si_ridusse si_trasformò si_perse si_cancellò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        cresce appassisce fiorisce oscilla germoglia germina rinverdisce mette_gemme mette_foglie
        mette_radici si_apre si_schiude ingiallisce si_secca si_dissecca si_piega si_inclina
        si_curva si_allunga si_arrampica si_intreccia si_estende dà_frutti fruttifica profuma
        si_agita trema stormisce dondola si_erge si_raddrizza perde_le_foglie si_spoglia rivive
        risorge si_infittisce prospera si_sviluppa sboccia avvizzisce
      '''),
      past: PredicateTense(
        words: words(r'''
          crebbe appassì fiorì oscillò germogliò germinò rinverdì mise_gemme mise_foglie mise_radici
          si_aprì si_schiuse ingiallì si_seccò si_disseccò si_piegò si_inclinò si_curvò si_allungò
          si_arrampicò si_intrecciò si_estese diede_frutti fruttificò profumò si_agitò tremò stormì
          dondolò si_erse si_raddrizzò perse_le_foglie si_spogliò rivisse risorse si_infittì
          prosperò si_sviluppò sbocciò avvizzì
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        trema si_muove si_intorpidisce guarisce rabbrividisce batte pulsa si_contrae si_tende
        si_rilassa si_allenta si_irrigidisce si_indurisce si_ammorbidisce si_scalda si_raffredda
        si_gonfia si_sgonfia si_infiamma fa_male brucia prude formicola suda si_stanca si_sfinisce
        si_riprende si_ristora si_allunga si_accorcia si_piega si_flette si_alza si_abbassa
        si_solleva si_gira si_agita cede si_risveglia si_apre si_chiude sussulta pizzica
      '''),
      past: PredicateTense(
        words: words(r'''
          tremò si_mosse si_intorpidì guarì rabbrividì batté pulsò si_contrasse si_tese si_rilassò
          si_allentò si_irrigidì si_indurì si_ammorbidì si_scaldò si_raffreddò si_gonfiò si_sgonfiò
          si_infiammò fece_male bruciò prudette formicolò sudò si_stancò si_sfinì si_riprese
          si_ristorò si_allungò si_accorciò si_piegò si_flesse si_alzò si_abbassò si_sollevò si_girò
          si_agitò cedette si_risvegliò si_aprì si_chiuse sussultò pizzicò
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        matura si_raffredda bolle si_scioglie si_guasta si_scalda si_intiepidisce fuma emana_vapore
        profuma manda_un_buon_odore finisce si_esaurisce avanza resta si_riduce arriva_in_tavola
        viene_servito si_rapprende si_indurisce si_ammorbidisce marcisce va_a_male fermenta
        si_congela si_addensa si_schiarisce si_deposita riposa si_raffredda_del_tutto
      '''),
      past: PredicateTense(
        words: words(r'''
          maturò si_raffreddò bollì si_sciolse si_guastò si_scaldò si_intiepidì fumò emanò_vapore
          profumò mandò_un_buon_odore finì si_esaurì avanzò restò si_ridusse arrivò_in_tavola
          venne_servito si_rapprese si_indurì si_ammorbidì marcì andò_a_male fermentò si_congelò
          si_addensò si_schiarì si_depositò riposò si_raffreddò_del_tutto
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        sfrigola si_dora si_abbrustolisce si_brucia si_strinaccia si_sbriciola si_sgretola
        diventa_duro diventa_stantio si_secca si_dissecca si_inumidisce ammuffisce inacidisce
        si_gonfia lievita si_cuoce si_inforna si_arrostisce si_frigge si_disfa si_sfalda cede
      '''),
      past: PredicateTense(
        words: words(r'''
          sfrigolò si_dorò si_abbrustolì si_bruciò si_strinacciò si_sbriciolò si_sgretolò
          diventò_duro diventò_stantio si_seccò si_disseccò si_inumidì ammuffì inacidì si_gonfiò
          lievitò si_cosse si_infornò si_arrostì si_frisse si_disfece si_sfaldò cedette
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        frizza spumeggia fa_la_schiuma si_versa si_rovescia schizza sciaborda si_agita si_mescola
        si_intorbida si_schiarisce si_deposita perde_il_gas evapora trabocca gocciola cola
        si_annacqua si_concentra si_ghiaccia
      '''),
      past: PredicateTense(
        words: words(r'''
          frizzò spumeggiò fece_la_schiuma si_versò si_rovesciò schizzò sciabordò si_agitò
          si_mescolò si_intorbidì si_schiarì si_depositò perse_il_gas evaporò traboccò gocciolò colò
          si_annacquò si_concentrò si_ghiacciò
        '''),
      ),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        grande piccolo veloce lento silenzioso rumoroso coraggioso pigro feroce mite arguto sveglio
        giovane anziano forte debole audace timido orgoglioso vivace sereno testardo agile attento
        robusto onesto astuto
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'affamato famelico digiuno vorace'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'sazio pieno appagato satollo'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'stanco assonnato esausto sfinito spossato affaticato'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'riposato fresco vispo arzillo leggero vigoroso'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'felice contento allegro sereno lieto gioioso soddisfatto raggiante'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'''
        annoiato curioso inquieto agitato impaziente ansioso irrequieto trepidante
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
        bello strano nuovo comune raro grazioso familiare singolare ordinario splendido prezioso
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        ampio stretto tranquillo profondo scuro chiaro lontano ripido affollato deserto angusto
        vuoto immenso cupo pianeggiante lungo breve luminoso
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        duro leggero pesante vecchio liscio trasparente robusto rotondo piatto appuntito sottile
        grosso fragile lussuoso semplice delicato ruvido lucente
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        dolce salato piccante aspro caldo freddo saporito amaro denso morbido tiepido succoso
        croccante gustoso insipido
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        semplice evidente vago eterno fugace complesso limpido profondo familiare prezioso segreto
        minuto difficile facile
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        verde rigoglioso profumato appassito alto tenero snello florido rado fitto
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        caldo freddo dolente rigido morbido ruvido liscio pallido forte intorpidito pesante
      '''),
    ),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        coraggioso vivace gentile occupato pigro timido sveglio giovane vecchio piccolo grande
        silenzioso allegro paziente agile curioso audace timoroso cauto testardo mite rumoroso
        robusto magro assonnato astuto attento taciturno orgoglioso innocente onesto desto sereno
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'''
        giovane gentile severo serio occupato sincero saggio umile educato abile famoso povero ricco
        anziano sorridente arguto affabile laborioso
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'''
        veloce feroce mansueto paffuto piccolino peloso maculato striato smilzo enorme destro
        tondeggiante lucido allungato
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        dolce piccante tiepido fresco croccante saporito fragrante caldo salato morbido maturo
        gustoso dorato affumicato cremoso tenero succoso sostanzioso fumante tostato appiccicoso
        insipido speziato
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        dolce tiepido freddo fresco caldo fragrante forte amaro cremoso ghiacciato lattiginoso
        torbido limpido frizzante morbido temperato
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        vecchio nuovo piccolo grande leggero pesante lucente liscio trasparente duro bello prezioso
        antico arrugginito consumato lucidato semplice sfarzoso stretto largo rotondo piatto
        appuntito smussato fragile cavo polveroso storto
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        veloce lento robusto cigolante rilucente arrugginito sgangherato enorme rumoroso malandato
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        tranquillo ampio scuro luminoso strano vecchio accogliente isolato affollato silenzioso
        remoto lontano vicino vuoto solitario soleggiato angusto gremito ventoso nebbioso ombroso
        polveroso umido roccioso ripido pianeggiante desolato verdeggiante deserto sgombro
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        verde rigoglioso profumato giovane appassito alto piccolo tenero fresco spinoso fiorito
        germogliante rampicante selvatico snello pallido cadente folto
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        vago vecchio nuovo strano chiaro prezioso piccolo curioso tenue semplice aggrovigliato
        ostinato fugace lontano audace segreto silenzioso familiare
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'''
        lungo breve tranquillo soleggiato nuvoloso rumoroso improvviso solenne allegro noioso
        piovoso tempestoso sereno gremito animato splendido sobrio
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        piccolo freddo caldo esile robusto morbido rigido dolente ruvido liscio pallido forte
      '''),
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
      words: words(r'''
        bello misterioso strano nuovo grazioso familiare singolare ordinario splendido modesto
      '''),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        in_silenzio lentamente rapidamente dolcemente improvvisamente appena da_solo brevemente
        costantemente audacemente con_cura avidamente tranquillamente allegramente fortemente
        pazientemente leggermente serenamente vivacemente goffamente con_calma furtivamente
        in_punta_di_piedi affannosamente frettolosamente attentamente distrattamente nervosamente
        curiosamente orgogliosamente timidamente amabilmente amaramente severamente sonnolentamente
        sbadatamente teneramente bruscamente abilmente destramente decisamente felicemente
        tristemente pesantemente animatamente a_stento di_malavoglia apposta senza_dire_nulla
        di_slancio senza_fretta di_gusto a_bassa_voce senza_sosta
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
      words: words(r"""
        in_silenzio lentamente dolcemente improvvisamente appena di_nuovo ancora piano_piano
        debolmente a_poco_a_poco gradualmente silenziosamente lievemente intensamente vivacemente
        profondamente ampiamente fiocamente calorosamente freddamente soavemente densamente
        fermamente pesantemente leggermente incessantemente costantemente eternamente
        ancora_una_volta per_un_po' di_colpo ovunque
      """),
    ),
  ],
  times: SentenceTimes(
    day: words(r"""
      all'alba di_prima_mattina al_mattino a_mezzogiorno nel_pomeriggio al_tramonto di_sera di_notte
      a_notte_fonda a_mezzanotte
    """),
    any: words(r'''
      in_primavera in_estate in_autunno in_inverno nel_fine_settimana nei_giorni_festivi
      tutto_il_giorno in_piena_primavera a_fine_primavera a_inizio_estate in_piena_estate
      a_fine_estate a_inizio_autunno a_fine_autunno in_pieno_inverno a_fine_inverno
      nella_stagione_delle_piogge al_raccolto alla_festa nel_giorno_di_mercato con_la_luna_piena
      in_un_giorno_di_pioggia in_un_giorno_di_neve in_un_giorno_di_vento in_una_giornata_limpida
      in_una_giornata_nuvolosa in_un_giorno_di_nebbia in_vacanza
    '''),
    past: words(r"""
      ieri la_settimana_scorsa tempo_fa quel_giorno quella_notte una_volta l'altro_ieri
      il_mese_scorso l'anno_scorso anni_fa qualche_tempo_fa quella_mattina quella_sera a_quel_tempo
      a_quei_tempi la_settimana_prima la_primavera_scorsa l'estate_scorsa l'autunno_scorso
      l'inverno_scorso qualche_giorno_fa
    """),
    present: words(r"""
      oggi poco_fa domani la_settimana_prossima adesso stamattina stasera stanotte dopodomani
      il_mese_prossimo l'anno_prossimo quest'anno questa_settimana questo_fine_settimana tra_poco
      subito
    """),
    habitual: words(r'''
      di_questi_tempi a_volte ogni_giorno ogni_notte sempre spesso di_solito raramente di_rado
      ogni_tanto ogni_mattina ogni_settimana ogni_anno in_genere quasi_sempre
    '''),
  ),
  homes: words(r'casa'),
  join: const SentenceJoin(word: 'e'),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(
      r'e_poi inoltre, e_ancora, per_di_più, in_aggiunta, oltretutto,',
    ),
    ConnectiveKind.temporal: words(r"""
      dopo infine intanto, più_tardi alla_fine poco_dopo subito_dopo, dopo_un_po' nel_frattempo,
      a_quel_punto, in_men_che_non_si_dica, di_lì_a_poco
    """),
    ConnectiveKind.contrastive: words(r'''
      ma tuttavia, eppure invece, ciò_nonostante, al_contrario, nondimeno, con_tutto_ciò,
    '''),
    ConnectiveKind.causal: words(
      r'allora perciò così pertanto, di_conseguenza, per_questo per_tale_ragione,',
    ),
  },
  traits: <NounTrait, WordPool>{
    NounTrait.flier: words(r'''
      uccello rondine passero corvo falco aquila pavone pappagallo gufo colomba gru cigno anatra oca
      farfalla ape libellula cicala mosca zanzara pipistrello airone pellicano drago fenice fata
      pegaso grifone angelo valchiria merlo usignolo allodola quaglia fagiano pernice colibrì tucano
      fenicottero cicogna upupa cardellino gazza ghiandaia civetta poiana vespa tarma lucciola
      ippogrifo
    '''),
    NounTrait.swimmer: words(r'''
      coccodrillo tartaruga rana rospo pesce balena delfino squalo polpo calamaro gambero granchio
      tricheco foca pinguino sirena kraken naiade anguilla sardina tonno merluzzo nasello trota
      salmone carpa razza medusa vongola cozza ostrica aragosta totano salamandra tritone castoro
      ippopotamo ornitorinco
    '''),
    NounTrait.crawler: words(r'''
      coccodrillo serpente lucertola tartaruga lumaca formica ragno verme granchio basilisco iguana
      camaleonte salamandra tritone boa vipera cobra pitone scarabeo cavalletta grillo pulce bruco
      millepiedi scorpione
    '''),
    NounTrait.lifeless: words(r'''
      incantesimo maledizione profezia amuleto talismano runa portale santuario idolo totem augurio
      presagio bestiario sortilegio grimorio pentacolo reliquia calice graal bacchetta bastone
      scettro corona
    '''),
    NounTrait.placeless: words(r'''
      sabbia ciottolo terremoto masso geyser fumarola stalattite stalagmite eco brace stella cometa
      meteora aurora falce_lunare eclissi zenit satellite ammasso orbita gravità rotazione
      rivoluzione anno_luce astro eclittica meridiano plenilunio novilunio perigeo vespro supernova
      quasar pulsar corrente marea onda schiuma frangente parallasse parsec azimut perielio afelio
      ellisse quadrante nadir gravitazione alone bolide nana
    '''),
  },
  interjections: words(r'''
    oh, ah, ehi, caspita, mamma_mia, guarda, davvero, ohi, accidenti, cavolo, santo_cielo, dai,
    ahimè, uffa, però, senti, ecco, toh, perbacco, figurati, macché, magari, urca, meno_male,
  '''),
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>[''],
  },
  objectPronouns: const SentenceObjectPronouns(
    words: <WordGender, WordPool>{
      WordGender.m: <String>['lo'],
      WordGender.f: <String>['la'],
    },
    clitic: true,
  ),
  degrees: words(r"""
    molto abbastanza un_po' davvero proprio piuttosto assai parecchio decisamente alquanto
  """),
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
      SentencePart(SentenceSlot.degree),
      SentencePart(SentenceSlot.state, head: 'è', pastHead: 'era'),
    ], 9),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: 'è', pastHead: 'era'),
    ], 5),
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
