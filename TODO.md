# TODO

Work that was proposed and not yet done. Each item says what to change and why; take one, do it in all three packages where it applies, and remove it from this list in the same commit.

## Sentences

- **An explanation that follows what it explains.** `왜냐하면 배가 고팠기 때문이다` after `사과를 먹었다`, `After all, she was hungry.` The story planner would swap a cause and its effect where `linksFor` already finds the first motivating the second, and the later sentence would take an explanatory ending: Korean `-기 때문이다`, Japanese `からだ`, with the connective kind to match (`왜냐하면`, `after all`, `因为`). Today a story only ever says the cause first.
- **Narrow the catch-all modifier groups of the other seven languages.** Korean and English list each word that fits several kinds of thing beside the kinds it fits, so a village is lonely and a sea cucumber is not. Japanese, Chinese, Vietnamese, Spanish, Italian, German and Russian still have one group that every class but `edible` draws from.

## Performance

- **Dart paragraphs got slower with reactions and setbacks.** A result of five sentences takes about a fifth longer than it did in Dart, against a twentieth in JavaScript and a tenth in Python, while one sentence is no slower anywhere. Profile the story planner in Dart (`_reactionsFor` and the `walkFrom` it calls) before anything else.

## Tests and tooling

- **Python lacks half of the speech-level test.** The JavaScript "`style` is the speech level" test also asserts that a language with no form of its own writes the same predicate at every level; `packages/python/tests/test_sentence.py` never had that half.
- **`tools/parity/dump_python.py` does not pass mypy.** Run on its own, mypy reports two errors on the `phone_plans` calls. The file is outside the package's mypy configuration, which is why nothing caught it.
