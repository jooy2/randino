import { words } from '../../_internal/parse.js';
import type { WordPool } from '../../word/data/types.js';
import type { PredicateTense, SentenceLanguageData } from './types.js';

// The two forms a German verb group is written in: the third person singular of
// the present, and the same person of the Präteritum, which is the tense written
// prose tells a story in.
function tensed(present: string, past: string): { words: WordPool; past: PredicateTense } {
	return { words: words(present), past: { words: words(past) } };
}

export const DE: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' },
	// German opens low and closes high, which is why the pair is not symmetrical.
	quotes: { double: ['„', '“'], single: ['‚', '‘'] },
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
	// sends that prefix to the end of the clause, which no single slot can carry —
	// and a shape that opens on a time would write it in front of the subject. A
	// reflexive is fine, because `sich` stays with the verb: `Am Morgen erhebt sich
	// ein Fuchs`.
	//
	// No verb here takes an object or a destination, because both would put the
	// noun in a case its article changes for. The stories German tells are the
	// ones with nothing in the hero's hands.
	verbs: [
		{
			field: 'rise',
			subject: ['creature', 'person'],
			...tensed(`erwacht erhebt_sich regt_sich`, `erwachte erhob_sich regte_sich`)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...tensed(`geht wandert eilt reist`, `ging wanderte eilte reiste`)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...tensed(`kommt erscheint`, `kam erschien`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(`läuft springt bummelt trabt spaziert`, `lief sprang bummelte trabte spazierte`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			...tensed(`streift`, `streifte`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			...tensed(`schwimmt`, `schwamm`)
		},
		{
			field: 'move',
			// Flying is a flier's alone: a sparrow's, a dragon's, never a fish's.
			subject: ['creature'],
			subjectTraits: ['flier'],
			...tensed(`fliegt`, `flog`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			...tensed(`kriecht`, `kroch`)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...tensed(
				`wartet zögert verharrt lauscht lauert`,
				`wartete zögerte verharrte lauschte lauerte`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...tensed(`ruht sitzt liegt rastet lehnt`, `ruhte saß lag rastete lehnte`)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...tensed(`schläft schlummert dämmert döst`, `schlief schlummerte dämmerte döste`)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...tensed(
				`lacht weint gähnt seufzt lächelt summt murmelt ruft`,
				`lachte weinte gähnte seufzte lächelte summte murmelte rief`
			)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...tensed(`tanzt singt tollt spielt hüpft rollt`, `tanzte sang tollte spielte hüpfte rollte`)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...tensed(`sucht stöbert kramt`, `suchte stöberte kramte`)
		},
		{
			field: 'change',
			subject: ['place'],
			...tensed(
				`verstummt dunkelt erhellt_sich leert_sich füllt_sich belebt_sich`,
				`verstummte dunkelte erhellte_sich leerte_sich füllte_sich belebte_sich`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...tensed(
				`leuchtet fließt vertieft_sich beginnt endet dauert vergeht`,
				`leuchtete floss vertiefte_sich begann endete dauerte verging`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			...tensed(
				`schwankt glänzt fällt rollt neigt_sich altert`,
				`schwankte glänzte fiel rollte neigte_sich alterte`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...tensed(`fährt hält rollt wendet gleitet`, `fuhr hielt rollte wendete glitt`)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...tensed(
				`wächst verschwindet bleibt schwebt vertieft_sich`,
				`wuchs verschwand blieb schwebte vertiefte_sich`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			...tensed(`wächst welkt blüht schwankt sprießt`, `wuchs welkte blühte schwankte spross`)
		},
		{
			field: 'change',
			subject: ['body'],
			...tensed(`zittert bebt erstarrt heilt`, `zitterte bebte erstarrte heilte`)
		},
		{
			field: 'change',
			subject: ['edible'],
			...tensed(`reift kühlt kocht schmilzt verdirbt`, `reifte kühlte kochte schmolz verdarb`)
		}
	],
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`groß klein schnell langsam still laut mutig faul sanft klug wild`)
		},
		{ subject: ['creature', 'person'], condition: 'hungry', words: words(`hungrig ausgehungert`) },
		{ subject: ['creature', 'person'], condition: 'full', words: words(`satt gesättigt`) },
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			words: words(`müde schläfrig erschöpft`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			words: words(`ausgeruht frisch munter`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			words: words(`froh zufrieden glücklich heiter`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			words: words(`gelangweilt neugierig unruhig rastlos`)
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
	// Base forms, which `agreement` gives the strong endings after `ein`.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				mutig lebhaft sanft fleißig faul schüchtern klug jung alt klein groß still fröhlich geduldig flink neugierig
			`)
		},
		{ subject: ['person'], words: words(`jung freundlich streng ernst beschäftigt aufrichtig`) },
		{ subject: ['creature'], words: words(`flink wild zahm rundlich winzig`) },
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(`süß scharf warm frisch knusprig würzig duftend heiß salzig weich reif lecker`)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(`süß warm kalt kühl heiß duftend frisch stark`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(
				`alt neu klein groß leicht schwer glänzend glatt klar stabil hübsch kostbar uralt`
			)
		},
		{ subject: ['vehicle'], words: words(`schnell langsam robust`) },
		{
			subject: ['place'],
			words: words(
				`still weit dunkel hell fremd alt gemütlich abgelegen belebt leise fern nah leer einsam sonnig`
			)
		},
		{ subject: ['plant'], words: words(`grün üppig duftend jung welk klein zart frisch`) },
		{ subject: ['idea'], words: words(`vage alt neu fremd klar kostbar klein seltsam`) },
		{ subject: ['event'], words: words(`lang kurz still sonnig trüb laut plötzlich`) },
		{ subject: ['body'], words: words(`klein kalt warm schlank kräftig`) },
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
			words: words(`schön geheimnisvoll fremd neu`)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				leise langsam schnell sanft plötzlich kaum allein kurz kühn sorgsam eifrig ruhig heftig geduldig leicht
				fröhlich munter schwerfällig gelassen emsig zügig vergnügt
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(
				`leise langsam sanft plötzlich kaum wieder noch stetig allmählich nach_und_nach schwach weiter`
			)
		}
	],
	times: {
		day: words(`
			bei_Tagesanbruch am_frühen_Morgen am_Morgen am_Vormittag am_Mittag am_Nachmittag in_der_Dämmerung
			am_Abend in_der_Nacht spät_in_der_Nacht um_Mitternacht
		`),
		any: words(
			`im_Frühling im_Sommer im_Herbst im_Winter am_Wochenende an_Feiertagen den_ganzen_Tag`
		),
		past: words(`gestern letzte_Woche vor_langer_Zeit einst an_jenem_Tag in_jener_Nacht`),
		present: words(`heute gerade_eben morgen nächste_Woche`),
		habitual: words(`heutzutage manchmal jeden_Tag jede_Nacht`)
	},
	// Nowhere a German sentence here can go, because a destination is dative; the
	// pool is written all the same, so the shape of the data is the same.
	homes: words(`Haus`),
	// No `join`: a second clause after `und` drops its subject, and a shape of
	// German's that opens on a time or an adverb would then put nothing where the
	// verb's second position needs the subject to be.
	// Only the coordinating ones. German puts its finite verb second and counts
	// whatever opens the clause towards that, so `dann` or `danach` in front would
	// need the verb and the subject the other way round — a shape the frames write,
	// not something a connective can bolt on. `und`, `aber`, `doch` and `denn` sit
	// outside the clause and leave the order alone.
	connectives: {
		additive: words(`und`),
		contrastive: words(`aber doch`),
		causal: words(`denn`)
	},
	// What a noun can do that its theme does not say. A noun listed nowhere has no
	// trait, and takes any verb that asks for none.
	traits: {
		flier: words(`
		Vogel Schwalbe Spatz Rabe Falke Adler Pfau Papagei Eule Taube Kranich Schwan Ente Gans Biene
		Libelle Zikade Fliege Mücke Fledermaus Reiher Pelikan
		Drache Phönix Fee Greif Pegasus Engel Walküre
		`),
		swimmer: words(`
		Krokodil Schildkröte Frosch Kröte Fisch Wal Delfin Hai Krake Tintenfisch Garnele Krabbe Walross
		Robbe Pinguin
		Meerjungfrau Najade
		`),
		crawler: words(`
		Krokodil Schlange Eidechse Schildkröte Schnecke Ameise Spinne Wurm Krabbe
		Basilisk
		`)
	},
	interjections: words(`
		oh, ach, na, mensch, oje, sieh_an, wahrhaftig, hui, herrje, du_meine_Güte, nanu,
	`),
	pronouns: { m: words(`er`), f: words(`sie`), n: words(`es`) },
	// German names its months, writes the day first with a full stop after it, and
	// puts `Uhr` after a clock time.
	calendar: {
		date: 'D. MMMM Y',
		months: words(`
			Januar Februar März April Mai Juni Juli August September Oktober November Dezember
		`),
		clock: 'h:mm Uhr',
		years: [2020, 2030],
		copula: {
			// An event is a thing that happens on a day, and a lion is not.
			subject: ['event'],
			words: words(`ist`),
			past: { words: words(`war`) }
		}
	},
	// German declares the fewest shapes here, and both reasons are its cases. An
	// object would be accusative, which changes the article and the modifier
	// ending together; a place would be dative, which changes them again. What is
	// left is the nominative, and the second rule German never breaks: the verb
	// stands second, so a shape that opens on a time puts the subject behind it.
	frames: [
		// A date and a clock. German puts its finite verb second and counts whatever
		// opens the clause towards that, so the subject stands behind the verb.
		{
			parts: [
				{ slot: 'date', head: 'am' },
				{ slot: 'verb' },
				{ slot: 'subject', modifiable: true }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'clock', head: 'um' },
				{ slot: 'verb' },
				{ slot: 'subject', modifiable: true }
			],
			weight: 5
		},
		// And the shape that equates the subject to one: `Das Spiel ist um 11:40 Uhr.`
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'date', head: 'am', copula: 'head' }
			],
			weight: 4
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'clock', head: 'um', copula: 'head' }
			],
			weight: 4
		},
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
				{ slot: 'state', head: 'ist', pastHead: 'war' }
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
		// An adverb can open the clause too, and the verb still stands second.
		{
			parts: [{ slot: 'manner' }, { slot: 'verb' }, { slot: 'subject', modifiable: true }],
			weight: 16
		},
		{
			parts: [
				{ slot: 'manner' },
				{ slot: 'verb' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'time' }
			],
			weight: 10
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
			parts: [
				{ slot: 'subject', head: 'ist', pastHead: 'war', modifiable: true },
				{ slot: 'state' }
			],
			weight: 18,
			mood: 'question'
		}
	]
};
