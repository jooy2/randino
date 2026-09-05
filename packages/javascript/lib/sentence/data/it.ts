import { words } from '../../_internal/parse.js';
import type { SentenceLanguageData } from './types.js';

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
			subject: ['creature', 'person'],
			words: words(`
				corre cammina salta nuota vola striscia torna parte si_ferma riposa dorme ride
				piange canta balla si_nasconde aspetta si_alza si_siede rotola vaga passa
				si_avvicina ascolta
			`)
		},
		{
			subject: ['creature', 'person'],
			object: ['edible'],
			words: words(`mangia beve mastica assaggia cuoce scalda`)
		},
		{
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`guarda cerca raccoglie porta tocca custodisce sceglie sposta raduna`)
		},
		{
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`costruisce ripara pulisce vende compra dipinge`)
		},
		{
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			words: words(`ricorda dimentica immagina conta`)
		},
		{
			subject: ['place', 'event'],
			words: words(`brilla scorre si_oscura si_schiarisce si_approfondisce si_calma`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`oscilla luccica cade rotola si_inclina invecchia`)
		},
		{
			subject: ['vehicle'],
			words: words(`viaggia si_ferma passa torna parte scivola`)
		},
		{
			subject: ['idea', 'event'],
			words: words(`si_diffonde svanisce rimane fluttua cresce`)
		},
		{
			subject: ['plant'],
			words: words(`cresce appassisce fiorisce oscilla germoglia`)
		},
		{
			subject: ['body'],
			words: words(`trema si_muove si_intorpidisce guarisce`)
		},
		{
			subject: ['edible'],
			words: words(`matura si_raffredda bolle si_scioglie si_guasta`)
		}
	],
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`
				grande piccolo veloce lento silenzioso rumoroso coraggioso pigro affamato
				assonnato feroce mite arguto sveglio
			`)
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
	manners: words(`
		in_silenzio lentamente rapidamente dolcemente improvvisamente appena di_nuovo insieme
		da_solo ancora brevemente costantemente audacemente con_cura avidamente
	`),
	times: words(`
		all'alba al_mattino a_mezzogiorno di_sera di_notte oggi ieri domani in_primavera
		in_estate in_autunno in_inverno nel_fine_settimana poco_fa a_volte ogni_giorno
		al_tramonto
	`),
	connectives: words(`e_poi ma allora inoltre, tuttavia, dopo infine intanto,`),
	interjections: words(`oh, ah, ehi, caspita, mamma_mia, guarda, davvero,`),
	// Pro-drop, the same as Spanish: `esso` exists and nobody writes it.
	pronouns: { n: [''] },
	// Every Italian preposition merges with the article behind it, so the phrase a
	// preposition opens goes without one — `in giardino` rather than `in la
	numeral: {
		order: 'before',
		counters: {},
		count: [2, 12],
		currency: 'euro',
		amounts: [100, 500, 1000, 5000, 12000, 25000, 50000, 100000],
		group: '.',
		gap: ' '
	},
	// foresta`, which is not Italian at all.
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
			words: words(`è`)
		}
	},
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
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: 'è' }
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
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'money' }],
			weight: 6
		}
	]
};
