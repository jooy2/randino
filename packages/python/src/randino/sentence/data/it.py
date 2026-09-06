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
            words=words("si_sveglia si_alza si_desta"),
            past=PredicateTense(
                words=words("si_svegliò si_alzò si_destò"),
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            requires="destination",
            words=words("va corre cammina si_dirige sale scende"),
            past=PredicateTense(
                words=words("andò corse camminò si_diresse salì scese"),
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            words=words("parte se_ne_va esce"),
            past=PredicateTense(
                words=words("partì se_ne_andò uscì"),
            ),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            requires="destination",
            words=words("torna arriva rientra giunge"),
            past=PredicateTense(
                words=words("tornò arrivò rientrò giunse"),
            ),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            words=words("ritorna rincasa riappare"),
            past=PredicateTense(
                words=words("ritornò rincasò riapparve"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            words=words("""
                corre cammina salta nuota vola striscia vaga passa passeggia gironzola
            """),
            past=PredicateTense(
                words=words("""
                    corse camminò saltò nuotò volò strisciò vagò passò passeggiò gironzolò
                """),
            ),
        ),
        VerbGroup(
            field="wait",
            subject=("creature", "person"),
            words=words("aspetta si_nasconde si_guarda_intorno esita si_ferma attende"),
            past=PredicateTense(
                words=words("aspettò si_nascose si_guardò_intorno esitò si_fermò attese"),
            ),
        ),
        VerbGroup(
            field="rest",
            subject=("creature", "person"),
            words=words("riposa si_siede si_sdraia si_appoggia si_rannicchia si_riposa"),
            past=PredicateTense(
                words=words("riposò si_sedette si_sdraiò si_appoggiò si_rannicchiò si_riposò"),
            ),
        ),
        VerbGroup(
            field="sleep",
            subject=("creature", "person"),
            words=words("dorme si_addormenta sonnecchia si_assopisce"),
            past=PredicateTense(
                words=words("dormì si_addormentò sonnecchiò si_assopì"),
            ),
        ),
        VerbGroup(
            field="express",
            subject=("creature", "person"),
            words=words("ride piange sbadiglia sospira sorride canticchia borbotta grida"),
            past=PredicateTense(
                words=words("rise pianse sbadigliò sospirò sorrise canticchiò borbottò gridò"),
            ),
        ),
        VerbGroup(
            field="play",
            subject=("creature", "person"),
            words=words("balla canta rotola gioca saltella scherza"),
            past=PredicateTense(
                words=words("ballò cantò rotolò giocò saltellò scherzò"),
            ),
        ),
        VerbGroup(
            field="think",
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("ricorda dimentica immagina conta rievoca rimpiange"),
            past=PredicateTense(
                words=words("ricordò dimenticò immaginò contò rievocò rimpianse"),
            ),
        ),
        VerbGroup(
            field="look",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("guarda osserva contempla esamina tocca accarezza"),
            past=PredicateTense(
                words=words("guardò osservò contemplò esaminò toccò accarezzò"),
            ),
        ),
        VerbGroup(
            field="search",
            subject=("creature", "person"),
            words=words("cerca rovista fruga esplora"),
            past=PredicateTense(
                words=words("cercò rovistò frugò esplorò"),
            ),
        ),
        VerbGroup(
            field="find",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("trova scopre scorge raccoglie"),
            past=PredicateTense(
                words=words("trovò scoprì scorse raccolse"),
            ),
        ),
        VerbGroup(
            field="take",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("sceglie prende afferra piglia tira_fuori riceve"),
            past=PredicateTense(
                words=words("scelse prese afferrò pigliò tirò_fuori ricevette"),
            ),
        ),
        VerbGroup(
            field="carry",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("porta reca trasporta trascina"),
            past=PredicateTense(
                words=words("portò recò trasportò trascinò"),
            ),
        ),
        VerbGroup(
            field="hide",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("nasconde ripone custodisce sotterra conserva"),
            past=PredicateTense(
                words=words("nascose ripose custodì sotterrò conservò"),
            ),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("costruisce fabbrica intaglia dipinge tesse monta"),
            past=PredicateTense(
                words=words("costruì fabbricò intagliò dipinse tessé montò"),
            ),
        ),
        VerbGroup(
            field="tend",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("ripara pulisce lucida sistema riordina aggiusta"),
            past=PredicateTense(
                words=words("riparò pulì lucidò sistemò riordinò aggiustò"),
            ),
        ),
        VerbGroup(
            field="sell",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("vende consegna cede offre"),
            past=PredicateTense(
                words=words("vendette consegnò cedette offrì"),
            ),
        ),
        VerbGroup(
            field="buy",
            subject=("person",),
            object=("thing", "vehicle", "edible"),
            words=words("compra acquista ordina procura"),
            past=PredicateTense(
                words=words("comprò acquistò ordinò procurò"),
            ),
        ),
        VerbGroup(
            field="cook",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("cuoce scalda cucina taglia arrostisce serve"),
            past=PredicateTense(
                words=words("cosse scaldò cucinò tagliò arrostì servì"),
            ),
        ),
        VerbGroup(
            field="eat",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("mangia mastica assaggia rosicchia divora"),
            past=PredicateTense(
                words=words("mangiò masticò assaggiò rosicchiò divorò"),
            ),
        ),
        VerbGroup(
            field="drink",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("drink",),
            words=words("beve sorseggia tracanna gusta"),
            past=PredicateTense(
                words=words("bevve sorseggiò tracannò gustò"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("place",),
            words=words("si_calma si_oscura si_illumina si_riempie si_svuota si_anima"),
            past=PredicateTense(
                words=words("si_calmò si_oscurò si_illuminò si_riempì si_svuotò si_animò"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            words=words("brilla scorre si_approfondisce inizia finisce continua passa"),
            past=PredicateTense(
                words=words("brillò scorse si_approfondì iniziò finì continuò passò"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("thing", "vehicle"),
            words=words("oscilla luccica cade rotola si_inclina invecchia"),
            past=PredicateTense(
                words=words("oscillò luccicò cadde rotolò si_inclinò invecchiò"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("vehicle",),
            words=words("viaggia si_ferma passa torna parte scivola"),
            past=PredicateTense(
                words=words("viaggiò si_fermò passò tornò partì scivolò"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("idea", "event"),
            words=words("si_diffonde svanisce rimane fluttua cresce"),
            past=PredicateTense(
                words=words("si_diffuse svanì rimase fluttuò crebbe"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("plant",),
            words=words("cresce appassisce fiorisce oscilla germoglia"),
            past=PredicateTense(
                words=words("crebbe appassì fiorì oscillò germogliò"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("body",),
            words=words("trema si_muove si_intorpidisce guarisce"),
            past=PredicateTense(
                words=words("tremò si_mosse si_intorpidì guarì"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            words=words("matura si_raffredda bolle si_scioglie si_guasta"),
            past=PredicateTense(
                words=words("maturò si_raffreddò bollì si_sciolse si_guastò"),
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
    interjections=words("""
        oh, ah, ehi, caspita, mamma_mia, guarda, davvero, ohi, accidenti, cavolo, santo_cielo, dai,
    """),
    pronouns={"n": ("",)},
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
