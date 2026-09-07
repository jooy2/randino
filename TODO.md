# TODO

Work left over from the sentence generator's last round. Nothing here blocks a
release; all three suites pass a single run, and the items below are property
tests that fail once every twenty runs or so. Each one is a real defect the
test is right to catch.

## A result describes the same noun twice

`test_a_noun_the_result_has_described_is_not_described_again` (Python,
`packages/python/tests/test_sentence.py`) fails about one run in twenty. The
same test exists in the JavaScript and Dart suites and can fail there too.

A Korean paragraph came back as `… 어수선한 저기압이 살랑살랑 잦아들어요. … 신비한
저기압이 슬며시 사라져요.`, which is one low-pressure front described twice.

`Requirement.settled` marks a noun the result has already described, and both
the topic and the scene's nouns carry it. A story's `other` step draws a fresh
actor every time it comes round, and that actor is remembered nowhere — so a
story whose steps draw the same weather noun twice describes it twice.

The fix is to carry every noun the result has described, not only the topic's
and the scene's, and to mark a repeat `settled` the way a pinned noun is.
Reproduce with:

```bash
cd packages/python && .venv/bin/pytest -q tests/test_sentence.py::test_a_noun_the_result_has_described_is_not_described_again
```

## Korean speech levels are told apart by their endings

`` `style` is the speech level, and Korean is the language with four of them ``
(`packages/javascript/test/sentence.test.ts`) fails about one run in twelve.
The failure was not captured with its message; run the file in a loop to get
one:

```bash
cd packages/javascript && npx tsc && for i in $(seq 1 20); do node --import tsx --test ./test/sentence.test.ts 2>&1 | grep -A 20 '✖ failing tests'; done
```

The test asserts that the languages whose sentences change with `style` are
exactly the languages that declare a level. Korean tells its four apart by the
ending a sentence closes on, so a new ending that two levels share, or a form
pool that falls back to another level's, is what would break it.

## Verify a language's floor after widening its pools

`sentenceLengthRange` reports what the shapes and the pools can spell, and both
ends move when a pool does. The new test `a name never takes a sentence under
the language's own floor` covers the low end for a named result; there is no
equivalent for `include`, which pins a word of the caller's own length.
