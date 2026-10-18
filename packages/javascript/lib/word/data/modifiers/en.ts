import { words } from '../../../_internal/parse.js';
import type { WordModifierData } from '../types.js';

// What `randModifier` needs of the language, apart from its nouns: the modifiers,
// how they agree, and the shapes they sit in. `en.ts` spreads it into the whole
// dataset.
export const EN_MODIFIERS = /*#__PURE__*/ ((): WordModifierData => ({
	joiner: '',
	capitalize: true,
	adjectives: words(`
		Brave Bright Blue Crimson Golden Silver Emerald Scarlet Azure Quiet Loud Swift
		Slow Giant Tiny Clever Gentle Wild Calm Cosmic Lunar Solar Misty
		Cloudy Rainy Sunny Snowy Windy Rusty Shiny Velvet Lonely Curious Dizzy
		Sleepy Ancient Modern Endless Hollow Round Jagged Soft Warm Cool Sweet
		Salty Bitter Spicy Fuzzy Silky Marble Copper Ivory Neon Polar Feral Noble Humble
		Merry Grumpy Mellow Stormy Frosty Dusty Foggy Radiant Bronze Umber Cobalt
		Verdant Fierce Nimble Prickly Restless Sturdy Tangled Vivid Whimsical
		Amber Indigo Jade Onyx Coral Teal Sable Ashen Auburn Maroon Russet
		Saffron Lilac Ocher Slate Charcoal Pearly Witty Bold Timid Cheerful Jolly
		Bashful Placid Serene Eager Earnest Steady Rowdy Sassy Snappy Zesty Breezy
		Dreamy Moody Cranky Perky Quirky Spry Wily Cunning Valiant Regal Lofty Meek
		Stoic Solemn Somber Blithe Genial Ardent Tender
		Glassy Wooden Woolen Rubbery Crispy Chewy Creamy
		Buttery Syrupy Smoky Dewy Sandy Muddy Icy Wispy Downy Plush Satin Linen Massive
		Petite Slender Chunky Stout Lanky Narrow Curved Spiral Zigzag Twisted Pointed
		Blunt Oval Astral Stellar Nebular Orbital Twilight Midnight Autumnal Wintry
		Vernal Timeless Antique
		Fearless Daring Gallant Loyal Patient Restive Watchful Sprightly
		Feathery Furry Scaly Bristly Silken Glossy Matte Speckled Dappled Mottled
		Striped Ringed Freckled Weathered Battered Polished Burnished Gilded Lacquered
		Braided Woven Knotted Frayed Tattered Pristine Hushed Muffled Clangorous Chiming
		Ringing Booming Murmuring Rippling Balmy Brisk Sultry Muggy Crisp Bracing
		Blustery Drizzly Sleety Hazy Overcast Starlit Moonlit Sunlit Grassy Mossy Ferny
		Thorny Leafy Boughy Reedy Briny Pebbly Silty Loamy Chalky Flinty Peppery Tangy
		Zingy Nutty Toasty Yeasty Fizzy Frothy Honeyed Minty Citrus Vanilla Caramel
		Topaz Garnet Quartz Obsidian Alabaster Porcelain Granite Basalt Iron Pewter
		Brassy Tin Vermilion Cerulean Viridian Magenta Sepia Ecru Fawn Dun Bistre Puce
		Wistful Pensive Sanguine Jaunty Chipper Buoyant Sullen Brooding Fretful Wary
		Skittish Impish Roguish Ample Scant Squat Willowy Gaunt Burly Rangy Compact Vast
		Broad Sheer Craggy Sloped Tapered
	`),
	// The same attributive slot, for what the noun is doing rather than what it is
	// like: Studying + Fox, Tear + Of + Lion.
	actions: words(`
		Burning Frozen Dancing Running Flying Singing Roaming Whispering Glowing Fading
		Rolling Falling Rising Shimmering Wandering Hidden Sleeping Leaping Drifting
		Prowling Soaring Diving Gliding Humming Laughing Dreaming Blooming Melting
		Twinkling Rustling Crackling Bouncing Spinning Floating Climbing Chasing Lurking
		Roving Strolling Tumbling Studying Working Cooking Baking Painting Drawing
		Writing Reading Counting Building Mending Planting Digging Fishing Waiting
		Guarding Seeking Calling Shouting Muttering Watching Peeking Listening
		Remembering Imagining Wondering Hesitating Deciding Cheering Greeting Hugging
		Soothing Waking Napping Yawning Stretching Traveling Fleeing Landing Circling
		Pacing Crawling Frolicking Teasing Eating Drinking Chewing Roasting Knocking
		Hauling Pushing Pulling Throwing Catching Dropping Hiding Sinking Flowing
		Overflowing Thawing Blazing Smoldering Scattering Pouring Seeping Spreading
		Ripening Growing Wilting Setting Nodding Resting Leaning Hanging Perched Curled
		Sprawled Halted Sighing Grinning Snoozing Skipping Prancing Bounding Darting
		Slinking Hovering Swaying Bobbing Drumming Strumming Whistling Chanting Weaving
		Carving Forging Sailing Rowing Paddling Marching Racing Juggling Vanishing
		Returning
		Rousing Stirring Straightening Slouching Crouching Kneeling
		Sprawling Reclining Trudging Ambling Sauntering Loping Trotting Galloping
		Scampering Scurrying Shuffling Limping Wading Swooping Wheeling Fluttering
		Flapping Alighting Plunging Surfacing Wallowing Wriggling Slithering Peering
		Squinting Gazing Glancing Inspecting Sniffing Tasting Touching Stroking Patting
		Gathering Sorting Stacking Packing Unpacking Wrapping Tying Untying Folding
		Unfolding Sealing Opening Kneading Chopping Slicing Grating
		Simmering Steaming Frying Cooling Serving Sharing Sketching Etching Stitching
		Sewing Polishing Sanding Hammering Sawing Drilling Tuning Winding Mapping
		Charting Naming Numbering Tallying Recording Archiving Wishing
		Hoping Doubting Trusting Forgiving Promising Vowing Recalling Forgetting
	`),
	frames: [
		{ slots: ['noun'], weight: 10 },
		{ slots: ['adjective', 'noun'], weight: 34 },
		{ slots: ['action', 'noun'], weight: 22 },
		{ slots: ['noun', 'part'], weight: 12 },
		{ slots: ['adjective', 'noun', 'part'], weight: 16 },
		{ slots: ['action', 'noun', 'part'], weight: 6 }
	],
	syn: {
		kind: 'syllable',
		onset: words('b c d f g h j k l m n p r s t v w z br cl dr fl gr sk sl sn st th tr'),
		vowel: words('a a e e i i o o u u ae ee ou'),
		coda: ['', '', ...words('n l r s x th ll rk sk')],
		minSyllables: 2,
		maxSyllables: 2
	}
}))();
