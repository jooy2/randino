"""The es sentence grammar: the verbs, the predicates and the shapes.

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

ES = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminators={"statement": ".", "question": "?", "exclamation": "!", "trailing": "…"},
    openers={"question": "¿", "exclamation": "¡"},
    quotes={"double": ("«", "»"), "single": ("“", "”")},
    articles={
        "m": (("", "el"),),
        "f": (
            ("aguamarina", "la"),
            ("aguanieve", "la"),
            ("agua", "el"),
            ("alma", "el"),
            ("ancla", "el"),
            ("hacha", "el"),
            ("águila", "el"),
            ("", "la"),
        ),
    },
    predicate_agrees=True,
    verbs=(
        VerbGroup(
            field="rise",
            subject=("creature", "person"),
            words=words("se_despierta se_levanta se_incorpora"),
            past=PredicateTense(
                words=words("se_despertó se_levantó se_incorporó"),
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            requires="destination",
            words=words("va corre camina se_dirige sube baja"),
            past=PredicateTense(
                words=words("fue corrió caminó se_dirigió subió bajó"),
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            words=words("parte se_marcha sale"),
            past=PredicateTense(
                words=words("partió se_marchó salió"),
            ),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            requires="destination",
            words=words("llega vuelve regresa"),
            past=PredicateTense(
                words=words("llegó volvió regresó"),
            ),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            words=words("retorna vuelve_a_casa regresa_a_casa"),
            past=PredicateTense(
                words=words("retornó volvió_a_casa regresó_a_casa"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            words=words("corre camina salta nada vuela repta vaga pasa pasea deambula"),
            past=PredicateTense(
                words=words("corrió caminó saltó nadó voló reptó vagó pasó paseó deambuló"),
            ),
        ),
        VerbGroup(
            field="wait",
            subject=("creature", "person"),
            words=words("espera se_esconde mira_alrededor vacila se_detiene aguarda"),
            past=PredicateTense(
                words=words("esperó se_escondió miró_alrededor vaciló se_detuvo aguardó"),
            ),
        ),
        VerbGroup(
            field="rest",
            subject=("creature", "person"),
            words=words("descansa se_sienta se_acuesta se_apoya se_acurruca reposa"),
            past=PredicateTense(
                words=words("descansó se_sentó se_acostó se_apoyó se_acurrucó reposó"),
            ),
        ),
        VerbGroup(
            field="sleep",
            subject=("creature", "person"),
            words=words("duerme se_adormece se_duerme dormita"),
            past=PredicateTense(
                words=words("durmió se_adormeció se_durmió dormitó"),
            ),
        ),
        VerbGroup(
            field="express",
            subject=("creature", "person"),
            words=words("ríe llora bosteza suspira sonríe tararea murmura grita"),
            past=PredicateTense(
                words=words("rió lloró bostezó suspiró sonrió tarareó murmuró gritó"),
            ),
        ),
        VerbGroup(
            field="play",
            subject=("creature", "person"),
            words=words("baila canta rueda juega brinca retoza"),
            past=PredicateTense(
                words=words("bailó cantó rodó jugó brincó retozó"),
            ),
        ),
        VerbGroup(
            field="think",
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("recuerda olvida imagina cuenta evoca añora"),
            past=PredicateTense(
                words=words("recordó olvidó imaginó contó evocó añoró"),
            ),
        ),
        VerbGroup(
            field="look",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("mira observa contempla examina toca acaricia"),
            past=PredicateTense(
                words=words("miró observó contempló examinó tocó acarició"),
            ),
        ),
        VerbGroup(
            field="search",
            subject=("creature", "person"),
            words=words("busca rebusca husmea explora"),
            past=PredicateTense(
                words=words("buscó rebuscó husmeó exploró"),
            ),
        ),
        VerbGroup(
            field="find",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("encuentra descubre halla recoge"),
            past=PredicateTense(
                words=words("encontró descubrió halló recogió"),
            ),
        ),
        VerbGroup(
            field="take",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("elige toma agarra coge saca recibe"),
            past=PredicateTense(
                words=words("eligió tomó agarró cogió sacó recibió"),
            ),
        ),
        VerbGroup(
            field="carry",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("lleva trae carga acarrea"),
            past=PredicateTense(
                words=words("llevó trajo cargó acarreó"),
            ),
        ),
        VerbGroup(
            field="hide",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("esconde guarda oculta entierra conserva"),
            past=PredicateTense(
                words=words("escondió guardó ocultó enterró conservó"),
            ),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("hace construye talla pinta teje arma"),
            past=PredicateTense(
                words=words("hizo construyó talló pintó tejió armó"),
            ),
        ),
        VerbGroup(
            field="tend",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("repara limpia pule arregla ordena ajusta"),
            past=PredicateTense(
                words=words("reparó limpió pulió arregló ordenó ajustó"),
            ),
        ),
        VerbGroup(
            field="sell",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("vende entrega cede ofrece"),
            past=PredicateTense(
                words=words("vendió entregó cedió ofreció"),
            ),
        ),
        VerbGroup(
            field="buy",
            subject=("person",),
            object=("thing", "vehicle", "edible"),
            words=words("compra adquiere encarga consigue"),
            past=PredicateTense(
                words=words("compró adquirió encargó consiguió"),
            ),
        ),
        VerbGroup(
            field="cook",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("hornea calienta cocina corta asa sirve"),
            past=PredicateTense(
                words=words("horneó calentó cocinó cortó asó sirvió"),
            ),
        ),
        VerbGroup(
            field="eat",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("come mastica prueba mordisquea devora"),
            past=PredicateTense(
                words=words("comió masticó probó mordisqueó devoró"),
            ),
        ),
        VerbGroup(
            field="drink",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("drink",),
            words=words("bebe sorbe apura saborea"),
            past=PredicateTense(
                words=words("bebió sorbió apuró saboreó"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("place",),
            words=words("se_calma oscurece se_ilumina se_llena se_vacía se_anima"),
            past=PredicateTense(
                words=words("se_calmó oscureció se_iluminó se_llenó se_vació se_animó"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            words=words("brilla fluye se_ahonda empieza termina continúa pasa"),
            past=PredicateTense(
                words=words("brilló fluyó se_ahondó empezó terminó continuó pasó"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("thing", "vehicle"),
            words=words("se_mece reluce cae rueda se_inclina envejece"),
            past=PredicateTense(
                words=words("se_meció relució cayó rodó se_inclinó envejeció"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("vehicle",),
            words=words("circula se_detiene pasa regresa parte resbala"),
            past=PredicateTense(
                words=words("circuló se_detuvo pasó regresó partió resbaló"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("idea", "event"),
            words=words("se_extiende desaparece permanece flota se_ahonda"),
            past=PredicateTense(
                words=words("se_extendió desapareció permaneció flotó se_ahondó"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("plant",),
            words=words("crece se_marchita florece se_mece brota"),
            past=PredicateTense(
                words=words("creció se_marchitó floreció se_meció brotó"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("body",),
            words=words("tiembla se_mueve se_entumece sana"),
            past=PredicateTense(
                words=words("tembló se_movió se_entumeció sanó"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            words=words("madura se_enfría hierve se_derrite se_estropea"),
            past=PredicateTense(
                words=words("maduró se_enfrió hirvió se_derritió se_estropeó"),
            ),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                grande pequeño rápido lento silencioso ruidoso valiente perezoso ocupado fiero manso
                listo
            """),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="hungry",
            head="está",
            past_head="estaba",
            words=words("hambriento famélico"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="full",
            head="está",
            past_head="estaba",
            words=words("satisfecho lleno"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="tired",
            head="está",
            past_head="estaba",
            words=words("cansado soñoliento agotado"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="rested",
            head="está",
            past_head="estaba",
            words=words("descansado fresco animado"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="content",
            head="está",
            past_head="estaba",
            words=words("feliz contento alegre tranquilo"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="restless",
            head="está",
            past_head="estaba",
            words=words("aburrido curioso inquieto nervioso"),
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
            words=words("hermoso extraño nuevo común raro"),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("ancho estrecho tranquilo profundo oscuro claro lejano empinado"),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("duro ligero pesado viejo liso transparente robusto"),
        ),
        StateGroup(
            subject=("edible",),
            words=words("dulce salado picante ácido caliente frío sabroso"),
        ),
        StateGroup(
            subject=("idea",),
            words=words("sencillo evidente vago eterno fugaz"),
        ),
        StateGroup(
            subject=("plant",),
            words=words("verde frondoso fragante marchito"),
        ),
        StateGroup(
            subject=("body",),
            words=words("cálido frío dolorido rígido"),
        ),
    ),
    modifiers=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                valiente animado amable ocupado perezoso tímido listo joven viejo pequeño grande
                silencioso alegre paciente ágil curioso
            """),
        ),
        ModifierGroup(
            subject=("person",),
            words=words("joven amable severo serio ocupado sincero"),
        ),
        ModifierGroup(
            subject=("creature",),
            words=words("veloz feroz manso rechoncho pequeñito"),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("food",),
            words=words("""
                dulce picante tibio fresco crujiente sabroso fragante caliente salado blando maduro
                rico
            """),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("drink",),
            words=words("dulce tibio frío fresco caliente fragante espumoso fuerte"),
        ),
        ModifierGroup(
            subject=("thing", "vehicle"),
            words=words("""
                viejo nuevo pequeño grande ligero pesado brillante liso transparente duro bonito
                precioso antiguo
            """),
        ),
        ModifierGroup(
            subject=("vehicle",),
            words=words("rápido lento robusto"),
        ),
        ModifierGroup(
            subject=("place",),
            words=words("""
                tranquilo amplio oscuro luminoso extraño viejo acogedor apartado bullicioso
                silencioso remoto lejano cercano vacío solitario soleado
            """),
        ),
        ModifierGroup(
            subject=("plant",),
            words=words("verde frondoso fragante joven marchito alto pequeño tierno fresco"),
        ),
        ModifierGroup(
            subject=("idea",),
            words=words("vago viejo nuevo extraño claro precioso pequeño raro"),
        ),
        ModifierGroup(
            subject=("event",),
            words=words("largo breve tranquilo soleado nublado ruidoso repentino"),
        ),
        ModifierGroup(
            subject=("body",),
            words=words("pequeño frío cálido esbelto robusto"),
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
            words=words("hermoso misterioso extraño nuevo"),
        ),
    ),
    manners=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                en_silencio despacio rápidamente suavemente de_repente apenas a_solas brevemente
                firmemente audazmente con_cuidado ansiosamente tranquilamente alegremente torpemente
                fuertemente pacientemente ligeramente serenamente vivamente con_calma
            """),
        ),
        ModifierGroup(
            subject=("plant", "edible", "thing", "vehicle", "place", "event", "idea", "body"),
            words=words("""
                en_silencio despacio suavemente de_repente apenas otra_vez todavía de_nuevo
                poco_a_poco lentamente débilmente aún gradualmente
            """),
        ),
    ),
    times=SentenceTimes(
        day=words("""
            al_amanecer de_madrugada por_la_mañana a_mediodía por_la_tarde al_anochecer por_la_noche
            a_medianoche
        """),
        any=words("""
            en_primavera en_verano en_otoño en_invierno los_fines_de_semana en_los_días_festivos
            todo_el_día
        """),
        past=words("ayer la_semana_pasada hace_tiempo aquel_día aquella_noche una_vez"),
        present=words("hoy hace_poco mañana la_semana_que_viene"),
        habitual=words("estos_días a_veces cada_día cada_noche"),
    ),
    homes=words("casa cabaña"),
    join=SentenceJoin(word="y"),
    connectives={
        "additive": words("y_luego además,"),
        "temporal": words("después por_fin mientras_tanto, más_tarde al_final poco_después"),
        "contrastive": words("pero sin_embargo, aun_así en_cambio, no_obstante,"),
        "causal": words("entonces por_eso así_que"),
    },
    interjections=words("""
        ay, oh, vaya, caramba, madre_mía, mira, desde_luego, uy, anda, hombre, cielos, vamos,
    """),
    pronouns={"n": ("",)},
    numeral=SentenceNumeral(
        order="before",
        counters={},
        count=(2, 12),
        currency="euros",
        amounts=(100, 500, 1000, 5000, 12000, 25000, 50000, 100000),
        group=".",
        gap=" ",
    ),
    calendar=SentenceCalendar(
        date="D de MMMM de Y",
        months=words("""
            enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre
        """),
        clock="h:mm",
        years=(2020, 2030),
        copula=StateGroup(
            subject=("event",),
            words=words("es"),
            past=PredicateTense(
                words=words("fue"),
            ),
        ),
    ),
    frames=(
        SentenceFrame(
            (
                SentencePart("date", head="el", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("clock", head="a las", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("date", head="el", copula="head"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("clock", head="a las", copula="head"),
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
                SentencePart("place", head="en", modifiable=True),
            ),
            14,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="hacia", modifiable=True),
            ),
            8,
            fields=("go",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="hasta", modifiable=True),
            ),
            8,
            fields=("arrive",),
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="hacia", modifiable=True),
            ),
            4,
            fields=("go",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="hasta", modifiable=True),
                SentencePart("manner"),
            ),
            3,
            fields=("arrive",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="es", past_head="era"),
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
                SentencePart("place", head="en", modifiable=True),
            ),
            7,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="en", modifiable=True),
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
