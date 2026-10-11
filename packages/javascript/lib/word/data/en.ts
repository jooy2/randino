import { words } from '../../_internal/parse.js';
import { EN_MODIFIERS } from './modifiers/en.js';
import type { WordLanguageData } from './types.js';

export const EN: WordLanguageData = {
	...EN_MODIFIERS,
	nouns: {
		animal: words(`
			Lion Tiger Leopard Cheetah Fox Wolf Bear Panda Otter Rabbit Squirrel Cat Puppy Whale Dolphin Shark
			Turtle Seal Penguin Owl Sparrow Magpie Swallow Eagle Falcon Crane Swan Duck Goose Woodpecker Parrot
			Peacock Ostrich Horse Deer Elephant Giraffe Hippo Monkey Gorilla Frog Lizard Chameleon Snake
			Butterfly Moth Bee Dragonfly Ladybug Snail Ant Spider Octopus Squid Seahorse Starfish Crab Shrimp
			Carp Salmon Mackerel Hedgehog Raccoon Badger Lynx Bison Moose Camel Koala Sloth Ferret Mole Bat
			Heron Pelican Walrus Narwhal Weasel Gazelle Zebra Buffalo Raven Kestrel Puffin Flamingo Firefly
			Mantis Jellyfish Chipmunk Jaguar Cougar Bobcat Hyena Jackal Coyote Dingo Meerkat Mongoose Marten
			Wolverine Beaver Porcupine Armadillo Anteater Lemur Baboon Macaque Marmoset Tapir Okapi Ibex Chamois
			Antelope Impala Wildebeest Llama Alpaca Donkey Pony Foal Lamb Kitten Osprey Vulture Condor Stork
			Ibis Cormorant Albatross Petrel Sandpiper Plover Lapwing Starling Finch Warbler Thrush Cuckoo Hoopoe
			Kingfisher Toucan Macaw Cockatoo Canary Nightingale Cicada Beetle Centipede Scorpion Worm Tadpole
			Newt Gecko Iguana Cobra Python Dog Cow Pig Sheep Goat Mouse Rat Hamster Chicken Crow Pigeon Kangaroo
			Crocodile Lobster Mosquito Fish Bird Insect Chick Cub Rooster Bull Mule Hare Yak Elk Reindeer Boar
			Rhino Panther Orca Eel Trout Tuna Cod Sardine Herring Anchovy Catfish Goldfish Stingray Swordfish
			Piranha Clam Oyster Mussel Scallop Wasp Hornet Fly Flea Termite Grasshopper Locust Caterpillar
			Cockroach Slug Leech Seagull Dove Hawk Robin Jay Lark Quail Pheasant Emu Hummingbird Toad Tortoise
			Alligator Viper Rattlesnake Anaconda Chimpanzee Orangutan Gibbon Mink Stoat Vole Shrew Gerbil
			Porpoise Wallaby Platypus Wombat Opossum Skunk Manatee Axolotl Cuttlefish Salamander
		`),
		object: words(`
			Bottle Pencil Eraser Umbrella Lantern Lamp Clock Mirror Keyring Padlock Satchel Goggles Bangle
			Button Thread Brush Paint Paper Notebook Bookmark Letter Postcard Postage Compass Atlas Telescope
			Microscope Camera Reel Radio Gramophone Spindle Sail Anchor Beacon Tent Backpack Bedroll Torch
			Matchbox Candle Flowerpot Kettle Teacup Spoon Plate Saucepan Cogwheel Mainspring Magnet Ribbon
			Envelope Basket Broom Whistle Knot Bucket Easel Flask Goblet Hourglass Inkwell Quiver Sundial
			Parasol Thimble Bobbin Loom Tongs File Sharpener Quill Nib Blotter Folder Binder Clipboard Notepad
			Paperclip Pushpin Tack Rivet Bolt Screw Bracket Hinge Latch Chain Rope Twine Cord Tassel Buckle
			Zipper Snap Velcro Patch Emblem Badge Pendant Locket Brooch Cufflink Hairpin Barrette Headband
			Wristband Anklet Pouch Tote Duffel Trunk Crate Barrel Canister Jar Book Pen Crayon Glue Tape Stamp
			Sticker Map Diary Wallet Purse Fork Bowl Mug Tray Chopsticks Napkin Doorknob Binoculars Souvenir
			Necklace Earring Bracelet Ring Flag Suitcase Briefcase Handbag Trellis Key Cup Box Bag Lid Jug
			Teapot Saucer Ladle Dish Pin Lock Ticket Gift Parcel Photo Poster Newspaper Magazine Scroll Globe
			Marker Lighter Sword Shield Spear Arrow Dagger Crown Sack Wire Label Coaster
		`),
		nature: words(`
			Sky Wave Tide Ocean River Lake Waterfall Ravine Mountain Hillside Meadow Forest Cavern Desert
			Sandbank Boulder Pebble Volcano Earthquake Ember Cinder Glacier Reef Prairie Canyon Echo Shadow
			Avalanche Tundra Oasis Lagoon Geyser Plateau Driftwood Steppe Savanna Wetland Bayou Estuary Delta
			Atoll Fjord Inlet Cove Headland Peninsula Isthmus Archipelago Islet Mesa Butte Gorge Crevasse
			Moraine Scree Talus Bedrock Sandbar Shoal Seabed Trench Abyss Fumarole Sinkhole Karst Stalactite
			Stalagmite Grotto Overhang Crag Spire Pinnacle Hill Valley Cliff Island Beach Shore Coast Bay Stream
			Creek Pond Puddle Marsh Bog Jungle Woodland Grassland Dune Mud Soil Dust Cave Peak Summit Ridge
			Slope Riverbank Rapids Whirlpool Current Foam Surf Iceberg Lava Magma Flame Fire Spark Glow Wildfire
			Flood Landslide Tsunami Eruption Tremor Ripple Darkness Grove Sea Swamp Hollow Sand Ice Smoke Ash
			Ground Land Wilderness Rainforest Countryside Basin Floodplain Lowland Moor Heath Vale Gully
			Tributary Seashell Permafrost Caldera Quicksand Chasm Rift Ledge Outcrop Bluff Foothill Glade
			Clearing Copse Taiga Landscape Terrain Outback Gulf Strait Undertow Riptide Erosion Light
		`),
		plant: words(`
			Leaf Blossom Petal Seedling Moss Fern Bamboo Pinecone Maple Dandelion Sunflower Thicket Lotus Orchid
			Tulip Peony Camellia Magnolia Azalea Hyacinth Daffodil Snowdrop Bluebell Foxglove Marigold Lavender
			Primrose Buttercup Cowslip Columbine Larkspur Wisteria Begonia Petunia Zinnia Dahlia Anemone Crocus
			Freesia Gardenia Birch Cedar Pine Oak Elm Beech Alder Poplar Aspen Cypress Sequoia Sycamore Hawthorn
			Acorn Sprout Sapling Stalk Stem Twig Bark Bud Pollen Nectar Frond Cactus Toadstool Lichen Seaweed
			Kelp Bonsai Hedge Shrub Bramble Thistle Bulrush Sedge Vine Nettle Redwood Spruce Larch Hickory
			Linden Mangrove Papyrus Duckweed Mistletoe Wormwood Foxtail Cattail Sepal Stamen Pistil Calyx Husk
			Kernel Tendril Rhizome Tuber Sprig Foliage Canopy Undergrowth Bough Lilac Carnation Gladiolus
			Hydrangea Oleander Hibiscus Honeysuckle Blackthorn Dogwood Geranium Delphinium Lupine Aster
			Ranunculus Gorse Bracken Horsetail Liverwort Algae Rattan Palm Yucca Agave Succulent Aloe Chamomile
			Grass Tree Flower Root Seed Weed Bush Branch Thorn Stump Plant Fir Yew Hemlock Teak Baobab
			Eucalyptus Acacia Banyan Laurel Myrtle Boxwood Pansy Snapdragon Edelweiss Amaryllis Poinsettia
			Verbena Cyclamen Gerbera Pod Bulb Sap Spore Fungus
		`),
		gem: words(`
			Gold Silver Copper Iron Steel Bronze Brass Tin Zinc Nickel Platinum Titanium Quartz Amethyst Crystal
			Topaz Garnet Sapphire Emerald Jade Onyx Obsidian Marble Granite Limestone Sandstone Slate Basalt
			Flint Amber Coral Ivory Agate Carnelian Peridot Zircon Turquoise Malachite Lapis Mica Pyrite Gypsum
			Chalk Ore Nugget Gemstone Geode Meteorite Diamond Prism Alloy Ingot Aquamarine Tourmaline Tanzanite
			Moonstone Sunstone Bloodstone Azurite Chalcedony Citrine Morganite Kunzite Spinel Alexandrite
			Chrysoprase Rhodonite Sodalite Labradorite Amazonite Aventurine Hematite Magnetite Galena Bauxite
			Cinnabar Realgar Orpiment Barite Celestite Apatite Beryl Corundum Olivine Pyroxene Amphibole
			Serpentine Chlorite Kaolin Bentonite Zeolite Cobalt Chromium Manganese Tungsten Antimony Bismuth
			Cadmium Iridium Osmium Palladium Rhodium Ruthenium Tantalum Niobium Vanadium Selenium Tellurium
			Germanium Gallium Indium Thallium Rubidium Caesium Strontium Barium Lithium Stone Gravel Aluminum
			Lead Uranium Silicon Sulfur Carbon Magnesium Calcium Sodium Potassium Jewel Bead Rhinestone Cameo
			Pumice Shale Rubble Concrete Cement Glass Ceramic Plutonium Radium Mineral Metal Feldspar Talc
			Diorite Schist Travertine Soapstone Coal Clay Asphalt
		`),
		concept: words(`
			Freedom Peace Justice Truth Wisdom Memory Daydream Story Poem Sketch Grammar Logic Physics Chemistry
			Biology Philosophy Mathematics Geometry Algebra History Myth Legend Fable Proverb Riddle Secret
			Promise Journey Adventure Voyage Discovery Experiment Question Answer Debate Council Festival
			Dimension Balance Harmony Contrast Ritual Custom Culture Language Alphabet Cipher Archive Almanac
			Calendar Paradox Enigma Odyssey Symmetry Spectrum Horizon Sanctuary Insight Intuition Reason
			Judgment Doctrine Theorem Axiom Corollary Hypothesis Dilemma Paradigm Framework Premise Inference
			Deduction Induction Analogy Metaphor Allegory Symbol Motif Theme Narrative Chronicle Annal Testament
			Manifesto Consensus Compromise Covenant Treaty Alliance Kinship Epiphany Catharsis Renewal Rebirth
			Legacy Heritage Tradition Ceremony Milestone Threshold Idea Thought Dream Plan Rule Law Duty Honor
			Fame Glory Fate Destiny Luck Belief Opinion Theory Proof Evidence Knowledge Science Art Poetry Novel
			Joke Mystery Clue Lesson Skill Talent Virtue Victory Purpose Meaning Beauty Miracle Wish Chaos
			Progress Nightmare Gravitas Life Death Power Energy World Reality Fantasy Imagination Change Chance
			Choice Cause Value Mind System Pattern Society Community War Problem Solution Success Failure Risk
			Danger Safety Health Fact Principle Habit Education Religion Liberty Equality Karma Mercy
		`),
		myth: words(`
			Spell Curse Hex Rune Amulet Talisman Grimoire Potion Prophecy Sorcery Enchantment Sigil Glyph Omen
			Portent Blessing Coven Incantation Invocation Summoning Banishment Divination Scrying Portal Ley
			Sanctum Reliquary Effigy Idol Totem Phylactery Charm Warding Runestone Wand Elixir Magic Jinx Mana
			Aura Spellbook Alchemy Necromancy Witchcraft Wizardry Voodoo Hoodoo Mysticism Seance Telepathy
			Telekinesis Levitation Augury Astrology Horoscope Tarot Numerology Palmistry Pentagram Mojo Juju
			Exorcism Illusion Mantra Grail Relic Orb Ambrosia Panacea Heaven Hell Underworld Paradise Valhalla
			Olympus Avalon Atlantis Eden Purgatory Limbo Elysium Asgard Afterlife Netherworld Tartarus Fairyland
		`),
		monster: words(`
			Dragon Wyvern Phoenix Griffin Chimera Hydra Golem Orc Goblin Troll Elf Dwarf Fairy Pixie Sprite
			Nymph Mermaid Kraken Basilisk Cockatrice Manticore Minotaur Centaur Satyr Cyclops Titan Ogre Imp
			Demon Angel Seraph Wraith Ghost Phantom Specter Banshee Vampire Werewolf Zombie Mummy Gargoyle
			Unicorn Pegasus Sphinx Djinn Genie Leviathan Behemoth Thunderbird Yeti Revenant Lich Wyrm Dryad
			Naiad Harpy Gorgon Faun Valkyrie Norn Muse Homunculus Kobold Gnome Poltergeist Ifrit Wisp Barghest
			Selkie Kelpie Wendigo Chupacabra Roc Simurgh Undine Sylph Marid Naga Rakshasa Oni Tengu Kitsune
			Kappa Bunyip Drake Lindworm Amphisbaena Catoblepas Peryton Hippogriff Familiar Monster Giant Ghoul
			Beast Spirit Leprechaun Gremlin Sasquatch Hellhound Alien Martian Kaiju Slime Mimic Wight Hobgoblin
			Bugbear Boggart Bogeyman Halfling Devil Fiend Cherub Succubus Incubus Asura Yokai Yurei Baku
			Jackalope Goddess Deity Demigod Changeling Nixie Nereid Lamia Kirin Redcap Duende Pooka Dullahan Hag
			Skinwalker Firebird Peri Creature Elemental
		`),
		job: words(`
			Wizard Sorcerer Ranger Thief Rogue Pirate Sailor Captain Chef Gardener Blacksmith Detective Poet
			Painter Dancer Jester Clown Wanderer Pilgrim Monk Alchemist Archer Swordsman Warrior Soldier Guard
			Sentinel Warden Guardian Queen Prince Princess Emperor Steward Servant Maid Merchant Trader Farmer
			Angler Shepherd Woodcutter Ferryman Coachman Navigator Pilot Engineer Courier Janitor Firefighter
			Officer Doctor Nurse Pharmacist Teacher Student Librarian Reporter Writer Editor Translator Singer
			Actor Director Minstrel Miner Carpenter Potter Tailor Weaver Seer Prophet Priest Shaman Scholar
			Inventor Explorer Traveler Athlete Referee Juggler Acrobat Sculptor Paladin Cavalier Squire Crusader
			Herald Scribe Bartender Innkeeper Huntsman Stonecutter Archivist Curator Conservator Geologist
			Astronomer Botanist Zoologist Marine Chemist Physicist Actuary Economist Sociologist Linguist
			Philologist Historian Proofreader Typesetter Illustrator Animator Playwright Novelist Columnist
			Broadcaster Announcer Interpreter Diplomat Notary Paralegal Prosecutor Magistrate Bailiff Auditor
			Bookkeeper Appraiser Underwriter Broker Realtor Surveyor Draftsman Millwright Machinist Welder
			Fitter Rigger Glazier Roofer Plasterer Bricklayer Stonemason Locksmith Upholsterer Cobbler Milliner
			Dyer Tanner Glassblower Goldsmith Silversmith Watchmaker Luthier Perfumer Vintner Brewer Butcher
			Barber Plumber Electrician Mechanic Driver Lawyer Judge Dentist Scientist Programmer Designer
			Architect Accountant Astronaut Conductor Soloist Witch Warlock Enchanter Conjurer Necromancer Augur
			Oracle Druid Bard Cleric Magician Sheriff Waiter Cashier Clerk Secretary Manager Banker Builder
			Cleaner Housekeeper Nanny Lifeguard Paramedic Surgeon Vet Therapist Professor Tutor Coach Trainer
			Journalist Author Composer Musician Pianist Drummer Artist Fisherman Rancher Cowboy Lumberjack
			Postman Messenger Admiral Sergeant Spy Agent Inspector Bodyguard Mayor Senator President Governor
			Monarch Sultan Duke Baron Nun Rabbi Imam Pastor Biologist Analyst Developer Hacker Florist Jeweler
			Barista Attorney Midwife Beekeeper Comedian Gladiator Samurai Ninja Mercenary Vendor Stylist
		`),
		music: words(`
			Piano Guitar Fiddle Drum Chime Mandolin Melody Rhythm Chord Flute Piccolo Clarinet Oboe Bassoon
			Trumpet Trombone Tuba Saxophone Harp Cello Viola Violin Banjo Ukulele Accordion Harmonica Xylophone
			Marimba Tambourine Maracas Cymbal Bagpipe Organ Kalimba Sitar Lute Lyre Zither Ocarina Bugle
			Interlude Refrain Chorus Octave Tempo Cadence Crescendo Staccato Encore Duet Trio Quartet Songbook
			Quintet Ensemble Orchestra Choir Verse Coda Diminuendo Legato Vibrato Tremolo Glissando Arpeggio
			Semitone Scale Mode Clef Stave Notation Score Sheet Metronome Tuner Pedal Bow String Fretboard
			Soundhole Mouthpiece Valve Snare Bassline Downbeat Upbeat Syncopation Jamming Busking Ovation
			Recital Ostinato Dissonance Consonance Modulation Cadenza Reprise Medley Riff Groove Backbeat
			Harmonics Timbre Resonance Falsetto Baritone Contralto Descant Obbligato Song Tune Note Lyric
			Concert Band Gong Bongo Kazoo Pitch Beat Album Record Track Solo Bass Soprano Tenor Alto Treble
			Synthesizer Recorder Castanets Harpsichord Didgeridoo Cornet Dulcimer Balalaika Tabla Djembe Timpani
			Vibraphone Theremin Gamelan Intro Outro Allegro Adagio Andante Unison Polyphony Pizzicato Audition
			Rehearsal Gig Karaoke Playlist Vinyl Cassette Mixtape Soundtrack Remix
		`),
		genre: words(`
			Ballad Waltz Lullaby Sonata Symphony Concerto Overture Prelude Anthem Serenade Nocturne Rhapsody
			Etude Fugue Hymn Carol Chant Requiem Cantata Oratorio Madrigal Toccata Partita Minuet Polka Tango
			Mazurka Bolero Chorale Motet Canon Opera Jazz Blues Fanfare Rock Pop Punk Grunge Britpop Shoegaze
			Emo Screamo Metalcore Thrash Grindcore Deathcore Djent Prog Indie Rockabilly Psychedelia Krautrock
			Darkwave Techno Trance Dubstep Breakbeat Grime Hardstyle Hardcore Gabber Electro Electronica Ambient
			Chillout Downtempo Lofi Chillhop Synthwave Vaporwave Eurodance Eurobeat Moombahton Chiptune
			Psytrance Phonk Riddim Kpop Jpop Mandopop Cantopop Synthpop Electropop Bebop Ragtime Dixieland
			Boogie Soul Funk Disco Rap Gospel Bluegrass Folk Reggae Ska Dancehall Dub Reggaeton Calypso Soca
			Zouk Afrobeat Highlife Amapiano Samba Flamenco Fado Cumbia Bachata Mambo Rumba Merengue Zydeco
			Lambada Tarantella Fandango Mariachi Ranchera Corrido Milonga Bhangra Qawwali Raga Ghazal Enka
			Pansori Chanson Klezmer Shanty Dirge Cabaret Musical Baroque Operetta Zarzuela Fantasia Scherzo
			Rondo Polonaise Gavotte Sarabande Chaconne Intermezzo Impromptu Bagatelle Capriccio Barcarolle Jig
			Hornpipe Habanera Quadrille
		`),
		place: words(`
			Market Plaza Metropolis Village Alley Bridge Garden Schoolyard Harbor Wharf Pier Tunnel Overpass
			Byway Boardwalk Promenade Playground Boulevard Esplanade Orchard Vineyard Pasture Barnyard Moat
			Drawbridge Bazaar Quay Jetty Campsite Hamlet Forum Agora Necropolis Obelisk Cenotaph Waypoint
			Crossroads Roundabout Underpass Viaduct Aqueduct Causeway Embankment Levee Weir Quarry Farm Park Zoo
			Street Town Skyline City Suburb District Square Road Avenue Lane Path Trail Highway Crosswalk
			Sidewalk Yard Lawn Field Ranch Plantation Port Dock Breakwater Canal Dam Reservoir Fountain Statue
			Monument Memorial Cemetery Ruins Campus Fairground Resort Kingdom Frontier Border Outpost Junction
			Driveway Skatepark Runway Railway Paddock Corral Landmark
		`),
		building: words(`
			House School Hospital Church Castle Shop Office Hotel Restaurant Cafe Library Museum Theater Station
			Airport Lighthouse Citadel Palace Temple Shrine Chapel Cathedral Monastery Tower Attic Cellar
			Rooftop Courtyard Balcony Veranda Greenhouse Barn Cottage Cabin Lodge Tavern Bakery Diner Kitchen
			Bedroom Hallway Staircase Corridor Stadium Arena Gym Bathhouse Clinic Pharmacy Bookshop Aquarium
			Gallery Observatory Fortress Terrace Atrium Foyer Lobby Stairwell Basement Loft Pantry Workshop
			Studio Planetarium Silo Windmill Watermill Watchtower Belfry Steeple Cloister Abbey Rampart Bastion
			Turret Gatehouse Keep Emporium Warehouse Depot Terminal Manor Rotunda Colonnade Portico Pavilion
			Gazebo Pergola Bandstand Coliseum Catacomb Crypt Mausoleum Arcade Alcove Arbor Building Apartment
			Villa Mansion Hut Bungalow Chalet Igloo Farmhouse Townhouse Penthouse Duplex Condo Dormitory Hostel
			Inn Motel Bank Supermarket Mall Boutique Pub Saloon Brewery Winery Cafeteria Bistro Pizzeria
			Nightclub Casino Cinema Auditorium Ballroom Spa Sauna Salon Barbershop Laundromat Garage Shed Hangar
			Stable Kennel Granary Mill Factory Refinery Foundry Forge Laboratory Embassy Courthouse Prison
			Dungeon Barracks Bunker Dome Pagoda Mosque Synagogue Convent Nursery Preschool Academy University
			College Skyscraper Shack Yurt Treehouse Property Listing Bathroom Roof Porch Patio Chimney Wall
			Pillar Column Arch Window Door Gate Floor Ceiling Elevator Escalator Closet Parlor Lounge Chamber
			Suite Mezzanine Rafter Gable Doorway Fireplace Hearth Cubicle Classroom
		`),
		food: words(`
			Porridge Noodle Dumpling Bread Toast Yogurt Omelet Pancake Waffle Doughnut Cookie Biscuit Cupcake
			Brownie Pudding Custard Pastry Croissant Bagel Pretzel Sandwich Burger Pizza Pasta Spaghetti Lasagna
			Risotto Curry Stew Chowder Salad Pickle Sausage Steak Meatball Barbecue Taco Burrito Sushi Tempura
			Kimchi Chocolate Candy Popcorn Baguette Brioche Muffin Scone Crumpet Crepe Cornbread Frittata Quiche
			Paella Gnocchi Ravioli Linguine Fettuccine Ramen Udon Soba Pho Congee Bisque Consomme Goulash
			Casserole Meatloaf Terrine Cutlet Schnitzel Kebab Skewer Roast Sashimi Ceviche Tartare Coleslaw
			Hummus Guacamole Meringue Tiramisu Cheesecake Macaron Croquette Falafel Pierogi Tamale Empanada
			Samosa Springroll Wonton Gyoza Mochi Soup Cake Pie Oatmeal Sherbet Affogato Cereal Granola Fries
			Nachos Quesadilla Enchilada Fajita Fritter Biryani Shawarma Pita Naan Tortilla Focaccia Ciabatta Bun
			Sourdough Jelly Sorbet Gelato Sundae Mousse Souffle Eclair Strudel Tart Crumble Fudge Toffee Caramel
			Truffle Marshmallow Lollipop Licorice Biscotti Shortbread Gingerbread Baklava Churro Cracker
			Bibimbap Bulgogi Teriyaki Onigiri Bento Satay Moussaka Tapas Gazpacho Calzone Minestrone Bruschetta
			Ratatouille Sauerkraut Borscht Gumbo Jambalaya Jerky Meal Snack Dessert Breakfast Lunch Dinner
			Brunch Feast
		`),
		ingredient: words(`
			Rice Cheese Tofu Honey Syrup Pastrami Prosciutto Salami Brisket Ribeye Sirloin Tenderloin Drumstick
			Fillet Salsa Chutney Relish Marmalade Egg Butter Jam Sauce Flour Sugar Salt Dough Beef Pork Broth
			Peanut Bacon Cream Mustard Ginger Cinnamon Nutmeg Paprika Saffron Mint Wheat Basil Thyme Oregano
			Parsley Cilantro Chives Dill Sage Marjoram Tarragon Lemongrass Peppermint Chestnut Walnut Verjuice
			Malt Rye Ham Veal Mutton Venison Meat Caviar Roe Lard Gelatin Yeast Starch Oil Vinegar Ketchup
			Mayonnaise Pepper Spice Herb Turmeric Cumin Cardamom Clove Anise Vanilla Cayenne Sesame Quinoa Oats
			Barley Grain Bran Couscous Lentil Chickpea Soybean Miso Tahini Pesto Gravy Marinade Dressing Icing
			Batter Margarine Ghee Curd Ricotta Mozzarella Cheddar Parmesan Brie Feta Gouda Camembert Almond
			Cashew Pistachio Hazelnut Pecan Macadamia Molasses Nori Kombu Wakame Seasoning Condiment Wasabi
			Horseradish Gochujang Chorizo Pepperoni Pancetta Mirin
		`),
		vegetable: words(`
			Potato Carrot Cabbage Lettuce Spinach Broccoli Pumpkin Cucumber Garlic Mushroom Onion Tomato Bean
			Sorrel Watercress Fennel Vegetable Radish Turnip Beet Parsnip Yam Celery Asparagus Artichoke
			Eggplant Zucchini Gourd Chili Jalapeno Habanero Corn Pea Edamame Okra Kale Chard Arugula Endive
			Radicchio Romaine Chicory Leek Shallot Scallion Cauliflower Kohlrabi Rutabaga Cassava Taro Daikon
			Jicama Celeriac Burdock Rhubarb Shiitake Morel Chanterelle Enoki Portobello Porcini Legume
		`),
		fruit: words(`
			Apple Strawberry Grape Watermelon Peach Lemon Banana Mango Pineapple Blueberry Cherry Lime Plum
			Apricot Tangerine Honeydew Berry Mulberry Elderberry Olive Fruit Pear Grapefruit Kiwi Papaya Melon
			Cantaloupe Coconut Avocado Fig Pomegranate Persimmon Lychee Guava Starfruit Durian Jackfruit
			Rambutan Mangosteen Kumquat Quince Nectarine Raspberry Blackberry Cranberry Gooseberry Currant
			Plantain Breadfruit Tamarind Loquat Longan Yuzu Pomelo Citron
		`),
		sport: words(`
			Soccer Football Baseball Basketball Volleyball Handball Tennis Badminton Squash Golf Bowling
			Billiards Swimming Athletics Marathon Sprint Gymnastics Taekwondo Judo Karate Kendo Boxing Wrestling
			Fencing Archery Shooting Equestrian Rowing Canoeing Sailing Surfing Skiing Snowboard Hockey Rugby
			Cricket Cycling Climbing Racket Goalpost Medal Trophy Podium Playoff Overtime Champion Polo Curling
			Skating Diving Triathlon Softball Netball Lacrosse Snooker Darts Jogging Hurdle Javelin Discus Relay
			Scoreboard Dugout Paddle Karting Rafting Dribble Penalty Offside Halftime Kickoff Rebound Homerun
			Slalom Freestyle Backstroke Bobsleigh Luge Vaulting Dunk Volley Decathlon Biathlon Kayaking
			Bouldering Parkour Skydiving Paragliding Windsurfing Waterpolo Sparring Uppercut Knockout Takedown
			Grapple Somersault Cartwheel Handstand Backflip Warmup Timeout Assist Shootout Tiebreak Deuce Birdie
			Bogey Putter Fairway Racetrack Velodrome Ringside Bleachers Grandstand Pommel Race Match Goal Team
			Net Court Rink Tackle Umpire Tournament League Striker Goalkeeper Barbell Dumbbell Treadmill Yoga
			Sumo Fishing Hiking Surfboard Pingpong Dodgeball Shuttlecock Running Pilates Aerobics Jiujitsu
			Aikido Kickboxing Wushu Rodeo Jousting Croquet Bocce Pentathlon Heptathlon Motocross Dressage
			Snorkeling Scuba Kitesurfing Kabaddi Hurling Futsal Inning Foul Touchdown Bunt Shortstop Workout
			Exercise Fitness Squat Lunge Burpee Deadlift
		`),
		vehicle: words(`
			Bicycle Locomotive Boat Automobile Bus Taxi Truck Motorbike Scooter Skateboard Airplane Helicopter
			Spaceship Rocket Submarine Steamship Sailboat Raft Kayak Ferry Freighter Warship Galleon Chariot
			Wagon Cart Tractor Bulldozer Firetruck Ambulance Cruiser Cablecar Subway Railcar Carriage Sleigh
			Airship Glider Parachute Gondola Minivan Pickup Limousine Convertible Snowplow Monorail Trolley
			Rickshaw Palanquin Dinghy Yacht Catamaran Hovercraft Icebreaker Tanker Barge Trawler Biplane
			Seaplane Zeppelin Blimp Rover Lander Shuttle Snowmobile Unicycle Tricycle Moped Caravan Hearse Coupe
			Sedan Roadster Speedboat Houseboat Tugboat Dredger Forklift Hatchback Streetcar Camper Trailer
			Sidecar Buggy Quadbike Rollerblade Toboggan Litter Skiff Punt Junk Sampan Coracle Outrigger Schooner
			Clipper Cutter Corvette Frigate Airliner Turboprop Autogyro Tiltrotor Stagecoach Halftrack Snowcat
			Trolleybus Railbus Train Ship Van Canoe Lifeboat Rowboat Motorboat Jetski Wheelchair Stroller
			Wheelbarrow Tank Tandem Destroyer Battleship Aircraft Excavator Steamroller Car Jet Minibus
			Hoverboard Kart Dragster Harvester Liner Airboat Hydrofoil Gunboat Longship Pedicab Funicular
			Chairlift Maglev Boxcar Caboose Bomber
		`),
		product: words(`
			Laptop Computer Keyboard Trackpad Monitor Printer Speaker Earbuds Headphone Microphone Drone Tablet
			Smartphone Charger Battery Remote Fridge Washer Vacuum Heater Cooler Purifier Toaster Blender Oven
			Microwave Television Humidifier Toothbrush Wristwatch Console Projector Router Modem Scanner Webcam
			Joystick Gamepad Powerbank Amplifier Turntable Grinder Fryer Steamer Dishwasher Dryer Doorbell
			Thermostat Nightlight Calculator Whiteboard Socket Adapter Lightbulb Extension Stapler Organizer
			Diffuser Sanitizer Detergent Softener Freshener Percolator Griddle Skillet Colander Whisk Peeler
			Corkscrew Thermos Tumbler Doormat Hanger Towel Slipmat Showerhead Faucet Plunger Squeegee Telephone
			Headset Cable Plug Fan Radiator Stove Freezer Mixer Juicer Coffeemaker Copier Shredder Smartwatch
			Cartridge Thermometer Toothpaste Floss Soap Deodorant Mouthwash Tissue Diaper Sponge Mop Dustpan
			Duster Trashcan Lawnmower Sprinkler Hose Generator Bleach Alarm Stereo Camcorder Tripod Lens Bandage
			Vitamin Soundbar Opener Lunchbox Foil Gadget Appliance Device Utensil Pacifier
		`),
		beauty: words(`
			Razor Shampoo Perfume Lipstick Hairdryer Lotion Sunscreen Conditioner Cologne Mascara Eyeliner
			Moisturizer Cleanser Serum Comb Tweezers Blush Powder Wig Makeup Cosmetics Skincare Foundation
			Concealer Primer Eyeshadow Gloss Balm Bronzer Highlighter Toner Scrub Aftershave Fragrance Hairspray
			Gel Pomade Wax Perm Curler Hairbrush Trimmer Manicure Pedicure Facial Massage Waxing Tattoo Piercing
			Facelift Makeover Haircut Hairstyle Ponytail Braid Pigtail Mohawk Dreadlocks Afro Updo Bouffant
			Mullet Quiff Pompadour Topknot Cornrows Balayage Kohl Henna Glitter Puff Talcum Toiletries Musk
			Exfoliator Emollient Lacquer Loofah Retinol Collagen Liposuction Reflexology Tanning Threading
			Grooming Shaving
		`),
		color: words(`
			Crimson Scarlet Vermilion Carmine Magenta Fuchsia Cerise Ocher Umber Sepia Chartreuse Teal Aqua Cyan
			Azure Navy Indigo Mauve Maroon Burgundy Rust Terracotta Beige Taupe Khaki Charcoal Graphite Pewter
			Alabaster Ebony Cerulean Periwinkle Blonde Auburn Ultramarine Viridian Bister Fawn Buff Ecru
			Porcelain Brick Straw Seafoam Soot Puce Russet Sable Gamboge Verdigris Celadon Eggshell Red Blue
			Yellow Orange Black Pink Purple Tan Mahogany Rouge Cardinal Cornflower Claret Oxblood Gunmetal Hue
			Tint Pastel Pigment Dye Grey Brunette Color Shade Palette Saturation Undertone Chroma Tincture Sheen
			Swatch Monochrome Grayscale Iridescence Neon Tawny Amaranth Heliotrope Smalt Zaffre Gules Vert
			Argent
		`),
		finance: words(`
			Ledger Invoice Receipt Bond Share Dividend Interest Loan Mortgage Deposit Savings Account Budget
			Audit Asset Liability Equity Capital Revenue Profit Margin Surplus Deficit Debt Credit Debit Check
			Currency Exchange Yield Portfolio Escrow Levy Tariff Rebate Refund Premium Annuity Pension Payroll
			Wage Salary Bonus Commission Royalty Franchise Merger Buyout Bailout Collateral Lien Voucher Coupon
			Bullion Vault Treasury Exchequer Remittance Settlement Arbitrage Futures Warrant Debenture Overdraft
			Withdrawal Statement Passbook Custody Trustee Creditor Debtor Lender Borrower Guarantor Valuation
			Appraisal Inflation Recession Liquidity Solvency Bankruptcy Windfall Endowment Subsidy Stipend
			Allowance Expense Outlay Turnover Markup Discount Installment Arrears Money Cash Coin Cost Fee Tax
			Toll Rent Fund Stock Trade Investment Investor Income Earnings Payment Purchase Sale Bargain Auction
			Bid Tip Wealth Poverty Treasure Jackpot Lottery Wager Insurance Banknote Paycheck Dollar Penny
			Fortune Bill Cent Euro Yen Peso Rupee Franc Ruble Yuan Dime Lease Spending Loss Gain Bribe Ransom
			Loot Fraud Scam Deflation Economy Commerce Banking Prize Reward Scholarship Donation Barter Deal
			Contract Wholesale Welfare Claim Venture Startup Shareholder Acquisition Takeover
		`),
		tech: words(`
			Server Cache Buffer Pixel Bitmap Codec Packet Protocol Daemon Queue Stack Heap Pointer Compiler
			Runtime Firmware Registry Bandwidth Latency Gateway Firewall Subnet Hostname Payload Checksum Schema
			Cursor Backup Cluster Shard Replica Snapshot Container Sandbox Pipeline Repository Commit Debugger
			Macro Array Matrix Boolean Integer Syntax Parser Lexer Bytecode Assembler Instruction Interrupt
			Register Bitrate Throughput Handshake Namespace Middleware Endpoint Webhook Encryption Decryption
			Hashing Salting Sharding Caching Rendering Rasterizer Shader Texture Polygon Wireframe Viewport
			Framebuffer Bitfield Nibble Octet Uplink Downlink Routing Switching Bridging Tunneling Multicast
			Broadcast Datagram Bootloader Filesystem Partition Directory Symlink Checkpoint Rollback Migration
			Software Hardware Program Code App Website Browser Database Network Internet Email Password Login
			Download Upload Virus Malware Robot Algorithm Function Variable Loop Script Module Icon Menu Screen
			Byte Chip Processor Circuit Sensor Antenna Command Link Domain Emoji Data Bug Glitch Update Upgrade
			Version Feature Plugin Widget Interface Tab Wifi Hotspot Storage Proxy Antivirus Spam Phishing
			Spyware Template Query Client Node Reboot Profile Avatar Username Hashtag Meme Blog Podcast Inbox
			Chatbot Dataset Dashboard Spreadsheet Font Screenshot Toolbar Popup Webpage Homepage Blockchain
			Laser Radar Hologram
		`),
		weather: words(`
			Cloud Breeze Rain Snow Frost Icicle Mist Rainbow Sunset Lightning Thunder Downpour Monsoon Typhoon
			Whirlwind Zephyr Squall Drizzle Snowdrift Sleet Cloudburst Gale Gust Cyclone Blizzard Hailstone
			Sunbeam Mirage Halo Raindrop Shower Snowstorm Sandstorm Hurricane Tornado Twister Tempest Deluge
			Torrent Flurry Sprinkle Smog Haze Humidity Forecast Overcast Sunshine Heatwave Coldsnap Chill Thaw
			Slush Rime Graupel Whiteout Updraft Airstream Jetstream Doldrums Sunshower Nimbus Cumulus Cirrus
			Stratus Contrail Downdraft Snowflake Wind Storm Fog Hail Heat Dew Thunderbolt Climate Temperature
			Drought Waterspout Vapor Atmosphere Ozone Weather Cold Calm Freeze Steam Glare Murk Lull Moisture
			Thunderhead Petrichor Sirocco Haboob Derecho Harmattan
		`),
		space: words(`
			Star Moon Galaxy Comet Meteor Corona Zenith Eclipse Universe Planet Satellite Asteroid Nebula Orbit
			Gravity Sunspot Crater Lightyear Cosmos Supernova Blackhole Quasar Pulsar Milkyway Crescent Moonrise
			Void Ether Firmament Exoplanet Solarflare Perihelion Aphelion Apogee Perigee Nadir Azimuth Parallax
			Redshift Moonscape Cosmology Astronomy Lunation Ecliptic Equator Meridian Solarsail Sun Zodiac
			Spacewalk Launchpad Liftoff Probe Orbiter Capsule Wormhole Supergiant Magnetar Photon Radiation
			Moonwalk Airlock Solarwind Space Orion Cassiopeia Andromeda Draco Lyra Cygnus Scorpius Sagittarius
			Aquarius Gemini Taurus Virgo Libra Aries Pisces Centaurus Crux Pleiades Sirius Polaris Vega Rigel
			Betelgeuse Antares Arcturus Aldebaran Deneb Altair Spica Canopus Procyon Capella Castor Pollux
			Regulus Plasma Antimatter Singularity
			Spacetime Rotation Transit Conjunction Magnitude Luminosity Fireball Planetoid
		`),
		planet: words(`
			Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune Pluto Ceres Eris Haumea Makemake Sedna Quaoar
			Orcus Gonggong Salacia Varuna Ixion Vesta Pallas Hygiea Psyche Eros Bennu Ryugu Itokawa Apophis
			Arrokoth Theia Vulcan Phaeton Dimidium Spe Orbitar Fortitudo Aegir Amateru Dagon Meztli Smertrios
			Phobetor Tassili Madriu Yanyan Tondra Eburonia Yvaga Mastika Bendida Nakanbe Awasis Wangshu Pipitea
			Asye Veles Boinayel Eyeke Cayahuanca Hamarik Abol Belisama Mintome Toge Santamasa Noifasui Chura
			Buru Staburags Baiduri Cuptor Xolotl Hairu Laligurans Kereru Albmi Perwana Pollera Viculus Samagiya
			Ramajay Khomsa Barajeel Cruinlagh Ibirapita Madalitso Bambaruush Tahay Awohali Enaiposha Phailinsiam
			Levantes Najsakopajk Qingluan Cuancoa Astrolabos Ahra Aumatex Ixbalanque Surt Haik Mulchatna Makombe
			Zembretta Bocaprins Agouto
		`),
		time: words(`
			Sunrise Dawn Dusk Twilight Daybreak Nightfall Solstice Equinox Season Moment Eternity Holiday
			Morning Noon Afternoon Evening Night Midnight Midday Sundown Yesterday Today Tomorrow Weekday
			Weekend Fortnight Decade Century Millennium Epoch Era Aeon Instant Interval Duration Summertime
			Winter Midsummer Lifetime Childhood Youth Adulthood Dotage Heyday Eventide Forenoon Gloaming
			Hereafter Nowadays Bygone Yesteryear Prime Vesper Autumntide Hour Minute Second Day Week Month Year
			Spring Monday Tuesday Wednesday Thursday Friday Saturday Sunday January February March April May
			June July August September October November December Anniversary Birthday Deadline Schedule Curfew
			Bedtime Lunchtime Dinnertime Vacation Future Age Generation Tonight Rushhour Countdown Time Past
			Teatime Playtime Semester Recess Christmas Easter Halloween Sabbath Ramadan Hanukkah Diwali Passover
			Advent Infancy Adolescence Retirement Timeline Harvest
		`),
		emotion: words(`
			Courage Curiosity Solitude Nostalgia Longing Yearning Empathy Compassion Gratitude Humility Patience
			Diligence Prudence Temperance Fortitude Integrity Sincerity Wonder Awe Serenity Friendship
			Fellowship Solidarity Rivalry Reverie Joy Sorrow Anger Fear Surprise Delight Glee Cheer Bliss
			Elation Euphoria Rapture Comfort Relief Despair Grief Melancholy Gloom Sadness Loneliness Regret
			Remorse Guilt Shame Pride Vanity Envy Jealousy Greed Desire Passion Affection Fondness Tenderness
			Warmth Kindness Sympathy Pity Trust Doubt Suspicion Worry Anxiety Dread Terror Panic Rage Wrath
			Irritation Annoyance Boredom Apathy Zeal Ardor Fervor Excitement Eagerness Resolve Willpower
			Confidence Modesty Calmness Composure Nerves Bravery Timidity Gladness Mirth Levity Sentiment
			Emotion Mood Temper Whim Rancor Malice Spite Contentment Solace Ecstasy Anguish Torment Wistfulness
			Love Hate Happiness Stress Tension Frustration Disgust Admiration Respect Devotion Heartbreak
			Optimism Pessimism Enthusiasm Amusement Impatience Resentment Bitterness Revenge Misery Distress
			Agony Thrill Shyness Loyalty Honesty Generosity Arrogance Ambition Fury Shock Contempt Horror Fright
			Unease Confusion Lust Craving Pleasure Amazement Disbelief Humiliation Woe Hurt Pain Suffering Fun
			Enjoyment Grudge Hostility Aggression Adoration Infatuation Revulsion Insecurity Tranquility
			Motivation Inspiration
		`),
		body: words(`
			Head Forehead Eyebrow Eyelash Eyelid Nose Nostril Cheek Chin Jaw Lip Tongue Tooth Gum Ear Earlobe
			Neck Nape Shoulder Elbow Wrist Knuckle Finger Thumb Fingernail Fist Chest Rib Belly Navel Spine
			Waist Hip Thigh Knee Shin Calf Ankle Heel Toe Toenail Skull Muscle Tendon Ligament Joint Cartilage
			Heart Lung Liver Stomach Kidney Spleen Intestine Bladder Brain Nerve Vein Artery Capillary Blood
			Flesh Skin Pore Hair Beard Tear Sweat Saliva Breath Pulse Heartbeat Ribcage Collarbone Kneecap
			Cheekbone Eardrum Eyeball Wrinkle Freckle Dimple Scar Bruise Blister Callus Torso Limb Sinew Marrow
			Arm Leg Hand Foot Face Eye Mouth Back Sole Throat Armpit Pupil Molar Windpipe Pelvis Tailbone Biceps
			Skeleton Gland Cell Tonsil Appendix Scalp Womb Birthmark Pimple Scab Wound Body Bone Frostbite
			Abdomen Lap Forearm Retina Cornea Palate Larynx Esophagus Breast Gut Pancreas Gallbladder Diaphragm
			Vertebra Femur Triceps Wart Acne Rash Fracture Sprain Cramp Fever Headache Toothache Allergy Flu
			Hormone Gene Posture Mustache Stubble Cuticle Fingerprint
		`),
		clothing: words(`
			Glove Scarf Espadrille Brogue Bathrobe Coat Overcoat Jacket Blazer Shirt Blouse Tunic Trousers Jeans
			Shorts Skirt Dress Gown Vest Cardigan Sweater Hoodie Sock Stocking Tights Underwear Pajamas Apron
			Bandana Kerchief Necktie Bowtie Belt Sash Sneaker Loafer Sandal Clog Moccasin Slipper Uniform
			Costume Robe Mantle Poncho Raincoat Anorak Parka Windbreaker Swimsuit Wetsuit Overalls Sleeve Collar
			Cuff Hem Lapel Lining Fabric Linen Silk Cotton Wool Velvet Corduroy Tweed Flannel Leather Fleece
			Beret Bonnet Helmet Turban Veil Shawl Wrap Muffler Earmuff Petticoat Nightgown Camisole Bodice
			Doublet Kimono Sarong Kaftan Hat Shoe Glasses Cloak Mitten Headscarf Smock Suit Tuxedo Jersey
			Sweatshirt Leggings Bikini Mask Tiara Spacesuit Lifejacket Pocket Hood Shoelace Beanie Hijab Sari
			Kilt Tutu Leotard Tracksuit Jumpsuit Lace Nylon Cashmere Suede Fur Tartan Boot Cap Denim Sunglasses
			Cape Cravat Bra Lingerie Boxers Corset Yukata Hanbok Qipao Toga Dashiki Turtleneck Sweatpants
			Joggers Chinos Romper Onesie Bib Stiletto Galoshes Fedora Sombrero Visor Balaclava Monocle Seam
			Satin Chiffon Polyester Spandex Rayon Canvas Burlap Gingham Muslin Taffeta Tulle Mohair Twill Outfit
			Garment
		`),
		tool: words(`
			Shovel Ladder Wrench Pliers Chisel Anvil Bellows Awl Clamp Vise Level Caliper Protractor Ruler
			Scissors Needle Punch Plumbline Hammer Drill Sandpaper Plane Pickaxe Sickle Scythe Hoe Plow Rake
			Screwdriver Soldering Tapemeasure Chalkline Adze Crowbar Lever Wedge Pulley Crank Sledge Trowel
			Chuck Whetstone Grater Sieve Spade Harrow Flail Handle Blade Toolkit Toolbox Fastener Rivetgun
			Nailgun Jigsaw Bandsaw Lathe Sander Chainsaw Ripsaw Gouge Burin Scriber Divider Setsquare Tsquare
			Bevel Jointer Miter Workbench Axe Saw Hacksaw Yardstick Screwjack Pincer Bradawl Scraper Burnisher
			Drawknife Spokeshave Miterbox Nailset Plumbbob Boltcutter Knife Nail Hook Peg Pitchfork Shears
			Clippers Pruner Machete Cleaver Mortar Pestle Funnel Spatula Blowtorch Sawhorse Ratchet Multitool
			Boxcutter Crucible Staple Drillbit Wirecutter Paintbrush Stencil Winch Hoist Mattock Auger Hatchet
			Mallet Rasp Scaffold Jackhammer Polisher Gauge Micrometer Scoop Magnifier Scalpel Forceps Syringe
			Stethoscope Tool
		`),
		drink: words(`
			Coffee Cocoa Water Soda Cider Cordial Smoothie Milkshake Latte Espresso Cappuccino Americano Mocha
			Macchiato Ristretto Chai Matcha Oolong Infusion Brew Ale Lager Stout Pilsner Beer Sherry Vermouth
			Whiskey Brandy Vodka Rum Tequila Gin Sake Mead Cocktail Highball Champagne Liqueur Absinthe Aperitif
			Digestif Kefir Kombucha Lassi Horchata Frappe Eggnog Toddy Grog Wassail Nightcap Tonic Seltzer Milk
			Juice Tea Buttermilk Shandy Sangria Bourbon Scotch Amaretto Curacao Ouzo Raki Arrack Switchel Cola
			Mojito Margarita Martini Daiquiri Negroni Cognac Grappa Schnapps Mezcal Soju Prosecco Merlot
			Riesling Chianti Rootbeer Boba Kvass Cortado Rooibos Slushie Limeade Lemonade Spritzer Mimosa Julep
			Moonshine Liquor Ayran Wine Baijiu Makgeolli Shochu Cava Bellini Gimlet Paloma Caipirinha Sencha
			Mocktail Beverage Drink Sambuca Limoncello Booze Kirsch Pisco Aquavit Chardonnay Cabernet Shiraz
			Malbec
		`),
		toy: words(`
			Balloon Kite Marbles Dice Card Puzzle Blocks Toy Game Doll Teddybear Ball Yoyo Frisbee Boomerang
			Chess Checkers Domino Backgammon Bingo Poker Solitaire Charades Hopscotch Peekaboo Leapfrog Hangman
			Tictactoe Sudoku Crossword Trivia Mahjong Roulette Pinata Slide Swing Seesaw Carousel Sandpit
			Sandcastle Trampoline Dollhouse Puppet Marionette Rattle Hobbyhorse Pogostick Stilts Jumprope
			Hulahoop Pinwheel Whirligig Figurine Spinner Snowglobe Bubble Slingshot Pinball Foosball Origami
			Rubberduck Trainset Toysoldier Glowstick Sparkler Confetti Plushie Gyroscope Tangram Abacus Jacks
			Tiddlywinks Mancala Ludo Rummy Blackjack Baccarat Canasta Cribbage Shogi Xiangqi Quiz Joker Pawn
			Rook Checkmate Firecracker Firework Streamer Noisemaker Putty Playhouse Kendama Diabolo Dreidel
		`),
		sound: words(`
			Sound Noise Voice Silence Tone Whisper Murmur Shout Yell Scream Shriek Screech Cry Sob Wail Whimper
			Sigh Gasp Groan Moan Grunt Snort Laughter Giggle Chuckle Cackle Hum Buzz Hiss Rustle Whir Roar Growl
			Howl Snarl Woof Purr Meow Moo Oink Quack Cluck Neigh Bleat Croak Ribbit Squeak Squeal Tweet Chirp
			Trill Warble Coo Caw Hoot Yodel Rumble Thud Thump Bang Boom Crash Clang Clatter Clink Jingle Ding
			Peal Beep Honk Click Tick Knock Patter Footstep Thunderclap Applause Clap Hiccup Sneeze Cough Yawn
			Burp Snore Babble Chatter Mumble Splash Plop Crunch Crackle Sizzle Fizz Whoosh Swish Ping Zap Drip
			Trickle Gurgle Twang Static Din Clamor Uproar Hubbub Commotion Siren Ringtone Creak Squelch Slurp
			Gulp Smack Slap Clunk Clank Bump Blare Toot Whoop Whine Yelp Bray Tinkle Jangle Gargle Splatter Zoom
			Vroom Wheeze Sniff Snicker Guffaw Bellow Holler Hush Mutter Grumble Knell Squawk Whinny Boo Jeer
			Explosion Blast Gunshot Ruckus Tumult Cacophony Volume Decibel
		`),
		person: words(`
			Person Human Child Baby Newborn Toddler Kid Boy Girl Teenager Youngster Adult Elder Man Woman Lady
			Gentleman Mother Father Parent Son Daughter Brother Sister Sibling Twin Grandmother Grandfather
			Grandchild Uncle Aunt Nephew Niece Cousin Husband Wife Bride Groom Widow Orphan Ancestor Relative
			Neighbor Friend Companion Rival Enemy Stranger Guest Host Visitor Newcomer Villager Citizen Roommate
			Classmate Teammate Playmate Spectator Bystander Passerby Witness Customer Patient Passenger Tourist
			Nomad Pioneer Hermit Loner Outcast Refugee Outlaw Prisoner Beggar Hero Villain Rascal Prankster
			Sleepyhead Bookworm Dreamer Genius Fool Coward Bully Brat Crybaby Tattletale Braggart Chatterbox
			Gossip Grouch Optimist Pessimist Romantic Rebel Leader Boss Veteran Beginner Expert Winner Loser
			Volunteer Lad Lass Maiden Daredevil Sleepwalker Castaway Sweetheart Grandparent Partner Spouse
			Couple Family Ally Colleague Mentor Apprentice Peer Crowd Audience Celebrity Victim Survivor Suspect
			Criminal Hostage Owner Tenant Landlord Member Foreigner Immigrant Exile Drifter Vagabond Introvert
			Extrovert Nerd Geek Klutz Amateur Underdog Sidekick Prodigy Hothead Busybody Copycat Showoff
		`),
		furniture: words(`
			Cushion Quilt Mattress Curtain Wardrobe Bookshelf Nightstand Recliner Beanbag Footstool Ottoman
			Duvet Bedsheet Pillowcase Chair Desk Bed Sofa Table Stool Bench Shelf Drawer Cradle Crib Hammock Rug
			Carpet Blanket Pillow Bolster Lampshade Chandelier Sconce Candlestick Candelabra Vase Urn Frame
			Cabinet Cupboard Dresser Bureau Sideboard Armchair Rocker Loveseat Futon Daybed Bunkbed Headboard
			Bedpost Bedspread Tablecloth Doily Rack Hatstand Mantelpiece Bookend Toybox Hamper Shutter Valance
			Tapestry Wallpaper Highchair Playpen Bassinet Divan Armoire Pew Throne Locker Chaise Coffer Credenza
			Hutch Counter Sink Bathtub Toilet Planter Blinds Altar Pulpit Lectern Pedestal Furniture Upholstery
			Bedding Pouf
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
	// English compounds without a particle (OwlFeather), so there is no possessive
	// shape here: `Of` would be a word rather than something that attaches to the
	// word in front of it, and a `wordSeparator` would land on the wrong side.
	// How common each noun is, for `vocabulary` to draw by: the everyday words,
	// and the ones a specialist or a dictionary would know. Every noun in neither
	// list is common. See `WordLevels`.
	levels: {
		basic: words(`
			Lion Tiger Leopard Cheetah Fox Wolf Bear Panda Rabbit Squirrel Cat Puppy Whale Dolphin Shark Turtle
			Seal Penguin Owl Eagle Swan Duck Goose Parrot Peacock Horse Deer Elephant Giraffe Hippo Monkey
			Gorilla Frog Lizard Snake Butterfly Bee Ladybug Snail Ant Spider Octopus Starfish Crab Shrimp Salmon
			Camel Koala Bat Zebra Buffalo Jellyfish Donkey Pony Lamb Kitten Beetle Bottle Pencil Eraser Umbrella
			Lamp Clock Mirror Keyring Padlock Cap Boot Goggles Button Thread Brush Paint Paper Notebook Bookmark
			Letter Postcard Compass Telescope Camera Radio Balloon Kite Marbles Dice Card Puzzle Blocks Anchor
			Tent Backpack Torch Candle Kettle Spoon Plate Magnet Ribbon Envelope Cushion Basket Broom Whistle
			Knot Bucket File Folder Paperclip Bolt Screw Chain Rope Zipper Badge Jar Sky Wave Tide Ocean River
			Lake Waterfall Mountain Hillside Meadow Forest Desert Boulder Pebble Volcano Earthquake Glacier
			Canyon Echo Shadow Avalanche Leaf Blossom Petal Seedling Berry Moss Fern Bamboo Pinecone Maple
			Dandelion Sunflower Lotus Orchid Tulip Lavender Pine Oak Acorn Chestnut Walnut Sprout Stem Twig Bark
			Bud Pollen Nectar Cactus Seaweed Hedge Vine Olive Palm Basil Parsley Gold Silver Copper Iron Steel
			Bronze Brass Tin Platinum Crystal Sapphire Emerald Marble Coral Chalk Diamond Freedom Peace Justice
			Truth Wisdom Memory Story Poem Grammar Physics Chemistry Biology Mathematics History Legend Riddle
			Secret Promise Journey Adventure Discovery Experiment Question Answer Festival Balance Culture
			Language Alphabet Calendar Symbol Tradition Ceremony Dragon Phoenix Goblin Troll Elf Dwarf Fairy
			Mermaid Ogre Demon Angel Ghost Vampire Werewolf Zombie Mummy Unicorn Genie Spell Curse Potion Witch
			Nightmare Portal Charm Blessing Wizard Thief Pirate Sailor Captain Chef Gardener Poet Painter Dancer
			Clown Warrior Soldier Guard Queen Prince Princess Emperor Servant Maid Farmer Pilot Engineer
			Firefighter Officer Doctor Nurse Teacher Student Librarian Reporter Writer Singer Actor Director
			Miner Carpenter Priest Inventor Explorer Traveler Athlete Referee Piano Guitar Drum Melody Rhythm
			Chord Lullaby Flute Clarinet Trumpet Saxophone Harp Cello Violin Harmonica Xylophone Tambourine
			Cymbal Organ Chorus Duet Orchestra Choir Conductor Verse Scale Key Sheet Pedal Bow String Market
			Village Bridge Garden Library Museum Theater Schoolyard Harbor Pier Station Airport Lighthouse
			Palace Temple Tower Attic Rooftop Balcony Greenhouse Barn Cottage Cabin Bakery Kitchen Bedroom
			Hallway Staircase Tunnel Playground Stadium Clinic Pharmacy Bookshop Aquarium Basement Lobby
			Workshop Studio Windmill Warehouse Campsite Crossroads Roundabout Rice Porridge Noodle Dumpling
			Bread Toast Cheese Yogurt Omelet Pancake Waffle Doughnut Cookie Biscuit Cupcake Brownie Pudding
			Pastry Croissant Bagel Pretzel Sandwich Burger Pizza Pasta Spaghetti Lasagna Curry Stew Salad Pickle
			Sausage Bacon Steak Meatball Barbecue Taco Burrito Sushi Tofu Potato Carrot Cabbage Lettuce Spinach
			Broccoli Pumpkin Cucumber Garlic Mushroom Apple Strawberry Grape Watermelon Peach Lemon Banana Mango
			Pineapple Blueberry Chocolate Candy Honey Syrup Lemonade Popcorn Muffin Ramen Cheesecake Soccer
			Football Baseball Basketball Volleyball Tennis Badminton Golf Bowling Swimming Marathon Sprint
			Gymnastics Taekwondo Judo Karate Boxing Wrestling Sailing Surfing Skiing Snowboard Hockey Rugby
			Cricket Cycling Climbing Racket Medal Trophy Champion Skating Diving Jogging Relay Scoreboard
			Penalty Halftime Kickoff Homerun Dunk Somersault Cartwheel Handstand Backflip Warmup Timeout Bicycle
			Boat Bus Taxi Truck Motorbike Scooter Skateboard Airplane Helicopter Spaceship Rocket Submarine
			Sailboat Raft Kayak Ferry Wagon Cart Tractor Bulldozer Firetruck Ambulance Subway Sleigh Parachute
			Minivan Pickup Limousine Yacht Shuttle Tricycle Trailer Laptop Computer Keyboard Monitor Printer
			Speaker Earbuds Headphone Microphone Drone Tablet Smartphone Charger Battery Remote Fridge Vacuum
			Heater Toaster Blender Oven Microwave Television Razor Toothbrush Shampoo Perfume Lipstick
			Dishwasher Dryer Hairdryer Lotion Sunscreen Mattress Curtain Doorbell Calculator Whiteboard
			Lightbulb Stapler Towel Hanger Bookshelf Pillowcase Apricot Mustard Lime Mint Navy Plum Rust Cream
			Beige Charcoal Jet Blonde Ginger Bone Smoke Denim Wine Brick Clay Sand Straw Powder Ice Ash Coal
			Cinnamon Wheat Receipt Share Interest Loan Deposit Savings Account Budget Capital Profit Debt Credit
			Check Exchange Refund Wage Salary Bonus Coupon Vault Withdrawal Statement Allowance Expense Discount
			Server Buffer Pixel Packet Queue Stack Cursor Backup Cluster Snapshot Container Pipeline Commit
			Array Matrix Instruction Register Texture Broadcast Directory Cloud Breeze Rain Snow Frost Icicle
			Mist Rainbow Sunset Lightning Thunder Typhoon Drizzle Blizzard Raindrop Shower Snowstorm Sandstorm
			Hurricane Tornado Smog Humidity Forecast Sunshine Heatwave Chill Snowflake Star Moon Galaxy Comet
			Meteor Eclipse Universe Planet Satellite Asteroid Orbit Gravity Crater Blackhole Milkyway Skyline
			Astronomy Equator Sunrise Dawn Dusk Season Moment Holiday Morning Noon Afternoon Evening Night
			Midnight Midday Yesterday Today Tomorrow Weekday Weekend Decade Century Instant Summertime Winter
			Lifetime Childhood Youth Nowadays Courage Curiosity Patience Wonder Friendship Joy Anger Fear
			Surprise Delight Cheer Comfort Relief Sadness Loneliness Regret Guilt Shame Pride Envy Jealousy
			Greed Passion Warmth Kindness Trust Doubt Worry Anxiety Terror Panic Rage Boredom Excitement
			Confidence Bravery Emotion Mood Temper Head Forehead Eyebrow Eyelash Eyelid Nose Cheek Chin Jaw Lip
			Tongue Tooth Gum Ear Neck Shoulder Elbow Wrist Knuckle Finger Thumb Fingernail Fist Chest Rib Belly
			Spine Waist Hip Thigh Knee Ankle Heel Toe Toenail Skull Muscle Heart Lung Liver Stomach Kidney Brain
			Blood Skin Hair Beard Tear Sweat Breath Pulse Heartbeat Kneecap Eyeball Wrinkle Freckle Dimple Scar
			Bruise Blister Glove Scarf Bathrobe Coat Jacket Shirt Blouse Trousers Jeans Shorts Skirt Dress Gown
			Vest Cardigan Sweater Hoodie Sock Tights Underwear Pajamas Apron Necktie Bowtie Belt Sneaker Sandal
			Slipper Uniform Costume Robe Raincoat Swimsuit Overalls Sleeve Collar Fabric Silk Cotton Wool
			Leather Helmet Hat Shoe Glasses Mitten Shovel Ladder Wrench Pliers Level Ruler Scissors Needle Punch
			Hammer Drill Sandpaper Plane Pickaxe Rake Screwdriver Crowbar Lever Wedge Grater Spade Handle Blade
			Toolkit Toolbox Chainsaw Axe Saw Coffee Cocoa Water Soda Cider Smoothie Milkshake Latte Espresso
			Cappuccino Beer Whiskey Vodka Rum Tequila Gin Cocktail Champagne Milk Juice Tea Toy Game Doll
			Teddybear Ball Yoyo Frisbee Chess Checkers Domino Bingo Poker Hopscotch Peekaboo Slide Swing Seesaw
			Carousel Sandcastle Trampoline Dollhouse Puppet Rattle Jumprope Hulahoop Bubble Sound Noise Voice
			Silence Whisper Shout Yell Scream Cry Sigh Laughter Giggle Hum Buzz Roar Woof Meow Moo Oink Quack
			Squeak Bang Boom Crash Beep Honk Click Knock Applause Clap Hiccup Sneeze Cough Yawn Burp Snore
			Splash Pop Drip Person Human Child Baby Toddler Kid Boy Girl Teenager Adult Man Woman Lady Gentleman
			Mother Father Parent Son Daughter Brother Sister Twin Grandmother Grandfather Uncle Aunt Nephew
			Niece Cousin Husband Wife Bride Groom Neighbor Friend Enemy Stranger Guest Visitor Customer Patient
			Passenger Tourist Hero Villain Genius Fool Bully Leader Boss Winner Loser Chair Desk Bed Sofa Table
			Stool Bench Shelf Drawer Crib Hammock Rug Carpet Blanket Pillow Lampshade Vase Frame Cabinet
			Cupboard Dresser Armchair Wardrobe Toybox Wallpaper Dog Cow Pig Sheep Goat Mouse Rat Hamster Chicken
			Crow Pigeon Kangaroo Crocodile Lobster Mosquito Book Pen Crayon Glue Tape Stamp Sticker Map Diary
			Wallet Purse Fork Bowl Mug Tray Chopsticks Napkin Necklace Earring Bracelet Ring Flag Hill Valley
			Cliff Island Beach Shore Coast Stream Pond Puddle Jungle Mud Soil Dust Cave Peak Fire Flame Flood
			Darkness Grass Tree Flower Root Seed Weed Bush Branch Thorn Stone Rock Gravel Lead Jewel Bead
			Concrete Cement Glass Idea Thought Dream Plan Goal Rule Law Luck Opinion Science Art Novel Joke
			Mystery Clue Lesson Skill Talent Victory Beauty Wish Monster Giant Beast Spirit Wand Magic Butcher
			Barber Plumber Mechanic Driver Lawyer Judge Dentist Scientist Programmer Designer Architect
			Astronaut Song Tune Note Concert Band Opera Jazz House School Hospital Church Castle Farm Park Shop
			Office Hotel Restaurant Cafe Zoo Street Town Egg Soup Cake Pie Cherry Onion Tomato Bean Butter Jam
			Sauce Flour Sugar Salt Beef Pork Peanut Race Match Team Net Court Goalkeeper Yoga Fishing Hiking
			Pingpong Train Ship Van Canoe Wheelchair Stroller Wheelbarrow Tank Telephone Headset Cable Plug
			Stove Freezer Mixer Toothpaste Soap Tissue Diaper Comb Sponge Mop Suitcase Handbag Sunglasses Hose
			Alarm Red Blue Yellow Orange Black Pink Purple Money Cash Coin Cost Fee Tax Rent Income Payment Sale
			Tip Treasure Lottery Dollar Penny Software Program Code App Website Browser Network Internet Email
			Password Login Download Upload Virus Robot Icon Menu Screen Chip Link Emoji Wind Storm Fog Hail Heat
			Dew Temperature Sun Earth Mars Venus Jupiter Saturn Pluto Hour Minute Second Day Week Month Year
			Spring Monday Tuesday Wednesday Thursday Friday Saturday Sunday January February April June July
			August September October November December Birthday Bedtime Lunchtime Vacation Future Age Tonight
			Love Hate Happiness Stress Respect Revenge Shyness Loyalty Honesty Arm Leg Hand Foot Face Eye Mouth
			Back Throat Armpit Skeleton Pimple Wound Suit Jersey Sweatshirt Leggings Bikini Mask Wig Pocket Hood
			Shoelace Beanie Fur Knife Nail Hook Peg Shears Funnel Spatula Paintbrush Cola Cognac Soju Rootbeer
			Boba Slushie Liquor Worm Fish Bird Insect Chick Cub Rooster Bull Hare Rhino Wasp Fly Seagull Dove
			Hawk Robin Toad Tortoise Alligator Chimpanzee Skunk Reindeer Goldfish Grasshopper Caterpillar
			Cockroach Tuna Cup Box Bag Lid Jug Teapot Dish Pin Lock Ticket Gift Photo Poster Newspaper Magazine
			Globe Marker Sword Shield Arrow Crown Sea Ground Land Rainforest Countryside Landscape Seashell
			Light Swamp Wilderness Plant Bulb Pod Metal Mineral Life Death Power Energy World Fantasy
			Imagination Change Chance Choice Problem Solution Success Failure Danger Safety Health Fact Habit
			Education Religion War Mind Value Heaven Hell Paradise Alien Devil Creature Goddess Slime Waiter
			Cashier Manager Banker Builder Cleaner Nanny Lifeguard Surgeon Vet Professor Coach Journalist Author
			Musician Artist Fisherman Cowboy Postman Spy Mayor President Nun Bartender Magician Sheriff
			Secretary Clerk Partner Family Couple Crowd Audience Celebrity Victim Owner Member Nerd Geek Beat
			Album Record Track Solo Bass Gig Karaoke Playlist Rehearsal Audition Punk Rap Disco Reggae Folk Soul
			Funk Techno Gospel Kpop Musical Building Apartment Hut Mansion Igloo Treehouse Motel Bank
			Supermarket Mall Pub Cinema Gym Spa Garage Shed Stable Factory Prison University College Skyscraper
			Bathroom Roof Porch Chimney Wall Window Door Gate Floor Ceiling Elevator Fireplace Classroom Closet
			City Road Square Path Field Yard Lawn Fountain Statue Highway Sidewalk Trail Cemetery Dock Fries
			Cereal Jelly Bun Cracker Lollipop Marshmallow Caramel Nachos Meal Snack Dessert Breakfast Lunch
			Dinner Brunch Ham Meat Oil Vinegar Ketchup Pepper Spice Yeast Vanilla Almond Vegetable Corn Pea
			Celery Radish Eggplant Zucchini Fruit Pear Kiwi Melon Coconut Avocado Raspberry Running Exercise
			Workout Fitness Squat Touchdown Aerobics Car Bandage Device Makeup Cosmetics Gel Manicure Shaving
			Fragrance Hairspray Haircut Hairbrush Massage Tattoo Ponytail Braid Hairstyle Glitter Grey Color
			Shade Brunette Bill Cent Euro Prize Reward Deal Loss Donation Data Bug Update Version Tab Wifi
			Profile Avatar Username Meme Blog Podcast Inbox Font Screenshot Webpage Homepage Laser Spam Weather
			Cold Steam Calm Space Mercury Uranus Neptune March May Time Past Christmas Easter Halloween Playtime
			Recess Shock Horror Fright Confusion Fun Pain Hurt Pleasure Lap Fever Headache Toothache Flu Rash
			Mustache Fingerprint Body Bra Tool Scoop Drink Plushie Quiz Firework Ringtone Slap Explosion Siren
			Volume Boo Sink Bathtub Toilet Blinds Furniture
		`),
		rare: words(`
			Kestrel Marten Marmoset Tapir Okapi Ibex Chamois Osprey Ibis Cormorant Petrel Sandpiper Plover
			Lapwing Warbler Hoopoe Macaque Spindle Bedroll Cogwheel Mainspring Bobbin Rasp Nib Blotter Steppe
			Atoll Headland Isthmus Islet Mesa Butte Crevasse Moraine Scree Talus Shoal Fumarole Karst Crag
			Cowslip Columbine Larkspur Zinnia Freesia Alder Frond Bulrush Sedge Larch Linden Duckweed Wormwood
			Foxtail Sepal Stamen Pistil Calyx Rhizome Tuber Arbor Bough Gladiolus Oleander Blackthorn Delphinium
			Lupine Aster Ranunculus Gorse Bracken Horsetail Liverwort Sorrel Marjoram Tarragon Carnelian Peridot
			Zircon Malachite Lapis Mica Pyrite Gypsum Tourmaline Tanzanite Sunstone Bloodstone Azurite
			Chalcedony Citrine Morganite Kunzite Spinel Alexandrite Chrysoprase Rhodonite Sodalite Labradorite
			Amazonite Aventurine Hematite Magnetite Galena Bauxite Cinnabar Realgar Orpiment Barite Celestite
			Apatite Beryl Corundum Olivine Pyroxene Amphibole Serpentine Chlorite Kaolin Bentonite Zeolite
			Antimony Bismuth Cadmium Iridium Osmium Palladium Rhodium Ruthenium Tantalum Niobium Vanadium
			Tellurium Germanium Gallium Indium Thallium Rubidium Caesium Strontium Barium Almanac Axiom
			Corollary Allegory Annal Covenant Catharsis Wyvern Cockatrice Manticore Satyr Seraph Djinn Grimoire
			Revenant Lich Wyrm Dryad Naiad Gorgon Faun Norn Augur Sigil Glyph Portent Homunculus Kobold Ifrit
			Barghest Selkie Kelpie Wendigo Roc Simurgh Undine Sylph Marid Naga Rakshasa Oni Tengu Kitsune Kappa
			Bunyip Lindworm Amphisbaena Catoblepas Peryton Scrying Ley Reliquary Phylactery Warding Coachman
			Minstrel Cavalier Stonecutter Conservator Actuary Philologist Typesetter Notary Underwriter
			Draftsman Millwright Machinist Fitter Rigger Glazier Upholsterer Cobbler Milliner Dyer Tanner
			Glassblower Silversmith Luthier Perfumer Vintner Kalimba Zither Nocturne Etude Fugue Cantata
			Oratorio Madrigal Coda Diminuendo Legato Tremolo Glissando Arpeggio Semitone Stave Soundhole
			Syncopation Toccata Partita Minuet Mazurka Bolero Chorale Motet Ostinato Consonance Cadenza Backbeat
			Timbre Contralto Descant Obbligato Byway Esplanade Belfry Cloister Rampart Quay Rotunda Colonnade
			Portico Agora Necropolis Cenotaph Weir Congee Bisque Consomme Terrine Kendo Biathlon Velodrome
			Pommel Palanquin Dredger Skiff Sampan Coracle Outrigger Turboprop Autogyro Tiltrotor Halftrack
			Snowcat Railbus Percolator Slipmat Vermilion Carmine Cerise Ocher Umber Chartreuse Cerulean
			Ultramarine Viridian Bister Ecru Puce Russet Sable Gamboge Verdigris Celadon Escrow Levy Annuity
			Lien Bullion Exchequer Remittance Arbitrage Debenture Passbook Guarantor Liquidity Solvency Outlay
			Arrears Daemon Subnet Hostname Checksum Boolean Parser Lexer Bytecode Assembler Throughput Namespace
			Middleware Webhook Hashing Salting Sharding Rasterizer Shader Viewport Framebuffer Bitfield Octet
			Downlink Multicast Datagram Bootloader Symlink Zephyr Squall Rime Graupel Nimbus Cirrus Stratus
			Quasar Pulsar Firmament Perihelion Aphelion Apogee Perigee Nadir Azimuth Parallax Redshift Lunation
			Ecliptic Solarsail Aeon Dotage Eventide Forenoon Gloaming Vesper Autumntide Prudence Temperance
			Fortitude Reverie Rapture Ardor Fervor Timidity Gladness Mirth Levity Rancor Wistfulness Sinew
			Espadrille Brogue Kerchief Petticoat Bodice Doublet Kaftan Awl Caliper Plumbline Chalkline Adze
			Whetstone Harrow Flail Rivetgun Lathe Ripsaw Gouge Burin Scriber Setsquare Tsquare Bevel Jointer
			Miter Screwjack Pincer Bradawl Burnisher Drawknife Spokeshave Miterbox Nailset Plumbbob Ristretto
			Digestif Grog Wassail Curacao Ouzo Raki Arrack Verjuice Switchel Backgammon Solitaire Charades
			Mahjong Roulette Marionette Hobbyhorse Pogostick Whirligig Figurine Snowglobe Foosball Origami
			Toysoldier Glowstick Murmur Shriek Screech Whimper Cackle Whir Snarl Bleat Ribbit Trill Warble Caw
			Yodel Clang Clatter Clink Peal Patter Thunderclap Babble Plop Crackle Gurgle Twang Static Din Clamor
			Uproar Hubbub Commotion Newborn Youngster Sibling Grandchild Ancestor Companion Villager Citizen
			Spectator Bystander Passerby Nomad Pioneer Hermit Outcast Refugee Outlaw Rascal Prankster Braggart
			Grouch Optimist Pessimist Veteran Lad Lass Maiden Daredevil Sleepwalker Castaway Bolster Sconce
			Candlestick Candelabra Urn Bureau Sideboard Loveseat Futon Daybed Headboard Bedpost Bedspread Doily
			Hatstand Mantelpiece Bookend Valance Tapestry Bassinet Divan Armoire Pew Binoculars Souvenir Bog
			Magma Tremor Eruption Stump Uranium Silicon Sulfur Magnesium Potassium Rhinestone Cameo Pumice Shale
			Plutonium Radium Virtue Chaos Ghoul Leprechaun Gremlin Sasquatch Hellhound Elixir Jinx Electrician
			Accountant Lyric Gong Bongo Kazoo Broth Dough Rink Umpire Striker Barbell Dumbbell Sumo Shuttlecock
			Jetski Tandem Destroyer Excavator Steamroller Copier Shredder Cartridge Cologne Mascara Eyeliner
			Moisturizer Cleanser Serum Tweezers Duster Camcorder Tripod Mahogany Rouge Cardinal Cornflower
			Claret Oxblood Gunmetal Hue Tint Pastel Pigment Investor Earnings Wager Banknote Paycheck Malware
			Algorithm Variable Module Processor Circuit Sensor Antenna Domain Thunderbolt Waterspout Vapor Ozone
			Zodiac Orbiter Wormhole Supergiant Magnetar Photon Radiation Airlock Solarwind Astrology Curfew
			Generation Rushhour Devotion Pessimism Resentment Bitterness Agony Arrogance Sole Pupil Molar
			Windpipe Pelvis Tailbone Biceps Gland Tonsil Appendix Scalp Womb Birthmark Scab Tuxedo Tiara
			Spacesuit Lifejacket Hijab Sari Kilt Tutu Leotard Cashmere Suede Tartan Pitchfork Pruner Machete
			Cleaver Mortar Pestle Blowtorch Sawhorse Ratchet Multitool Boxcutter Crucible Drillbit Wirecutter
			Stencil Winch Hoist Mattock Auger Negroni Grappa Schnapps Mezcal Prosecco Merlot Riesling Chianti
			Kvass Cortado Affogato Rooibos Spritzer Mimosa Julep Moonshine Ayran Stoat Vole Shrew Gibbon Axolotl
			Cuttlefish Diorite Schist Travertine Soapstone Hoodoo Augury Tartarus Elysium Juju Wight Bugbear
			Boggart Asura Yokai Lamia Kirin Redcap Duende Peri Nixie Nereid Pooka Dullahan Yurei Baku Dulcimer
			Balalaika Tabla Djembe Timpani Theremin Gamelan Polyphony Pizzicato Andante Adagio Gabber Djent
			Grindcore Deathcore Krautrock Riddim Phonk Moombahton Soca Zouk Highlife Amapiano Zydeco Corrido
			Milonga Qawwali Ghazal Enka Pansori Zarzuela Gavotte Sarabande Chaconne Bagatelle Capriccio
			Barcarolle Hornpipe Habanera Quadrille Dixieland Ranchera Fandango Mezzanine Rafter Gable Granary
			Refinery Foundry Mirin Kombu Wakame Kohlrabi Rutabaga Celeriac Jicama Burdock Loquat Longan Citron
			Kabaddi Hurling Wushu Heptathlon Funicular Maglev Hydrofoil Pedicab Kohl Lacquer Balayage Emollient
			Reflexology Bouffant Pompadour Quiff Smalt Zaffre Gules Vert Argent Heliotrope Tincture Draco Lyra
			Cygnus Scorpius Centaurus Crux Rigel Antares Arcturus Aldebaran Deneb Altair Spica Canopus Procyon
			Capella Castor Pollux Regulus Planetoid Conjunction
			Luminosity Quaoar Orcus Gonggong Salacia Varuna Ixion Hygiea Bennu Ryugu Itokawa Arrokoth Theia
			Phaeton Dimidium Spe Orbitar Fortitudo Aegir Amateru Dagon Meztli Smertrios Phobetor Tassili Madriu
			Yanyan Tondra Eburonia Yvaga Mastika Bendida Nakanbe Awasis Wangshu Pipitea Asye Veles Boinayel
			Eyeke Cayahuanca Hamarik Abol Belisama Mintome Toge Santamasa Noifasui Chura Buru Staburags Baiduri
			Cuptor Xolotl Hairu Laligurans Kereru Albmi Perwana Pollera Viculus Samagiya Ramajay Khomsa Barajeel
			Cruinlagh Ibirapita Madalitso Bambaruush Tahay Awohali Enaiposha Phailinsiam Levantes Najsakopajk
			Qingluan Cuancoa Astrolabos Ahra Aumatex Ixbalanque Surt Haik Mulchatna Makombe Zembretta Bocaprins
			Agouto Revulsion Infatuation Larynx Esophagus Triceps Cravat Qipao Dashiki Taffeta Twill Micrometer
			Baijiu Makgeolli Shochu Sencha Aquavit Kirsch Tiddlywinks Mancala Canasta Cribbage Shogi Xiangqi
			Kendama Diabolo Knell Tumult Credenza Hutch Coffer Pouf
		`)
	}
};
