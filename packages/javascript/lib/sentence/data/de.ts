import { words } from '../../_internal/parse.js';
import type { SentenceLanguageData } from './types.js';

export const DE: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' },
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
			subject: ['idea', 'event'],
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
				'idea',
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
			subject: ['idea'],
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
	// Only the coordinating ones. German puts its finite verb second and counts
	// whatever opens the clause towards that, so `dann` or `danach` in front would
	// need the verb and the subject the other way round — a shape the frames write,
	// not something a connective can bolt on. `und`, `aber`, `doch` and `denn` sit
	// outside the clause and leave the order alone.
	connectives: words(`und aber doch denn`),
	interjections: words(`oh, ach, na, mensch, oje, sieh_an, wahrhaftig,`),
	pronouns: { m: words(`er`), f: words(`sie`), n: words(`es`) },
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
		},
		// German asks by moving the finite verb to the front, which is the same rule
		// that keeps it second in a statement — the question is what happens when
		// nothing stands in the first position at all.
		{
			parts: [{ slot: 'verb' }, { slot: 'subject', modifiable: true }],
			weight: 26,
			mood: 'question'
		},
		{
			parts: [{ slot: 'verb' }, { slot: 'subject', modifiable: true }, { slot: 'manner' }],
			weight: 20,
			mood: 'question'
		},
		{
			parts: [{ slot: 'subject', head: 'ist', modifiable: true }, { slot: 'state' }],
			weight: 18,
			mood: 'question'
		}
	]
};
