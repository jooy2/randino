// The seeded source a caller passes as `random`. Standard JavaScript has none:
// `Math.random` takes no seed, so a fixture that has to come out the same every
// run needed a generator of the caller's own. Dart's `Random(42)` and Python's
// `random.Random(42).random` already are one, which is why only this package
// has it.

/**
 * One 32-bit lane of a seed: the seed's text through FNV-1a, starting from a
 * basis of its own per lane, and then through MurmurHash3's finalizer, so that
 * seeds a character apart start the generator far apart.
 */
function lane(text: string, index: number): number {
	let hash = (0x811c9dc5 ^ Math.imul(index + 1, 0x9e3779b9)) >>> 0;

	for (let i = 0; i < text.length; i += 1) {
		hash = Math.imul(hash ^ text.charCodeAt(i), 0x01000193);
	}

	hash ^= hash >>> 16;
	hash = Math.imul(hash, 0x85ebca6b);
	hash ^= hash >>> 13;
	hash = Math.imul(hash, 0xc2b2ae35);
	hash ^= hash >>> 16;

	return hash >>> 0;
}

// How many outputs are thrown away first, so the lanes have mixed before any
// number is handed out.
const WARM_UP = 15;

/**
 * A seeded source for the `random` option: the same seed gives the same numbers,
 * so a call made with it comes out the same every run — which is what a snapshot
 * test or a demo database wants. The seed is read as its text, so `42` and
 * `'42'` are one seed.
 *
 * It is sfc32, a small counting generator with 128 bits of state, and each
 * number is two of its 32-bit outputs, the 53 bits a `Math.random` number
 * carries. It is not cryptographically secure: for a token nobody may predict,
 * pass a source built on `crypto.getRandomValues` instead.
 *
 * A seeded result repeats for one version of the package and not across
 * versions: the pools grow, and a word added to one of them moves every draw
 * after it.
 *
 * @example
 * randName({ language: 'en', count: 3, random: seededRandom(42) });
 * // the same three names every run
 */
export function seededRandom(seed: number | string): () => number {
	const text = String(seed);
	let a = lane(text, 0);
	let b = lane(text, 1);
	let c = lane(text, 2);
	let d = lane(text, 3);

	const next = (): number => {
		const out = (((a + b) | 0) + d) | 0;

		d = (d + 1) | 0;
		a = b ^ (b >>> 9);
		b = (c + (c << 3)) | 0;
		c = (c << 21) | (c >>> 11);
		c = (c + out) | 0;

		return out >>> 0;
	};

	for (let i = 0; i < WARM_UP; i += 1) {
		next();
	}

	// 27 bits of one output and 26 of the next, over 2^53.
	return () => ((next() >>> 5) * 67108864 + (next() >>> 6)) / 9007199254740992;
}
