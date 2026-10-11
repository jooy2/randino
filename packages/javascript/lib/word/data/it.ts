import { words } from '../../_internal/parse.js';
import { IT_MODIFIERS } from './modifiers/it.js';
import { IT_NOUNS } from './nouns/it.js';
import type { WordLanguageData } from './types.js';

export const IT: WordLanguageData = {
	...IT_MODIFIERS,
	nouns: IT_NOUNS.pools,
	nounGender: IT_NOUNS.gender,
	// Italian puts the modifier after the noun (`gatto azzurro`), which is also
	// what lets it agree: the noun is drawn first, so its gender is known. There
	// is no possessive shape, for the reason English has none — `di` is a word
	// rather than something that attaches to the word in front of it.
	// How common each noun is, for `vocabulary` to draw by: the everyday words,
	// and the ones a specialist or a dictionary would know. Every noun in neither
	// list is common. See `WordLevels`.
	levels: {
		basic: words(`
			gatto cane leone tigre volpe lupo orso panda coniglio scoiattolo elefante cervo cavallo asino
			mucca toro capra pecora maiale scimmia gorilla coccodrillo serpente lucertola tartaruga rana
			uccello rondine corvo falco aquila pappagallo gufo colomba cigno anatra oca gallina pesce balena
			delfino squalo polpo calamaro gambero granchio lumaca farfalla ape formica ragno mosca zanzara
			verme pipistrello riccio cammello zebra foca pinguino struzzo cinghiale renna giraffa ippopotamo
			rinoceronte canguro sardina tonno merluzzo trota salmone medusa vongola cozza aragosta grillo
			vespa scorpione pulce bruco bottiglia matita gomma ombrello lampada specchio chiave lucchetto
			borsa bottone ago filo pennello vernice carta quaderno lettera cartolina francobollo mappa
			macchina radio palloncino aquilone dado puzzle vela ancora tenda torcia fiammifero candela vaso
			tazza cucchiaio pentola nastro busta cuscino coperta cesto scopa fischietto corda secchio rete
			pettine vassoio scatola portachiavi gancio chiodo vite cerniera catena zip braccialetto anello
			zaino ciotola molletta paletta telescopio mare fiume lago cascata valle montagna collina prato
			bosco grotta deserto sabbia roccia vulcano terremoto ghiacciaio penisola scoglio ombra eco
			sorgente riva pianura spiaggia costa golfo canale corrente marea onda schiuma cima albero foglia
			fiore radice seme frutto bambù pino ciliegio rosa orchidea girasole erba ramo petalo polline
			pigna abete quercia noce alga siepe mazzo cactus basilico origano prezzemolo finocchio salvia
			menta camomilla lavanda palma spina alloro olivo fico geranio garofano margherita papavero
			tulipano giglio trifoglio oro argento rame ferro acciaio bronzo platino cristallo perla marmo
			meteorite minerale gemma avorio mercurio gesso rubino zaffiro smeraldo talco alluminio piombo
			libertà pace giustizia verità memoria fantasia racconto poesia grammatica logica fisica chimica
			biologia matematica geometria storia mito leggenda favola indovinello segreto promessa viaggio
			avventura scoperta esperimento domanda risposta consiglio festa equilibrio cultura lingua
			alfabeto orizzonte ragione simbolo tradizione arte scienza caso destino fortuna materia forma
			causa effetto ordine caos limite discorso drago unicorno sirena fata elfo nano orco gigante
			vampiro fantasma anima spirito demone angelo dea dio incantesimo maledizione stregone strega
			augurio gnomo genio bacchetta bastone corona cavaliere cacciatore ladro pirata marinaio capitano
			cuoco giardiniere detective poeta pittore ballerino pagliaccio guerriero generale soldato guardia
			portiere re regina principe principessa imperatore contadino pescatore pastore pilota ingegnere
			postino spazzino pompiere poliziotto medico infermiere farmacista veterinario maestro allievo
			giornalista scrittore traduttore cantante attore regista musicista falegname sarto dottore
			inventore esploratore atleta arbitro guida panettiere avvocato giudice ragioniere cassiere
			commesso cameriere hostess autista tassista meccanico idraulico muratore sarta parrucchiere
			barbiere pasticciere macellaio fioraio archeologo biologo astronauta pianoforte chitarra tamburo
			campana arpa canzone danza ritmo melodia accordo flauto tromba sassofono violino batteria organo
			fisarmonica nota pausa scala coro concerto palco valzer jazz ninnananna marcia finale orchestra
			inno trio direttore pedale tasto tempo ritornello strofa tarantella tango mercato piazza città
			villaggio vicolo ponte giardino biblioteca museo teatro scuola parco porto stazione aeroporto
			faro castello palazzo tempio torre soffitta cantina terrazza cortile parco_giochi palestra
			piscina acquario galleria zoo terme municipio posta ospedale farmacia libreria panetteria
			ristorante cucina camera salotto corridoio tunnel incrocio viale fattoria cantiere villa borgo
			cattedrale cappella cimitero moschea osteria enoteca fiera periferia corso sentiero scorciatoia
			diga mulino officina magazzino stalla recinto riso pane pasta zuppa insalata sale zucchero pepe
			aglio cipolla patata carota cetriolo zucca cavolo lattuga spinacio fungo uovo formaggio burro
			yogurt mela fragola uva anguria pesca arancia limone banana mango ciliegia ananas cioccolato
			caramella biscotto torta budino ciambella frittella hamburger pizza frittata risotto lasagna
			gnocco raviolo tortellino polenta focaccia grissino panino salsiccia prosciutto pancetta salame
			mortadella polpetta bistecca costoletta marmellata miele tiramisù cannolo orzo mais lenticchia
			cece fagiolo pisello fava pomodoro peperone melanzana zucchina broccolo cavolfiore carciofo
			asparago sedano pera prugna albicocca pompelmo mandarino kiwi pistacchio arachide castagna
			pandoro panettone crostata frittura minestra calcio baseball pallavolo tennis golf bowling
			biliardo nuoto atletica maratona ginnastica karate judo scherma lotta surf sci hockey rugby
			ciclismo arrampicata racchetta porta medaglia trofeo campione allenamento pattinaggio tuffo
			ostacolo disco tabellone casco fallo slitta servizio salto corsa traguardo podio spogliatoio
			tribuna lancio trampolino scacchi domino attaccante difensore allenatore tifoso stadio campo
			pista rigore angolo cartellino punteggio pareggio vittoria sconfitta record torneo campionato
			coppa bicicletta treno barca automobile autobus taxi camion moto monopattino aereo elicottero
			astronave razzo sottomarino yacht zattera carro carrozza carriola trattore ambulanza funivia tram
			locomotiva canoa mongolfiera paracadute triciclo furgone gondola vagone camioncino skateboard
			traghetto crociera rimorchio computer tastiera mouse schermo stampante altoparlante auricolare
			microfono drone tablet telefono caricatore pila telecomando frigorifero lavatrice ventilatore
			stufa microonde forno frullatore rasoio spazzolino dentifricio sapone shampoo profumo orologio
			proiettore router scanner asciugatrice crema_solare pantofola sandalo materasso campanello
			termometro estintore calcolatrice lampadina presa ciabatta piumone asciugamano detersivo
			ammorbidente padella caffettiera cavatappi thermos zerbino gruccia armadio scaffale comodino
			televisore console bilancia tostapane friggitrice bollitore radiatore tappeto lampadario tovaglia
			tovagliolo lavandino rubinetto doccia vasca lente piastra fucsia arancione turchese celeste lilla
			bordeaux crema beige fumo grano cannella corallo bordò dorato fattura ricevuta interesse prestito
			mutuo risparmio conto guadagno debito credito assegno moneta portafoglio rimborso premio pensione
			busta_paga stipendio bonus buono coupon cassaforte inflazione donazione spesa sconto rata cassa
			contratto quota imposta multa affitto pedaggio bottino tesoro ricchezza povertà server pixel
			pacchetto coda schema cursore backup contenitore istruzione interruzione cartella collegamento
			processo sessione indice tabella vista colonna riga lista insieme modulo etichetta versione
			traccia profilo evento argomento nuvola vento pioggia neve nebbia arcobaleno tramonto fulmine
			tuono acquazzone bufera pioggerella grandine raffica ciclone tempesta temporale diluvio umidità
			previsione nuvolone sole brezza scirocco tramontana anticiclone clima temperatura pressione lampo
			sereno afa uragano tornado spruzzo nevicata grandinata siccità gelo stella luna galassia cometa
			eclissi universo pianeta satellite asteroide orbita gravità rotazione cratere atmosfera vuoto
			marte venere giove saturno urano nettuno plutone buco_nero via_lattea osservatorio luce alba
			stagione momento eternità futuro istante secolo decennio mattino mezzogiorno pomeriggio sera
			notte mezzanotte vigilia ieri oggi giornata settimana mese trimestre semestre anno epoca età
			primavera estate autunno inverno infanzia gioventù maturità vecchiaia scadenza intervallo durata
			periodo anniversario minuto secondo ora attesa turno fase tappa mattinata serata nottata passato
			presente gioia tristezza rabbia paura sorpresa allegria felicità sollievo speranza disperazione
			dolore malinconia nostalgia solitudine desiderio passione affetto tenerezza calore bontà
			gratitudine pazienza sincerità stupore calma fiducia dubbio sospetto ansia terrore panico furia
			fastidio noia entusiasmo emozione coraggio timidezza vergogna colpa orgoglio invidia gelosia
			umore capriccio odio simpatia antipatia testa fronte sopracciglio ciglio palpebra naso guancia
			mento mascella labbro dente gengiva orecchio collo nuca spalla gomito polso palmo dito pollice
			unghia pugno petto costola pancia ombelico schiena vita anca coscia ginocchio stinco polpaccio
			caviglia tallone osso cranio muscolo cuore polmone fegato stomaco rene intestino vescica cervello
			nervo vena arteria sangue carne pelle capello barba lacrima sudore saliva respiro ruga lentiggine
			cicatrice livido callo tonsilla ascella pupilla cappello scarpa guanto sciarpa occhiali cappotto
			giaccone giacca camicia pantalone jeans gonna abito gilet cardigan maglione felpa calzino calza
			biancheria pigiama grembiule cravatta cintura fascia mocassino stivale divisa costume vestaglia
			mantello impermeabile giubbotto tuta manica colletto orlo fodera tessuto lino seta cotone lana
			velluto cuffia berretto elmetto velo smoking zoccolo infradito calzoncini bretella cappuccio
			ascia pala sega pinza scalpello goniometro righello forbice martello trapano piccone falce zappa
			aratro rastrello cacciavite metro compasso leva mazza lima grattugia setaccio vanga manico lama
			cassetta seghetto motosega squadra punta tenaglia cric pistola stampo caffè tè succo latte acqua
			gassosa limonata frullato tisana cioccolata macchiato cappuccino espresso decaffeinato birra
			bionda rossa vino spumante prosecco champagne sangria liquore grappa rum gin vodka whisky tequila
			cocktail sciroppo bibita granita cacao panna amaro sambuca limoncello chinotto sorbetto aranciata
			moscato lambrusco chianti
			giocattolo gioco palla bambola peluche orsacchiotto pupazzo burattino soldatino macchinina trenino
			altalena scivolo giostra secchiello tombola dama briscola cruciverba costruzioni fionda nascondino
			coriandoli maschera braccioli videogioco figurina suono rumore voce grido urlo sussurro sospiro risata
			pianto singhiozzo sbadiglio starnuto tosse silenzio botto sparo applauso allarme clacson suoneria fischio
			bau miao bambino neonato ragazzo adolescente adulto anziano nonno nonna bisnonno mamma papà madre padre
			genitore figlio figlia fratello sorella gemello zio zia cugino nipote marito moglie fidanzato parente
			suocero cognato vicino amico nemico compagno collega ospite sconosciuto straniero turista vittima eroe
			bugiardo signore signora sedia tavolo tavolino scrivania letto culla divano poltrona sgabello panca
			panchina mensola cassetto cassettiera credenza dispensa vetrina mobile attaccapanni scarpiera comò
			seggiolone sdraio amaca lenzuolo trapunta zanzariera cornice quadro persiana tapparella bancone cattedra
			gabbiano topo gallo tacchino pulcino agnello coccinella lepre dinosauro forchetta coltello bicchiere tappo
			penna pennarello colla foglio libro rivista giornale fumetto calendario diario biglietto fazzoletto
			sacchetto spugna bandiera cartello sveglia accendino collana orecchino cielo terra fango polvere pietra
			foresta campagna isola oceano pozzanghera fuoco fiamma buio goccia ghiaccio valanga frana incendio nido
			tana cipresso pesco melograno mimosa gelsomino rosmarino cespuglio tronco spiga chicco diamante carbone
			metallo idea pensiero parola frase nome numero significato opinione regola legge esempio progetto piano
			obiettivo romanzo capitolo pagina titolo religione politica mostro mago mummia zombie befana diavolo
			paradiso inferno pozione magia insegnante professore studente operaio impiegato segretario elettricista
			pizzaiolo gelataio barista scienziato architetto fotografo dentista chirurgo sindaco ministro presidente
			carabiniere vigile bagnino musica canto strumento opera rock pop rap casa appartamento bagno garage
			balcone ingresso aula ufficio negozio supermercato bar pizzeria gelateria pasticceria edicola banca chiesa
			cinema prigione università asilo parcheggio autostrada strada marciapiede fermata binario fabbrica
			grattacielo centro paese circo pozzo fontana camino pollo manzo spaghetti tagliatelle sugo ragù pesto
			salsa olio aceto farina cornetto brioche bruschetta piadina gelato arrosto minestrone brodo purè
			parmigiano mozzarella ricotta melone mandorla peperoncino vaniglia pallacanestro pallone canestro gara
			partita giocatore gol olimpiade mondiale scudetto nave pullman metropolitana passeggino carrello gommone
			jet camper roulotte portatile fotocamera cavo prolunga interruttore aspirapolvere lavastoviglie
			ferro_da_stiro condizionatore fornello cappa moka spazzola phon deodorante bagnoschiuma cerotto pillola
			carta_igienica barattolo lattina valigia chiavetta pannolino biberon ciuccio water sigaretta rosso verde
			giallo nero bianco azzurro grigio blu marrone castano biondo soldi denaro banconota spiccioli contanti
			resto mancia prezzo costo tassa bolletta scontrino bancomat carta_di_credito bonifico prelievo offerta
			vendita acquisto affare salvadanaio euro dollaro centesimo chip antenna segnale connessione indirizzo sito
			password utente file programma applicazione software codice errore virus pulsante icona aggiornamento
			video audio immagine robot caldo freddo fresco smog meteo maltempo spazio costellazione decollo missione
			alieno giorno domani dopodomani fine_settimana vacanza ferie ritardo orario appuntamento data compleanno
			capodanno carnevale pisolino pranzo cena colazione merenda attimo amore amicizia delusione curiosità
			meraviglia rispetto disgusto imbarazzo preoccupazione spavento orrore soddisfazione pigrizia voglia
			vendetta confusione divertimento egoismo generosità occhio bocca mano braccio gamba piede corpo viso pelo
			fianco seno scheletro mignolo narice cellula maglia maglietta vestito canottiera reggiseno mutande collant
			piumino scarpone tacco suola stringa cerchietto forcina tasca bavaglino camice bikini accappatoio pizzo
			pelliccia chiave_inglese spada arco freccia annaffiatoio tosaerba siringa pinzetta pompa apriscatole
			schiaccianoci mattarello bullone spremuta cola caffelatte ristretto aperitivo spritz amaretto
		`),
		rare: words(`
			donnola gnu suricato armadillo istrice ornitorinco lemure tapiro allodola pernice upupa
			cardellino ghiandaia poiana millepiedi salamandra tritone totano fiala ditale rondella catenaccio
			chiavistello cassone tino orcio mortaio brughiera estuario atollo istmo rupe crepaccio morena
			ghiaione secca geyser fumarola dolina cengia acquitrino ansa guado insenatura frangente falesia
			dirupo conca antro tarassaco ginkgo aneto dragoncello frassino olmo larice begonia petunia dalia
			giunco agata ossidiana basalto selce mica fluorite calcite malachite granato olivina tormalina
			zircone pirite magnetite ematite cinabro galena bismuto tungsteno manganese corniola diaspro
			onice berillo spinello peridoto arenaria scisto gneiss quarzite dolomite apatite barite corindone
			feldspato muscovite siderite limonite bauxite almanacco dottrina assioma paradigma induzione
			trattato stirpe retorica dialettica semantica disamina chimera idra grifone kraken basilisco
			golem runa naiade driade valchiria negromante bestiario satiro fauno arpia gorgone leviatano
			ondina silfide sortilegio grimorio pentacolo graal ippogrifo mantìcora spadaccino barcaiolo
			cocchiere birraio profumiere conciatore tessitore vetraio cappellaio archivista liuto preludio
			interludio ouverture notturno rapsodia requiem cantata quintetto semitono bocchino fagotto
			ocarina ciaramella cetra salterio campanaccio grancassa contrappunto cadenza arpeggio trillo
			glissando legato stornello bolero operetta melodramma bastione eremo mausoleo selciato
			imbarcadero chiusa fucina silo cotogna canoismo pentathlon decathlon tatami corazzata portantina
			monorotaia chiatta biplano idrovolante calesse diligenza ribaltabile mietitrice galea galeone
			fregata corvetta brigantino goletta piroga lancia ultraleggero cuociriso cristalleria vermiglio
			peltro giaietto ceruleo verderame celadon vinaccia carminio glauco verdeazzurro brunito rosaceo
			incarnato disavanzo royalty tesoreria rimessa arbitraggio prestatore solvibilità cambiale tratta
			giroconto gravame apporto decima cedola buffer codec cumulo puntatore compilatore firmware
			latenza gateway sottorete host carico_utile checksum cluster pipeline repository debugger macro
			analizzatore assemblatore bitrate throughput handshake endpoint cifratura decifratura hashing
			rendering shader texture reticolo ottetto commutazione multicast broadcast datagramma bootloader
			query grafo commit build trigger thread kernel caligine zefiro galaverna grecale ostro aliseo
			acquerugiola guazza magra libecciata groppo falce_lunare zenit ammasso eclittica novilunio
			perigeo vespro quasar pulsar parallasse parsec nadir azimut perielio afelio fotosfera cromosfera
			magnetosfera ionosfera esosfera mesosfera troposfera eliosfera nana imbrunire lustro albeggiare
			lasso indugio albore quadriennio sessennio giubilo struggimento temperanza riverenza fervore
			ardore disdegno tedio afflizione clemenza tripudio trepidazione soprassalto stupefazione brama
			bulbo perone omero metatarso frenulo fustagno marsina farsetto saio ghetta mezzoguanto polsiera
			crinolina mantiglia tricorno mantice lesina mazzuolo troncatrice cote erpice correggiato spola
			rivettatrice chiodatrice sgorbia smusso succhiello pialletto scalpellino graffietto graffatrice
			acciarino crogiolo fustella mandrino roncola accettino subbio idromele rosolio nocino ratafià
			centerbe
			tressette cerbottana caleidoscopio trampoli acchiapparello alfiere pedina gracidio sciabordio scampanio
			scalpiccio sciacquio picchiettio balbettio stridore raglio crepitio risonanza scoppiettio viandante nomade
			profugo discendente sonnambulo attaccabrighe guastafeste baldacchino arazzo pendola piantana candelabro
			paralume soprammobile scrittoio portagioie cofanetto fasciatoio tappezzeria leggio stuoia drappo
			cassapanca guanciale
			pergamena stuzzicadenti altura fondale magma eruzione maremoto affluente sottobosco leccio ippocastano
			susino bosso bucaneve fiordaliso ranuncolo anemone calendula maggiorana baccello tubero lichene spora
			gramigna fronda ghisa silice carbonio magnesio sodio potassio cadmio vanadio palladio molibdeno iridio
			citrino travertino porfido pomice marna breccia geode salgemma serpentino allume sonetto epilogo cerbero
			viverna gargolla cherubino purgatorio olimpo limbo maleficio scongiuro alchimia calderone sibilla
			mandragola lamia giullare mugnaio orafo plettro archetto mazurca madrigale minuetto romanza baritono
			clavicembalo ottavino piffero zufolo bemolle diesis labirinto polpettone gorgonzola taekwondo sumo
			mezzofondo contropiede bilanciere boccaglio filobus teleferica risciò portaerei incrociatore aliscafo
			rompighiaccio transatlantico deltaplano parapendio autobotte muletto biga umidificatore scaldabagno
			affettatrice gelatiera barometro tortora pervinca oltremare cipria ottanio turchino granata verdeacqua
			fatturato borsellino caparra bit byte processore circuito modem dominio algoritmo database variabile
			funzione classe interfaccia risoluzione terminale ricorsione favonio acquata piovasco cirro nembo zodiaco
			apogeo congiunzione propulsore etere nova magnetar brillamento occultazione radiotelescopio cosmologia
			astrofisica posterità giubileo ventennio beatitudine letizia gaudio infatuazione accidia gluteo midollo
			articolazione alluce anulare cuticola neurone globulo ormone cromosoma ghiandola tiroide pancreas
			cistifellea molare canino incisivo ugola bronco alveolo aorta salopette kimono paraorecchie tailleur raso
			tulle poliestere feltro camoscio smerigliatrice bulino machete forcone frattazzo bisturi uncinetto telaio
			arcolaio cesello argano paranco maglio piccozza mannaia tassello perforatrice karkadè centrifugato
			nebbiolo trebbiano vermentino sangiovese aglianico falanghina verdicchio assenzio genepì maraschino
			alchermes latticello granatina shakerato
		`)
	}
};
