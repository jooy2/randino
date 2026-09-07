import { words } from '../../_internal/parse.js';
import type { WordPool } from '../../word/data/types.js';
import type { PredicateTense, SentenceLanguageData } from './types.js';

// The two forms an Italian verb group is written in: the third person singular
// of the present, and the same person of the passato remoto, which is the tense
// written prose tells a story in.
function tensed(present: string, past: string): { words: WordPool; past: PredicateTense } {
	return { words: words(present), past: { words: words(past) } };
}

export const IT: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' },
	quotes: { double: ['«', '»'], single: ['“', '”'] },
	// The definite article, which Italian picks by gender and by the sound the
	// noun opens on: `l'` before a vowel, `lo` before an s plus a consonant and
	// the handful of clusters that go with it, `il` for everything else. The
	// elided form carries its own boundary, so nothing is written between it and
	// the noun.
	articles: {
		m: [
			['a', "l'"],
			['e', "l'"],
			['i', "l'"],
			['o', "l'"],
			['u', "l'"],
			['gn', 'lo'],
			['pn', 'lo'],
			['ps', 'lo'],
			['x', 'lo'],
			['y', 'lo'],
			['z', 'lo'],
			['sb', 'lo'],
			['sc', 'lo'],
			['sd', 'lo'],
			['sf', 'lo'],
			['sg', 'lo'],
			['sl', 'lo'],
			['sm', 'lo'],
			['sn', 'lo'],
			['sp', 'lo'],
			['sq', 'lo'],
			['sr', 'lo'],
			['st', 'lo'],
			['sv', 'lo'],
			['', 'il']
		],
		f: [
			['a', "l'"],
			['e', "l'"],
			['i', "l'"],
			['o', "l'"],
			['u', "l'"],
			['', 'la']
		]
	},
	predicateAgrees: true,
	verbs: [
		{
			field: 'rise',
			subject: ['creature', 'person'],
			...tensed(
				`si_sveglia si_alza si_desta si_ridesta si_tira_su si_mette_seduto apre_gli_occhi si_stiracchia si_mette_in_piedi balza_in_piedi`,
				`si_svegliò si_alzò si_destò si_ridestò si_tirò_su si_mise_seduto aprì_gli_occhi si_stiracchiò si_mise_in_piedi balzò_in_piedi`
			)
		},
		// Setting off: the verbs that need somewhere to go, and the ones that stand
		// on their own. `verso` rather than `a`, because every Italian preposition
		// merges with the article behind it and `verso` is the one that does not.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`va si_dirige si_avvia si_avvicina avanza si_incammina si_muove viaggia si_affretta si_lancia procede si_sposta`,
				`andò si_diresse si_avviò si_avvicinò avanzò si_incamminò si_mosse viaggiò si_affrettò si_lanciò procedette si_spostò`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			// Running somewhere is for legs: a fish and a snake go, and do not run.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(
				`corre cammina sale scende trotta passeggia salta zoppica si_arrampica marcia`,
				`corse camminò salì scese trottò passeggiò saltò zoppicò si_arrampicò marciò`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...tensed(
				`parte se_ne_va esce se_ne_esce si_allontana si_ritira si_mette_in_cammino si_mette_in_viaggio sgattaiola_via svanisce se_la_svigna si_avvia si_incammina`,
				`partì se_ne_andò uscì se_ne_uscì si_allontanò si_ritirò si_mise_in_cammino si_mise_in_viaggio sgattaiolò_via svanì se_la_svignò si_avviò si_incamminò`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`torna arriva rientra giunge viene si_avvicina avanza raggiunge si_sposta ritorna`,
				`tornò arrivò rientrò giunse venne si_avvicinò avanzò raggiunse si_spostò ritornò`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...tensed(
				`ritorna rincasa riappare arriva_a_casa compare ricompare si_presenta si_affaccia entra fa_ritorno torna_a_casa si_fa_vivo`,
				`ritornò rincasò riapparve arrivò_a_casa comparve ricomparve si_presentò si_affacciò entrò fece_ritorno tornò_a_casa si_fece_vivo`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(
				`corre cammina salta passeggia gironzola trotta corricchia saltella marcia zoppica si_arrampica fa_un_salto fa_due_passi cammina_in_punta_di_piedi avanza_a_grandi_passi scalpita zampetta sgambetta`,
				`corse camminò saltò passeggiò gironzolò trottò corricchiò saltellò marciò zoppicò si_arrampicò fece_un_salto fece_due_passi camminò_in_punta_di_piedi avanzò_a_grandi_passi scalpitò zampettò sgambettò`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			...tensed(
				`vaga passa si_muove avanza indietreggia gira gira_in_tondo si_sposta scivola si_aggira ronza si_avvicina si_allontana attraversa sguscia_via`,
				`vagò passò si_mosse avanzò indietreggiò girò girò_in_tondo si_spostò scivolò si_aggirò ronzò si_avvicinò si_allontanò attraversò sgusciò_via`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			...tensed(
				`nuota si_tuffa sguazza galleggia si_immerge riemerge nuota_in_tondo`,
				`nuotò si_tuffò sguazzò galleggiò si_immerse riemerse nuotò_in_tondo`
			)
		},
		{
			field: 'move',
			// Flying is a flier's alone: a sparrow's, a dragon's, never a fish's.
			subject: ['creature'],
			subjectTraits: ['flier'],
			...tensed(
				`vola decolla plana svolazza sbatte_le_ali si_alza_in_volo si_posa atterra si_libra sorvola spicca_il_volo plana_in_basso volteggia`,
				`volò decollò planò svolazzò sbatté_le_ali si_alzò_in_volo si_posò atterrò si_librò sorvolò spiccò_il_volo planò_in_basso volteggiò`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			...tensed(
				`striscia si_trascina serpeggia scivola si_attorciglia si_contorce gattona sguscia avanza_strisciando scava`,
				`strisciò si_trascinò serpeggiò scivolò si_attorcigliò si_contorse gattonò sgusciò avanzò_strisciando scavò`
			)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...tensed(
				`aspetta si_nasconde si_guarda_intorno esita si_ferma attende ascolta tentenna dubita resta_fermo rimane_immobile si_acquatta spia fa_capolino dà_un'occhiata indugia bighellona ciondola si_blocca fa_una_pausa osserva_in_silenzio resta_in_attesa`,
				`aspettò si_nascose si_guardò_intorno esitò si_fermò attese ascoltò tentennò dubitò restò_fermo rimase_immobile si_acquattò spiò fece_capolino diede_un'occhiata indugiò bighellonò ciondolò si_bloccò fece_una_pausa osservò_in_silenzio restò_in_attesa`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...tensed(
				`riposa si_siede si_sdraia si_appoggia si_rannicchia si_riposa si_stende si_distende si_rilassa si_inginocchia si_accovaccia si_stiracchia si_accascia riprende_fiato si_accomoda si_mette_comodo fa_una_sosta si_adagia si_riposa_un_po' si_abbandona`,
				`riposò si_sedette si_sdraiò si_appoggiò si_rannicchiò si_riposò si_stese si_distese si_rilassò si_inginocchiò si_accovacciò si_stiracchiò si_accasciò riprese_fiato si_accomodò si_mise_comodo fece_una_sosta si_adagiò si_riposò_un_po' si_abbandonò`
			)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...tensed(
				`dorme si_addormenta sonnecchia si_assopisce schiaccia_un_pisolino ciondola_il_capo crolla_dal_sonno russa sogna si_appisola chiude_gli_occhi dorme_profondamente cade_addormentato dorme_della_grossa`,
				`dormì si_addormentò sonnecchiò si_assopì schiacciò_un_pisolino ciondolò_il_capo crollò_dal_sonno russò sognò si_appisolò chiuse_gli_occhi dormì_profondamente cadde_addormentato dormì_della_grossa`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...tensed(
				`ride piange sbadiglia sospira sorride canticchia borbotta grida ridacchia singhiozza geme brontola fischietta esclama esulta ansima si_stringe_nelle_spalle annuisce aggrotta_la_fronte starnutisce ha_il_singhiozzo applaude fa_l'occhiolino arrossisce scoppia_a_ridere piagnucola sbuffa strilla balbetta fa_una_smorfia scuote_la_testa saluta_con_la_mano mugugna`,
				`rise pianse sbadigliò sospirò sorrise canticchiò borbottò gridò ridacchiò singhiozzò gemette brontolò fischiettò esclamò esultò ansimò si_strinse_nelle_spalle annuì aggrottò_la_fronte starnutì ebbe_il_singhiozzo applaudì fece_l'occhiolino arrossì scoppiò_a_ridere piagnucolò sbuffò strillò balbettò fece_una_smorfia scosse_la_testa salutò_con_la_mano mugugnò`
			)
		},
		{
			field: 'talk',
			subject: ['creature', 'person'],
			...tensed(
				`chiacchiera parla conversa discorre spettegola ciarla sussurra bisbiglia dialoga si_intrattiene racconta_storie saluta scambia_due_parole parlotta confabula`,
				`chiacchierò parlò conversò discorse spettegolò ciarlò sussurrò bisbigliò dialogò si_intrattenne raccontò_storie salutò scambiò_due_parole parlottò confabulò`
			)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...tensed(
				`balla canta rotola gioca saltella scherza salta fa_capriole gira fa_giravolte si_rotola gioca_a_nascondino fa_il_buffone si_diverte fa_piroette si_dondola ruzzola schiamazza fa_salti_di_gioia si_scatena`,
				`ballò cantò rotolò giocò saltellò scherzò saltò fece_capriole girò fece_giravolte si_rotolò giocò_a_nascondino fece_il_buffone si_divertì fece_piroette si_dondolò ruzzolò schiamazzò fece_salti_di_gioia si_scatenò`
			)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			...tensed(
				`ricorda dimentica immagina conta rievoca rimpiange pensa_a sogna medita_su riflette_su considera contempla crede_in confida_in brama sente_la_mancanza_di si_ricorda_di si_chiede_di si_preoccupa_per capisce comprende visualizza si_immagina teme desidera`,
				`ricordò dimenticò immaginò contò rievocò rimpianse pensò_a sognò meditò_su rifletté_su considerò contemplò credette_in confidò_in bramò sentì_la_mancanza_di si_ricordò_di si_chiese_di si_preoccupò_per capì comprese visualizzò si_immaginò temette desiderò`
			)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`guarda osserva contempla esamina tocca accarezza vede sorveglia studia ispeziona scruta sbircia dà_un'occhiata_a ammira analizza controlla palpa sfiora tasta bussa_su annusa fiuta soppesa maneggia adocchia intravede riguarda`,
				`guardò osservò contemplò esaminò toccò accarezzò vide sorvegliò studiò ispezionò scrutò sbirciò diede_un'occhiata_a ammirò analizzò controllò palpò sfiorò tastò bussò_su annusò fiutò soppesò maneggiò adocchiò intravide riguardò`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...tensed(
				`cerca rovista fruga esplora scava curiosa perlustra indaga ficcanasa mette_tutto_sottosopra guarda_dappertutto annusa_in_giro scandaglia setaccia ispeziona_il_posto va_in_cerca`,
				`cercò rovistò frugò esplorò scavò curiosò perlustrò indagò ficcanasò mise_tutto_sottosopra guardò_dappertutto annusò_in_giro scandagliò setacciò ispezionò_il_posto andò_in_cerca`
			)
		},
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`trova scopre scorge raccoglie individua dissotterra si_imbatte_in inciampa_in recupera salva porta_alla_luce solleva_da_terra scopre_per_caso rinviene tira_fuori`,
				`trovò scoprì scorse raccolse individuò dissotterrò si_imbatté_in inciampò_in recuperò salvò portò_alla_luce sollevò_da_terra scoprì_per_caso rinvenne tirò_fuori`
			)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`sceglie prende afferra piglia tira_fuori riceve acchiappa stringe regge solleva alza raccoglie raduna seleziona accetta ottiene si_porta_via si_tiene si_mette_in_tasca impugna agguanta ghermisce strappa si_impossessa_di arraffa accumula`,
				`scelse prese afferrò pigliò tirò_fuori ricevette acchiappò strinse resse sollevò alzò raccolse radunò selezionò accettò ottenne si_portò_via si_tenne si_mise_in_tasca impugnò agguantò ghermì strappò si_impossessò_di arraffò accumulò`
			)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`porta reca trasporta trascina spinge tira rimorchia porta_in_spalla si_carica_di porta_con_sé si_porta_dietro sposta trasferisce solleva trascina_via`,
				`portò recò trasportò trascinò spinse tirò rimorchiò portò_in_spalla si_caricò_di portò_con_sé si_portò_dietro spostò trasferì sollevò trascinò_via`
			)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`nasconde ripone custodisce sotterra conserva immagazzina accumula tesaurizza mette_da_parte riserva avvolge copre tappa dissimula mette_al_sicuro chiude_a_chiave infila_in_un_cassetto lascia_al_sicuro sorveglia protegge rinchiude archivia impacchetta occulta`,
				`nascose ripose custodì sotterrò conservò immagazzinò accumulò tesaurizzò mise_da_parte riservò avvolse coprì tappò dissimulò mise_al_sicuro chiuse_a_chiave infilò_in_un_cassetto lasciò_al_sicuro sorvegliò protesse rinchiuse archiviò impacchettò occultò`
			)
		},
		{
			field: 'lose',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`perde smarrisce dimentica lascia_cadere molla lascia_indietro si_dimentica_di trascura lascia_lì perde_di_vista fa_cadere scorda`,
				`perse smarrì dimenticò lasciò_cadere mollò lasciò_indietro si_dimenticò_di trascurò lasciò_lì perse_di_vista fece_cadere scordò`
			)
		},
		{
			field: 'meet',
			subject: ['creature', 'person'],
			object: ['person'],
			...tensed(
				`incontra saluta si_imbatte_in incrocia raggiunge va_a_trovare fa_visita_a accoglie dà_il_benvenuto_a rivede vede abbraccia saluta_con_la_mano si_ritrova_con si_unisce_a`,
				`incontrò salutò si_imbatté_in incrociò raggiunse andò_a_trovare fece_visita_a accolse diede_il_benvenuto_a rivide vide abbracciò salutò_con_la_mano si_ritrovò_con si_unì_a`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`costruisce fabbrica intaglia dipinge tesse monta fa crea disegna realizza assembla modella scolpisce inventa produce finisce idea progetta dà_forma_a completa perfeziona decora abbellisce plasma compone`,
				`costruì fabbricò intagliò dipinse tessé montò fece creò disegnò realizzò assemblò modellò scolpì inventò produsse finì ideò progettò diede_forma_a completò perfezionò decorò abbellì plasmò compose`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			// Forged, cast and welded: metal and wood, never a coat or a jewel.
			objectThemes: ['object', 'tool', 'vehicle'],
			...tensed(
				`forgia fonde salda martella ribatte avvita lavora lima`,
				`forgiò fuse saldò martellò ribatté avvitò lavorò limò`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing'],
			// Sewn and knitted: what is worn.
			objectThemes: ['clothing'],
			...tensed(
				`cuce confeziona ricama rammenda imbastisce cuce_a_mano lavora_a_maglia sferruzza`,
				`cucì confezionò ricamò rammendò imbastì cucì_a_mano lavorò_a_maglia sferruzzò`
			)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`ripara pulisce lucida sistema riordina aggiusta strofina lava sfrega scuote spolvera sciacqua asciuga lustra fa_brillare accorda stringe ingrassa lubrifica rattoppa restaura rinnova controlla mantiene cura si_prende_cura_di vernicia spazzola stira rimette_a_posto ritocca sgrassa`,
				`riparò pulì lucidò sistemò riordinò aggiustò strofinò lavò sfregò scosse spolverò sciacquò asciugò lustrò fece_brillare accordò strinse ingrassò lubrificò rattoppò restaurò rinnovò controllò mantenne curò si_prese_cura_di verniciò spazzolò stirò rimise_a_posto ritoccò sgrassò`
			)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`vende consegna cede offre smercia mette_all'asta commercia liquida piazza svende mette_in_vendita si_sbarazza_di rivende espone mostra contratta_su scambia baratta cede_via`,
				`vendette consegnò cedette offrì smerciò mise_all'asta commerciò liquidò piazzò svendette mise_in_vendita si_sbarazzò_di rivendette espose mostrò contrattò_su scambiò barattò cedette_via`
			)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			...tensed(
				`compra acquista ordina procura paga si_procura si_aggiudica prenota si_compra si_assicura investe_in fa_incetta_di si_prende sceglie_e_paga`,
				`comprò acquistò ordinò procurò pagò si_procurò si_aggiudicò prenotò si_comprò si_assicurò investì_in fece_incetta_di si_prese scelse_e_pagò`
			)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`cuoce scalda cucina taglia arrostisce serve frigge bolle lessa salta_in_padella condisce insaporisce sala mescola rimesta sbatte stufa brasa tosta gratina sbuccia trita affetta grattugia riscalda prepara impiatta marina griglia inforna spezzetta pela`,
				`cosse scaldò cucinò tagliò arrostì servì frisse bollì lessò saltò_in_padella condì insaporì salò mescolò rimestò sbatté stufò brasò tostò gratinò sbucciò tritò affettò grattugiò riscaldò preparò impiattò marinò grigliò infornò spezzettò pelò`
			)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`mangia mastica assaggia rosicchia divora gusta degusta inghiotte ingoia trangugia morde rode lecca sbocconcella dà_un_morso_a si_mangia finisce si_pappa spazzola ingurgita pilucca si_gode fa_fuori consuma`,
				`mangiò masticò assaggiò rosicchiò divorò gustò degustò inghiottì ingoiò trangugiò morse rose leccò sbocconcellò diede_un_morso_a si_mangiò finì si_pappò spazzolò ingurgitò piluccò si_godette fece_fuori consumò`
			)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			...tensed(
				`beve sorseggia tracanna gusta inghiotte si_beve si_scola prende assapora assaggia centellina beve_a_piccoli_sorsi beve_d'un_fiato dà_un_sorso_a svuota finisce si_gode manda_giù sorbisce trangugia`,
				`bevve sorseggiò tracannò gustò inghiottì si_bevve si_scolò prese assaporò assaggiò centellinò bevve_a_piccoli_sorsi bevve_d'un_fiato diede_un_sorso_a svuotò finì si_godette mandò_giù sorbì trangugiò`
			)
		},
		{
			field: 'change',
			subject: ['place'],
			...tensed(
				`si_calma si_oscura si_illumina si_riempie si_svuota si_anima si_sveglia si_addormenta si_zittisce ammutolisce si_acquieta si_agita brulica si_affolla si_riempie_di_gente si_svuota_del_tutto resta_in_silenzio brilla risplende riluce si_gela si_ghiaccia si_sgela si_bagna si_asciuga si_allaga si_spegne si_accende si_trasforma cambia albeggia imbrunisce si_copre_di_nebbia si_copre_di_neve si_ripopola si_rasserena si_rianima`,
				`si_calmò si_oscurò si_illuminò si_riempì si_svuotò si_animò si_svegliò si_addormentò si_zittì ammutolì si_acquietò si_agitò brulicò si_affollò si_riempì_di_gente si_svuotò_del_tutto restò_in_silenzio brillò risplendette rilusse si_gelò si_ghiacciò si_sgelò si_bagnò si_asciugò si_allagò si_spense si_accese si_trasformò cambiò albeggiò imbrunì si_coprì_di_nebbia si_coprì_di_neve si_ripopolò si_rasserenò si_rianimò`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...tensed(
				`brilla scorre si_approfondisce inizia finisce continua passa prosegue trascorre avanza si_avvicina arriva si_allontana si_prolunga si_protrae indugia si_ripete svanisce si_conclude termina si_svolge si_intensifica si_placa si_attenua persiste dura cessa`,
				`brillò scorse si_approfondì iniziò finì continuò passò proseguì trascorse avanzò si_avvicinò arrivò si_allontanò si_prolungò si_protrasse indugiò si_ripeté svanì si_concluse terminò si_svolse si_intensificò si_placò si_attenuò persistette durò cessò`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a time of day or a season does: it breaks, wears away, draws in.
			subjectThemes: ['time'],
			...tensed(
				`albeggia imbrunisce spunta declina cala scorre_via se_ne_va fugge vola scivola_via avanza_lentamente si_insedia cambia si_accorcia si_allunga si_spegne muore rinasce volge_al_termine`,
				`albeggiò imbrunì spuntò declinò calò scorse_via se_ne_andò fuggì volò scivolò_via avanzò_lentamente si_insediò cambiò si_accorciò si_allungò si_spense morì rinacque volse_al_termine`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What weather does: it rolls in, sets in, lets up.
			subjectThemes: ['weather'],
			...tensed(
				`arriva si_avvicina incombe scoppia infuria si_placa spiove si_schiarisce si_dissolve si_alza si_allontana passa_oltre sferza imperversa si_scatena cessa si_intensifica si_indebolisce copre_il_cielo avvolge_tutto cade si_attenua`,
				`arrivò si_avvicinò incombé scoppiò infuriò si_placò spiovve si_schiarì si_dissolse si_alzò si_allontanò passò_oltre sferzò imperversò si_scatenò cessò si_intensificò si_indebolì coprì_il_cielo avvolse_tutto cadde si_attenuò`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a match does: it kicks off, heats up, wraps up.
			subjectThemes: ['sport'],
			...tensed(
				`comincia prende_il_via si_apre riprende si_interrompe viene_sospeso va_ai_supplementari si_infiamma si_decide si_disputa si_svolge si_gioca si_chiude volge_al_termine entra_nel_vivo si_fa_emozionante`,
				`cominciò prese_il_via si_aprì riprese si_interruppe venne_sospeso andò_ai_supplementari si_infiammò si_decise si_disputò si_svolse si_giocò si_chiuse volse_al_termine entrò_nel_vivo si_fece_emozionante`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What a thing one can hold does. A song is a thing of another kind, below.
			subjectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...tensed(
				`oscilla luccica cade rotola si_inclina invecchia brilla risplende scintilla trema vibra barcolla traballa si_ribalta crolla scivola sdrucciola precipita gira ruota si_ferma si_arresta si_muove si_sposta si_consuma sbiadisce si_spegne si_appanna si_deforma si_piega si_storce vola_via rimbalza salta sussulta dondola si_assesta resta_fermo si_sciupa si_sporca si_copre_di_polvere`,
				`oscillò luccicò cadde rotolò si_inclinò invecchiò brillò risplendette scintillò tremò vibrò barcollò traballò si_ribaltò crollò scivolò sdrucciolò precipitò girò ruotò si_fermò si_arrestò si_mosse si_spostò si_consumò sbiadì si_spense si_appannò si_deformò si_piegò si_storse volò_via rimbalzò saltò sussultò dondolò si_assestò restò_fermo si_sciupò si_sporcò si_coprì_di_polvere`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What only something made of metal and wood does: a jewel never rusts.
			subjectThemes: ['object', 'tool', 'vehicle'],
			...tensed(
				`si_arrugginisce cigola scricchiola sferraglia stride tintinna si_rompe si_spezza si_crepa si_incrina si_spacca si_inceppa si_blocca si_allenta si_stacca si_smonta si_guasta si_danneggia fa_fumo si_ammacca va_in_pezzi`,
				`si_arrugginì cigolò scricchiolò sferragliò stridette tintinnò si_ruppe si_spezzò si_crepò si_incrinò si_spaccò si_inceppò si_bloccò si_allentò si_staccò si_smontò si_guastò si_danneggiò fece_fumo si_ammaccò andò_in_pezzi`
			)
		},
		{
			field: 'change',
			subject: ['thing'],
			// What a song or a drum does: it plays, rings out, dies away.
			subjectThemes: ['music'],
			...tensed(
				`suona risuona rimbomba fluttua si_leva si_spegne svanisce si_estingue tace si_ferma si_ripete continua prosegue si_prolunga si_propaga si_espande si_sente arriva_da_lontano fa_eco riecheggia cresce cala sale scende si_alza si_impone`,
				`suonò risuonò rimbombò fluttuò si_levò si_spense svanì si_estinse tacque si_fermò si_ripeté continuò proseguì si_prolungò si_propagò si_espanse si_sentì arrivò_da_lontano fece_eco riecheggiò crebbe calò salì scese si_alzò si_impose`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...tensed(
				`viaggia si_ferma passa torna parte scivola parte_in_corsa avanza rotola accelera frena si_arresta si_allontana si_avvicina gira svolta fa_inversione indietreggia parcheggia si_posteggia arriva esce entra si_muove sferraglia vibra sbanda slitta ronza ruggisce si_mette_in_moto si_ferma_di_colpo prosegue_la_corsa va_piano sfreccia`,
				`viaggiò si_fermò passò tornò partì scivolò partì_in_corsa avanzò rotolò accelerò frenò si_arrestò si_allontanò si_avvicinò girò svoltò fece_inversione indietreggiò parcheggiò si_posteggiò arrivò uscì entrò si_mosse sferragliò vibrò sbandò slittò ronzò ruggì si_mise_in_moto si_fermò_di_colpo proseguì_la_corsa andò_piano sfrecciò`
			)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...tensed(
				`si_diffonde svanisce rimane fluttua cresce si_dissolve sfuma si_diluisce si_indebolisce si_rafforza si_intensifica sorge affiora emerge risorge rinasce torna ritorna si_spegne si_assesta si_insedia si_accumula si_radica mette_radici si_agita si_calma si_placa si_ravviva si_accende si_propaga si_espande persiste perdura si_dilegua sale scende cambia oscilla si_ingigantisce si_riduce si_trasforma si_perde si_cancella`,
				`si_diffuse svanì rimase fluttuò crebbe si_dissolse sfumò si_diluì si_indebolì si_rafforzò si_intensificò sorse affiorò emerse risorse rinacque tornò ritornò si_spense si_assestò si_insediò si_accumulò si_radicò mise_radici si_agitò si_calmò si_placò si_ravvivò si_accese si_propagò si_espanse persistette perdurò si_dileguò salì scese cambiò oscillò si_ingigantì si_ridusse si_trasformò si_perse si_cancellò`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			...tensed(
				`cresce appassisce fiorisce oscilla germoglia germina rinverdisce mette_gemme mette_foglie mette_radici si_apre si_schiude ingiallisce si_secca si_dissecca si_piega si_inclina si_curva si_allunga si_arrampica si_intreccia si_estende dà_frutti fruttifica profuma si_agita trema stormisce dondola si_erge si_raddrizza perde_le_foglie si_spoglia rivive risorge si_infittisce prospera si_sviluppa sboccia avvizzisce`,
				`crebbe appassì fiorì oscillò germogliò germinò rinverdì mise_gemme mise_foglie mise_radici si_aprì si_schiuse ingiallì si_seccò si_disseccò si_piegò si_inclinò si_curvò si_allungò si_arrampicò si_intrecciò si_estese diede_frutti fruttificò profumò si_agitò tremò stormì dondolò si_erse si_raddrizzò perse_le_foglie si_spogliò rivisse risorse si_infittì prosperò si_sviluppò sbocciò avvizzì`
			)
		},
		{
			field: 'change',
			subject: ['body'],
			...tensed(
				`trema si_muove si_intorpidisce guarisce rabbrividisce batte pulsa si_contrae si_tende si_rilassa si_allenta si_irrigidisce si_indurisce si_ammorbidisce si_scalda si_raffredda si_gonfia si_sgonfia si_infiamma fa_male brucia prude formicola suda si_stanca si_sfinisce si_riprende si_ristora si_allunga si_accorcia si_piega si_flette si_alza si_abbassa si_solleva si_gira si_agita cede si_risveglia si_apre si_chiude sussulta pizzica`,
				`tremò si_mosse si_intorpidì guarì rabbrividì batté pulsò si_contrasse si_tese si_rilassò si_allentò si_irrigidì si_indurì si_ammorbidì si_scaldò si_raffreddò si_gonfiò si_sgonfiò si_infiammò fece_male bruciò prudette formicolò sudò si_stancò si_sfinì si_riprese si_ristorò si_allungò si_accorciò si_piegò si_flesse si_alzò si_abbassò si_sollevò si_girò si_agitò cedette si_risvegliò si_aprì si_chiuse sussultò pizzicò`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			...tensed(
				`matura si_raffredda bolle si_scioglie si_guasta si_scalda si_intiepidisce fuma emana_vapore profuma manda_un_buon_odore finisce si_esaurisce avanza resta si_riduce arriva_in_tavola viene_servito si_rapprende si_indurisce si_ammorbidisce marcisce va_a_male fermenta si_congela si_addensa si_schiarisce si_deposita riposa si_raffredda_del_tutto`,
				`maturò si_raffreddò bollì si_sciolse si_guastò si_scaldò si_intiepidì fumò emanò_vapore profumò mandò_un_buon_odore finì si_esaurì avanzò restò si_ridusse arrivò_in_tavola venne_servito si_rapprese si_indurì si_ammorbidì marcì andò_a_male fermentò si_congelò si_addensò si_schiarì si_depositò riposò si_raffreddò_del_tutto`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a dish does and a drink does not: it sizzles, crumbles, goes stale.
			subjectThemes: ['food'],
			...tensed(
				`sfrigola si_dora si_abbrustolisce si_brucia si_strinaccia si_sbriciola si_sgretola diventa_duro diventa_stantio si_secca si_dissecca si_inumidisce ammuffisce inacidisce si_gonfia lievita si_cuoce si_inforna si_arrostisce si_frigge si_disfa si_sfalda cede`,
				`sfrigolò si_dorò si_abbrustolì si_bruciò si_strinacciò si_sbriciolò si_sgretolò diventò_duro diventò_stantio si_seccò si_disseccò si_inumidì ammuffì inacidì si_gonfiò lievitò si_cosse si_infornò si_arrostì si_frisse si_disfece si_sfaldò cedette`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a drink does and a dish does not: it fizzes, spills, goes flat.
			subjectThemes: ['drink'],
			...tensed(
				`frizza spumeggia fa_la_schiuma si_versa si_rovescia schizza sciaborda si_agita si_mescola si_intorbida si_schiarisce si_deposita perde_il_gas evapora trabocca gocciola cola si_annacqua si_concentra si_ghiaccia`,
				`frizzò spumeggiò fece_la_schiuma si_versò si_rovesciò schizzò sciabordò si_agitò si_mescolò si_intorbidì si_schiarì si_depositò perse_il_gas evaporò traboccò gocciolò colò si_annacquò si_concentrò si_ghiacciò`
			)
		}
	],
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`
				grande piccolo veloce lento silenzioso rumoroso coraggioso pigro feroce mite arguto sveglio
				giovane anziano forte debole audace timido orgoglioso vivace sereno testardo agile attento robusto onesto astuto
			`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'hungry',
			words: words(`affamato famelico digiuno vorace`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'full',
			words: words(`sazio pieno appagato satollo`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			words: words(`stanco assonnato esausto sfinito spossato affaticato`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			words: words(`riposato fresco vispo arzillo leggero vigoroso`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			words: words(`felice contento allegro sereno lieto gioioso soddisfatto raggiante`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			words: words(`annoiato curioso inquieto agitato impaziente ansioso irrequieto trepidante`)
		},
		{
			subject: [
				'creature',
				'person',
				'plant',
				'edible',
				'thing',
				'vehicle',
				'place',
				'event',
				'idea',
				'body'
			],
			words: words(
				`bello strano nuovo comune raro grazioso familiare singolare ordinario splendido prezioso`
			)
		},
		{
			subject: ['place', 'event'],
			words: words(`
				ampio stretto tranquillo profondo scuro chiaro lontano ripido
				affollato deserto angusto vuoto immenso cupo pianeggiante lungo breve luminoso
			`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`
				duro leggero pesante vecchio liscio trasparente robusto
				rotondo piatto appuntito sottile grosso fragile lussuoso semplice delicato ruvido lucente
			`)
		},
		{
			subject: ['edible'],
			words: words(
				`dolce salato piccante aspro caldo freddo saporito amaro denso morbido tiepido succoso croccante gustoso insipido`
			)
		},
		{
			subject: ['idea'],
			words: words(
				`semplice evidente vago eterno fugace complesso limpido profondo familiare prezioso segreto minuto difficile facile`
			)
		},
		{
			subject: ['plant'],
			words: words(`verde rigoglioso profumato appassito alto tenero snello florido rado fitto`)
		},
		{
			subject: ['body'],
			words: words(
				`caldo freddo dolente rigido morbido ruvido liscio pallido forte intorpidito pesante`
			)
		}
	],
	// Masculine singular, the form `agreement` reshapes, after the noun.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				coraggioso vivace gentile occupato pigro timido sveglio giovane vecchio piccolo grande silenzioso allegro paziente agile curioso
				audace timoroso cauto testardo mite rumoroso robusto magro assonnato astuto attento taciturno orgoglioso innocente onesto desto sereno
			`)
		},
		{
			subject: ['person'],
			words: words(`
				giovane gentile severo serio occupato sincero
				saggio umile educato abile famoso povero ricco anziano sorridente arguto affabile laborioso
			`)
		},
		{
			subject: ['creature'],
			words: words(
				`veloce feroce mansueto paffuto piccolino peloso maculato striato smilzo enorme destro tondeggiante lucido allungato`
			)
		},
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(`
				dolce piccante tiepido fresco croccante saporito fragrante caldo salato morbido maturo gustoso
				dorato affumicato cremoso tenero succoso sostanzioso fumante tostato appiccicoso insipido speziato
			`)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(
				`dolce tiepido freddo fresco caldo fragrante forte amaro cremoso ghiacciato lattiginoso torbido limpido frizzante morbido temperato`
			)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`
				vecchio nuovo piccolo grande leggero pesante lucente liscio trasparente duro bello prezioso antico
				arrugginito consumato lucidato semplice sfarzoso stretto largo rotondo piatto appuntito smussato fragile cavo polveroso storto
			`)
		},
		{
			subject: ['vehicle'],
			words: words(
				`veloce lento robusto cigolante rilucente arrugginito sgangherato enorme rumoroso malandato`
			)
		},
		{
			subject: ['place'],
			words: words(`
				tranquillo ampio scuro luminoso strano vecchio accogliente isolato affollato silenzioso remoto lontano vicino vuoto solitario soleggiato
				angusto gremito ventoso nebbioso ombroso polveroso umido roccioso ripido pianeggiante desolato verdeggiante deserto sgombro
			`)
		},
		{
			subject: ['plant'],
			words: words(`
				verde rigoglioso profumato giovane appassito alto piccolo tenero fresco
				spinoso fiorito germogliante rampicante selvatico snello pallido cadente folto
			`)
		},
		{
			subject: ['idea'],
			words: words(`
				vago vecchio nuovo strano chiaro prezioso piccolo curioso
				tenue semplice aggrovigliato ostinato fugace lontano audace segreto silenzioso familiare
			`)
		},
		{
			subject: ['event'],
			words: words(`
				lungo breve tranquillo soleggiato nuvoloso rumoroso improvviso
				solenne allegro noioso piovoso tempestoso sereno gremito animato splendido sobrio
			`)
		},
		{
			subject: ['body'],
			words: words(
				`piccolo freddo caldo esile robusto morbido rigido dolente ruvido liscio pallido forte`
			)
		},
		{
			subject: [
				'creature',
				'person',
				'plant',
				'thing',
				'vehicle',
				'place',
				'event',
				'idea',
				'body'
			],
			words: words(
				`bello misterioso strano nuovo grazioso familiare singolare ordinario splendido modesto`
			)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				in_silenzio lentamente rapidamente dolcemente improvvisamente appena da_solo brevemente costantemente
				audacemente con_cura avidamente tranquillamente allegramente fortemente pazientemente leggermente serenamente
				vivacemente goffamente con_calma
				furtivamente in_punta_di_piedi affannosamente frettolosamente attentamente distrattamente
				nervosamente curiosamente orgogliosamente timidamente amabilmente amaramente severamente
				sonnolentamente sbadatamente teneramente bruscamente abilmente destramente decisamente
				felicemente tristemente pesantemente animatamente a_stento di_malavoglia apposta
				senza_dire_nulla di_slancio senza_fretta di_gusto a_bassa_voce senza_sosta
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(`
				in_silenzio lentamente dolcemente improvvisamente appena di_nuovo ancora piano_piano debolmente a_poco_a_poco
				gradualmente
				silenziosamente lievemente intensamente vivacemente profondamente ampiamente fiocamente calorosamente
				freddamente soavemente densamente fermamente pesantemente leggermente incessantemente
				costantemente eternamente ancora_una_volta per_un_po' di_colpo ovunque
			`)
		}
	],
	times: {
		day: words(`
			all'alba di_prima_mattina al_mattino a_mezzogiorno nel_pomeriggio al_tramonto di_sera di_notte
			a_notte_fonda a_mezzanotte
		`),
		any: words(`
			in_primavera in_estate in_autunno in_inverno nel_fine_settimana nei_giorni_festivi tutto_il_giorno
			in_piena_primavera a_fine_primavera a_inizio_estate in_piena_estate a_fine_estate a_inizio_autunno
			a_fine_autunno in_pieno_inverno a_fine_inverno nella_stagione_delle_piogge al_raccolto alla_festa
			nel_giorno_di_mercato con_la_luna_piena in_un_giorno_di_pioggia in_un_giorno_di_neve
			in_un_giorno_di_vento in_una_giornata_limpida in_una_giornata_nuvolosa in_un_giorno_di_nebbia in_vacanza
		`),
		past: words(`
			ieri la_settimana_scorsa tempo_fa quel_giorno quella_notte una_volta
			l'altro_ieri il_mese_scorso l'anno_scorso anni_fa qualche_tempo_fa quella_mattina quella_sera a_quel_tempo
			a_quei_tempi la_settimana_prima la_primavera_scorsa l'estate_scorsa l'autunno_scorso
			l'inverno_scorso qualche_giorno_fa
		`),
		present: words(`
			oggi poco_fa domani la_settimana_prossima
			adesso stamattina stasera stanotte dopodomani il_mese_prossimo l'anno_prossimo quest'anno
			questa_settimana questo_fine_settimana tra_poco subito
		`),
		habitual: words(`
			di_questi_tempi a_volte ogni_giorno ogni_notte
			sempre spesso di_solito raramente di_rado ogni_tanto ogni_mattina ogni_settimana ogni_anno
			in_genere quasi_sempre
		`)
	},
	homes: words(`casa`),
	join: { word: 'e' },
	connectives: {
		additive: words(`e_poi inoltre, e_ancora, per_di_più, in_aggiunta, oltretutto,`),
		temporal: words(`
			dopo infine intanto, più_tardi alla_fine poco_dopo
			subito_dopo, dopo_un_po' nel_frattempo, a_quel_punto, in_men_che_non_si_dica, di_lì_a_poco
		`),
		contrastive: words(
			`ma tuttavia, eppure invece, ciò_nonostante, al_contrario, nondimeno, con_tutto_ciò,`
		),
		causal: words(`allora perciò così pertanto, di_conseguenza, per_questo per_tale_ragione,`)
	},
	// What a noun can do that its theme does not say. A noun listed nowhere has no
	// trait, and takes any verb that asks for none.
	traits: {
		flier: words(`
		uccello rondine passero corvo falco aquila pavone pappagallo gufo colomba gru cigno anatra oca
		farfalla ape libellula cicala mosca zanzara pipistrello airone pellicano
		drago fenice fata pegaso grifone angelo valchiria
		merlo usignolo allodola quaglia fagiano pernice colibrì tucano fenicottero cicogna upupa
		cardellino gazza ghiandaia civetta poiana vespa tarma lucciola ippogrifo
		`),
		swimmer: words(`
		coccodrillo tartaruga rana rospo pesce balena delfino squalo polpo calamaro gambero granchio
		tricheco foca pinguino
		sirena kraken naiade
		anguilla sardina tonno merluzzo nasello trota salmone carpa razza medusa vongola cozza
		ostrica aragosta totano salamandra tritone castoro ippopotamo ornitorinco
		`),
		crawler: words(`
		coccodrillo serpente lucertola tartaruga lumaca formica ragno verme granchio
		basilisco
		iguana camaleonte salamandra tritone boa vipera cobra pitone scarabeo
		cavalletta grillo pulce bruco millepiedi scorpione
		`),
		// A word of a creature theme that is no creature: it takes no verb and no state.
		lifeless: words(`
			incantesimo maledizione profezia amuleto talismano runa portale santuario idolo totem augurio presagio bestiario
			sortilegio grimorio pentacolo reliquia calice graal bacchetta bastone scettro corona
		`),
		// A word of the place class that is no place.
		placeless: words(`
			sabbia ciottolo terremoto masso geyser fumarola stalattite stalagmite eco brace
			stella cometa meteora aurora falce_lunare eclissi zenit satellite ammasso orbita gravità rotazione rivoluzione
			anno_luce astro eclittica meridiano plenilunio novilunio perigeo vespro supernova quasar pulsar
			corrente marea onda schiuma frangente parallasse parsec azimut perielio afelio ellisse quadrante nadir
			gravitazione alone bolide nana
		`)
	},
	interjections: words(`
		oh, ah, ehi, caspita, mamma_mia, guarda, davvero, ohi, accidenti, cavolo, santo_cielo, dai,
		ahimè, uffa, però, senti, ecco, toh, perbacco, figurati, macché, magari, urca, meno_male,
	`),
	// Pro-drop, the same as Spanish: `esso` exists and nobody writes it.
	pronouns: { n: [''] },
	// An object named once is a clitic the next time, in front of the verb and
	// agreeing with the noun: `cucinò la salsiccia e la mangiò`.
	objectPronouns: { words: { m: words(`lo`), f: words(`la`) }, clitic: true },
	numeral: {
		order: 'before',
		counters: {},
		count: [2, 12],
		currency: 'euro',
		amounts: [100, 500, 1000, 5000, 12000, 25000, 50000, 100000],
		group: '.',
		gap: ' '
	},
	// Italian names its months and writes the day first with nothing between the
	// parts.
	calendar: {
		date: 'D MMMM Y',
		months: words(`
			gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre
			dicembre
		`),
		clock: 'h:mm',
		years: [2020, 2030],
		copula: {
			// An event is a thing that happens on a day, and a lion is not.
			subject: ['event'],
			words: words(`è`),
			past: { words: words(`fu`) }
		}
	},
	// Every Italian preposition merges with the article behind it, so the phrase a
	// preposition opens goes without one — `in giardino` rather than `in la
	// foresta`, which is not Italian at all. `verso` is the exception, and it is
	// what a destination is written with.
	frames: [
		// A date and a clock, standing where an adverbial stands.
		{
			parts: [
				{ slot: 'date', head: 'il', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'clock', head: 'alle', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		// And the shape that equates the subject to one: `La partita è alle 11:40.`
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'date', head: 'il', copula: 'head' }
			],
			weight: 4
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'clock', head: 'alle', copula: 'head' }
			],
			weight: 4
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 20
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 18
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'place', head: 'in', bare: true, modifiable: true }
			],
			weight: 14
		},
		// Where the subject is going: `va verso il mercato`. Where it arrives is
		// written bare, the way the place is: `torna a casa`.
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'verso', modifiable: true }
			],
			weight: 8,
			fields: ['go']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'a', bare: true, modifiable: true }
			],
			weight: 8,
			fields: ['arrive']
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'verso', modifiable: true }
			],
			weight: 4,
			fields: ['go']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'a', bare: true, modifiable: true },
				{ slot: 'manner' }
			],
			weight: 3,
			fields: ['arrive']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: 'è', pastHead: 'era' }
			],
			weight: 12
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'manner' }],
			weight: 10
		},
		{
			parts: [{ slot: 'time', tail: ',' }, { slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 8
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true },
				{ slot: 'place', head: 'in', bare: true, modifiable: true }
			],
			weight: 7
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'place', head: 'in', bare: true, modifiable: true }
			],
			weight: 6
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true },
				{ slot: 'manner' }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 4
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'money' }],
			weight: 6
		}
	]
};
