import { words } from '../../_internal/parse.js';
import type { WordPool } from '../../word/data/types.js';
import type { PredicateTense, SentenceLanguageData } from './types.js';

// The two forms a Spanish verb group is written in: the third person singular of
// the present, and the same person of the pretérito, which is the tense a story
// is told in. A question is the statement with the marks around it, so there is
// no third.
function tensed(present: string, past: string): { words: WordPool; past: PredicateTense } {
	return { words: words(present), past: { words: words(past) } };
}

export const ES: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' },
	// Guillemets first, and the curly quotes for a quote inside one.
	quotes: { double: ['«', '»'], single: ['“', '”'] },
	// The one language here that marks a question and an exclamation at both
	// ends, which is why the openers exist at all.
	openers: { question: '¿', exclamation: '¡' },
	// The definite article, by the noun's gender. The feminine entries in front of
	// the default are the nouns that begin on a stressed a- and take `el` for the
	// sound of it: the two that only start the same way are listed above them, so
	// the first match is still the right one.
	articles: {
		m: [['', 'el']],
		f: [
			['aguamarina', 'la'],
			['aguanieve', 'la'],
			['agua', 'el'],
			['alma', 'el'],
			['ancla', 'el'],
			['hacha', 'el'],
			['águila', 'el'],
			['', 'la']
		]
	},
	predicateAgrees: true,
	// Third person singular of the present, which is the form every subject here
	// takes, and the pretérito beside it.
	verbs: [
		{
			field: 'rise',
			subject: ['creature', 'person'],
			...tensed(`se_despierta se_levanta se_incorpora`, `se_despertó se_levantó se_incorporó`)
		},
		// Setting off: the verbs that need somewhere to go, and the ones that stand
		// on their own. `hacia` rather than `a`, because `a` merges with `el` into
		// `al` and a preposition here is written in front of whatever article the
		// noun takes.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(`va corre camina se_dirige sube baja`, `fue corrió caminó se_dirigió subió bajó`)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...tensed(`parte se_marcha sale`, `partió se_marchó salió`)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(`llega vuelve regresa`, `llegó volvió regresó`)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...tensed(`retorna vuelve_a_casa regresa_a_casa`, `retornó volvió_a_casa regresó_a_casa`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			...tensed(
				`corre camina salta nada vuela repta vaga pasa pasea deambula`,
				`corrió caminó saltó nadó voló reptó vagó pasó paseó deambuló`
			)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...tensed(
				`espera se_esconde mira_alrededor vacila se_detiene aguarda`,
				`esperó se_escondió miró_alrededor vaciló se_detuvo aguardó`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...tensed(
				`descansa se_sienta se_acuesta se_apoya se_acurruca reposa`,
				`descansó se_sentó se_acostó se_apoyó se_acurrucó reposó`
			)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...tensed(`duerme se_adormece se_duerme dormita`, `durmió se_adormeció se_durmió dormitó`)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...tensed(
				`ríe llora bosteza suspira sonríe tararea murmura grita`,
				`rió lloró bostezó suspiró sonrió tarareó murmuró gritó`
			)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...tensed(`baila canta rueda juega brinca retoza`, `bailó cantó rodó jugó brincó retozó`)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			...tensed(
				`recuerda olvida imagina cuenta evoca añora`,
				`recordó olvidó imaginó contó evocó añoró`
			)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`mira observa contempla examina toca acaricia`,
				`miró observó contempló examinó tocó acarició`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...tensed(`busca rebusca husmea explora`, `buscó rebuscó husmeó exploró`)
		},
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(`encuentra descubre halla recoge`, `encontró descubrió halló recogió`)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(`elige toma agarra coge saca recibe`, `eligió tomó agarró cogió sacó recibió`)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(`lleva trae carga acarrea`, `llevó trajo cargó acarreó`)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`esconde guarda oculta entierra conserva`,
				`escondió guardó ocultó enterró conservó`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(`hace construye talla pinta teje arma`, `hizo construyó talló pintó tejió armó`)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`repara limpia pule arregla ordena ajusta`,
				`reparó limpió pulió arregló ordenó ajustó`
			)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(`vende entrega cede ofrece`, `vendió entregó cedió ofreció`)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			...tensed(`compra adquiere encarga consigue`, `compró adquirió encargó consiguió`)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(`hornea calienta cocina corta asa sirve`, `horneó calentó cocinó cortó asó sirvió`)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(`come mastica prueba mordisquea devora`, `comió masticó probó mordisqueó devoró`)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			...tensed(`bebe sorbe apura saborea`, `bebió sorbió apuró saboreó`)
		},
		{
			field: 'change',
			subject: ['place'],
			...tensed(
				`se_calma oscurece se_ilumina se_llena se_vacía se_anima`,
				`se_calmó oscureció se_iluminó se_llenó se_vació se_animó`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...tensed(
				`brilla fluye se_ahonda empieza termina continúa pasa`,
				`brilló fluyó se_ahondó empezó terminó continuó pasó`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			...tensed(
				`se_mece reluce cae rueda se_inclina envejece`,
				`se_meció relució cayó rodó se_inclinó envejeció`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...tensed(
				`circula se_detiene pasa regresa parte resbala`,
				`circuló se_detuvo pasó regresó partió resbaló`
			)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...tensed(
				`se_extiende desaparece permanece flota se_ahonda`,
				`se_extendió desapareció permaneció flotó se_ahondó`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			...tensed(
				`crece se_marchita florece se_mece brota`,
				`creció se_marchitó floreció se_meció brotó`
			)
		},
		{
			field: 'change',
			subject: ['body'],
			...tensed(`tiembla se_mueve se_entumece sana`, `tembló se_movió se_entumeció sanó`)
		},
		{
			field: 'change',
			subject: ['edible'],
			...tensed(
				`madura se_enfría hierve se_derrite se_estropea`,
				`maduró se_enfrió hirvió se_derritió se_estropeó`
			)
		}
	],
	// Written in the masculine singular, which is what `agreement` reshapes. What
	// a hero is by nature takes `ser`, and how they are just now takes `estar`,
	// which is why the groups that carry a condition bring their own copula.
	states: [
		{
			subject: ['creature', 'person'],
			words: words(
				`grande pequeño rápido lento silencioso ruidoso valiente perezoso ocupado fiero manso listo`
			)
		},
		{
			subject: ['creature', 'person'],
			condition: 'hungry',
			head: 'está',
			pastHead: 'estaba',
			words: words(`hambriento famélico`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'full',
			head: 'está',
			pastHead: 'estaba',
			words: words(`satisfecho lleno`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			head: 'está',
			pastHead: 'estaba',
			words: words(`cansado soñoliento agotado`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			head: 'está',
			pastHead: 'estaba',
			words: words(`descansado fresco animado`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			head: 'está',
			pastHead: 'estaba',
			words: words(`feliz contento alegre tranquilo`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			head: 'está',
			pastHead: 'estaba',
			words: words(`aburrido curioso inquieto nervioso`)
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
			words: words(`hermoso extraño nuevo común raro`)
		},
		{
			subject: ['place', 'event'],
			words: words(`ancho estrecho tranquilo profundo oscuro claro lejano empinado`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`duro ligero pesado viejo liso transparente robusto`)
		},
		{
			subject: ['edible'],
			words: words(`dulce salado picante ácido caliente frío sabroso`)
		},
		{
			subject: ['idea'],
			words: words(`sencillo evidente vago eterno fugaz`)
		},
		{
			subject: ['plant'],
			words: words(`verde frondoso fragante marchito`)
		},
		{
			subject: ['body'],
			words: words(`cálido frío dolorido rígido`)
		}
	],
	// Masculine singular, the form `agreement` reshapes, after the noun.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				valiente animado amable ocupado perezoso tímido listo joven viejo pequeño grande silencioso alegre paciente ágil curioso
			`)
		},
		{ subject: ['person'], words: words(`joven amable severo serio ocupado sincero`) },
		{ subject: ['creature'], words: words(`veloz feroz manso rechoncho pequeñito`) },
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(
				`dulce picante tibio fresco crujiente sabroso fragante caliente salado blando maduro rico`
			)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(`dulce tibio frío fresco caliente fragante espumoso fuerte`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(
				`viejo nuevo pequeño grande ligero pesado brillante liso transparente duro bonito precioso antiguo`
			)
		},
		{ subject: ['vehicle'], words: words(`rápido lento robusto`) },
		{
			subject: ['place'],
			words: words(`
				tranquilo amplio oscuro luminoso extraño viejo acogedor apartado bullicioso silencioso remoto lejano cercano vacío solitario soleado
			`)
		},
		{
			subject: ['plant'],
			words: words(`verde frondoso fragante joven marchito alto pequeño tierno fresco`)
		},
		{ subject: ['idea'], words: words(`vago viejo nuevo extraño claro precioso pequeño raro`) },
		{ subject: ['event'], words: words(`largo breve tranquilo soleado nublado ruidoso repentino`) },
		{ subject: ['body'], words: words(`pequeño frío cálido esbelto robusto`) },
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
			words: words(`hermoso misterioso extraño nuevo`)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				en_silencio despacio rápidamente suavemente de_repente apenas a_solas brevemente firmemente audazmente
				con_cuidado ansiosamente tranquilamente alegremente torpemente fuertemente pacientemente ligeramente serenamente
				vivamente con_calma
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(`
				en_silencio despacio suavemente de_repente apenas otra_vez todavía de_nuevo poco_a_poco lentamente débilmente aún
				gradualmente
			`)
		}
	],
	times: {
		day: words(`
			al_amanecer de_madrugada por_la_mañana a_mediodía por_la_tarde al_anochecer por_la_noche
			a_medianoche
		`),
		any: words(
			`en_primavera en_verano en_otoño en_invierno los_fines_de_semana en_los_días_festivos todo_el_día`
		),
		past: words(`ayer la_semana_pasada hace_tiempo aquel_día aquella_noche una_vez`),
		present: words(`hoy hace_poco mañana la_semana_que_viene`),
		habitual: words(`estos_días a_veces cada_día cada_noche`)
	},
	homes: words(`casa cabaña`),
	join: { word: 'y' },
	// Written with the comma the ones that need one take.
	connectives: {
		additive: words(`y_luego además,`),
		temporal: words(`después por_fin mientras_tanto, más_tarde al_final poco_después`),
		contrastive: words(`pero sin_embargo, aun_así en_cambio, no_obstante,`),
		causal: words(`entonces por_eso así_que`)
	},
	interjections: words(`
		ay, oh, vaya, caramba, madre_mía, mira, desde_luego, uy, anda, hombre, cielos, vamos,
	`),
	// Spanish carries its subject in the verb ending, so a second sentence about
	// the same thing writes no pronoun at all.
	pronouns: { n: [''] },
	// Money only, for the reason English has: a counted phrase would need a plural
	// noun, and most of these pools are not countable at all.
	numeral: {
		order: 'before',
		counters: {},
		count: [2, 12],
		currency: 'euros',
		amounts: [100, 500, 1000, 5000, 12000, 25000, 50000, 100000],
		group: '.',
		gap: ' '
	},
	// Spanish names its months and writes `de` between every part of a date.
	calendar: {
		date: 'D de MMMM de Y',
		months: words(`
			enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre
		`),
		clock: 'h:mm',
		years: [2020, 2030],
		copula: {
			// An event is a thing that happens on a day, and a lion is not.
			subject: ['event'],
			words: words(`es`),
			past: { words: words(`fue`) }
		}
	},
	frames: [
		// A date and a clock, standing where an adverbial stands.
		{
			parts: [
				{ slot: 'date', head: 'el', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'clock', head: 'a las', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		// And the shape that equates the subject to one: `El partido es a las 11:40.`
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'date', head: 'el', copula: 'head' }
			],
			weight: 4
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'clock', head: 'a las', copula: 'head' }
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
				{ slot: 'place', head: 'en', modifiable: true }
			],
			weight: 14
		},
		// Where the subject is going, and where it arrives: `va hacia el mercado`,
		// `vuelve hasta la casa`.
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'hacia', modifiable: true }
			],
			weight: 8,
			fields: ['go']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'hasta', modifiable: true }
			],
			weight: 8,
			fields: ['arrive']
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'hacia', modifiable: true }
			],
			weight: 4,
			fields: ['go']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'hasta', modifiable: true },
				{ slot: 'manner' }
			],
			weight: 3,
			fields: ['arrive']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: 'es', pastHead: 'era' }
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
				{ slot: 'place', head: 'en', modifiable: true }
			],
			weight: 7
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'place', head: 'en', modifiable: true }
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
