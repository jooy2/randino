# Ages

Notes on how the age generator behaves and why, for whoever changes it. They describe the npm package, which is the source of truth, and hold for the Dart and Python ports too: a behaviour that lands in one lands in all three. The repository's own `CLAUDE.md` covers everything that is not one generator's.

## Behaviour worth knowing before changing it

- **The curve is written by hand, and it is the shape of a population rather than a census.** `AGE_CURVE` is `[age, weight]` points with straight lines between them, peaking from 25 to 35 and falling away past seventy. A census would be a dataset with terms of its own, and no country's shape is what a sample wants — Korea's peaks in its fifties. The shares it works out to are in the comment above it and on the docs page; **a change to a point changes both**, and the suites assert the shape (adults are most of it, young adults outnumber children and seniors per year) rather than the numbers.
- **A group narrows the range, and the range wins.** `group` is filtered inside `minAge`..`maxAge`, and a group with no age there is ignored rather than answered with nothing, because the range is a number the caller wrote and the group only a name for one. The bands are data (`AGE_BANDS`) and meet without a gap from 0 to `RAND_AGE_MAX`.
- **`maxAge` left out is 100, unless `minAge` is past it.** A centenarian is about one draw in twenty thousand, so the default stops there; `minAge: 105` alone moves it to `RAND_AGE_MAX` rather than reading as a range the wrong way round. An explicit range the wrong way round keeps `maxAge`, the way `lengthBounds` keeps `maxLength`.
- **The candidates are worked out once per call.** At most 121 ages, each with its weight, and every draw is a `pickWeighted` over them. The last age of the curve has weight zero and is still drawn when it is the only age in range, which is `pickWeighted`'s even fallback doing its job.
