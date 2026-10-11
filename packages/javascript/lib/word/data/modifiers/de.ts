import { words } from '../../../_internal/parse.js';
import type { WordModifierData } from '../types.js';

// What `randModifier` needs of the language, apart from its nouns: the modifiers,
// how they agree, and the shapes they sit in. `de.ts` spreads it into the whole
// dataset.
export const DE_MODIFIERS: WordModifierData = {
	joiner: ' ',
	capitalize: false,
	adjectives: words(`
 blau grün rot schwarz weiß gelb golden silbern hell glänzend groß klein lang
 kurz breit schmal niedrig schnell langsam stark schwach hart weich warm kalt
 lauwarm trocken feucht sauber neu alt jung schön hässlich süß bitter salzig scharf sauer
 sanft rau leicht schwer rund spitz tief fern nah reich arm selten ruhig laut tapfer weise
 fröhlich traurig frei ewig durchsichtig einsam strahlend wild heiter still uralt modern
 endlos hohl seidig neblig wolkig regnerisch sonnig schneeig windig rostig neugierig
 schelmisch edel bescheiden freundlich flink stachelig ruhelos kräftig verworren
 lebhaft zart grau blass innig eisig glühend düster leuchtend erhaben schlicht zierlich
 drollig schlau kühn faul wach glatt dicht knapp
 treu geduldig wachsam geschickt standhaft mild offen verschlossen stur schroff zottig
 pummelig massiv luftig dampfend würzig honigsüß gefleckt
 gestreift abgenutzt poliert nagelneu gereift dick dünn flach spitzig krumm gerade schlank
 gedrungen gedämpft schrill klangvoll dumpf melodisch heiser bebend lau schwül
 bedeckt klar bereift sternenklar mondhell moosig rankend grünend
 duftend smaragden korallen elfenbeinern kristallen bronzen zinnern bleiern
 achatfarben purpurn zinnoberrot ockerfarben indigoblau türkis lavendelfarben malvenfarben
 rabenschwarz entlegen winzig prächtig karg kunstvoll grob gebrechlich kraftvoll geräumig
 abschüssig
	`),
	actions: words(`
		schlafend rennend fliegend schwimmend singend tanzend lachend weinend gehend stehend
		sitzend liegend essend trinkend lesend schreibend malend lernend wartend suchend rufend
		hörend sehend träumend wachend versteckt jagend fangend werfend ziehend schiebend öffnend
		schließend bauend pflanzend erntend kochend backend webend nähend rudernd fahrend
		kletternd rollend treibend fließend brennend schmelzend blühend welkend fallend wandernd
		flüsternd schimmernd blinkend schwebend wiegend kreisend schleichend hüpfend springend
		schnaufend gähnend streckend grübelnd staunend zögernd jubelnd grüßend umarmend
		streichelnd tröstend weckend reisend fliehend landend spähend lauschend zählend messend
		schmiedend schnitzend polierend gießend schneidend hackend faltend wickelnd siegelnd
		klingend summend
		erwachend hockend kauernd lehnend umkehrend nahend zurückweichend
		innehaltend schreitend eilend querend heimkehrend aufbrechend entschwindend pirschend
		schwankend hopsend blickend hinaufschauend beobachtend bewachend streifend glättend
		ordnend pflegend waschend trocknend flechtend zuschneidend klebend entfaltend füllend
		leerend eingießend rührend schmorend bratend wärmend kühlend kostend schluckend ritzend
		färbend lackierend feilend wägend nachschmeckend wiederkäuend
	`),
	// German declines the modifier in front of the noun, and the base form is the
	// bare stem: `blau` becomes `blauer Wal`, `blaue Katze`, `blaues Haus`. The
	// empty ending matches every word, so the rule before it is only there to stop
	// a stem that already ends in `-e` from doubling it (`leise`, not `leisee`).
	// German gender is not predictable from the ending, and these six suffixes are
	// the exception — every noun in `-ung`, `-heit`, `-keit` or `-schaft` is
	// feminine, and one in `-chen` or `-lein` neuter. A made-up word matching none
	// of them is masculine, which is a guess; what it buys is an article and an
	// adjective that agree with each other rather than a bare `Ein blau …`.
	genderRules: [
		['ung', 'f'],
		['heit', 'f'],
		['keit', 'f'],
		['schaft', 'f'],
		['chen', 'n'],
		['lein', 'n'],
		['', 'm']
	],
	agreement: {
		m: [
			['el', 'ler'],
			['auer', 'aurer'],

			['e', 'er'],
			['', 'er']
		],
		f: [
			['el', 'le'],
			['auer', 'aure'],

			['e', 'e'],
			['', 'e']
		],
		n: [
			['el', 'les'],
			['auer', 'aures'],

			['e', 'es'],
			['', 'es']
		],
		p: [
			['el', 'le'],
			['auer', 'aure'],

			['e', 'e'],
			['', 'e']
		]
	},
	frames: [
		{ slots: ['noun'], weight: 12 },
		{ slots: ['adjective', 'noun'], weight: 50 },
		{ slots: ['action', 'noun'], weight: 38 }
	],
	syn: {
		kind: 'syllable',
		onset: words(
			'b d f g h k l m n p r s t w z bl br dr fl fr gl gr kl kn kr pf schl schm schn schr schw sp st tr'
		),
		vowel: words('a e e i i o u au ei ie eu ä ö ü'),
		coda: ['', ...words('n m r l s t ch ng nd st rt lt')],
		minSyllables: 2,
		maxSyllables: 2
	}
};
