import { words } from '../../../_internal/parse.js';
import type { WordModifierData } from '../types.js';

// What `randModifier` needs of the language, apart from its nouns: the modifiers,
// how they agree, and the shapes they sit in. `it.ts` spreads it into the whole
// dataset.
export const IT_MODIFIERS = /*#__PURE__*/ ((): WordModifierData => ({
	joiner: ' ',
	capitalize: false,
	adjectives: words(`
 azzurro verde rosso nero bianco giallo dorato argenteo scuro chiaro brillante grande
 piccolo lungo corto largo stretto alto basso rapido lento forte debole duro morbido caldo
 freddo tiepido secco umido pulito nuovo vecchio giovane bello brutto dolce amaro salato
 piccante aspro soffice ruvido leggero pesante rotondo acuto profondo lontano vicino ricco
 povero raro tranquillo rumoroso coraggioso saggio allegro triste libero eterno trasparente
 misterioso solitario radioso selvaggio sereno silenzioso antico moderno infinito cavo
 setoso nebbioso nuvoloso piovoso soleggiato nevoso ventoso arrugginito curioso birichino
 nobile umile gentile feroce agile spinoso irrequieto robusto vivido tenue grigio pallido
 intenso gelido ardente cupo luminoso maestoso semplice elegante buffo astuto audace pigro
 sveglio affilato liscio denso scarso
 leale paziente vigile abile fermo mite franco riservato ostinato schietto tagliente peloso
 lucido rilucente paffuto massiccio lieve fumante aromatico mielato maculato striato
 consumato nuovissimo stagionato spesso sottile piatto aguzzo storto dritto
 slanciato tozzo smorzato stridulo sonoro grave melodioso roco vibrante sussurrante
 temperato afoso coperto sgombro brinato stellato lunare muschioso attorcigliato
 verdeggiante profumato smeraldino corallino eburneo ossidiano cristallino bronzeo
 stagnato plumbeo cremisi vermiglio ocra indaco turchese lavanda malva avorio
 corvino remoto minuscolo grandioso austero raffinato rozzo fragile vigoroso ampio scosceso
	`),
	actions: words(`
		dormito perduto trovato nascosto stancato bagnato bruciato gelato sciolto rotto aperto
		chiuso legato appeso caduto seduto sdraiato dimenticato ricordato amato temuto desiderato
		cercato custodito ferito guarito salvato perdonato benedetto incantato spaventato sorpreso
		arrabbiato calmato animato sfinito sognato pettinato vestito segnato dipinto ricamato
		tessuto cucito intagliato forgiato lucidato piantato seminato raccolto annaffiato potato
		fiorito maturato tostato bollito arrostito fritto infornato montato macinato tagliato
		tritato avvolto sigillato firmato scritto letto raccontato narrato cantato ballato suonato
		taciuto gridato sussurrato pianto volato nuotato saltato arrampicato rotolato trascinato
		spinto tirato lanciato preso alzato abbassato girato piegato steso spento acceso ronzato
		brillato
		svegliato chinato rannicchiato appoggiato voltato avvicinato allontanato fermato camminato
		corso attraversato tornato partito sparito appostato barcollato saltellato guardato
		osservato vigilato sfiorato lisciato ordinato accudito lavato asciugato intrecciato
		rifilato incollato spiegato riempito svuotato servito rimestato stufato
		scaldato raffreddato assaggiato inghiottito inciso tinto verniciato
		limato soppesato assaporato rimuginato
	`),
	// Italian modifiers agree with the noun, and the base form is the masculine
	// one. Only `-o` changes; an `-e` modifier such as `grande` is the same beside
	// either gender and matches no rule.
	// A word outside the pools is read by its ending, the way Italian reads one:
	// `-a`, `-zione` and `-tà` are feminine, the rest masculine.
	genderRules: [
		['zione', 'f'],
		['sione', 'f'],
		['tà', 'f'],
		['tù', 'f'],
		['a', 'f'],
		['', 'm']
	],
	agreement: {
		f: [['o', 'a']],
		p: [
			['o', 'i'],
			['e', 'i']
		],
		fp: [
			['o', 'e'],
			['e', 'i']
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
		onset: words('b c ch d f g gh l m n p qu r s sc t v z br cr dr fr gr pl pr tr'),
		vowel: words('a a e e i i o o u ia ie io ua ue uo ai ei oi au'),
		coda: ['', '', ...words('n l r')],
		minSyllables: 2,
		maxSyllables: 3
	}
}))();
