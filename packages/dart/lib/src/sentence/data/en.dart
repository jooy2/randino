// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for en.
final SentenceLanguageData en = SentenceLanguageData(
  space: ' ',
  capitalize: true,
  terminators: const <SentenceType, String>{
    SentenceType.statement: '.',
    SentenceType.question: '?',
    SentenceType.exclamation: '!',
    SentenceType.trailing: '…',
  },
  quotes: const <SentenceQuote, List<String>>{
    SentenceQuote.double: <String>['“', '”'],
    SentenceQuote.single: <String>['‘', '’'],
  },
  articles: const <WordGender, List<List<String>>>{
    WordGender.n: <List<String>>[
      <String>['', 'the'],
    ],
  },
  verbs: <VerbGroup>[
    VerbGroup(
      field: VerbField.rise,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'wakes gets_up rises awakens sits_up rouses wakes_up'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'wake get_up rise awaken sit_up rouse wake_up'),
      },
      past: PredicateTense(
        words: words(r'woke got_up rose awakened sat_up roused woke_up'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'wake get_up rise awaken sit_up rouse wake_up'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'''
        goes heads hurries wanders travels sets_out journeys drifts proceeds ventures rushes
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(
          r'go head hurry wander travel set_out journey drift proceed venture rush',
        ),
      },
      past: PredicateTense(
        words: words(r'''
          went headed hurried wandered traveled set_out journeyed drifted proceeded ventured rushed
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            go head hurry wander travel set_out journey drift proceed venture rush
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      requires: SentenceSlot.destination,
      words: words(r'''
        runs walks climbs strolls trots dashes marches sprints jogs hikes tiptoes hops
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(
          r'run walk climb stroll trot dash march sprint jog hike tiptoe hop',
        ),
      },
      past: PredicateTense(
        words: words(r'''
          ran walked climbed strolled trotted dashed marched sprinted jogged hiked tiptoed hopped
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(
            r'run walk climb stroll trot dash march sprint jog hike tiptoe hop',
          ),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        leaves sets_off departs heads_out steps_out goes_out slips_away slips_out wanders_off
        strides_off sneaks_out hurries_off moves_on
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          leave set_off depart head_out step_out go_out slip_away slip_out wander_off stride_off
          sneak_out hurry_off move_on
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          left set_off departed headed_out stepped_out went_out slipped_away slipped_out
          wandered_off strode_off sneaked_out hurried_off moved_on
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            leave set_off depart head_out step_out go_out slip_away slip_out wander_off stride_off
            sneak_out hurry_off move_on
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'''
        returns comes_back gets_back heads_back comes gets makes_it goes_back turns_back drifts_back
        hurries_back comes_over
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          return come_back get_back head_back come get make_it go_back turn_back drift_back
          hurry_back come_over
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          returned came_back got_back headed_back came got made_it went_back turned_back
          drifted_back hurried_back came_over
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            return come_back get_back head_back come get make_it go_back turn_back drift_back
            hurry_back come_over
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        arrives comes_home returns gets_home turns_up shows_up gets_in reappears comes_in settles_in
        heads_home makes_it_home
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          arrive come_home return get_home turn_up show_up get_in reappear come_in settle_in
          head_home make_it_home
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          arrived came_home returned got_home turned_up showed_up got_in reappeared came_in
          settled_in headed_home made_it_home
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            arrive come_home return get_home turn_up show_up get_in reappear come_in settle_in
            head_home make_it_home
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      words: words(r'''
        runs walks leaps strolls roams paces jogs trots marches hops sprints dashes stomps tiptoes
        ambles wanders_about scampers scurries prances struts limps saunters strides plods trudges
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          run walk leap stroll roam pace jog trot march hop sprint dash stomp tiptoe amble
          wander_about scamper scurry prance strut limp saunter stride plod trudge
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          ran walked leapt strolled roamed paced jogged trotted marched hopped sprinted dashed
          stomped tiptoed ambled wandered_about scampered scurried pranced strutted limped sauntered
          strode plodded trudged
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            run walk leap stroll roam pace jog trot march hop sprint dash stomp tiptoe amble
            wander_about scamper scurry prance strut limp saunter stride plod trudge
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        wanders passes moves drifts turns circles slips_by moves_along darts glides twists
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(
          r'wander pass move drift turn circle slip_by move_along dart glide twist',
        ),
      },
      past: PredicateTense(
        words: words(r'''
          wandered passed moved drifted turned circled slipped_by moved_along darted glided twisted
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            wander pass move drift turn circle slip_by move_along dart glide twist
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.swimmer],
      words: words(r'swims paddles dives splashes floats surfaces swims_about swims_by'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'swim paddle dive splash float surface swim_about swim_by'),
      },
      past: PredicateTense(
        words: words(r'swam paddled dove splashed floated surfaced swam_about swam_by'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(
            r'swim paddle dive splash float surface swim_about swim_by',
          ),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature],
      subjectTraits: const <NounTrait>[NounTrait.flier],
      words: words(r'''
        flies soars flutters flaps takes_off glides swoops hovers circles_overhead lands alights
        flits flies_off flies_by perches
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          fly soar flutter flap take_off glide swoop hover circle_overhead land alight flit fly_off
          fly_by perch
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          flew soared fluttered flapped took_off glided swooped hovered circled_overhead landed
          alighted flitted flew_off flew_by perched
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            fly soar flutter flap take_off glide swoop hover circle_overhead land alight flit
            fly_off fly_by perch
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.crawler],
      words: words(r'''
        crawls creeps wriggles inches_along crawls_about squirms coils burrows slithers
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(
          r'crawl creep wriggle inch_along crawl_about squirm coil burrow slither',
        ),
      },
      past: PredicateTense(
        words: words(r'''
          crawled crept wriggled inched_along crawled_about squirmed coiled burrowed slithered
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(
            r'crawl creep wriggle inch_along crawl_about squirm coil burrow slither',
          ),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        waits hides lingers looks_around hesitates pauses stops listens waits_around holds_back
        hangs_back stands_still keeps_still idles loiters halts peeks_out glances_around stands_by
        dawdles
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          wait hide linger look_around hesitate pause stop listen wait_around hold_back hang_back
          stand_still keep_still idle loiter halt peek_out glance_around stand_by dawdle
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          waited hid lingered looked_around hesitated paused stopped listened waited_around
          held_back hung_back stood_still kept_still idled loitered halted peeked_out glanced_around
          stood_by dawdled
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            wait hide linger look_around hesitate pause stop listen wait_around hold_back hang_back
            stand_still keep_still idle loiter halt peek_out glance_around stand_by dawdle
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        rests sits lies_down leans curls_up stretches_out settles_down reclines sprawls lounges
        relaxes sits_down sits_back lies_back kneels crouches squats perches slumps unwinds
        takes_a_break
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          rest sit lie_down lean curl_up stretch_out settle_down recline sprawl lounge relax
          sit_down sit_back lie_back kneel crouch squat perch slump unwind take_a_break
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          rested sat lay_down leaned curled_up stretched_out settled_down reclined sprawled lounged
          relaxed sat_down sat_back lay_back knelt crouched squatted perched slumped unwound
          took_a_break
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            rest sit lie_down lean curl_up stretch_out settle_down recline sprawl lounge relax
            sit_down sit_back lie_back kneel crouch squat perch slump unwind take_a_break
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        sleeps dozes falls_asleep nods_off naps snoozes drifts_off dozes_off slumbers drowses
        sleeps_in drops_off nods drifts_to_sleep snores
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          sleep doze fall_asleep nod_off nap snooze drift_off doze_off slumber drowse sleep_in
          drop_off nod drift_to_sleep snore
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          slept dozed fell_asleep nodded_off napped snoozed drifted_off dozed_off slumbered drowsed
          slept_in dropped_off nodded drifted_to_sleep snored
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            sleep doze fall_asleep nod_off nap snooze drift_off doze_off slumber drowse sleep_in
            drop_off nod drift_to_sleep snore
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'''
        laughs smiles hums giggles chuckles grins whistles cheers beams claps nods winks chortles
        brightens
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          laugh smile hum giggle chuckle grin whistle cheer beam clap nod wink chortle brighten
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          laughed smiled hummed giggled chuckled grinned whistled cheered beamed clapped nodded
          winked chortled brightened
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            laugh smile hum giggle chuckle grin whistle cheer beam clap nod wink chortle brighten
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'''
        cries sighs mutters sobs weeps groans grumbles whimpers snorts frowns sniffles fidgets paces
        grimaces scowls pouts fumes sulks
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          cry sigh mutter sob weep groan grumble whimper snort frown sniffle fidget pace grimace
          scowl pout fume sulk
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          cried sighed muttered sobbed wept groaned grumbled whimpered snorted frowned sniffled
          fidgeted paced grimaced scowled pouted fumed sulked
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            cry sigh mutter sob weep groan grumble whimper snort frown sniffle fidget pace grimace
            scowl pout fume sulk
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'yawns stretches blinks slumps droops sags'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'yawn stretch blink slump droop sag'),
      },
      past: PredicateTense(
        words: words(r'yawned stretched blinked slumped drooped sagged'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'yawn stretch blink slump droop sag'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'drools salivates sniffs_the_air swallows_hard gulps'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'drool salivate sniff_the_air swallow_hard gulp'),
      },
      past: PredicateTense(
        words: words(r'drooled salivated sniffed_the_air swallowed_hard gulped'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'drool salivate sniff_the_air swallow_hard gulp'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        shouts gasps shrugs blushes squints flinches exclaims looks_up looks_round
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(
          r'shout gasp shrug blush squint flinch exclaim look_up look_round',
        ),
      },
      past: PredicateTense(
        words: words(r'''
          shouted gasped shrugged blushed squinted flinched exclaimed looked_up looked_round
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(
            r'shout gasp shrug blush squint flinch exclaim look_up look_round',
          ),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.talk,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        chats talks chatters speaks converses gossips babbles jabbers natters prattles whispers
        murmurs rambles chats_away talks_on
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          chat talk chatter speak converse gossip babble jabber natter prattle whisper murmur ramble
          chat_away talk_on
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          chatted talked chattered spoke conversed gossiped babbled jabbered nattered prattled
          whispered murmured rambled chatted_away talked_on
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            chat talk chatter speak converse gossip babble jabber natter prattle whisper murmur
            ramble chat_away talk_on
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        dances sings tumbles frolics plays bounces skips romps skips_about capers gambols hops_about
        leaps_about rolls_about twirls spins cavorts jumps_around plays_about fools_around
        larks_about horses_around
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          dance sing tumble frolic play bounce skip romp skip_about caper gambol hop_about
          leap_about roll_about twirl spin cavort jump_around play_about fool_around lark_about
          horse_around
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          danced sang tumbled frolicked played bounced skipped romped skipped_about capered gamboled
          hopped_about leapt_about rolled_about twirled spun cavorted jumped_around played_about
          fooled_around larked_about horsed_around
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            dance sing tumble frolic play bounce skip romp skip_about caper gambol hop_about
            leap_about roll_about twirl spin cavort jump_around play_about fool_around lark_about
            horse_around
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.think,
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        remembers forgets imagines counts recalls misses wonders_about considers ponders recollects
        pictures dreams_of dreams_about thinks_of thinks_about believes_in longs_for yearns_for
        worries_about muses_on reflects_on dwells_on contemplates fancies envisions
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          remember forget imagine count recall miss wonder_about consider ponder recollect picture
          dream_of dream_about think_of think_about believe_in long_for yearn_for worry_about
          muse_on reflect_on dwell_on contemplate fancy envision
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          remembered forgot imagined counted recalled missed wondered_about considered pondered
          recollected pictured dreamed_of dreamed_about thought_of thought_about believed_in
          longed_for yearned_for worried_about mused_on reflected_on dwelt_on contemplated fancied
          envisioned
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            remember forget imagine count recall miss wonder_about consider ponder recollect picture
            dream_of dream_about think_of think_about believe_in long_for yearn_for worry_about
            muse_on reflect_on dwell_on contemplate fancy envision
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.look,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        watches looks_at studies examines admires touches strokes eyes inspects gazes_at stares_at
        peers_at glances_at scans surveys checks pokes prods pats sniffs handles feels fingers
        turns_over looks_over sizes_up observes regards
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          watch look_at study examine admire touch stroke eye inspect gaze_at stare_at peer_at
          glance_at scan survey check poke prod pat sniff handle feel finger turn_over look_over
          size_up observe regard
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          watched looked_at studied examined admired touched stroked eyed inspected gazed_at
          stared_at peered_at glanced_at scanned surveyed checked poked prodded patted sniffed
          handled felt fingered turned_over looked_over sized_up observed regarded
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            watch look_at study examine admire touch stroke eye inspect gaze_at stare_at peer_at
            glance_at scan survey check poke prod pat sniff handle feel finger turn_over look_over
            size_up observe regard
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        searches looks_around rummages hunts_around scours forages digs_around pokes_around
        noses_around casts_about roots_around ferrets_about explores prowls scouts_around
        looks_about hunts
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          search look_around rummage hunt_around scour forage dig_around poke_around nose_around
          cast_about root_around ferret_about explore prowl scout_around look_about hunt
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          searched looked_around rummaged hunted_around scoured foraged dug_around poked_around
          nosed_around cast_about rooted_around ferreted_about explored prowled scouted_around
          looked_about hunted
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            search look_around rummage hunt_around scour forage dig_around poke_around nose_around
            cast_about root_around ferret_about explore prowl scout_around look_about hunt
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.find,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        finds discovers spots picks_up comes_across uncovers unearths locates stumbles_on
        stumbles_upon happens_upon retrieves recovers digs_up fishes_out turns_up scoops_up
        snatches_up
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          find discover spot pick_up come_across uncover unearth locate stumble_on stumble_upon
          happen_upon retrieve recover dig_up fish_out turn_up scoop_up snatch_up
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          found discovered spotted picked_up came_across uncovered unearthed located stumbled_on
          stumbled_upon happened_upon retrieved recovered dug_up fished_out turned_up scooped_up
          snatched_up
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            find discover spot pick_up come_across uncover unearth locate stumble_on stumble_upon
            happen_upon retrieve recover dig_up fish_out turn_up scoop_up snatch_up
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.take,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        takes picks grabs gathers chooses gets seizes snatches clutches grips holds lifts collects
        selects picks_out gathers_up takes_up takes_hold_of accepts receives obtains acquires claims
        pockets bags hoists
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          take pick grab gather choose get seize snatch clutch grip hold lift collect select
          pick_out gather_up take_up take_hold_of accept receive obtain acquire claim pocket bag
          hoist
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          took picked grabbed gathered chose got seized snatched clutched gripped held lifted
          collected selected picked_out gathered_up took_up took_hold_of accepted received obtained
          acquired claimed pocketed bagged hoisted
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            take pick grab gather choose get seize snatch clutch grip hold lift collect select
            pick_out gather_up take_up take_hold_of accept receive obtain acquire claim pocket bag
            hoist
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.carry,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        carries brings hauls lugs totes drags tows shoulders bears transports fetches ferries
        hauls_along carries_off carries_along brings_along takes_along drags_along
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          carry bring haul lug tote drag tow shoulder bear transport fetch ferry haul_along
          carry_off carry_along bring_along take_along drag_along
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          carried brought hauled lugged toted dragged towed shouldered bore transported fetched
          ferried hauled_along carried_off carried_along brought_along took_along dragged_along
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            carry bring haul lug tote drag tow shoulder bear transport fetch ferry haul_along
            carry_off carry_along bring_along take_along drag_along
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.hide,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        hides tucks_away stores puts_away keeps buries stashes conceals stows squirrels_away hoards
        locks_away packs_away sets_aside puts_aside tucks_in covers_up wraps_up stores_away
        hides_away salts_away keeps_back saves
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          hide tuck_away store put_away keep bury stash conceal stow squirrel_away hoard lock_away
          pack_away set_aside put_aside tuck_in cover_up wrap_up store_away hide_away salt_away
          keep_back save
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          hid tucked_away stored put_away kept buried stashed concealed stowed squirreled_away
          hoarded locked_away packed_away set_aside put_aside tucked_in covered_up wrapped_up
          stored_away hid_away salted_away kept_back saved
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            hide tuck_away store put_away keep bury stash conceal stow squirrel_away hoard lock_away
            pack_away set_aside put_aside tuck_in cover_up wrap_up store_away hide_away salt_away
            keep_back save
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.lose,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        loses drops misplaces mislays leaves_behind forgets lets_slip lets_fall fumbles lets_go_of
        loses_track_of
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          lose drop misplace mislay leave_behind forget let_slip let_fall fumble let_go_of
          lose_track_of
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          lost dropped misplaced mislaid left_behind forgot let_slip let_fall fumbled let_go_of
          lost_track_of
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            lose drop misplace mislay leave_behind forget let_slip let_fall fumble let_go_of
            lose_track_of
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.meet,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.person],
      words: words(r'''
        meets runs_into greets bumps_into encounters comes_upon catches_up_with joins welcomes
        visits calls_on drops_in_on sees waves_to nods_to hugs
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          meet run_into greet bump_into encounter come_upon catch_up_with join welcome visit call_on
          drop_in_on see wave_to nod_to hug
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          met ran_into greeted bumped_into encountered came_upon caught_up_with joined welcomed
          visited called_on dropped_in_on saw waved_to nodded_to hugged
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            meet run_into greet bump_into encounter come_upon catch_up_with join welcome visit
            call_on drop_in_on see wave_to nod_to hug
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        makes builds crafts carves paints weaves shapes assembles fashions designs constructs
        puts_together pieces_together draws sketches invents devises creates produces finishes
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          make build craft carve paint weave shape assemble fashion design construct put_together
          piece_together draw sketch invent devise create produce finish
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          made built crafted carved painted wove shaped assembled fashioned designed constructed
          put_together pieced_together drew sketched invented devised created produced finished
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            make build craft carve paint weave shape assemble fashion design construct put_together
            piece_together draw sketch invent devise create produce finish
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      objectThemes: const <WordTheme>[WordTheme.object, WordTheme.tool, WordTheme.vehicle],
      words: words(r'forges casts hammers_out welds rivets bolts_together'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'forge cast hammer_out weld rivet bolt_together'),
      },
      past: PredicateTense(
        words: words(r'forged cast hammered_out welded riveted bolted_together'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'forge cast hammer_out weld rivet bolt_together'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing],
      objectThemes: const <WordTheme>[WordTheme.clothing],
      words: words(r'knits sews stitches tailors embroiders hems darns'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'knit sew stitch tailor embroider hem darn'),
      },
      past: PredicateTense(
        words: words(r'knitted sewed stitched tailored embroidered hemmed darned'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'knit sew stitch tailor embroider hem darn'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.tend,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        mends cleans polishes fixes tidies oils repairs scrubs wipes dusts adjusts tightens patches
        restores brushes rinses washes sorts_out looks_after cares_for maintains buffs shines
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          mend clean polish fix tidy oil repair scrub wipe dust adjust tighten patch restore brush
          rinse wash sort_out look_after care_for maintain buff shine
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          mended cleaned polished fixed tidied oiled repaired scrubbed wiped dusted adjusted
          tightened patched restored brushed rinsed washed sorted_out looked_after cared_for
          maintained buffed shined
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            mend clean polish fix tidy oil repair scrub wipe dust adjust tighten patch restore brush
            rinse wash sort_out look_after care_for maintain buff shine
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.sell,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        sells hands_over trades_away offers peddles hawks auctions trades sells_off parts_with
        passes_on hands_on lets_go_of markets unloads exchanges bargains_away
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          sell hand_over trade_away offer peddle hawk auction trade sell_off part_with pass_on
          hand_on let_go_of market unload exchange bargain_away
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          sold handed_over traded_away offered peddled hawked auctioned traded sold_off parted_with
          passed_on handed_on let_go_of marketed unloaded exchanged bargained_away
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            sell hand_over trade_away offer peddle hawk auction trade sell_off part_with pass_on
            hand_on let_go_of market unload exchange bargain_away
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.buy,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle, NounClass.edible],
      words: words(r'''
        buys purchases picks_up orders acquires pays_for gets shops_for splurges_on snaps_up
        bargains_for haggles_over stocks_up_on picks_out invests_in
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          buy purchase pick_up order acquire pay_for get shop_for splurge_on snap_up bargain_for
          haggle_over stock_up_on pick_out invest_in
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          bought purchased picked_up ordered acquired paid_for got shopped_for splurged_on
          snapped_up bargained_for haggled_over stocked_up_on picked_out invested_in
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            buy purchase pick_up order acquire pay_for get shop_for splurge_on snap_up bargain_for
            haggle_over stock_up_on pick_out invest_in
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.cook,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        warms cooks serves prepares heats reheats seasons plates fixes_up dishes_up whips_up
        rustles_up makes cooks_up garnishes salts peppers spices sweetens
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          warm cook serve prepare heat reheat season plate fix_up dish_up whip_up rustle_up make
          cook_up garnish salt pepper spice sweeten
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          warmed cooked served prepared heated reheated seasoned plated fixed_up dished_up
          whipped_up rustled_up made cooked_up garnished salted peppered spiced sweetened
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            warm cook serve prepare heat reheat season plate fix_up dish_up whip_up rustle_up make
            cook_up garnish salt pepper spice sweeten
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.cook,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      objectTraits: const <NounTrait>[NounTrait.raw],
      words: words(r'''
        bakes roasts grills fries slices chops peels dices minces grates shreds sears browns steams
        broils barbecues marinates skewers
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          bake roast grill fry slice chop peel dice mince grate shred sear brown steam broil
          barbecue marinate skewer
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          baked roasted grilled fried sliced chopped peeled diced minced grated shredded seared
          browned steamed broiled barbecued marinated skewered
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            bake roast grill fry slice chop peel dice mince grate shred sear brown steam broil
            barbecue marinate skewer
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.cook,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      objectTraits: const <NounTrait>[NounTrait.liquid],
      words: words(r'''
        stirs simmers boils ladles stews pours spoons_out whisks blends thickens reduces heats_up
        warms_up dishes_out
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          stir simmer boil ladle stew pour spoon_out whisk blend thicken reduce heat_up warm_up
          dish_out
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          stirred simmered boiled ladled stewed poured spooned_out whisked blended thickened reduced
          heated_up warmed_up dished_out
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            stir simmer boil ladle stew pour spoon_out whisk blend thicken reduce heat_up warm_up
            dish_out
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.eat,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        eats tastes swallows devours finishes gobbles wolfs_down scoffs polishes_off bolts
        tucks_into samples savors digs_into feasts_on snacks_on picks_at gulps_down downs
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          eat taste swallow devour finish gobble wolf_down scoff polish_off bolt tuck_into sample
          savor dig_into feast_on snack_on pick_at gulp_down down
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          ate tasted swallowed devoured finished gobbled wolfed_down scoffed polished_off bolted
          tucked_into sampled savored dug_into feasted_on snacked_on picked_at gulped_down downed
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            eat taste swallow devour finish gobble wolf_down scoff polish_off bolt tuck_into sample
            savor dig_into feast_on snack_on pick_at gulp_down down
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.eat,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      objectWithout: const <NounTrait>[NounTrait.liquid],
      words: words(r'''
        chews bites nibbles crunches munches gnaws crunches_on chomps chews_on bites_into tears_into
        licks nibbles_at
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          chew bite nibble crunch munch gnaw crunch_on chomp chew_on bite_into tear_into lick
          nibble_at
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          chewed bit nibbled crunched munched gnawed crunched_on chomped chewed_on bit_into
          tore_into licked nibbled_at
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            chew bite nibble crunch munch gnaw crunch_on chomp chew_on bite_into tear_into lick
            nibble_at
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.eat,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      objectTraits: const <NounTrait>[NounTrait.liquid],
      words: words(r'sips slurps spoons spoons_up laps_up sups sucks_up scoops_up'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'sip slurp spoon spoon_up lap_up sup suck_up scoop_up'),
      },
      past: PredicateTense(
        words: words(r'sipped slurped spooned spooned_up lapped_up supped sucked_up scooped_up'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'sip slurp spoon spoon_up lap_up sup suck_up scoop_up'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.drink,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        drinks sips gulps savors swigs downs quaffs slurps laps_up drains gulps_down sips_at nurses
        tastes swallows knocks_back polishes_off
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          drink sip gulp savor swig down quaff slurp lap_up drain gulp_down sip_at nurse taste
          swallow knock_back polish_off
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          drank sipped gulped savored swigged downed quaffed slurped lapped_up drained gulped_down
          sipped_at nursed tasted swallowed knocked_back polished_off
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            drink sip gulp savor swig down quaff slurp lap_up drain gulp_down sip_at nurse taste
            swallow knock_back polish_off
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        quiets darkens brightens empties fills_up glows stirs wakes falls_silent falls_still hushes
        settles comes_alive livens_up bustles hums buzzes sleeps dims lights_up shimmers glistens
        freezes_over thaws warms cools floods drains fades sparkles crowds_up empties_out
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          quiet darken brighten empty fill_up glow stir wake fall_silent fall_still hush settle
          come_alive liven_up bustle hum buzz sleep dim light_up shimmer glisten freeze_over thaw
          warm cool flood drain fade sparkle crowd_up empty_out
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          quieted darkened brightened emptied filled_up glowed stirred woke fell_silent fell_still
          hushed settled came_alive livened_up bustled hummed buzzed slept dimmed lit_up shimmered
          glistened froze_over thawed warmed cooled flooded drained faded sparkled crowded_up
          emptied_out
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            quiet darken brighten empty fill_up glow stir wake fall_silent fall_still hush settle
            come_alive liven_up bustle hum buzz sleep dim light_up shimmer glisten freeze_over thaw
            warm cool flood drain fade sparkle crowd_up empty_out
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'''
        glows flows fades deepens begins ends passes lingers unfolds draws_on wears_on drags_on
        goes_on carries_on winds_down dies_down builds gathers approaches nears
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          glow flow fade deepen begin end pass linger unfold draw_on wear_on drag_on go_on carry_on
          wind_down die_down build gather approach near
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          glowed flowed faded deepened began ended passed lingered unfolded drew_on wore_on
          dragged_on went_on carried_on wound_down died_down built gathered approached neared
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            glow flow fade deepen begin end pass linger unfold draw_on wear_on drag_on go_on
            carry_on wind_down die_down build gather approach near
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.time],
      words: words(r'''
        dawns breaks wanes wears_away slips_by creeps_on turns settles_in draws_in draws_to_a_close
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          dawn break wane wear_away slip_by creep_on turn settle_in draw_in draw_to_a_close
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          dawned broke waned wore_away slipped_by crept_on turned settled_in drew_in drew_to_a_close
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            dawn break wane wear_away slip_by creep_on turn settle_in draw_in draw_to_a_close
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.weather],
      words: words(r'''
        rolls_in sets_in blows_over clears lets_up eases picks_up sweeps_through moves_in
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          roll_in set_in blow_over clear let_up ease pick_up sweep_through move_in
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          rolled_in set_in blew_over cleared let_up eased picked_up swept_through moved_in
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            roll_in set_in blow_over clear let_up ease pick_up sweep_through move_in
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.sport],
      words: words(r'''
        kicks_off starts gets_underway heats_up wraps_up goes_ahead resumes runs_late overruns
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          kick_off start get_underway heat_up wrap_up go_ahead resume run_late overrun
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          kicked_off started got_underway heated_up wrapped_up went_ahead resumed ran_late overran
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            kick_off start get_underway heat_up wrap_up go_ahead resume run_late overrun
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      subjectThemes: const <WordTheme>[
        WordTheme.object,
        WordTheme.tool,
        WordTheme.clothing,
        WordTheme.product,
        WordTheme.gem,
        WordTheme.vehicle,
      ],
      words: words(r'''
        sways glitters falls rolls tilts ages creaks shines gleams wobbles teeters topples tumbles
        slips slides drops spins turns settles shifts fades wears dulls
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          sway glitter fall roll tilt age creak shine gleam wobble teeter topple tumble slip slide
          drop spin turn settle shift fade wear dull
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          swayed glittered fell rolled tilted aged creaked shone gleamed wobbled teetered toppled
          tumbled slipped slid dropped spun turned settled shifted faded wore dulled
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            sway glitter fall roll tilt age creak shine gleam wobble teeter topple tumble slip slide
            drop spin turn settle shift fade wear dull
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      subjectThemes: const <WordTheme>[WordTheme.object, WordTheme.tool, WordTheme.vehicle],
      words: words(r'rattles clatters rusts cracks breaks snaps jams sticks squeaks clanks'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(
          r'rattle clatter rust crack break snap jam stick squeak clank',
        ),
      },
      past: PredicateTense(
        words: words(r'''
          rattled clattered rusted cracked broke snapped jammed stuck squeaked clanked
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(
            r'rattle clatter rust crack break snap jam stick squeak clank',
          ),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing],
      subjectThemes: const <WordTheme>[WordTheme.music],
      words: words(r'''
        plays rings_out drifts swells fades_out echoes carries floats sounds resounds lingers
        dies_away builds stops
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          play ring_out drift swell fade_out echo carry float sound resound linger die_away build
          stop
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          played rang_out drifted swelled faded_out echoed carried floated sounded resounded
          lingered died_away built stopped
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            play ring_out drift swell fade_out echo carry float sound resound linger die_away build
            stop
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        runs stops passes returns departs slides rolls glides speeds rumbles rattles_along trundles
        cruises drives_by pulls_in pulls_out pulls_up sets_off arrives turns swerves brakes idles
        crawls_along zooms roars_past coasts drifts
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          run stop pass return depart slide roll glide speed rumble rattle_along trundle cruise
          drive_by pull_in pull_out pull_up set_off arrive turn swerve brake idle crawl_along zoom
          roar_past coast drift
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          ran stopped passed returned departed slid rolled glided sped rumbled rattled_along
          trundled cruised drove_by pulled_in pulled_out pulled_up set_off arrived turned swerved
          braked idled crawled_along zoomed roared_past coasted drifted
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            run stop pass return depart slide roll glide speed rumble rattle_along trundle cruise
            drive_by pull_in pull_out pull_up set_off arrive turn swerve brake idle crawl_along zoom
            roar_past coast drift
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        spreads vanishes remains lingers returns gathers grows fades deepens surfaces stirs settles
        passes builds swells recedes drifts_back comes_back creeps_in seeps_in takes_hold wears_off
        dies_away ebbs flickers rises falls shifts
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          spread vanish remain linger return gather grow fade deepen surface stir settle pass build
          swell recede drift_back come_back creep_in seep_in take_hold wear_off die_away ebb flicker
          rise fall shift
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          spread vanished remained lingered returned gathered grew faded deepened surfaced stirred
          settled passed built swelled receded drifted_back came_back crept_in seeped_in took_hold
          wore_off died_away ebbed flickered rose fell shifted
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            spread vanish remain linger return gather grow fade deepen surface stir settle pass
            build swell recede drift_back come_back creep_in seep_in take_hold wear_off die_away ebb
            flicker rise fall shift
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        grows wilts blooms sways spreads sprouts buds flowers blossoms unfurls stretches climbs
        droops withers fades thrives flourishes rustles bends leans shoots_up springs_up takes_root
        bears_fruit sheds greens turns_gold reaches_up
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          grow wilt bloom sway spread sprout bud flower blossom unfurl stretch climb droop wither
          fade thrive flourish rustle bend lean shoot_up spring_up take_root bear_fruit shed green
          turn_gold reach_up
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          grew wilted bloomed swayed spread sprouted budded flowered blossomed unfurled stretched
          climbed drooped withered faded thrived flourished rustled bent leaned shot_up sprang_up
          took_root bore_fruit shed greened turned_gold reached_up
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            grow wilt bloom sway spread sprout bud flower blossom unfurl stretch climb droop wither
            fade thrive flourish rustle bend lean shoot_up spring_up take_root bear_fruit shed green
            turn_gold reach_up
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        trembles moves stiffens aches heals twitches shivers tingles throbs quivers relaxes loosens
        tenses tightens warms cools numbs goes_numb swells shakes flexes stretches rests tires wakes
        settles jerks flinches sags droops
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          tremble move stiffen ache heal twitch shiver tingle throb quiver relax loosen tense
          tighten warm cool numb go_numb swell shake flex stretch rest tire wake settle jerk flinch
          sag droop
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          trembled moved stiffened ached healed twitched shivered tingled throbbed quivered relaxed
          loosened tensed tightened warmed cooled numbed went_numb swelled shook flexed stretched
          rested tired woke settled jerked flinched sagged drooped
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            tremble move stiffen ache heal twitch shiver tingle throb quiver relax loosen tense
            tighten warm cool numb go_numb swell shake flex stretch rest tire wake settle jerk
            flinch sag droop
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        ripens cools boils melts spoils remains warms steams cools_down goes_cold turns goes_off
        runs_out sits waits smells_good
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          ripen cool boil melt spoil remain warm steam cool_down go_cold turn go_off run_out sit
          wait smell_good
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          ripened cooled boiled melted spoiled remained warmed steamed cooled_down went_cold turned
          went_off ran_out sat waited smelled_good
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            ripen cool boil melt spoil remain warm steam cool_down go_cold turn go_off run_out sit
            wait smell_good
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        sizzles crumbles goes_stale dries_out hardens softens browns burns bakes toasts rises
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          sizzle crumble go_stale dry_out harden soften brown burn bake toast rise
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          sizzled crumbled went_stale dried_out hardened softened browned burned baked toasted rose
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'''
            sizzle crumble go_stale dry_out harden soften brown burn bake toast rise
          '''),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        bubbles fizzes foams froths spills sloshes swirls settles goes_flat overflows
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(
          r'bubble fizz foam froth spill slosh swirl settle go_flat overflow',
        ),
      },
      past: PredicateTense(
        words: words(r'''
          bubbled fizzed foamed frothed spilled sloshed swirled settled went_flat overflowed
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(
            r'bubble fizz foam froth spill slosh swirl settle go_flat overflow',
          ),
        },
      ),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        big small quick slow quiet loud brave lazy busy fierce gentle clever restless young old
        strong weak bold timid shy proud cheerful patient stubborn nimble watchful sturdy
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'hungry starving peckish ravenous famished'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'full satisfied stuffed sated'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'tired sleepy weary drowsy exhausted footsore sluggish'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'refreshed rested lively alert energetic'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'happy glad content pleased cheerful cheery joyful merry delighted'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'bored curious uneasy impatient anxious fidgety unsettled'),
    ),
    StateGroup(
      subject: const <NounClass>[
        NounClass.creature,
        NounClass.person,
        NounClass.plant,
        NounClass.edible,
        NounClass.thing,
        NounClass.vehicle,
        NounClass.place,
        NounClass.event,
        NounClass.idea,
        NounClass.body,
      ],
      words: words(r'''
        beautiful strange new common rare lovely familiar odd ordinary remarkable splendid
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        wide narrow calm deep dark bright distant steep quiet noisy crowded empty vast shallow
        gloomy sunny lively dull long short
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        hard light heavy old smooth clear sturdy hollow new small large round flat sharp blunt
        fragile shiny worn rusty plain ornate
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        sweet salty spicy sour hot cold nutty mild bitter rich creamy crisp tender juicy fresh stale
        bland tangy smoky
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        simple obvious vague endless fleeting stubborn clear complex familiar precious secret
        timeless useful difficult easy
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'green lush fragrant withered tall leafy thorny tender wild pale bare'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'warm cold sore stiff steady strong weak numb tender rough smooth heavy'),
    ),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        brave lively gentle busy lazy shy clever young old small big quiet cheerful patient nimble
        curious bold timid restless weary stout slender lean wiry graceful clumsy sleepy cunning
        watchful eager solemn merry gruff stubborn playful quick silent proud
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'''
        young kind strict earnest weary friendly wise humble stern polite learned skilled ragged
        wealthy honest shrewd hearty solitary weathered thoughtful generous
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'''
        swift fierce tame plump little shaggy sleek spotted striped scrawny bristly wary tiny
        hulking glossy speckled
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        sweet spicy warm fresh crisp savory fragrant hot salty soft ripe tasty buttery smoky tangy
        creamy crunchy tender juicy hearty golden steaming toasted rich sticky flaky peppery bland
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        sweet warm cold cool hot fragrant fresh strong bitter creamy frothy icy milky cloudy clear
        sparkling weak spiced tepid
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        old new small big light heavy shiny smooth clear sturdy pretty precious ancient battered
        worn rusty polished plain ornate narrow wide round flat sharp blunt fragile hollow dusty
        crooked
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        fast slow rattling creaking gleaming rusted humming lumbering sleek swaying
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        quiet wide dark bright strange old cozy secluded busy silent remote distant nearby empty
        lonely sunny narrow crowded windy misty shady leafy dusty muddy rocky steep grand bustling
        deserted damp airy
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        green lush fragrant young withered tall small tender fresh thorny leafy blooming budding
        creeping wild slender pale drooping climbing
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        faint old new strange clear precious small odd vague dim simple tangled stubborn fleeting
        distant bold secret quiet
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'''
        long short quiet sunny cloudy noisy sudden lazy brief lively solemn merry grand dull rainy
        stormy calm busy crowded splendid
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        small cold warm slender sturdy tender steady weary stiff sore rough smooth pale thin strong
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[
        NounClass.creature,
        NounClass.person,
        NounClass.plant,
        NounClass.thing,
        NounClass.vehicle,
        NounClass.place,
        NounClass.event,
        NounClass.idea,
        NounClass.body,
      ],
      words: words(r'''
        beautiful mysterious strange new lovely familiar odd ordinary splendid humble
      '''),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        quietly slowly quickly gently suddenly softly alone briefly boldly carefully eagerly warily
        calmly warmly firmly patiently lightly wearily cheerfully idly restlessly gladly keenly
        happily swiftly silently proudly bravely shyly clumsily awkwardly gracefully stubbornly
        hastily hurriedly abruptly promptly deliberately absently anxiously nervously curiously
        merrily solemnly sleepily drowsily carelessly recklessly cautiously roughly cheerily
        earnestly lazily wildly meekly tirelessly at_once straight_away for_a_while once_more
        in_silence without_a_word in_a_hurry
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[
        NounClass.plant,
        NounClass.edible,
        NounClass.thing,
        NounClass.vehicle,
        NounClass.place,
        NounClass.event,
        NounClass.idea,
        NounClass.body,
      ],
      words: words(r'''
        quietly slowly gently suddenly softly again steadily still slightly faintly evenly gradually
        little_by_little silently smoothly quickly briefly barely deeply widely brightly dimly
        warmly coldly sweetly richly thickly loosely firmly heavily lightly endlessly ceaselessly
        constantly once_more for_a_while all_at_once bit_by_bit in_silence without_a_sound
        ever_so_slightly here_and_there
      '''),
    ),
  ],
  times: SentenceTimes(
    day: words(r'''
      at_dawn in_the_early_morning in_the_morning at_midday in_the_afternoon at_dusk in_the_evening
      at_night late_at_night at_midnight
    '''),
    any: words(r'''
      in_spring in_summer in_autumn in_winter on_weekends on_holidays all_day in_early_spring
      in_late_spring in_early_summer in_midsummer in_late_summer in_early_autumn in_late_autumn
      in_midwinter in_late_winter at_harvest in_the_rainy_season on_a_clear_day on_a_cloudy_day
      on_a_rainy_day on_a_snowy_day on_a_windy_day on_a_foggy_day on_a_market_day at_the_festival
      during_the_holidays at_the_full_moon
    '''),
    past: words(r'''
      yesterday last_week long_ago once that_day the_night_before the_day_before_yesterday
      last_month last_year last_spring last_summer last_autumn last_winter years_ago a_while_ago
      moments_ago that_morning that_evening back_then in_those_days the_week_before the_year_before
      not_long_ago
    '''),
    present: words(r'''
      today just_now tomorrow next_week right_now this_morning this_evening tonight
      the_day_after_tomorrow next_month next_year this_year this_week this_weekend in_a_moment
      shortly
    '''),
    habitual: words(r'''
      these_days sometimes every_day every_night always often usually rarely seldom now_and_then
      from_time_to_time once_in_a_while every_morning every_evening every_week every_year
      on_most_days as_a_rule
    '''),
  ),
  homes: words(r'house cottage'),
  join: const SentenceJoin(word: 'and'),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'and_then besides also moreover furthermore in_addition'),
    ConnectiveKind.temporal: words(r'''
      meanwhile afterwards later soon at_last before_long then presently by_then in_time
      after_a_while shortly_after moments_later
    '''),
    ConnectiveKind.contrastive: words(r'''
      but still however yet even_so then_again all_the_same even_then nevertheless nonetheless
      instead on_the_other_hand
    '''),
    ConnectiveKind.causal: words(
      r'so therefore in_the_end thus hence as_a_result for_that_reason consequently',
    ),
  },
  traits: <NounTrait, WordPool>{
    NounTrait.flier: words(r'''
      owl sparrow magpie swallow eagle falcon crane swan duck goose woodpecker parrot peacock
      butterfly moth bee dragonfly ladybug bat heron pelican raven kestrel puffin flamingo firefly
      osprey vulture condor stork ibis cormorant albatross petrel sandpiper plover lapwing starling
      finch warbler thrush cuckoo hoopoe kingfisher toucan macaw cockatoo canary nightingale cicada
      beetle dragon wyvern phoenix griffin harpy pegasus hippogriff roc simurgh thunderbird fairy
      pixie sprite sylph angel seraph valkyrie imp gargoyle drake peryton
    '''),
    NounTrait.swimmer: words(r'''
      whale dolphin shark turtle seal penguin frog octopus squid seahorse starfish crab shrimp carp
      salmon mackerel walrus narwhal jellyfish tadpole siren mermaid kraken leviathan naiad undine
      selkie kelpie
    '''),
    NounTrait.crawler: words(r'''
      turtle lizard chameleon snake snail ant spider crab earthworm centipede scorpion gecko iguana
      cobra python newt mantis basilisk wyrm naga amphisbaena lindworm
    '''),
    NounTrait.lifeless: words(r'''
      spell curse hex rune amulet talisman grimoire potion prophecy sorcery enchantment sigil glyph
      omen portent blessing incantation invocation summoning banishment divination scrying portal
      ley sanctum reliquary effigy idol totem phylactery charm warding runestone nightmare
    '''),
    NounTrait.liquid: words(r'''
      porridge stew chowder curry bisque consomme goulash congee pho ramen udon soba pudding custard
      yogurt honey syrup lemonade salsa chutney relish marmalade hummus guacamole
    '''),
    NounTrait.raw: words(r'''
      potato carrot cabbage spinach broccoli pumpkin garlic mushroom steak fillet drumstick brisket
      ribeye sirloin tenderloin sausage bacon meatball cutlet schnitzel kebab skewer tofu
    '''),
    NounTrait.placeless: words(r'''
      wave tide boulder pebble ember cinder earthquake echo avalanche driftwood fumarole stalactite
      stalagmite geyser star comet meteor corona zenith eclipse satellite orbit gravity sunspot
      lightyear stardust supernova quasar pulsar moonrise solarflare perihelion aphelion apogee
      perigee nadir azimuth parallax redshift starlore cosmology astronomy telescopy gravitas
      lunation sidereal ecliptic meridian solarsail starburst skyline
    '''),
  },
  interjections: words(r'''
    oh, ah, wow, well, look, goodness, my, indeed, honestly, gosh, hey, whoa, dear_me, good_grief,
    alas, oho, aha, hush, listen, why, heavens, mercy, bless_me, of_course, no_wonder, oh_dear,
    good_heavens, my_word, at_last,
  '''),
  pronouns: const <WordGender, WordPool>{
    WordGender.m: <String>['he'],
    WordGender.f: <String>['she'],
    WordGender.n: <String>['it'],
  },
  pronounless: const <NounClass>[NounClass.person],
  objectPronouns: const SentenceObjectPronouns(
    words: <WordGender, WordPool>{
      WordGender.n: <String>['it'],
    },
  ),
  speech: const SentenceSpeech(subject: 'I', head: 'am'),
  replies: <SentenceStyle, Map<ReplyCue, WordPool>>{
    SentenceStyle.casual: <ReplyCue, WordPool>{
      ReplyCue.agree: words(r"""
        right true I_know so_it_is same_here indeed that's_right you're_right it_is quite_so
        no_doubt I_thought_so
      """),
      ReplyCue.cheer: words(r'''
        well_done! good_for_you! great! lucky_you nice_one wonderful! congratulations well_earned
        brilliant! splendid! at_last!
      '''),
      ReplyCue.care: words(r"""
        are_you_all_right? take_a_rest don't_overdo_it let's_get_you_something_to_eat poor_you
        take_your_time don't_worry be_careful cheer_up sit_down_a_moment have_some_water let_me_help
      """),
      ReplyCue.wonder: words(r'''
        really? seriously? where? when? and_then? no_way! how? why? is_that_so? did_you_now?
        what_happened_next? what?
      '''),
      ReplyCue.answer: words(r"""
        yes,_a_little no,_I'm_fine yes,_quite so-so not_yet yes,_terribly a_bit not_really yes,_very
        not_at_all more_or_less yes,_actually
      """),
    },
  },
  listener: const SentenceSpeech(subject: 'you', head: 'are'),
  placeHeads: <String, WordPool>{
    'on': words(r'''
      bridge rooftop balcony veranda boardwalk promenade playground terrace staircase pier wharf
      quay jetty byway boulevard esplanade rampart drawbridge causeway embankment levee viaduct
      bandstand portico hillside mountain sandbank glacier reef prairie plateau steppe savanna
      sandbar shoal seabed bedrock crag spire pinnacle headland peninsula islet mesa butte moraine
      scree talus overhang moon planet asteroid moonscape exoplanet
    '''),
    'at': words(r'''
      market station airport harbor lighthouse crossroads roundabout waypoint bazaar marketplace
      depot terminal campsite forum agora harborside gatehouse weir equator
    '''),
    'under': words(r'''
      sky starlight moonbeam firmament starfield fullmoon newmoon halfmoon crescent overpass
      aqueduct
    '''),
  },
  numeral: const SentenceNumeral(
    order: NumeralOrder.before,
    counters: <NounClass, String>{},
    count: LengthRange(2, 12),
    currency: 'dollars',
    amounts: <int>[100, 500, 1000, 5000, 12000, 25000, 50000, 100000],
    group: ',',
    gap: ' ',
  ),
  calendar: SentenceCalendar(
    date: 'MMMM D, Y',
    months: words(r'''
      January February March April May June July August September October November December
    '''),
    clock: 'h:mm',
    years: const LengthRange(2020, 2030),
    copula: StateGroup(
      subject: const <NounClass>[NounClass.event],
      words: <String>['is'],
      past: PredicateTense(words: <String>['was']),
    ),
  ),
  frames: const <SentenceFrame>[
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.date, head: 'on', tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.clock, head: 'at', tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.date, head: 'on', copula: CopulaSide.head),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.clock, head: 'at', copula: CopulaSide.head),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 20),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
    ], 18),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.place, head: 'in', modifiable: true),
    ], 14),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'to', modifiable: true),
      ],
      10,
      fields: <VerbField>[VerbField.go, VerbField.arrive],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.time, tail: ','),
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'to', modifiable: true),
      ],
      5,
      fields: <VerbField>[VerbField.go, VerbField.arrive],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'to', modifiable: true),
        SentencePart(SentenceSlot.manner),
      ],
      4,
      fields: <VerbField>[VerbField.go, VerbField.arrive],
    ),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: 'is', pastHead: 'was'),
    ], 12),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.degree),
      SentencePart(SentenceSlot.state, head: 'is', pastHead: 'was'),
    ], 9),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: 'is', pastHead: 'was'),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.manner),
    ], 10),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 8),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
      SentencePart(SentenceSlot.place, head: 'in', modifiable: true),
    ], 7),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.place, head: 'in', modifiable: true),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
      SentencePart(SentenceSlot.manner),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
      SentencePart(SentenceSlot.place, head: 'in', modifiable: true),
    ], 3),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'does', pastHead: 'did', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      20,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'does', pastHead: 'did', modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.object, modifiable: true),
      ],
      16,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'is', pastHead: 'was', modifiable: true),
        SentencePart(SentenceSlot.state),
      ],
      14,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'is', pastHead: 'was', modifiable: true),
        SentencePart(SentenceSlot.degree),
        SentencePart(SentenceSlot.state),
      ],
      6,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'does', pastHead: 'did', modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.place, head: 'in', modifiable: true),
      ],
      12,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'does', pastHead: 'did', modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.manner),
      ],
      10,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'does', pastHead: 'did', modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'to', modifiable: true),
      ],
      6,
      mood: SentenceMood.question,
      fields: <VerbField>[VerbField.go, VerbField.arrive],
    ),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.money),
    ], 6),
  ],
);
