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
			...tensed(
				`erwacht erhebt_sich regt_sich reckt_sich streckt_sich räkelt_sich rührt_sich ermuntert_sich
				besinnt_sich sammelt_sich belebt_sich erfrischt_sich`,
				`erwachte erhob_sich regte_sich reckte_sich streckte_sich räkelte_sich rührte_sich ermunterte_sich
				besann_sich sammelte_sich belebte_sich erfrischte_sich`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...tensed(
				`geht wandert eilt reist zieht entfernt_sich trollt_sich schleicht flieht flüchtet enteilt entschwindet verabschiedet_sich entweicht entflieht verschwindet
				entrinnt entkommt verreist türmt`,
				`ging wanderte eilte reiste zog entfernte_sich trollte_sich schlich floh flüchtete enteilte entschwand verabschiedete_sich entwich entfloh verschwand
				entrann entkam verreiste türmte`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...tensed(
				`kommt erscheint naht nähert_sich landet`,
				`kam erschien nahte näherte_sich landete`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(
				`läuft springt bummelt trabt spaziert rennt tänzelt schlendert stolziert stapft trottet stakst joggt marschiert tippelt watschelt humpelt galoppiert flitzt hetzt hastet trippelt stiefelt tobt flaniert schreitet wandelt sprintet hopst
				schlurft stolpert taumelt wankt hoppelt latscht pirscht wetzt düst watet klettert`,
				`lief sprang bummelte trabte spazierte rannte tänzelte schlenderte stolzierte stapfte trottete stakste joggte marschierte tippelte watschelte humpelte galoppierte flitzte hetzte hastete trippelte stiefelte tobte flanierte schritt wandelte sprintete hopste
				schlurfte stolperte taumelte wankte hoppelte latschte pirschte wetzte düste watete kletterte`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			...tensed(
				`streift bewegt_sich wendet_sich dreht_sich kreist treibt gleitet huscht schweift streunt weicht rückt
				schwankt wogt pendelt kreiselt`,
				`streifte bewegte_sich wandte_sich drehte_sich kreiste trieb glitt huschte schweifte streunte wich rückte
				schwankte wogte pendelte kreiselte`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			...tensed(
				`schwimmt taucht plantscht paddelt strampelt krault schnorchelt badet`,
				`schwamm tauchte plantschte paddelte strampelte kraulte schnorchelte badete`
			)
		},
		{
			field: 'move',
			// Flying is a flier's alone: a sparrow's, a dragon's, never a fish's.
			subject: ['creature'],
			subjectTraits: ['flier'],
			...tensed(
				`fliegt flattert schwebt segelt schwirrt steigt sinkt schwingt_sich stürzt gaukelt surrt`,
				`flog flatterte schwebte segelte schwirrte stieg sank schwang_sich stürzte gaukelte surrte`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			...tensed(
				`kriecht schlängelt_sich windet_sich robbt krabbelt ringelt_sich gräbt wühlt`,
				`kroch schlängelte_sich wand_sich robbte krabbelte ringelte_sich grub wühlte`
			)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...tensed(
				`wartet zögert verharrt lauscht lauert horcht verweilt harrt zaudert duckt_sich versteckt_sich späht trödelt bleibt stockt schweigt wacht
				grübelt sinniert stutzt lugt äugt`,
				`wartete zögerte verharrte lauschte lauerte horchte verweilte harrte zauderte duckte_sich versteckte_sich spähte trödelte blieb stockte schwieg wachte
				grübelte sinnierte stutzte lugte äugte`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...tensed(
				`ruht sitzt liegt rastet lehnt setzt_sich legt_sich entspannt_sich kauert kniet hockt lümmelt fläzt_sich verschnauft lagert bettet_sich erholt_sich pausiert
				schnauft faulenzt gammelt dehnt_sich`,
				`ruhte saß lag rastete lehnte setzte_sich legte_sich entspannte_sich kauerte kniete hockte lümmelte fläzte_sich verschnaufte lagerte bettete_sich erholte_sich pausierte
				schnaufte faulenzte gammelte dehnte_sich`
			)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...tensed(
				`schläft schlummert dämmert döst schnarcht träumt pennt entschlummert duselt ratzt`,
				`schlief schlummerte dämmerte döste schnarchte träumte pennte entschlummerte duselte ratzte`
			)
		},
		// What somebody shows, split by what it shows — see the Korean data. One
		// word or a reflexive each, because a question moves the whole token.
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'content',
			...tensed(
				`lacht lächelt summt kichert grinst pfeift jauchzt jubelt nickt klatscht zwinkert strahlt schmunzelt gluckst`,
				`lachte lächelte summte kicherte grinste pfiff jauchzte jubelte nickte klatschte zwinkerte strahlte schmunzelte gluckste`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'restless',
			...tensed(
				`weint seufzt murmelt schluchzt stöhnt murrt brummt schnieft schnaubt stammelt wimmert heult jammert flucht zappelt grummelt zittert bebt`,
				`weinte seufzte murmelte schluchzte stöhnte murrte brummte schniefte schnaubte stammelte wimmerte heulte jammerte fluchte zappelte grummelte zitterte bebte`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'tired',
			...tensed(
				`gähnt blinzelt reckt_sich streckt_sich`,
				`gähnte blinzelte reckte_sich streckte_sich`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'hungry',
			...tensed(`schluckt schmatzt schnuppert sabbert`, `schluckte schmatzte schnupperte sabberte`)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...tensed(
				`ruft schreit keucht niest prustet kreischt hustet räuspert_sich grunzt quiekt fiept kräht zirpt brüllt faucht knurrt jault winselt errötet schnalzt winkt zuckt stutzt`,
				`rief schrie keuchte nieste prustete kreischte hustete räusperte_sich grunzte quiekte fiepte krähte zirpte brüllte fauchte knurrte jaulte winselte errötete schnalzte winkte zuckte stutzte`
			)
		},
		{
			field: 'talk',
			subject: ['creature', 'person'],
			...tensed(
				`plaudert redet schwatzt spricht quatscht tratscht klönt tuschelt flüstert unterhält_sich ratscht palavert erzählt grüßt plauscht schnattert quasselt labert
				berichtet diskutiert schwadroniert fabuliert parliert nuschelt brabbelt plappert`,
				`plauderte redete schwatzte sprach quatschte tratschte klönte tuschelte flüsterte unterhielt_sich ratschte palaverte erzählte grüßte plauschte schnatterte quasselte laberte
				berichtete diskutierte schwadronierte fabulierte parlierte nuschelte brabbelte plapperte`
			)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...tensed(
				`tanzt singt tollt spielt hüpft rollt purzelt wirbelt kugelt_sich albert balgt_sich vergnügt_sich schaukelt wälzt_sich springt tummelt_sich kaspert trällert scherzt
				turnt jongliert klimpert trommelt musiziert`,
				`tanzte sang tollte spielte hüpfte rollte purzelte wirbelte kugelte_sich alberte balgte_sich vergnügte_sich schaukelte wälzte_sich sprang tummelte_sich kasperte trällerte scherzte
				turnte jonglierte klimperte trommelte musizierte`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...tensed(
				`sucht stöbert kramt wühlt forscht schnüffelt buddelt fahndet erkundet tastet stochert schnuppert
				sondiert wittert spioniert kundschaftet`,
				`suchte stöberte kramte wühlte forschte schnüffelte buddelte fahndete erkundete tastete stocherte schnupperte
				sondierte witterte spionierte kundschaftete`
			)
		},
		{
			field: 'change',
			subject: ['place'],
			...tensed(
				`verstummt dunkelt erhellt_sich leert_sich füllt_sich belebt_sich erwacht summt brummt wimmelt glänzt glitzert funkelt taut trocknet versinkt erstrahlt verändert_sich wandelt_sich verblasst dämmert erblüht leuchtet ergraut verödet verstaubt vereist brodelt lärmt tost rauscht flimmert erglüht verdunkelt_sich beruhigt_sich`,
				`verstummte dunkelte erhellte_sich leerte_sich füllte_sich belebte_sich erwachte summte brummte wimmelte glänzte glitzerte funkelte taute trocknete versank erstrahlte veränderte_sich wandelte_sich verblasste dämmerte erblühte leuchtete ergraute verödete verstaubte vereiste brodelte lärmte toste rauschte flimmerte erglühte verdunkelte_sich beruhigte_sich`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...tensed(
				`leuchtet fließt vertieft_sich beginnt endet dauert vergeht verstreicht naht verklingt verläuft steigert_sich verebbt entfaltet_sich wiederholt_sich verrinnt währt schwindet erlischt eskaliert verfliegt nähert_sich verlängert_sich verkürzt_sich`,
				`leuchtete floss vertiefte_sich begann endete dauerte verging verstrich nahte verklang verlief steigerte_sich verebbte entfaltete_sich wiederholte_sich verrann währte schwand erlosch eskalierte verflog näherte_sich verlängerte_sich verkürzte_sich`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a time of day or a season does: it breaks, wears away, draws in.
			subjectThemes: ['time'],
			...tensed(
				`dämmert graut neigt_sich senkt_sich kippt kommt geht erwacht erblüht weicht entschwindet verglüht ergraut`,
				`dämmerte graute neigte_sich senkte_sich kippte kam ging erwachte erblühte wich entschwand verglühte ergraute`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What weather does: it rolls in, sets in, lets up.
			subjectThemes: ['weather'],
			...tensed(
				`tobt wütet braust peitscht prasselt rieselt nieselt tröpfelt weht bläst fegt legt_sich verzieht_sich lichtet_sich verdichtet_sich dräut lastet hängt liegt`,
				`tobte wütete brauste peitschte prasselte rieselte nieselte tröpfelte wehte blies fegte legte_sich verzog_sich lichtete_sich verdichtete_sich dräute lastete hing lag`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a match does: it kicks off, heats up, wraps up.
			subjectThemes: ['sport'],
			...tensed(
				`läuft startet entscheidet_sich steigt verzögert_sich wogt`,
				`lief startete entschied_sich stieg verzögerte_sich wogte`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What a thing one can hold does. A song is a thing of another kind, below.
			subjectThemes: [
				'object',
				'tool',
				'clothing',
				'product',
				'toy',
				'furniture',
				'gem',
				'vehicle'
			],
			...tensed(
				`schwankt glänzt fällt rollt neigt_sich altert schimmert wackelt rutscht kullert stoppt steht verschleißt verbiegt_sich verformt_sich flattert wippt erzittert taumelt ruckelt sackt pendelt baumelt`,
				`schwankte glänzte fiel rollte neigte_sich alterte schimmerte wackelte rutschte kullerte stoppte stand verschliss verbog_sich verformte_sich flatterte wippte erzitterte taumelte ruckelte sackte pendelte baumelte`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What only something made of metal and wood does: a jewel never rusts.
			subjectThemes: ['object', 'tool', 'vehicle'],
			...tensed(
				`rostet quietscht knarrt klappert rattert scheppert klirrt bricht zerbricht splittert reißt platzt klemmt hakt lockert_sich löst_sich zerfällt versagt qualmt poltert rumpelt`,
				`rostete quietschte knarrte klapperte ratterte schepperte klirrte brach zerbrach splitterte riss platzte klemmte hakte lockerte_sich löste_sich zerfiel versagte qualmte polterte rumpelte`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'event'],
			// What a song or a drum does: it plays, rings out, dies away.
			subjectThemes: ['music', 'sound'],
			...tensed(
				`klingt erklingt ertönt hallt verhallt schallt dröhnt tönt erschallt widerhallt dudelt plärrt leiert klimpert perlt`,
				`klang erklang ertönte hallte verhallte schallte dröhnte tönte erschallte widerhallte dudelte plärrte leierte klimperte perlte`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...tensed(
				`fährt hält rollt wendet gleitet bremst beschleunigt parkt rangiert kurvt schlingert rast tuckert zuckelt hupt ankert kreuzt`,
				`fuhr hielt rollte wendete glitt bremste beschleunigte parkte rangierte kurvte schlingerte raste tuckerte zuckelte hupte ankerte kreuzte`
			)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...tensed(
				`wächst verschwindet bleibt schwebt vertieft_sich verblasst verfliegt keimt wuchert erstarkt verstärkt_sich brennt lodert glimmt flackert schwelt gärt verfestigt_sich verankert_sich verwurzelt_sich hält wirkt wallt schwankt beruhigt_sich`,
				`wuchs verschwand blieb schwebte vertiefte_sich verblasste verflog keimte wucherte erstarkte verstärkte_sich brannte loderte glomm flackerte schwelte gärte verfestigte_sich verankerte_sich verwurzelte_sich hielt wirkte wallte schwankte beruhigte_sich`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			...tensed(
				`wächst welkt blüht schwankt sprießt keimt knospt verblüht verdorrt vertrocknet vergilbt ergrünt grünt rankt klettert wiegt_sich raschelt duftet fruchtet gedeiht wurzelt entlaubt_sich biegt_sich krümmt_sich`,
				`wuchs welkte blühte schwankte spross keimte knospte verblühte verdorrte vertrocknete vergilbte ergrünte grünte rankte kletterte wiegte_sich raschelte duftete fruchtete gedieh wurzelte entlaubte_sich bog_sich krümmte_sich`
			)
		},
		{
			field: 'change',
			subject: ['body'],
			...tensed(
				`zittert bebt erstarrt heilt zuckt kribbelt pocht pulsiert schmerzt sticht juckt schwitzt friert erwärmt_sich kühlt verkrampft_sich verspannt_sich ermüdet erlahmt versteift_sich beugt_sich hebt_sich erschlafft prickelt schaudert bibbert zappelt`,
				`zitterte bebte erstarrte heilte zuckte kribbelte pochte pulsierte schmerzte stach juckte schwitzte fror erwärmte_sich kühlte verkrampfte_sich verspannte_sich ermüdete erlahmte versteifte_sich beugte_sich hob_sich erschlaffte prickelte schauderte bibberte zappelte`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			...tensed(
				`reift kühlt kocht schmilzt verdirbt erkaltet dampft riecht schmeckt gerinnt verdunstet gefriert verdickt_sich klärt_sich köchelt siedet zischt`,
				`reifte kühlte kochte schmolz verdarb erkaltete dampfte roch schmeckte gerann verdunstete gefror verdickte_sich klärte_sich köchelte siedete zischte`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a dish does and a drink does not: it sizzles, crumbles, goes stale.
			subjectThemes: ['food'],
			...tensed(
				`brutzelt bräunt verbrennt verkohlt zerbröselt verschimmelt säuert quillt gart zerläuft trieft krümelt bröckelt schrumpft schrumpelt`,
				`brutzelte bräunte verbrannte verkohlte zerbröselte verschimmelte säuerte quoll garte zerlief triefte krümelte bröckelte schrumpfte schrumpelte`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a drink does and a dish does not: it fizzes, spills, goes flat.
			subjectThemes: ['drink'],
			...tensed(
				`sprudelt schäumt spritzt schwappt plätschert kräuselt_sich trübt_sich tropft rinnt gluckert blubbert moussiert`,
				`sprudelte schäumte spritzte schwappte plätscherte kräuselte_sich trübte_sich tropfte rann gluckerte blubberte moussierte`
			)
		}
	],
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`
				groß klein schnell langsam still laut mutig faul sanft klug wild
				jung alt stark schwach kühn scheu stolz lebhaft gelassen stur flink wachsam kräftig ehrlich schlau
			`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'hungry',
			words: words(`hungrig ausgehungert heißhungrig`)
		},
		{ subject: ['creature', 'person'], condition: 'full', words: words(`satt gesättigt pappsatt`) },
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			words: words(`müde schläfrig erschöpft matt abgespannt schlapp`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			words: words(`ausgeruht frisch munter wach erholt tatkräftig`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			words: words(`froh zufrieden glücklich heiter vergnügt selig wohlgemut behaglich`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			words: words(`gelangweilt neugierig unruhig rastlos ungeduldig nervös zappelig bang`)
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
			words: words(
				`schön fremd neu häufig selten hübsch vertraut sonderbar gewöhnlich prächtig kostbar`
			)
		},
		{
			subject: ['place', 'event'],
			words: words(`
				weit eng ruhig tief dunkel hell fern steil
				belebt verlassen schmal leer riesig düster flach lang kurz sonnig
			`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`
				hart leicht schwer alt glatt klar stabil
				rund flach spitz dünn dick zerbrechlich prunkvoll schlicht fein rau blank
			`)
		},
		{
			subject: ['edible'],
			words: words(
				`süß salzig scharf sauer heiß kalt herzhaft bitter dickflüssig weich lauwarm saftig knusprig lecker fade`
			)
		},
		{
			subject: ['idea'],
			words: words(
				`einfach deutlich vage ewig flüchtig verwickelt klar tief vertraut wertvoll heimlich winzig schwierig`
			)
		},
		{
			subject: ['plant'],
			words: words(`grün üppig duftend welk hoch zart schlank blühend licht dicht`)
		},
		{
			subject: ['body'],
			words: words(`warm kalt wund steif weich rau glatt blass stark taub schwer`)
		}
	],
	// Base forms, which `agreement` gives the strong endings after `ein`.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				mutig lebhaft sanft fleißig faul schüchtern klug jung alt klein groß still fröhlich geduldig flink neugierig
				kühn ängstlich vorsichtig stur zahm laut kräftig hager rundlich schläfrig schlau wachsam schweigsam stolz arglos ehrlich wach gelassen
			`)
		},
		{
			subject: ['person'],
			words: words(`
				jung freundlich streng ernst beschäftigt aufrichtig
				weise bescheiden höflich geschickt berühmt arm reich betagt heiter scharfsinnig leutselig fleißig
			`)
		},
		{
			subject: ['creature'],
			words: words(
				`flink wild zahm rundlich winzig zottig gefleckt gestreift mager riesig geschickt pummelig glänzend langgestreckt`
			)
		},
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(`
				süß scharf warm frisch knusprig würzig duftend heiß salzig weich reif lecker
				goldbraun geräuchert sahnig zart saftig deftig dampfend geröstet klebrig fade gewürzt
			`)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(
				`süß warm kalt kühl heiß duftend frisch stark bitter sahnig eisig milchig trüb klar sprudelnd mild lauwarm`
			)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`
				alt neu klein groß leicht schwer glänzend glatt klar stabil hübsch kostbar uralt
				rostig abgenutzt poliert schlicht prunkvoll schmal breit rund flach spitz stumpf zerbrechlich hohl staubig krumm
			`)
		},
		{
			subject: ['vehicle'],
			words: words(`schnell langsam robust knarrend blinkend rostig klapprig wuchtig laut nagelneu`)
		},
		{
			subject: ['place'],
			words: words(`
				still weit dunkel hell fremd alt gemütlich abgelegen belebt leise fern nah leer einsam sonnig
				schmal überfüllt windig neblig schattig staubig feucht felsig steil flach öde grün menschenleer luftig
			`)
		},
		{
			subject: ['plant'],
			words: words(`
				grün üppig duftend jung welk klein zart frisch
				dornig blühend knospend rankend wild schlank blass hängend dicht
			`)
		},
		{
			subject: ['idea'],
			words: words(`
				vage alt neu fremd klar kostbar klein seltsam
				schwach einfach verworren hartnäckig flüchtig fern kühn heimlich leise vertraut
			`)
		},
		{
			subject: ['event'],
			words: words(`
				lang kurz still sonnig trüb laut plötzlich
				feierlich heiter langweilig regnerisch stürmisch ruhig belebt überfüllt prächtig schlicht
			`)
		},
		{
			subject: ['body'],
			words: words(`klein kalt warm schlank kräftig weich steif wund rau glatt blass stark`)
		},
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
			words: words(
				`schön geheimnisvoll fremd neu hübsch vertraut sonderbar gewöhnlich prächtig bescheiden`
			)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				leise langsam schnell sanft plötzlich kaum allein kurz kühn sorgsam eifrig ruhig heftig geduldig leicht
				fröhlich munter schwerfällig gelassen emsig zügig vergnügt
				verstohlen auf_Zehenspitzen hastig eilig behutsam aufmerksam zerstreut nervös neugierig stolz
				schüchtern freundlich zärtlich bitter streng schläfrig gierig achtlos barsch geschickt entschlossen
				glücklich traurig lebhaft mit_Mühe widerwillig absichtlich wortlos mit_einem_Satz ohne_Eile
				mit_Genuss halblaut unablässig
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(`
				leise langsam sanft plötzlich kaum wieder noch stetig allmählich nach_und_nach schwach weiter
				still sacht rasch tief weit hell matt warm kalt süß dicht fest schwer leicht endlos
				unaufhörlich ständig noch_einmal eine_Weile mit_einem_Mal überall
			`)
		}
	],
	times: {
		day: words(`
			bei_Tagesanbruch am_frühen_Morgen am_Morgen am_Vormittag am_Mittag am_Nachmittag in_der_Dämmerung
			am_Abend in_der_Nacht spät_in_der_Nacht um_Mitternacht
		`),
		any: words(`
			im_Frühling im_Sommer im_Herbst im_Winter am_Wochenende an_Feiertagen den_ganzen_Tag
			im_Frühsommer im_Hochsommer im_Spätsommer im_Frühherbst im_Spätherbst im_Hochwinter im_Spätwinter
			im_zeitigen_Frühjahr im_Spätfrühling in_der_Regenzeit zur_Erntezeit auf_dem_Fest am_Markttag
			bei_Vollmond an_einem_Regentag an_einem_Schneetag an_einem_windigen_Tag an_einem_klaren_Tag
			an_einem_trüben_Tag an_einem_Nebeltag in_den_Ferien
		`),
		past: words(`
			gestern letzte_Woche vor_langer_Zeit einst an_jenem_Tag in_jener_Nacht
			vorgestern letzten_Monat letztes_Jahr vor_Jahren vor_einer_Weile an_jenem_Morgen an_jenem_Abend
			damals in_jenen_Tagen die_Woche_zuvor letzten_Frühling letzten_Sommer letzten_Herbst letzten_Winter
			vor_einigen_Tagen
		`),
		present: words(`
			heute gerade_eben morgen nächste_Woche
			jetzt heute_Morgen heute_Abend heute_Nacht übermorgen nächsten_Monat nächstes_Jahr dieses_Jahr
			diese_Woche dieses_Wochenende gleich bald
		`),
		habitual: words(`
			heutzutage manchmal jeden_Tag jede_Nacht
			immer oft meistens kaum_je gelegentlich alle_paar_Tage ab_und_zu jeden_Morgen jede_Woche jedes_Jahr
			für_gewöhnlich fast_immer
		`)
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
		Amsel Nachtigall Lerche Wachtel Fasan Rebhuhn Kolibri Tukan Flamingo Storch Wiedehopf
		Distelfink Elster Häher Kauz Bussard Möwe Specht Zaunkönig Wespe Motte Leuchtkäfer Hummel
		Marienkäfer Hippogreif
		Krähe Schmetterling
		`),
		swimmer: words(`
		Krokodil Schildkröte Frosch Kröte Fisch Wal Delfin Hai Krake Tintenfisch Garnele Krabbe Walross
		Robbe Pinguin
		Meerjungfrau Najade
		Aal Sardine Thunfisch Dorsch Seehecht Forelle Karpfen Rochen Qualle Muschel Auster Hummer
		Seestern Salamander Molch Biber Nilpferd Schnabeltier Meerforelle
		Hering Hecht Wassermann Seeschlange Sirene
		`),
		crawler: words(`
		Krokodil Schlange Eidechse Schildkröte Schnecke Ameise Spinne Wurm Krabbe
		Basilisk
		Leguan Chamäleon Salamander Molch Boa Viper Kobra Python Käfer
		Heuschrecke Grille Floh Raupe Tausendfüßer Skorpion
		`),
		// A word of a creature theme that is no creature: it takes no verb and no state.
		lifeless: words(`
			Zauber Fluch Weissagung Amulett Talisman Rune Pforte Heiligtum Götze Totem Vorzeichen Omen Bestiarium
			Zauberbuch Pentagramm Reliquie Kelch Gral Zauberstab Stab Zepter Krone Beschwörung
			Zauberspruch Zaubertrank Elixier Kristallkugel Bann Segen Alraune Hölle Paradies Unterwelt Jenseits
			Tarnkappe Schriftrolle Wunder Altar Verwandlung Horoskop Tarot Wünschelrute Geisterschiff Spuk Jungbrunnen
		`)
	},
	interjections: words(`
		oh, ach, na, mensch, oje, sieh_an, wahrhaftig, hui, herrje, du_meine_Güte, nanu,
		aha, oha, ei, tja, nun, wahrlich, potztausend, um_Himmels_willen, ach_je, sieh_da, tatsächlich,
	`),
	pronouns: { m: words(`er`), f: words(`sie`), n: words(`es`) },
	// What somebody answers with.
	replies: {
		casual: {
			agree: words(`
				stimmt genau eben ich_auch so_ist_es allerdings in_der_Tat richtig ganz_genau das_finde_ich_auch da_ist_was_dran
			`),
			cheer: words(`
				wie_schön! gut_gemacht! großartig! du_Glückspilz prima! Glückwunsch was_für_eine_Freude! wunderbar! endlich! das_freut_mich
			`),
			care: words(`
				alles_in_Ordnung? ruh_dich_aus übertreib_es_nicht lass_uns_etwas_essen das_klingt_anstrengend lass_dir_Zeit keine_Sorge pass_auf Kopf_hoch setz_dich_kurz trink_etwas_Wasser ich_helfe_dir
			`),
			wonder: words(`
				wirklich? im_Ernst? wo? wann? und_dann? das_gibt's_nicht! wie? warum? ach_ja? und_danach? was_ist_passiert? was?
			`),
			answer: words(`
				ja,_ein_bisschen nein,_alles_gut ja,_ziemlich geht_so nein,_noch_nicht ja,_sehr ein_wenig nicht_wirklich ja,_total nein,_gar_nicht so_lala ja,_ehrlich_gesagt
			`)
		}
	},
	// A question to the person beside them is `bist du`, with the copula in front
	// where the question shape puts it. The first person would have to conjugate
	// every verb, so there is no `speech`.
	listener: { subject: 'du', head: 'bist' },
	// What somebody says on coming home — said whole, so no verb has to be
	// conjugated for a first person the language otherwise leaves unwritten.
	homecomings: {
		casual: words(
			`ich_bin_zu_Hause ich_bin_zurück endlich_zu_Hause! da_bin_ich_wieder wieder_daheim`
		)
	},
	// How much a state holds, in front of it: `ist sehr müde`.
	degrees: words(`sehr ziemlich wirklich ganz recht etwas äußerst ungemein reichlich furchtbar`),
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
		// A state with how much of it, and one with when: `Der Fuchs ist sehr müde`,
		// `Am Morgen ist der Fuchs müde` — the verb second, so the copula stands on
		// the subject the way the question's does.
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'degree' },
				{ slot: 'state', head: 'ist', pastHead: 'war' }
			],
			weight: 9
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', head: 'ist', pastHead: 'war', modifiable: true },
				{ slot: 'state' }
			],
			weight: 5
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
		},
		{
			parts: [
				{ slot: 'subject', head: 'ist', pastHead: 'war', modifiable: true },
				{ slot: 'degree' },
				{ slot: 'state' }
			],
			weight: 6,
			mood: 'question'
		}
	]
};
