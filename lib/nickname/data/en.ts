import { words } from '../../_internal/parse.js';
import type { NicknameLanguageData } from './types.js';

export const EN: NicknameLanguageData = {
	joiner: '',
	capitalize: true,
	modifiers: words(`
		Brave Bright Blue Crimson Golden Silver Emerald Scarlet Azure Quiet Loud Swift
		Slow Giant Tiny Clever Gentle Wild Calm Cosmic Lunar Solar Frozen Burning Misty
		Cloudy Rainy Sunny Snowy Windy Rusty Shiny Velvet Hidden Lonely Curious Dizzy
		Sleepy Dancing Running Flying Singing Roaming Whispering Glowing Fading Rolling
		Falling Rising Ancient Modern Endless Hollow Round Jagged Soft Warm Cool Sweet
		Salty Bitter Spicy Fuzzy Silky Marble Copper Ivory Neon Polar Feral Noble Humble
		Merry Grumpy Mellow Stormy Frosty Dusty Foggy Radiant
	`),
	nouns: {
		animal: words(`
			Lion Tiger Leopard Cheetah Fox Wolf Bear Panda Otter Rabbit Squirrel Cat Puppy
			Whale Dolphin Shark Turtle Seal Penguin Owl Sparrow Magpie Swallow Eagle Falcon
			Crane Swan Duck Goose Woodpecker Parrot Peacock Ostrich Horse Deer Elephant
			Giraffe Hippo Monkey Gorilla Frog Lizard Chameleon Snake Butterfly Moth Bee
			Dragonfly Ladybug Snail Ant Spider Octopus Squid Seahorse Starfish Crab Shrimp
			Carp Salmon Mackerel Hedgehog Raccoon Badger Lynx Bison Moose Camel Koala Sloth
			Ferret Mole Bat Heron Pelican Walrus Narwhal
		`),
		object: words(`
			Bottle Pencil Eraser Umbrella Lantern Lamp Clock Mirror Keyring Padlock Satchel
			Cap Boot Glove Scarf Goggles Bangle Button Needle Thread Scissors Brush Paint
			Paper Notebook Bookmark Letter Postcard Postage Compass Atlas Telescope
			Microscope Camera Reel Radio Gramophone Piano Guitar Fiddle Drum Chime Balloon
			Kite Spindle Marble Dice Card Puzzle Blocks Bicycle Locomotive Boat Sail Anchor
			Beacon Tent Backpack Bedroll Torch Matchbox Candle Flowerpot Kettle Teacup
			Spoon Plate Saucepan Hatchet Shovel Handsaw Ladder Cogwheel Mainspring Magnet
			Ribbon Envelope Cushion Quilt Basket Broom Whistle Knot Bucket
		`),
		nature: words(`
			Sky Cloud Breeze Rain Snow Frost Icicle Mist Dewdrop Rainbow Sunset Sunrise Dawn
			Dusk Star Moon Galaxy Comet Meteor Lightning Thunder Downpour Monsoon Typhoon
			Whirlwind Wave Tide Ocean River Lake Waterfall Ravine Mountain Hillside Meadow
			Forest Treetop Leaf Blossom Petal Rootlet Seedling Berry Moss Fern Bamboo
			Pinecone Maple Dandelion Sunflower Cavern Desert Sandbank Boulder Pebble
			Volcano Earthquake Ember Cinder Glacier Reef Marshland Prairie Canyon Echo
			Shadow
		`),
		concept: words(`
			Freedom Peace Justice Truth Wisdom Courage Memory Daydream Story Poem Ballad
			Waltz Sketch Grammar Logic Physics Chemistry Biology Philosophy Mathematics
			Geometry Algebra History Myth Legend Fable Proverb Riddle Secret Promise
			Friendship Journey Adventure Voyage Discovery Experiment Question Answer Debate
			Council Market Plaza Metropolis Village Alleyway Bridge Garden Library Museum
			Theater Schoolyard Parkland Festival Holiday Season Moment Eternity Universe
			Dimension Balance Harmony Rhythm Melody Chord Palette Contrast Ritual Custom
			Culture Language Alphabet Cipher Archive Almanac Calendar
		`)
	},
	parts: words(`
		Tail Paw Track Wing Shade Whisker Feather Scale Mane Horn Beak Fin Nest Den Egg
		Shard Flock Hamlet Kingdom Voyage Tale Song Waltz Daydream Starlight Glimmer
		Whisper Breeze Ripple Trail Crown Cloak Charm Spark Bloom Grove Cove Peak Path
		Lantern
	`),
	// Kept short on purpose: an invented word is joined to one or two others, and
	// long syllables add up to something nobody would type.
	syn: {
		kind: 'syllable',
		onset: words('b c d f g h j k l m n p r s t v w z br cl dr fl gr sk sl sn st th tr'),
		vowel: words('a a e e i i o o u u ae ee ou'),
		coda: ['', '', ...words('n l r s x th ll rk sk')],
		minSyllables: 2,
		maxSyllables: 2
	}
};
