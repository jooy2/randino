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
		Merry Grumpy Mellow Stormy Frosty Dusty Foggy Radiant Bronze Umber Cobalt Verdant
		Fierce Nimble Prickly Restless Sturdy Tangled Vivid Whimsical Shimmering Wandering
	`),
	nouns: {
		animal: words(`
			Lion Tiger Leopard Cheetah Fox Wolf Bear Panda Otter Rabbit Squirrel Cat Puppy
			Whale Dolphin Shark Turtle Seal Penguin Owl Sparrow Magpie Swallow Eagle Falcon
			Crane Swan Duck Goose Woodpecker Parrot Peacock Ostrich Horse Deer Elephant
			Giraffe Hippo Monkey Gorilla Frog Lizard Chameleon Snake Butterfly Moth Bee
			Dragonfly Ladybug Snail Ant Spider Octopus Squid Seahorse Starfish Crab Shrimp
			Carp Salmon Mackerel Hedgehog Raccoon Badger Lynx Bison Moose Camel Koala Sloth
			Ferret Mole Bat Heron Pelican Walrus Narwhal Weasel Gazelle Zebra Buffalo Raven
			Kestrel Puffin Flamingo Firefly Mantis Jellyfish Chipmunk
		`),
		object: words(`
			Bottle Pencil Eraser Umbrella Lantern Lamp Clock Mirror Keyring Padlock Satchel
			Cap Boot Glove Scarf Goggles Bangle Button Needle Thread Scissors Brush Paint
			Paper Notebook Bookmark Letter Postcard Postage Compass Atlas Telescope
			Microscope Camera Reel Radio Gramophone Piano Guitar Fiddle Drum Chime Balloon
			Kite Spindle Marble Dice Card Puzzle Blocks Sail Anchor
			Beacon Tent Backpack Bedroll Torch Matchbox Candle Flowerpot Kettle Teacup
			Spoon Plate Saucepan Hatchet Shovel Handsaw Ladder Cogwheel Mainspring Magnet
			Ribbon Envelope Cushion Quilt Basket Broom Whistle Knot Bucket Anvil Bellows
			Chisel Easel Flask Goblet Hourglass Inkwell Mandolin Quiver Sundial Parasol
		`),
		nature: words(`
			Sky Cloud Breeze Rain Snow Frost Icicle Mist Dewdrop Rainbow Sunset Sunrise Dawn
			Dusk Star Moon Galaxy Comet Meteor Lightning Thunder Downpour Monsoon Typhoon
			Whirlwind Wave Tide Ocean River Lake Waterfall Ravine Mountain Hillside Meadow
			Forest Treetop Leaf Blossom Petal Rootlet Seedling Berry Moss Fern Bamboo
			Pinecone Maple Dandelion Sunflower Cavern Desert Sandbank Boulder Pebble
			Volcano Earthquake Ember Cinder Glacier Reef Marshland Prairie Canyon Echo
			Shadow Zephyr Squall Drizzle Snowdrift Avalanche Tundra Oasis Lagoon Geyser
			Plateau Thicket Driftwood
		`),
		concept: words(`
			Freedom Peace Justice Truth Wisdom Courage Memory Daydream Story Poem Ballad
			Waltz Sketch Grammar Logic Physics Chemistry Biology Philosophy Mathematics
			Geometry Algebra History Myth Legend Fable Proverb Riddle Secret Promise
			Friendship Journey Adventure Voyage Discovery Experiment Question Answer Debate
			Council Festival Holiday Season Moment Eternity Universe Dimension Balance
			Harmony Rhythm Melody Chord Palette Contrast Ritual Custom Culture Language
			Alphabet Cipher Archive Almanac Calendar Curiosity Solitude Nostalgia Reverie
			Paradox Enigma Lullaby Odyssey Symmetry Spectrum Horizon Sanctuary
		`),
		place: words(`
			Market Plaza Metropolis Village Alleyway Bridge Garden Library Museum Theater
			Schoolyard Parkland Harbor Wharf Pier Station Airport Lighthouse Citadel Palace
			Temple Shrine Chapel Cathedral Monastery Tower Attic Cellar Rooftop Courtyard
			Balcony Veranda Greenhouse Barn Cottage Cabin Lodge Tavern Bakery Diner Kitchen
			Bedroom Hallway Staircase Corridor Tunnel Overpass Crossroad Boardwalk Promenade
			Playground Stadium Arena Gymnasium Bathhouse Clinic Pharmacy Bookshop Aquarium
			Gallery Observatory Fortress
		`),
		food: words(`
			Rice Porridge Noodle Dumpling Bread Toast Cheese Yogurt Omelet Pancake Waffle
			Doughnut Cookie Biscuit Cupcake Brownie Pudding Custard Pastry Croissant Bagel
			Pretzel Sandwich Burger Pizza Pasta Spaghetti Lasagna Risotto Curry Stew Chowder
			Salad Pickle Sausage Bacon Steak Meatball Barbecue Taco Burrito Sushi Tempura
			Kimchi Tofu Potato Carrot Cabbage Lettuce Spinach Broccoli Pumpkin Cucumber
			Garlic Mushroom Apple Strawberry Grape Watermelon Peach Lemon Banana Mango
			Pineapple Blueberry Chocolate Candy Honey Syrup Coffee Cocoa Lemonade Popcorn
		`),
		sport: words(`
			Soccer Football Baseball Basketball Volleyball Handball Tennis Badminton Squash
			Golf Bowling Billiards Swimming Athletics Marathon Sprint Gymnastics Taekwondo
			Judo Karate Kendo Boxing Wrestling Fencing Archery Shooting Equestrian Rowing
			Canoeing Sailing Surfing Skiing Snowboard Hockey Rugby Cricket Cycling Climbing
			Racket Goalpost Medal Trophy Podium Referee Athlete Playoff Overtime Champion
		`),
		vehicle: words(`
			Bicycle Locomotive Boat Automobile Bus Taxi Truck Motorbike Scooter Skateboard
			Airplane Helicopter Jetliner Spaceship Rocket Submarine Steamship Sailboat Raft
			Kayak Ferry Freighter Warship Galleon Chariot Wagon Cart Handcart Tractor
			Bulldozer Firetruck Ambulance Cruiser Cablecar Subway Tramcar Railcar Carriage
			Sleigh Airship Glider Parachute Gondola
		`),
		product: words(`
			Laptop Computer Keyboard Trackpad Monitor Printer Speaker Earbuds Headphone
			Microphone Drone Tablet Smartphone Charger Battery Remote Fridge Washer Vacuum
			Heater Cooler Purifier Toaster Blender Oven Microwave Television Humidifier Razor
			Toothbrush Shampoo Perfume Lipstick Sneakers Wristwatch Console
		`)
	},
	parts: words(`
		Tail Paw Track Wing Shade Whisker Feather Scale Mane Horn Beak Fin Nest Den Egg
		Shard Flock Hamlet Kingdom Voyage Tale Song Waltz Daydream Starlight Glimmer
		Whisper Breeze Ripple Trail Crown Cloak Charm Spark Bloom Grove Cove Peak Path
		Lantern Claw Fang Snout Plume Antler Burrow Roost Lair Halo Murmur
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
