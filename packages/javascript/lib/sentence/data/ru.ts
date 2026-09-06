import { words } from '../../_internal/parse.js';
import type { WordPool } from '../../word/data/types.js';
import type { PredicateTense, SentenceLanguageData } from './types.js';

// The two forms a Russian verb group is written in: the third person singular of
// the present, and the masculine past — which `pastAgreement` reshapes for a
// feminine or a neuter subject, the way `agreement` reshapes a modifier.
function tensed(present: string, past: string): { words: WordPool; past: PredicateTense } {
	return { words: words(present), past: { words: words(past) } };
}

export const RU: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' },
	quotes: { double: ['«', '»'], single: ['„', '“'] },
	predicateAgrees: true,
	// A Russian past agrees with its subject: `бежал`, `бежала`, `бежало`, and a
	// reflexive keeps its `ся` behind the ending. Every past here is written to
	// close on `л` or `лся`, so that these two rules are the whole of it; a verb
	// whose past does not (`шёл`, `рос`) is left out for one whose past does.
	pastAgreement: {
		f: [
			['лся', 'лась'],
			['л', 'ла']
		],
		n: [
			['лся', 'лось'],
			['л', 'ло']
		]
	},
	// Third person singular of the present. The present is the one tense that does
	// not inflect for the subject's gender, which is what lets one verb stand
	// behind every noun in the pools; the past does, and agrees.
	//
	// No verb here takes an object or a destination, because both would put the
	// noun in a case its own ending changes for.
	verbs: [
		{
			field: 'rise',
			subject: ['creature', 'person'],
			...tensed(`просыпается встаёт поднимается`, `проснулся встал поднялся`)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...tensed(
				`направляется удаляется отправляется спешит`,
				`направился удалился отправился поспешил`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...tensed(`возвращается прибывает появляется`, `вернулся прибыл появился`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(`бежит прыгает гуляет шагает`, `бежал прыгал гулял шагал`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			...tensed(`бродит проходит`, `бродил проходил`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			...tensed(`плывёт`, `плыл`)
		},
		{
			field: 'move',
			// Flying is a flier's alone: a sparrow's, a dragon's, never a fish's.
			subject: ['creature'],
			subjectTraits: ['flier'],
			...tensed(`летит`, `летел`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			...tensed(`ползёт`, `ползал`)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...tensed(
				`ждёт прячется оглядывается медлит останавливается`,
				`ждал прятался оглядывался медлил остановился`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...tensed(
				`отдыхает сидит лежит прислоняется устраивается`,
				`отдыхал сидел лежал прислонился устроился`
			)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...tensed(`спит дремлет засыпает`, `спал дремал заснул`)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...tensed(
				`смеётся плачет зевает вздыхает улыбается напевает бормочет кричит`,
				`смеялся плакал зевал вздыхал улыбался напевал бормотал кричал`
			)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...tensed(
				`танцует поёт катается играет резвится подпрыгивает`,
				`танцевал пел катался играл резвился подпрыгивал`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...tensed(`ищет роется осматривается шарит`, `искал рылся осматривался шарил`)
		},
		{
			field: 'change',
			subject: ['place'],
			...tensed(
				`успокаивается темнеет светлеет пустеет наполняется оживает`,
				`успокоился потемнел посветлел опустел наполнился ожил`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...tensed(
				`светится струится углубляется начинается заканчивается длится проходит`,
				`светился струился углубился начался закончился длился проходил`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			...tensed(
				`качается блестит падает катится клонится стареет`,
				`качался блестел упал катился клонился старел`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...tensed(
				`едет останавливается проезжает возвращается отправляется скользит`,
				`ехал останавливался проезжал возвращался отправлялся скользил`
			)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...tensed(
				`расходится исчезает остаётся плывёт нарастает`,
				`расходился исчезал остался плыл нарастал`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			...tensed(
				`подрастает вянет расцветает качается тянется`,
				`подрастал вял расцветал качался тянулся`
			)
		},
		{
			field: 'change',
			subject: ['body'],
			...tensed(`дрожит движется немеет твердеет`, `дрожал двигался немел твердел`)
		},
		{
			field: 'change',
			subject: ['edible'],
			...tensed(`зреет остывает кипит тает портится`, `зрел остыл кипел растаял испортился`)
		}
	],
	// Written in the masculine singular, the form `agreement` reshapes. Russian
	// needs no copula in the present, so the adjective stands as the whole
	// predicate: `кит синий`. The past needs one, and it agrees: `кит был синий`,
	// `луна была большая` — which is what the shape's `pastHead` and
	// `pastAgreement` write between them.
	states: [
		{
			subject: ['creature', 'person'],
			words: words(
				`большой маленький быстрый медленный тихий шумный смелый ленивый дикий кроткий умный`
			)
		},
		{ subject: ['creature', 'person'], condition: 'hungry', words: words(`голодный`) },
		{ subject: ['creature', 'person'], condition: 'full', words: words(`сытый`) },
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			words: words(`усталый сонный утомлённый`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			words: words(`бодрый свежий отдохнувший`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			words: words(`довольный счастливый радостный спокойный`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			words: words(`скучающий любопытный беспокойный тревожный`)
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
			words: words(`красивый странный новый редкий`)
		},
		{
			subject: ['place', 'event'],
			words: words(`широкий узкий спокойный глубокий тёмный светлый далёкий крутой`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`твёрдый лёгкий тяжёлый старый гладкий прозрачный прочный`)
		},
		{
			subject: ['edible'],
			words: words(`сладкий солёный острый кислый горячий холодный`)
		},
		{
			subject: ['idea'],
			words: words(`простой ясный смутный вечный мимолётный`)
		},
		{
			subject: ['plant'],
			words: words(`зелёный пышный душистый увядший`)
		},
		{
			subject: ['body'],
			words: words(`тёплый холодный больной жёсткий`)
		}
	],
	// Masculine singular, the form `agreement` reshapes.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				смелый живой добрый занятой ленивый робкий умный молодой старый маленький большой тихий весёлый терпеливый ловкий
				любопытный
			`)
		},
		{ subject: ['person'], words: words(`молодой добрый строгий серьёзный занятой честный`) },
		{ subject: ['creature'], words: words(`быстрый свирепый ручной пухлый крохотный`) },
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(
				`сладкий острый тёплый свежий хрустящий вкусный душистый горячий солёный мягкий спелый сытный`
			)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(`сладкий тёплый холодный прохладный горячий душистый свежий крепкий`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(
				`старый новый маленький большой лёгкий тяжёлый блестящий гладкий прозрачный твёрдый красивый ценный древний`
			)
		},
		{ subject: ['vehicle'], words: words(`быстрый медленный крепкий`) },
		{
			subject: ['place'],
			words: words(
				`тихий широкий тёмный светлый чужой старый уютный укромный людный безмолвный далёкий близкий пустой одинокий солнечный`
			)
		},
		{
			subject: ['plant'],
			words: words(`зелёный пышный душистый молодой увядший высокий маленький нежный свежий`)
		},
		{
			subject: ['idea'],
			words: words(`смутный старый новый чужой ясный ценный маленький странный`)
		},
		{
			subject: ['event'],
			words: words(`долгий короткий тихий солнечный пасмурный шумный внезапный`)
		},
		{ subject: ['body'], words: words(`маленький холодный тёплый тонкий крепкий`) },
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
			words: words(`красивый таинственный чужой новый`)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				тихо медленно быстро мягко вдруг едва одиноко ненадолго ровно смело осторожно жадно спокойно весело
				терпеливо легко чётко бодро лениво упрямо охотно шумно неспешно
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(
				`тихо медленно мягко вдруг едва снова ещё мерно постепенно слабо понемногу всё_ещё чуть`
			)
		}
	],
	times: {
		day: words(`
			на_рассвете ранним_утром утром до_полудня в_полдень днём после_полудня в_сумерках вечером ночью
			поздней_ночью в_полночь
		`),
		any: words(`весной летом осенью зимой в_выходные в_праздники весь_день`),
		past: words(`вчера на_прошлой_неделе давно однажды в_тот_день в_ту_ночь`),
		present: words(`сегодня только_что завтра на_следующей_неделе`),
		habitual: words(`нынче иногда каждый_день каждую_ночь`)
	},
	// Nowhere a Russian sentence here can go, because a destination is accusative;
	// the pool is written all the same, so the shape of the data is the same.
	homes: words(`дом`),
	// Two clauses are joined on и, and Russian's free word order lets the second
	// stand without its subject in any shape: `Лиса вернулась и уснула`.
	join: { word: 'и' },
	connectives: {
		additive: words(`и_потом кроме_того`),
		temporal: words(`затем наконец потом тем_временем вскоре`),
		contrastive: words(`но однако а зато всё_же`),
		causal: words(`поэтому в_итоге значит`)
	},
	// What a noun can do that its theme does not say. A noun listed nowhere has no
	// trait, and takes any verb that asks for none.
	traits: {
		flier: words(`
		птица ласточка воробей ворон сокол орёл павлин попугай сова голубь журавль лебедь утка гусь
		бабочка пчела стрекоза цикада муха комар летучая_мышь цапля пеликан
		дракон феникс фея грифон пегас ангел валькирия
		`),
		swimmer: words(`
		крокодил черепаха лягушка жаба рыба кит дельфин акула осьминог кальмар креветка краб морж тюлень
		пингвин
		русалка кракен наяда
		`),
		crawler: words(`
		крокодил змея ящерица черепаха улитка муравей паук червь краб
		василиск
		`)
	},
	interjections: words(`
		ах, ох, эх, ух, боже, гляди, право, ой, ух_ты, батюшки, надо_же, эй,
	`),
	pronouns: { m: words(`он`), f: words(`она`), n: words(`оно`) },
	// An object named once is a pronoun the next time, where the object stood:
	// `сварил колбасу и съел её`.
	objectPronouns: { words: { m: words(`его`), f: words(`её`), n: words(`его`) } },
	// Nominative only, which is why there is neither an object nor a place here: a
	// Russian noun changes its own ending for both, and the endings are the noun's
	// own rather than a rule the pools could carry. A state in the past takes
	// `был`, which `pastAgreement` turns into `была` and `было`.
	frames: [
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 26
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'manner' }, { slot: 'verb' }],
			weight: 20
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', pastHead: 'был' }
			],
			weight: 20
		},
		{
			parts: [{ slot: 'time' }, { slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 18
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'manner' }],
			weight: 16
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'manner' },
				{ slot: 'verb' }
			],
			weight: 12
		},
		// Russian orders its words freely, so an adverb or a time can open the
		// sentence without anything else moving. That is the only room it has left:
		// every other part would put a noun in a case its own ending changes for.
		{
			parts: [{ slot: 'manner' }, { slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 14
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', pastHead: 'был' }
			],
			weight: 12
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'manner' }
			],
			weight: 10
		}
	]
};
