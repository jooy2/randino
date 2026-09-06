import { words } from '../../_internal/parse.js';
import type { WordPool } from '../../word/data/types.js';
import type { PredicateTense, SentenceLanguageData } from './types.js';

// The three forms an English verb group is written in: the third person singular
// a statement takes, the base form a question falls back to after `does` — and
// after `did`, which is why the past question is the same pool — and the past.
function tensed(
	present: string,
	base: string,
	past: string
): { words: WordPool; forms: { question: WordPool }; past: PredicateTense } {
	const question = words(base);

	return {
		words: words(present),
		forms: { question },
		past: { words: words(past), forms: { question } }
	};
}

export const EN: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' },
	quotes: { double: ['“', '”'], single: ['‘', '’'] },
	// One article, and a definite one. English has three ways to open a noun
	// phrase and only `the` is right for every noun in the pools: `a` is wrong in
	// front of a mass noun (`a rain`) and a bare plural is wrong in front of a
	// count one, so choosing between them would need a tag on every noun that
	// nothing else in the library asks for.
	articles: { n: [['', 'the']] },
	// Third person singular, which is the form every subject here takes, and the
	// past beside it. The verbs are grouped by what they do, which is what a story
	// asks for: a step that has the hero eat draws from `eat` and nowhere else.
	verbs: [
		{
			field: 'rise',
			subject: ['creature', 'person'],
			...tensed(`wakes gets_up rises stirs`, `wake get_up rise stir`, `woke got_up rose stirred`)
		},
		// Setting off: the verbs that need somewhere to go, and the ones that stand
		// on their own. `heads` wants a `to the market` after it; `leaves` does not.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`goes heads hurries wanders`,
				`go head hurry wander`,
				`went headed hurried wandered`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			// Running somewhere is for legs: a fish and a snake go, and do not run.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(`runs walks climbs`, `run walk climb`, `ran walked climbed`)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...tensed(`leaves sets_off departs`, `leave set_off depart`, `left set_off departed`)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`returns comes_back gets_back heads_back`,
				`return come_back get_back head_back`,
				`returned came_back got_back headed_back`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...tensed(
				`arrives comes_home returns`,
				`arrive come_home return`,
				`arrived came_home returned`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(
				`runs walks leaps strolls roams paces`,
				`run walk leap stroll roam pace`,
				`ran walked leapt strolled roamed paced`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			...tensed(`wanders passes`, `wander pass`, `wandered passed`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			...tensed(`swims`, `swim`, `swam`)
		},
		{
			field: 'move',
			// Flying is a flier's alone: a sparrow's, a dragon's, never a fish's.
			subject: ['creature'],
			subjectTraits: ['flier'],
			...tensed(`flies`, `fly`, `flew`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			...tensed(`crawls`, `crawl`, `crawled`)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...tensed(
				`waits hides lingers looks_around hesitates pauses stops`,
				`wait hide linger look_around hesitate pause stop`,
				`waited hid lingered looked_around hesitated paused stopped`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...tensed(
				`rests sits lies_down leans curls_up stretches_out`,
				`rest sit lie_down lean curl_up stretch_out`,
				`rested sat lay_down leaned curled_up stretched_out`
			)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...tensed(
				`sleeps dozes falls_asleep nods_off`,
				`sleep doze fall_asleep nod_off`,
				`slept dozed fell_asleep nodded_off`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...tensed(
				`laughs cries yawns sighs smiles hums mutters shouts`,
				`laugh cry yawn sigh smile hum mutter shout`,
				`laughed cried yawned sighed smiled hummed muttered shouted`
			)
		},
		{
			field: 'talk',
			subject: ['creature', 'person'],
			...tensed(`chats talks chatters`, `chat talk chatter`, `chatted talked chattered`)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...tensed(
				`dances sings tumbles frolics plays bounces skips`,
				`dance sing tumble frolic play bounce skip`,
				`danced sang tumbled frolicked played bounced skipped`
			)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			...tensed(
				`remembers forgets imagines counts recalls misses wonders_about`,
				`remember forget imagine count recall miss wonder_about`,
				`remembered forgot imagined counted recalled missed wondered_about`
			)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`watches looks_at studies examines admires touches strokes`,
				`watch look_at study examine admire touch stroke`,
				`watched looked_at studied examined admired touched stroked`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...tensed(
				`searches looks_around rummages hunts_around`,
				`search look_around rummage hunt_around`,
				`searched looked_around rummaged hunted_around`
			)
		},
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`finds discovers spots picks_up comes_across`,
				`find discover spot pick_up come_across`,
				`found discovered spotted picked_up came_across`
			)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`takes picks grabs gathers chooses gets`,
				`take pick grab gather choose get`,
				`took picked grabbed gathered chose got`
			)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`carries brings hauls lugs`,
				`carry bring haul lug`,
				`carried brought hauled lugged`
			)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`hides tucks_away stores puts_away keeps buries`,
				`hide tuck_away store put_away keep bury`,
				`hid tucked_away stored put_away kept buried`
			)
		},
		{
			field: 'lose',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(`loses drops misplaces`, `lose drop misplace`, `lost dropped misplaced`)
		},
		{
			field: 'meet',
			subject: ['creature', 'person'],
			object: ['person'],
			...tensed(`meets runs_into greets`, `meet run_into greet`, `met ran_into greeted`)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`makes builds crafts carves paints weaves shapes`,
				`make build craft carve paint weave shape`,
				`made built crafted carved painted wove shaped`
			)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`mends cleans polishes fixes tidies oils`,
				`mend clean polish fix tidy oil`,
				`mended cleaned polished fixed tidied oiled`
			)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`sells hands_over trades_away offers`,
				`sell hand_over trade_away offer`,
				`sold handed_over traded_away offered`
			)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			...tensed(
				`buys purchases picks_up orders`,
				`buy purchase pick_up order`,
				`bought purchased picked_up ordered`
			)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`warms cooks serves prepares heats`,
				`warm cook serve prepare heat`,
				`warmed cooked served prepared heated`
			)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			// What goes in the oven or under the knife: a potato, a steak, never a curry.
			objectTraits: ['raw'],
			...tensed(
				`bakes roasts grills fries slices chops peels`,
				`bake roast grill fry slice chop peel`,
				`baked roasted grilled fried sliced chopped peeled`
			)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			// What goes in the pot.
			objectTraits: ['liquid'],
			...tensed(
				`stirs simmers boils ladles`,
				`stir simmer boil ladle`,
				`stirred simmered boiled ladled`
			)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`eats tastes swallows devours finishes`,
				`eat taste swallow devour finish`,
				`ate tasted swallowed devoured finished`
			)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			// Nobody chews a syrup.
			objectWithout: ['liquid'],
			...tensed(
				`chews bites nibbles crunches munches`,
				`chew bite nibble crunch munch`,
				`chewed bit nibbled crunched munched`
			)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			objectTraits: ['liquid'],
			...tensed(`sips slurps spoons`, `sip slurp spoon`, `sipped slurped spooned`)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			...tensed(`drinks sips gulps savors`, `drink sip gulp savor`, `drank sipped gulped savored`)
		},
		// What a place does on its own is what a story's scene is made of, and what
		// an event does is another list.
		{
			field: 'change',
			subject: ['place'],
			...tensed(
				`quiets darkens brightens empties fills_up glows`,
				`quiet darken brighten empty fill_up glow`,
				`quieted darkened brightened emptied filled_up glowed`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...tensed(
				`glows flows fades deepens begins ends passes`,
				`glow flow fade deepen begin end pass`,
				`glowed flowed faded deepened began ended passed`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			...tensed(
				`sways glitters falls rolls tilts ages creaks`,
				`sway glitter fall roll tilt age creak`,
				`swayed glittered fell rolled tilted aged creaked`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...tensed(
				`runs stops passes returns departs slides`,
				`run stop pass return depart slide`,
				`ran stopped passed returned departed slid`
			)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...tensed(
				`spreads vanishes remains lingers returns gathers`,
				`spread vanish remain linger return gather`,
				`spread vanished remained lingered returned gathered`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			...tensed(
				`grows wilts blooms sways spreads`,
				`grow wilt bloom sway spread`,
				`grew wilted bloomed swayed spread`
			)
		},
		{
			field: 'change',
			subject: ['body'],
			...tensed(
				`trembles moves stiffens aches heals`,
				`tremble move stiffen ache heal`,
				`trembled moved stiffened ached healed`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			...tensed(
				`ripens cools boils melts spoils remains`,
				`ripen cool boil melt spoil remain`,
				`ripened cooled boiled melted spoiled remained`
			)
		}
	],
	// The adjective alone: the copula is the frame's `is`, and its past is the
	// frame's `was`. The groups that carry a `condition` are the ones a story reads
	// and writes.
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`big small quick slow quiet loud brave lazy busy fierce gentle clever restless`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'hungry',
			words: words(`hungry starving peckish`)
		},
		{ subject: ['creature', 'person'], condition: 'full', words: words(`full satisfied`) },
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			words: words(`tired sleepy weary drowsy`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			words: words(`refreshed rested lively`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			words: words(`happy glad content pleased cheerful`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			words: words(`bored curious uneasy`)
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
	// Attributive, grouped by what they can sit in front of. Lowercase, because
	// a sentence writes them that way; the nickname pools are capitalized.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				brave lively gentle busy lazy shy clever young old small big quiet cheerful patient nimble curious
			`)
		},
		{ subject: ['person'], words: words(`young kind strict earnest weary friendly`) },
		{ subject: ['creature'], words: words(`swift fierce tame plump little`) },
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(`sweet spicy warm fresh crisp savory fragrant hot salty soft ripe tasty`)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(`sweet warm cold cool hot fragrant fresh strong`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(
				`old new small big light heavy shiny smooth clear sturdy pretty precious ancient`
			)
		},
		{ subject: ['vehicle'], words: words(`fast slow rattling`) },
		{
			subject: ['place'],
			words: words(`
				quiet wide dark bright strange old cozy secluded busy silent remote distant nearby empty lonely sunny
			`)
		},
		{
			subject: ['plant'],
			words: words(`green lush fragrant young withered tall small tender fresh`)
		},
		{ subject: ['idea'], words: words(`faint old new strange clear precious small odd vague`) },
		{ subject: ['event'], words: words(`long short quiet sunny cloudy noisy sudden lazy`) },
		{ subject: ['body'], words: words(`small cold warm slender sturdy tender`) },
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
			words: words(`beautiful mysterious strange new`)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				quietly slowly quickly gently suddenly softly alone briefly boldly carefully eagerly
				warily calmly neatly warmly firmly patiently lightly wearily cheerfully idly restlessly gladly
				keenly briskly happily
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(`
				quietly slowly gently suddenly softly again steadily still slightly faintly evenly gradually
				little_by_little
			`)
		}
	],
	times: {
		day: words(`
			at_dawn in_the_early_morning in_the_morning at_midday in_the_afternoon at_dusk in_the_evening
			at_night late_at_night at_midnight
		`),
		any: words(`in_spring in_summer in_autumn in_winter on_weekends on_holidays all_day`),
		past: words(`yesterday last_week long_ago once that_day the_night_before`),
		present: words(`today just_now tomorrow next_week`),
		habitual: words(`these_days sometimes every_day every_night`)
	},
	// `to the house` rather than `home`, which would want its preposition dropped.
	homes: words(`house cottage`),
	join: { word: 'and' },
	connectives: {
		additive: words(`and_then besides`),
		temporal: words(`meanwhile afterwards later soon at_last before_long`),
		contrastive: words(`but still however yet even_so then_again all_the_same even_then`),
		causal: words(`so therefore in_the_end`)
	},
	// What a noun can do that its theme does not say. A noun listed nowhere has no
	// trait, and takes any verb that asks for none.
	traits: {
		flier: words(`
		owl sparrow magpie swallow eagle falcon crane swan duck goose woodpecker parrot peacock butterfly
		moth bee dragonfly ladybug bat heron pelican raven kestrel puffin flamingo firefly osprey vulture
		condor stork ibis cormorant albatross petrel sandpiper plover lapwing starling finch warbler thrush
		cuckoo hoopoe kingfisher toucan macaw cockatoo canary nightingale cicada beetle
		dragon wyvern phoenix griffin harpy pegasus hippogriff roc simurgh thunderbird fairy pixie sprite
		sylph angel seraph valkyrie imp gargoyle drake peryton
		`),
		swimmer: words(`
		whale dolphin shark turtle seal penguin frog octopus squid seahorse starfish crab shrimp carp
		salmon mackerel walrus narwhal jellyfish tadpole
		siren mermaid kraken leviathan naiad undine selkie kelpie
		`),
		crawler: words(`
		turtle lizard chameleon snake snail ant spider crab earthworm centipede scorpion gecko iguana
		cobra python newt mantis
		basilisk wyrm naga amphisbaena lindworm
		`),
		// A word of a creature theme that is no creature: it takes no verb and no state.
		lifeless: words(`
			spell curse hex rune amulet talisman grimoire potion prophecy sorcery enchantment sigil glyph omen portent blessing
			incantation invocation summoning banishment divination scrying portal ley sanctum reliquary effigy idol totem phylactery
			charm warding runestone nightmare
		`),
		// What a verb asks of its object: `sips` takes a liquid and `chews` takes
		// none, `roasts` takes something raw.
		liquid: words(`
			porridge stew chowder curry bisque consomme goulash congee pho ramen udon soba pudding custard yogurt honey syrup
			lemonade salsa chutney relish marmalade hummus guacamole
		`),
		raw: words(`
			potato carrot cabbage spinach broccoli pumpkin garlic mushroom steak fillet drumstick brisket ribeye sirloin
			tenderloin sausage bacon meatball cutlet schnitzel kebab skewer tofu
		`)
	},
	interjections: words(`
		oh, ah, wow, well, look, goodness, my, indeed, honestly, gosh, hey, whoa, dear_me, good_grief,
		alas,
	`),
	pronouns: { m: words(`he`), f: words(`she`), n: words(`it`) },
	// An object named once is `it` the next time: `cooked the sausage and ate it`.
	objectPronouns: { words: { n: words(`it`) } },
	// A line of the hero's own opens on `I`, and `is` is `am` for it.
	speech: { subject: 'I', head: 'am' },
	// English cannot drop a subject, so a sentence about a person names it again —
	// unless that person has a name, which is the one thing that says whether `he`
	// or `she` is the right word.
	pronounless: ['person'],
	// No counters, and so no counted shape: English would need a plural, and a
	// plural of `sadness` or `bacon` is not a thing anyone writes. Money is
	// countable whatever the pools hold, so the amount is all this declares.
	numeral: {
		order: 'before',
		counters: {},
		count: [2, 12],
		currency: 'dollars',
		amounts: [100, 500, 1000, 5000, 12000, 25000, 50000, 100000],
		group: ',',
		gap: ' '
	},
	// English names its months and writes the copula as a word of its own.
	calendar: {
		date: 'MMMM D, Y',
		months: words(`
			January February March April May June July August September October November December
		`),
		clock: 'h:mm',
		years: [2020, 2030],
		copula: {
			// An event is a thing that happens on a day, and a lion is not.
			subject: ['event'],
			words: words(`is`),
			past: { words: words(`was`) }
		}
	},
	// English puts its verb second, and the sentence grows to the right of it.
	// Every `is` and `does` in a head has its past beside it, because those are the
	// words that carry the tense once the verb has fallen back to its base form.
	frames: [
		// A date and a clock, standing where an adverbial stands.
		{
			parts: [
				{ slot: 'date', head: 'on', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'clock', head: 'at', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		// And the shape that equates the subject to one: `The match is at 11:40.`
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'date', head: 'on', copula: 'head' }
			],
			weight: 4
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'clock', head: 'at', copula: 'head' }
			],
			weight: 4
		},
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
		// Where the subject is going: `goes to the market`, `returns to the house`.
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'to', modifiable: true }
			],
			weight: 10,
			fields: ['go', 'arrive']
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'to', modifiable: true }
			],
			weight: 5,
			fields: ['go', 'arrive']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'to', modifiable: true },
				{ slot: 'manner' }
			],
			weight: 4,
			fields: ['go', 'arrive']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: 'is', pastHead: 'was' }
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
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 4
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'manner' },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true },
				{ slot: 'place', head: 'in', modifiable: true }
			],
			weight: 3
		},
		// English asks with do-support, so the auxiliary stands in front of the
		// subject and the verb falls back to its base form — `Does the lion run?`
		// rather than `Runs the lion?`. `is` moves the same way, and in the past
		// both auxiliaries carry the tense: `Did the lion run?`, `Was the lion big?`
		{
			parts: [
				{ slot: 'subject', head: 'does', pastHead: 'did', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 20,
			mood: 'question'
		},
		{
			parts: [
				{ slot: 'subject', head: 'does', pastHead: 'did', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 16,
			mood: 'question'
		},
		{
			parts: [
				{ slot: 'subject', head: 'is', pastHead: 'was', modifiable: true },
				{ slot: 'state' }
			],
			weight: 14,
			mood: 'question'
		},
		{
			parts: [
				{ slot: 'subject', head: 'does', pastHead: 'did', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'place', head: 'in', modifiable: true }
			],
			weight: 12,
			mood: 'question'
		},
		{
			parts: [
				{ slot: 'subject', head: 'does', pastHead: 'did', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'manner' }
			],
			weight: 10,
			mood: 'question'
		},
		{
			parts: [
				{ slot: 'subject', head: 'does', pastHead: 'did', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'to', modifiable: true }
			],
			weight: 6,
			mood: 'question',
			fields: ['go', 'arrive']
		},
		// Money and nothing else: a counted phrase would need a plural noun, and
		// most of these pools are not countable at all.
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'money' }],
			weight: 6
		}
	]
};
