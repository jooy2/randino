"""English nickname pools."""

from randino._internal.parse import words
from randino.word.data._types import SyllableSynthesis, WordFrame, WordLanguageData

EN = WordLanguageData(
    joiner="",
    capitalize=True,
    adjectives=words("""
        Brave Bright Blue Crimson Golden Silver Emerald Scarlet Azure Quiet Loud Swift
        Slow Giant Tiny Clever Gentle Wild Calm Cosmic Lunar Solar Misty
        Cloudy Rainy Sunny Snowy Windy Rusty Shiny Velvet Lonely Curious Dizzy
        Sleepy Ancient Modern Endless Hollow Round Jagged Soft Warm Cool Sweet
        Salty Bitter Spicy Fuzzy Silky Marble Copper Ivory Neon Polar Feral Noble Humble
        Merry Grumpy Mellow Stormy Frosty Dusty Foggy Radiant Bronze Umber Cobalt
        Verdant Fierce Nimble Prickly Restless Sturdy Tangled Vivid Whimsical
        Amber Indigo Jade Onyx Coral Teal Sable Ashen Auburn Maroon Russet
        Saffron Lilac Ochre Slate Charcoal Pearly Witty Bold Timid Cheerful Jolly
        Bashful Placid Serene Eager Earnest Steady Rowdy Sassy Snappy Zesty Breezy
        Dreamy Moody Cranky Perky Quirky Spry Wily Cunning Valiant Regal Lofty Meek
        Stoic Solemn Somber Blithe Genial Ardent Tender
        Glassy Wooden Woolen Rubbery Crispy Chewy Creamy
        Buttery Syrupy Smoky Dewy Sandy Muddy Icy Wispy Downy Plush Satin Linen Massive
        Petite Slender Chunky Stout Lanky Narrow Curved Spiral Zigzag Twisted Pointed
        Blunt Oval Astral Stellar Nebular Orbital Twilight Midnight Autumnal Wintry
        Vernal Timeless Antique
    """),
    # The same attributive slot, for what the noun is doing rather than what it is
    # like: Studying + Fox, Tear + Of + Lion.
    actions=words("""
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
    """),
    nouns={
        "animal": words("""
            Lion Tiger Leopard Cheetah Fox Wolf Bear Panda Otter Rabbit Squirrel Cat Puppy
            Whale Dolphin Shark Turtle Seal Penguin Owl Sparrow Magpie Swallow Eagle Falcon
            Crane Swan Duck Goose Woodpecker Parrot Peacock Ostrich Horse Deer Elephant
            Giraffe Hippo Monkey Gorilla Frog Lizard Chameleon Snake Butterfly Moth Bee
            Dragonfly Ladybug Snail Ant Spider Octopus Squid Seahorse Starfish Crab Shrimp
            Carp Salmon Mackerel Hedgehog Raccoon Badger Lynx Bison Moose Camel Koala Sloth
            Ferret Mole Bat Heron Pelican Walrus Narwhal Weasel Gazelle Zebra Buffalo Raven
            Kestrel Puffin Flamingo Firefly Mantis Jellyfish Chipmunk Jaguar Cougar Bobcat
            Hyena Jackal Coyote Dingo Meerkat Mongoose Marten Wolverine Beaver Porcupine
            Armadillo Anteater Lemur Baboon Macaque Marmoset Tapir Okapi Ibex Chamois
            Antelope Impala Wildebeest Llama Alpaca Donkey Pony Foal Piglet Lamb Kitten
            Duckling Gosling Cygnet Osprey Vulture Condor Stork Ibis Cormorant Albatross
            Petrel Sandpiper Plover Lapwing Starling Finch Warbler Thrush Cuckoo Hoopoe
            Kingfisher Toucan Macaw Cockatoo Canary Nightingale Cicada Beetle Centipede
            Scorpion Earthworm Tadpole Newt Gecko Iguana Cobra Python
        """),
        "object": words("""
            Bottle Pencil Eraser Umbrella Lantern Lamp Clock Mirror Keyring Padlock Satchel
            Cap Boot Glove Scarf Goggles Bangle Button Needle Thread Scissors Brush Paint
            Paper Notebook Bookmark Letter Postcard Postage Compass Atlas Telescope
            Microscope Camera Reel Radio Gramophone Balloon Kite Spindle Marbles Dice Card
            Puzzle Blocks Sail Anchor Beacon Tent Backpack Bedroll Torch Matchbox Candle
            Flowerpot Kettle Teacup Spoon Plate Saucepan Hatchet Shovel Handsaw Ladder
            Cogwheel Mainspring Magnet Ribbon Envelope Cushion Quilt Basket Broom Whistle
            Knot Bucket Anvil Bellows Chisel Easel Flask Goblet Hourglass Inkwell Quiver
            Sundial Parasol Thimble Bobbin Loom Tongs Pliers Wrench Mallet Rasp File Awl
            Punch Clamp Vise Level Plumbline Caliper Protractor Ruler Sharpener Inkpot Quill
            Nib Blotter Folder Binder Clipboard Notepad Paperclip Pushpin Tack Rivet Bolt
            Screw Bracket Hinge Latch Chain Rope Twine Cord Tassel Buckle Zipper Snap Velcro
            Patch Emblem Badge Pendant Locket Brooch Cufflink Hairpin Barrette Headband
            Wristband Anklet Pouch Tote Duffel Trunk Crate Barrel Canister Jar
        """),
        "nature": words("""
            Sky Cloud Breeze Rain Snow Frost Icicle Mist Dewdrop Rainbow Sunset Sunrise Dawn
            Dusk Star Moon Galaxy Comet Meteor Lightning Thunder Downpour Monsoon Typhoon
            Whirlwind Wave Tide Ocean River Lake Waterfall Ravine Mountain Hillside Meadow
            Forest Cavern Desert Sandbank Boulder Pebble Volcano Earthquake Ember Cinder
            Glacier Reef Marshland Prairie Canyon Echo Shadow Zephyr Squall Drizzle
            Snowdrift Avalanche Tundra Oasis Lagoon Geyser Plateau Driftwood Steppe Savanna
            Wetland Swampland Bayou Estuary Delta Atoll Fjord Inlet Cove Headland Peninsula
            Isthmus Archipelago Islet Mesa Butte Gorge Crevasse Moraine Scree Talus Bedrock
            Sandbar Shoal Seabed Trench Abyss Fumarole Sinkhole Karst Stalactite Stalagmite
            Grotto Alcove Overhang Crag Spire Pinnacle Hoarfrost Sleet Cloudburst Gale Gust
            Cyclone Blizzard Hailstone Sunbeam Moonbeam Starlight Twilight Daybreak
            Nightfall Solstice Equinox Eclipse Corona Halo Mirage Zenith
        """),
        "plant": words("""
            Treetop Leaf Blossom Petal Rootlet Seedling Berry Moss Fern Bamboo Pinecone
            Maple Dandelion Sunflower Thicket Lotus Orchid Tulip Peony Camellia Magnolia
            Azalea Hyacinth Daffodil Snowdrop Bluebell Foxglove Marigold Lavender Primrose
            Buttercup Cowslip Columbine Larkspur Wisteria Begonia Petunia Zinnia Dahlia
            Anemone Crocus Freesia Gardenia Birch Cedar Pine Oak Elm Beech Alder Poplar
            Aspen Cypress Sequoia Sycamore Hawthorn Acorn Chestnut Walnut Sprout Sapling
            Stalk Stem Twig Bark Bud Pollen Nectar Frond Cactus Toadstool Lichen Seaweed
            Kelp Bonsai Hedge Shrub Bramble Thistle Bulrush Sedge Vine Nettle Redwood Spruce
            Larch Olive Hickory Linden Mulberry Mangrove Papyrus Duckweed Watercress
            Mistletoe Wormwood Foxtail Cattail Sepal Stamen Pistil Calyx Husk Kernel Tendril
            Rhizome Tuber Sprig Foliage Canopy Undergrowth Arbor Trellis Bough Lilac
            Carnation Gladiolus Hydrangea Oleander Hibiscus Honeysuckle Blackthorn
            Elderberry Dogwood Geranium Delphinium Lupine Aster Ranunculus Gorse Bracken
            Horsetail Liverwort Algae Rattan Palm Yucca Agave Succulent Aloe Basil Thyme
            Oregano Parsley Cilantro Chives Sorrel Fennel Dill Sage Marjoram Tarragon
            Lemongrass Peppermint Spearmint Chamomile
        """),
        "gem": words("""
            Gold Silver Copper Iron Steel Bronze Brass Tin Zinc Nickel Platinum Titanium
            Quartz Amethyst Crystal Topaz Garnet Sapphire Emerald Jade Onyx Obsidian Marble
            Granite Limestone Sandstone Slate Basalt Flint Amber Coral Ivory Agate Carnelian
            Peridot Zircon Turquoise Malachite Lapis Mica Pyrite Gypsum Chalk Ore Nugget
            Gemstone Geode Meteorite Diamond Prism Alloy Ingot Aquamarine Tourmaline
            Tanzanite Moonstone Sunstone Bloodstone Azurite Chalcedony Citrine Morganite
            Kunzite Spinel Alexandrite Chrysoprase Rhodonite Sodalite Labradorite Amazonite
            Aventurine Hematite Magnetite Galena Bauxite Cinnabar Realgar Orpiment Barite
            Celestite Apatite Beryl Corundum Olivine Pyroxene Amphibole Serpentine Chlorite
            Kaolin Bentonite Zeolite Cobalt Chromium Manganese Tungsten Antimony Bismuth
            Cadmium Iridium Osmium Palladium Rhodium Ruthenium Tantalum Niobium Vanadium
            Selenium Tellurium Germanium Gallium Indium Thallium Rubidium Caesium Strontium
            Barium Lithium
        """),
        "concept": words("""
            Freedom Peace Justice Truth Wisdom Courage Memory Daydream Story Poem Sketch
            Grammar Logic Physics Chemistry Biology Philosophy Mathematics Geometry Algebra
            History Myth Legend Fable Proverb Riddle Secret Promise Friendship Journey
            Adventure Voyage Discovery Experiment Question Answer Debate Council Festival
            Holiday Season Moment Eternity Universe Dimension Balance Harmony Palette
            Contrast Ritual Custom Culture Language Alphabet Cipher Archive Almanac Calendar
            Curiosity Solitude Nostalgia Reverie Paradox Enigma Odyssey Symmetry Spectrum
            Horizon Sanctuary Insight Intuition Reason Judgment Doctrine Theorem Axiom
            Corollary Hypothesis Dilemma Paradigm Framework Premise Inference Deduction
            Induction Analogy Metaphor Allegory Symbol Motif Theme Narrative Chronicle Annal
            Testament Manifesto Consensus Compromise Covenant Treaty Alliance Rivalry
            Kinship Fellowship Solidarity Empathy Compassion Gratitude Humility Patience
            Diligence Prudence Temperance Fortitude Integrity Sincerity Wonder Awe Serenity
            Longing Yearning Epiphany Catharsis Renewal Rebirth Legacy Heritage Tradition
            Ceremony Milestone Threshold
        """),
        "myth": words("""
            Dragon Wyvern Phoenix Griffin Chimera Hydra Golem Orc Goblin Troll Elf Dwarf
            Fairy Pixie Sprite Nymph Siren Mermaid Kraken Basilisk Cockatrice Manticore
            Minotaur Centaur Satyr Cyclops Titan Ogre Imp Demon Angel Seraph Wraith Ghost
            Phantom Specter Banshee Vampire Werewolf Zombie Mummy Gargoyle Unicorn Pegasus
            Sphinx Djinn Genie Leviathan Behemoth Thunderbird Yeti Spell Curse Hex Rune
            Amulet Talisman Grimoire Potion Oracle Prophecy Sorcery Enchantment Revenant
            Lich Witch Wyrm Dryad Naiad Harpy Gorgon Faun Cerberus Valkyrie Norn Fury Muse
            Augur Warlock Enchanter Conjurer Necromancer Sigil Glyph Omen Portent Blessing
            Homunculus Kobold Gnome Poltergeist Ifrit Shade Wisp Barghest Selkie Kelpie
            Wendigo Chupacabra Roc Simurgh Salamander Undine Sylph Efreet Marid Naga
            Rakshasa Oni Tengu Kitsune Kappa Bunyip Drake Lindworm Amphisbaena Catoblepas
            Peryton Hippogriff Nightmare Familiar Coven Incantation Invocation Summoning
            Banishment Divination Scrying Portal Ley Sanctum Reliquary Effigy Idol Totem
            Fetish Charm Curseward Hexbolt
        """),
        "job": words("""
            Wizard Sorcerer Ranger Thief Rogue Pirate Sailor Captain Chef Gardener
            Blacksmith Detective Poet Painter Dancer Jester Clown Wanderer Pilgrim Monk
            Alchemist Archer Swordsman Warrior Soldier Guard Sentinel Warden Guardian Queen
            Prince Princess Emperor Steward Servant Maid Merchant Trader Farmer Angler
            Shepherd Woodcutter Ferryman Coachman Navigator Pilot Engineer Courier Janitor
            Firefighter Officer Doctor Nurse Pharmacist Teacher Student Librarian Reporter
            Writer Editor Translator Singer Actor Director Minstrel Miner Carpenter Potter
            Tailor Weaver Seer Prophet Priest Shaman Scholar Inventor Explorer Traveler
            Athlete Referee Juggler Acrobat Sculptor Paladin Cavalier Squire Crusader Herald
            Scribe Barkeep Innkeeper Huntsman Stonecutter Archivist Curator Conservator
            Geologist Astronomer Botanist Zoologist Marine Chemist Physicist Actuary
            Economist Sociologist Linguist Philologist Historian Proofreader Typesetter
            Illustrator Animator Playwright Novelist Columnist Broadcaster Announcer
            Interpreter Diplomat Notary Paralegal Prosecutor Magistrate Bailiff Auditor
            Bookkeeper Appraiser Underwriter Broker Realtor Surveyor Draftsman Millwright
            Machinist Welder Fitter Rigger Glazier Roofer Plasterer Bricklayer Stonemason
            Locksmith Upholsterer Cobbler Milliner Dyer Tanner Glassblower Goldsmith
            Silversmith Watchmaker Luthier Perfumer Vintner Brewer
        """),
        "music": words("""
            Piano Guitar Fiddle Drum Chime Mandolin Melody Rhythm Chord Ballad Waltz Lullaby
            Flute Piccolo Clarinet Oboe Bassoon Trumpet Trombone Tuba Saxophone Harp Cello
            Viola Violin Banjo Ukulele Accordion Harmonica Xylophone Marimba Tambourine
            Maracas Cymbal Bagpipe Organ Kalimba Sitar Lute Lyre Zither Ocarina Bugle Sonata
            Symphony Concerto Overture Prelude Interlude Refrain Chorus Anthem Serenade
            Nocturne Rhapsody Etude Fugue Octave Tempo Cadence Crescendo Staccato Encore
            Duet Trio Quartet Songbook Hymn Carol Chant Requiem Cantata Oratorio Madrigal
            Quintet Ensemble Orchestra Choir Soloist Conductor Verse Coda Diminuendo Legato
            Vibrato Tremolo Glissando Arpeggio Semitone Scale Mode Key Clef Stave Notation
            Score Sheet Metronome Tuner Pedal Bow String Fretboard Soundhole Mouthpiece
            Valve Snare Bassline Downbeat Upbeat Syncopation Jamming Busking Ovation Recital
            Fanfare Toccata Partita Minuet Polka Tango Mazurka Bolero Chorale Motet Canon
            Ostinato Dissonance Consonance Modulation Cadenza Reprise Medley Riff Groove
            Backbeat Harmonics Timbre Resonance Falsetto Baritone Contralto Descant
            Obbligato
        """),
        "place": words("""
            Market Plaza Metropolis Village Alleyway Bridge Garden Library Museum Theater
            Schoolyard Parkland Harbor Wharf Pier Station Airport Lighthouse Citadel Palace
            Temple Shrine Chapel Cathedral Monastery Tower Attic Cellar Rooftop Courtyard
            Balcony Veranda Greenhouse Barn Cottage Cabin Lodge Tavern Bakery Diner Kitchen
            Bedroom Hallway Staircase Corridor Tunnel Overpass Crossroad Boardwalk Promenade
            Playground Stadium Arena Gymnasium Bathhouse Clinic Pharmacy Bookshop Aquarium
            Gallery Observatory Fortress Boulevard Esplanade Arcade Terrace Atrium Foyer
            Lobby Stairwell Basement Loft Pantry Larder Workshop Studio Planetarium Orchard
            Vineyard Meadowland Pastureland Farmstead Barnyard Silo Windmill Watermill
            Watchtower Belfry Steeple Cloister Abbey Rampart Bastion Turret Drawbridge Moat
            Gatehouse Keep Bazaar Marketplace Emporium Warehouse Depot Terminal Quay Jetty
            Harbourside Campsite Manor Hamlet Rotunda Colonnade Portico Pavilion Gazebo
            Pergola Bandstand Coliseum Forum Agora Necropolis Catacomb Crypt Mausoleum
            Obelisk Cenotaph Waypoint Crossroads Roundabout Underpass Viaduct Aqueduct
            Causeway Embankment Levee Weir Quarry Hollow
        """),
        "food": words("""
            Rice Porridge Noodle Dumpling Bread Toast Cheese Yogurt Omelet Pancake Waffle
            Doughnut Cookie Biscuit Cupcake Brownie Pudding Custard Pastry Croissant Bagel
            Pretzel Sandwich Burger Pizza Pasta Spaghetti Lasagna Risotto Curry Stew Chowder
            Salad Pickle Sausage Bacon Steak Meatball Barbecue Taco Burrito Sushi Tempura
            Kimchi Tofu Potato Carrot Cabbage Lettuce Spinach Broccoli Pumpkin Cucumber
            Garlic Mushroom Apple Strawberry Grape Watermelon Peach Lemon Banana Mango
            Pineapple Blueberry Chocolate Candy Honey Syrup Coffee Cocoa Lemonade Popcorn
            Baguette Brioche Muffin Scone Crumpet Crepe Omelette Frittata Quiche Paella
            Gnocchi Ravioli Linguine Fettuccine Ramen Udon Soba Pho Congee Bisque Consomme
            Goulash Casserole Meatloaf Pastrami Prosciutto Salami Terrine Cutlet Schnitzel
            Kebab Skewer Roast Brisket Ribeye Sirloin Tenderloin Drumstick Fillet Sashimi
            Ceviche Tartare Coleslaw Hummus Guacamole Salsa Chutney Relish Marmalade
            Meringue Tiramisu Cheesecake Macaron Croquette Falafel Pierogi Tamale Empanada
            Samosa Springroll Wonton Gyoza Mochi
        """),
        "sport": words("""
            Soccer Football Baseball Basketball Volleyball Handball Tennis Badminton Squash
            Golf Bowling Billiards Swimming Athletics Marathon Sprint Gymnastics Taekwondo
            Judo Karate Kendo Boxing Wrestling Fencing Archery Shooting Equestrian Rowing
            Canoeing Sailing Surfing Skiing Snowboard Hockey Rugby Cricket Cycling Climbing
            Racket Goalpost Medal Trophy Podium Playoff Overtime Champion Polo Curling
            Skating Diving Triathlon Softball Netball Lacrosse Snooker Darts Jogging Hurdle
            Javelin Discus Relay Scoreboard Dugout Paddle Karting Rafting Dribble Penalty
            Offside Halftime Kickoff Rebound Homerun Slalom Freestyle Backstroke Sprinter
            Bobsleigh Luge Vaulting Dunk Volley Decathlon Biathlon Kayaking Bouldering
            Parkour Skydiving Paragliding Windsurfing Waterpolo Sparring Uppercut Knockout
            Takedown Grapple Somersault Cartwheel Handstand Backflip Warmup Timeout Assist
            Shootout Tiebreak Deuce Birdie Bogey Putter Fairway Racetrack Velodrome Ringside
            Bleachers Grandstand Sprinting
        """),
        "vehicle": words("""
            Bicycle Locomotive Boat Automobile Bus Taxi Truck Motorbike Scooter Skateboard
            Airplane Helicopter Jetliner Spaceship Rocket Submarine Steamship Sailboat Raft
            Kayak Ferry Freighter Warship Galleon Chariot Wagon Cart Handcart Tractor
            Bulldozer Firetruck Ambulance Cruiser Cablecar Subway Tramcar Railcar Carriage
            Sleigh Airship Glider Parachute Gondola Minivan Pickup Limousine Convertible
            Snowplow Monorail Trolley Rickshaw Palanquin Dinghy Yacht Catamaran Hovercraft
            Icebreaker Tanker Barge Trawler Biplane Seaplane Zeppelin Blimp Rover Lander
            Shuttle Snowmobile Unicycle Tricycle Moped Caravan Hearse Coupe Sedan Roadster
            Speedboat Houseboat Tugboat Dredger Forklift Hatchback Roadtrain Camper Trailer
            Sidecar Buggy Quadbike Rollerblade Toboggan Litter Palfrey Skiff Punt Junk
            Sampan Coracle Outrigger Schooner Clipper Cutter Corvette Frigate Airliner
            Turboprop Sailplane Autogyro Tiltrotor Landrover Halftrack Snowcat Trolleybus
            Railbus
        """),
        "product": words("""
            Laptop Computer Keyboard Trackpad Monitor Printer Speaker Earbuds Headphone
            Microphone Drone Tablet Smartphone Charger Battery Remote Fridge Washer Vacuum
            Heater Cooler Purifier Toaster Blender Oven Microwave Television Humidifier
            Razor Toothbrush Shampoo Perfume Lipstick Sneakers Wristwatch Console Projector
            Router Modem Scanner Webcam Joystick Gamepad Powerbank Amplifier Turntable
            Grinder Fryer Steamer Dishwasher Dryer Hairdryer Lotion Sunscreen Slippers
            Sandals Mattress Curtain Doorbell Thermostat Nightlight Calculator Whiteboard
            Socket Adapter Lightbulb Extension Stapler Organizer Diffuser Sanitizer
            Detergent Conditioner Softener Freshener Ricecooker Pressurepot Skillet Colander
            Whisk Peeler Corkscrew Thermos Tumbler Doormat Hanger Wardrobe Bookshelf
            Nightstand Recliner Beanbag Footstool Ottoman Bedframe Duvet Bedsheet Pillowcase
            Towel Bathrobe Slipmat Showerhead Faucet Plunger Squeegee
        """),
    },
    parts=words("""
        Tail Paw Track Wing Shade Whisker Feather Scale Mane Horn Beak Fin Nest Den Egg
        Shard Flock Hamlet Kingdom Voyage Tale Song Waltz Daydream Starlight Glimmer
        Whisper Breeze Ripple Trail Crown Cloak Charm Spark Bloom Grove Cove Peak Path
        Lantern Claw Fang Snout Plume Antler Burrow Roost Lair Halo Murmur
    """),
    # Kept short on purpose: an invented word is joined to one or two others, and
    # long syllables add up to something nobody would type.
    # English compounds without a particle (OwlFeather), so there is no possessive
    # shape here: `Of` would be a word rather than something that attaches to the
    # word in front of it, and a word separator would land on the wrong side.
    frames=(
        WordFrame(("noun",), 10),
        WordFrame(("adjective", "noun"), 34),
        WordFrame(("action", "noun"), 22),
        WordFrame(("noun", "part"), 12),
        WordFrame(("adjective", "noun", "part"), 16),
        WordFrame(("action", "noun", "part"), 6),
    ),
    syn=SyllableSynthesis(
        onset=words("b c d f g h j k l m n p r s t v w z br cl dr fl gr sk sl sn st th tr"),
        vowel=words("a a e e i i o o u u ae ee ou"),
        coda=("", "", *words("n l r s x th ll rk sk")),
        min_syllables=2,
        max_syllables=2,
    ),
)
