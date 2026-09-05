import { words } from '../../_internal/parse.js';
import type { SentenceLanguageData } from './types.js';

export const EN: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' },
	// One article, and a definite one. English has three ways to open a noun
	// phrase and only `the` is right for every noun in the pools: `a` is wrong in
	// front of a mass noun (`a rain`) and a bare plural is wrong in front of a
	// count one, so choosing between them would need a tag on every noun that
	// nothing else in the library asks for.
	articles: { n: [['', 'the']] },
	// Third person singular, which is the form every subject here takes.
	verbs: [
		{
			subject: ['creature', 'person'],
			words: words(`
				runs walks leaps swims flies crawls returns leaves stops rests sleeps laughs
				cries sings dances yawns hides waits stands sits tumbles wanders passes
				approaches dozes stretches listens
			`),
			forms: {
				question: words(`
					run walk leap swim fly crawl return leave stop rest sleep laugh cry sing dance yawn
					hide wait stand sit tumble wander pass approach doze stretch listen
				`)
			}
		},
		{
			subject: ['creature', 'person'],
			object: ['edible'],
			words: words(`eats drinks chews swallows tastes bakes warms shares`),
			forms: { question: words(`eat drink chew swallow taste bake warm share`) }
		},
		{
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`watches finds carries touches guards chooses moves lifts gathers`),
			forms: { question: words(`watch find carry touch guard choose move lift gather`) }
		},
		{
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`makes mends cleans sells buys builds paints`),
			forms: { question: words(`make mend clean sell buy build paint`) }
		},
		{
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			words: words(`remembers forgets imagines counts describes`),
			forms: { question: words(`remember forget imagine count describe`) }
		},
		{
			subject: ['place', 'event'],
			words: words(`glows flows darkens brightens deepens quiets fades widens`),
			forms: { question: words(`glow flow darken brighten deepen quiet fade widen`) }
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`sways glitters falls rolls tilts ages creaks`),
			forms: { question: words(`sway glitter fall roll tilt age creak`) }
		},
		{
			subject: ['vehicle'],
			words: words(`runs stops passes returns departs slides`),
			forms: { question: words(`run stop pass return depart slide`) }
		},
		{
			subject: ['idea', 'event'],
			words: words(`spreads vanishes remains lingers returns gathers`),
			forms: { question: words(`spread vanish remain linger return gather`) }
		},
		{
			subject: ['plant'],
			words: words(`grows wilts blooms sways spreads`),
			forms: { question: words(`grow wilt bloom sway spread`) }
		},
		{
			subject: ['body'],
			words: words(`trembles moves stiffens aches heals`),
			forms: { question: words(`tremble move stiffen ache heal`) }
		},
		{
			subject: ['edible'],
			words: words(`ripens cools boils melts spoils remains`),
			forms: { question: words(`ripen cool boil melt spoil remain`) }
		}
	],
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`
				big small quick slow quiet loud brave lazy busy hungry sleepy fierce gentle
				clever restless
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
			words: words(`beautiful strange new common rare`)
		},
		{
			subject: ['place', 'event'],
			words: words(`wide narrow calm deep dark bright distant steep`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`hard light heavy old smooth clear sturdy hollow`)
		},
		{
			subject: ['edible'],
			words: words(`sweet salty spicy sour hot cold nutty mild`)
		},
		{
			subject: ['idea'],
			words: words(`simple obvious vague endless fleeting stubborn`)
		},
		{
			subject: ['plant'],
			words: words(`green lush fragrant withered`)
		},
		{
			subject: ['body'],
			words: words(`warm cold sore stiff steady`)
		}
	],
	manners: words(`
		quietly slowly quickly gently suddenly softly again together alone briefly steadily
		boldly carefully eagerly warily calmly neatly side_by_side once_more
	`),
	times: words(`
		at_dawn in_the_morning at_noon in_the_evening at_night today yesterday tomorrow
		in_spring in_summer in_autumn in_winter on_weekends just_now sometimes every_day
		at_dusk before_long
	`),
	connectives: words(`and_then so but meanwhile afterwards still later soon even_so at_last`),
	interjections: words(`oh, ah, wow, well, look, goodness, my, indeed, honestly,`),
	pronouns: { n: words(`it`) },
	// English cannot drop a subject, so a sentence about a person names it again.
	pronounless: ['person'],
	// English puts its verb second, and the sentence grows to the right of it.
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
				{ slot: 'place', head: 'in', modifiable: true }
			],
			weight: 14
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: 'is' }
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
				{ slot: 'place', head: 'in', modifiable: true }
			],
			weight: 7
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'place', head: 'in', modifiable: true }
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
		},
		// English asks with do-support, so the auxiliary stands in front of the
		// subject and the verb falls back to its base form — `Does the lion run?`
		// rather than `Runs the lion?`. `is` moves the same way.
		{
			parts: [{ slot: 'subject', head: 'does', modifiable: true }, { slot: 'verb' }],
			weight: 20,
			mood: 'question'
		},
		{
			parts: [
				{ slot: 'subject', head: 'does', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 16,
			mood: 'question'
		},
		{
			parts: [{ slot: 'subject', head: 'is', modifiable: true }, { slot: 'state' }],
			weight: 14,
			mood: 'question'
		},
		{
			parts: [
				{ slot: 'subject', head: 'does', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'place', head: 'in', modifiable: true }
			],
			weight: 12,
			mood: 'question'
		},
		{
			parts: [
				{ slot: 'subject', head: 'does', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'manner' }
			],
			weight: 10,
			mood: 'question'
		}
	]
};
