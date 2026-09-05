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
  // One article, and a definite one. English has three ways to open a noun
  // phrase and only `the` is right for every noun in the pools: `a` is wrong in
  // front of a mass noun and a bare plural is wrong in front of a count one.
  articles: const <WordGender, List<List<String>>>{
    WordGender.n: <List<String>>[
      <String>['', 'the'],
    ],
  },
  verbs: <VerbGroup>[
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        runs walks leaps swims flies crawls returns leaves stops rests sleeps laughs cries sings
        dances yawns hides waits stands sits tumbles wanders passes approaches dozes stretches
        listens
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
        run walk leap swim fly crawl return leave stop rest sleep laugh cry sing dance
        yawn hide wait stand sit tumble wander pass approach doze stretch listen
      '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      words: words(r'''
        eats drinks chews swallows tastes bakes warms shares
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'eat drink chew swallow taste bake warm share'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        watches finds carries touches guards chooses moves lifts gathers
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'watch find carry touch guard choose move lift gather'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        makes mends cleans sells buys builds paints
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'make mend clean sell buy build paint'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        remembers forgets imagines counts describes
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'remember forget imagine count describe'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        glows flows darkens brightens deepens quiets fades widens
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'glow flow darken brighten deepen quiet fade widen'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        sways glitters falls rolls tilts ages creaks
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'sway glitter fall roll tilt age creak'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        runs stops passes returns departs slides
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'run stop pass return depart slide'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        spreads vanishes remains lingers returns gathers
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'spread vanish remain linger return gather'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        grows wilts blooms sways spreads
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'grow wilt bloom sway spread'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        trembles moves stiffens aches heals
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'tremble move stiffen ache heal'),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        ripens cools boils melts spoils remains
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'ripen cool boil melt spoil remain'),
      },
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        big small quick slow quiet loud brave lazy busy hungry sleepy fierce gentle clever
        restless
      '''),
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
        beautiful strange new common rare
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        wide narrow calm deep dark bright distant steep
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        hard light heavy old smooth clear sturdy hollow
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        sweet salty spicy sour hot cold nutty mild
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        simple obvious vague endless fleeting stubborn
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        green lush fragrant withered
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        warm cold sore stiff steady
      '''),
    ),
  ],
  manners: words(r'''
    quietly slowly quickly gently suddenly softly again together alone briefly steadily boldly
    carefully eagerly warily calmly neatly side_by_side once_more warmly roughly firmly
    patiently lightly sharply wearily cheerfully idly restlessly faintly brightly evenly plainly
    gladly keenly
  '''),
  times: words(r'''
    at_dawn in_the_morning at_noon in_the_evening at_night today yesterday tomorrow in_spring
    in_summer in_autumn in_winter on_weekends just_now sometimes every_day at_dusk before_long
    at_midnight at_midday last_week next_week these_days long_ago in_the_small_hours on_holidays
    all_day every_night
  '''),
  connectives: words(r'''
    and_then so but meanwhile afterwards still later soon even_so at_last however therefore
    besides yet then_again in_the_end before_long all_the_same even_then
  '''),
  interjections: words(r'''
    oh, ah, wow, well, look, goodness, my, indeed, honestly, gosh, hey, whoa, dear_me,
    good_grief, alas,
  '''),
  pronouns: <WordGender, WordPool>{WordGender.n: words(r'it')},
  // No counters, and so no counted shape: English would need a plural, and a
  // plural of `sadness` or `bacon` is not a thing anyone writes. Money is
  // countable whatever the pools hold, so the amount is all this declares.
  numeral: const SentenceNumeral(
    order: NumeralOrder.before,
    counters: <NounClass, String>{},
    count: LengthRange(2, 12),
    currency: 'dollars',
    amounts: <int>[100, 500, 1000, 5000, 12000, 25000, 50000, 100000],
    group: ',',
    gap: ' ',
  ),
  // English cannot drop a subject, so a sentence about a person names it again.
  pronounless: const <NounClass>[NounClass.person],
  // English names its months and writes the copula as a word of its own.
  calendar: SentenceCalendar(
    date: 'MMMM D, Y',
    months: <String>[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    clock: 'h:mm',
    years: LengthRange(2020, 2030),
    copula: StateGroup(
      // An event is a thing that happens on a day, and a lion is not.
      subject: <NounClass>[NounClass.event],
      words: <String>['is'],
    ),
  ),
  frames: const <SentenceFrame>[
    // A date and a clock, standing where an adverbial stands.
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
    // And the shape that equates the subject to one: `The match is at 11:40.`
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
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: 'is'),
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
    // English asks with do-support, so the auxiliary stands in front of the
    // subject and the verb falls back to its base form — `Does the lion run?`
    // rather than `Runs the lion?`. `ist` moves the same way.
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'does', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      20,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'does', modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.object, modifiable: true),
      ],
      16,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'is', modifiable: true),
        SentencePart(SentenceSlot.state),
      ],
      14,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'does', modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.place, head: 'in', modifiable: true),
      ],
      12,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'does', modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.manner),
      ],
      10,
      mood: SentenceMood.question,
    ),
    // Money and nothing else: a counted phrase would need a plural noun, and
    // most of these pools are not countable at all.
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.money),
    ], 6),
  ],
);
