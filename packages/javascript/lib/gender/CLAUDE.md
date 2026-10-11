# Genders

Notes on how the gender generator behaves and why, for whoever changes it. They describe the npm package, which is the source of truth, and hold for the Dart and Python ports too: a behaviour that lands in one lands in all three. The repository's own `CLAUDE.md` covers everything that is not one generator's.

## Behaviour worth knowing before changing it

- **A label is what a form writes, not the noun for a person.** `남성` rather than `남자`, `Männlich` rather than `Mann`, and the adjective that agrees with the field's own noun where the language has one (`Masculino` for `sexo`, `Мужской` for `пол`). German writes `Divers` for the third option because that is the option its forms carry. A new word language needs a row in `GENDER_LABELS` in all three packages, and the suites assert every language labels every code with four different strings.
- **The weights are out of a hundred with everything switched on, and a switched-off code drops out.** 45 / 45 / 9 / 1, so the two always-on codes split evenly by themselves and the rest keep their proportions — `unknown` alone is about one in eleven, `nonbinary` alone about one in ninety. Nothing is renormalised by hand; `pickWeighted` over the codes that are left does it.
- **`male` and `female` are `NameGender`'s two codes.** That is the point of `code` on the detail: a drawn gender can choose the pool a name comes from. Keep them the same strings.
