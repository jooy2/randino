"""Italian word pools."""

from randino._internal.parse import tagged_nouns, words
from randino.word.data._types import SyllableSynthesis, WordFrame, WordLanguageData

# Written once, with the gender each noun carries; `tagged_nouns` splits the tags
# back off into the lookup the modifiers agree against.
_POOLS, _GENDER = tagged_nouns(
    {
        "animal": """
        gatto:m cane:m leone:m tigre:f leopardo:m ghepardo:m volpe:f lupo:m orso:m
        panda:m lontra:f coniglio:m scoiattolo:m elefante:m cervo:m cavallo:m asino:m
        mucca:f toro:m capra:f pecora:f maiale:m scimmia:f gorilla:m coccodrillo:m
        serpente:m lucertola:f tartaruga:f rana:f rospo:m uccello:m rondine:f passero:m
        corvo:m falco:m aquila:f pavone:m pappagallo:m gufo:m colomba:f gru:f cigno:m
        anatra:f oca:f gallina:f pesce:m balena:f delfino:m squalo:m polpo:m calamaro:m
        gambero:m granchio:m lumaca:f farfalla:f ape:f formica:f ragno:m libellula:f
        cicala:f mosca:f zanzara:f verme:m pipistrello:m riccio:m procione:m tasso:m
        lince:f bisonte:m alce:m cammello:m koala:m bradipo:m furetto:m talpa:f airone:m
        pellicano:m tricheco:m donnola:f gazzella:f zebra:f bufalo:m foca:f pinguino:m
        struzzo:m
    """,
        "object": """
        bottiglia:f matita:f gomma:f ombrello:m lampada:f lanterna:f specchio:m chiave:f
        lucchetto:m borsa:f bottone:m ago:m filo:m pennello:m vernice:f carta:f
        quaderno:m lettera:f cartolina:f francobollo:m mappa:f cannocchiale:m
        microscopio:m macchina:f pellicola:f radio:f palloncino:m aquilone:m trottola:f
        biglia:f dado:m puzzle:m vela:f ancora:f tenda:f torcia:f
        fiammifero:m candela:f vaso:m teiera:f tazza:f cucchiaio:m pentola:f
        ingranaggio:m molla:f magnete:m nastro:m busta:f cuscino:m coperta:f cesto:m
        scopa:f fischietto:m corda:f secchio:m ventaglio:m scudo:m rete:f canna:f
        brocca:f pettine:m campanella:f imbuto:m vassoio:m scatola:f barile:m latta:f
        fiala:f
    """,
        "nature": """
        mare:m fiume:m lago:m cascata:f valle:f montagna:f collina:f prato:m bosco:m
        grotta:f deserto:m sabbia:f roccia:f ciottolo:m vulcano:m terremoto:m
        ghiacciaio:m scogliera:f palude:f ruscello:m baia:f duna:f vetta:f brughiera:f
        steppa:f savana:f estuario:m delta:m laguna:f atollo:m fiordo:m cala:f capo:m
        penisola:f istmo:m arcipelago:m isolotto:m altopiano:m canyon:m rupe:f
        crepaccio:m morena:f ghiaione:m masso:m banco:m secca:f scoglio:m abisso:m
        geyser:m fumarola:f dolina:f stalattite:f stalagmite:f caverna:f cengia:f
        pendio:m ombra:f eco:f brace:f sorgente:f riva:f litorale:m
    """,
        "plant": """
        albero:m foglia:f fiore:m radice:f seme:m frutto:m muschio:m felce:f bambù:m
        pino:m acero:m ciliegio:m rosa:f loto:m crisantemo:m orchidea:f tarassaco:m
        girasole:m ninfea:f erba:f ramo:m germoglio:m bocciolo:m petalo:m polline:m
        pigna:f ghianda:f ginkgo:m salice:m betulla:f cedro:m abete:m quercia:f
        castagno:m noce:m alga:f siepe:f mazzo:m cactus:m aloe:f
        basilico:m timo:m origano:m prezzemolo:m coriandolo:m finocchio:m aneto:m
        salvia:f dragoncello:m menta:f camomilla:f lavanda:f edera:f palma:f
    """,
        "gem": """
        oro:m argento:m rame:m ferro:m acciaio:m bronzo:m ottone:m stagno:m zinco:m
        platino:m cristallo:m quarzo:m ametista:f agata:f ambra:f perla:f giada:f
        opale:m ossidiana:f marmo:m granito:m calcare:m basalto:m selce:f meteorite:m
        minerale:m gemma:f lingotto:m mica:f fluorite:f calcite:f malachite:f granato:m
        zolfo:m avorio:m pepita:f grafite:f mercurio:m gesso:m olivina:f tormalina:f
        rubino:m zaffiro:m smeraldo:m topazio:m zircone:m pirite:f magnetite:f ematite:f
        cinabro:m galena:f talco:m bismuto:m
    """,
        "concept": """
        libertà:f pace:f giustizia:f verità:f saggezza:f memoria:f fantasia:f racconto:m
        poesia:f schizzo:m grammatica:f logica:f fisica:f chimica:f biologia:f
        filosofia:f matematica:f geometria:f algebra:f storia:f mito:m leggenda:f
        favola:f proverbio:m indovinello:m segreto:m promessa:f viaggio:m avventura:f
        traversata:f scoperta:f esperimento:m domanda:f risposta:f dibattito:m
        consiglio:m festa:f dimensione:f equilibrio:m armonia:f rito:m usanza:f
        cultura:f lingua:f alfabeto:m cifra:f archivio:m almanacco:m orizzonte:m
        intuizione:f ragione:f giudizio:m dottrina:f teorema:m assioma:m ipotesi:f
        paradosso:m dilemma:m paradigma:m premessa:f deduzione:f induzione:f analogia:f
        metafora:f simbolo:m cronaca:f manifesto:m trattato:m alleanza:f stirpe:f
        eredità:f tradizione:f cerimonia:f soglia:f
    """,
        "myth": """
        drago:m fenice:f unicorno:m sirena:f fata:f folletto:m elfo:m nano:m troll:m
        orco:m gigante:m chimera:f idra:f grifone:m centauro:m minotauro:m sfinge:f
        pegaso:m kraken:m basilisco:m golem:m vampiro:m licantropo:m spettro:m
        fantasma:m anima:f spirito:m demone:m angelo:m dea:f dio:m incantesimo:m
        maledizione:f profezia:f oracolo:m amuleto:m talismano:m runa:f portale:m
        santuario:m idolo:m totem:m ninfa:f naiade:f driade:f valchiria:f musa:f
        stregone:m strega:f negromante:m alchimista:m saggio:m augurio:m presagio:m
        bestiario:m
    """,
        "job": """
        cavaliere:m cacciatore:m ladro:m pirata:m marinaio:m capitano:m cuoco:m
        giardiniere:m fabbro:m detective:m poeta:m pittore:m ballerino:m pagliaccio:m
        viaggiatore:m pellegrino:m monaco:m arciere:m spadaccino:m guerriero:m
        generale:m soldato:m guardia:f portiere:m re:m regina:f principe:m principessa:f
        imperatore:m maggiordomo:m serva:f servo:m mercante:m contadino:m pescatore:m
        pastore:m boscaiolo:m barcaiolo:m cocchiere:m pilota:m ingegnere:m postino:m
        fattorino:m spazzino:m pompiere:m poliziotto:m medico:m infermiere:m
        farmacista:m veterinario:m maestro:m allievo:m giornalista:m scrittore:m
        redattore:m traduttore:m cantante:m attore:m regista:m musicista:m minatore:m
        falegname:m vasaio:m sarto:m indovino:m profeta:m sacerdote:m studioso:m
        dottore:m inventore:m esploratore:m atleta:m arbitro:m acrobata:m scultore:m
        guida:f orologiaio:m panettiere:m birraio:m profumiere:m conciatore:m
        tessitore:m
    """,
        "music": """
        pianoforte:m chitarra:f tamburo:m campana:f arpa:f canzone:f danza:f ritmo:m
        melodia:f accordo:m flauto:m tromba:f sassofono:m clarinetto:m oboe:m
        violoncello:m viola:f violino:m batteria:f piatto:m tamburello:m xilofono:m
        organo:m armonica:f fisarmonica:f liuto:m mandolino:m banjo:m spartito:m nota:f
        pausa:f scala:f coro:m assolo:m concerto:m palco:m sinfonia:f sonata:f valzer:m
        jazz:m ballata:f ninnananna:f marcia:f preludio:m interludio:m finale:m timbro:m
        orchestra:f movimento:m ouverture:f fuga:f studio:m notturno:m serenata:f
        rapsodia:f inno:m requiem:m cantata:f aria:f duetto:m trio:m quartetto:m
        quintetto:m direttore:m ottava:f semitono:m pentagramma:m metronomo:m pedale:m
        tasto:m bocchino:m
    """,
        "place": """
        mercato:m piazza:f città:f villaggio:m vicolo:m ponte:m giardino:m biblioteca:f
        museo:m teatro:m scuola:f parco:m porto:m molo:m stazione:f aeroporto:m faro:m
        castello:m mura:f palazzo:m tempio:m torre:f soffitta:f cantina:f terrazza:f
        cortile:m portico:m serra:f fienile:m baita:f belvedere:m gioco:m palestra:f
        piscina:f acquario:m galleria:f zoo:m terme:f municipio:m posta:f ospedale:m
        farmacia:f libreria:f panetteria:f caffetteria:f ristorante:m cucina:f camera:f
        salotto:m corridoio:m tunnel:m passerella:f incrocio:m viale:m fortezza:f
        fattoria:f ranch:m frutteto:m abbazia:f chiostro:m bastione:m torretta:f
        fossato:m cantiere:m accampamento:m villa:f dimora:f borgo:m
    """,
        "food": """
        riso:m pane:m pasta:f zuppa:f stufato:m insalata:f sale:m zucchero:m pepe:m
        aglio:m cipolla:f patata:f carota:f cetriolo:m zucca:f cavolo:m lattuga:f
        spinacio:m fungo:m tofu:m uovo:m formaggio:m burro:m yogurt:m mela:f fragola:f
        uva:f anguria:f pesca:f arancia:f limone:m banana:f mango:m ciliegia:f ananas:m
        cioccolato:m caramella:f biscotto:m torta:f budino:m ciambella:f cialda:f
        frittella:f hamburger:m pizza:f curry:m frittata:f risotto:m lasagna:f gnocco:m
        raviolo:m tortellino:m polenta:f focaccia:f grissino:m panino:m salsiccia:f
        prosciutto:m pancetta:f salame:m mortadella:f polpetta:f bistecca:f costoletta:f
        marmellata:f miele:m tiramisu:m cannolo:m
    """,
        "sport": """
        calcio:m baseball:m pallavolo:f tennis:m badminton:m golf:m bowling:m biliardo:m
        nuoto:m atletica:f maratona:f ginnastica:f karate:m judo:m scherma:f lotta:f
        pugilato:m tiro:m equitazione:f canottaggio:m surf:m sci:m hockey:m rugby:m
        cricket:m ciclismo:m arrampicata:f racchetta:f porta:f medaglia:f
        trofeo:m campione:m eliminatoria:f allenamento:m polo:m
        pattinaggio:m tuffo:m freccetta:f ostacolo:m giavellotto:m disco:m staffetta:f
        tabellone:m casco:m fallo:m dorso:m sollevamento:m slitta:f
        servizio:m rimbalzo:m salto:m corsa:f traguardo:m podio:m spogliatoio:m
        tribuna:f tifoseria:f
    """,
        "vehicle": """
        bicicletta:f treno:m barca:f automobile:f autobus:m taxi:m camion:m moto:f
        monopattino:m aereo:m elicottero:m astronave:f razzo:m sottomarino:m yacht:m
        cargo:m veliero:m zattera:f corazzata:f carro:m carrozza:f carriola:f trattore:m
        escavatore:m ambulanza:f funivia:f tram:m locomotiva:f canoa:f kayak:m
        mongolfiera:f dirigibile:m paracadute:m portantina:f triciclo:m furgone:m
        limousine:f spazzaneve:m monorotaia:f catamarano:m petroliera:f chiatta:f
        peschereccio:m biplano:m idrovolante:m sonda:f navetta:f monociclo:m gondola:f
        vagone:m
    """,
        "product": """
        computer:m tastiera:f mouse:m schermo:m stampante:f altoparlante:m auricolare:m
        microfono:m drone:m tablet:m telefono:m caricatore:m pila:f telecomando:m
        frigorifero:m lavatrice:f ventilatore:m stufa:f depuratore:m cuociriso:m
        microonde:m forno:m frullatore:m rasoio:m spazzolino:m dentifricio:m sapone:m
        shampoo:m profumo:m orologio:m proiettore:m router:m scanner:m asciugatrice:f
        lozione:f crema_solare:f pantofola:f sandalo:m materasso:m campanello:m
        termometro:m estintore:m calcolatrice:f lampadina:f presa:f ciabatta:f piumone:m
        federa:f asciugamano:m catino:m detersivo:m ammorbidente:m padella:f
        caffettiera:f frusta:f pelapatate:m cavatappi:m thermos:m zerbino:m gruccia:f
        armadio:m scaffale:m comodino:m
    """,
        "color": """
        cremisi:m scarlatto:m vermiglio:m magenta:m fucsia:m rosato:m arancione:m
        ambrato:m ocra:f seppia:f senape:f smeraldino:m
        turchese:m ciano:m celeste:m indaco:m lilla:m violetto:m
        porpora:f bordeaux:m ruggine:f terracotta:f crema:f beige:m cachi:m peltro:m
        ebano:m giaietto:m ceruleo:m zafferano:m acquamarina:f verderame:m celadon:m
        madreperla:f ramato:m argenteo:m bronzeo:m cenere:f fumo:m vinaccia:f grano:m
        cannella:f noce_moscata:f paprika:f
    """,
        "finance": """
        fattura:f ricevuta:f obbligazione:f azione:f dividendo:m interesse:m prestito:m
        mutuo:m deposito:m risparmio:m conto:m saldo:m bilancio:m revisione:f attivo:m
        passivo:m capitale:m ricavo:m guadagno:m margine:m avanzo:m disavanzo:m debito:m
        credito:m addebito:m assegno:m moneta:f valuta:f rendimento:m portafoglio:m
        dazio:m rimborso:m premio:m pensione:f busta_paga:f stipendio:m salario:m
        bonus:m provvigione:f royalty:f franchigia:f fusione:f acquisizione:f
        salvataggio:m garanzia:f buono:m coupon:m cassaforte:f
        tesoreria:f rimessa:f liquidazione:f arbitraggio:m scoperto:m estratto:m
        libretto:m custodia:f creditore:m debitore:m prestatore:m garante:m
        valutazione:f perizia:f inflazione:f recessione:f liquidità:f solvibilità:f
        fallimento:m donazione:f sussidio:m spesa:f sconto:m rata:f
    """,
        "tech": """
        server:m cache:f buffer:m pixel:m codec:m pacchetto:m protocollo:m coda:f
         cumulo:m puntatore:m compilatore:m firmware:m registro:m latenza:f
        gateway:m firewall:m sottorete:f host:m carico_utile:m checksum:m schema:m
        cursore:m backup:m cluster:m frammento:m replica:f istantanea:f contenitore:m
        pipeline:f repository:m debugger:m macro:f matrice:f intero:m sintassi:f
        analizzatore:m assemblatore:m istruzione:f interruzione:f bitrate:m throughput:m
        handshake:m endpoint:m cifratura:f decifratura:f hashing:m
        rendering:m shader:m texture:f poligono:m reticolo:m ottetto:m commutazione:f
        multicast:m broadcast:m datagramma:m bootloader:m partizione:f cartella:f
        collegamento:m ripristino:m migrazione:f
    """,
        "weather": """
        nuvola:f vento:m pioggia:f neve:f brina:f nebbia:f rugiada:f arcobaleno:m
        tramonto:m fulmine:m tuono:m acquazzone:m monsone:m tifone:m turbine:m bufera:f
        pioggerella:f grandine:f nevischio:m burrasca:f raffica:f ciclone:m tempesta:f
        temporale:m diluvio:m foschia:f caligine:f umidità:f previsione:f nuvolone:m
        sole:m gelata:f disgelo:m mulinello:m brezza:f zefiro:m libeccio:m scirocco:m
        maestrale:m tramontana:f anticiclone:m clima:m temperatura:f pressione:f
        nubifragio:m lampo:m saetta:f sereno:m schiarita:f afa:f galaverna:f
    """,
        "space": """
        stella:f luna:f galassia:f cometa:f meteora:f aurora:f
        falce_lunare:f eclissi:f zenit:m universo:m pianeta:m satellite:m asteroide:m
        nebulosa:f ammasso:m orbita:f gravità:f rotazione:f rivoluzione:f cratere:m
        anno_luce:m astro:m firmamento:m eclittica:f meridiano:m stratosfera:f
        atmosfera:f vuoto:m plenilunio:m novilunio:m polare:f vespro:m marte:m venere:f
        giove:m saturno:m urano:m nettuno:m plutone:m supernova:f buco_nero:m quasar:m
        pulsar:f via_lattea:f cosmo:m
    """,
        "time": """
        alba:f crepuscolo:m imbrunire:m solstizio:m
        equinozio:m stagione:f momento:m eternità:f futuro:m istante:m secolo:m
        decennio:m mattino:m mezzogiorno:m pomeriggio:m sera:f notte:f mezzanotte:f
         vigilia:f ieri:m oggi:m giornata:f settimana:f quindicina:f mese:m
        trimestre:m semestre:m anno:m lustro:m millennio:m epoca:f era:f età:f
        primavera:f estate:f autunno:m inverno:m adesso:m poi:m
        infanzia:f gioventù:f maturità:f vecchiaia:f scadenza:f intervallo:m durata:f
        periodo:m anniversario:m ricorrenza:f albeggiare:m
    """,
        "emotion": """
        gioia:f tristezza:f rabbia:f paura:f sorpresa:f allegria:f giubilo:m felicità:f
        euforia:f estasi:f conforto:m sollievo:m speranza:f disperazione:f dolore:m
        malinconia:f nostalgia:f solitudine:f struggimento:m desiderio:m passione:f
        affetto:m tenerezza:f calore:m bontà:f compassione:f empatia:f pietà:f
        gratitudine:f umiltà:f pazienza:f prudenza:f temperanza:f fermezza:f integrità:f
        sincerità:f stupore:m riverenza:f serenità:f calma:f quiete:f fiducia:f dubbio:m
        sospetto:m ansia:f terrore:m panico:m furia:f collera:f fastidio:m noia:f
        apatia:f entusiasmo:m fervore:m ardore:m emozione:f illusione:f coraggio:m
        timidezza:f vergogna:f colpa:f orgoglio:m invidia:f gelosia:f avidità:f umore:m
        capriccio:m
    """,
        "body": """
        testa:f fronte:f sopracciglio:m ciglio:m palpebra:f naso:m guancia:f mento:m
        mascella:f labbro:m dente:m gengiva:f orecchio:m lobo:m collo:m
        nuca:f spalla:f gomito:m polso:m palmo:m nocca:f dito:m pollice:m unghia:f
        pugno:m petto:m costola:f pancia:f ombelico:m schiena:f vita:f anca:f coscia:f
        ginocchio:m stinco:m polpaccio:m caviglia:f tallone:m osso:m cranio:m muscolo:m
        tendine:m legamento:m cartilagine:f cuore:m polmone:m fegato:m stomaco:m rene:m
        milza:f intestino:m vescica:f cervello:m nervo:m vena:f arteria:f capillare:m
        sangue:m carne:f pelle:f poro:m capello:m barba:f lacrima:f sudore:m saliva:f
        respiro:m clavicola:f rotula:f zigomo:m timpano:m bulbo:m ruga:f lentiggine:f
        fossetta:f cicatrice:f livido:m callo:m
    """,
        "clothing": """
        cappello:m scarpa:f guanto:m sciarpa:f occhiali:m cappotto:m giaccone:m giacca:f
        camicia:f blusa:f tunica:f pantalone:m jeans:m calzoncino:m gonna:f abito:m
        gilet:m cardigan:m maglione:m felpa:f calzino:m calza:f biancheria:f pigiama:m
        grembiule:m bandana:f cravatta:f farfallino:m cintura:f fascia:f scarpetta:f
        mocassino:m stivale:m divisa:f costume:m vestaglia:f mantello:m poncho:m
        impermeabile:m giubbotto:m parka:m muta:f tuta:f manica:f colletto:m polsino:m
        orlo:m risvolto:m fodera:f tessuto:m lino:m seta:f cotone:m lana:f velluto:m
        fustagno:m flanella:f cuoio:m basco:m cuffia:f berretto:m elmetto:m turbante:m
        velo:m scialle:m
    """,
        "tool": """
        ascia:f pala:f sega:f pinza:f scalpello:m incudine:f mantice:m
        lesina:f morsetto:m morsa:f livella:f calibro:m goniometro:m righello:m
        forbice:f martello:m mazzuolo:m trapano:m pialla:f piccone:m falce:f falcetto:m
        zappa:f aratro:m rastrello:m cacciavite:m saldatore:m troncatrice:f metro:m
        compasso:m accetta:f leva:f cuneo:m carrucola:f manovella:f mazza:f cazzuola:f
        cote:f lima:f grattugia:f setaccio:m vanga:f erpice:m correggiato:m fuso:m
        spola:f rocchetto:m manico:m lama:f cassetta:f rivettatrice:f chiodatrice:f
        seghetto:m tornio:m levigatrice:f motosega:f sgorbia:f punteruolo:m squadra:f
        smusso:m
    """,
        "drink": """
        caffè:m tè:m succo:m latte:m acqua:f gassosa:f limonata:f sidro:m orzata:f
        frullato:m infuso:m tisana:f mate:m cioccolata:f macchiato:m cappuccino:m
        espresso:m corretto:m decaffeinato:m birra:f bionda:f rossa:f vino:m
           spumante:m prosecco:m champagne:m
        sherry:m vermut:m sangria:f liquore:m grappa:f acquavite:f rum:m
        gin:m vodka:m whisky:m cognac:m brandy:m tequila:m sake:m idromele:m cocktail:m
        punch:m nettare:m sciroppo:m bibita:f soda:f tonica:f granita:f
    """,
    }
)

IT = WordLanguageData(
    joiner=" ",
    capitalize=False,
    adjectives=words("""
        azzurro verde rosso nero bianco giallo dorato argenteo scuro chiaro brillante
        grande piccolo lungo corto largo stretto alto basso rapido lento forte debole
        duro morbido caldo freddo tiepido secco umido pulito nuovo vecchio giovane bello
        brutto dolce amaro salato piccante aspro soffice ruvido leggero pesante rotondo
        acuto profondo lontano vicino ricco povero raro tranquillo rumoroso coraggioso
        saggio allegro triste libero eterno trasparente misterioso solitario radioso
        selvaggio sereno silenzioso antico moderno infinito cavo setoso nebbioso
        nuvoloso piovoso soleggiato nevoso ventoso arrugginito curioso birichino nobile
        umile gentile feroce agile spinoso irrequieto robusto vivido tenue grigio
        pallido intenso gelido ardente cupo luminoso maestoso semplice elegante buffo
        astuto audace pigro sveglio affilato liscio denso scarso
    """),
    actions=words("""
        dormito perduto trovato nascosto stancato bagnato bruciato gelato sciolto rotto
        aperto chiuso legato appeso caduto seduto sdraiato dimenticato ricordato amato
        temuto desiderato cercato custodito ferito guarito salvato perdonato benedetto
        incantato spaventato sorpreso arrabbiato calmato animato sfinito sognato
        pettinato vestito segnato dipinto ricamato tessuto cucito intagliato forgiato
        lucidato piantato seminato raccolto annaffiato potato fiorito maturato tostato
        bollito arrostito fritto infornato montato macinato tagliato tritato avvolto
        sigillato firmato scritto letto raccontato narrato cantato ballato suonato
        taciuto gridato sussurrato pianto volato nuotato saltato arrampicato rotolato
        trascinato spinto tirato lanciato preso alzato abbassato girato piegato steso
        spento acceso ronzato brillato
    """),
    nouns=_POOLS,
    noun_gender=_GENDER,
    # Italian modifiers agree with the noun, and the base form is the masculine
    # one. Only `-o` changes; an `-e` modifier such as `grande` is the same beside
    # either gender and matches no rule.
    agreement={"f": (("o", "a"),)},
    # Italian puts the modifier after the noun (`gatto azzurro`), which is also
    # what lets it agree: the noun is drawn first, so its gender is known.
    frames=(
        WordFrame(("noun",), 12),
        WordFrame(("noun", "adjective"), 46),
        WordFrame(("noun", "action"), 30),
        WordFrame(("noun", "adjective", "action"), 12),
    ),
    syn=SyllableSynthesis(
        onset=words("b c ch d f g gh l m n p qu r s sc t v z br cr dr fr gr pl pr tr"),
        vowel=words("a a e e i i o o u ia ie io ua ue uo ai ei oi au"),
        coda=("", "", *words("n l r")),
        min_syllables=2,
        max_syllables=3,
    ),
)
