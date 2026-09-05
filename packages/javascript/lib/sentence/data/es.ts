import { words } from '../../_internal/parse.js';
import type { SentenceLanguageData } from './types.js';

export const ES: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminator: '.',
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
	// takes.
	verbs: [
		{
			subject: ['creature', 'person'],
			words: words(`
				corre camina salta nada vuela repta regresa parte se_detiene descansa duerme ríe
				llora canta baila se_esconde espera se_levanta se_sienta rueda vaga pasa
				se_acerca escucha
			`)
		},
		{
			subject: ['creature', 'person'],
			object: ['edible'],
			words: words(`come bebe mastica prueba hornea calienta`)
		},
		{
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`mira busca recoge lleva toca guarda elige mueve reúne`)
		},
		{
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`hace repara limpia vende compra construye`)
		},
		{
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			words: words(`recuerda olvida imagina cuenta`)
		},
		{
			subject: ['place', 'event'],
			words: words(`brilla fluye oscurece aclara se_ahonda se_calma`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`se_mece reluce cae rueda se_inclina envejece`)
		},
		{
			subject: ['vehicle'],
			words: words(`circula se_detiene pasa regresa parte resbala`)
		},
		{
			subject: ['idea', 'event'],
			words: words(`se_extiende desaparece permanece flota se_ahonda`)
		},
		{
			subject: ['plant'],
			words: words(`crece se_marchita florece se_mece brota`)
		},
		{
			subject: ['body'],
			words: words(`tiembla se_mueve se_entumece sana`)
		},
		{
			subject: ['edible'],
			words: words(`madura se_enfría hierve se_derrite se_estropea`)
		}
	],
	// Written in the masculine singular, which is what `agreement` reshapes.
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`
				grande pequeño rápido lento silencioso ruidoso valiente perezoso ocupado
				hambriento soñoliento fiero manso listo
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
	manners: words(`
		en_silencio despacio rápidamente suavemente de_repente apenas otra_vez juntos a_solas
		todavía brevemente firmemente audazmente con_cuidado ansiosamente de_nuevo
	`),
	times: words(`
		al_amanecer por_la_mañana al_mediodía por_la_tarde por_la_noche hoy ayer mañana
		en_primavera en_verano en_otoño en_invierno los_fines_de_semana hace_poco a_veces
		cada_día al_anochecer
	`),
	// Written with the comma the ones that need one take.
	connectives: words(`y_luego pero entonces además, sin_embargo, después por_fin mientras_tanto,`),
	// Spanish carries its subject in the verb ending, so a second sentence about
	// the same thing writes no pronoun at all.
	pronouns: { n: [''] },
	frames: [
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
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: 'es' }
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
		}
	]
};
