"""The it sentence grammar: the verbs, the predicates and the shapes.

Ported verbatim from the JavaScript package; see CLAUDE.md.
"""

from randino._internal.parse import words
from randino.sentence.data._types import (
    ModifierGroup,
    PredicateTense,
    SentenceCalendar,
    SentenceFrame,
    SentenceJoin,
    SentenceLanguageData,
    SentenceNumeral,
    SentenceObjectPronouns,
    SentencePart,
    SentenceTimes,
    StateGroup,
    VerbGroup,
)

IT = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminators={"statement": ".", "question": "?", "exclamation": "!", "trailing": "…"},
    quotes={"double": ("«", "»"), "single": ("“", "”")},
    articles={
        "m": (
            ("a", "l'"),
            ("e", "l'"),
            ("i", "l'"),
            ("o", "l'"),
            ("u", "l'"),
            ("gn", "lo"),
            ("pn", "lo"),
            ("ps", "lo"),
            ("x", "lo"),
            ("y", "lo"),
            ("z", "lo"),
            ("sb", "lo"),
            ("sc", "lo"),
            ("sd", "lo"),
            ("sf", "lo"),
            ("sg", "lo"),
            ("sl", "lo"),
            ("sm", "lo"),
            ("sn", "lo"),
            ("sp", "lo"),
            ("sq", "lo"),
            ("sr", "lo"),
            ("st", "lo"),
            ("sv", "lo"),
            ("", "il"),
        ),
        "f": (("a", "l'"), ("e", "l'"), ("i", "l'"), ("o", "l'"), ("u", "l'"), ("", "la")),
    },
    predicate_agrees=True,
    verbs=(
        VerbGroup(
            field="rise",
            subject=("creature", "person"),
            words=words("""
                si_sveglia si_alza si_desta si_ridesta si_tira_su si_mette_seduto apre_gli_occhi
                si_stiracchia si_mette_in_piedi balza_in_piedi
            """),
            past=PredicateTense(
                words=words("""
                    si_svegliò si_alzò si_destò si_ridestò si_tirò_su si_mise_seduto aprì_gli_occhi
                    si_stiracchiò si_mise_in_piedi balzò_in_piedi
                """),
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            requires="destination",
            words=words("""
                va si_dirige si_avvia si_avvicina avanza si_incammina si_muove viaggia si_affretta
                si_lancia procede si_sposta
            """),
            past=PredicateTense(
                words=words("""
                    andò si_diresse si_avviò si_avvicinò avanzò si_incamminò si_mosse viaggiò
                    si_affrettò si_lanciò procedette si_spostò
                """),
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            subject_without=("swimmer", "crawler"),
            requires="destination",
            words=words("""
                corre cammina sale scende trotta passeggia salta zoppica si_arrampica marcia
            """),
            past=PredicateTense(
                words=words("""
                    corse camminò salì scese trottò passeggiò saltò zoppicò si_arrampicò marciò
                """),
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            words=words("""
                parte se_ne_va esce se_ne_esce si_allontana si_ritira si_mette_in_cammino
                si_mette_in_viaggio sgattaiola_via svanisce se_la_svigna si_avvia si_incammina
            """),
            past=PredicateTense(
                words=words("""
                    partì se_ne_andò uscì se_ne_uscì si_allontanò si_ritirò si_mise_in_cammino
                    si_mise_in_viaggio sgattaiolò_via svanì se_la_svignò si_avviò si_incamminò
                """),
            ),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            requires="destination",
            words=words("""
                torna arriva rientra giunge viene si_avvicina avanza raggiunge si_sposta ritorna
            """),
            past=PredicateTense(
                words=words("""
                    tornò arrivò rientrò giunse venne si_avvicinò avanzò raggiunse si_spostò ritornò
                """),
            ),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            words=words("""
                ritorna rincasa riappare arriva_a_casa compare ricompare si_presenta si_affaccia
                entra fa_ritorno torna_a_casa si_fa_vivo
            """),
            past=PredicateTense(
                words=words("""
                    ritornò rincasò riapparve arrivò_a_casa comparve ricomparve si_presentò
                    si_affacciò entrò fece_ritorno tornò_a_casa si_fece_vivo
                """),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_without=("swimmer", "crawler"),
            words=words("""
                corre cammina salta passeggia gironzola trotta corricchia saltella marcia zoppica
                si_arrampica fa_un_salto fa_due_passi cammina_in_punta_di_piedi
                avanza_a_grandi_passi scalpita zampetta sgambetta
            """),
            past=PredicateTense(
                words=words("""
                    corse camminò saltò passeggiò gironzolò trottò corricchiò saltellò marciò
                    zoppicò si_arrampicò fece_un_salto fece_due_passi camminò_in_punta_di_piedi
                    avanzò_a_grandi_passi scalpitò zampettò sgambettò
                """),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            words=words("""
                vaga passa si_muove avanza indietreggia gira gira_in_tondo si_sposta scivola
                si_aggira ronza si_avvicina si_allontana attraversa sguscia_via
            """),
            past=PredicateTense(
                words=words("""
                    vagò passò si_mosse avanzò indietreggiò girò girò_in_tondo si_spostò scivolò
                    si_aggirò ronzò si_avvicinò si_allontanò attraversò sgusciò_via
                """),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("swimmer",),
            words=words("nuota si_tuffa sguazza galleggia si_immerge riemerge nuota_in_tondo"),
            past=PredicateTense(
                words=words("""
                    nuotò si_tuffò sguazzò galleggiò si_immerse riemerse nuotò_in_tondo
                """),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature",),
            subject_traits=("flier",),
            words=words("""
                vola decolla plana svolazza sbatte_le_ali si_alza_in_volo si_posa atterra si_libra
                sorvola spicca_il_volo plana_in_basso volteggia
            """),
            past=PredicateTense(
                words=words("""
                    volò decollò planò svolazzò sbatté_le_ali si_alzò_in_volo si_posò atterrò
                    si_librò sorvolò spiccò_il_volo planò_in_basso volteggiò
                """),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("crawler",),
            words=words("""
                striscia si_trascina serpeggia scivola si_attorciglia si_contorce gattona sguscia
                avanza_strisciando scava
            """),
            past=PredicateTense(
                words=words("""
                    strisciò si_trascinò serpeggiò scivolò si_attorcigliò si_contorse gattonò
                    sgusciò avanzò_strisciando scavò
                """),
            ),
        ),
        VerbGroup(
            field="wait",
            subject=("creature", "person"),
            words=words("""
                aspetta si_nasconde si_guarda_intorno esita si_ferma attende ascolta tentenna dubita
                resta_fermo rimane_immobile si_acquatta spia fa_capolino dà_un'occhiata indugia
                bighellona ciondola si_blocca fa_una_pausa osserva_in_silenzio resta_in_attesa
            """),
            past=PredicateTense(
                words=words("""
                    aspettò si_nascose si_guardò_intorno esitò si_fermò attese ascoltò tentennò
                    dubitò restò_fermo rimase_immobile si_acquattò spiò fece_capolino
                    diede_un'occhiata indugiò bighellonò ciondolò si_bloccò fece_una_pausa
                    osservò_in_silenzio restò_in_attesa
                """),
            ),
        ),
        VerbGroup(
            field="rest",
            subject=("creature", "person"),
            words=words("""
                riposa si_siede si_sdraia si_appoggia si_rannicchia si_riposa si_stende si_distende
                si_rilassa si_inginocchia si_accovaccia si_stiracchia si_accascia riprende_fiato
                si_accomoda si_mette_comodo fa_una_sosta si_adagia si_riposa_un_po' si_abbandona
            """),
            past=PredicateTense(
                words=words("""
                    riposò si_sedette si_sdraiò si_appoggiò si_rannicchiò si_riposò si_stese
                    si_distese si_rilassò si_inginocchiò si_accovacciò si_stiracchiò si_accasciò
                    riprese_fiato si_accomodò si_mise_comodo fece_una_sosta si_adagiò
                    si_riposò_un_po' si_abbandonò
                """),
            ),
        ),
        VerbGroup(
            field="sleep",
            subject=("creature", "person"),
            words=words("""
                dorme si_addormenta sonnecchia si_assopisce schiaccia_un_pisolino ciondola_il_capo
                crolla_dal_sonno russa sogna si_appisola chiude_gli_occhi dorme_profondamente
                cade_addormentato dorme_della_grossa
            """),
            past=PredicateTense(
                words=words("""
                    dormì si_addormentò sonnecchiò si_assopì schiacciò_un_pisolino ciondolò_il_capo
                    crollò_dal_sonno russò sognò si_appisolò chiuse_gli_occhi dormì_profondamente
                    cadde_addormentato dormì_della_grossa
                """),
            ),
        ),
        VerbGroup(
            field="express",
            subject=("creature", "person"),
            words=words("""
                ride piange sbadiglia sospira sorride canticchia borbotta grida ridacchia singhiozza
                geme brontola fischietta esclama esulta ansima si_stringe_nelle_spalle annuisce
                aggrotta_la_fronte starnutisce ha_il_singhiozzo applaude fa_l'occhiolino arrossisce
                scoppia_a_ridere piagnucola sbuffa strilla balbetta fa_una_smorfia scuote_la_testa
                saluta_con_la_mano mugugna
            """),
            past=PredicateTense(
                words=words("""
                    rise pianse sbadigliò sospirò sorrise canticchiò borbottò gridò ridacchiò
                    singhiozzò gemette brontolò fischiettò esclamò esultò ansimò
                    si_strinse_nelle_spalle annuì aggrottò_la_fronte starnutì ebbe_il_singhiozzo
                    applaudì fece_l'occhiolino arrossì scoppiò_a_ridere piagnucolò sbuffò strillò
                    balbettò fece_una_smorfia scosse_la_testa salutò_con_la_mano mugugnò
                """),
            ),
        ),
        VerbGroup(
            field="talk",
            subject=("creature", "person"),
            words=words("""
                chiacchiera parla conversa discorre spettegola ciarla sussurra bisbiglia dialoga
                si_intrattiene racconta_storie saluta scambia_due_parole parlotta confabula
            """),
            past=PredicateTense(
                words=words("""
                    chiacchierò parlò conversò discorse spettegolò ciarlò sussurrò bisbigliò dialogò
                    si_intrattenne raccontò_storie salutò scambiò_due_parole parlottò confabulò
                """),
            ),
        ),
        VerbGroup(
            field="play",
            subject=("creature", "person"),
            words=words("""
                balla canta rotola gioca saltella scherza salta fa_capriole gira fa_giravolte
                si_rotola gioca_a_nascondino fa_il_buffone si_diverte fa_piroette si_dondola ruzzola
                schiamazza fa_salti_di_gioia si_scatena
            """),
            past=PredicateTense(
                words=words("""
                    ballò cantò rotolò giocò saltellò scherzò saltò fece_capriole girò
                    fece_giravolte si_rotolò giocò_a_nascondino fece_il_buffone si_divertì
                    fece_piroette si_dondolò ruzzolò schiamazzò fece_salti_di_gioia si_scatenò
                """),
            ),
        ),
        VerbGroup(
            field="think",
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("""
                ricorda dimentica immagina conta rievoca rimpiange pensa_a sogna medita_su
                riflette_su considera contempla crede_in confida_in brama sente_la_mancanza_di
                si_ricorda_di si_chiede_di si_preoccupa_per capisce comprende visualizza si_immagina
                teme desidera
            """),
            past=PredicateTense(
                words=words("""
                    ricordò dimenticò immaginò contò rievocò rimpianse pensò_a sognò meditò_su
                    rifletté_su considerò contemplò credette_in confidò_in bramò
                    sentì_la_mancanza_di si_ricordò_di si_chiese_di si_preoccupò_per capì comprese
                    visualizzò si_immaginò temette desiderò
                """),
            ),
        ),
        VerbGroup(
            field="look",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                guarda osserva contempla esamina tocca accarezza vede sorveglia studia ispeziona
                scruta sbircia dà_un'occhiata_a ammira analizza controlla palpa sfiora tasta
                bussa_su annusa fiuta soppesa maneggia adocchia intravede riguarda
            """),
            past=PredicateTense(
                words=words("""
                    guardò osservò contemplò esaminò toccò accarezzò vide sorvegliò studiò ispezionò
                    scrutò sbirciò diede_un'occhiata_a ammirò analizzò controllò palpò sfiorò tastò
                    bussò_su annusò fiutò soppesò maneggiò adocchiò intravide riguardò
                """),
            ),
        ),
        VerbGroup(
            field="search",
            subject=("creature", "person"),
            words=words("""
                cerca rovista fruga esplora scava curiosa perlustra indaga ficcanasa
                mette_tutto_sottosopra guarda_dappertutto annusa_in_giro scandaglia setaccia
                ispeziona_il_posto va_in_cerca
            """),
            past=PredicateTense(
                words=words("""
                    cercò rovistò frugò esplorò scavò curiosò perlustrò indagò ficcanasò
                    mise_tutto_sottosopra guardò_dappertutto annusò_in_giro scandagliò setacciò
                    ispezionò_il_posto andò_in_cerca
                """),
            ),
        ),
        VerbGroup(
            field="find",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                trova scopre scorge raccoglie individua dissotterra si_imbatte_in inciampa_in
                recupera salva porta_alla_luce solleva_da_terra scopre_per_caso rinviene tira_fuori
            """),
            past=PredicateTense(
                words=words("""
                    trovò scoprì scorse raccolse individuò dissotterrò si_imbatté_in inciampò_in
                    recuperò salvò portò_alla_luce sollevò_da_terra scoprì_per_caso rinvenne
                    tirò_fuori
                """),
            ),
        ),
        VerbGroup(
            field="take",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                sceglie prende afferra piglia tira_fuori riceve acchiappa stringe regge solleva alza
                raccoglie raduna seleziona accetta ottiene si_porta_via si_tiene si_mette_in_tasca
                impugna agguanta ghermisce strappa si_impossessa_di arraffa accumula
            """),
            past=PredicateTense(
                words=words("""
                    scelse prese afferrò pigliò tirò_fuori ricevette acchiappò strinse resse sollevò
                    alzò raccolse radunò selezionò accettò ottenne si_portò_via si_tenne
                    si_mise_in_tasca impugnò agguantò ghermì strappò si_impossessò_di arraffò
                    accumulò
                """),
            ),
        ),
        VerbGroup(
            field="carry",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                porta reca trasporta trascina spinge tira rimorchia porta_in_spalla si_carica_di
                porta_con_sé si_porta_dietro sposta trasferisce solleva trascina_via
            """),
            past=PredicateTense(
                words=words("""
                    portò recò trasportò trascinò spinse tirò rimorchiò portò_in_spalla si_caricò_di
                    portò_con_sé si_portò_dietro spostò trasferì sollevò trascinò_via
                """),
            ),
        ),
        VerbGroup(
            field="hide",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                nasconde ripone custodisce sotterra conserva immagazzina accumula tesaurizza
                mette_da_parte riserva avvolge copre tappa dissimula mette_al_sicuro chiude_a_chiave
                infila_in_un_cassetto lascia_al_sicuro sorveglia protegge rinchiude archivia
                impacchetta occulta
            """),
            past=PredicateTense(
                words=words("""
                    nascose ripose custodì sotterrò conservò immagazzinò accumulò tesaurizzò
                    mise_da_parte riservò avvolse coprì tappò dissimulò mise_al_sicuro
                    chiuse_a_chiave infilò_in_un_cassetto lasciò_al_sicuro sorvegliò protesse
                    rinchiuse archiviò impacchettò occultò
                """),
            ),
        ),
        VerbGroup(
            field="lose",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                perde smarrisce dimentica lascia_cadere molla lascia_indietro si_dimentica_di
                trascura lascia_lì perde_di_vista fa_cadere scorda
            """),
            past=PredicateTense(
                words=words("""
                    perse smarrì dimenticò lasciò_cadere mollò lasciò_indietro si_dimenticò_di
                    trascurò lasciò_lì perse_di_vista fece_cadere scordò
                """),
            ),
        ),
        VerbGroup(
            field="meet",
            subject=("creature", "person"),
            object=("person",),
            words=words("""
                incontra saluta si_imbatte_in incrocia raggiunge va_a_trovare fa_visita_a accoglie
                dà_il_benvenuto_a rivede vede abbraccia saluta_con_la_mano si_ritrova_con
                si_unisce_a
            """),
            past=PredicateTense(
                words=words("""
                    incontrò salutò si_imbatté_in incrociò raggiunse andò_a_trovare fece_visita_a
                    accolse diede_il_benvenuto_a rivide vide abbracciò salutò_con_la_mano
                    si_ritrovò_con si_unì_a
                """),
            ),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                costruisce fabbrica intaglia dipinge tesse monta fa crea disegna realizza assembla
                modella scolpisce inventa produce finisce idea progetta dà_forma_a completa
                perfeziona decora abbellisce plasma compone
            """),
            past=PredicateTense(
                words=words("""
                    costruì fabbricò intagliò dipinse tessé montò fece creò disegnò realizzò
                    assemblò modellò scolpì inventò produsse finì ideò progettò diede_forma_a
                    completò perfezionò decorò abbellì plasmò compose
                """),
            ),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing", "vehicle"),
            object_themes=("object", "tool", "vehicle"),
            words=words("forgia fonde salda martella ribatte avvita lavora lima"),
            past=PredicateTense(
                words=words("forgiò fuse saldò martellò ribatté avvitò lavorò limò"),
            ),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing",),
            object_themes=("clothing",),
            words=words("""
                cuce confeziona ricama rammenda imbastisce cuce_a_mano lavora_a_maglia sferruzza
            """),
            past=PredicateTense(
                words=words("""
                    cucì confezionò ricamò rammendò imbastì cucì_a_mano lavorò_a_maglia sferruzzò
                """),
            ),
        ),
        VerbGroup(
            field="tend",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                ripara pulisce lucida sistema riordina aggiusta strofina lava sfrega scuote spolvera
                sciacqua asciuga lustra fa_brillare accorda stringe ingrassa lubrifica rattoppa
                restaura rinnova controlla mantiene cura si_prende_cura_di vernicia spazzola stira
                rimette_a_posto ritocca sgrassa
            """),
            past=PredicateTense(
                words=words("""
                    riparò pulì lucidò sistemò riordinò aggiustò strofinò lavò sfregò scosse
                    spolverò sciacquò asciugò lustrò fece_brillare accordò strinse ingrassò
                    lubrificò rattoppò restaurò rinnovò controllò mantenne curò si_prese_cura_di
                    verniciò spazzolò stirò rimise_a_posto ritoccò sgrassò
                """),
            ),
        ),
        VerbGroup(
            field="sell",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                vende consegna cede offre smercia mette_all'asta commercia liquida piazza svende
                mette_in_vendita si_sbarazza_di rivende espone mostra contratta_su scambia baratta
                cede_via
            """),
            past=PredicateTense(
                words=words("""
                    vendette consegnò cedette offrì smerciò mise_all'asta commerciò liquidò piazzò
                    svendette mise_in_vendita si_sbarazzò_di rivendette espose mostrò contrattò_su
                    scambiò barattò cedette_via
                """),
            ),
        ),
        VerbGroup(
            field="buy",
            subject=("person",),
            object=("thing", "vehicle", "edible"),
            words=words("""
                compra acquista ordina procura paga si_procura si_aggiudica prenota si_compra
                si_assicura investe_in fa_incetta_di si_prende sceglie_e_paga
            """),
            past=PredicateTense(
                words=words("""
                    comprò acquistò ordinò procurò pagò si_procurò si_aggiudicò prenotò si_comprò
                    si_assicurò investì_in fece_incetta_di si_prese scelse_e_pagò
                """),
            ),
        ),
        VerbGroup(
            field="cook",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("""
                cuoce scalda cucina taglia arrostisce serve frigge bolle lessa salta_in_padella
                condisce insaporisce sala mescola rimesta sbatte stufa brasa tosta gratina sbuccia
                trita affetta grattugia riscalda prepara impiatta marina griglia inforna spezzetta
                pela
            """),
            past=PredicateTense(
                words=words("""
                    cosse scaldò cucinò tagliò arrostì servì frisse bollì lessò saltò_in_padella
                    condì insaporì salò mescolò rimestò sbatté stufò brasò tostò gratinò sbucciò
                    tritò affettò grattugiò riscaldò preparò impiattò marinò grigliò infornò
                    spezzettò pelò
                """),
            ),
        ),
        VerbGroup(
            field="eat",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("""
                mangia mastica assaggia rosicchia divora gusta degusta inghiotte ingoia trangugia
                morde rode lecca sbocconcella dà_un_morso_a si_mangia finisce si_pappa spazzola
                ingurgita pilucca si_gode fa_fuori consuma
            """),
            past=PredicateTense(
                words=words("""
                    mangiò masticò assaggiò rosicchiò divorò gustò degustò inghiottì ingoiò
                    trangugiò morse rose leccò sbocconcellò diede_un_morso_a si_mangiò finì si_pappò
                    spazzolò ingurgitò piluccò si_godette fece_fuori consumò
                """),
            ),
        ),
        VerbGroup(
            field="drink",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("drink",),
            words=words("""
                beve sorseggia tracanna gusta inghiotte si_beve si_scola prende assapora assaggia
                centellina beve_a_piccoli_sorsi beve_d'un_fiato dà_un_sorso_a svuota finisce si_gode
                manda_giù sorbisce trangugia
            """),
            past=PredicateTense(
                words=words("""
                    bevve sorseggiò tracannò gustò inghiottì si_bevve si_scolò prese assaporò
                    assaggiò centellinò bevve_a_piccoli_sorsi bevve_d'un_fiato diede_un_sorso_a
                    svuotò finì si_godette mandò_giù sorbì trangugiò
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("place",),
            words=words("""
                si_calma si_oscura si_illumina si_riempie si_svuota si_anima si_sveglia
                si_addormenta si_zittisce ammutolisce si_acquieta si_agita brulica si_affolla
                si_riempie_di_gente si_svuota_del_tutto resta_in_silenzio brilla risplende riluce
                si_gela si_ghiaccia si_sgela si_bagna si_asciuga si_allaga si_spegne si_accende
                si_trasforma cambia albeggia imbrunisce si_copre_di_nebbia si_copre_di_neve
                si_ripopola si_rasserena si_rianima
            """),
            past=PredicateTense(
                words=words("""
                    si_calmò si_oscurò si_illuminò si_riempì si_svuotò si_animò si_svegliò
                    si_addormentò si_zittì ammutolì si_acquietò si_agitò brulicò si_affollò
                    si_riempì_di_gente si_svuotò_del_tutto restò_in_silenzio brillò risplendette
                    rilusse si_gelò si_ghiacciò si_sgelò si_bagnò si_asciugò si_allagò si_spense
                    si_accese si_trasformò cambiò albeggiò imbrunì si_coprì_di_nebbia
                    si_coprì_di_neve si_ripopolò si_rasserenò si_rianimò
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            words=words("""
                brilla scorre si_approfondisce inizia finisce continua passa prosegue trascorre
                avanza si_avvicina arriva si_allontana si_prolunga si_protrae indugia si_ripete
                svanisce si_conclude termina si_svolge si_intensifica si_placa si_attenua persiste
                dura cessa
            """),
            past=PredicateTense(
                words=words("""
                    brillò scorse si_approfondì iniziò finì continuò passò proseguì trascorse avanzò
                    si_avvicinò arrivò si_allontanò si_prolungò si_protrasse indugiò si_ripeté svanì
                    si_concluse terminò si_svolse si_intensificò si_placò si_attenuò persistette
                    durò cessò
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            subject_themes=("time",),
            words=words("""
                albeggia imbrunisce spunta declina cala scorre_via se_ne_va fugge vola scivola_via
                avanza_lentamente si_insedia cambia si_accorcia si_allunga si_spegne muore rinasce
                volge_al_termine
            """),
            past=PredicateTense(
                words=words("""
                    albeggiò imbrunì spuntò declinò calò scorse_via se_ne_andò fuggì volò
                    scivolò_via avanzò_lentamente si_insediò cambiò si_accorciò si_allungò si_spense
                    morì rinacque volse_al_termine
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            subject_themes=("weather",),
            words=words("""
                arriva si_avvicina incombe scoppia infuria si_placa spiove si_schiarisce si_dissolve
                si_alza si_allontana passa_oltre sferza imperversa si_scatena cessa si_intensifica
                si_indebolisce copre_il_cielo avvolge_tutto cade si_attenua
            """),
            past=PredicateTense(
                words=words("""
                    arrivò si_avvicinò incombé scoppiò infuriò si_placò spiovve si_schiarì
                    si_dissolse si_alzò si_allontanò passò_oltre sferzò imperversò si_scatenò cessò
                    si_intensificò si_indebolì coprì_il_cielo avvolse_tutto cadde si_attenuò
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            subject_themes=("sport",),
            words=words("""
                comincia prende_il_via si_apre riprende si_interrompe viene_sospeso
                va_ai_supplementari si_infiamma si_decide si_disputa si_svolge si_gioca si_chiude
                volge_al_termine entra_nel_vivo si_fa_emozionante
            """),
            past=PredicateTense(
                words=words("""
                    cominciò prese_il_via si_aprì riprese si_interruppe venne_sospeso
                    andò_ai_supplementari si_infiammò si_decise si_disputò si_svolse si_giocò
                    si_chiuse volse_al_termine entrò_nel_vivo si_fece_emozionante
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("thing", "vehicle"),
            subject_themes=("object", "tool", "clothing", "product", "gem", "vehicle"),
            words=words("""
                oscilla luccica cade rotola si_inclina invecchia brilla risplende scintilla trema
                vibra barcolla traballa si_ribalta crolla scivola sdrucciola precipita gira ruota
                si_ferma si_arresta si_muove si_sposta si_consuma sbiadisce si_spegne si_appanna
                si_deforma si_piega si_storce vola_via rimbalza salta sussulta dondola si_assesta
                resta_fermo si_sciupa si_sporca si_copre_di_polvere
            """),
            past=PredicateTense(
                words=words("""
                    oscillò luccicò cadde rotolò si_inclinò invecchiò brillò risplendette scintillò
                    tremò vibrò barcollò traballò si_ribaltò crollò scivolò sdrucciolò precipitò
                    girò ruotò si_fermò si_arrestò si_mosse si_spostò si_consumò sbiadì si_spense
                    si_appannò si_deformò si_piegò si_storse volò_via rimbalzò saltò sussultò
                    dondolò si_assestò restò_fermo si_sciupò si_sporcò si_coprì_di_polvere
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("thing", "vehicle"),
            subject_themes=("object", "tool", "vehicle"),
            words=words("""
                si_arrugginisce cigola scricchiola sferraglia stride tintinna si_rompe si_spezza
                si_crepa si_incrina si_spacca si_inceppa si_blocca si_allenta si_stacca si_smonta
                si_guasta si_danneggia fa_fumo si_ammacca va_in_pezzi
            """),
            past=PredicateTense(
                words=words("""
                    si_arrugginì cigolò scricchiolò sferragliò stridette tintinnò si_ruppe si_spezzò
                    si_crepò si_incrinò si_spaccò si_inceppò si_bloccò si_allentò si_staccò
                    si_smontò si_guastò si_danneggiò fece_fumo si_ammaccò andò_in_pezzi
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("thing",),
            subject_themes=("music",),
            words=words("""
                suona risuona rimbomba fluttua si_leva si_spegne svanisce si_estingue tace si_ferma
                si_ripete continua prosegue si_prolunga si_propaga si_espande si_sente
                arriva_da_lontano fa_eco riecheggia cresce cala sale scende si_alza si_impone
            """),
            past=PredicateTense(
                words=words("""
                    suonò risuonò rimbombò fluttuò si_levò si_spense svanì si_estinse tacque
                    si_fermò si_ripeté continuò proseguì si_prolungò si_propagò si_espanse si_sentì
                    arrivò_da_lontano fece_eco riecheggiò crebbe calò salì scese si_alzò si_impose
                """),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("vehicle",),
            words=words("""
                viaggia si_ferma passa torna parte scivola parte_in_corsa avanza rotola accelera
                frena si_arresta si_allontana si_avvicina gira svolta fa_inversione indietreggia
                parcheggia si_posteggia arriva esce entra si_muove sferraglia vibra sbanda slitta
                ronza ruggisce si_mette_in_moto si_ferma_di_colpo prosegue_la_corsa va_piano
                sfreccia
            """),
            past=PredicateTense(
                words=words("""
                    viaggiò si_fermò passò tornò partì scivolò partì_in_corsa avanzò rotolò accelerò
                    frenò si_arrestò si_allontanò si_avvicinò girò svoltò fece_inversione
                    indietreggiò parcheggiò si_posteggiò arrivò uscì entrò si_mosse sferragliò vibrò
                    sbandò slittò ronzò ruggì si_mise_in_moto si_fermò_di_colpo proseguì_la_corsa
                    andò_piano sfrecciò
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("idea", "event"),
            words=words("""
                si_diffonde svanisce rimane fluttua cresce si_dissolve sfuma si_diluisce
                si_indebolisce si_rafforza si_intensifica sorge affiora emerge risorge rinasce torna
                ritorna si_spegne si_assesta si_insedia si_accumula si_radica mette_radici si_agita
                si_calma si_placa si_ravviva si_accende si_propaga si_espande persiste perdura
                si_dilegua sale scende cambia oscilla si_ingigantisce si_riduce si_trasforma
                si_perde si_cancella
            """),
            past=PredicateTense(
                words=words("""
                    si_diffuse svanì rimase fluttuò crebbe si_dissolse sfumò si_diluì si_indebolì
                    si_rafforzò si_intensificò sorse affiorò emerse risorse rinacque tornò ritornò
                    si_spense si_assestò si_insediò si_accumulò si_radicò mise_radici si_agitò
                    si_calmò si_placò si_ravvivò si_accese si_propagò si_espanse persistette perdurò
                    si_dileguò salì scese cambiò oscillò si_ingigantì si_ridusse si_trasformò
                    si_perse si_cancellò
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("plant",),
            words=words("""
                cresce appassisce fiorisce oscilla germoglia germina rinverdisce mette_gemme
                mette_foglie mette_radici si_apre si_schiude ingiallisce si_secca si_dissecca
                si_piega si_inclina si_curva si_allunga si_arrampica si_intreccia si_estende
                dà_frutti fruttifica profuma si_agita trema stormisce dondola si_erge si_raddrizza
                perde_le_foglie si_spoglia rivive risorge si_infittisce prospera si_sviluppa sboccia
                avvizzisce
            """),
            past=PredicateTense(
                words=words("""
                    crebbe appassì fiorì oscillò germogliò germinò rinverdì mise_gemme mise_foglie
                    mise_radici si_aprì si_schiuse ingiallì si_seccò si_disseccò si_piegò si_inclinò
                    si_curvò si_allungò si_arrampicò si_intrecciò si_estese diede_frutti fruttificò
                    profumò si_agitò tremò stormì dondolò si_erse si_raddrizzò perse_le_foglie
                    si_spogliò rivisse risorse si_infittì prosperò si_sviluppò sbocciò avvizzì
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("body",),
            words=words("""
                trema si_muove si_intorpidisce guarisce rabbrividisce batte pulsa si_contrae
                si_tende si_rilassa si_allenta si_irrigidisce si_indurisce si_ammorbidisce si_scalda
                si_raffredda si_gonfia si_sgonfia si_infiamma fa_male brucia prude formicola suda
                si_stanca si_sfinisce si_riprende si_ristora si_allunga si_accorcia si_piega
                si_flette si_alza si_abbassa si_solleva si_gira si_agita cede si_risveglia si_apre
                si_chiude sussulta pizzica
            """),
            past=PredicateTense(
                words=words("""
                    tremò si_mosse si_intorpidì guarì rabbrividì batté pulsò si_contrasse si_tese
                    si_rilassò si_allentò si_irrigidì si_indurì si_ammorbidì si_scaldò si_raffreddò
                    si_gonfiò si_sgonfiò si_infiammò fece_male bruciò prudette formicolò sudò
                    si_stancò si_sfinì si_riprese si_ristorò si_allungò si_accorciò si_piegò
                    si_flesse si_alzò si_abbassò si_sollevò si_girò si_agitò cedette si_risvegliò
                    si_aprì si_chiuse sussultò pizzicò
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            words=words("""
                matura si_raffredda bolle si_scioglie si_guasta si_scalda si_intiepidisce fuma
                emana_vapore profuma manda_un_buon_odore finisce si_esaurisce avanza resta si_riduce
                arriva_in_tavola viene_servito si_rapprende si_indurisce si_ammorbidisce marcisce
                va_a_male fermenta si_congela si_addensa si_schiarisce si_deposita riposa
                si_raffredda_del_tutto
            """),
            past=PredicateTense(
                words=words("""
                    maturò si_raffreddò bollì si_sciolse si_guastò si_scaldò si_intiepidì fumò
                    emanò_vapore profumò mandò_un_buon_odore finì si_esaurì avanzò restò si_ridusse
                    arrivò_in_tavola venne_servito si_rapprese si_indurì si_ammorbidì marcì
                    andò_a_male fermentò si_congelò si_addensò si_schiarì si_depositò riposò
                    si_raffreddò_del_tutto
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            subject_themes=("food",),
            words=words("""
                sfrigola si_dora si_abbrustolisce si_brucia si_strinaccia si_sbriciola si_sgretola
                diventa_duro diventa_stantio si_secca si_dissecca si_inumidisce ammuffisce
                inacidisce si_gonfia lievita si_cuoce si_inforna si_arrostisce si_frigge si_disfa
                si_sfalda cede
            """),
            past=PredicateTense(
                words=words("""
                    sfrigolò si_dorò si_abbrustolì si_bruciò si_strinacciò si_sbriciolò si_sgretolò
                    diventò_duro diventò_stantio si_seccò si_disseccò si_inumidì ammuffì inacidì
                    si_gonfiò lievitò si_cosse si_infornò si_arrostì si_frisse si_disfece si_sfaldò
                    cedette
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            subject_themes=("drink",),
            words=words("""
                frizza spumeggia fa_la_schiuma si_versa si_rovescia schizza sciaborda si_agita
                si_mescola si_intorbida si_schiarisce si_deposita perde_il_gas evapora trabocca
                gocciola cola si_annacqua si_concentra si_ghiaccia
            """),
            past=PredicateTense(
                words=words("""
                    frizzò spumeggiò fece_la_schiuma si_versò si_rovesciò schizzò sciabordò si_agitò
                    si_mescolò si_intorbidì si_schiarì si_depositò perse_il_gas evaporò traboccò
                    gocciolò colò si_annacquò si_concentrò si_ghiacciò
                """),
            ),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                grande piccolo veloce lento silenzioso rumoroso coraggioso pigro feroce mite arguto
                sveglio
            """),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="hungry",
            words=words("affamato famelico"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="full",
            words=words("sazio pieno"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="tired",
            words=words("stanco assonnato esausto"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="rested",
            words=words("riposato fresco vispo"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="content",
            words=words("felice contento allegro sereno"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="restless",
            words=words("annoiato curioso inquieto agitato"),
        ),
        StateGroup(
            subject=(
                "creature",
                "person",
                "plant",
                "edible",
                "thing",
                "vehicle",
                "place",
                "event",
                "idea",
                "body",
            ),
            words=words("bello strano nuovo comune raro"),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("ampio stretto tranquillo profondo scuro chiaro lontano ripido"),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("duro leggero pesante vecchio liscio trasparente robusto"),
        ),
        StateGroup(
            subject=("edible",),
            words=words("dolce salato piccante aspro caldo freddo saporito"),
        ),
        StateGroup(
            subject=("idea",),
            words=words("semplice evidente vago eterno fugace"),
        ),
        StateGroup(
            subject=("plant",),
            words=words("verde rigoglioso profumato appassito"),
        ),
        StateGroup(
            subject=("body",),
            words=words("caldo freddo dolente rigido"),
        ),
    ),
    modifiers=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                coraggioso vivace gentile occupato pigro timido sveglio giovane vecchio piccolo
                grande silenzioso allegro paziente agile curioso
            """),
        ),
        ModifierGroup(
            subject=("person",),
            words=words("giovane gentile severo serio occupato sincero"),
        ),
        ModifierGroup(
            subject=("creature",),
            words=words("veloce feroce mansueto paffuto piccolino"),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("food",),
            words=words("""
                dolce piccante tiepido fresco croccante saporito fragrante caldo salato morbido
                maturo gustoso
            """),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("drink",),
            words=words("dolce tiepido freddo fresco caldo fragrante forte amaro"),
        ),
        ModifierGroup(
            subject=("thing", "vehicle"),
            words=words("""
                vecchio nuovo piccolo grande leggero pesante lucente liscio trasparente duro bello
                prezioso antico
            """),
        ),
        ModifierGroup(
            subject=("vehicle",),
            words=words("veloce lento robusto"),
        ),
        ModifierGroup(
            subject=("place",),
            words=words("""
                tranquillo ampio scuro luminoso strano vecchio accogliente isolato affollato
                silenzioso remoto lontano vicino vuoto solitario soleggiato
            """),
        ),
        ModifierGroup(
            subject=("plant",),
            words=words("""
                verde rigoglioso profumato giovane appassito alto piccolo tenero fresco
            """),
        ),
        ModifierGroup(
            subject=("idea",),
            words=words("vago vecchio nuovo strano chiaro prezioso piccolo curioso"),
        ),
        ModifierGroup(
            subject=("event",),
            words=words("lungo breve tranquillo soleggiato nuvoloso rumoroso improvviso"),
        ),
        ModifierGroup(
            subject=("body",),
            words=words("piccolo freddo caldo esile robusto"),
        ),
        ModifierGroup(
            subject=(
                "creature",
                "person",
                "plant",
                "thing",
                "vehicle",
                "place",
                "event",
                "idea",
                "body",
            ),
            words=words("bello misterioso strano nuovo"),
        ),
    ),
    manners=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                in_silenzio lentamente rapidamente dolcemente improvvisamente appena da_solo
                brevemente costantemente audacemente con_cura avidamente tranquillamente
                allegramente fortemente pazientemente leggermente serenamente vivacemente goffamente
                con_calma
            """),
        ),
        ModifierGroup(
            subject=("plant", "edible", "thing", "vehicle", "place", "event", "idea", "body"),
            words=words("""
                in_silenzio lentamente dolcemente improvvisamente appena di_nuovo ancora piano_piano
                debolmente a_poco_a_poco gradualmente
            """),
        ),
    ),
    times=SentenceTimes(
        day=words("""
            all'alba di_prima_mattina al_mattino a_mezzogiorno nel_pomeriggio al_tramonto di_sera
            di_notte a_notte_fonda a_mezzanotte
        """),
        any=words("""
            in_primavera in_estate in_autunno in_inverno nel_fine_settimana nei_giorni_festivi
            tutto_il_giorno
        """),
        past=words("ieri la_settimana_scorsa tempo_fa quel_giorno quella_notte una_volta"),
        present=words("oggi poco_fa domani la_settimana_prossima"),
        habitual=words("di_questi_tempi a_volte ogni_giorno ogni_notte"),
    ),
    homes=words("casa"),
    join=SentenceJoin(word="e"),
    connectives={
        "additive": words("e_poi inoltre,"),
        "temporal": words("dopo infine intanto, più_tardi alla_fine poco_dopo"),
        "contrastive": words("ma tuttavia, eppure invece,"),
        "causal": words("allora perciò così"),
    },
    traits={
        "flier": words("""
            uccello rondine passero corvo falco aquila pavone pappagallo gufo colomba gru cigno
            anatra oca farfalla ape libellula cicala mosca zanzara pipistrello airone pellicano
            drago fenice fata pegaso grifone angelo valchiria
        """),
        "swimmer": words("""
            coccodrillo tartaruga rana rospo pesce balena delfino squalo polpo calamaro gambero
            granchio tricheco foca pinguino sirena kraken naiade
        """),
        "crawler": words("""
            coccodrillo serpente lucertola tartaruga lumaca formica ragno verme granchio basilisco
        """),
        "lifeless": words("""
            incantesimo maledizione profezia amuleto talismano runa portale santuario idolo totem
            augurio presagio bestiario
        """),
        "placeless": words("""
            sabbia ciottolo terremoto masso geyser fumarola stalattite stalagmite eco brace stella
            cometa meteora aurora falce_lunare eclissi zenit satellite ammasso orbita gravità
            rotazione rivoluzione anno_luce astro eclittica meridiano plenilunio novilunio perigeo
            vespro supernova quasar pulsar
        """),
    },
    interjections=words("""
        oh, ah, ehi, caspita, mamma_mia, guarda, davvero, ohi, accidenti, cavolo, santo_cielo, dai,
    """),
    pronouns={"n": ("",)},
    object_pronouns=SentenceObjectPronouns(words={"m": ("lo",), "f": ("la",)}, clitic=True),
    numeral=SentenceNumeral(
        order="before",
        counters={},
        count=(2, 12),
        currency="euro",
        amounts=(100, 500, 1000, 5000, 12000, 25000, 50000, 100000),
        group=".",
        gap=" ",
    ),
    calendar=SentenceCalendar(
        date="D MMMM Y",
        months=words("""
            gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre
            dicembre
        """),
        clock="h:mm",
        years=(2020, 2030),
        copula=StateGroup(
            subject=("event",),
            words=words("è"),
            past=PredicateTense(
                words=words("fu"),
            ),
        ),
    ),
    frames=(
        SentenceFrame(
            (
                SentencePart("date", head="il", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("clock", head="alle", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("date", head="il", copula="head"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("clock", head="alle", copula="head"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            20,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            18,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="in", modifiable=True, bare=True),
            ),
            14,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="verso", modifiable=True),
            ),
            8,
            fields=("go",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="a", modifiable=True, bare=True),
            ),
            8,
            fields=("arrive",),
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="verso", modifiable=True),
            ),
            4,
            fields=("go",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="a", modifiable=True, bare=True),
                SentencePart("manner"),
            ),
            3,
            fields=("arrive",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="è", past_head="era"),
            ),
            12,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("manner"),
            ),
            10,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            8,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
                SentencePart("place", head="in", modifiable=True, bare=True),
            ),
            7,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="in", modifiable=True, bare=True),
            ),
            6,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
                SentencePart("manner"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("money"),
            ),
            6,
        ),
    ),
)
