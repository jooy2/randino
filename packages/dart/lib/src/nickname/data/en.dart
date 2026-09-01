// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/nickname/data/types.dart';
import 'package:randino/src/types.dart';

/// The English nickname dataset.
final NicknameLanguageData en = NicknameLanguageData(
  joiner: '',
  capitalize: true,
  modifiers: words(r'''
    Brave Bright Blue Crimson Golden Silver Emerald Scarlet Azure Quiet Loud Swift
    Slow Giant Tiny Clever Gentle Wild Calm Cosmic Lunar Solar Frozen Burning Misty
    Cloudy Rainy Sunny Snowy Windy Rusty Shiny Velvet Hidden Lonely Curious Dizzy
    Sleepy Dancing Running Flying Singing Roaming Whispering Glowing Fading Rolling
    Falling Rising Ancient Modern Endless Hollow Round Jagged Soft Warm Cool Sweet
    Salty Bitter Spicy Fuzzy Silky Marble Copper Ivory Neon Polar Feral Noble Humble
    Merry Grumpy Mellow Stormy Frosty Dusty Foggy Radiant Bronze Umber Cobalt Verdant
    Fierce Nimble Prickly Restless Sturdy Tangled Vivid Whimsical Shimmering Wandering
    Amber Indigo Jade Onyx Coral Teal Sable Ashen Auburn Maroon Russet Saffron Lilac
    Ochre Slate Charcoal Pearly Witty Bold Timid Cheerful Jolly Bashful Placid Serene
    Eager Earnest Steady Rowdy Sassy Snappy Zesty Breezy Dreamy Moody Cranky Perky
    Quirky Spry Wily Cunning Valiant Regal Lofty Meek Stoic Solemn Somber Blithe
    Genial Ardent Tender Sleeping Leaping Drifting Prowling Soaring Diving Gliding
    Humming Laughing Dreaming Blooming Melting Twinkling Rustling Crackling Bouncing
    Spinning Floating Climbing Chasing Lurking Roving Strolling Tumbling Glassy Wooden
    Woolen Rubbery Crispy Chewy Creamy Buttery Syrupy Smoky Dewy Sandy Muddy Icy Wispy
    Downy Plush Satin Linen Massive Petite Slender Chunky Stout Lanky Narrow Curved
    Spiral Zigzag Twisted Pointed Blunt Oval Astral Stellar Nebular Orbital Twilight
    Midnight Autumnal Wintry Vernal Timeless Antique
  '''),
  nouns: {
    NicknameTheme.animal: words(r'''
      Lion Tiger Leopard Cheetah Fox Wolf Bear Panda Otter Rabbit Squirrel Cat Puppy
      Whale Dolphin Shark Turtle Seal Penguin Owl Sparrow Magpie Swallow Eagle Falcon
      Crane Swan Duck Goose Woodpecker Parrot Peacock Ostrich Horse Deer Elephant
      Giraffe Hippo Monkey Gorilla Frog Lizard Chameleon Snake Butterfly Moth Bee
      Dragonfly Ladybug Snail Ant Spider Octopus Squid Seahorse Starfish Crab Shrimp
      Carp Salmon Mackerel Hedgehog Raccoon Badger Lynx Bison Moose Camel Koala Sloth
      Ferret Mole Bat Heron Pelican Walrus Narwhal Weasel Gazelle Zebra Buffalo Raven
      Kestrel Puffin Flamingo Firefly Mantis Jellyfish Chipmunk
    '''),
    NicknameTheme.object: words(r'''
      Bottle Pencil Eraser Umbrella Lantern Lamp Clock Mirror Keyring Padlock Satchel
      Cap Boot Glove Scarf Goggles Bangle Button Needle Thread Scissors Brush Paint
      Paper Notebook Bookmark Letter Postcard Postage Compass Atlas Telescope
      Microscope Camera Reel Radio Gramophone Balloon
      Kite Spindle Marbles Dice Card Puzzle Blocks Sail Anchor
      Beacon Tent Backpack Bedroll Torch Matchbox Candle Flowerpot Kettle Teacup
      Spoon Plate Saucepan Hatchet Shovel Handsaw Ladder Cogwheel Mainspring Magnet
      Ribbon Envelope Cushion Quilt Basket Broom Whistle Knot Bucket Anvil Bellows
      Chisel Easel Flask Goblet Hourglass Inkwell Quiver Sundial Parasol
    '''),
    NicknameTheme.nature: words(r'''
      Sky Cloud Breeze Rain Snow Frost Icicle Mist Dewdrop Rainbow Sunset Sunrise Dawn
      Dusk Star Moon Galaxy Comet Meteor Lightning Thunder Downpour Monsoon Typhoon
      Whirlwind Wave Tide Ocean River Lake Waterfall Ravine Mountain Hillside Meadow
      Forest Cavern Desert Sandbank Boulder Pebble
      Volcano Earthquake Ember Cinder Glacier Reef Marshland Prairie Canyon Echo
      Shadow Zephyr Squall Drizzle Snowdrift Avalanche Tundra Oasis Lagoon Geyser
      Plateau Driftwood
    '''),
    NicknameTheme.plant: words(r'''
      Treetop Leaf Blossom Petal Rootlet Seedling Berry Moss Fern Bamboo Pinecone
      Maple Dandelion Sunflower Thicket Lotus Orchid Tulip Peony Camellia Magnolia
      Azalea Hyacinth Daffodil Snowdrop Bluebell Foxglove Marigold Lavender Primrose
      Buttercup Cowslip Columbine Larkspur Wisteria Begonia Petunia Zinnia Dahlia
      Anemone Crocus Freesia Gardenia Birch Cedar Pine Oak Elm Beech Alder Poplar
      Aspen Cypress Sequoia Sycamore Hawthorn Acorn Chestnut Walnut Sprout Sapling
      Stalk Stem Twig Bark Bud Pollen Nectar Frond Cactus Toadstool Lichen Seaweed
      Kelp Bonsai Hedge Shrub Bramble Thistle Bulrush Sedge Vine Nettle
    '''),
    NicknameTheme.gem: words(r'''
      Gold Silver Copper Iron Steel Bronze Brass Tin Zinc Nickel Platinum Titanium
      Quartz Amethyst Crystal Topaz Garnet Sapphire Emerald Jade Onyx Obsidian Marble
      Granite Limestone Sandstone Slate Basalt Flint Amber Coral Ivory Agate Carnelian
      Peridot Zircon Turquoise Malachite Lapis Mica Pyrite Gypsum Chalk Ore Nugget
      Gemstone Geode Meteorite Diamond Prism Alloy Ingot
    '''),
    NicknameTheme.concept: words(r'''
      Freedom Peace Justice Truth Wisdom Courage Memory Daydream Story Poem
      Sketch Grammar Logic Physics Chemistry Biology Philosophy Mathematics
      Geometry Algebra History Myth Legend Fable Proverb Riddle Secret Promise
      Friendship Journey Adventure Voyage Discovery Experiment Question Answer Debate
      Council Festival Holiday Season Moment Eternity Universe Dimension Balance
      Harmony Palette Contrast Ritual Custom Culture Language
      Alphabet Cipher Archive Almanac Calendar Curiosity Solitude Nostalgia Reverie
      Paradox Enigma Odyssey Symmetry Spectrum Horizon Sanctuary
    '''),
    NicknameTheme.myth: words(r'''
      Dragon Wyvern Phoenix Griffin Chimera Hydra Golem Orc Goblin Troll Elf Dwarf
      Fairy Pixie Sprite Nymph Siren Mermaid Kraken Basilisk Cockatrice Manticore
      Minotaur Centaur Satyr Cyclops Titan Ogre Imp Demon Angel Seraph Wraith Ghost
      Phantom Specter Banshee Vampire Werewolf Zombie Mummy Gargoyle Unicorn Pegasus
      Sphinx Djinn Genie Leviathan Behemoth Thunderbird Yeti Spell Curse Hex Rune
      Amulet Talisman Grimoire Potion Oracle Prophecy Sorcery Enchantment Revenant
      Lich Witch
    '''),
    NicknameTheme.job: words(r'''
      Wizard Sorcerer Ranger Thief Rogue Pirate Sailor Captain Chef Gardener
      Blacksmith Detective Poet Painter Dancer Jester Clown Wanderer Pilgrim Monk
      Alchemist Archer Swordsman Warrior Soldier Guard Sentinel Warden Guardian Queen
      Prince Princess Emperor Steward Servant Maid Merchant Trader Farmer Angler
      Shepherd Woodcutter Ferryman Coachman Navigator Pilot Engineer Courier Janitor
      Firefighter Officer Doctor Nurse Pharmacist Teacher Student Librarian Reporter
      Writer Editor Translator Singer Actor Director Minstrel Miner Carpenter Potter
      Tailor Weaver Seer Prophet Priest Shaman Scholar Inventor Explorer Traveler
      Athlete Referee Juggler Acrobat Sculptor Paladin Cavalier Squire Crusader
      Herald Scribe Barkeep Innkeeper Huntsman Stonecutter
    '''),
    NicknameTheme.music: words(r'''
      Piano Guitar Fiddle Drum Chime Mandolin Melody Rhythm Chord Ballad Waltz
      Lullaby Flute Piccolo Clarinet Oboe Bassoon Trumpet Trombone Tuba Saxophone
      Harp Cello Viola Violin Banjo Ukulele Accordion Harmonica Xylophone Marimba
      Tambourine Maracas Cymbal Bagpipe Organ Kalimba Sitar Lute Lyre Zither Ocarina
      Bugle Sonata Symphony Concerto Overture Prelude Interlude Refrain Chorus Anthem
      Serenade Nocturne Rhapsody Etude Fugue Octave Tempo Cadence Crescendo Staccato
      Encore Duet Trio Quartet Songbook
    '''),
    NicknameTheme.place: words(r'''
      Market Plaza Metropolis Village Alleyway Bridge Garden Library Museum Theater
      Schoolyard Parkland Harbor Wharf Pier Station Airport Lighthouse Citadel Palace
      Temple Shrine Chapel Cathedral Monastery Tower Attic Cellar Rooftop Courtyard
      Balcony Veranda Greenhouse Barn Cottage Cabin Lodge Tavern Bakery Diner Kitchen
      Bedroom Hallway Staircase Corridor Tunnel Overpass Crossroad Boardwalk Promenade
      Playground Stadium Arena Gymnasium Bathhouse Clinic Pharmacy Bookshop Aquarium
      Gallery Observatory Fortress
    '''),
    NicknameTheme.food: words(r'''
      Rice Porridge Noodle Dumpling Bread Toast Cheese Yogurt Omelet Pancake Waffle
      Doughnut Cookie Biscuit Cupcake Brownie Pudding Custard Pastry Croissant Bagel
      Pretzel Sandwich Burger Pizza Pasta Spaghetti Lasagna Risotto Curry Stew Chowder
      Salad Pickle Sausage Bacon Steak Meatball Barbecue Taco Burrito Sushi Tempura
      Kimchi Tofu Potato Carrot Cabbage Lettuce Spinach Broccoli Pumpkin Cucumber
      Garlic Mushroom Apple Strawberry Grape Watermelon Peach Lemon Banana Mango
      Pineapple Blueberry Chocolate Candy Honey Syrup Coffee Cocoa Lemonade Popcorn
    '''),
    NicknameTheme.sport: words(r'''
      Soccer Football Baseball Basketball Volleyball Handball Tennis Badminton Squash
      Golf Bowling Billiards Swimming Athletics Marathon Sprint Gymnastics Taekwondo
      Judo Karate Kendo Boxing Wrestling Fencing Archery Shooting Equestrian Rowing
      Canoeing Sailing Surfing Skiing Snowboard Hockey Rugby Cricket Cycling Climbing
      Racket Goalpost Medal Trophy Podium Playoff Overtime Champion
    '''),
    NicknameTheme.vehicle: words(r'''
      Bicycle Locomotive Boat Automobile Bus Taxi Truck Motorbike Scooter Skateboard
      Airplane Helicopter Jetliner Spaceship Rocket Submarine Steamship Sailboat Raft
      Kayak Ferry Freighter Warship Galleon Chariot Wagon Cart Handcart Tractor
      Bulldozer Firetruck Ambulance Cruiser Cablecar Subway Tramcar Railcar Carriage
      Sleigh Airship Glider Parachute Gondola
    '''),
    NicknameTheme.product: words(r'''
      Laptop Computer Keyboard Trackpad Monitor Printer Speaker Earbuds Headphone
      Microphone Drone Tablet Smartphone Charger Battery Remote Fridge Washer Vacuum
      Heater Cooler Purifier Toaster Blender Oven Microwave Television Humidifier Razor
      Toothbrush Shampoo Perfume Lipstick Sneakers Wristwatch Console
    '''),
  },
  parts: words(r'''
    Tail Paw Track Wing Shade Whisker Feather Scale Mane Horn Beak Fin Nest Den Egg
    Shard Flock Hamlet Kingdom Voyage Tale Song Waltz Daydream Starlight Glimmer
    Whisper Breeze Ripple Trail Crown Cloak Charm Spark Bloom Grove Cove Peak Path
    Lantern Claw Fang Snout Plume Antler Burrow Roost Lair Halo Murmur
  '''),
  // Kept short on purpose: an invented word is joined to one or two others, and
  // long syllables add up to something nobody would type.
  syn: SyllableSynthesis(
    onset: words(r'b c d f g h j k l m n p r s t v w z br cl dr fl gr sk sl sn st th tr'),
    vowel: words(r'a a e e i i o o u u ae ee ou'),
    coda: ['', '', ...words(r'n l r s x th ll rk sk')],
    minSyllables: 2,
    maxSyllables: 2,
  ),
);
