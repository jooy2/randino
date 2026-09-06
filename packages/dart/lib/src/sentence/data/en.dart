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
      words: words(r'wakes gets_up rises stirs'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'wake get_up rise stir')},
      past: PredicateTense(
        words: words(r'woke got_up rose stirred'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'wake get_up rise stir')},
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'goes heads hurries wanders'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'go head hurry wander')},
      past: PredicateTense(
        words: words(r'went headed hurried wandered'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'go head hurry wander')},
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      requires: SentenceSlot.destination,
      words: words(r'runs walks climbs'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'run walk climb')},
      past: PredicateTense(
        words: words(r'ran walked climbed'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'run walk climb')},
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'leaves sets_off departs'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'leave set_off depart')},
      past: PredicateTense(
        words: words(r'left set_off departed'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'leave set_off depart')},
      ),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'returns comes_back gets_back heads_back'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'return come_back get_back head_back'),
      },
      past: PredicateTense(
        words: words(r'returned came_back got_back headed_back'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'return come_back get_back head_back'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'arrives comes_home returns'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'arrive come_home return')},
      past: PredicateTense(
        words: words(r'arrived came_home returned'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'arrive come_home return')},
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      words: words(r'runs walks leaps strolls roams paces'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'run walk leap stroll roam pace'),
      },
      past: PredicateTense(
        words: words(r'ran walked leapt strolled roamed paced'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'run walk leap stroll roam pace'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'wanders passes'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'wander pass')},
      past: PredicateTense(
        words: words(r'wandered passed'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'wander pass')},
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.swimmer],
      words: words(r'swims'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'swim')},
      past: PredicateTense(
        words: words(r'swam'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'swim')},
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature],
      subjectTraits: const <NounTrait>[NounTrait.flier],
      words: words(r'flies'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'fly')},
      past: PredicateTense(
        words: words(r'flew'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'fly')},
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.crawler],
      words: words(r'crawls'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'crawl')},
      past: PredicateTense(
        words: words(r'crawled'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'crawl')},
      ),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'waits hides lingers looks_around hesitates pauses stops'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'wait hide linger look_around hesitate pause stop'),
      },
      past: PredicateTense(
        words: words(r'waited hid lingered looked_around hesitated paused stopped'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'wait hide linger look_around hesitate pause stop'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'rests sits lies_down leans curls_up stretches_out'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'rest sit lie_down lean curl_up stretch_out'),
      },
      past: PredicateTense(
        words: words(r'rested sat lay_down leaned curled_up stretched_out'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'rest sit lie_down lean curl_up stretch_out'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'sleeps dozes falls_asleep nods_off'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'sleep doze fall_asleep nod_off'),
      },
      past: PredicateTense(
        words: words(r'slept dozed fell_asleep nodded_off'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'sleep doze fall_asleep nod_off'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'laughs cries yawns sighs smiles hums mutters shouts'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'laugh cry yawn sigh smile hum mutter shout'),
      },
      past: PredicateTense(
        words: words(r'laughed cried yawned sighed smiled hummed muttered shouted'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'laugh cry yawn sigh smile hum mutter shout'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.talk,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'chats talks chatters'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'chat talk chatter')},
      past: PredicateTense(
        words: words(r'chatted talked chattered'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'chat talk chatter')},
      ),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'dances sings tumbles frolics plays bounces skips'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'dance sing tumble frolic play bounce skip'),
      },
      past: PredicateTense(
        words: words(r'danced sang tumbled frolicked played bounced skipped'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'dance sing tumble frolic play bounce skip'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.think,
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'remembers forgets imagines counts recalls misses wonders_about'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'remember forget imagine count recall miss wonder_about'),
      },
      past: PredicateTense(
        words: words(r'remembered forgot imagined counted recalled missed wondered_about'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'remember forget imagine count recall miss wonder_about'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.look,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'watches looks_at studies examines admires touches strokes'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'watch look_at study examine admire touch stroke'),
      },
      past: PredicateTense(
        words: words(r'watched looked_at studied examined admired touched stroked'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'watch look_at study examine admire touch stroke'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'searches looks_around rummages hunts_around'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'search look_around rummage hunt_around'),
      },
      past: PredicateTense(
        words: words(r'searched looked_around rummaged hunted_around'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'search look_around rummage hunt_around'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.find,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'finds discovers spots picks_up comes_across'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'find discover spot pick_up come_across'),
      },
      past: PredicateTense(
        words: words(r'found discovered spotted picked_up came_across'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'find discover spot pick_up come_across'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.take,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'takes picks grabs gathers chooses gets'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'take pick grab gather choose get'),
      },
      past: PredicateTense(
        words: words(r'took picked grabbed gathered chose got'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'take pick grab gather choose get'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.carry,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'carries brings hauls lugs'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'carry bring haul lug')},
      past: PredicateTense(
        words: words(r'carried brought hauled lugged'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'carry bring haul lug')},
      ),
    ),
    VerbGroup(
      field: VerbField.hide,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'hides tucks_away stores puts_away keeps buries'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'hide tuck_away store put_away keep bury'),
      },
      past: PredicateTense(
        words: words(r'hid tucked_away stored put_away kept buried'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'hide tuck_away store put_away keep bury'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.lose,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'loses drops misplaces'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'lose drop misplace')},
      past: PredicateTense(
        words: words(r'lost dropped misplaced'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'lose drop misplace')},
      ),
    ),
    VerbGroup(
      field: VerbField.meet,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.person],
      words: words(r'meets runs_into greets'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'meet run_into greet')},
      past: PredicateTense(
        words: words(r'met ran_into greeted'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'meet run_into greet')},
      ),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'makes builds crafts carves paints weaves shapes'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'make build craft carve paint weave shape'),
      },
      past: PredicateTense(
        words: words(r'made built crafted carved painted wove shaped'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'make build craft carve paint weave shape'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.tend,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'mends cleans polishes fixes tidies oils'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'mend clean polish fix tidy oil'),
      },
      past: PredicateTense(
        words: words(r'mended cleaned polished fixed tidied oiled'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'mend clean polish fix tidy oil'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.sell,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'sells hands_over trades_away offers'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'sell hand_over trade_away offer'),
      },
      past: PredicateTense(
        words: words(r'sold handed_over traded_away offered'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'sell hand_over trade_away offer'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.buy,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle, NounClass.edible],
      words: words(r'buys purchases picks_up orders'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'buy purchase pick_up order'),
      },
      past: PredicateTense(
        words: words(r'bought purchased picked_up ordered'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'buy purchase pick_up order'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.cook,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'bakes warms cooks slices roasts serves'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'bake warm cook slice roast serve'),
      },
      past: PredicateTense(
        words: words(r'baked warmed cooked sliced roasted served'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'bake warm cook slice roast serve'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.eat,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'eats chews swallows tastes nibbles devours'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'eat chew swallow taste nibble devour'),
      },
      past: PredicateTense(
        words: words(r'ate chewed swallowed tasted nibbled devoured'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'eat chew swallow taste nibble devour'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.drink,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'drinks sips gulps savors'),
      forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'drink sip gulp savor')},
      past: PredicateTense(
        words: words(r'drank sipped gulped savored'),
        forms: <PredicateForm, WordPool>{PredicateForm.question: words(r'drink sip gulp savor')},
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'quiets darkens brightens empties fills_up glows'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'quiet darken brighten empty fill_up glow'),
      },
      past: PredicateTense(
        words: words(r'quieted darkened brightened emptied filled_up glowed'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'quiet darken brighten empty fill_up glow'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'glows flows fades deepens begins ends passes'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'glow flow fade deepen begin end pass'),
      },
      past: PredicateTense(
        words: words(r'glowed flowed faded deepened began ended passed'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'glow flow fade deepen begin end pass'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'sways glitters falls rolls tilts ages creaks'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'sway glitter fall roll tilt age creak'),
      },
      past: PredicateTense(
        words: words(r'swayed glittered fell rolled tilted aged creaked'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'sway glitter fall roll tilt age creak'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'runs stops passes returns departs slides'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'run stop pass return depart slide'),
      },
      past: PredicateTense(
        words: words(r'ran stopped passed returned departed slid'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'run stop pass return depart slide'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'spreads vanishes remains lingers returns gathers'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'spread vanish remain linger return gather'),
      },
      past: PredicateTense(
        words: words(r'spread vanished remained lingered returned gathered'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'spread vanish remain linger return gather'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'grows wilts blooms sways spreads'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'grow wilt bloom sway spread'),
      },
      past: PredicateTense(
        words: words(r'grew wilted bloomed swayed spread'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'grow wilt bloom sway spread'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'trembles moves stiffens aches heals'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'tremble move stiffen ache heal'),
      },
      past: PredicateTense(
        words: words(r'trembled moved stiffened ached healed'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'tremble move stiffen ache heal'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'ripens cools boils melts spoils remains'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'ripen cool boil melt spoil remain'),
      },
      past: PredicateTense(
        words: words(r'ripened cooled boiled melted spoiled remained'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.question: words(r'ripen cool boil melt spoil remain'),
        },
      ),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        big small quick slow quiet loud brave lazy busy fierce gentle clever restless
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'hungry starving peckish'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'full satisfied'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'tired sleepy weary drowsy'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'refreshed rested lively'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'happy glad content pleased cheerful'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'bored curious uneasy'),
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
      words: words(r'beautiful strange new common rare'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'wide narrow calm deep dark bright distant steep'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'hard light heavy old smooth clear sturdy hollow'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'sweet salty spicy sour hot cold nutty mild'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'simple obvious vague endless fleeting stubborn'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'green lush fragrant withered'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'warm cold sore stiff steady'),
    ),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        brave lively gentle busy lazy shy clever young old small big quiet cheerful patient nimble
        curious
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'young kind strict earnest weary friendly'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'swift fierce tame plump little'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'sweet spicy warm fresh crisp savory fragrant hot salty soft ripe tasty'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'sweet warm cold cool hot fragrant fresh strong'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        old new small big light heavy shiny smooth clear sturdy pretty precious ancient
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'fast slow rattling'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        quiet wide dark bright strange old cozy secluded busy silent remote distant nearby empty
        lonely sunny
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'green lush fragrant young withered tall small tender fresh'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'faint old new strange clear precious small odd vague'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'long short quiet sunny cloudy noisy sudden lazy'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'small cold warm slender sturdy tender'),
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
      words: words(r'beautiful mysterious strange new'),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        quietly slowly quickly gently suddenly softly alone briefly boldly carefully eagerly warily
        calmly neatly warmly firmly patiently lightly wearily cheerfully idly restlessly gladly
        keenly briskly happily
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
        little_by_little
      '''),
    ),
  ],
  times: SentenceTimes(
    day: words(r'''
      at_dawn in_the_early_morning in_the_morning at_midday in_the_afternoon at_dusk in_the_evening
      at_night late_at_night at_midnight
    '''),
    any: words(r'in_spring in_summer in_autumn in_winter on_weekends on_holidays all_day'),
    past: words(r'yesterday last_week long_ago once that_day the_night_before'),
    present: words(r'today just_now tomorrow next_week'),
    habitual: words(r'these_days sometimes every_day every_night'),
  ),
  homes: words(r'house cottage'),
  join: const SentenceJoin(word: 'and'),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'and_then besides'),
    ConnectiveKind.temporal: words(r'meanwhile afterwards later soon at_last before_long'),
    ConnectiveKind.contrastive: words(
      r'but still however yet even_so then_again all_the_same even_then',
    ),
    ConnectiveKind.causal: words(r'so therefore in_the_end'),
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
  },
  interjections: words(r'''
    oh, ah, wow, well, look, goodness, my, indeed, honestly, gosh, hey, whoa, dear_me, good_grief,
    alas,
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
