// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

// Written once, with the gender each noun carries; `taggedNouns` splits the tags
// back off into the lookup the modifiers agree against.
final TaggedNouns _nouns = taggedNouns(<WordTheme, String>{
  WordTheme.animal: r'''
    gatto:m cane:m leone:m tigre:f leopardo:m ghepardo:m volpe:f lupo:m orso:m panda:m
    lontra:f coniglio:m scoiattolo:m elefante:m cervo:m cavallo:m asino:m mucca:f toro:m
    capra:f pecora:f maiale:m scimmia:f gorilla:m coccodrillo:m serpente:m lucertola:f
    tartaruga:f rana:f rospo:m uccello:m rondine:f passero:m corvo:m falco:m aquila:f
    pavone:m pappagallo:m gufo:m colomba:f gru:f cigno:m anatra:f oca:f gallina:f
    pesce:m balena:f delfino:m squalo:m polpo:m calamaro:m gambero:m granchio:m lumaca:f
    farfalla:f ape:f formica:f ragno:m libellula:f cicala:f mosca:f zanzara:f verme:m
    pipistrello:m riccio:m procione:m tasso:m lince:f bisonte:m alce:m cammello:m
    koala:m bradipo:m furetto:m talpa:f airone:m pellicano:m tricheco:m donnola:f
    gazzella:f zebra:f bufalo:m foca:f pinguino:m struzzo:m
    cinghiale:m renna:f antilope:f gnu:m giraffa:f ippopotamo:m rinoceronte:m suricato:m
    armadillo:m istrice:m castoro:m ornitorinco:m canguro:m lemure:m babbuino:m tapiro:m
    ghiro:m puzzola:f merlo:m usignolo:m allodola:f quaglia:f fagiano:m pernice:f
    colibrì:m tucano:m fenicottero:m cicogna:f upupa:f cardellino:m gazza:f ghiandaia:f
    civetta:f poiana:f anguilla:f sardina:f tonno:m merluzzo:m nasello:m trota:f
    salmone:m carpa:f razza:f medusa:f vongola:f cozza:f ostrica:f aragosta:f
    scarabeo:m cavalletta:f grillo:m vespa:f tarma:f lucciola:f millepiedi:m scorpione:m
    pulce:f bruco:m iguana:f camaleonte:m salamandra:f tritone:m boa:m vipera:f cobra:m
    pitone:m
    totano:m
  ''',
  WordTheme.object: r'''
    bottiglia:f matita:f gomma:f ombrello:m lampada:f lanterna:f specchio:m chiave:f
    lucchetto:m borsa:f bottone:m ago:m filo:m pennello:m vernice:f carta:f quaderno:m
    lettera:f cartolina:f francobollo:m mappa:f cannocchiale:m microscopio:m macchina:f
    pellicola:f radio:f palloncino:m aquilone:m trottola:f biglia:f dado:m
    puzzle:m vela:f ancora:f tenda:f torcia:f fiammifero:m candela:f vaso:m teiera:f
    tazza:f cucchiaio:m pentola:f ingranaggio:m molla:f magnete:m nastro:m busta:f
    cuscino:m coperta:f cesto:m scopa:f fischietto:m corda:f secchio:m ventaglio:m
    scudo:m rete:f canna:f brocca:f pettine:m campanella:f imbuto:m vassoio:m scatola:f
    barile:m latta:f fiala:f
    bussola:f portachiavi:m spillo:m ditale:m gomitolo:m spago:m fune:f gancio:m
    chiodo:m vite:f rondella:f cerniera:f catenaccio:m chiavistello:m catena:f
    zip:f fibbia:f spilla:f braccialetto:m anello:m valigetta:f zaino:m baule:m
    cassone:m tino:m orcio:m boccale:m ciotola:f colino:m mortaio:m molletta:f
    paletta:f
    telescopio:m
  ''',
  WordTheme.nature: r'''
    mare:m fiume:m lago:m cascata:f valle:f montagna:f collina:f prato:m bosco:m
    grotta:f deserto:m sabbia:f roccia:f ciottolo:m vulcano:m terremoto:m ghiacciaio:m
    scogliera:f palude:f ruscello:m baia:f duna:f vetta:f brughiera:f steppa:f savana:f
    estuario:m delta:m laguna:f atollo:m fiordo:m cala:f capo:m penisola:f istmo:m
    arcipelago:m isolotto:m altopiano:m canyon:m rupe:f crepaccio:m morena:f ghiaione:m
    masso:m banco:m secca:f scoglio:m abisso:m geyser:m fumarola:f dolina:f stalattite:f
    stalagmite:f caverna:f cengia:f pendio:m ombra:f eco:f brace:f sorgente:f riva:f
    litorale:m
    selva:f pianura:f tundra:f acquitrino:m oasi:f pascolo:m gola:f torrente:m
    ansa:f guado:m sponda:f spiaggia:f costa:f golfo:m insenatura:f stretto:m canale:m
    corrente:f marea:f onda:f schiuma:f frangente:m falesia:f dirupo:m cima:f conca:f
    burrone:m voragine:f antro:m
  ''',
  WordTheme.plant: r'''
    albero:m foglia:f fiore:m radice:f seme:m frutto:m muschio:m felce:f bambù:m pino:m
    acero:m ciliegio:m rosa:f loto:m crisantemo:m orchidea:f tarassaco:m girasole:m
    ninfea:f erba:f ramo:m germoglio:m bocciolo:m petalo:m polline:m pigna:f ghianda:f
    ginkgo:m salice:m betulla:f cedro:m abete:m quercia:f castagno:m noce:m
     alga:f siepe:f mazzo:m cactus:m aloe:f basilico:m timo:m origano:m
    prezzemolo:m coriandolo:m finocchio:m aneto:m salvia:f dragoncello:m menta:f
    camomilla:f lavanda:f edera:f palma:f
    fusto:m corteccia:f linfa:f spina:f rovo:m vischio:m agrifoglio:m alloro:m olivo:m
    fico:m arancio:m melo:m mandorlo:m nocciolo:m pioppo:m frassino:m olmo:m tiglio:m
    faggio:m larice:m sequoia:f eucalipto:m acacia:f magnolia:f camelia:f begonia:f
    petunia:f geranio:m garofano:m margherita:f papavero:m giacinto:m narciso:m
    tulipano:m giglio:m dalia:f peonia:f trifoglio:m giunco:m ortica:f cardo:m
    mughetto:m glicine:m
  ''',
  WordTheme.gem: r'''
    oro:m argento:m rame:m ferro:m acciaio:m bronzo:m ottone:m stagno:m zinco:m
    platino:m cristallo:m quarzo:m ametista:f agata:f ambra:f perla:f giada:f opale:m
    ossidiana:f marmo:m granito:m calcare:m basalto:m selce:f meteorite:m minerale:m
    gemma:f lingotto:m mica:f fluorite:f calcite:f malachite:f granato:m zolfo:m
    avorio:m pepita:f grafite:f mercurio:m gesso:m olivina:f tormalina:f rubino:m
    zaffiro:m smeraldo:m topazio:m zircone:m pirite:f magnetite:f ematite:f cinabro:m
    galena:f talco:m bismuto:m
    nichel:m titanio:m alluminio:m piombo:m tungsteno:m cobalto:m cromo:m manganese:m
    litio:m uranio:m lapislazzuli:m corniola:f diaspro:m onice:f berillo:m spinello:m
    peridoto:m alabastro:m ardesia:f arenaria:f scisto:m gneiss:m quarzite:f tufo:m
    dolomite:f apatite:f barite:f corindone:m feldspato:m muscovite:f siderite:f
    limonite:f bauxite:f
  ''',
  WordTheme.concept: r'''
    libertà:f pace:f giustizia:f verità:f saggezza:f memoria:f fantasia:f racconto:m
    poesia:f schizzo:m grammatica:f logica:f fisica:f chimica:f biologia:f filosofia:f
    matematica:f geometria:f algebra:f storia:f mito:m leggenda:f favola:f proverbio:m
    indovinello:m segreto:m promessa:f viaggio:m avventura:f traversata:f scoperta:f
    esperimento:m domanda:f risposta:f dibattito:m consiglio:m festa:f dimensione:f
    equilibrio:m armonia:f rito:m usanza:f cultura:f lingua:f alfabeto:m cifra:f
    archivio:m almanacco:m orizzonte:m intuizione:f ragione:f giudizio:m dottrina:f
    teorema:m assioma:m ipotesi:f paradosso:m dilemma:m paradigma:m premessa:f
    deduzione:f induzione:f analogia:f metafora:f simbolo:m cronaca:f manifesto:m
    trattato:m alleanza:f stirpe:f eredità:f tradizione:f cerimonia:f soglia:f
    verso:m prosa:f novella:f tesi:f sintesi:f analisi:f metodo:m teoria:f
    pratica:f tecnica:f arte:f scienza:f etica:f estetica:f retorica:f dialettica:f
    semantica:f ortografia:f calligrafia:f enigma:m certezza:f caso:m destino:m
    sorte:f fortuna:f volontà:f coscienza:f identità:f essenza:f materia:f forma:f
    causa:f effetto:m ordine:m caos:m limite:m origine:f
    discorso:m disamina:f
  ''',
  WordTheme.myth: r'''
    drago:m fenice:f unicorno:m sirena:f fata:f folletto:m elfo:m nano:m troll:m orco:m
    gigante:m chimera:f idra:f grifone:m centauro:m minotauro:m sfinge:f pegaso:m
    kraken:m basilisco:m golem:m vampiro:m licantropo:m spettro:m fantasma:m anima:f
    spirito:m demone:m angelo:m dea:f dio:m incantesimo:m maledizione:f profezia:f
    oracolo:m amuleto:m talismano:m runa:f portale:m santuario:m idolo:m totem:m ninfa:f
    naiade:f driade:f valchiria:f musa:f stregone:m strega:f negromante:m alchimista:m
    saggio:m augurio:m presagio:m bestiario:m
    satiro:m fauno:m arpia:f gorgone:f ciclope:m titano:m colosso:m leviatano:m gnomo:m
    ondina:f silfide:f genio:m apparizione:f sortilegio:m grimorio:m pentacolo:m
    reliquia:f calice:m graal:m bacchetta:f bastone:m scettro:m corona:f ippogrifo:m
    mantìcora:f
  ''',
  WordTheme.job: r'''
    cavaliere:m cacciatore:m ladro:m pirata:m marinaio:m capitano:m cuoco:m
    giardiniere:m fabbro:m detective:m poeta:m pittore:m ballerino:m pagliaccio:m
    viaggiatore:m pellegrino:m monaco:m arciere:m spadaccino:m guerriero:m generale:m
    soldato:m guardia:f portiere:m re:m regina:f principe:m principessa:f imperatore:m
    maggiordomo:m serva:f servo:m mercante:m contadino:m pescatore:m pastore:m
    boscaiolo:m barcaiolo:m cocchiere:m pilota:m ingegnere:m postino:m fattorino:m
    spazzino:m pompiere:m poliziotto:m medico:m infermiere:m farmacista:m veterinario:m
    maestro:m allievo:m giornalista:m scrittore:m redattore:m traduttore:m cantante:m
    attore:m regista:m musicista:m minatore:m falegname:m vasaio:m sarto:m indovino:m
    profeta:m sacerdote:m studioso:m dottore:m inventore:m esploratore:m atleta:m
    arbitro:m acrobata:m scultore:m guida:f orologiaio:m panettiere:m birraio:m
    profumiere:m conciatore:m tessitore:m
    avvocato:m giudice:m notaio:m ragioniere:m banchiere:m cassiere:m commesso:m
    cameriere:m portinaio:m hostess:f macchinista:m autista:m tassista:m meccanico:m
    idraulico:m muratore:m vetraio:m gioielliere:m calzolaio:m cappellaio:m sarta:f
    parrucchiere:m barbiere:m pasticciere:m macellaio:m fioraio:m libraio:m
    archeologo:m astronomo:m biologo:m geologo:m botanico:m storico:m filosofo:m
    archivista:m
    cosmonauta:m astronauta:m
  ''',
  WordTheme.music: r'''
    pianoforte:m chitarra:f tamburo:m campana:f arpa:f canzone:f danza:f ritmo:m
    melodia:f accordo:m flauto:m tromba:f sassofono:m clarinetto:m oboe:m violoncello:m
    viola:f violino:m batteria:f piatto:m tamburello:m xilofono:m organo:m armonica:f
    fisarmonica:f liuto:m mandolino:m banjo:m spartito:m nota:f pausa:f scala:f coro:m
    assolo:m concerto:m palco:m sinfonia:f sonata:f valzer:m jazz:m ballata:f
    ninnananna:f marcia:f preludio:m interludio:m finale:m timbro:m orchestra:f
    movimento:m ouverture:f fuga:f studio:m notturno:m serenata:f rapsodia:f inno:m
    requiem:m cantata:f aria:f duetto:m trio:m quartetto:m quintetto:m direttore:m
    ottava:f semitono:m pentagramma:m metronomo:m pedale:m tasto:m bocchino:m
    contrabbasso:m fagotto:m corno:m trombone:m tuba:f cornamusa:f zampogna:f ocarina:f
    ciaramella:f cetra:f salterio:m maraca:f nacchera:f campanaccio:m gong:m
    grancassa:f contrappunto:m cadenza:f arpeggio:m trillo:m glissando:m legato:m
    tempo:m ritornello:m strofa:f stornello:m tarantella:f bolero:m tango:m rumba:f
    operetta:f melodramma:m
  ''',
  WordTheme.place: r'''
    mercato:m piazza:f città:f villaggio:m vicolo:m ponte:m giardino:m biblioteca:f
    museo:m teatro:m scuola:f parco:m porto:m molo:m stazione:f aeroporto:m faro:m
    castello:m mura:f palazzo:m tempio:m torre:f soffitta:f cantina:f terrazza:f
    cortile:m portico:m serra:f fienile:m baita:f belvedere:m parco_giochi:m palestra:f
    piscina:f acquario:m galleria:f zoo:m terme:f municipio:m posta:f ospedale:m
    farmacia:f libreria:f panetteria:f caffetteria:f ristorante:m cucina:f camera:f
    salotto:m corridoio:m tunnel:m passerella:f incrocio:m viale:m fortezza:f fattoria:f
    ranch:m frutteto:m abbazia:f chiostro:m bastione:m torretta:f fossato:m cantiere:m
     accampamento:m villa:f dimora:f borgo:m
    cattedrale:f eremo:m cappella:f monastero:m convento:m cimitero:m mausoleo:m
    cripta:f moschea:f sinagoga:f pagoda:f locanda:f ostello:m osteria:f taverna:f
    enoteca:f fiera:f rione:m sobborgo:m periferia:f corso:m selciato:m sentiero:m
    scorciatoia:f crocevia:m imbarcadero:m diga:f chiusa:f acquedotto:m mulino:m
    fucina:f officina:f magazzino:m silo:m stalla:f recinto:m pagliaio:m
  ''',
  WordTheme.food: r'''
    riso:m pane:m pasta:f zuppa:f stufato:m insalata:f sale:m zucchero:m pepe:m aglio:m
    cipolla:f patata:f carota:f cetriolo:m zucca:f cavolo:m lattuga:f spinacio:m fungo:m
    tofu:m uovo:m formaggio:m burro:m yogurt:m mela:f fragola:f uva:f anguria:f pesca:f
    arancia:f limone:m banana:f mango:m ciliegia:f ananas:m cioccolato:m caramella:f
    biscotto:m torta:f budino:m ciambella:f cialda:f frittella:f hamburger:m pizza:f
    curry:m frittata:f risotto:m lasagna:f gnocco:m raviolo:m tortellino:m polenta:f
    focaccia:f grissino:m panino:m salsiccia:f prosciutto:m pancetta:f salame:m
    mortadella:f polpetta:f bistecca:f costoletta:f marmellata:f miele:m tiramisù:m
    cannolo:m
    segale:f orzo:m avena:f mais:m lenticchia:f cece:m fagiolo:m pisello:m fava:f soia:f
    pomodoro:m peperone:m melanzana:f zucchina:f broccolo:m cavolfiore:m carciofo:m
    asparago:m porro:m ravanello:m barbabietola:f rapa:f sedano:m pera:f prugna:f
    melagrana:f cotogna:f nespola:f albicocca:f pompelmo:m mandarino:m kiwi:m
    pistacchio:m arachide:f castagna:f pandoro:m panettone:m crostata:f frittura:f
    minestra:f ribollita:f caponata:f
  ''',
  WordTheme.sport: r'''
    calcio:m baseball:m pallavolo:f tennis:m badminton:m golf:m bowling:m biliardo:m
    nuoto:m atletica:f maratona:f ginnastica:f karate:m judo:m scherma:f lotta:f
    pugilato:m tiro:m equitazione:f canottaggio:m surf:m sci:m hockey:m rugby:m
    cricket:m ciclismo:m arrampicata:f racchetta:f porta:f medaglia:f
    trofeo:m campione:m eliminatoria:f allenamento:m polo:m pattinaggio:m
    tuffo:m freccetta:f ostacolo:m giavellotto:m disco:m staffetta:f tabellone:m casco:m
    fallo:m dorso:m sollevamento:m slitta:f servizio:m rimbalzo:m salto:m
    corsa:f traguardo:m podio:m spogliatoio:m tribuna:f tifoseria:f
    canoismo:m regata:f triathlon:m pentathlon:m decathlon:m lancio:m asta:f
    trampolino:m materassino:m anelli:p tatami:m scacchi:p domino:m
    attaccante:m difensore:m allenatore:m tifoso:m stadio:m campo:m pista:f rigore:m
    angolo:m cartellino:m punteggio:m pareggio:m vittoria:f sconfitta:f record:m
    torneo:m campionato:m coppa:f
  ''',
  WordTheme.vehicle: r'''
    bicicletta:f treno:m barca:f automobile:f autobus:m taxi:m camion:m moto:f
    monopattino:m aereo:m elicottero:m astronave:f razzo:m sottomarino:m yacht:m cargo:m
    veliero:m zattera:f corazzata:f carro:m carrozza:f carriola:f trattore:m
    escavatore:m ambulanza:f funivia:f tram:m locomotiva:f canoa:f kayak:m mongolfiera:f
    dirigibile:m paracadute:m portantina:f triciclo:m furgone:m limousine:f spazzaneve:m
    monorotaia:f catamarano:m petroliera:f chiatta:f peschereccio:m biplano:m
    idrovolante:m sonda:f navetta:f monociclo:m gondola:f vagone:m
    calesse:m diligenza:f berlina:f cabriolet:m carretto:m camioncino:m ribaltabile:m
    betoniera:f rullo:m mietitrice:f pattino:m skateboard:m ciclomotore:m
    sidecar:m traghetto:m crociera:f galea:f galeone:m fregata:f corvetta:f brigantino:m
    goletta:f piroga:f scialuppa:f lancia:f aliante:m ultraleggero:m caccia:m
    bombardiere:m rimorchio:m
  ''',
  WordTheme.product: r'''
    computer:m tastiera:f mouse:m schermo:m stampante:f altoparlante:m auricolare:m
    microfono:m drone:m tablet:m telefono:m caricatore:m pila:f telecomando:m
    frigorifero:m lavatrice:f ventilatore:m stufa:f depuratore:m cuociriso:m microonde:m
    forno:m frullatore:m rasoio:m spazzolino:m dentifricio:m sapone:m shampoo:m
    profumo:m orologio:m proiettore:m router:m scanner:m asciugatrice:f lozione:f
    crema_solare:f pantofola:f sandalo:m materasso:m campanello:m termometro:m
    estintore:m calcolatrice:f lampadina:f presa:f ciabatta:f piumone:m federa:f
    asciugamano:m catino:m detersivo:m ammorbidente:m padella:f caffettiera:f frusta:f
    pelapatate:m cavatappi:m thermos:m zerbino:m gruccia:f armadio:m scaffale:m
    comodino:m
    televisore:m console:f bilancia:f tostapane:m friggitrice:f spremiagrumi:m
    bollitore:m radiatore:m termostato:m tappeto:m veneziana:f lampadario:m
    abatjour:m posateria:f stoviglia:f cristalleria:f tovaglia:f tovagliolo:m
    scolapiatti:m lavandino:m rubinetto:m doccia:f vasca:f lavabo:m lente:f
    piastra:f
  ''',
  WordTheme.color: r'''
    cremisi:m scarlatto:m vermiglio:m magenta:m fucsia:m rosato:m arancione:m ambrato:m
    ocra:f seppia:f senape:f smeraldino:m turchese:m
    ciano:m celeste:m indaco:m lilla:m violetto:m porpora:f bordeaux:m
    ruggine:f terracotta:f crema:f beige:m cachi:m peltro:m ebano:m giaietto:m ceruleo:m
    zafferano:m acquamarina:f verderame:m celadon:m madreperla:f ramato:m argenteo:m
    bronzeo:m cenere:f fumo:m vinaccia:f grano:m cannella:f noce_moscata:f paprika:f
    amaranto:m corallo:m carminio:m bordò:m glauco:m rossiccio:m mogano:m antracite:f
    malva:f verdeazzurro:m azzurrino:m grigiastro:m
    violaceo:m giallino:m brunito:m dorato:m nerastro:m biancastro:m rosaceo:m
    incarnato:m
  ''',
  WordTheme.finance: r'''
    fattura:f ricevuta:f obbligazione:f azione:f dividendo:m interesse:m prestito:m
    mutuo:m deposito:m risparmio:m conto:m saldo:m bilancio:m revisione:f attivo:m
    passivo:m capitale:m ricavo:m guadagno:m margine:m avanzo:m disavanzo:m debito:m
    credito:m addebito:m assegno:m moneta:f valuta:f rendimento:m portafoglio:m dazio:m
    rimborso:m premio:m pensione:f busta_paga:f stipendio:m salario:m bonus:m
    provvigione:f royalty:f franchigia:f fusione:f acquisizione:f salvataggio:m
    garanzia:f buono:m coupon:m cassaforte:f tesoreria:f rimessa:f
    liquidazione:f arbitraggio:m scoperto:m estratto:m libretto:m custodia:f creditore:m
    debitore:m prestatore:m garante:m valutazione:f perizia:f inflazione:f recessione:f
    liquidità:f solvibilità:f fallimento:m donazione:f sussidio:m spesa:f sconto:m
    rata:f
    cassa:f contratto:m scrittura:f cambiale:f tratta:f
    giroconto:m aliquota:f quota:f canone:m tributo:m imposta:f gravame:m
    ritenuta:f esenzione:f multa:f mora:f usura:f cauzione:f apporto:m dote:f
    successione:f rendita:f affitto:m pedaggio:m decima:f bottino:m tesoro:m ricchezza:f
    povertà:f cedola:f pegno:m ipoteca:f
  ''',
  WordTheme.tech: r'''
    server:m cache:f buffer:m pixel:m codec:m pacchetto:m protocollo:m coda:f
     cumulo:m puntatore:m compilatore:m firmware:m registro:m latenza:f
    gateway:m firewall:m sottorete:f host:m carico_utile:m checksum:m schema:m cursore:m
    backup:m cluster:m frammento:m replica:f istantanea:f contenitore:m pipeline:f
    repository:m debugger:m macro:f matrice:f intero:m sintassi:f analizzatore:m
    assemblatore:m istruzione:f interruzione:f bitrate:m throughput:m handshake:m
     endpoint:m cifratura:f decifratura:f hashing:m rendering:m shader:m
    texture:f poligono:m reticolo:m ottetto:m commutazione:f multicast:m broadcast:m
    datagramma:m bootloader:m partizione:f cartella:f collegamento:m ripristino:m
    migrazione:f
    processo:m sessione:f query:f indice:m tabella:f vista:f colonna:f riga:f
    nodo:m grafo:m lista:f insieme:m modulo:m plugin:m
    patch:f commit:m etichetta:f versione:f build:f collaudo:m traccia:f
    profilo:m trigger:m evento:m argomento:m thread:m
    kernel:m
    istanza:f
  ''',
  WordTheme.weather: r'''
    nuvola:f vento:m pioggia:f neve:f brina:f nebbia:f rugiada:f arcobaleno:m tramonto:m
    fulmine:m tuono:m acquazzone:m monsone:m tifone:m turbine:m bufera:f pioggerella:f
    grandine:f nevischio:m burrasca:f raffica:f ciclone:m tempesta:f temporale:m
    diluvio:m foschia:f caligine:f umidità:f previsione:f nuvolone:m sole:m gelata:f
    disgelo:m mulinello:m brezza:f zefiro:m libeccio:m scirocco:m maestrale:m
    tramontana:f anticiclone:m clima:m temperatura:f pressione:f nubifragio:m lampo:m
    saetta:f sereno:m schiarita:f afa:f galaverna:f
    solleone:m canicola:f grecale:m ponente:m levante:m ostro:m
    aliseo:m uragano:m tornado:m polverone:m spruzzo:m acquerugiola:f
    nevicata:f spolverata:f grandinata:f rovescio:m guazza:f nuvolosità:f siccità:f
    magra:f bonaccia:f gelo:m calura:f
    libecciata:f groppo:m
  ''',
  WordTheme.space: r'''
    stella:f luna:f galassia:f cometa:f meteora:f aurora:f falce_lunare:f
    eclissi:f zenit:m universo:m pianeta:m satellite:m asteroide:m nebulosa:f ammasso:m
    orbita:f gravità:f rotazione:f rivoluzione:f cratere:m anno_luce:m astro:m
    firmamento:m eclittica:f meridiano:m stratosfera:f atmosfera:f vuoto:m plenilunio:m
    novilunio:m perigeo:m vespro:m marte:m venere:f giove:m saturno:m urano:m nettuno:m
    plutone:m supernova:f buco_nero:m quasar:m pulsar:f via_lattea:f cosmo:m
    quadrante:m parallasse:f parsec:m nadir:m azimut:m ellisse:f perielio:m afelio:m
    fotosfera:f cromosfera:f magnetosfera:f ionosfera:f esosfera:f mesosfera:f
    troposfera:f eliosfera:f osservatorio:m
    gravitazione:f alone:m nana:f bolide:m luce:f
  ''',
  WordTheme.time: r'''
    alba:f crepuscolo:m imbrunire:m solstizio:m equinozio:m
    stagione:f momento:m eternità:f futuro:m istante:m secolo:m decennio:m mattino:m
    mezzogiorno:m pomeriggio:m sera:f notte:f mezzanotte:f vigilia:f
    ieri:m oggi:m giornata:f settimana:f quindicina:f mese:m trimestre:m semestre:m
    anno:m lustro:m millennio:m epoca:f era:f età:f primavera:f estate:f autunno:m
    inverno:m triennio:m biennio:m infanzia:f gioventù:f maturità:f vecchiaia:f
    scadenza:f intervallo:m durata:f periodo:m anniversario:m ricorrenza:f albeggiare:m
    minuto:m secondo:m ora:f lasso:m tregua:f attesa:f indugio:m ciclo:m
    turno:m ronda:f fase:f tappa:f tratto:m mattinata:f serata:f nottata:f
    passato:m presente:m avvenire:m albore:m annata:f
    centenario:m quadriennio:m sessennio:m
  ''',
  WordTheme.emotion: r'''
    gioia:f tristezza:f rabbia:f paura:f sorpresa:f allegria:f giubilo:m felicità:f
    euforia:f estasi:f conforto:m sollievo:m speranza:f disperazione:f dolore:m
    malinconia:f nostalgia:f solitudine:f struggimento:m desiderio:m passione:f
    affetto:m tenerezza:f calore:m bontà:f compassione:f empatia:f pietà:f gratitudine:f
    umiltà:f pazienza:f prudenza:f temperanza:f fermezza:f integrità:f sincerità:f
    stupore:m riverenza:f serenità:f calma:f quiete:f fiducia:f dubbio:m sospetto:m
    ansia:f terrore:m panico:m furia:f collera:f fastidio:m noia:f apatia:f entusiasmo:m
    fervore:m ardore:m emozione:f illusione:f coraggio:m timidezza:f vergogna:f colpa:f
    orgoglio:m invidia:f gelosia:f avidità:f umore:m capriccio:m
    amarezza:f rancore:m odio:m disdegno:m disprezzo:m diffidenza:f tedio:m angoscia:f
    afflizione:f sconforto:m sgomento:m slancio:m devozione:f clemenza:f
    indulgenza:f benevolenza:f simpatia:f antipatia:f tripudio:m
    contentezza:f inquietudine:f trepidazione:f soprassalto:m stupefazione:f rimorso:m
    pentimento:m brama:f smania:f
  ''',
  WordTheme.body: r'''
    testa:f fronte:f sopracciglio:m ciglio:m palpebra:f naso:m guancia:f mento:m
    mascella:f labbro:m dente:m gengiva:f orecchio:m lobo:m collo:m
    nuca:f spalla:f gomito:m polso:m palmo:m nocca:f dito:m pollice:m unghia:f pugno:m
    petto:m costola:f pancia:f ombelico:m schiena:f vita:f anca:f coscia:f ginocchio:m
    stinco:m polpaccio:m caviglia:f tallone:m osso:m cranio:m muscolo:m tendine:m
    legamento:m cartilagine:f cuore:m polmone:m fegato:m stomaco:m rene:m milza:f
    intestino:m vescica:f cervello:m nervo:m vena:f arteria:f capillare:m sangue:m
    carne:f pelle:f poro:m capello:m barba:f lacrima:f sudore:m saliva:f respiro:m
    clavicola:f rotula:f zigomo:m timpano:m bulbo:m ruga:f lentiggine:f fossetta:f
    cicatrice:f livido:m callo:m
    tempia:f palato:m tonsilla:f laringe:f faringe:f trachea:f esofago:m diaframma:m
    sterno:m scapola:f vertebra:f bacino:m femore:m tibia:f perone:m omero:m
    falange:f metatarso:m ascella:f inguine:m iride:f pupilla:f cornea:f
    retina:f setto:m frenulo:m avambraccio:m
  ''',
  WordTheme.clothing: r'''
    cappello:m scarpa:f guanto:m sciarpa:f occhiali:p cappotto:m giaccone:m giacca:f
    camicia:f blusa:f tunica:f pantalone:m jeans:p calzoncino:m gonna:f abito:m gilet:m
    cardigan:m maglione:m felpa:f calzino:m calza:f biancheria:f pigiama:m grembiule:m
    bandana:f cravatta:f farfallino:m cintura:f fascia:f scarpetta:f mocassino:m
    stivale:m divisa:f costume:m vestaglia:f mantello:m poncho:m impermeabile:m
    giubbotto:m parka:m muta:f tuta:f manica:f colletto:m polsino:m orlo:m risvolto:m
    fodera:f tessuto:m lino:m seta:f cotone:m lana:f velluto:m fustagno:m flanella:f
    cuoio:m basco:m cuffia:f berretto:m elmetto:m turbante:m velo:m scialle:m
    marsina:f frac:m smoking:m casacca:f farsetto:m saio:m sottoveste:f corpetto:m
    ghetta:f zoccolo:m espadrilla:f infradito:m babbuccia:f calzoncini:p mezzoguanto:m
    manopola:f polsiera:f bretella:f busto:m crinolina:f mantiglia:f cuffietta:f
    tricorno:m elmo:m cappuccio:m sciarpone:m
  ''',
  WordTheme.tool: r'''
    ascia:f pala:f sega:f pinza:f scalpello:m incudine:f mantice:m lesina:f
    morsetto:m morsa:f livella:f calibro:m goniometro:m righello:m forbice:f martello:m
    mazzuolo:m trapano:m pialla:f piccone:m falce:f falcetto:m zappa:f aratro:m
    rastrello:m cacciavite:m saldatore:m troncatrice:f metro:m compasso:m accetta:f
    leva:f cuneo:m carrucola:f manovella:f mazza:f cazzuola:f cote:f lima:f grattugia:f
    setaccio:m vanga:f erpice:m correggiato:m fuso:m spola:f rocchetto:m manico:m lama:f
    cassetta:f rivettatrice:f chiodatrice:f seghetto:m tornio:m levigatrice:f motosega:f
    sgorbia:f punteruolo:m squadra:f smusso:m
    succhiello:m punta:f pialletto:m raspa:f scalpellino:m graffietto:m
    piombino:m tenaglia:f cric:m graffatrice:f pistola:f cannello:m acciarino:m
    crogiolo:m stampo:m fustella:f mola:f arrotino:m mandrino:m fresa:f roncola:f
    accettino:m subbio:m
  ''',
  WordTheme.drink: r'''
    caffè:m tè:m succo:m latte:m acqua:f gassosa:f limonata:f sidro:m orzata:f
    frullato:m infuso:m tisana:f mate:m cioccolata:f macchiato:m cappuccino:m espresso:m
    corretto:m decaffeinato:m birra:f bionda:f rossa:f vino:m
     spumante:m prosecco:m champagne:m sherry:m vermut:m
    sangria:f liquore:m grappa:f acquavite:f rum:m gin:m vodka:f whisky:m cognac:m
    brandy:m tequila:m sake:m idromele:m cocktail:m punch:m nettare:m sciroppo:m
    bibita:f soda:f tonica:f granita:f
    cacao:m kefir:m siero:m panna:f amaro:m anice:m sambuca:f mirto:m
    limoncello:m chinotto:m spuma:f sorbetto:m aranciata:f cedrata:f
    moscato:m lambrusco:m barbera:f chianti:m marsala:m passito:m vinsanto:m mosto:m
    rosolio:m nocino:m ratafià:m centerbe:m
  ''',
});

/// The Italian word dataset.
final WordLanguageData it = WordLanguageData(
  joiner: ' ',
  capitalize: false,
  adjectives: words(r'''
    azzurro verde rosso nero bianco giallo dorato argenteo scuro chiaro brillante grande
    piccolo lungo corto largo stretto alto basso rapido lento forte debole duro morbido
    caldo freddo tiepido secco umido pulito nuovo vecchio giovane bello brutto dolce
    amaro salato piccante aspro soffice ruvido leggero pesante rotondo acuto profondo
    lontano vicino ricco povero raro tranquillo rumoroso coraggioso saggio allegro
    triste libero eterno trasparente misterioso solitario radioso selvaggio sereno
    silenzioso antico moderno infinito cavo setoso nebbioso nuvoloso piovoso soleggiato
    nevoso ventoso arrugginito curioso birichino nobile umile gentile feroce agile
    spinoso irrequieto robusto vivido tenue grigio pallido intenso gelido ardente cupo
    luminoso maestoso semplice elegante buffo astuto audace pigro sveglio affilato
    liscio denso scarso
    leale paziente vigile abile fermo mite franco riservato ostinato schietto tagliente
    peloso lucido rilucente paffuto massiccio lieve gelato fumante aromatico mielato
    maculato striato consumato lucidato nuovissimo stagionato spesso sottile piatto
    aguzzo storto dritto slanciato tozzo smorzato stridulo sonoro grave melodioso roco
    vibrante sussurrante temperato afoso coperto sgombro brinato stellato lunare
    muschioso attorcigliato verdeggiante fiorito profumato smeraldino corallino eburneo
    ossidiano cristallino bronzeo stagnato plumbeo cremisi vermiglio ocra indaco
    turchese lavanda malva avorio corvino remoto minuscolo grandioso austero raffinato
    rozzo fragile vigoroso ampio scosceso
  '''),
  actions: words(r'''
    dormito perduto trovato nascosto stancato bagnato bruciato gelato sciolto rotto
    aperto chiuso legato appeso caduto seduto sdraiato dimenticato ricordato amato
    temuto desiderato cercato custodito ferito guarito salvato perdonato benedetto
    incantato spaventato sorpreso arrabbiato calmato animato sfinito sognato pettinato
    vestito segnato dipinto ricamato tessuto cucito intagliato forgiato lucidato
    piantato seminato raccolto annaffiato potato fiorito maturato tostato bollito
    arrostito fritto infornato montato macinato tagliato tritato avvolto sigillato
    firmato scritto letto raccontato narrato cantato ballato suonato taciuto gridato
    sussurrato pianto volato nuotato saltato arrampicato rotolato trascinato spinto
    tirato lanciato preso alzato abbassato girato piegato steso spento acceso ronzato
    brillato
    svegliato chinato rannicchiato appoggiato voltato avvicinato allontanato fermato
    camminato corso attraversato tornato partito sparito appostato barcollato
    saltellato guardato osservato vigilato sfiorato lisciato ordinato accudito lavato
    asciugato intrecciato rifilato incollato spiegato riempito svuotato
    servito rimestato stufato scaldato raffreddato assaggiato
    inghiottito inciso tinto verniciato limato soppesato assaporato rimuginato
  '''),
  nouns: _nouns.pools,
  nounGender: _nouns.gender,
  // Italian modifiers agree with the noun, and the base form is the masculine
  // one. Only `-o` changes; an `-e` modifier such as `grande` is the same beside
  // either gender and matches no rule.
  // A word outside the pools is read by its ending, the way Italian reads one:
  // `-a`, `-zione` and `-tà` are feminine, the rest masculine.
  genderRules: const <(String, WordGender)>[
    ('zione', WordGender.f),
    ('sione', WordGender.f),
    ('tà', WordGender.f),
    ('tù', WordGender.f),
    ('a', WordGender.f),
    ('', WordGender.m),
  ],
  agreement: const <WordGender, List<List<String>>>{
    WordGender.f: <List<String>>[
      <String>['o', 'a'],
    ],
    WordGender.p: <List<String>>[
      <String>['o', 'i'],
      <String>['e', 'i'],
    ],
    WordGender.fp: <List<String>>[
      <String>['o', 'e'],
      <String>['e', 'i'],
    ],
  },
  // Italian puts the modifier after the noun (`gatto azzurro`), which is also
  // what lets it agree: the noun is drawn first, so its gender is known.
  // How common each noun is, for `vocabulary` to draw by: the everyday words,
  // and the ones a specialist or a dictionary would know. Every noun in neither
  // list is common.
  levels: WordLevels(
    basic: words(r'''
      gatto cane leone tigre volpe lupo orso panda coniglio scoiattolo elefante cervo cavallo asino
      mucca toro capra pecora maiale scimmia gorilla coccodrillo serpente lucertola tartaruga rana
      uccello rondine corvo falco aquila pappagallo gufo colomba cigno anatra oca gallina pesce
      balena delfino squalo polpo calamaro gambero granchio lumaca farfalla ape formica ragno mosca
      zanzara verme pipistrello riccio cammello zebra foca pinguino struzzo cinghiale renna giraffa
      ippopotamo rinoceronte canguro sardina tonno merluzzo trota salmone medusa vongola cozza
      aragosta grillo vespa scorpione pulce bruco bottiglia matita gomma ombrello lampada specchio
      chiave lucchetto borsa bottone ago filo pennello vernice carta quaderno lettera cartolina
      francobollo mappa macchina radio palloncino aquilone dado puzzle vela ancora tenda torcia
      fiammifero candela vaso tazza cucchiaio pentola nastro busta cuscino coperta cesto scopa
      fischietto corda secchio rete pettine vassoio scatola portachiavi gancio chiodo vite cerniera
      catena zip braccialetto anello zaino ciotola molletta paletta telescopio mare fiume lago
      cascata valle montagna collina prato bosco grotta deserto sabbia roccia vulcano terremoto
      ghiacciaio penisola scoglio ombra eco sorgente riva pianura spiaggia costa golfo canale
      corrente marea onda schiuma cima albero foglia fiore radice seme frutto bambù pino ciliegio
      rosa orchidea girasole erba ramo petalo polline pigna abete quercia noce alga siepe mazzo
      cactus basilico origano prezzemolo finocchio salvia menta camomilla lavanda palma spina alloro
      olivo fico geranio garofano margherita papavero tulipano giglio trifoglio oro argento rame
      ferro acciaio bronzo platino cristallo perla marmo meteorite minerale gemma avorio mercurio
      gesso rubino zaffiro smeraldo talco alluminio piombo libertà pace giustizia verità memoria
      fantasia racconto poesia grammatica logica fisica chimica biologia matematica geometria storia
      mito leggenda favola indovinello segreto promessa viaggio avventura scoperta esperimento
      domanda risposta consiglio festa equilibrio cultura lingua alfabeto orizzonte ragione simbolo
      tradizione arte scienza caso destino fortuna materia forma causa effetto ordine caos limite
      discorso drago unicorno sirena fata elfo nano orco gigante vampiro fantasma anima spirito
      demone angelo dea dio incantesimo maledizione stregone strega augurio gnomo genio bacchetta
      bastone corona cavaliere cacciatore ladro pirata marinaio capitano cuoco giardiniere detective
      poeta pittore ballerino pagliaccio guerriero generale soldato guardia portiere re regina
      principe principessa imperatore contadino pescatore pastore pilota ingegnere postino spazzino
      pompiere poliziotto medico infermiere farmacista veterinario maestro allievo giornalista
      scrittore traduttore cantante attore regista musicista falegname sarto dottore inventore
      esploratore atleta arbitro guida panettiere avvocato giudice ragioniere cassiere commesso
      cameriere hostess autista tassista meccanico idraulico muratore sarta parrucchiere barbiere
      pasticciere macellaio fioraio archeologo biologo astronauta pianoforte chitarra tamburo
      campana arpa canzone danza ritmo melodia accordo flauto tromba sassofono violino batteria
      organo fisarmonica nota pausa scala coro concerto palco valzer jazz ninnananna marcia finale
      orchestra inno trio direttore pedale tasto tempo ritornello strofa tarantella tango mercato
      piazza città villaggio vicolo ponte giardino biblioteca museo teatro scuola parco porto
      stazione aeroporto faro castello palazzo tempio torre soffitta cantina terrazza cortile
      parco_giochi palestra piscina acquario galleria zoo terme municipio posta ospedale farmacia
      libreria panetteria ristorante cucina camera salotto corridoio tunnel incrocio viale fattoria
      cantiere villa borgo cattedrale cappella cimitero moschea osteria enoteca fiera periferia
      corso sentiero scorciatoia diga mulino officina magazzino stalla recinto riso pane pasta zuppa
      insalata sale zucchero pepe aglio cipolla patata carota cetriolo zucca cavolo lattuga spinacio
      fungo uovo formaggio burro yogurt mela fragola uva anguria pesca arancia limone banana mango
      ciliegia ananas cioccolato caramella biscotto torta budino ciambella frittella hamburger pizza
      frittata risotto lasagna gnocco raviolo tortellino polenta focaccia grissino panino salsiccia
      prosciutto pancetta salame mortadella polpetta bistecca costoletta marmellata miele tiramisù
      cannolo orzo mais lenticchia cece fagiolo pisello fava pomodoro peperone melanzana zucchina
      broccolo cavolfiore carciofo asparago sedano pera prugna albicocca pompelmo mandarino kiwi
      pistacchio arachide castagna pandoro panettone crostata frittura minestra calcio baseball
      pallavolo tennis golf bowling biliardo nuoto atletica maratona ginnastica karate judo scherma
      lotta surf sci hockey rugby ciclismo arrampicata racchetta porta medaglia trofeo campione
      allenamento pattinaggio tuffo ostacolo disco tabellone casco fallo slitta servizio salto corsa
      traguardo podio spogliatoio tribuna lancio trampolino scacchi domino attaccante difensore
      allenatore tifoso stadio campo pista rigore angolo cartellino punteggio pareggio vittoria
      sconfitta record torneo campionato coppa bicicletta treno barca automobile autobus taxi camion
      moto monopattino aereo elicottero astronave razzo sottomarino yacht zattera carro carrozza
      carriola trattore ambulanza funivia tram locomotiva canoa mongolfiera paracadute triciclo
      furgone gondola vagone camioncino skateboard traghetto crociera rimorchio computer tastiera
      mouse schermo stampante altoparlante auricolare microfono drone tablet telefono caricatore
      pila telecomando frigorifero lavatrice ventilatore stufa microonde forno frullatore rasoio
      spazzolino dentifricio sapone shampoo profumo orologio proiettore router scanner asciugatrice
      crema_solare pantofola sandalo materasso campanello termometro estintore calcolatrice
      lampadina presa ciabatta piumone asciugamano detersivo ammorbidente padella caffettiera
      cavatappi thermos zerbino gruccia armadio scaffale comodino televisore console bilancia
      tostapane friggitrice bollitore radiatore tappeto lampadario tovaglia tovagliolo lavandino
      rubinetto doccia vasca lente piastra fucsia arancione turchese celeste lilla bordeaux crema
      beige fumo grano cannella corallo bordò dorato fattura ricevuta interesse prestito mutuo
      risparmio conto guadagno debito credito assegno moneta portafoglio rimborso premio pensione
      busta_paga stipendio bonus buono coupon cassaforte inflazione donazione spesa sconto rata
      cassa contratto quota imposta multa affitto pedaggio bottino tesoro ricchezza povertà server
      pixel pacchetto coda schema cursore backup contenitore istruzione interruzione cartella
      collegamento processo sessione indice tabella vista colonna riga lista insieme modulo
      etichetta versione traccia profilo evento argomento nuvola vento pioggia neve nebbia
      arcobaleno tramonto fulmine tuono acquazzone bufera pioggerella grandine raffica ciclone
      tempesta temporale diluvio umidità previsione nuvolone sole brezza scirocco tramontana
      anticiclone clima temperatura pressione lampo sereno afa uragano tornado spruzzo nevicata
      grandinata siccità gelo stella luna galassia cometa eclissi universo pianeta satellite
      asteroide orbita gravità rotazione cratere atmosfera vuoto marte venere giove saturno urano
      nettuno plutone buco_nero via_lattea osservatorio luce alba stagione momento eternità futuro
      istante secolo decennio mattino mezzogiorno pomeriggio sera notte mezzanotte vigilia ieri oggi
      giornata settimana mese trimestre semestre anno epoca età primavera estate autunno inverno
      infanzia gioventù maturità vecchiaia scadenza intervallo durata periodo anniversario minuto
      secondo ora attesa turno fase tappa mattinata serata nottata passato presente gioia tristezza
      rabbia paura sorpresa allegria felicità sollievo speranza disperazione dolore malinconia
      nostalgia solitudine desiderio passione affetto tenerezza calore bontà gratitudine pazienza
      sincerità stupore calma fiducia dubbio sospetto ansia terrore panico furia fastidio noia
      entusiasmo emozione coraggio timidezza vergogna colpa orgoglio invidia gelosia umore capriccio
      odio simpatia antipatia testa fronte sopracciglio ciglio palpebra naso guancia mento mascella
      labbro dente gengiva orecchio collo nuca spalla gomito polso palmo dito pollice unghia pugno
      petto costola pancia ombelico schiena vita anca coscia ginocchio stinco polpaccio caviglia
      tallone osso cranio muscolo cuore polmone fegato stomaco rene intestino vescica cervello nervo
      vena arteria sangue carne pelle capello barba lacrima sudore saliva respiro ruga lentiggine
      cicatrice livido callo tonsilla ascella pupilla cappello scarpa guanto sciarpa occhiali
      cappotto giaccone giacca camicia pantalone jeans gonna abito gilet cardigan maglione felpa
      calzino calza biancheria pigiama grembiule cravatta cintura fascia mocassino stivale divisa
      costume vestaglia mantello impermeabile giubbotto tuta manica colletto orlo fodera tessuto
      lino seta cotone lana velluto cuffia berretto elmetto velo smoking zoccolo infradito
      calzoncini bretella cappuccio ascia pala sega pinza scalpello goniometro righello forbice
      martello trapano piccone falce zappa aratro rastrello cacciavite metro compasso leva mazza
      lima grattugia setaccio vanga manico lama cassetta seghetto motosega squadra punta tenaglia
      cric pistola stampo caffè tè succo latte acqua gassosa limonata frullato tisana cioccolata
      macchiato cappuccino espresso decaffeinato birra bionda rossa vino spumante prosecco champagne
      sangria liquore grappa rum gin vodka whisky tequila cocktail sciroppo bibita granita cacao
      panna amaro sambuca limoncello chinotto sorbetto aranciata moscato lambrusco chianti
    '''),
    rare: words(r'''
      donnola gnu suricato armadillo istrice ornitorinco lemure tapiro allodola pernice upupa
      cardellino ghiandaia poiana millepiedi salamandra tritone totano fiala ditale rondella
      catenaccio chiavistello cassone tino orcio mortaio brughiera estuario atollo istmo rupe
      crepaccio morena ghiaione secca geyser fumarola dolina cengia acquitrino ansa guado insenatura
      frangente falesia dirupo conca antro tarassaco ginkgo aneto dragoncello frassino olmo larice
      begonia petunia dalia giunco agata ossidiana basalto selce mica fluorite calcite malachite
      granato olivina tormalina zircone pirite magnetite ematite cinabro galena bismuto tungsteno
      manganese corniola diaspro onice berillo spinello peridoto arenaria scisto gneiss quarzite
      dolomite apatite barite corindone feldspato muscovite siderite limonite bauxite almanacco
      dottrina assioma paradigma induzione trattato stirpe retorica dialettica semantica disamina
      chimera idra grifone kraken basilisco golem runa naiade driade valchiria negromante bestiario
      satiro fauno arpia gorgone leviatano ondina silfide sortilegio grimorio pentacolo graal
      ippogrifo mantìcora spadaccino barcaiolo cocchiere birraio profumiere conciatore tessitore
      vetraio cappellaio archivista liuto preludio interludio ouverture notturno rapsodia requiem
      cantata quintetto semitono bocchino fagotto ocarina ciaramella cetra salterio campanaccio
      grancassa contrappunto cadenza arpeggio trillo glissando legato stornello bolero operetta
      melodramma bastione eremo mausoleo selciato imbarcadero chiusa fucina silo cotogna canoismo
      pentathlon decathlon tatami corazzata portantina monorotaia chiatta biplano idrovolante
      calesse diligenza ribaltabile mietitrice galea galeone fregata corvetta brigantino goletta
      piroga lancia ultraleggero cuociriso cristalleria vermiglio peltro giaietto ceruleo verderame
      celadon vinaccia carminio glauco verdeazzurro brunito rosaceo incarnato disavanzo royalty
      tesoreria rimessa arbitraggio prestatore solvibilità cambiale tratta giroconto gravame apporto
      decima cedola buffer codec cumulo puntatore compilatore firmware latenza gateway sottorete
      host carico_utile checksum cluster pipeline repository debugger macro analizzatore
      assemblatore bitrate throughput handshake endpoint cifratura decifratura hashing rendering
      shader texture reticolo ottetto commutazione multicast broadcast datagramma bootloader query
      grafo commit build trigger thread kernel caligine zefiro galaverna grecale ostro aliseo
      acquerugiola guazza magra libecciata groppo falce_lunare zenit ammasso eclittica novilunio
      perigeo vespro quasar pulsar parallasse parsec nadir azimut perielio afelio fotosfera
      cromosfera magnetosfera ionosfera esosfera mesosfera troposfera eliosfera nana imbrunire
      lustro albeggiare lasso indugio albore quadriennio sessennio giubilo struggimento temperanza
      riverenza fervore ardore disdegno tedio afflizione clemenza tripudio trepidazione soprassalto
      stupefazione brama bulbo perone omero metatarso frenulo fustagno marsina farsetto saio ghetta
      mezzoguanto polsiera crinolina mantiglia tricorno mantice lesina mazzuolo troncatrice cote
      erpice correggiato spola rivettatrice chiodatrice sgorbia smusso succhiello pialletto
      scalpellino graffietto graffatrice acciarino crogiolo fustella mandrino roncola accettino
      subbio idromele rosolio nocino ratafià centerbe
    '''),
  ),
  frames: const <WordFrame>[
    WordFrame(<WordSlot>[WordSlot.noun], 12),
    WordFrame(<WordSlot>[WordSlot.noun, WordSlot.adjective], 46),
    WordFrame(<WordSlot>[WordSlot.noun, WordSlot.action], 30),
    WordFrame(<WordSlot>[WordSlot.noun, WordSlot.adjective, WordSlot.action], 12),
  ],
  syn: SyllableSynthesis(
    onset: words('b c ch d f g gh l m n p qu r s sc t v z br cr dr fr gr pl pr tr'),
    vowel: words('a a e e i i o o u ia ie io ua ue uo ai ei oi au'),
    coda: <String>['', '', ...words('n l r')],
    minSyllables: 2,
    maxSyllables: 3,
  ),
);
