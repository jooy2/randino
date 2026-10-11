import { words } from '../../../_internal/parse.js';
import type { WordModifierData } from '../types.js';

// What `randModifier` needs of the language, apart from its nouns: the modifiers,
// how they agree, and the shapes they sit in. `es.ts` spreads it into the whole
// dataset.
export const ES_MODIFIERS: WordModifierData = {
	joiner: ' ',
	capitalize: false,
	adjectives: words(`
 azul verde rojo negro blanco amarillo dorado plateado oscuro claro brillante grande
 pequeño largo corto ancho estrecho alto bajo rápido lento fuerte débil duro blando
 caliente frío tibio seco húmedo limpio nuevo viejo joven hermoso feo dulce amargo salado
 picante agrio suave áspero ligero pesado redondo agudo profundo lejano cercano rico pobre
 raro tranquilo ruidoso valiente sabio alegre triste libre eterno transparente misterioso
 solitario radiante salvaje sereno silencioso antiguo moderno infinito hueco sedoso brumoso
 nublado lluvioso soleado nevado ventoso oxidado curioso travieso noble humilde gentil
 feroz ágil espinoso inquieto robusto enredado vívido tenue gris pálido intenso cálido
 helado ardiente sombrío luminoso majestuoso sencillo elegante gracioso astuto audaz
 perezoso alerta afilado romo liso rugoso denso escaso
 leal paciente vigilante hábil firme apacible franco reservado terco llano
 cortante peludo lustroso reluciente rechoncho macizo liviano gélido humeante aromático
 meloso moteado rayado gastado flamante añejo grueso delgado plano
 puntiagudo torcido recto esbelto achaparrado estridente sonoro grave melodioso
 ronco vibrante susurrante templado bochornoso encapotado
 despejado escarchado estrellado musgoso rojizo perfumado
 esmeralda coralino marfileño obsidiano cristalino argénteo broncíneo estañado plomizo
 carmesí bermejo ocre añil turquesa lavanda malva marfil azabache remoto minúsculo
 grandioso austero primoroso tosco frágil vigoroso amplio escarpado
	`),
	actions: words(`
		dormido despierto perdido hallado escondido cansado mojado quemado congelado derretido
		roto abierto cerrado atado colgado caído sentado acostado olvidado recordado amado temido
		deseado buscado guardado herido curado salvado perdonado bendecido hechizado encantado
		asustado sorprendido enojado calmado animado agotado soñado peinado bañado vestido marcado
		pintado bordado tejido cosido tallado forjado pulido plantado sembrado cosechado regado
		podado florecido madurado tostado hervido asado frito horneado batido molido cortado
		picado envuelto sellado firmado escrito leído contado narrado cantado bailado tocado
		callado gritado susurrado reído llorado volado nadado saltado trepado rodado arrastrado
		empujado tirado lanzado atrapado soltado alzado bajado girado doblado estirado encogido
		apagado encendido
		despertado levantado agachado acurrucado apoyado vuelto acercado alejado detenido caminado
		corrido cruzado regresado partido desaparecido acechado tambaleado brincado mirado
		observado vigilado rozado alisado ordenado cuidado lavado secado
		recortado pegado plegado desplegado llenado vaciado servido
		revuelto guisado salteado calentado enfriado probado tragado grabado teñido barnizado
		limado sopesado saboreado rumiado
	`),
	// Spanish modifiers agree with the noun, and the base form is the masculine
	// one. Only the endings listed change; `azul` and `grande` match no rule and
	// are already right beside either gender.
	// A word outside the pools is read by its ending, which is what Spanish itself
	// does: `-a`, `-ión`, `-dad`, `-tad`, `-umbre` and `-triz` are feminine, the rest
	// masculine. An invented word has no true gender, and this is what keeps the
	// article and the adjective beside it agreeing with each other.
	genderRules: [
		['ión', 'f'],
		['dad', 'f'],
		['tad', 'f'],
		['umbre', 'f'],
		['triz', 'f'],
		['a', 'f'],
		['', 'm']
	],
	agreement: {
		f: [
			['or', 'ora'],
			['ón', 'ona'],
			['és', 'esa'],
			['ín', 'ina'],
			['án', 'ana'],
			['o', 'a']
		],
		p: [
			['z', 'ces'],
			['or', 'ores'],
			['ón', 'ones'],
			['és', 'eses'],
			['ín', 'ines'],
			['án', 'anes'],
			['o', 'os'],
			['a', 'as'],
			['e', 'es'],
			['', 'es']
		],
		fp: [
			['z', 'ces'],
			['or', 'oras'],
			['ón', 'onas'],
			['és', 'esas'],
			['ín', 'inas'],
			['án', 'anas'],
			['o', 'as'],
			['a', 'as'],
			['e', 'es'],
			['', 'es']
		]
	},
	frames: [
		{ slots: ['noun'], weight: 12 },
		{ slots: ['noun', 'adjective'], weight: 46 },
		{ slots: ['noun', 'action'], weight: 30 },
		{ slots: ['noun', 'adjective', 'action'], weight: 12 }
	],
	syn: {
		kind: 'syllable',
		onset: words('b c ch d f g gu h j l ll m n ñ p qu r rr s t v y z br cr dr fr gr pl pr tr'),
		vowel: words('a a e e i o o u ia ie io ua ue uo ai ei oi au eu'),
		coda: ['', '', ...words('n l r s z')],
		minSyllables: 2,
		maxSyllables: 3
	}
};
