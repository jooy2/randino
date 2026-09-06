"""The en sentence grammar: the verbs, the predicates and the shapes.

Ported verbatim from the JavaScript package; see CLAUDE.md.
"""

from randino._internal.parse import words
from randino.sentence.data._types import (
    ModifierGroup,
    PredicateTense,
    SentenceCalendar,
    SentenceFrame,
    SentenceJoin,
    SentenceLanguageData,
    SentenceNumeral,
    SentenceObjectPronouns,
    SentencePart,
    SentenceSpeech,
    SentenceTimes,
    StateGroup,
    VerbGroup,
)

EN = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminators={"statement": ".", "question": "?", "exclamation": "!", "trailing": "…"},
    quotes={"double": ("“", "”"), "single": ("‘", "’")},
    articles={
        "n": (("", "the"),),
    },
    verbs=(
        VerbGroup(
            field="rise",
            subject=("creature", "person"),
            words=words("wakes gets_up rises awakens sits_up rouses wakes_up"),
            forms={
                "question": words("wake get_up rise awaken sit_up rouse wake_up"),
            },
            past=PredicateTense(
                words=words("woke got_up rose awakened sat_up roused woke_up"),
                forms={
                    "question": words("wake get_up rise awaken sit_up rouse wake_up"),
                },
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            requires="destination",
            words=words("""
                goes heads hurries wanders travels sets_out journeys drifts proceeds ventures rushes
            """),
            forms={
                "question": words("""
                    go head hurry wander travel set_out journey drift proceed venture rush
                """),
            },
            past=PredicateTense(
                words=words("""
                    went headed hurried wandered traveled set_out journeyed drifted proceeded
                    ventured rushed
                """),
                forms={
                    "question": words("""
                        go head hurry wander travel set_out journey drift proceed venture rush
                    """),
                },
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            subject_without=("swimmer", "crawler"),
            requires="destination",
            words=words("""
                runs walks climbs strolls trots dashes marches sprints jogs hikes tiptoes hops
            """),
            forms={
                "question": words("""
                    run walk climb stroll trot dash march sprint jog hike tiptoe hop
                """),
            },
            past=PredicateTense(
                words=words("""
                    ran walked climbed strolled trotted dashed marched sprinted jogged hiked tiptoed
                    hopped
                """),
                forms={
                    "question": words("""
                        run walk climb stroll trot dash march sprint jog hike tiptoe hop
                    """),
                },
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            words=words("""
                leaves sets_off departs heads_out steps_out goes_out slips_away slips_out
                wanders_off strides_off sneaks_out hurries_off moves_on
            """),
            forms={
                "question": words("""
                    leave set_off depart head_out step_out go_out slip_away slip_out wander_off
                    stride_off sneak_out hurry_off move_on
                """),
            },
            past=PredicateTense(
                words=words("""
                    left set_off departed headed_out stepped_out went_out slipped_away slipped_out
                    wandered_off strode_off sneaked_out hurried_off moved_on
                """),
                forms={
                    "question": words("""
                        leave set_off depart head_out step_out go_out slip_away slip_out wander_off
                        stride_off sneak_out hurry_off move_on
                    """),
                },
            ),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            requires="destination",
            words=words("""
                returns comes_back gets_back heads_back comes gets makes_it goes_back turns_back
                drifts_back hurries_back comes_over
            """),
            forms={
                "question": words("""
                    return come_back get_back head_back come get make_it go_back turn_back
                    drift_back hurry_back come_over
                """),
            },
            past=PredicateTense(
                words=words("""
                    returned came_back got_back headed_back came got made_it went_back turned_back
                    drifted_back hurried_back came_over
                """),
                forms={
                    "question": words("""
                        return come_back get_back head_back come get make_it go_back turn_back
                        drift_back hurry_back come_over
                    """),
                },
            ),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            words=words("""
                arrives comes_home returns gets_home turns_up shows_up gets_in reappears comes_in
                settles_in heads_home makes_it_home
            """),
            forms={
                "question": words("""
                    arrive come_home return get_home turn_up show_up get_in reappear come_in
                    settle_in head_home make_it_home
                """),
            },
            past=PredicateTense(
                words=words("""
                    arrived came_home returned got_home turned_up showed_up got_in reappeared
                    came_in settled_in headed_home made_it_home
                """),
                forms={
                    "question": words("""
                        arrive come_home return get_home turn_up show_up get_in reappear come_in
                        settle_in head_home make_it_home
                    """),
                },
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_without=("swimmer", "crawler"),
            words=words("""
                runs walks leaps strolls roams paces jogs trots marches hops sprints dashes stomps
                tiptoes ambles wanders_about scampers scurries prances struts limps saunters strides
                plods trudges
            """),
            forms={
                "question": words("""
                    run walk leap stroll roam pace jog trot march hop sprint dash stomp tiptoe amble
                    wander_about scamper scurry prance strut limp saunter stride plod trudge
                """),
            },
            past=PredicateTense(
                words=words("""
                    ran walked leapt strolled roamed paced jogged trotted marched hopped sprinted
                    dashed stomped tiptoed ambled wandered_about scampered scurried pranced strutted
                    limped sauntered strode plodded trudged
                """),
                forms={
                    "question": words("""
                        run walk leap stroll roam pace jog trot march hop sprint dash stomp tiptoe
                        amble wander_about scamper scurry prance strut limp saunter stride plod
                        trudge
                    """),
                },
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            words=words("""
                wanders passes moves drifts turns circles slips_by moves_along darts glides twists
            """),
            forms={
                "question": words("""
                    wander pass move drift turn circle slip_by move_along dart glide twist
                """),
            },
            past=PredicateTense(
                words=words("""
                    wandered passed moved drifted turned circled slipped_by moved_along darted
                    glided twisted
                """),
                forms={
                    "question": words("""
                        wander pass move drift turn circle slip_by move_along dart glide twist
                    """),
                },
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("swimmer",),
            words=words("swims paddles dives splashes floats surfaces swims_about swims_by"),
            forms={
                "question": words("swim paddle dive splash float surface swim_about swim_by"),
            },
            past=PredicateTense(
                words=words("swam paddled dove splashed floated surfaced swam_about swam_by"),
                forms={
                    "question": words("swim paddle dive splash float surface swim_about swim_by"),
                },
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature",),
            subject_traits=("flier",),
            words=words("""
                flies soars flutters flaps takes_off glides swoops hovers circles_overhead lands
                alights flits flies_off flies_by perches
            """),
            forms={
                "question": words("""
                    fly soar flutter flap take_off glide swoop hover circle_overhead land alight
                    flit fly_off fly_by perch
                """),
            },
            past=PredicateTense(
                words=words("""
                    flew soared fluttered flapped took_off glided swooped hovered circled_overhead
                    landed alighted flitted flew_off flew_by perched
                """),
                forms={
                    "question": words("""
                        fly soar flutter flap take_off glide swoop hover circle_overhead land alight
                        flit fly_off fly_by perch
                    """),
                },
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("crawler",),
            words=words("""
                crawls creeps wriggles inches_along crawls_about squirms coils burrows slithers
            """),
            forms={
                "question": words("""
                    crawl creep wriggle inch_along crawl_about squirm coil burrow slither
                """),
            },
            past=PredicateTense(
                words=words("""
                    crawled crept wriggled inched_along crawled_about squirmed coiled burrowed
                    slithered
                """),
                forms={
                    "question": words("""
                        crawl creep wriggle inch_along crawl_about squirm coil burrow slither
                    """),
                },
            ),
        ),
        VerbGroup(
            field="wait",
            subject=("creature", "person"),
            words=words("""
                waits hides lingers looks_around hesitates pauses stops listens waits_around
                holds_back hangs_back stands_still keeps_still idles loiters halts peeks_out
                glances_around stands_by dawdles
            """),
            forms={
                "question": words("""
                    wait hide linger look_around hesitate pause stop listen wait_around hold_back
                    hang_back stand_still keep_still idle loiter halt peek_out glance_around
                    stand_by dawdle
                """),
            },
            past=PredicateTense(
                words=words("""
                    waited hid lingered looked_around hesitated paused stopped listened
                    waited_around held_back hung_back stood_still kept_still idled loitered halted
                    peeked_out glanced_around stood_by dawdled
                """),
                forms={
                    "question": words("""
                        wait hide linger look_around hesitate pause stop listen wait_around
                        hold_back hang_back stand_still keep_still idle loiter halt peek_out
                        glance_around stand_by dawdle
                    """),
                },
            ),
        ),
        VerbGroup(
            field="rest",
            subject=("creature", "person"),
            words=words("""
                rests sits lies_down leans curls_up stretches_out settles_down reclines sprawls
                lounges relaxes sits_down sits_back lies_back kneels crouches squats perches slumps
                unwinds takes_a_break
            """),
            forms={
                "question": words("""
                    rest sit lie_down lean curl_up stretch_out settle_down recline sprawl lounge
                    relax sit_down sit_back lie_back kneel crouch squat perch slump unwind
                    take_a_break
                """),
            },
            past=PredicateTense(
                words=words("""
                    rested sat lay_down leaned curled_up stretched_out settled_down reclined
                    sprawled lounged relaxed sat_down sat_back lay_back knelt crouched squatted
                    perched slumped unwound took_a_break
                """),
                forms={
                    "question": words("""
                        rest sit lie_down lean curl_up stretch_out settle_down recline sprawl lounge
                        relax sit_down sit_back lie_back kneel crouch squat perch slump unwind
                        take_a_break
                    """),
                },
            ),
        ),
        VerbGroup(
            field="sleep",
            subject=("creature", "person"),
            words=words("""
                sleeps dozes falls_asleep nods_off naps snoozes drifts_off dozes_off slumbers
                drowses sleeps_in drops_off nods drifts_to_sleep snores
            """),
            forms={
                "question": words("""
                    sleep doze fall_asleep nod_off nap snooze drift_off doze_off slumber drowse
                    sleep_in drop_off nod drift_to_sleep snore
                """),
            },
            past=PredicateTense(
                words=words("""
                    slept dozed fell_asleep nodded_off napped snoozed drifted_off dozed_off
                    slumbered drowsed slept_in dropped_off nodded drifted_to_sleep snored
                """),
                forms={
                    "question": words("""
                        sleep doze fall_asleep nod_off nap snooze drift_off doze_off slumber drowse
                        sleep_in drop_off nod drift_to_sleep snore
                    """),
                },
            ),
        ),
        VerbGroup(
            field="express",
            subject=("creature", "person"),
            words=words("""
                laughs cries yawns sighs smiles hums mutters shouts giggles chuckles grins sobs
                weeps groans grumbles whistles whimpers snorts cheers gasps shrugs nods frowns beams
                sniffles sneezes hiccups claps winks blushes
            """),
            forms={
                "question": words("""
                    laugh cry yawn sigh smile hum mutter shout giggle chuckle grin sob weep groan
                    grumble whistle whimper snort cheer gasp shrug nod frown beam sniffle sneeze
                    hiccup clap wink blush
                """),
            },
            past=PredicateTense(
                words=words("""
                    laughed cried yawned sighed smiled hummed muttered shouted giggled chuckled
                    grinned sobbed wept groaned grumbled whistled whimpered snorted cheered gasped
                    shrugged nodded frowned beamed sniffled sneezed hiccuped clapped winked blushed
                """),
                forms={
                    "question": words("""
                        laugh cry yawn sigh smile hum mutter shout giggle chuckle grin sob weep
                        groan grumble whistle whimper snort cheer gasp shrug nod frown beam sniffle
                        sneeze hiccup clap wink blush
                    """),
                },
            ),
        ),
        VerbGroup(
            field="talk",
            subject=("creature", "person"),
            words=words("""
                chats talks chatters speaks converses gossips babbles jabbers natters prattles
                whispers murmurs rambles chats_away talks_on
            """),
            forms={
                "question": words("""
                    chat talk chatter speak converse gossip babble jabber natter prattle whisper
                    murmur ramble chat_away talk_on
                """),
            },
            past=PredicateTense(
                words=words("""
                    chatted talked chattered spoke conversed gossiped babbled jabbered nattered
                    prattled whispered murmured rambled chatted_away talked_on
                """),
                forms={
                    "question": words("""
                        chat talk chatter speak converse gossip babble jabber natter prattle whisper
                        murmur ramble chat_away talk_on
                    """),
                },
            ),
        ),
        VerbGroup(
            field="play",
            subject=("creature", "person"),
            words=words("""
                dances sings tumbles frolics plays bounces skips romps skips_about capers gambols
                hops_about leaps_about rolls_about twirls spins cavorts jumps_around plays_about
                fools_around larks_about horses_around
            """),
            forms={
                "question": words("""
                    dance sing tumble frolic play bounce skip romp skip_about caper gambol hop_about
                    leap_about roll_about twirl spin cavort jump_around play_about fool_around
                    lark_about horse_around
                """),
            },
            past=PredicateTense(
                words=words("""
                    danced sang tumbled frolicked played bounced skipped romped skipped_about
                    capered gamboled hopped_about leapt_about rolled_about twirled spun cavorted
                    jumped_around played_about fooled_around larked_about horsed_around
                """),
                forms={
                    "question": words("""
                        dance sing tumble frolic play bounce skip romp skip_about caper gambol
                        hop_about leap_about roll_about twirl spin cavort jump_around play_about
                        fool_around lark_about horse_around
                    """),
                },
            ),
        ),
        VerbGroup(
            field="think",
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("""
                remembers forgets imagines counts recalls misses wonders_about considers ponders
                recollects pictures dreams_of dreams_about thinks_of thinks_about believes_in
                longs_for yearns_for worries_about muses_on reflects_on dwells_on contemplates
                fancies envisions
            """),
            forms={
                "question": words("""
                    remember forget imagine count recall miss wonder_about consider ponder recollect
                    picture dream_of dream_about think_of think_about believe_in long_for yearn_for
                    worry_about muse_on reflect_on dwell_on contemplate fancy envision
                """),
            },
            past=PredicateTense(
                words=words("""
                    remembered forgot imagined counted recalled missed wondered_about considered
                    pondered recollected pictured dreamed_of dreamed_about thought_of thought_about
                    believed_in longed_for yearned_for worried_about mused_on reflected_on dwelt_on
                    contemplated fancied envisioned
                """),
                forms={
                    "question": words("""
                        remember forget imagine count recall miss wonder_about consider ponder
                        recollect picture dream_of dream_about think_of think_about believe_in
                        long_for yearn_for worry_about muse_on reflect_on dwell_on contemplate fancy
                        envision
                    """),
                },
            ),
        ),
        VerbGroup(
            field="look",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                watches looks_at studies examines admires touches strokes eyes inspects gazes_at
                stares_at peers_at glances_at scans surveys checks pokes prods pats sniffs handles
                feels fingers turns_over looks_over sizes_up observes regards
            """),
            forms={
                "question": words("""
                    watch look_at study examine admire touch stroke eye inspect gaze_at stare_at
                    peer_at glance_at scan survey check poke prod pat sniff handle feel finger
                    turn_over look_over size_up observe regard
                """),
            },
            past=PredicateTense(
                words=words("""
                    watched looked_at studied examined admired touched stroked eyed inspected
                    gazed_at stared_at peered_at glanced_at scanned surveyed checked poked prodded
                    patted sniffed handled felt fingered turned_over looked_over sized_up observed
                    regarded
                """),
                forms={
                    "question": words("""
                        watch look_at study examine admire touch stroke eye inspect gaze_at stare_at
                        peer_at glance_at scan survey check poke prod pat sniff handle feel finger
                        turn_over look_over size_up observe regard
                    """),
                },
            ),
        ),
        VerbGroup(
            field="search",
            subject=("creature", "person"),
            words=words("""
                searches looks_around rummages hunts_around scours forages digs_around pokes_around
                noses_around casts_about roots_around ferrets_about explores prowls scouts_around
                looks_about hunts
            """),
            forms={
                "question": words("""
                    search look_around rummage hunt_around scour forage dig_around poke_around
                    nose_around cast_about root_around ferret_about explore prowl scout_around
                    look_about hunt
                """),
            },
            past=PredicateTense(
                words=words("""
                    searched looked_around rummaged hunted_around scoured foraged dug_around
                    poked_around nosed_around cast_about rooted_around ferreted_about explored
                    prowled scouted_around looked_about hunted
                """),
                forms={
                    "question": words("""
                        search look_around rummage hunt_around scour forage dig_around poke_around
                        nose_around cast_about root_around ferret_about explore prowl scout_around
                        look_about hunt
                    """),
                },
            ),
        ),
        VerbGroup(
            field="find",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                finds discovers spots picks_up comes_across uncovers unearths locates stumbles_on
                stumbles_upon happens_upon retrieves recovers digs_up fishes_out turns_up scoops_up
                snatches_up
            """),
            forms={
                "question": words("""
                    find discover spot pick_up come_across uncover unearth locate stumble_on
                    stumble_upon happen_upon retrieve recover dig_up fish_out turn_up scoop_up
                    snatch_up
                """),
            },
            past=PredicateTense(
                words=words("""
                    found discovered spotted picked_up came_across uncovered unearthed located
                    stumbled_on stumbled_upon happened_upon retrieved recovered dug_up fished_out
                    turned_up scooped_up snatched_up
                """),
                forms={
                    "question": words("""
                        find discover spot pick_up come_across uncover unearth locate stumble_on
                        stumble_upon happen_upon retrieve recover dig_up fish_out turn_up scoop_up
                        snatch_up
                    """),
                },
            ),
        ),
        VerbGroup(
            field="take",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                takes picks grabs gathers chooses gets seizes snatches clutches grips holds lifts
                collects selects picks_out gathers_up takes_up takes_hold_of accepts receives
                obtains acquires claims pockets bags hoists
            """),
            forms={
                "question": words("""
                    take pick grab gather choose get seize snatch clutch grip hold lift collect
                    select pick_out gather_up take_up take_hold_of accept receive obtain acquire
                    claim pocket bag hoist
                """),
            },
            past=PredicateTense(
                words=words("""
                    took picked grabbed gathered chose got seized snatched clutched gripped held
                    lifted collected selected picked_out gathered_up took_up took_hold_of accepted
                    received obtained acquired claimed pocketed bagged hoisted
                """),
                forms={
                    "question": words("""
                        take pick grab gather choose get seize snatch clutch grip hold lift collect
                        select pick_out gather_up take_up take_hold_of accept receive obtain acquire
                        claim pocket bag hoist
                    """),
                },
            ),
        ),
        VerbGroup(
            field="carry",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                carries brings hauls lugs totes drags tows shoulders bears transports fetches
                ferries hauls_along carries_off carries_along brings_along takes_along drags_along
            """),
            forms={
                "question": words("""
                    carry bring haul lug tote drag tow shoulder bear transport fetch ferry
                    haul_along carry_off carry_along bring_along take_along drag_along
                """),
            },
            past=PredicateTense(
                words=words("""
                    carried brought hauled lugged toted dragged towed shouldered bore transported
                    fetched ferried hauled_along carried_off carried_along brought_along took_along
                    dragged_along
                """),
                forms={
                    "question": words("""
                        carry bring haul lug tote drag tow shoulder bear transport fetch ferry
                        haul_along carry_off carry_along bring_along take_along drag_along
                    """),
                },
            ),
        ),
        VerbGroup(
            field="hide",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                hides tucks_away stores puts_away keeps buries stashes conceals stows squirrels_away
                hoards locks_away packs_away sets_aside puts_aside tucks_in covers_up wraps_up
                stores_away hides_away salts_away keeps_back saves
            """),
            forms={
                "question": words("""
                    hide tuck_away store put_away keep bury stash conceal stow squirrel_away hoard
                    lock_away pack_away set_aside put_aside tuck_in cover_up wrap_up store_away
                    hide_away salt_away keep_back save
                """),
            },
            past=PredicateTense(
                words=words("""
                    hid tucked_away stored put_away kept buried stashed concealed stowed
                    squirreled_away hoarded locked_away packed_away set_aside put_aside tucked_in
                    covered_up wrapped_up stored_away hid_away salted_away kept_back saved
                """),
                forms={
                    "question": words("""
                        hide tuck_away store put_away keep bury stash conceal stow squirrel_away
                        hoard lock_away pack_away set_aside put_aside tuck_in cover_up wrap_up
                        store_away hide_away salt_away keep_back save
                    """),
                },
            ),
        ),
        VerbGroup(
            field="lose",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                loses drops misplaces mislays leaves_behind forgets lets_slip lets_fall fumbles
                lets_go_of loses_track_of
            """),
            forms={
                "question": words("""
                    lose drop misplace mislay leave_behind forget let_slip let_fall fumble let_go_of
                    lose_track_of
                """),
            },
            past=PredicateTense(
                words=words("""
                    lost dropped misplaced mislaid left_behind forgot let_slip let_fall fumbled
                    let_go_of lost_track_of
                """),
                forms={
                    "question": words("""
                        lose drop misplace mislay leave_behind forget let_slip let_fall fumble
                        let_go_of lose_track_of
                    """),
                },
            ),
        ),
        VerbGroup(
            field="meet",
            subject=("creature", "person"),
            object=("person",),
            words=words("""
                meets runs_into greets bumps_into encounters comes_upon catches_up_with joins
                welcomes visits calls_on drops_in_on sees waves_to nods_to hugs
            """),
            forms={
                "question": words("""
                    meet run_into greet bump_into encounter come_upon catch_up_with join welcome
                    visit call_on drop_in_on see wave_to nod_to hug
                """),
            },
            past=PredicateTense(
                words=words("""
                    met ran_into greeted bumped_into encountered came_upon caught_up_with joined
                    welcomed visited called_on dropped_in_on saw waved_to nodded_to hugged
                """),
                forms={
                    "question": words("""
                        meet run_into greet bump_into encounter come_upon catch_up_with join welcome
                        visit call_on drop_in_on see wave_to nod_to hug
                    """),
                },
            ),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                makes builds crafts carves paints weaves shapes assembles fashions designs
                constructs puts_together pieces_together draws sketches invents devises creates
                produces finishes
            """),
            forms={
                "question": words("""
                    make build craft carve paint weave shape assemble fashion design construct
                    put_together piece_together draw sketch invent devise create produce finish
                """),
            },
            past=PredicateTense(
                words=words("""
                    made built crafted carved painted wove shaped assembled fashioned designed
                    constructed put_together pieced_together drew sketched invented devised created
                    produced finished
                """),
                forms={
                    "question": words("""
                        make build craft carve paint weave shape assemble fashion design construct
                        put_together piece_together draw sketch invent devise create produce finish
                    """),
                },
            ),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing", "vehicle"),
            object_themes=("object", "tool", "vehicle"),
            words=words("forges casts hammers_out welds rivets bolts_together"),
            forms={
                "question": words("forge cast hammer_out weld rivet bolt_together"),
            },
            past=PredicateTense(
                words=words("forged cast hammered_out welded riveted bolted_together"),
                forms={
                    "question": words("forge cast hammer_out weld rivet bolt_together"),
                },
            ),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing",),
            object_themes=("clothing",),
            words=words("knits sews stitches tailors embroiders hems darns"),
            forms={
                "question": words("knit sew stitch tailor embroider hem darn"),
            },
            past=PredicateTense(
                words=words("knitted sewed stitched tailored embroidered hemmed darned"),
                forms={
                    "question": words("knit sew stitch tailor embroider hem darn"),
                },
            ),
        ),
        VerbGroup(
            field="tend",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                mends cleans polishes fixes tidies oils repairs scrubs wipes dusts adjusts tightens
                patches restores brushes rinses washes sorts_out looks_after cares_for maintains
                buffs shines
            """),
            forms={
                "question": words("""
                    mend clean polish fix tidy oil repair scrub wipe dust adjust tighten patch
                    restore brush rinse wash sort_out look_after care_for maintain buff shine
                """),
            },
            past=PredicateTense(
                words=words("""
                    mended cleaned polished fixed tidied oiled repaired scrubbed wiped dusted
                    adjusted tightened patched restored brushed rinsed washed sorted_out
                    looked_after cared_for maintained buffed shined
                """),
                forms={
                    "question": words("""
                        mend clean polish fix tidy oil repair scrub wipe dust adjust tighten patch
                        restore brush rinse wash sort_out look_after care_for maintain buff shine
                    """),
                },
            ),
        ),
        VerbGroup(
            field="sell",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                sells hands_over trades_away offers peddles hawks auctions trades sells_off
                parts_with passes_on hands_on lets_go_of markets unloads exchanges bargains_away
            """),
            forms={
                "question": words("""
                    sell hand_over trade_away offer peddle hawk auction trade sell_off part_with
                    pass_on hand_on let_go_of market unload exchange bargain_away
                """),
            },
            past=PredicateTense(
                words=words("""
                    sold handed_over traded_away offered peddled hawked auctioned traded sold_off
                    parted_with passed_on handed_on let_go_of marketed unloaded exchanged
                    bargained_away
                """),
                forms={
                    "question": words("""
                        sell hand_over trade_away offer peddle hawk auction trade sell_off part_with
                        pass_on hand_on let_go_of market unload exchange bargain_away
                    """),
                },
            ),
        ),
        VerbGroup(
            field="buy",
            subject=("person",),
            object=("thing", "vehicle", "edible"),
            words=words("""
                buys purchases picks_up orders acquires pays_for gets shops_for splurges_on snaps_up
                bargains_for haggles_over stocks_up_on picks_out invests_in
            """),
            forms={
                "question": words("""
                    buy purchase pick_up order acquire pay_for get shop_for splurge_on snap_up
                    bargain_for haggle_over stock_up_on pick_out invest_in
                """),
            },
            past=PredicateTense(
                words=words("""
                    bought purchased picked_up ordered acquired paid_for got shopped_for splurged_on
                    snapped_up bargained_for haggled_over stocked_up_on picked_out invested_in
                """),
                forms={
                    "question": words("""
                        buy purchase pick_up order acquire pay_for get shop_for splurge_on snap_up
                        bargain_for haggle_over stock_up_on pick_out invest_in
                    """),
                },
            ),
        ),
        VerbGroup(
            field="cook",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("""
                warms cooks serves prepares heats reheats seasons plates fixes_up dishes_up whips_up
                rustles_up makes cooks_up garnishes salts peppers spices sweetens
            """),
            forms={
                "question": words("""
                    warm cook serve prepare heat reheat season plate fix_up dish_up whip_up
                    rustle_up make cook_up garnish salt pepper spice sweeten
                """),
            },
            past=PredicateTense(
                words=words("""
                    warmed cooked served prepared heated reheated seasoned plated fixed_up dished_up
                    whipped_up rustled_up made cooked_up garnished salted peppered spiced sweetened
                """),
                forms={
                    "question": words("""
                        warm cook serve prepare heat reheat season plate fix_up dish_up whip_up
                        rustle_up make cook_up garnish salt pepper spice sweeten
                    """),
                },
            ),
        ),
        VerbGroup(
            field="cook",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            object_traits=("raw",),
            words=words("""
                bakes roasts grills fries slices chops peels dices minces grates shreds sears browns
                steams broils barbecues marinates skewers
            """),
            forms={
                "question": words("""
                    bake roast grill fry slice chop peel dice mince grate shred sear brown steam
                    broil barbecue marinate skewer
                """),
            },
            past=PredicateTense(
                words=words("""
                    baked roasted grilled fried sliced chopped peeled diced minced grated shredded
                    seared browned steamed broiled barbecued marinated skewered
                """),
                forms={
                    "question": words("""
                        bake roast grill fry slice chop peel dice mince grate shred sear brown steam
                        broil barbecue marinate skewer
                    """),
                },
            ),
        ),
        VerbGroup(
            field="cook",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            object_traits=("liquid",),
            words=words("""
                stirs simmers boils ladles stews pours spoons_out whisks blends thickens reduces
                heats_up warms_up dishes_out
            """),
            forms={
                "question": words("""
                    stir simmer boil ladle stew pour spoon_out whisk blend thicken reduce heat_up
                    warm_up dish_out
                """),
            },
            past=PredicateTense(
                words=words("""
                    stirred simmered boiled ladled stewed poured spooned_out whisked blended
                    thickened reduced heated_up warmed_up dished_out
                """),
                forms={
                    "question": words("""
                        stir simmer boil ladle stew pour spoon_out whisk blend thicken reduce
                        heat_up warm_up dish_out
                    """),
                },
            ),
        ),
        VerbGroup(
            field="eat",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("""
                eats tastes swallows devours finishes gobbles wolfs_down scoffs polishes_off bolts
                tucks_into samples savors digs_into feasts_on snacks_on picks_at gulps_down downs
            """),
            forms={
                "question": words("""
                    eat taste swallow devour finish gobble wolf_down scoff polish_off bolt tuck_into
                    sample savor dig_into feast_on snack_on pick_at gulp_down down
                """),
            },
            past=PredicateTense(
                words=words("""
                    ate tasted swallowed devoured finished gobbled wolfed_down scoffed polished_off
                    bolted tucked_into sampled savored dug_into feasted_on snacked_on picked_at
                    gulped_down downed
                """),
                forms={
                    "question": words("""
                        eat taste swallow devour finish gobble wolf_down scoff polish_off bolt
                        tuck_into sample savor dig_into feast_on snack_on pick_at gulp_down down
                    """),
                },
            ),
        ),
        VerbGroup(
            field="eat",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            object_without=("liquid",),
            words=words("""
                chews bites nibbles crunches munches gnaws crunches_on chomps chews_on bites_into
                tears_into licks nibbles_at
            """),
            forms={
                "question": words("""
                    chew bite nibble crunch munch gnaw crunch_on chomp chew_on bite_into tear_into
                    lick nibble_at
                """),
            },
            past=PredicateTense(
                words=words("""
                    chewed bit nibbled crunched munched gnawed crunched_on chomped chewed_on
                    bit_into tore_into licked nibbled_at
                """),
                forms={
                    "question": words("""
                        chew bite nibble crunch munch gnaw crunch_on chomp chew_on bite_into
                        tear_into lick nibble_at
                    """),
                },
            ),
        ),
        VerbGroup(
            field="eat",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            object_traits=("liquid",),
            words=words("sips slurps spoons spoons_up laps_up sups sucks_up scoops_up"),
            forms={
                "question": words("sip slurp spoon spoon_up lap_up sup suck_up scoop_up"),
            },
            past=PredicateTense(
                words=words("""
                    sipped slurped spooned spooned_up lapped_up supped sucked_up scooped_up
                """),
                forms={
                    "question": words("sip slurp spoon spoon_up lap_up sup suck_up scoop_up"),
                },
            ),
        ),
        VerbGroup(
            field="drink",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("drink",),
            words=words("""
                drinks sips gulps savors swigs downs quaffs slurps laps_up drains gulps_down sips_at
                nurses tastes swallows knocks_back polishes_off
            """),
            forms={
                "question": words("""
                    drink sip gulp savor swig down quaff slurp lap_up drain gulp_down sip_at nurse
                    taste swallow knock_back polish_off
                """),
            },
            past=PredicateTense(
                words=words("""
                    drank sipped gulped savored swigged downed quaffed slurped lapped_up drained
                    gulped_down sipped_at nursed tasted swallowed knocked_back polished_off
                """),
                forms={
                    "question": words("""
                        drink sip gulp savor swig down quaff slurp lap_up drain gulp_down sip_at
                        nurse taste swallow knock_back polish_off
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("place",),
            words=words("""
                quiets darkens brightens empties fills_up glows stirs wakes falls_silent falls_still
                hushes settles comes_alive livens_up bustles hums buzzes sleeps dims lights_up
                shimmers glistens freezes_over thaws warms cools floods drains fades sparkles
                crowds_up empties_out
            """),
            forms={
                "question": words("""
                    quiet darken brighten empty fill_up glow stir wake fall_silent fall_still hush
                    settle come_alive liven_up bustle hum buzz sleep dim light_up shimmer glisten
                    freeze_over thaw warm cool flood drain fade sparkle crowd_up empty_out
                """),
            },
            past=PredicateTense(
                words=words("""
                    quieted darkened brightened emptied filled_up glowed stirred woke fell_silent
                    fell_still hushed settled came_alive livened_up bustled hummed buzzed slept
                    dimmed lit_up shimmered glistened froze_over thawed warmed cooled flooded
                    drained faded sparkled crowded_up emptied_out
                """),
                forms={
                    "question": words("""
                        quiet darken brighten empty fill_up glow stir wake fall_silent fall_still
                        hush settle come_alive liven_up bustle hum buzz sleep dim light_up shimmer
                        glisten freeze_over thaw warm cool flood drain fade sparkle crowd_up
                        empty_out
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            words=words("""
                glows flows fades deepens begins ends passes lingers unfolds draws_on wears_on
                drags_on goes_on carries_on winds_down dies_down builds gathers approaches nears
            """),
            forms={
                "question": words("""
                    glow flow fade deepen begin end pass linger unfold draw_on wear_on drag_on go_on
                    carry_on wind_down die_down build gather approach near
                """),
            },
            past=PredicateTense(
                words=words("""
                    glowed flowed faded deepened began ended passed lingered unfolded drew_on
                    wore_on dragged_on went_on carried_on wound_down died_down built gathered
                    approached neared
                """),
                forms={
                    "question": words("""
                        glow flow fade deepen begin end pass linger unfold draw_on wear_on drag_on
                        go_on carry_on wind_down die_down build gather approach near
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            subject_themes=("time",),
            words=words("""
                dawns breaks wanes wears_away slips_by creeps_on turns settles_in draws_in
                draws_to_a_close
            """),
            forms={
                "question": words("""
                    dawn break wane wear_away slip_by creep_on turn settle_in draw_in
                    draw_to_a_close
                """),
            },
            past=PredicateTense(
                words=words("""
                    dawned broke waned wore_away slipped_by crept_on turned settled_in drew_in
                    drew_to_a_close
                """),
                forms={
                    "question": words("""
                        dawn break wane wear_away slip_by creep_on turn settle_in draw_in
                        draw_to_a_close
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            subject_themes=("weather",),
            words=words("""
                rolls_in sets_in blows_over clears lets_up eases picks_up sweeps_through moves_in
            """),
            forms={
                "question": words("""
                    roll_in set_in blow_over clear let_up ease pick_up sweep_through move_in
                """),
            },
            past=PredicateTense(
                words=words("""
                    rolled_in set_in blew_over cleared let_up eased picked_up swept_through moved_in
                """),
                forms={
                    "question": words("""
                        roll_in set_in blow_over clear let_up ease pick_up sweep_through move_in
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            subject_themes=("sport",),
            words=words("""
                kicks_off starts gets_underway heats_up wraps_up goes_ahead resumes runs_late
                overruns
            """),
            forms={
                "question": words("""
                    kick_off start get_underway heat_up wrap_up go_ahead resume run_late overrun
                """),
            },
            past=PredicateTense(
                words=words("""
                    kicked_off started got_underway heated_up wrapped_up went_ahead resumed ran_late
                    overran
                """),
                forms={
                    "question": words("""
                        kick_off start get_underway heat_up wrap_up go_ahead resume run_late overrun
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("thing", "vehicle"),
            subject_themes=("object", "tool", "clothing", "product", "gem", "vehicle"),
            words=words("""
                sways glitters falls rolls tilts ages creaks shines gleams wobbles teeters topples
                tumbles slips slides drops spins turns settles shifts fades wears dulls
            """),
            forms={
                "question": words("""
                    sway glitter fall roll tilt age creak shine gleam wobble teeter topple tumble
                    slip slide drop spin turn settle shift fade wear dull
                """),
            },
            past=PredicateTense(
                words=words("""
                    swayed glittered fell rolled tilted aged creaked shone gleamed wobbled teetered
                    toppled tumbled slipped slid dropped spun turned settled shifted faded wore
                    dulled
                """),
                forms={
                    "question": words("""
                        sway glitter fall roll tilt age creak shine gleam wobble teeter topple
                        tumble slip slide drop spin turn settle shift fade wear dull
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("thing", "vehicle"),
            subject_themes=("object", "tool", "vehicle"),
            words=words("""
                rattles clatters rusts cracks breaks snaps jams sticks squeaks clanks
            """),
            forms={
                "question": words("rattle clatter rust crack break snap jam stick squeak clank"),
            },
            past=PredicateTense(
                words=words("""
                    rattled clattered rusted cracked broke snapped jammed stuck squeaked clanked
                """),
                forms={
                    "question": words(
                        "rattle clatter rust crack break snap jam stick squeak clank"
                    ),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("thing",),
            subject_themes=("music",),
            words=words("""
                plays rings_out drifts swells fades_out echoes carries floats sounds resounds
                lingers dies_away builds stops
            """),
            forms={
                "question": words("""
                    play ring_out drift swell fade_out echo carry float sound resound linger
                    die_away build stop
                """),
            },
            past=PredicateTense(
                words=words("""
                    played rang_out drifted swelled faded_out echoed carried floated sounded
                    resounded lingered died_away built stopped
                """),
                forms={
                    "question": words("""
                        play ring_out drift swell fade_out echo carry float sound resound linger
                        die_away build stop
                    """),
                },
            ),
        ),
        VerbGroup(
            field="move",
            subject=("vehicle",),
            words=words("""
                runs stops passes returns departs slides rolls glides speeds rumbles rattles_along
                trundles cruises drives_by pulls_in pulls_out pulls_up sets_off arrives turns
                swerves brakes idles crawls_along zooms roars_past coasts drifts
            """),
            forms={
                "question": words("""
                    run stop pass return depart slide roll glide speed rumble rattle_along trundle
                    cruise drive_by pull_in pull_out pull_up set_off arrive turn swerve brake idle
                    crawl_along zoom roar_past coast drift
                """),
            },
            past=PredicateTense(
                words=words("""
                    ran stopped passed returned departed slid rolled glided sped rumbled
                    rattled_along trundled cruised drove_by pulled_in pulled_out pulled_up set_off
                    arrived turned swerved braked idled crawled_along zoomed roared_past coasted
                    drifted
                """),
                forms={
                    "question": words("""
                        run stop pass return depart slide roll glide speed rumble rattle_along
                        trundle cruise drive_by pull_in pull_out pull_up set_off arrive turn swerve
                        brake idle crawl_along zoom roar_past coast drift
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("idea", "event"),
            words=words("""
                spreads vanishes remains lingers returns gathers grows fades deepens surfaces stirs
                settles passes builds swells recedes drifts_back comes_back creeps_in seeps_in
                takes_hold wears_off dies_away ebbs flickers rises falls shifts
            """),
            forms={
                "question": words("""
                    spread vanish remain linger return gather grow fade deepen surface stir settle
                    pass build swell recede drift_back come_back creep_in seep_in take_hold wear_off
                    die_away ebb flicker rise fall shift
                """),
            },
            past=PredicateTense(
                words=words("""
                    spread vanished remained lingered returned gathered grew faded deepened surfaced
                    stirred settled passed built swelled receded drifted_back came_back crept_in
                    seeped_in took_hold wore_off died_away ebbed flickered rose fell shifted
                """),
                forms={
                    "question": words("""
                        spread vanish remain linger return gather grow fade deepen surface stir
                        settle pass build swell recede drift_back come_back creep_in seep_in
                        take_hold wear_off die_away ebb flicker rise fall shift
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("plant",),
            words=words("""
                grows wilts blooms sways spreads sprouts buds flowers blossoms unfurls stretches
                climbs droops withers fades thrives flourishes rustles bends leans shoots_up
                springs_up takes_root bears_fruit sheds greens turns_gold reaches_up
            """),
            forms={
                "question": words("""
                    grow wilt bloom sway spread sprout bud flower blossom unfurl stretch climb droop
                    wither fade thrive flourish rustle bend lean shoot_up spring_up take_root
                    bear_fruit shed green turn_gold reach_up
                """),
            },
            past=PredicateTense(
                words=words("""
                    grew wilted bloomed swayed spread sprouted budded flowered blossomed unfurled
                    stretched climbed drooped withered faded thrived flourished rustled bent leaned
                    shot_up sprang_up took_root bore_fruit shed greened turned_gold reached_up
                """),
                forms={
                    "question": words("""
                        grow wilt bloom sway spread sprout bud flower blossom unfurl stretch climb
                        droop wither fade thrive flourish rustle bend lean shoot_up spring_up
                        take_root bear_fruit shed green turn_gold reach_up
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("body",),
            words=words("""
                trembles moves stiffens aches heals twitches shivers tingles throbs quivers relaxes
                loosens tenses tightens warms cools numbs goes_numb swells shakes flexes stretches
                rests tires wakes settles jerks flinches sags droops
            """),
            forms={
                "question": words("""
                    tremble move stiffen ache heal twitch shiver tingle throb quiver relax loosen
                    tense tighten warm cool numb go_numb swell shake flex stretch rest tire wake
                    settle jerk flinch sag droop
                """),
            },
            past=PredicateTense(
                words=words("""
                    trembled moved stiffened ached healed twitched shivered tingled throbbed
                    quivered relaxed loosened tensed tightened warmed cooled numbed went_numb
                    swelled shook flexed stretched rested tired woke settled jerked flinched sagged
                    drooped
                """),
                forms={
                    "question": words("""
                        tremble move stiffen ache heal twitch shiver tingle throb quiver relax
                        loosen tense tighten warm cool numb go_numb swell shake flex stretch rest
                        tire wake settle jerk flinch sag droop
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            words=words("""
                ripens cools boils melts spoils remains warms steams cools_down goes_cold turns
                goes_off runs_out sits waits smells_good
            """),
            forms={
                "question": words("""
                    ripen cool boil melt spoil remain warm steam cool_down go_cold turn go_off
                    run_out sit wait smell_good
                """),
            },
            past=PredicateTense(
                words=words("""
                    ripened cooled boiled melted spoiled remained warmed steamed cooled_down
                    went_cold turned went_off ran_out sat waited smelled_good
                """),
                forms={
                    "question": words("""
                        ripen cool boil melt spoil remain warm steam cool_down go_cold turn go_off
                        run_out sit wait smell_good
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            subject_themes=("food",),
            words=words("""
                sizzles crumbles goes_stale dries_out hardens softens browns burns bakes toasts
                rises
            """),
            forms={
                "question": words("""
                    sizzle crumble go_stale dry_out harden soften brown burn bake toast rise
                """),
            },
            past=PredicateTense(
                words=words("""
                    sizzled crumbled went_stale dried_out hardened softened browned burned baked
                    toasted rose
                """),
                forms={
                    "question": words("""
                        sizzle crumble go_stale dry_out harden soften brown burn bake toast rise
                    """),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            subject_themes=("drink",),
            words=words("""
                bubbles fizzes foams froths spills sloshes swirls settles goes_flat overflows
            """),
            forms={
                "question": words("""
                    bubble fizz foam froth spill slosh swirl settle go_flat overflow
                """),
            },
            past=PredicateTense(
                words=words("""
                    bubbled fizzed foamed frothed spilled sloshed swirled settled went_flat
                    overflowed
                """),
                forms={
                    "question": words("""
                        bubble fizz foam froth spill slosh swirl settle go_flat overflow
                    """),
                },
            ),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                big small quick slow quiet loud brave lazy busy fierce gentle clever restless
            """),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="hungry",
            words=words("hungry starving peckish"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="full",
            words=words("full satisfied"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="tired",
            words=words("tired sleepy weary drowsy"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="rested",
            words=words("refreshed rested lively"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="content",
            words=words("happy glad content pleased cheerful"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="restless",
            words=words("bored curious uneasy"),
        ),
        StateGroup(
            subject=(
                "creature",
                "person",
                "plant",
                "edible",
                "thing",
                "vehicle",
                "place",
                "event",
                "idea",
                "body",
            ),
            words=words("beautiful strange new common rare"),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("wide narrow calm deep dark bright distant steep"),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("hard light heavy old smooth clear sturdy hollow"),
        ),
        StateGroup(
            subject=("edible",),
            words=words("sweet salty spicy sour hot cold nutty mild"),
        ),
        StateGroup(
            subject=("idea",),
            words=words("simple obvious vague endless fleeting stubborn"),
        ),
        StateGroup(
            subject=("plant",),
            words=words("green lush fragrant withered"),
        ),
        StateGroup(
            subject=("body",),
            words=words("warm cold sore stiff steady"),
        ),
    ),
    modifiers=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                brave lively gentle busy lazy shy clever young old small big quiet cheerful patient
                nimble curious
            """),
        ),
        ModifierGroup(
            subject=("person",),
            words=words("young kind strict earnest weary friendly"),
        ),
        ModifierGroup(
            subject=("creature",),
            words=words("swift fierce tame plump little"),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("food",),
            words=words("""
                sweet spicy warm fresh crisp savory fragrant hot salty soft ripe tasty
            """),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("drink",),
            words=words("sweet warm cold cool hot fragrant fresh strong"),
        ),
        ModifierGroup(
            subject=("thing", "vehicle"),
            words=words("""
                old new small big light heavy shiny smooth clear sturdy pretty precious ancient
            """),
        ),
        ModifierGroup(
            subject=("vehicle",),
            words=words("fast slow rattling"),
        ),
        ModifierGroup(
            subject=("place",),
            words=words("""
                quiet wide dark bright strange old cozy secluded busy silent remote distant nearby
                empty lonely sunny
            """),
        ),
        ModifierGroup(
            subject=("plant",),
            words=words("green lush fragrant young withered tall small tender fresh"),
        ),
        ModifierGroup(
            subject=("idea",),
            words=words("faint old new strange clear precious small odd vague"),
        ),
        ModifierGroup(
            subject=("event",),
            words=words("long short quiet sunny cloudy noisy sudden lazy"),
        ),
        ModifierGroup(
            subject=("body",),
            words=words("small cold warm slender sturdy tender"),
        ),
        ModifierGroup(
            subject=(
                "creature",
                "person",
                "plant",
                "thing",
                "vehicle",
                "place",
                "event",
                "idea",
                "body",
            ),
            words=words("beautiful mysterious strange new"),
        ),
    ),
    manners=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                quietly slowly quickly gently suddenly softly alone briefly boldly carefully eagerly
                warily calmly neatly warmly firmly patiently lightly wearily cheerfully idly
                restlessly gladly keenly briskly happily
            """),
        ),
        ModifierGroup(
            subject=("plant", "edible", "thing", "vehicle", "place", "event", "idea", "body"),
            words=words("""
                quietly slowly gently suddenly softly again steadily still slightly faintly evenly
                gradually little_by_little
            """),
        ),
    ),
    times=SentenceTimes(
        day=words("""
            at_dawn in_the_early_morning in_the_morning at_midday in_the_afternoon at_dusk
            in_the_evening at_night late_at_night at_midnight
        """),
        any=words("in_spring in_summer in_autumn in_winter on_weekends on_holidays all_day"),
        past=words("yesterday last_week long_ago once that_day the_night_before"),
        present=words("today just_now tomorrow next_week"),
        habitual=words("these_days sometimes every_day every_night"),
    ),
    homes=words("house cottage"),
    join=SentenceJoin(word="and"),
    connectives={
        "additive": words("and_then besides"),
        "temporal": words("meanwhile afterwards later soon at_last before_long"),
        "contrastive": words("but still however yet even_so then_again all_the_same even_then"),
        "causal": words("so therefore in_the_end"),
    },
    traits={
        "flier": words("""
            owl sparrow magpie swallow eagle falcon crane swan duck goose woodpecker parrot peacock
            butterfly moth bee dragonfly ladybug bat heron pelican raven kestrel puffin flamingo
            firefly osprey vulture condor stork ibis cormorant albatross petrel sandpiper plover
            lapwing starling finch warbler thrush cuckoo hoopoe kingfisher toucan macaw cockatoo
            canary nightingale cicada beetle dragon wyvern phoenix griffin harpy pegasus hippogriff
            roc simurgh thunderbird fairy pixie sprite sylph angel seraph valkyrie imp gargoyle
            drake peryton
        """),
        "swimmer": words("""
            whale dolphin shark turtle seal penguin frog octopus squid seahorse starfish crab shrimp
            carp salmon mackerel walrus narwhal jellyfish tadpole siren mermaid kraken leviathan
            naiad undine selkie kelpie
        """),
        "crawler": words("""
            turtle lizard chameleon snake snail ant spider crab earthworm centipede scorpion gecko
            iguana cobra python newt mantis basilisk wyrm naga amphisbaena lindworm
        """),
        "lifeless": words("""
            spell curse hex rune amulet talisman grimoire potion prophecy sorcery enchantment sigil
            glyph omen portent blessing incantation invocation summoning banishment divination
            scrying portal ley sanctum reliquary effigy idol totem phylactery charm warding
            runestone nightmare
        """),
        "liquid": words("""
            porridge stew chowder curry bisque consomme goulash congee pho ramen udon soba pudding
            custard yogurt honey syrup lemonade salsa chutney relish marmalade hummus guacamole
        """),
        "raw": words("""
            potato carrot cabbage spinach broccoli pumpkin garlic mushroom steak fillet drumstick
            brisket ribeye sirloin tenderloin sausage bacon meatball cutlet schnitzel kebab skewer
            tofu
        """),
        "placeless": words("""
            wave tide boulder pebble ember cinder earthquake echo avalanche driftwood fumarole
            stalactite stalagmite geyser star comet meteor corona zenith eclipse satellite orbit
            gravity sunspot lightyear stardust supernova quasar pulsar moonrise solarflare
            perihelion aphelion apogee perigee nadir azimuth parallax redshift starlore cosmology
            astronomy telescopy gravitas lunation sidereal ecliptic meridian solarsail starburst
            skyline
        """),
    },
    interjections=words("""
        oh, ah, wow, well, look, goodness, my, indeed, honestly, gosh, hey, whoa, dear_me,
        good_grief, alas,
    """),
    pronouns={"m": ("he",), "f": ("she",), "n": ("it",)},
    pronounless=("person",),
    object_pronouns=SentenceObjectPronouns(words={"n": ("it",)}),
    speech=SentenceSpeech(subject="I", head="am"),
    place_heads={
        "on": words("""
            bridge rooftop balcony veranda boardwalk promenade playground terrace staircase pier
            wharf quay jetty byway boulevard esplanade rampart drawbridge causeway embankment levee
            viaduct bandstand portico hillside mountain sandbank glacier reef prairie plateau steppe
            savanna sandbar shoal seabed bedrock crag spire pinnacle headland peninsula islet mesa
            butte moraine scree talus overhang moon planet asteroid moonscape exoplanet
        """),
        "at": words("""
            market station airport harbor lighthouse crossroads roundabout waypoint bazaar
            marketplace depot terminal campsite forum agora harborside gatehouse weir equator
        """),
        "under": words("""
            sky starlight moonbeam firmament starfield fullmoon newmoon halfmoon crescent overpass
            aqueduct
        """),
    },
    numeral=SentenceNumeral(
        order="before",
        counters={},
        count=(2, 12),
        currency="dollars",
        amounts=(100, 500, 1000, 5000, 12000, 25000, 50000, 100000),
        group=",",
        gap=" ",
    ),
    calendar=SentenceCalendar(
        date="MMMM D, Y",
        months=words("""
            January February March April May June July August September October November December
        """),
        clock="h:mm",
        years=(2020, 2030),
        copula=StateGroup(
            subject=("event",),
            words=words("is"),
            past=PredicateTense(
                words=words("was"),
            ),
        ),
    ),
    frames=(
        SentenceFrame(
            (
                SentencePart("date", head="on", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("clock", head="at", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("date", head="on", copula="head"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("clock", head="at", copula="head"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            20,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            18,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="in", modifiable=True),
            ),
            14,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="to", modifiable=True),
            ),
            10,
            fields=("go", "arrive"),
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="to", modifiable=True),
            ),
            5,
            fields=("go", "arrive"),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="to", modifiable=True),
                SentencePart("manner"),
            ),
            4,
            fields=("go", "arrive"),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="is", past_head="was"),
            ),
            12,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("manner"),
            ),
            10,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            8,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
                SentencePart("place", head="in", modifiable=True),
            ),
            7,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="in", modifiable=True),
            ),
            6,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
                SentencePart("manner"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("manner"),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
                SentencePart("place", head="in", modifiable=True),
            ),
            3,
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", past_head="did", modifiable=True),
                SentencePart("verb"),
            ),
            20,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", past_head="did", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            16,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="is", past_head="was", modifiable=True),
                SentencePart("state"),
            ),
            14,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", past_head="did", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="in", modifiable=True),
            ),
            12,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", past_head="did", modifiable=True),
                SentencePart("verb"),
                SentencePart("manner"),
            ),
            10,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", past_head="did", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="to", modifiable=True),
            ),
            6,
            mood="question",
            fields=("go", "arrive"),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("money"),
            ),
            6,
        ),
    ),
)
