// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The English nickname dataset.
final WordLanguageData en = WordLanguageData(
  joiner: '',
  capitalize: true,
  adjectives: words(r'''
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
  '''),
  // The same attributive slot, for what the noun is doing rather than what it is
  // like: Studying + Fox, Tear + Of + Lion.
  actions: words(r'''
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
  '''),
  nouns: {
    WordTheme.animal: words(r'''
      Lion Tiger Leopard Cheetah Fox Wolf Bear Panda Otter Rabbit Squirrel Cat Puppy
      Whale Dolphin Shark Turtle Seal Penguin Owl Sparrow Magpie Swallow Eagle Falcon
      Crane Swan Duck Goose Woodpecker Parrot Peacock Ostrich Horse Deer Elephant
      Giraffe Hippo Monkey Gorilla Frog Lizard Chameleon Snake Butterfly Moth Bee
      Dragonfly Ladybug Snail Ant Spider Octopus Squid Seahorse Starfish Crab Shrimp
      Carp Salmon Mackerel Hedgehog Raccoon Badger Lynx Bison Moose Camel Koala Sloth
      Ferret Mole Bat Heron Pelican Walrus Narwhal Weasel Gazelle Zebra Buffalo Raven
      Kestrel Puffin Flamingo Firefly Mantis Jellyfish Chipmunk Jaguar Cougar Bobcat
      Hyena Jackal Coyote Dingo Meerkat Mongoose Marten Wolverine Beaver Porcupine
      Armadillo Anteater Lemur Baboon Macaque Marmoset Tapir Okapi Ibex Chamois Antelope
      Impala Wildebeest Llama Alpaca Donkey Pony Foal Piglet Lamb Kitten Duckling
      Gosling Cygnet Osprey Vulture Condor Stork Ibis Cormorant Albatross Petrel
      Sandpiper Plover Lapwing Starling Finch Warbler Thrush Cuckoo Hoopoe Kingfisher
      Toucan Macaw Cockatoo Canary Nightingale Cicada Beetle Centipede Scorpion
      Earthworm Tadpole Newt Gecko Iguana Cobra Python
    '''),
    WordTheme.object: words(r'''
      Bottle Pencil Eraser Umbrella Lantern Lamp Clock Mirror Keyring Padlock Satchel
      Cap Boot Goggles Bangle Button Thread Brush Paint Paper Notebook Bookmark Letter
      Postcard Postage Compass Atlas Telescope Microscope Camera Reel Radio Gramophone
      Balloon Kite Spindle Marbles Dice Card Puzzle Blocks Sail Anchor Beacon Tent
      Backpack Bedroll Torch Matchbox Candle Flowerpot Kettle Teacup Spoon Plate
      Saucepan Hatchet Handsaw Cogwheel Mainspring Magnet Ribbon Envelope Cushion Quilt
      Basket Broom Whistle Knot Bucket Easel Flask Goblet Hourglass Inkwell Quiver
      Sundial Parasol Thimble Bobbin Loom Tongs Mallet Rasp File Sharpener Inkpot Quill
      Nib Blotter Folder Binder Clipboard Notepad Paperclip Pushpin Tack Rivet Bolt
      Screw Bracket Hinge Latch Chain Rope Twine Cord Tassel Buckle Zipper Snap Velcro
      Patch Emblem Badge Pendant Locket Brooch Cufflink Hairpin Barrette Headband
      Wristband Anklet Pouch Tote Duffel Trunk Crate Barrel Canister Jar
    '''),
    WordTheme.nature: words(r'''
      Sky Wave Tide Ocean River Lake Waterfall Ravine Mountain Hillside Meadow Forest
      Cavern Desert Sandbank Boulder Pebble Volcano Earthquake Ember Cinder Glacier Reef
      Marshland Prairie Canyon Echo Shadow Avalanche Tundra Oasis Lagoon Geyser Plateau
      Driftwood Steppe Savanna Wetland Swampland Bayou Estuary Delta Atoll Fjord Inlet
      Cove Headland Peninsula Isthmus Archipelago Islet Mesa Butte Gorge Crevasse
      Moraine Scree Talus Bedrock Sandbar Shoal Seabed Trench Abyss Fumarole Sinkhole
      Karst Stalactite Stalagmite Grotto Alcove Overhang Crag Spire Pinnacle
    '''),
    WordTheme.plant: words(r'''
      Treetop Leaf Blossom Petal Rootlet Seedling Berry Moss Fern Bamboo Pinecone Maple
      Dandelion Sunflower Thicket Lotus Orchid Tulip Peony Camellia Magnolia Azalea
      Hyacinth Daffodil Snowdrop Bluebell Foxglove Marigold Lavender Primrose Buttercup
      Cowslip Columbine Larkspur Wisteria Begonia Petunia Zinnia Dahlia Anemone Crocus
      Freesia Gardenia Birch Cedar Pine Oak Elm Beech Alder Poplar Aspen Cypress Sequoia
      Sycamore Hawthorn Acorn Chestnut Walnut Sprout Sapling Stalk Stem Twig Bark Bud
      Pollen Nectar Frond Cactus Toadstool Lichen Seaweed Kelp Bonsai Hedge Shrub
      Bramble Thistle Bulrush Sedge Vine Nettle Redwood Spruce Larch Olive Hickory
      Linden Mulberry Mangrove Papyrus Duckweed Watercress Mistletoe Wormwood Foxtail
      Cattail Sepal Stamen Pistil Calyx Husk Kernel Tendril Rhizome Tuber Sprig Foliage
      Canopy Undergrowth Arbor Trellis Bough Lilac Carnation Gladiolus Hydrangea
      Oleander Hibiscus Honeysuckle Blackthorn Elderberry Dogwood Geranium Delphinium
      Lupine Aster Ranunculus Gorse Bracken Horsetail Liverwort Algae Rattan Palm Yucca
      Agave Succulent Aloe Basil Thyme Oregano Parsley Cilantro Chives Sorrel Fennel
      Dill Sage Marjoram Tarragon Lemongrass Peppermint Spearmint Chamomile
    '''),
    WordTheme.gem: words(r'''
      Gold Silver Copper Iron Steel Bronze Brass Tin Zinc Nickel Platinum Titanium
      Quartz Amethyst Crystal Topaz Garnet Sapphire Emerald Jade Onyx Obsidian Marble
      Granite Limestone Sandstone Slate Basalt Flint Amber Coral Ivory Agate Carnelian
      Peridot Zircon Turquoise Malachite Lapis Mica Pyrite Gypsum Chalk Ore Nugget
      Gemstone Geode Meteorite Diamond Prism Alloy Ingot Aquamarine Tourmaline Tanzanite
      Moonstone Sunstone Bloodstone Azurite Chalcedony Citrine Morganite Kunzite Spinel
      Alexandrite Chrysoprase Rhodonite Sodalite Labradorite Amazonite Aventurine
      Hematite Magnetite Galena Bauxite Cinnabar Realgar Orpiment Barite Celestite
      Apatite Beryl Corundum Olivine Pyroxene Amphibole Serpentine Chlorite Kaolin
      Bentonite Zeolite Cobalt Chromium Manganese Tungsten Antimony Bismuth Cadmium
      Iridium Osmium Palladium Rhodium Ruthenium Tantalum Niobium Vanadium Selenium
      Tellurium Germanium Gallium Indium Thallium Rubidium Caesium Strontium Barium
      Lithium
    '''),
    WordTheme.concept: words(r'''
      Freedom Peace Justice Truth Wisdom Memory Daydream Story Poem Sketch Grammar Logic
      Physics Chemistry Biology Philosophy Mathematics Geometry Algebra History Myth
      Legend Fable Proverb Riddle Secret Promise Journey Adventure Voyage Discovery
      Experiment Question Answer Debate Council Festival Dimension Balance Harmony
      Palette Contrast Ritual Custom Culture Language Alphabet Cipher Archive Almanac
      Calendar Paradox Enigma Odyssey Symmetry Spectrum Horizon Sanctuary Insight
      Intuition Reason Judgment Doctrine Theorem Axiom Corollary Hypothesis Dilemma
      Paradigm Framework Premise Inference Deduction Induction Analogy Metaphor Allegory
      Symbol Motif Theme Narrative Chronicle Annal Testament Manifesto Consensus
      Compromise Covenant Treaty Alliance Kinship Epiphany Catharsis Renewal Rebirth
      Legacy Heritage Tradition Ceremony Milestone Threshold
    '''),
    WordTheme.myth: words(r'''
      Dragon Wyvern Phoenix Griffin Chimera Hydra Golem Orc Goblin Troll Elf Dwarf Fairy
      Pixie Sprite Nymph Siren Mermaid Kraken Basilisk Cockatrice Manticore Minotaur
      Centaur Satyr Cyclops Titan Ogre Imp Demon Angel Seraph Wraith Ghost Phantom
      Specter Banshee Vampire Werewolf Zombie Mummy Gargoyle Unicorn Pegasus Sphinx
      Djinn Genie Leviathan Behemoth Thunderbird Yeti Spell Curse Hex Rune Amulet
      Talisman Grimoire Potion Oracle Prophecy Sorcery Enchantment Revenant Lich Witch
      Wyrm Dryad Naiad Harpy Gorgon Faun Cerberus Valkyrie Norn Fury Muse Augur Warlock
      Enchanter Conjurer Necromancer Sigil Glyph Omen Portent Blessing Homunculus Kobold
      Gnome Poltergeist Ifrit Shade Wisp Barghest Selkie Kelpie Wendigo Chupacabra Roc
      Simurgh Salamander Undine Sylph Efreet Marid Naga Rakshasa Oni Tengu Kitsune Kappa
      Bunyip Drake Lindworm Amphisbaena Catoblepas Peryton Hippogriff Nightmare Familiar
      Coven Incantation Invocation Summoning Banishment Divination Scrying Portal Ley
      Sanctum Reliquary Effigy Idol Totem Fetish Charm Warding Runestone
    '''),
    WordTheme.job: words(r'''
      Wizard Sorcerer Ranger Thief Rogue Pirate Sailor Captain Chef Gardener Blacksmith
      Detective Poet Painter Dancer Jester Clown Wanderer Pilgrim Monk Alchemist Archer
      Swordsman Warrior Soldier Guard Sentinel Warden Guardian Queen Prince Princess
      Emperor Steward Servant Maid Merchant Trader Farmer Angler Shepherd Woodcutter
      Ferryman Coachman Navigator Pilot Engineer Courier Janitor Firefighter Officer
      Doctor Nurse Pharmacist Teacher Student Librarian Reporter Writer Editor
      Translator Singer Actor Director Minstrel Miner Carpenter Potter Tailor Weaver
      Seer Prophet Priest Shaman Scholar Inventor Explorer Traveler Athlete Referee
      Juggler Acrobat Sculptor Paladin Cavalier Squire Crusader Herald Scribe Barkeep
      Innkeeper Huntsman Stonecutter Archivist Curator Conservator Geologist Astronomer
      Botanist Zoologist Marine Chemist Physicist Actuary Economist Sociologist Linguist
      Philologist Historian Proofreader Typesetter Illustrator Animator Playwright
      Novelist Columnist Broadcaster Announcer Interpreter Diplomat Notary Paralegal
      Prosecutor Magistrate Bailiff Auditor Bookkeeper Appraiser Underwriter Broker
      Realtor Surveyor Draftsman Millwright Machinist Welder Fitter Rigger Glazier
      Roofer Plasterer Bricklayer Stonemason Locksmith Upholsterer Cobbler Milliner Dyer
      Tanner Glassblower Goldsmith Silversmith Watchmaker Luthier Perfumer Vintner
      Brewer
    '''),
    WordTheme.music: words(r'''
      Piano Guitar Fiddle Drum Chime Mandolin Melody Rhythm Chord Ballad Waltz Lullaby
      Flute Piccolo Clarinet Oboe Bassoon Trumpet Trombone Tuba Saxophone Harp Cello
      Viola Violin Banjo Ukulele Accordion Harmonica Xylophone Marimba Tambourine
      Maracas Cymbal Bagpipe Organ Kalimba Sitar Lute Lyre Zither Ocarina Bugle Sonata
      Symphony Concerto Overture Prelude Interlude Refrain Chorus Anthem Serenade
      Nocturne Rhapsody Etude Fugue Octave Tempo Cadence Crescendo Staccato Encore Duet
      Trio Quartet Songbook Hymn Carol Chant Requiem Cantata Oratorio Madrigal Quintet
      Ensemble Orchestra Choir Soloist Conductor Verse Coda Diminuendo Legato Vibrato
      Tremolo Glissando Arpeggio Semitone Scale Mode Key Clef Stave Notation Score Sheet
      Metronome Tuner Pedal Bow String Fretboard Soundhole Mouthpiece Valve Snare
      Bassline Downbeat Upbeat Syncopation Jamming Busking Ovation Recital Fanfare
      Toccata Partita Minuet Polka Tango Mazurka Bolero Chorale Motet Canon Ostinato
      Dissonance Consonance Modulation Cadenza Reprise Medley Riff Groove Backbeat
      Harmonics Timbre Resonance Falsetto Baritone Contralto Descant Obbligato
    '''),
    WordTheme.place: words(r'''
      Market Plaza Metropolis Village Alleyway Bridge Garden Library Museum Theater
      Schoolyard Parkland Harbor Wharf Pier Station Airport Lighthouse Citadel Palace
      Temple Shrine Chapel Cathedral Monastery Tower Attic Cellar Rooftop Courtyard
      Balcony Veranda Greenhouse Barn Cottage Cabin Lodge Tavern Bakery Diner Kitchen
      Bedroom Hallway Staircase Corridor Tunnel Overpass Crossroad Boardwalk Promenade
      Playground Stadium Arena Gymnasium Bathhouse Clinic Pharmacy Bookshop Aquarium
      Gallery Observatory Fortress Boulevard Esplanade Arcade Terrace Atrium Foyer Lobby
      Stairwell Basement Loft Pantry Larder Workshop Studio Planetarium Orchard Vineyard
      Meadowland Pastureland Farmstead Barnyard Silo Windmill Watermill Watchtower
      Belfry Steeple Cloister Abbey Rampart Bastion Turret Drawbridge Moat Gatehouse
      Keep Bazaar Marketplace Emporium Warehouse Depot Terminal Quay Jetty Harbourside
      Campsite Manor Hamlet Rotunda Colonnade Portico Pavilion Gazebo Pergola Bandstand
      Coliseum Forum Agora Necropolis Catacomb Crypt Mausoleum Obelisk Cenotaph Waypoint
      Crossroads Roundabout Underpass Viaduct Aqueduct Causeway Embankment Levee Weir
      Quarry Hollow
    '''),
    WordTheme.food: words(r'''
      Rice Porridge Noodle Dumpling Bread Toast Cheese Yogurt Omelet Pancake Waffle
      Doughnut Cookie Biscuit Cupcake Brownie Pudding Custard Pastry Croissant Bagel
      Pretzel Sandwich Burger Pizza Pasta Spaghetti Lasagna Risotto Curry Stew Chowder
      Salad Pickle Sausage Bacon Steak Meatball Barbecue Taco Burrito Sushi Tempura
      Kimchi Tofu Potato Carrot Cabbage Lettuce Spinach Broccoli Pumpkin Cucumber Garlic
      Mushroom Apple Strawberry Grape Watermelon Peach Lemon Banana Mango Pineapple
      Blueberry Chocolate Candy Honey Syrup Lemonade Popcorn Baguette Brioche Muffin
      Scone Crumpet Crepe Omelette Frittata Quiche Paella Gnocchi Ravioli Linguine
      Fettuccine Ramen Udon Soba Pho Congee Bisque Consomme Goulash Casserole Meatloaf
      Pastrami Prosciutto Salami Terrine Cutlet Schnitzel Kebab Skewer Roast Brisket
      Ribeye Sirloin Tenderloin Drumstick Fillet Sashimi Ceviche Tartare Coleslaw Hummus
      Guacamole Salsa Chutney Relish Marmalade Meringue Tiramisu Cheesecake Macaron
      Croquette Falafel Pierogi Tamale Empanada Samosa Springroll Wonton Gyoza Mochi
    '''),
    WordTheme.sport: words(r'''
      Soccer Football Baseball Basketball Volleyball Handball Tennis Badminton Squash
      Golf Bowling Billiards Swimming Athletics Marathon Sprint Gymnastics Taekwondo
      Judo Karate Kendo Boxing Wrestling Fencing Archery Shooting Equestrian Rowing
      Canoeing Sailing Surfing Skiing Snowboard Hockey Rugby Cricket Cycling Climbing
      Racket Goalpost Medal Trophy Podium Playoff Overtime Champion Polo Curling Skating
      Diving Triathlon Softball Netball Lacrosse Snooker Darts Jogging Hurdle Javelin
      Discus Relay Scoreboard Dugout Paddle Karting Rafting Dribble Penalty Offside
      Halftime Kickoff Rebound Homerun Slalom Freestyle Backstroke Sprinter Bobsleigh
      Luge Vaulting Dunk Volley Decathlon Biathlon Kayaking Bouldering Parkour Skydiving
      Paragliding Windsurfing Waterpolo Sparring Uppercut Knockout Takedown Grapple
      Somersault Cartwheel Handstand Backflip Warmup Timeout Assist Shootout Tiebreak
      Deuce Birdie Bogey Putter Fairway Racetrack Velodrome Ringside Bleachers
      Grandstand Sprinting
    '''),
    WordTheme.vehicle: words(r'''
      Bicycle Locomotive Boat Automobile Bus Taxi Truck Motorbike Scooter Skateboard
      Airplane Helicopter Jetliner Spaceship Rocket Submarine Steamship Sailboat Raft
      Kayak Ferry Freighter Warship Galleon Chariot Wagon Cart Handcart Tractor
      Bulldozer Firetruck Ambulance Cruiser Cablecar Subway Tramcar Railcar Carriage
      Sleigh Airship Glider Parachute Gondola Minivan Pickup Limousine Convertible
      Snowplow Monorail Trolley Rickshaw Palanquin Dinghy Yacht Catamaran Hovercraft
      Icebreaker Tanker Barge Trawler Biplane Seaplane Zeppelin Blimp Rover Lander
      Shuttle Snowmobile Unicycle Tricycle Moped Caravan Hearse Coupe Sedan Roadster
      Speedboat Houseboat Tugboat Dredger Forklift Hatchback Streetcar Camper Trailer
      Sidecar Buggy Quadbike Rollerblade Toboggan Litter Palfrey Skiff Punt Junk Sampan
      Coracle Outrigger Schooner Clipper Cutter Corvette Frigate Airliner Turboprop
      Sailplane Autogyro Tiltrotor Snowplough Halftrack Snowcat Trolleybus Railbus
    '''),
    WordTheme.product: words(r'''
      Laptop Computer Keyboard Trackpad Monitor Printer Speaker Earbuds Headphone
      Microphone Drone Tablet Smartphone Charger Battery Remote Fridge Washer Vacuum
      Heater Cooler Purifier Toaster Blender Oven Microwave Television Humidifier Razor
      Toothbrush Shampoo Perfume Lipstick Sneakers Wristwatch Console Projector Router
      Modem Scanner Webcam Joystick Gamepad Powerbank Amplifier Turntable Grinder Fryer
      Steamer Dishwasher Dryer Hairdryer Lotion Sunscreen Mattress Curtain Doorbell
      Thermostat Nightlight Calculator Whiteboard Socket Adapter Lightbulb Extension
      Stapler Organizer Diffuser Sanitizer Detergent Conditioner Softener Freshener
      Percolator Griddle Skillet Colander Whisk Peeler Corkscrew Thermos Tumbler Doormat
      Hanger Wardrobe Bookshelf Nightstand Recliner Beanbag Footstool Ottoman Bedframe
      Duvet Bedsheet Pillowcase Towel Slipmat Showerhead Faucet Plunger Squeegee
    '''),
    WordTheme.color: words(r'''
      Crimson Scarlet Vermilion Carmine Magenta Fuchsia Cerise Blush Apricot Tangerine
      Ochre Umber Sepia Mustard Chartreuse Lime Mint Teal Aqua Cyan Azure Navy Indigo
      Mauve Plum Maroon Burgundy Rust Terracotta Cream Beige Taupe Khaki Charcoal
      Graphite Pewter Alabaster Ebony Jet Cerulean Periwinkle Saffron Blonde Auburn
      Ginger Ultramarine Viridian Bistre Fawn Buff Ecru Oatmeal Porcelain Bone Smoke
      Denim Wine Brick Clay Sand Straw Honeydew Seafoam Powder Ice Ash Soot Coal Pitch
      Puce Russet Sable Gamboge Verdigris Celadon Eggshell Cinnamon Nutmeg Paprika Wheat
    '''),
    WordTheme.finance: words(r'''
      Ledger Invoice Receipt Bond Share Dividend Interest Loan Mortgage Deposit Savings
      Account Budget Audit Asset Liability Equity Capital Revenue Profit Margin Surplus
      Deficit Debt Credit Debit Cheque Currency Exchange Yield Portfolio Escrow Levy
      Tariff Rebate Refund Premium Annuity Pension Payroll Wage Salary Bonus Commission
      Royalty Franchise Merger Buyout Bailout Collateral Lien Voucher Coupon Bullion
      Vault Treasury Exchequer Remittance Clearing Settlement Arbitrage Futures Warrant
      Promissory Overdraft Withdrawal Statement Passbook Custody Trustee Creditor Debtor
      Lender Borrower Guarantor Valuation Appraisal Inflation Recession Liquidity
      Solvency Bankruptcy Windfall Endowment Subsidy Stipend Allowance Expense Outlay
      Turnover Markup Discount Instalment Arrears
    '''),
    WordTheme.tech: words(r'''
      Server Cache Buffer Pixel Bitmap Codec Packet Protocol Daemon Queue Stack Heap
      Pointer Compiler Runtime Firmware Registry Bandwidth Latency Gateway Firewall
      Subnet Hostname Payload Checksum Schema Cursor Backup Cluster Shard Replica
      Snapshot Container Sandbox Pipeline Repository Commit Debugger Macro Array Matrix
      Boolean Integer Syntax Parser Lexer Bytecode Assembler Instruction Interrupt
      Register Bitrate Throughput Handshake Namespace Middleware Endpoint Webhook
      Encryption Decryption Hashing Salting Sharding Caching Rendering Rasterizer Shader
      Texture Polygon Wireframe Viewport Framebuffer Bitfield Nibble Octet Uplink
      Downlink Routing Switching Bridging Tunnelling Multicast Broadcast Datagram
      Bootloader Filesystem Partition Directory Symlink Checkpoint Rollback Migration
    '''),
    WordTheme.weather: words(r'''
      Cloud Breeze Rain Snow Frost Icicle Mist Dewdrop Rainbow Sunset Lightning Thunder
      Downpour Monsoon Typhoon Whirlwind Zephyr Squall Drizzle Snowdrift Hoarfrost Sleet
      Cloudburst Gale Gust Cyclone Blizzard Hailstone Sunbeam Mirage Halo Raindrop
      Shower Stormcloud Rainstorm Snowstorm Sandstorm Duststorm Hurricane Tornado
      Twister Tempest Deluge Torrent Flurry Sprinkle Fogbank Smog Haze Humidity Forecast
      Overcast Sunshine Heatwave Coldsnap Chill Thaw Slush Rime Graupel Whiteout
      Windchill Crosswind Headwind Tailwind Updraft Airstream Jetstream Doldrums
      Sunshower Nimbus Cumulus Cirrus Stratus Contrail Downdraft Snowflake Snowmelt
      Frostbite Blustery Windstorm Icestorm Hailstorm
    '''),
    WordTheme.space: words(r'''
      Star Moon Galaxy Comet Meteor Starlight Corona Zenith Moonbeam Eclipse Universe
      Planet Satellite Asteroid Nebula Orbit Gravity Sunspot Crater Lightyear Cosmos
      Starfield Stardust Supernova Blackhole Quasar Pulsar Milkyway Crescent Fullmoon
      Newmoon Halfmoon Moonrise Void Ether Firmament Exoplanet Solarflare Perihelion
      Aphelion Apogee Perigee Nadir Azimuth Parallax Redshift Starlore Moonscape Skyline
      Cosmology Astronomy Telescopy Gravitas Lunation Sidereal Ecliptic Equator Meridian
      Solarsail Starburst
    '''),
    WordTheme.time: words(r'''
      Sunrise Dawn Dusk Twilight Daybreak Nightfall Solstice Equinox Season Moment
      Eternity Holiday Morning Noon Afternoon Evening Night Midnight Midday Sunup
      Sundown Yesterday Today Tomorrow Weekday Weekend Fortnight Decade Century
      Millennium Epoch Era Aeon Instant Interval Duration Springtime Summertime Winter
      Midsummer Midwinter Daytime Nighttime Lifetime Childhood Youth Adulthood Dotage
      Heyday Dayspring Nightwatch Eventide Forenoon Gloaming Nightlong Daybreaking
      Hereafter Nowadays Bygone Yesteryear Prime Dusking Springtide Harvesttime
      Wintertide Autumntide
    '''),
    WordTheme.emotion: words(r'''
      Courage Curiosity Solitude Nostalgia Longing Yearning Empathy Compassion Gratitude
      Humility Patience Diligence Prudence Temperance Fortitude Integrity Sincerity
      Wonder Awe Serenity Friendship Fellowship Solidarity Rivalry Reverie Joy Sorrow
      Anger Fear Surprise Delight Glee Cheer Bliss Elation Euphoria Rapture Comfort
      Relief Despair Grief Melancholy Gloom Sadness Loneliness Regret Remorse Guilt
      Shame Pride Vanity Envy Jealousy Greed Desire Passion Affection Fondness
      Tenderness Warmth Kindness Sympathy Pity Trust Doubt Suspicion Worry Anxiety Dread
      Terror Panic Rage Wrath Irritation Annoyance Boredom Apathy Zeal Ardour Fervour
      Excitement Eagerness Resolve Willpower Confidence Modesty Calmness Composure
      Nerves Bravery Timidity Gladness Mirth Levity Sentiment Emotion Mood Temper Whim
      Rancour Malice Spite Yearn Solace Ecstasy Anguish Torment Longingness
    '''),
    WordTheme.body: words(r'''
      Head Forehead Eyebrow Eyelash Eyelid Nose Nostril Cheek Chin Jaw Lip Tongue Tooth
      Gum Ear Earlobe Neck Nape Shoulder Elbow Wrist Knuckle Finger Thumb Fingernail
      Fist Chest Rib Belly Navel Spine Waist Hip Thigh Knee Shin Calf Ankle Heel Toe
      Toenail Skull Muscle Tendon Ligament Joint Cartilage Heart Lung Liver Stomach
      Kidney Spleen Intestine Bladder Brain Nerve Vein Artery Capillary Blood Flesh Skin
      Pore Hair Beard Tear Sweat Saliva Breath Pulse Heartbeat Ribcage Backbone
      Collarbone Kneecap Cheekbone Jawbone Eardrum Eyeball Wrinkle Freckle Dimple Scar
      Bruise Blister Callus Torso Limb Sinew Marrow
    '''),
    WordTheme.clothing: words(r'''
      Glove Scarf Slippers Sandals Bathrobe Coat Overcoat Jacket Blazer Shirt Blouse
      Tunic Trousers Jeans Shorts Skirt Dress Gown Vest Cardigan Sweater Jumper Hoodie
      Sock Stocking Tights Underwear Pyjamas Apron Bandana Kerchief Necktie Bowtie Belt
      Sash Sneaker Loafer Sandal Clog Moccasin Slipper Uniform Costume Robe Mantle
      Poncho Raincoat Anorak Parka Windbreaker Swimsuit Wetsuit Overalls Dungarees
      Sleeve Collar Cuff Hem Lapel Lining Fabric Linen Silk Cotton Wool Velvet Corduroy
      Tweed Flannel Leather Fleece Beret Bonnet Helmet Turban Veil Shawl Wrap Muffler
      Earmuff Waistcoat Petticoat Nightgown Camisole Bodice Doublet Kimono Sarong Kaftan
      Hat Shoe Glasses Boots Cloak Mitten Headscarf Sunhat Topcoat Smock
    '''),
    WordTheme.tool: words(r'''
      Shovel Ladder Wrench Pliers Chisel Anvil Bellows Awl Clamp Vise Level Caliper
      Protractor Ruler Scissors Needle Punch Plumbline Hammer Drill Sandpaper Plane
      Pickaxe Sickle Scythe Hoe Plough Rake Spanner Screwdriver Soldering Tapemeasure
      Chalkline Adze Crowbar Lever Wedge Pulley Crank Sledge Trowel Chuck Whetstone
      Grater Sieve Spade Harrow Flail Handle Blade Toolkit Toolbox Fastener Rivetgun
      Nailgun Jigsaw Bandsaw Lathe Sander Chainsaw Ripsaw Coping Gouge Burin Scriber
      Divider Setsquare Tsquare Bevel Jointer Mitre Vice Workbench Clawhammer Ballpeen
      Axe Saw Hacksaw Yardstick Screwjack Pincer Bradawl Scraper Burnisher Drawknife
      Spokeshave Mitrebox Nailset Plumbbob Pipewrench Boltcutter
    '''),
    WordTheme.drink: words(r'''
      Coffee Cocoa Water Soda Cider Cordial Smoothie Milkshake Latte Espresso Cappuccino
      Americano Mocha Macchiato Ristretto Chai Matcha Oolong Infusion Brew Ale Lager
      Stout Pilsner Beer Sherry Port Vermouth Whisky Brandy Vodka Rum Tequila Gin Sake
      Mead Cocktail Highball Champagne Liqueur Absinthe Aperitif Digestif Kefir Kombucha
      Lassi Horchata Sherbet Frappe Eggnog Toddy Grog Wassail Nightcap Tonic Seltzer
      Springwater Icewater Hotwater Sweetwater Coldbrew Nitrobrew Coldpress Milk Juice
      Tea Buttermilk Malt Shandy Sangria Bourbon Scotch Rye Amaretto Curacao Ouzo Raki
      Arrack Verjuice Switchel Barleywater Ricewater Sodawater Sparkling
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
  // English compounds without a particle (OwlFeather), so there is no possessive
  // shape here: `Of` would be a word rather than something that attaches to the
  // word in front of it, and a word separator would land on the wrong side.
  frames: const <WordFrame>[
    WordFrame(<WordSlot>[WordSlot.noun], 10),
    WordFrame(<WordSlot>[WordSlot.adjective, WordSlot.noun], 34),
    WordFrame(<WordSlot>[WordSlot.action, WordSlot.noun], 22),
    WordFrame(<WordSlot>[WordSlot.noun, WordSlot.part], 12),
    WordFrame(<WordSlot>[WordSlot.adjective, WordSlot.noun, WordSlot.part], 16),
    WordFrame(<WordSlot>[WordSlot.action, WordSlot.noun, WordSlot.part], 6),
  ],
  syn: SyllableSynthesis(
    onset: words(r'b c d f g h j k l m n p r s t v w z br cl dr fl gr sk sl sn st th tr'),
    vowel: words(r'a a e e i i o o u u ae ee ou'),
    coda: ['', '', ...words(r'n l r s x th ll rk sk')],
    minSyllables: 2,
    maxSyllables: 2,
  ),
);
