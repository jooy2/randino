import { words } from '../../_internal/parse.js';
import type { SentenceLanguageData } from './types.js';

export const RU: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' },
	quotes: { double: ['«', '»'], single: ['„', '“'] },
	predicateAgrees: true,
	// Third person singular of the present. The present is the one tense that does
	// not inflect for the subject's gender, which is what lets one verb stand
	// behind every noun in the pools.
	verbs: [
		{
			subject: ['creature', 'person'],
			words: words(`
				бежит идёт прыгает плывёт летит ползёт возвращается уходит останавливается
				отдыхает спит смеётся плачет поёт танцует прячется ждёт стоит сидит катится
				бродит проходит приближается слушает
			`)
		},
		{
			subject: ['place', 'event'],
			words: words(`светится течёт темнеет светлеет углубляется затихает`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`качается блестит падает катится клонится стареет`)
		},
		{
			subject: ['vehicle'],
			words: words(`едет останавливается проезжает возвращается отправляется скользит`)
		},
		{
			subject: ['idea', 'event'],
			words: words(`расходится исчезает остаётся плывёт нарастает`)
		},
		{
			subject: ['plant'],
			words: words(`растёт вянет цветёт качается тянется`)
		},
		{
			subject: ['body'],
			words: words(`дрожит движется немеет твердеет`)
		},
		{
			subject: ['edible'],
			words: words(`зреет остывает кипит тает портится`)
		}
	],
	// Written in the masculine singular, the form `agreement` reshapes. Russian
	// needs no copula in the present, so the adjective stands as the whole
	// predicate: `кит синий`.
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`
				большой маленький быстрый медленный тихий шумный смелый ленивый голодный
				сонный дикий кроткий умный
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
	manners: words(`
		тихо медленно быстро мягко вдруг едва снова вместе одиноко ещё ненадолго ровно смело осторожно
		жадно спокойно весело терпеливо легко чётко бодро лениво упрямо охотно шумно мерно
	`),
	times: words(`
		на_рассвете утром днём вечером ночью сегодня вчера завтра весной летом осенью зимой в_выходные
		только_что иногда каждый_день в_сумерках в_полночь на_прошлой_неделе на_следующей_неделе нынче
		давно в_праздники весь_день каждую_ночь
	`),
	connectives: words(`
		и_потом но затем поэтому однако наконец потом тем_временем а зато всё_же в_итоге значит
	`),
	interjections: words(`
		ах, ох, эх, ух, боже, гляди, право, ой, ух_ты, батюшки, надо_же, эй,
	`),
	pronouns: { m: words(`он`), f: words(`она`), n: words(`оно`) },
	// Nominative only, which is why there is neither an object nor a place here: a
	// Russian noun changes its own ending for both, and the endings are the noun's
	// own rather than a rule the pools could carry.
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
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'state' }],
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
			parts: [{ slot: 'time' }, { slot: 'subject', modifiable: true }, { slot: 'state' }],
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
