import { words } from '../../_internal/parse.js';
import type { SentenceLanguageData } from './types.js';

export const DE: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminator: '.',
	// The indefinite article, and it is what makes the modifiers come out right:
	// after `ein` a German adjective takes the same endings it takes with no
	// article at all — `ein blauer Wal`, `eine blaue Katze`, `ein blaues Haus` —
	// which is exactly what `word/data`'s `agreement` already writes. A definite
	// article would call for the weak endings instead, and every modifier in the
	// library would have to be stored twice.
	articles: {
		m: [['', 'ein']],
		f: [['', 'eine']],
		n: [['', 'ein']]
	},
	// Only attributively. A predicate adjective in German takes no ending at all:
	// `der Wal ist blau`, never `blauer`.
	predicateAgrees: false,
	// Third person singular, and none of them with a separable prefix: German
	// sends that prefix to the end of the clause, which no single slot can carry.
	verbs: [
		{
			subject: ['creature', 'person'],
			words: words(`
				läuft geht springt schwimmt fliegt kriecht ruht schläft lacht weint singt tanzt
				wartet steht sitzt rollt wandert lauscht zögert eilt
			`)
		},
		{
			subject: ['place', 'event'],
			words: words(`leuchtet fließt dunkelt erhellt vertieft verstummt`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`schwankt glänzt fällt rollt neigt altert`)
		},
		{
			subject: ['vehicle'],
			words: words(`fährt hält rollt wendet gleitet`)
		},
		{
			subject: ['abstract', 'event'],
			words: words(`wächst verschwindet bleibt schwebt vertieft`)
		},
		{
			subject: ['plant'],
			words: words(`wächst welkt blüht schwankt sprießt`)
		},
		{
			subject: ['body'],
			words: words(`zittert bebt erstarrt heilt`)
		},
		{
			subject: ['edible'],
			words: words(`reift kühlt kocht schmilzt verdirbt`)
		}
	],
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`groß klein schnell langsam still laut mutig faul müde hungrig sanft klug wild`)
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
				'abstract',
				'body'
			],
			words: words(`schön fremd neu häufig selten`)
		},
		{
			subject: ['place', 'event'],
			words: words(`weit eng ruhig tief dunkel hell fern steil`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`hart leicht schwer alt glatt klar stabil`)
		},
		{
			subject: ['edible'],
			words: words(`süß salzig scharf sauer heiß kalt herzhaft`)
		},
		{
			subject: ['abstract'],
			words: words(`einfach deutlich vage ewig flüchtig`)
		},
		{
			subject: ['plant'],
			words: words(`grün üppig duftend welk`)
		},
		{
			subject: ['body'],
			words: words(`warm kalt wund steif`)
		}
	],
	manners: words(`
		leise langsam schnell sanft plötzlich kaum wieder gemeinsam allein noch kurz
		stetig kühn sorgsam eifrig
	`),
	times: words(`
		bei_Tagesanbruch am_Morgen am_Mittag am_Abend in_der_Nacht heute gestern morgen
		im_Frühling im_Sommer im_Herbst im_Winter am_Wochenende gerade_eben manchmal
		jeden_Tag in_der_Dämmerung
	`),
	// German declares the fewest shapes here, and both reasons are its cases. An
	// object would be accusative, which changes the article and the modifier
	// ending together; a place would be dative, which changes them again. What is
	// left is the nominative, and the second rule German never breaks: the verb
	// stands second, so a shape that opens on a time puts the subject behind it.
	frames: [
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 26
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'manner' }],
			weight: 22
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: 'ist' }
			],
			weight: 20
		},
		{
			parts: [{ slot: 'time' }, { slot: 'verb' }, { slot: 'subject', modifiable: true }],
			weight: 18
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'verb' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'manner' }
			],
			weight: 14
		}
	]
};
