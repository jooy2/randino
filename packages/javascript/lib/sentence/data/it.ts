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
			...tensed(`si_sveglia si_alza si_desta`, `si_svegliò si_alzò si_destò`)
		},
		// Setting off: the verbs that need somewhere to go, and the ones that stand
		// on their own. `verso` rather than `a`, because every Italian preposition
		// merges with the article behind it and `verso` is the one that does not.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`va corre cammina si_dirige sale scende`,
				`andò corse camminò si_diresse salì scese`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...tensed(`parte se_ne_va esce`, `partì se_ne_andò uscì`)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(`torna arriva rientra giunge`, `tornò arrivò rientrò giunse`)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...tensed(`ritorna rincasa riappare`, `ritornò rincasò riapparve`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			...tensed(
				`corre cammina salta nuota vola striscia vaga passa passeggia gironzola`,
				`corse camminò saltò nuotò volò strisciò vagò passò passeggiò gironzolò`
			)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...tensed(
				`aspetta si_nasconde si_guarda_intorno esita si_ferma attende`,
				`aspettò si_nascose si_guardò_intorno esitò si_fermò attese`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...tensed(
				`riposa si_siede si_sdraia si_appoggia si_rannicchia si_riposa`,
				`riposò si_sedette si_sdraiò si_appoggiò si_rannicchiò si_riposò`
			)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...tensed(
				`dorme si_addormenta sonnecchia si_assopisce`,
				`dormì si_addormentò sonnecchiò si_assopì`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...tensed(
				`ride piange sbadiglia sospira sorride canticchia borbotta grida`,
				`rise pianse sbadigliò sospirò sorrise canticchiò borbottò gridò`
			)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...tensed(
				`balla canta rotola gioca saltella scherza`,
				`ballò cantò rotolò giocò saltellò scherzò`
			)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			...tensed(
				`ricorda dimentica immagina conta rievoca rimpiange`,
				`ricordò dimenticò immaginò contò rievocò rimpianse`
			)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`guarda osserva contempla esamina tocca accarezza`,
				`guardò osservò contemplò esaminò toccò accarezzò`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...tensed(`cerca rovista fruga esplora`, `cercò rovistò frugò esplorò`)
		},
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(`trova scopre scorge raccoglie`, `trovò scoprì scorse raccolse`)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`sceglie prende afferra piglia tira_fuori riceve`,
				`scelse prese afferrò pigliò tirò_fuori ricevette`
			)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(`porta reca trasporta trascina`, `portò recò trasportò trascinò`)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`nasconde ripone custodisce sotterra conserva`,
				`nascose ripose custodì sotterrò conservò`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`costruisce fabbrica intaglia dipinge tesse monta`,
				`costruì fabbricò intagliò dipinse tessé montò`
			)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`ripara pulisce lucida sistema riordina aggiusta`,
				`riparò pulì lucidò sistemò riordinò aggiustò`
			)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(`vende consegna cede offre`, `vendette consegnò cedette offrì`)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			...tensed(`compra acquista ordina procura`, `comprò acquistò ordinò procurò`)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`cuoce scalda cucina taglia arrostisce serve`,
				`cosse scaldò cucinò tagliò arrostì servì`
			)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`mangia mastica assaggia rosicchia divora`,
				`mangiò masticò assaggiò rosicchiò divorò`
			)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			...tensed(`beve sorseggia tracanna gusta`, `bevve sorseggiò tracannò gustò`)
		},
		{
			field: 'change',
			subject: ['place'],
			...tensed(
				`si_calma si_oscura si_illumina si_riempie si_svuota si_anima`,
				`si_calmò si_oscurò si_illuminò si_riempì si_svuotò si_animò`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...tensed(
				`brilla scorre si_approfondisce inizia finisce continua passa`,
				`brillò scorse si_approfondì iniziò finì continuò passò`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			...tensed(
				`oscilla luccica cade rotola si_inclina invecchia`,
				`oscillò luccicò cadde rotolò si_inclinò invecchiò`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...tensed(
				`viaggia si_ferma passa torna parte scivola`,
				`viaggiò si_fermò passò tornò partì scivolò`
			)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...tensed(
				`si_diffonde svanisce rimane fluttua cresce`,
				`si_diffuse svanì rimase fluttuò crebbe`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			...tensed(
				`cresce appassisce fiorisce oscilla germoglia`,
				`crebbe appassì fiorì oscillò germogliò`
			)
		},
		{
			field: 'change',
			subject: ['body'],
			...tensed(`trema si_muove si_intorpidisce guarisce`, `tremò si_mosse si_intorpidì guarì`)
		},
		{
			field: 'change',
			subject: ['edible'],
			...tensed(
				`matura si_raffredda bolle si_scioglie si_guasta`,
				`maturò si_raffreddò bollì si_sciolse si_guastò`
			)
		}
	],
	states: [
		{
			subject: ['creature', 'person'],
			words: words(
				`grande piccolo veloce lento silenzioso rumoroso coraggioso pigro feroce mite arguto sveglio`
			)
		},
		{ subject: ['creature', 'person'], condition: 'hungry', words: words(`affamato famelico`) },
		{ subject: ['creature', 'person'], condition: 'full', words: words(`sazio pieno`) },
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			words: words(`stanco assonnato esausto`)
		},
		{ subject: ['creature', 'person'], condition: 'rested', words: words(`riposato fresco vispo`) },
		{
			subject: ['creature', 'person'],
			condition: 'content',
			words: words(`felice contento allegro sereno`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			words: words(`annoiato curioso inquieto agitato`)
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
			words: words(`bello strano nuovo comune raro`)
		},
		{
			subject: ['place', 'event'],
			words: words(`ampio stretto tranquillo profondo scuro chiaro lontano ripido`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`duro leggero pesante vecchio liscio trasparente robusto`)
		},
		{
			subject: ['edible'],
			words: words(`dolce salato piccante aspro caldo freddo saporito`)
		},
		{
			subject: ['idea'],
			words: words(`semplice evidente vago eterno fugace`)
		},
		{
			subject: ['plant'],
			words: words(`verde rigoglioso profumato appassito`)
		},
		{
			subject: ['body'],
			words: words(`caldo freddo dolente rigido`)
		}
	],
	// Masculine singular, the form `agreement` reshapes, after the noun.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				coraggioso vivace gentile occupato pigro timido sveglio giovane vecchio piccolo grande silenzioso allegro paziente agile curioso
			`)
		},
		{ subject: ['person'], words: words(`giovane gentile severo serio occupato sincero`) },
		{ subject: ['creature'], words: words(`veloce feroce mansueto paffuto piccolino`) },
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(
				`dolce piccante tiepido fresco croccante saporito fragrante caldo salato morbido maturo gustoso`
			)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(`dolce tiepido freddo fresco caldo fragrante forte amaro`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(
				`vecchio nuovo piccolo grande leggero pesante lucente liscio trasparente duro bello prezioso antico`
			)
		},
		{ subject: ['vehicle'], words: words(`veloce lento robusto`) },
		{
			subject: ['place'],
			words: words(`
				tranquillo ampio scuro luminoso strano vecchio accogliente isolato affollato silenzioso remoto lontano vicino vuoto solitario soleggiato
			`)
		},
		{
			subject: ['plant'],
			words: words(`verde rigoglioso profumato giovane appassito alto piccolo tenero fresco`)
		},
		{
			subject: ['idea'],
			words: words(`vago vecchio nuovo strano chiaro prezioso piccolo curioso`)
		},
		{
			subject: ['event'],
			words: words(`lungo breve tranquillo soleggiato nuvoloso rumoroso improvviso`)
		},
		{ subject: ['body'], words: words(`piccolo freddo caldo esile robusto`) },
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
			words: words(`bello misterioso strano nuovo`)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				in_silenzio lentamente rapidamente dolcemente improvvisamente appena da_solo brevemente costantemente
				audacemente con_cura avidamente tranquillamente allegramente fortemente pazientemente leggermente serenamente
				vivacemente goffamente con_calma
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(`
				in_silenzio lentamente dolcemente improvvisamente appena di_nuovo ancora piano_piano debolmente a_poco_a_poco
				gradualmente
			`)
		}
	],
	times: {
		day: words(`
			all'alba di_prima_mattina al_mattino a_mezzogiorno nel_pomeriggio al_tramonto di_sera di_notte
			a_notte_fonda a_mezzanotte
		`),
		any: words(
			`in_primavera in_estate in_autunno in_inverno nel_fine_settimana nei_giorni_festivi tutto_il_giorno`
		),
		past: words(`ieri la_settimana_scorsa tempo_fa quel_giorno quella_notte una_volta`),
		present: words(`oggi poco_fa domani la_settimana_prossima`),
		habitual: words(`di_questi_tempi a_volte ogni_giorno ogni_notte`)
	},
	homes: words(`casa`),
	join: { word: 'e' },
	connectives: {
		additive: words(`e_poi inoltre,`),
		temporal: words(`dopo infine intanto, più_tardi alla_fine poco_dopo`),
		contrastive: words(`ma tuttavia, eppure invece,`),
		causal: words(`allora perciò così`)
	},
	interjections: words(`
		oh, ah, ehi, caspita, mamma_mia, guarda, davvero, ohi, accidenti, cavolo, santo_cielo, dai,
	`),
	// Pro-drop, the same as Spanish: `esso` exists and nobody writes it.
	pronouns: { n: [''] },
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
