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
			...tensed(
				`wakes gets_up rises awakens sits_up rouses wakes_up`,
				`wake get_up rise awaken sit_up rouse wake_up`,
				`woke got_up rose awakened sat_up roused woke_up`
			)
		},
		// Setting off: the verbs that need somewhere to go, and the ones that stand
		// on their own. `heads` wants a `to the market` after it; `leaves` does not.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`goes heads hurries wanders travels sets_out journeys drifts proceeds ventures rushes`,
				`go head hurry wander travel set_out journey drift proceed venture rush`,
				`went headed hurried wandered traveled set_out journeyed drifted proceeded ventured rushed`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			// Running somewhere is for legs: a fish and a snake go, and do not run.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(
				`runs walks climbs strolls trots dashes marches sprints jogs hikes tiptoes hops`,
				`run walk climb stroll trot dash march sprint jog hike tiptoe hop`,
				`ran walked climbed strolled trotted dashed marched sprinted jogged hiked tiptoed hopped`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...tensed(
				`leaves sets_off departs heads_out steps_out goes_out slips_away slips_out wanders_off strides_off sneaks_out hurries_off moves_on`,
				`leave set_off depart head_out step_out go_out slip_away slip_out wander_off stride_off sneak_out hurry_off move_on`,
				`left set_off departed headed_out stepped_out went_out slipped_away slipped_out wandered_off strode_off sneaked_out hurried_off moved_on`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`returns comes_back gets_back heads_back comes gets makes_it goes_back turns_back drifts_back hurries_back comes_over`,
				`return come_back get_back head_back come get make_it go_back turn_back drift_back hurry_back come_over`,
				`returned came_back got_back headed_back came got made_it went_back turned_back drifted_back hurried_back came_over`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...tensed(
				`arrives comes_home returns gets_home turns_up shows_up gets_in reappears comes_in settles_in heads_home makes_it_home`,
				`arrive come_home return get_home turn_up show_up get_in reappear come_in settle_in head_home make_it_home`,
				`arrived came_home returned got_home turned_up showed_up got_in reappeared came_in settled_in headed_home made_it_home`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(
				`runs walks leaps strolls roams paces jogs trots marches hops sprints dashes stomps tiptoes ambles wanders_about scampers scurries prances struts limps saunters strides plods trudges`,
				`run walk leap stroll roam pace jog trot march hop sprint dash stomp tiptoe amble wander_about scamper scurry prance strut limp saunter stride plod trudge`,
				`ran walked leapt strolled roamed paced jogged trotted marched hopped sprinted dashed stomped tiptoed ambled wandered_about scampered scurried pranced strutted limped sauntered strode plodded trudged`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			...tensed(
				`wanders passes moves drifts turns circles slips_by moves_along darts glides twists`,
				`wander pass move drift turn circle slip_by move_along dart glide twist`,
				`wandered passed moved drifted turned circled slipped_by moved_along darted glided twisted`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			...tensed(
				`swims paddles dives splashes floats surfaces swims_about swims_by`,
				`swim paddle dive splash float surface swim_about swim_by`,
				`swam paddled dove splashed floated surfaced swam_about swam_by`
			)
		},
		{
			field: 'move',
			// Flying is a flier's alone: a sparrow's, a dragon's, never a fish's.
			subject: ['creature'],
			subjectTraits: ['flier'],
			...tensed(
				`flies soars flutters flaps takes_off glides swoops hovers circles_overhead lands alights flits flies_off flies_by perches`,
				`fly soar flutter flap take_off glide swoop hover circle_overhead land alight flit fly_off fly_by perch`,
				`flew soared fluttered flapped took_off glided swooped hovered circled_overhead landed alighted flitted flew_off flew_by perched`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			...tensed(
				`crawls creeps wriggles inches_along crawls_about squirms coils burrows slithers`,
				`crawl creep wriggle inch_along crawl_about squirm coil burrow slither`,
				`crawled crept wriggled inched_along crawled_about squirmed coiled burrowed slithered`
			)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...tensed(
				`waits hides lingers looks_around hesitates pauses stops listens waits_around holds_back hangs_back stands_still keeps_still idles loiters halts peeks_out glances_around stands_by dawdles`,
				`wait hide linger look_around hesitate pause stop listen wait_around hold_back hang_back stand_still keep_still idle loiter halt peek_out glance_around stand_by dawdle`,
				`waited hid lingered looked_around hesitated paused stopped listened waited_around held_back hung_back stood_still kept_still idled loitered halted peeked_out glanced_around stood_by dawdled`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...tensed(
				`rests sits lies_down leans curls_up stretches_out settles_down reclines sprawls lounges relaxes sits_down sits_back lies_back kneels crouches squats perches slumps unwinds takes_a_break`,
				`rest sit lie_down lean curl_up stretch_out settle_down recline sprawl lounge relax sit_down sit_back lie_back kneel crouch squat perch slump unwind take_a_break`,
				`rested sat lay_down leaned curled_up stretched_out settled_down reclined sprawled lounged relaxed sat_down sat_back lay_back knelt crouched squatted perched slumped unwound took_a_break`
			)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...tensed(
				`sleeps dozes falls_asleep nods_off naps snoozes drifts_off dozes_off slumbers drowses sleeps_in drops_off nods drifts_to_sleep snores`,
				`sleep doze fall_asleep nod_off nap snooze drift_off doze_off slumber drowse sleep_in drop_off nod drift_to_sleep snore`,
				`slept dozed fell_asleep nodded_off napped snoozed drifted_off dozed_off slumbered drowsed slept_in dropped_off nodded drifted_to_sleep snored`
			)
		},
		// What somebody shows, split by what it shows: a story draws the group that
		// matches what is true of its hero, so the hero laughs after the meal and
		// sighs after losing the key. The last group shows nothing in particular.
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'content',
			...tensed(
				`laughs smiles hums giggles chuckles grins whistles cheers beams claps nods winks chortles brightens`,
				`laugh smile hum giggle chuckle grin whistle cheer beam clap nod wink chortle brighten`,
				`laughed smiled hummed giggled chuckled grinned whistled cheered beamed clapped nodded winked chortled brightened`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'restless',
			...tensed(
				`cries sighs mutters sobs weeps groans grumbles whimpers snorts frowns sniffles fidgets paces grimaces scowls pouts fumes sulks`,
				`cry sigh mutter sob weep groan grumble whimper snort frown sniffle fidget pace grimace scowl pout fume sulk`,
				`cried sighed muttered sobbed wept groaned grumbled whimpered snorted frowned sniffled fidgeted paced grimaced scowled pouted fumed sulked`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'tired',
			...tensed(
				`yawns stretches blinks slumps droops sags`,
				`yawn stretch blink slump droop sag`,
				`yawned stretched blinked slumped drooped sagged`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'hungry',
			...tensed(
				`drools salivates sniffs_the_air swallows_hard gulps`,
				`drool salivate sniff_the_air swallow_hard gulp`,
				`drooled salivated sniffed_the_air swallowed_hard gulped`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...tensed(
				`shouts gasps shrugs blushes squints flinches exclaims looks_up looks_round`,
				`shout gasp shrug blush squint flinch exclaim look_up look_round`,
				`shouted gasped shrugged blushed squinted flinched exclaimed looked_up looked_round`
			)
		},
		{
			field: 'talk',
			subject: ['creature', 'person'],
			...tensed(
				`chats talks chatters speaks converses gossips babbles jabbers natters prattles whispers murmurs rambles chats_away talks_on`,
				`chat talk chatter speak converse gossip babble jabber natter prattle whisper murmur ramble chat_away talk_on`,
				`chatted talked chattered spoke conversed gossiped babbled jabbered nattered prattled whispered murmured rambled chatted_away talked_on`
			)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...tensed(
				`dances sings tumbles frolics plays bounces skips romps skips_about capers gambols hops_about leaps_about rolls_about twirls spins cavorts jumps_around plays_about fools_around larks_about horses_around`,
				`dance sing tumble frolic play bounce skip romp skip_about caper gambol hop_about leap_about roll_about twirl spin cavort jump_around play_about fool_around lark_about horse_around`,
				`danced sang tumbled frolicked played bounced skipped romped skipped_about capered gamboled hopped_about leapt_about rolled_about twirled spun cavorted jumped_around played_about fooled_around larked_about horsed_around`
			)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			...tensed(
				`remembers forgets imagines counts recalls misses wonders_about considers ponders recollects pictures dreams_of dreams_about thinks_of thinks_about believes_in longs_for yearns_for worries_about muses_on reflects_on dwells_on contemplates fancies envisions`,
				`remember forget imagine count recall miss wonder_about consider ponder recollect picture dream_of dream_about think_of think_about believe_in long_for yearn_for worry_about muse_on reflect_on dwell_on contemplate fancy envision`,
				`remembered forgot imagined counted recalled missed wondered_about considered pondered recollected pictured dreamed_of dreamed_about thought_of thought_about believed_in longed_for yearned_for worried_about mused_on reflected_on dwelt_on contemplated fancied envisioned`
			)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`watches looks_at studies examines admires touches strokes eyes inspects gazes_at stares_at peers_at glances_at scans surveys checks pokes prods pats sniffs handles feels fingers turns_over looks_over sizes_up observes regards`,
				`watch look_at study examine admire touch stroke eye inspect gaze_at stare_at peer_at glance_at scan survey check poke prod pat sniff handle feel finger turn_over look_over size_up observe regard`,
				`watched looked_at studied examined admired touched stroked eyed inspected gazed_at stared_at peered_at glanced_at scanned surveyed checked poked prodded patted sniffed handled felt fingered turned_over looked_over sized_up observed regarded`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...tensed(
				`searches looks_around rummages hunts_around scours forages digs_around pokes_around noses_around casts_about roots_around ferrets_about explores prowls scouts_around looks_about hunts`,
				`search look_around rummage hunt_around scour forage dig_around poke_around nose_around cast_about root_around ferret_about explore prowl scout_around look_about hunt`,
				`searched looked_around rummaged hunted_around scoured foraged dug_around poked_around nosed_around cast_about rooted_around ferreted_about explored prowled scouted_around looked_about hunted`
			)
		},
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`finds discovers spots picks_up comes_across uncovers unearths locates stumbles_on stumbles_upon happens_upon retrieves recovers digs_up fishes_out turns_up scoops_up snatches_up`,
				`find discover spot pick_up come_across uncover unearth locate stumble_on stumble_upon happen_upon retrieve recover dig_up fish_out turn_up scoop_up snatch_up`,
				`found discovered spotted picked_up came_across uncovered unearthed located stumbled_on stumbled_upon happened_upon retrieved recovered dug_up fished_out turned_up scooped_up snatched_up`
			)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`takes picks grabs gathers chooses gets seizes snatches clutches grips holds lifts collects selects picks_out gathers_up takes_up takes_hold_of accepts receives obtains acquires claims pockets bags hoists`,
				`take pick grab gather choose get seize snatch clutch grip hold lift collect select pick_out gather_up take_up take_hold_of accept receive obtain acquire claim pocket bag hoist`,
				`took picked grabbed gathered chose got seized snatched clutched gripped held lifted collected selected picked_out gathered_up took_up took_hold_of accepted received obtained acquired claimed pocketed bagged hoisted`
			)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`carries brings hauls lugs totes drags tows shoulders bears transports fetches ferries hauls_along carries_off carries_along brings_along takes_along drags_along`,
				`carry bring haul lug tote drag tow shoulder bear transport fetch ferry haul_along carry_off carry_along bring_along take_along drag_along`,
				`carried brought hauled lugged toted dragged towed shouldered bore transported fetched ferried hauled_along carried_off carried_along brought_along took_along dragged_along`
			)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`hides tucks_away stores puts_away keeps buries stashes conceals stows squirrels_away hoards locks_away packs_away sets_aside puts_aside tucks_in covers_up wraps_up stores_away hides_away salts_away keeps_back saves`,
				`hide tuck_away store put_away keep bury stash conceal stow squirrel_away hoard lock_away pack_away set_aside put_aside tuck_in cover_up wrap_up store_away hide_away salt_away keep_back save`,
				`hid tucked_away stored put_away kept buried stashed concealed stowed squirreled_away hoarded locked_away packed_away set_aside put_aside tucked_in covered_up wrapped_up stored_away hid_away salted_away kept_back saved`
			)
		},
		{
			field: 'lose',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`loses drops misplaces mislays leaves_behind forgets lets_slip lets_fall fumbles lets_go_of loses_track_of`,
				`lose drop misplace mislay leave_behind forget let_slip let_fall fumble let_go_of lose_track_of`,
				`lost dropped misplaced mislaid left_behind forgot let_slip let_fall fumbled let_go_of lost_track_of`
			)
		},
		{
			field: 'meet',
			subject: ['creature', 'person'],
			object: ['person'],
			...tensed(
				`meets runs_into greets bumps_into encounters comes_upon catches_up_with joins welcomes visits calls_on drops_in_on sees waves_to nods_to hugs`,
				`meet run_into greet bump_into encounter come_upon catch_up_with join welcome visit call_on drop_in_on see wave_to nod_to hug`,
				`met ran_into greeted bumped_into encountered came_upon caught_up_with joined welcomed visited called_on dropped_in_on saw waved_to nodded_to hugged`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`makes builds crafts carves paints weaves shapes assembles fashions designs constructs puts_together pieces_together draws sketches invents devises creates produces finishes`,
				`make build craft carve paint weave shape assemble fashion design construct put_together piece_together draw sketch invent devise create produce finish`,
				`made built crafted carved painted wove shaped assembled fashioned designed constructed put_together pieced_together drew sketched invented devised created produced finished`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			// Forged, cast and welded: metal and wood, never a coat or a jewel.
			objectThemes: ['object', 'tool', 'vehicle'],
			...tensed(
				`forges casts hammers_out welds rivets bolts_together`,
				`forge cast hammer_out weld rivet bolt_together`,
				`forged cast hammered_out welded riveted bolted_together`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing'],
			// Knitted and sewn: what is worn.
			objectThemes: ['clothing'],
			...tensed(
				`knits sews stitches tailors embroiders hems darns`,
				`knit sew stitch tailor embroider hem darn`,
				`knitted sewed stitched tailored embroidered hemmed darned`
			)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`mends cleans polishes fixes tidies oils repairs scrubs wipes dusts adjusts tightens patches restores brushes rinses washes sorts_out looks_after cares_for maintains buffs shines`,
				`mend clean polish fix tidy oil repair scrub wipe dust adjust tighten patch restore brush rinse wash sort_out look_after care_for maintain buff shine`,
				`mended cleaned polished fixed tidied oiled repaired scrubbed wiped dusted adjusted tightened patched restored brushed rinsed washed sorted_out looked_after cared_for maintained buffed shined`
			)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`sells hands_over trades_away offers peddles hawks auctions trades sells_off parts_with passes_on hands_on lets_go_of markets unloads exchanges bargains_away`,
				`sell hand_over trade_away offer peddle hawk auction trade sell_off part_with pass_on hand_on let_go_of market unload exchange bargain_away`,
				`sold handed_over traded_away offered peddled hawked auctioned traded sold_off parted_with passed_on handed_on let_go_of marketed unloaded exchanged bargained_away`
			)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			...tensed(
				`buys purchases picks_up orders acquires pays_for gets shops_for splurges_on snaps_up bargains_for haggles_over stocks_up_on picks_out invests_in`,
				`buy purchase pick_up order acquire pay_for get shop_for splurge_on snap_up bargain_for haggle_over stock_up_on pick_out invest_in`,
				`bought purchased picked_up ordered acquired paid_for got shopped_for splurged_on snapped_up bargained_for haggled_over stocked_up_on picked_out invested_in`
			)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`warms cooks serves prepares heats reheats seasons plates fixes_up dishes_up whips_up rustles_up makes cooks_up garnishes salts peppers spices sweetens`,
				`warm cook serve prepare heat reheat season plate fix_up dish_up whip_up rustle_up make cook_up garnish salt pepper spice sweeten`,
				`warmed cooked served prepared heated reheated seasoned plated fixed_up dished_up whipped_up rustled_up made cooked_up garnished salted peppered spiced sweetened`
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
				`bakes roasts grills fries slices chops peels dices minces grates shreds sears browns steams broils barbecues marinates skewers`,
				`bake roast grill fry slice chop peel dice mince grate shred sear brown steam broil barbecue marinate skewer`,
				`baked roasted grilled fried sliced chopped peeled diced minced grated shredded seared browned steamed broiled barbecued marinated skewered`
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
				`stirs simmers boils ladles stews pours spoons_out whisks blends thickens reduces heats_up warms_up dishes_out`,
				`stir simmer boil ladle stew pour spoon_out whisk blend thicken reduce heat_up warm_up dish_out`,
				`stirred simmered boiled ladled stewed poured spooned_out whisked blended thickened reduced heated_up warmed_up dished_out`
			)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`eats tastes swallows devours finishes gobbles wolfs_down scoffs polishes_off bolts tucks_into samples savors digs_into feasts_on snacks_on picks_at gulps_down downs`,
				`eat taste swallow devour finish gobble wolf_down scoff polish_off bolt tuck_into sample savor dig_into feast_on snack_on pick_at gulp_down down`,
				`ate tasted swallowed devoured finished gobbled wolfed_down scoffed polished_off bolted tucked_into sampled savored dug_into feasted_on snacked_on picked_at gulped_down downed`
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
				`chews bites nibbles crunches munches gnaws crunches_on chomps chews_on bites_into tears_into licks nibbles_at`,
				`chew bite nibble crunch munch gnaw crunch_on chomp chew_on bite_into tear_into lick nibble_at`,
				`chewed bit nibbled crunched munched gnawed crunched_on chomped chewed_on bit_into tore_into licked nibbled_at`
			)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			objectTraits: ['liquid'],
			...tensed(
				`sips slurps spoons spoons_up laps_up sups sucks_up scoops_up`,
				`sip slurp spoon spoon_up lap_up sup suck_up scoop_up`,
				`sipped slurped spooned spooned_up lapped_up supped sucked_up scooped_up`
			)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			...tensed(
				`drinks sips gulps savors swigs downs quaffs slurps laps_up drains gulps_down sips_at nurses tastes swallows knocks_back polishes_off`,
				`drink sip gulp savor swig down quaff slurp lap_up drain gulp_down sip_at nurse taste swallow knock_back polish_off`,
				`drank sipped gulped savored swigged downed quaffed slurped lapped_up drained gulped_down sipped_at nursed tasted swallowed knocked_back polished_off`
			)
		},
		// What a place does on its own is what a story's scene is made of, and what
		// an event does is another list.
		{
			field: 'change',
			subject: ['place'],
			...tensed(
				`quiets darkens brightens empties fills_up glows stirs wakes falls_silent falls_still hushes settles comes_alive livens_up bustles hums buzzes sleeps dims lights_up shimmers glistens freezes_over thaws warms cools floods drains fades sparkles crowds_up empties_out`,
				`quiet darken brighten empty fill_up glow stir wake fall_silent fall_still hush settle come_alive liven_up bustle hum buzz sleep dim light_up shimmer glisten freeze_over thaw warm cool flood drain fade sparkle crowd_up empty_out`,
				`quieted darkened brightened emptied filled_up glowed stirred woke fell_silent fell_still hushed settled came_alive livened_up bustled hummed buzzed slept dimmed lit_up shimmered glistened froze_over thawed warmed cooled flooded drained faded sparkled crowded_up emptied_out`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...tensed(
				`glows flows fades deepens begins ends passes lingers unfolds draws_on wears_on drags_on goes_on carries_on winds_down dies_down builds gathers approaches nears`,
				`glow flow fade deepen begin end pass linger unfold draw_on wear_on drag_on go_on carry_on wind_down die_down build gather approach near`,
				`glowed flowed faded deepened began ended passed lingered unfolded drew_on wore_on dragged_on went_on carried_on wound_down died_down built gathered approached neared`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a time of day or a season does: it breaks, wears away, draws in.
			subjectThemes: ['time'],
			...tensed(
				`dawns breaks wanes wears_away slips_by creeps_on turns settles_in draws_in draws_to_a_close`,
				`dawn break wane wear_away slip_by creep_on turn settle_in draw_in draw_to_a_close`,
				`dawned broke waned wore_away slipped_by crept_on turned settled_in drew_in drew_to_a_close`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What weather does: it rolls in, sets in, lets up.
			subjectThemes: ['weather'],
			...tensed(
				`rolls_in sets_in blows_over clears lets_up eases picks_up sweeps_through moves_in`,
				`roll_in set_in blow_over clear let_up ease pick_up sweep_through move_in`,
				`rolled_in set_in blew_over cleared let_up eased picked_up swept_through moved_in`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a match does: it kicks off, heats up, wraps up.
			subjectThemes: ['sport'],
			...tensed(
				`kicks_off starts gets_underway heats_up wraps_up goes_ahead resumes runs_late overruns`,
				`kick_off start get_underway heat_up wrap_up go_ahead resume run_late overrun`,
				`kicked_off started got_underway heated_up wrapped_up went_ahead resumed ran_late overran`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What a thing one can hold does. A song is a thing of another kind, below.
			subjectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...tensed(
				`sways glitters falls rolls tilts ages creaks shines gleams wobbles teeters topples tumbles slips slides drops spins turns settles shifts fades wears dulls`,
				`sway glitter fall roll tilt age creak shine gleam wobble teeter topple tumble slip slide drop spin turn settle shift fade wear dull`,
				`swayed glittered fell rolled tilted aged creaked shone gleamed wobbled teetered toppled tumbled slipped slid dropped spun turned settled shifted faded wore dulled`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What only something made of metal and wood does: a jewel never rusts.
			subjectThemes: ['object', 'tool', 'vehicle'],
			...tensed(
				`rattles clatters rusts cracks breaks snaps jams sticks squeaks clanks`,
				`rattle clatter rust crack break snap jam stick squeak clank`,
				`rattled clattered rusted cracked broke snapped jammed stuck squeaked clanked`
			)
		},
		{
			field: 'change',
			subject: ['thing'],
			// What a song or a drum does: it plays, rings out, dies away.
			subjectThemes: ['music'],
			...tensed(
				`plays rings_out drifts swells fades_out echoes carries floats sounds resounds lingers dies_away builds stops`,
				`play ring_out drift swell fade_out echo carry float sound resound linger die_away build stop`,
				`played rang_out drifted swelled faded_out echoed carried floated sounded resounded lingered died_away built stopped`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...tensed(
				`runs stops passes returns departs slides rolls glides speeds rumbles rattles_along trundles cruises drives_by pulls_in pulls_out pulls_up sets_off arrives turns swerves brakes idles crawls_along zooms roars_past coasts drifts`,
				`run stop pass return depart slide roll glide speed rumble rattle_along trundle cruise drive_by pull_in pull_out pull_up set_off arrive turn swerve brake idle crawl_along zoom roar_past coast drift`,
				`ran stopped passed returned departed slid rolled glided sped rumbled rattled_along trundled cruised drove_by pulled_in pulled_out pulled_up set_off arrived turned swerved braked idled crawled_along zoomed roared_past coasted drifted`
			)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...tensed(
				`spreads vanishes remains lingers returns gathers grows fades deepens surfaces stirs settles passes builds swells recedes drifts_back comes_back creeps_in seeps_in takes_hold wears_off dies_away ebbs flickers rises falls shifts`,
				`spread vanish remain linger return gather grow fade deepen surface stir settle pass build swell recede drift_back come_back creep_in seep_in take_hold wear_off die_away ebb flicker rise fall shift`,
				`spread vanished remained lingered returned gathered grew faded deepened surfaced stirred settled passed built swelled receded drifted_back came_back crept_in seeped_in took_hold wore_off died_away ebbed flickered rose fell shifted`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			...tensed(
				`grows wilts blooms sways spreads sprouts buds flowers blossoms unfurls stretches climbs droops withers fades thrives flourishes rustles bends leans shoots_up springs_up takes_root bears_fruit sheds greens turns_gold reaches_up`,
				`grow wilt bloom sway spread sprout bud flower blossom unfurl stretch climb droop wither fade thrive flourish rustle bend lean shoot_up spring_up take_root bear_fruit shed green turn_gold reach_up`,
				`grew wilted bloomed swayed spread sprouted budded flowered blossomed unfurled stretched climbed drooped withered faded thrived flourished rustled bent leaned shot_up sprang_up took_root bore_fruit shed greened turned_gold reached_up`
			)
		},
		{
			field: 'change',
			subject: ['body'],
			...tensed(
				`trembles moves stiffens aches heals twitches shivers tingles throbs quivers relaxes loosens tenses tightens warms cools numbs goes_numb swells shakes flexes stretches rests tires wakes settles jerks flinches sags droops`,
				`tremble move stiffen ache heal twitch shiver tingle throb quiver relax loosen tense tighten warm cool numb go_numb swell shake flex stretch rest tire wake settle jerk flinch sag droop`,
				`trembled moved stiffened ached healed twitched shivered tingled throbbed quivered relaxed loosened tensed tightened warmed cooled numbed went_numb swelled shook flexed stretched rested tired woke settled jerked flinched sagged drooped`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			...tensed(
				`ripens cools boils melts spoils remains warms steams cools_down goes_cold turns goes_off runs_out sits waits smells_good`,
				`ripen cool boil melt spoil remain warm steam cool_down go_cold turn go_off run_out sit wait smell_good`,
				`ripened cooled boiled melted spoiled remained warmed steamed cooled_down went_cold turned went_off ran_out sat waited smelled_good`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a dish does and a drink does not: it sizzles, crumbles, goes stale.
			subjectThemes: ['food'],
			...tensed(
				`sizzles crumbles goes_stale dries_out hardens softens browns burns bakes toasts rises`,
				`sizzle crumble go_stale dry_out harden soften brown burn bake toast rise`,
				`sizzled crumbled went_stale dried_out hardened softened browned burned baked toasted rose`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a drink does and a dish does not: it fizzes, spills, goes flat.
			subjectThemes: ['drink'],
			...tensed(
				`bubbles fizzes foams froths spills sloshes swirls settles goes_flat overflows`,
				`bubble fizz foam froth spill slosh swirl settle go_flat overflow`,
				`bubbled fizzed foamed frothed spilled sloshed swirled settled went_flat overflowed`
			)
		}
	],
	// The adjective alone: the copula is the frame's `is`, and its past is the
	// frame's `was`. The groups that carry a `condition` are the ones a story reads
	// and writes.
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`
				big small quick slow quiet loud brave lazy busy fierce gentle clever restless
				young old strong weak bold timid shy proud cheerful patient stubborn nimble watchful sturdy
			`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'hungry',
			words: words(`hungry starving peckish ravenous famished`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'full',
			words: words(`full satisfied stuffed sated`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			words: words(`tired sleepy weary drowsy exhausted footsore sluggish`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			words: words(`refreshed rested lively alert energetic`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			words: words(`happy glad content pleased cheerful cheery joyful merry delighted`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			words: words(`bored curious uneasy impatient anxious fidgety unsettled`)
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
				`beautiful strange new common rare lovely familiar odd ordinary remarkable splendid`
			)
		},
		{
			subject: ['place', 'event'],
			words: words(`
				wide narrow calm deep dark bright distant steep
				quiet noisy crowded empty vast shallow gloomy sunny lively dull long short
			`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`
				hard light heavy old smooth clear sturdy hollow
				new small large round flat sharp blunt fragile shiny worn rusty plain ornate
			`)
		},
		{
			subject: ['edible'],
			words: words(`
				sweet salty spicy sour hot cold nutty mild
				bitter rich creamy crisp tender juicy fresh stale bland tangy smoky
			`)
		},
		{
			subject: ['idea'],
			words: words(`
				simple obvious vague endless fleeting stubborn
				clear complex familiar precious secret timeless useful difficult easy
			`)
		},
		{
			subject: ['plant'],
			words: words(`green lush fragrant withered tall leafy thorny tender wild pale bare`)
		},
		{
			subject: ['body'],
			words: words(`warm cold sore stiff steady strong weak numb tender rough smooth heavy`)
		}
	],
	// Attributive, grouped by what they can sit in front of. Lowercase, because
	// a sentence writes them that way; the nickname pools are capitalized.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				brave lively gentle busy lazy shy clever young old small big quiet cheerful patient nimble curious
				bold timid restless weary stout slender lean wiry graceful clumsy sleepy cunning watchful eager
				solemn merry gruff stubborn playful quick silent proud
			`)
		},
		{
			subject: ['person'],
			words: words(`
				young kind strict earnest weary friendly
				wise humble stern polite learned skilled ragged wealthy honest shrewd hearty solitary
				weathered thoughtful generous
			`)
		},
		{
			subject: ['creature'],
			words: words(`
				swift fierce tame plump little
				shaggy sleek spotted striped scrawny bristly wary tiny hulking glossy speckled
			`)
		},
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(`
				sweet spicy warm fresh crisp savory fragrant hot salty soft ripe tasty
				buttery smoky tangy creamy crunchy tender juicy hearty golden steaming toasted rich sticky
				flaky peppery bland
			`)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(`
				sweet warm cold cool hot fragrant fresh strong
				bitter creamy frothy icy milky cloudy clear sparkling weak spiced tepid
			`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`
				old new small big light heavy shiny smooth clear sturdy pretty precious ancient
				battered worn rusty polished plain ornate narrow wide round flat sharp blunt fragile hollow
				dusty crooked
			`)
		},
		{
			subject: ['vehicle'],
			words: words(`fast slow rattling creaking gleaming rusted humming lumbering sleek swaying`)
		},
		{
			subject: ['place'],
			words: words(`
				quiet wide dark bright strange old cozy secluded busy silent remote distant nearby empty lonely sunny
				narrow crowded windy misty shady leafy dusty muddy rocky steep grand bustling deserted damp airy
			`)
		},
		{
			subject: ['plant'],
			words: words(`
				green lush fragrant young withered tall small tender fresh
				thorny leafy blooming budding creeping wild slender pale drooping climbing
			`)
		},
		{
			subject: ['idea'],
			words: words(`
				faint old new strange clear precious small odd vague
				dim simple tangled stubborn fleeting distant bold secret quiet
			`)
		},
		{
			subject: ['event'],
			words: words(`
				long short quiet sunny cloudy noisy sudden lazy
				brief lively solemn merry grand dull rainy stormy calm busy crowded splendid
			`)
		},
		{
			subject: ['body'],
			words: words(`
				small cold warm slender sturdy tender
				steady weary stiff sore rough smooth pale thin strong
			`)
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
			words: words(`beautiful mysterious strange new lovely familiar odd ordinary splendid humble`)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				quietly slowly quickly gently suddenly softly alone briefly boldly carefully eagerly
				warily calmly warmly firmly patiently lightly wearily cheerfully idly restlessly gladly
				keenly happily swiftly silently proudly bravely shyly clumsily awkwardly gracefully stubbornly
				hastily hurriedly abruptly promptly deliberately absently anxiously nervously curiously merrily
				solemnly sleepily drowsily carelessly recklessly cautiously roughly cheerily earnestly
				lazily wildly meekly tirelessly
				at_once straight_away for_a_while once_more in_silence without_a_word in_a_hurry
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(`
				quietly slowly gently suddenly softly again steadily still slightly faintly evenly gradually
				little_by_little
				silently smoothly quickly briefly barely deeply widely brightly dimly warmly coldly sweetly
				richly thickly loosely firmly heavily lightly endlessly ceaselessly constantly
				once_more for_a_while all_at_once bit_by_bit in_silence without_a_sound ever_so_slightly
				here_and_there
			`)
		}
	],
	times: {
		day: words(`
			at_dawn in_the_early_morning in_the_morning at_midday in_the_afternoon at_dusk in_the_evening
			at_night late_at_night at_midnight
		`),
		any: words(`
			in_spring in_summer in_autumn in_winter on_weekends on_holidays all_day
			in_early_spring in_late_spring in_early_summer in_midsummer in_late_summer in_early_autumn
			in_late_autumn in_midwinter in_late_winter at_harvest in_the_rainy_season on_a_clear_day
			on_a_cloudy_day on_a_rainy_day on_a_snowy_day on_a_windy_day on_a_foggy_day on_a_market_day
			at_the_festival during_the_holidays at_the_full_moon
		`),
		past: words(`
			yesterday last_week long_ago once that_day the_night_before
			the_day_before_yesterday last_month last_year last_spring last_summer last_autumn last_winter
			years_ago a_while_ago moments_ago that_morning that_evening back_then in_those_days
			the_week_before the_year_before not_long_ago
		`),
		present: words(`
			today just_now tomorrow next_week
			right_now this_morning this_evening tonight the_day_after_tomorrow next_month next_year
			this_year this_week this_weekend in_a_moment shortly
		`),
		habitual: words(`
			these_days sometimes every_day every_night
			always often usually rarely seldom now_and_then from_time_to_time once_in_a_while
			every_morning every_evening every_week every_year on_most_days as_a_rule
		`)
	},
	// `to the house` rather than `home`, which would want its preposition dropped.
	homes: words(`house cottage`),
	join: { word: 'and' },
	connectives: {
		additive: words(`and_then besides also moreover furthermore in_addition`),
		temporal: words(`
			meanwhile afterwards later soon at_last before_long
			then presently by_then in_time after_a_while shortly_after moments_later
		`),
		contrastive: words(`
			but still however yet even_so then_again all_the_same even_then
			nevertheless nonetheless instead on_the_other_hand
		`),
		causal: words(`so therefore in_the_end thus hence as_a_result for_that_reason consequently`)
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
		`),
		// A word of the place class that is no place: nothing happens in a wave or on a comet.
		placeless: words(`
			wave tide boulder pebble ember cinder earthquake echo avalanche driftwood fumarole stalactite stalagmite geyser
			star comet meteor corona zenith eclipse satellite orbit gravity sunspot lightyear stardust supernova quasar pulsar
			moonrise solarflare perihelion aphelion apogee perigee nadir azimuth parallax redshift starlore cosmology astronomy
			telescopy gravitas lunation sidereal ecliptic meridian solarsail starburst skyline
		`)
	},
	interjections: words(`
		oh, ah, wow, well, look, goodness, my, indeed, honestly, gosh, hey, whoa, dear_me, good_grief,
		alas, oho, aha, hush, listen, why, heavens, mercy, bless_me, of_course, no_wonder, oh_dear,
		good_heavens, my_word, at_last,
	`),
	pronouns: { m: words(`he`), f: words(`she`), n: words(`it`) },
	// An object named once is `it` the next time: `cooked the sausage and ate it`.
	objectPronouns: { words: { n: words(`it`) } },
	// A line of the hero's own opens on `I`, and `is` is `am` for it.
	speech: { subject: 'I', head: 'am' },
	// What somebody answers with. English has no levels, so one pool serves all.
	replies: {
		casual: {
			agree: words(`
				right true I_know so_it_is same_here indeed that's_right you're_right it_is quite_so no_doubt I_thought_so
			`),
			cheer: words(`
				well_done! good_for_you! great! lucky_you nice_one wonderful! congratulations well_earned brilliant! splendid! at_last!
			`),
			care: words(`
				are_you_all_right? take_a_rest don't_overdo_it let's_get_you_something_to_eat poor_you take_your_time don't_worry be_careful cheer_up sit_down_a_moment have_some_water let_me_help
			`),
			wonder: words(`
				really? seriously? where? when? and_then? no_way! how? why? is_that_so? did_you_now? what_happened_next? what?
			`),
			answer: words(`
				yes,_a_little no,_I'm_fine yes,_quite so-so not_yet yes,_terribly a_bit not_really yes,_very not_at_all more_or_less yes,_actually
			`)
		}
	},
	// And a question to the person beside them is `are you`, with the copula in
	// front where the question shape puts it.
	listener: { subject: 'you', head: 'are' },
	// What somebody says on coming home. The one line the hero says whole rather
	// than reports: `I arrived at the house` is nothing anybody says.
	homecomings: {
		casual: words(`I'm_home I'm_back home_at_last! made_it_home back_at_last home_again`)
	},
	// How much a state holds, in front of it: `is very tired`.
	degrees: words(`
		very quite rather  really truly awfully terribly pretty fairly a_little somewhat extremely deeply utterly
	`),
	// Where `in` is the wrong word: on a bridge, at a station, under a sky.
	placeHeads: {
		on: words(`
			bridge rooftop balcony veranda boardwalk promenade playground terrace staircase pier wharf quay jetty byway
			boulevard esplanade rampart drawbridge causeway embankment levee viaduct bandstand portico hillside mountain
			sandbank glacier reef prairie plateau steppe savanna sandbar shoal seabed bedrock crag spire pinnacle headland
			peninsula islet mesa butte moraine scree talus overhang moon planet asteroid moonscape exoplanet
		`),
		at: words(`
			market station airport harbor lighthouse crossroads roundabout waypoint bazaar marketplace depot terminal
			campsite forum agora harborside gatehouse weir equator
		`),
		under: words(
			`sky starlight moonbeam firmament starfield fullmoon newmoon halfmoon crescent overpass aqueduct`
		)
	},
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
		// A state with how much of it, and one with when: `The fox is very tired`,
		// `In the evening, the fox was tired`. A state sentence is a subject and one
		// word otherwise, and a paragraph of those is a list.
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'degree' },
				{ slot: 'state', head: 'is', pastHead: 'was' }
			],
			weight: 9
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: 'is', pastHead: 'was' }
			],
			weight: 5
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
				{ slot: 'subject', head: 'is', pastHead: 'was', modifiable: true },
				{ slot: 'degree' },
				{ slot: 'state' }
			],
			weight: 6,
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
