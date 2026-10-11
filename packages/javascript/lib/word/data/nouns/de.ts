import { taggedNouns } from '../../../_internal/parse.js';

// Written once, with the gender each noun carries; `taggedNouns` splits the tags
// back off into the lookup the modifiers agree against.
export const DE_NOUNS = taggedNouns({
	animal: `
		Katze:f Hund:m Löwe:m Tiger:m Leopard:m Gepard:m Fuchs:m Wolf:m Bär:m Panda:m Otter:m Kaninchen:n
		Eichhörnchen:n Elefant:m Hirsch:m Reh:n Pferd:n Esel:m Kuh:f Stier:m Ziege:f Schaf:n Schwein:n
		Affe:m Gorilla:m Krokodil:n Schlange:f Eidechse:f Schildkröte:f Frosch:m Kröte:f Vogel:m Schwalbe:f
		Spatz:m Rabe:m Falke:m Adler:m Pfau:m Papagei:m Eule:f Taube:f Kranich:m Schwan:m Ente:f Gans:f
		Huhn:n Fisch:m Wal:m Delfin:m Hai:m Krake:m Tintenfisch:m Garnele:f Krabbe:f Schnecke:f Biene:f
		Ameise:f Spinne:f Libelle:f Zikade:f Fliege:f Mücke:f Wurm:m Fledermaus:f Igel:m Waschbär:m Dachs:m
		Luchs:m Bison:m Elch:m Kamel:n Koala:m Faultier:n Frettchen:n Maulwurf:m Reiher:m Pelikan:m
		Walross:n Wiesel:n Gazelle:f Zebra:n Büffel:m Robbe:f Pinguin:m Strauß:m Wildschwein:n Rentier:n
		Antilope:f Gnu:n Giraffe:f Nilpferd:n Nashorn:n Erdmännchen:n Gürteltier:n Biber:m Schnabeltier:n
		Känguru:n Lemur:m Schimpanse:m Pavian:m Tapir:m Iltis:m Marder:m Amsel:f Nachtigall:f Lerche:f
		Wachtel:f Fasan:m Rebhuhn:n Kolibri:m Tukan:m Flamingo:m Storch:m Wiedehopf:m Distelfink:m Elster:f
		Häher:m Kauz:m Bussard:m Möwe:f Specht:m Zaunkönig:m Aal:m Sardine:f Thunfisch:m Dorsch:m Seehecht:m
		Forelle:f Karpfen:m Rochen:m Qualle:f Muschel:f Auster:f Hummer:m Seestern:m Käfer:m Heuschrecke:f
		Grille:f Wespe:f Motte:f Glühwürmchen:n Tausendfüßer:m Skorpion:m Floh:m Raupe:f Hummel:f
		Marienkäfer:m Leguan:m Chamäleon:n Salamander:m Molch:m Boa:f Viper:f Kobra:f Python:m Ratte:f
		Hamster:m Meerschweinchen:n Hase:m Eisbär:m Puma:m Jaguar:m Hyäne:f Lama:n Krähe:f Schmetterling:m
		Hering:m Hecht:m Maus:f Lachs:m Welpe:m Kalb:n Fohlen:n Lamm:n Küken:n Ferkel:n Hahn:m Ochse:m
		Pony:n Maultier:n Gämse:f Steinbock:m Murmeltier:n Siebenschläfer:m Nerz:m Hermelin:n Stinktier:n
		Ameisenbär:m Panther:m Alpaka:n Dromedar:n Gibbon:m Chinchilla:n Wellensittich:m Kanarienvogel:m
		Kakadu:m Truthahn:m Geier:m Uhu:m Habicht:m Rotkehlchen:n Meise:f Kuckuck:m Kormoran:m Albatros:m
		Barsch:m Zander:m Wels:m Makrele:f Scholle:f Goldfisch:m Seepferdchen:n Schwertfisch:m Piranha:m
		Orca:m Seelöwe:m Seehund:m Narwal:m Seeigel:m Krebs:m Kakerlake:f Termite:f Zecke:f Laus:f Wanze:f
		Gottesanbeterin:f Assel:f Egel:m Nacktschnecke:f Gecko:m Waran:m Alligator:m Natter:f
		Blindschleiche:f Axolotl:m
	`,
	object: `
		Flasche:f Bleistift:m Radierer:m Regenschirm:m Lampe:f Laterne:f Spiegel:m Schlüssel:m Schloss:n
		Tasche:f Knopf:m Nadel:f Faden:m Pinsel:m Farbe:f Papier:n Heft:n Brief:m Postkarte:f Briefmarke:f
		Karte:f Fernrohr:n Mikroskop:n Kamera:f Film:m Radio:n Segel:n Anker:m Zelt:n Fackel:f Streichholz:n
		Kerze:f Topf:m Kanne:f Tasse:f Löffel:m Teller:m Zahnrad:n Feder:f Magnet:m Band:n Umschlag:m Korb:m
		Besen:m Pfeife:f Seil:n Eimer:m Fächer:m Schild:m Netz:n Angel:f Krug:m Glöckchen:n Trichter:m
		Tablett:n Schachtel:f Fass:n Dose:f Kompass:m Stecknadel:f Fingerhut:m Knäuel:n Bindfaden:m Strick:m
		Haken:m Nagel:m Schraube:f Scharnier:n Riegel:m Kette:f Schnalle:f Brosche:f Armreif:m Ring:m
		Aktentasche:f Rucksack:m Truhe:f Kiste:f Bottich:m Schale:f Mörser:m Klammer:f Schleife:f Kordel:f
		Docht:m Öse:f Zwirn:m Lupe:f Wecker:m Kanister:m Zwinge:f Buch:n Zeitung:f Uhr:f Koffer:m Glas:n
		Schüssel:f Gabel:f Messer:n Becher:m Taschenlampe:f Feuerzeug:n Notizbuch:n Ordner:m Mappe:f Tinte:f
		Füller:m Kreide:f Klebstoff:m Gummiband:n Reißzwecke:f Schwamm:m Lappen:m Bürste:f Schnur:f Draht:m
		Tüte:f Beutel:m Sack:m Deckel:m Korken:m Globus:m Sanduhr:f Fernglas:n Zettel:m Stempel:m Siegel:n
		Foto:n Bild:n Stock:m Pfeil:m Bogen:m Schwert:n Dolch:m Ohrring:m Armband:n Medaillon:n Geschenk:n
		Kugel:f Brett:n Geldbeutel:m Brieftasche:f Lesezeichen:n Strohhalm:m Klebeband:n Leine:f Paket:n
		Kugelschreiber:m Filzstift:m Buntstift:m Block:m Schlüsselbund:m Sonnenschirm:m Etui:n Karton:m
		Zahnstocher:m Sicherheitsnadel:f Büroklammer:f Spitzer:m Poster:n Plakat:n Fahne:f Briefkasten:m
		Atlas:m Wörterbuch:n Lexikon:n Locher:m Tafel:f Schmuck:m Gemälde:n Krücke:f Schnorchel:m
	`,
	nature: `
		Meer:n Fluss:m See:m Wasserfall:m Tal:n Berg:m Hügel:m Wiese:f Wald:m Höhle:f Wüste:f Sand:m Fels:m
		Kiesel:m Vulkan:m Erdbeben:n Gletscher:m Riff:n Sumpf:m Bach:m Bucht:f Düne:f Gipfel:m Heide:f
		Steppe:f Savanne:f Mündung:f Delta:n Lagune:f Atoll:n Fjord:m Landzunge:f Halbinsel:f Landenge:f
		Inselgruppe:f Eiland:n Hochebene:f Schlucht:f Klippe:f Moräne:f Geröll:n Findling:m Sandbank:f
		Untiefe:f Abgrund:m Geysir:m Doline:f Tropfstein:m Grotte:f Sims:n Hang:m Schatten:m Echo:n Glut:f
		Quelle:f Ufer:n Küste:f Ebene:f Tundra:f Moor:n Oase:f Aue:f Furt:f Strand:m Meerbusen:m Meerenge:f
		Kanal:m Strömung:f Gezeiten:p Welle:f Schaum:m Brandung:f Zinne:f Mulde:f Senke:f Kessel:m Kluft:f
		Karst:m Lichtung:f Dickicht:n Salzwiese:f Meeresarm:m Felsspalte:f Himmel:m Insel:f Stein:m Teich:m
		Tümpel:m Flut:f Ebbe:f Feuer:n Flamme:f Rauch:m Asche:f Staub:m Schlamm:m Lehm:m Kies:m Boden:m
		Lawine:f Erdrutsch:m Tsunami:m Gischt:f Sonnenaufgang:m Sonnenuntergang:m Luft:f Eis:n Eiszapfen:m
		Eisscholle:f Eisberg:m Wildnis:f Hain:m Busch:m Gebirge:n Grat:m Felswand:f Rinnsal:n Sonnenstrahl:m
		Tropfen:m Pfütze:f Watt:n Treibholz:n Funke:m Landschaft:f Stromschnelle:f Kap:n Meeresgrund:m
		Tiefsee:f Spiegelung:f Dunkelheit:f Licht:n Lava:f Natur:f Umwelt:f Ozean:m Gewässer:n Kontinent:m
		Dschungel:m Prärie:f Taiga:f Magma:n Torf:m Humus:m Böschung:f Erosion:f Überschwemmung:f
		Hochwasser:n Waldbrand:m
	`,
	plant: `
		Baum:m Blatt:n Blume:f Wurzel:f Samen:m Frucht:f Moos:n Farn:m Bambus:m Föhre:f Ahorn:m Kirschbaum:m
		Rose:f Lotus:m Chrysantheme:f Orchidee:f Löwenzahn:m Sonnenblume:f Seerose:f Gras:n Zweig:m Trieb:m
		Knospe:f Blütenblatt:n Pollen:m Zapfen:m Eichel:f Ginkgo:m Weide:f Birke:f Zeder:f Tanne:f Eiche:f
		Kastanie:f Rasen:m Alge:f Hecke:f Blumenstrauß:m Kaktus:m Aloe:f Kamille:f Lavendel:m Efeu:m Palme:f
		Stamm:m Rinde:f Dorn:m Mistel:f Stechpalme:f Lorbeer:m Ölbaum:m Apfelbaum:m Mandelbaum:m Pappel:f
		Esche:f Ulme:f Linde:f Buche:f Lärche:f Mammutbaum:m Eukalyptus:m Akazie:f Magnolie:f Kamelie:f
		Begonie:f Petunie:f Geranie:f Nelke:f Gänseblume:f Mohn:m Hyazinthe:f Narzisse:f Tulpe:f Lilie:f
		Dahlie:f Pfingstrose:f Klee:m Binse:f Brennnessel:f Distel:f Maiglöckchen:n Glyzinie:f Fichte:f
		Schilf:n Rebe:f Flechte:f Strauch:m Blüte:f Stängel:m Halm:m Ähre:f Schote:f Holunder:m Hagebutte:f
		Hasel:f Jasmin:m Krokus:m Schneeglöckchen:n Vergissmeinnicht:n Butterblume:f Kornblume:f
		Stiefmütterchen:n Iris:f Gladiole:f Ringelblume:f Primel:f Edelweiß:n Ginster:m Wacholder:m Eibe:f
		Platane:f Zypresse:f Hopfen:m Raps:m Zuckerrohr:n Kraut:n Unkraut:n Setzling:m Keim:m Ranke:f Laub:n
		Ast:m Baumstumpf:m Knolle:f Tang:m Pflanze:f Veilchen:n Flieder:m Malve:f Enzian:m Pinie:f Erle:f
		Liane:f Sukkulente:f Bonsai:m Hortensie:f Azalee:f Rhododendron:m Forsythie:f Lupine:f Aster:f
		Margerite:f Buchsbaum:m Mangrove:f Tabak:m Flachs:m Hanf:m Harz:n Stachel:m Gestrüpp:n
	`,
	gem: `
		Gold:n Silber:n Kupfer:n Eisen:n Stahl:m Bronze:f Messing:n Zinn:n Zink:n Platin:n Kristall:m
		Quarz:m Amethyst:m Achat:m Bernstein:m Perle:f Jade:f Opal:m Obsidian:m Marmor:m Granit:m
		Kalkstein:m Basalt:m Feuerstein:m Meteorit:m Erz:n Edelstein:m Barren:m Glimmer:m Flussspat:m
		Kalzit:m Malachit:m Granat:m Schwefel:m Elfenbein:n Nugget:n Graphit:m Quecksilber:n Gips:m Ader:f
		Olivin:m Turmalin:m Rubin:m Saphir:m Smaragd:m Topas:m Zirkon:m Pyrit:m Magnetit:m Hämatit:m
		Zinnober:m Bleiglanz:m Talk:m Wismut:n Nickel:n Titan:n Aluminium:n Blei:n Wolfram:n Kobalt:n
		Chrom:n Mangan:n Lithium:n Uran:n Lapislazuli:m Karneol:m Jaspis:m Onyx:m Beryll:m Spinell:m
		Peridot:m Alabaster:m Schiefer:m Sandstein:m Gneis:m Quarzit:m Tuff:m Dolomit:m Apatit:m Baryt:m
		Korund:m Feldspat:m Muskovit:m Siderit:m Limonit:m Bauxit:m Diamant:m Kohle:f Mondstein:m
		Tigerauge:n Kalk:m Mineral:n Gestein:n Koralle:f Metall:n Legierung:f Magnesium:n Natrium:n Kalium:n
		Kalzium:n Silizium:n Radium:n Plutonium:n Palladium:n Arsen:n Thallium:n Strass:m Speckstein:m
		Aquamarin:m Perlmutt:n Citrin:m Porzellan:n Keramik:f Phosphor:m Kohlenstoff:m Bimsstein:m Asbest:m
	`,
	concept: `
		Freiheit:f Frieden:m Wahrheit:f Weisheit:f Erinnerung:f Fantasie:f Erzählung:f Gedicht:n Skizze:f
		Grammatik:f Logik:f Physik:f Chemie:f Biologie:f Philosophie:f Mathematik:f Geometrie:f Algebra:f
		Geschichte:f Mythos:m Legende:f Fabel:f Sprichwort:n Rätsel:n Geheimnis:n Versprechen:n Reise:f
		Abenteuer:n Überfahrt:f Entdeckung:f Versuch:m Frage:f Antwort:f Debatte:f Rat:m Fest:n Dimension:f
		Harmonie:f Ritus:m Brauch:m Kultur:f Sprache:f Alphabet:n Chiffre:f Archiv:n Kalender:m Horizont:m
		Ahnung:f Vernunft:f Urteil:n Lehre:f Lehrsatz:m Axiom:n Hypothese:f Paradox:n Dilemma:n Vorbild:n
		Prämisse:f Ableitung:f Analogie:f Metapher:f Sinnbild:n Chronik:f Zeugnis:n Manifest:n Vertrag:m
		Bündnis:n Abstammung:f Erbe:n Zeremonie:f Schwelle:f Vers:m Prosa:f Novelle:f Essay:n These:f
		Synthese:f Analyse:f Methode:f Theorie:f Praxis:f Technik:f Kunst:f Ethik:f Ästhetik:f Rhetorik:f
		Dialektik:f Semantik:f Orthografie:f Kalligrafie:f Gewissheit:f Zufall:m Schicksal:n Los:n Wille:m
		Gewissen:n Identität:f Wesen:n Materie:f Form:f Ursache:f Wirkung:f Ordnung:f Chaos:n Grenze:f
		Ursprung:m Absicht:f Einsicht:f Idee:f Gedanke:m Meinung:f Wissen:n Bildung:f Glaube:m Plan:m
		Regel:f Gesetz:n Recht:n Pflicht:f Ehre:f Ruhm:m Traum:m Witz:m Märchen:n Roman:m Drama:n Komödie:f
		Tragödie:f Wort:n Buchstabe:m Zahl:f Bedeutung:f Sinn:m Prinzip:n Tugend:f Gerechtigkeit:f
		Religion:f Astronomie:f Medizin:f Literatur:f Epos:n Parabel:f Ironie:f Anekdote:f Zitat:n Rede:f
		Leben:n Tod:m Welt:f Wissenschaft:f Gesellschaft:f Politik:f Demokratie:f Erfahrung:f Erfolg:m
		Problem:n Lösung:f Thema:n Beispiel:n Grund:m Unterschied:m Möglichkeit:f Zusammenhang:m Wert:m
		Wirklichkeit:f Gleichheit:f Würde:f Verantwortung:f Erziehung:f Tradition:f Information:f
		Nachricht:f Begriff:m Energie:f Macht:f Fortschritt:m Entwicklung:f Zweck:m Wahl:f Krieg:m Streit:m
		Freundschaft:f Schönheit:f
	`,
	myth: `
		Seele:f Zauber:m Fluch:m Weissagung:f Orakel:n Amulett:n Talisman:m Rune:f Pforte:f Heiligtum:n
		Götze:m Totem:n Vorzeichen:n Omen:n Bestiarium:n Erscheinung:f Beschwörung:f Zauberbuch:n
		Pentagramm:n Reliquie:f Kelch:m Gral:m Zauberstab:m Stab:m Zepter:n Krone:f Zauberspruch:m
		Zaubertrank:m Elixier:n Kristallkugel:f Bann:m Segen:m Alraune:f Hölle:f Paradies:n Unterwelt:f
		Jenseits:n Tarnkappe:f Schriftrolle:f Wunder:n Altar:m Verwandlung:f Horoskop:n Tarot:n
		Wünschelrute:f Geisterschiff:n Spuk:m Jungbrunnen:m Magie:f Mana:n Aura:f Bannkreis:m
		Teleportation:f Weihwasser:n Stein_der_Weisen:m Alchemie:f Hexerei:f Nekromantie:f Wahrsagerei:f
		Ritual:n Glücksbringer:m Walhalla:n Olymp:m Atlantis:n Avalon:n Asgard:n Himmelreich:n Fegefeuer:n
		Elysium:n Schlaraffenland:n Hexenbesen:m Wunderlampe:f Voodoo:n Fetisch:m Unsterblichkeit:f
		Wiedergeburt:f Telepathie:f Unsichtbarkeit:f Exorzismus:m Hexenkessel:m Heiligenschein:m
	`,
	monster: `
		Drache:m Phönix:m Einhorn:n Meerjungfrau:f Fee:f Kobold:m Elf:m Zwerg:m Troll:m Oger:m Riese:m
		Chimäre:f Hydra:f Greif:m Zentaur:m Minotaurus:m Sphinx:f Pegasus:m Basilisk:m Golem:m Vampir:m
		Werwolf:m Gespenst:n Geist:m Dämon:m Engel:m Göttin:f Gott:m Nymphe:f Najade:f Dryade:f Walküre:f
		Muse:f Satyr:m Faun:m Harpyie:f Gorgone:f Zyklop:m Koloss:m Leviathan:m Gnom:m Wichtel:m Undine:f
		Sylphe:f Dschinn:m Hippogreif:m Mantikor:m Lindwurm:m Unhold:m Wassermann:m Monster:n Mumie:f
		Zombie:m Yeti:m Poltergeist:m Irrlicht:n Seeschlange:f Klabautermann:m Sandmann:m Osterhase:m
		Höllenhund:m Fabelwesen:n Ork:m Gestaltwandler:m Ghul:m Teufel:m Halbgott:m Ungeheuer:n Bestie:f
		Außerirdischer:m Marsmännchen:n Gargoyle:m Goblin:m Halbling:m Wyvern:m Behemoth:m Phantom:n
		Untoter:m Wiedergänger:m Homunkulus:m Feuervogel:m Todesfee:f Sensenmann:m Cherub:m Seraph:m Norne:f
		Schutzengel:m Alb:m Nachtmahr:m Drude:f Doppelgänger:m Bigfoot:m Nixe:f Heinzelmännchen:n
		Wolpertinger:m Tatzelwurm:m Krampus:m Buhmann:m Waldschrat:m Sukkubus:m Inkubus:m Lich:m
		Leprechaun:m Wendigo:m Chupacabra:m Naga:m Ifrit:m Perchte:f Mutant:m
	`,
	job: `
		Ritter:m Jäger:m Dieb:m Pirat:m Matrose:m Kapitän:m Koch:m Gärtner:m Schmied:m Detektiv:m Dichter:m
		Maler:m Tänzer:m Clown:m Reisender:m Pilger:m Mönch:m Bogenschütze:m Fechter:m Krieger:m General:m
		Soldat:m Wache:f Pförtner:m König:m Königin:f Prinz:m Prinzessin:f Kaiser:m Butler:m Magd:f Diener:m
		Händler:m Bauer:m Fischer:m Hirte:m Holzfäller:m Fährmann:m Kutscher:m Pilot:m Ingenieur:m
		Briefträger:m Bote:m Kehrer:m Polizist:m Arzt:m Pfleger:m Apotheker:m Tierarzt:m Lehrer:m Schüler:m
		Bibliothekar:m Reporter:m Lektor:m Übersetzer:m Sänger:m Schauspieler:m Regisseur:m Musiker:m
		Bergmann:m Tischler:m Töpfer:m Schneider:m Wahrsager:m Prophet:m Priester:m Gelehrter:m Doktor:m
		Erfinder:m Forscher:m Sportler:m Akrobat:m Bildhauer:m Uhrmacher:m Bäcker:m Brauer:m Gerber:m
		Weber:m Anwalt:m Richter:m Notar:m Buchhalter:m Bankier:m Kassierer:m Verkäufer:m Kellner:m
		Hausmeister:m Lotse:m Fahrer:m Mechaniker:m Klempner:m Maurer:m Glaser:m Juwelier:m Schuster:m
		Hutmacher:m Friseur:m Barbier:m Konditor:m Metzger:m Florist:m Buchhändler:m Archäologe:m Astronom:m
		Biologe:m Geologe:m Botaniker:m Historiker:m Philosoph:m Archivar:m Winzer:m Müller:m Imker:m
		Zimmerer:m Küfer:m Seiler:m Kosmonaut:m Astronaut:m Zahnarzt:m Krankenschwester:f Feuerwehrmann:m
		Bauarbeiter:m Elektriker:m Programmierer:m Journalist:m Fotograf:m Architekt:m Professor:m Student:m
		Bürgermeister:m Schamane:m Druide:m Barde:m Schornsteinfeger:m Knappe:m Nachtwächter:m Gaukler:m
		Narr:m Förster:m Chirurg:m Hebamme:f Sanitäter:m Pfarrer:m Nonne:f Graf:m Herzog:m Fürst:m
		Schiedsrichter:m Spion:m Offizier:m Hexe:f Hexer:m Zauberer:m Nekromant:m Alchemist:m Weiser:m
		Sekretär:m Manager:m Chef:m Beamter:m Unternehmer:m Handwerker:m Arbeiter:m Angestellter:m
		Kaufmann:m Makler:m Berater:m Psychologe:m Physiker:m Chemiker:m Informatiker:m Designer:m Autor:m
		Schriftsteller:m Redakteur:m Moderator:m Komponist:m Pianist:m Erzieher:m Babysitter:m Dachdecker:m
		Schlosser:m Lokführer:m Steward:m Kurier:m Barkeeper:m Optiker:m Physiotherapeut:m Therapeut:m
		Admiral:m Kommissar:m Agent:m Diplomat:m Botschafter:m Politiker:m Minister:m Präsident:m Kanzler:m
		Steuerberater:m Dozent:m Wissenschaftler:m Techniker:m Entwickler:m Hacker:m Kameramann:m Jongleur:m
		Dompteur:m Jockey:m Steinmetz:m Sattler:m Kosmetiker:m Visagist:m Masseur:m Bademeister:m
		Rettungsschwimmer:m Tankwart:m Knecht:m Herold:m Söldner:m Gladiator:m Samurai:m Ninja:m Räuber:m
		Schmuggler:m Henker:m Bischof:m Papst:m Rabbiner:m Imam:m Abt:m Missionar:m Sultan:m Pharao:m
		Häuptling:m Paladin:m Astrologe:m
	`,
	music: `
		Klavier:n Gitarre:f Trommel:f Glocke:f Harfe:f Lied:n Tanz:m Rhythmus:m Melodie:f Akkord:m Flöte:f
		Trompete:f Saxofon:n Klarinette:f Oboe:f Cello:n Bratsche:f Geige:f Becken:n Tamburin:n Xylofon:n
		Orgel:f Akkordeon:n Laute:f Mandoline:f Banjo:n Partitur:f Note:f Tonleiter:f Chor:m Solo:n
		Konzert:n Bühne:f Vorspiel:n Klangfarbe:f Takt:m Orchester:n Satz:m Duett:n Trio:n Quartett:n
		Quintett:n Dirigent:m Oktave:f Halbton:m Notenlinie:f Metronom:n Pedal:n Saite:f Mundstück:n
		Kontrabass:m Fagott:n Horn:n Posaune:f Tuba:f Dudelsack:m Okarina:f Zither:f Psalter:m Rassel:f
		Kastagnette:f Kuhglocke:f Gong:m Pauke:f Kontrapunkt:m Kadenz:f Arpeggio:n Triller:m Glissando:n
		Legato:n Tempo:n Refrain:m Strophe:f Ton:m Klang:m Dreiklang:m Leier:f Schalmei:f Schlagzeug:n
		Bass:m Ukulele:f Synthesizer:m Keyboard:n Mundharmonika:f Triangel:f Cembalo:n Sitar:f Blockflöte:f
		Gesang:m Sopran:m Tenor:m Tonart:f Dur:n Moll:n Taktstock:m Notenschlüssel:m Zugabe:f Probe:f
		Auftritt:m Ensemble:n Musik:f Instrument:n Album:n Hit:m Festival:n Tournee:f Beat:m Dissonanz:f
		Intervall:n Crescendo:n Staccato:n Vibrato:n Fermate:f Synkope:f Improvisation:f Glockenspiel:n
		Bongo:n Balalaika:f Panflöte:f Alphorn:n Didgeridoo:n Plektrum:n Stimmgabel:f Notenständer:m
		Bariton:m Intro:n Coda:f Zwischenspiel:n Blaskapelle:f Jamsession:f Ohrwurm:m
	`,
	genre: `
		Jazz:m Blues:m Rap:m Hiphop:m Pop:m Rockmusik:f Techno:m House:m Schlager:m Volksmusik:f Klassik:f
		Oper:f Sinfonie:f Sonate:f Walzer:m Ballade:f Wiegenlied:n Marsch:m Ouvertüre:f Fuge:f Etüde:f
		Nachtstück:n Ständchen:n Rhapsodie:f Hymne:f Requiem:n Kantate:f Arie:f Musical:n Ballett:n Tango:m
		Polka:f Menuett:n Volkslied:n Choral:m Motette:f Kanon:m Präludium:n Soul:m Gospel:m Reggae:m Ska:m
		Punk:m Grunge:m Metal:m Heavy_Metal:m Hardrock:m Punkrock:m Softrock:m Folkrock:m Krautrock:m
		Indie:m Country:m Bluegrass:m Folk:m Disco:f Swing:m Bebop:m Ragtime:m Rockabilly:m Chanson:n
		Salsa:f Samba:m Bossa_Nova:m Flamenco:m Fado:m Cumbia:f Bachata:f Mambo:m Rumba:f Merengue:m
		Reggaeton:m Dancehall:m Calypso:m Bolero:m Habanera:f Lambada:f Tarantella:f Klezmer:m Ländler:m
		Foxtrott:m Charleston:m Shanty:n Spiritual:n Gregorianik:f Minnesang:m Messe:f Oratorium:n
		Operette:f Suite:f Scherzo:n Rondo:n Toccata:f Mazurka:f Polonaise:f Madrigal:n Kunstlied:n
		Kinderlied:n Weihnachtslied:n Kammermusik:f Kirchenmusik:f Blasmusik:f Filmmusik:f Weltmusik:f
		Barock:n Elektro:m Trance:m Dubstep:m Drum_and_Bass:m Jungle:m Breakbeat:m Grime:m Trap:m
		Hardstyle:m Hardcore:m Gabber:m Ambient:m Chillout:m Trip_Hop:m Synthwave:m Eurodance:m Synthiepop:m
		Electropop:m Dream_Pop:m Deep_House:m Acid_House:m Psytrance:m Death_Metal:m Black_Metal:m
		Thrash_Metal:m Doom_Metal:m Power_Metal:m Metalcore:m Nu_Metal:m Progressive_Rock:m
		Psychedelic_Rock:m Britpop:m Shoegaze:m Emo:m Gothic:m Darkwave:m Industrial:m New_Age:n Free_Jazz:m
		Rhythm_and_Blues:m EDM:f
	`,
	place: `
		Markt:m Platz:m Stadt:f Dorf:n Gasse:f Brücke:f Garten:m Park:m Hafen:m Kai:m Hof:m Spielplatz:m
		Zoo:m Tunnel:m Steg:m Kreuzung:f Allee:f Bauernhof:m Obstgarten:m Graben:m Werft:f Weiler:m
		Friedhof:m Jahrmarkt:m Viertel:n Vorstadt:f Vorort:m Boulevard:m Pfad:m Steig:m Abkürzung:f Damm:m
		Schleuse:f Wehr:n Pferch:m Anlegestelle:f Haltestelle:f Parkplatz:m Straße:f Weg:m Autobahn:f
		Acker:m Weinberg:m Steinbruch:m Bergwerk:n Zirkus:m Ruine:f Denkmal:n Brunnen:m Labyrinth:n
		Hauptstadt:f Metropole:f Ort:m Gemeinde:f Siedlung:f Bezirk:m Zentrum:n Land:n Heimat:f Region:f
		Gegend:f Provinz:f Promenade:f Fußgängerzone:f Kreisverkehr:m Zebrastreifen:m Bürgersteig:m
		Überführung:f Unterführung:f Sportplatz:m Campingplatz:m Basar:m Freizeitpark:m Pier:m Mole:f Dock:n
		Ranch:f Koppel:f Feld:n Plantage:f Beet:n Statue:f Grab:n Baustelle:f Gleis:n Bahnsteig:m
		Landebahn:f Deich:m Piste:f Biergarten:m Freibad:n Bundesland:n Staat:m Kolonie:f Viadukt:n
		Aquädukt:n Serpentine:f Aussichtspunkt:m Alm:f Gehege:n Müllkippe:f Ausgrabung:f
	`,
	building: `
		Haus:n Wohnung:f Zimmer:n Gebäude:n Schule:f Krankenhaus:n Bank:f Bibliothek:f Kirche:f Laden:m
		Restaurant:n Café:n Hotel:n Bahnhof:m Flughafen:m Büro:n Fabrik:f Supermarkt:m Kaufhaus:n Kino:n
		Universität:f Kindergarten:m Rathaus:n Postamt:n Apotheke:f Bäckerei:f Museum:n Theater:n Bücherei:f
		Buchladen:m Gasthaus:n Wirtshaus:n Schenke:f Taverne:f Herberge:f Kneipe:f Küche:f Schlafzimmer:n
		Wohnzimmer:n Esszimmer:n Klassenzimmer:n Bad:n Flur:m Treppe:f Keller:m Dachboden:m Dach:n Balkon:m
		Terrasse:f Veranda:f Garage:f Speisekammer:f Gaststube:f Heuboden:m Mauer:f Turm:m Leuchtturm:m
		Burg:f Festung:f Bastion:f Warte:f Palast:m Villa:f Landhaus:n Tempel:m Dom:m Kapelle:f Kloster:n
		Abtei:f Kreuzgang:m Moschee:f Synagoge:f Pagode:f Mausoleum:n Gruft:f Speicher:m Lager:n Scheune:f
		Hütte:f Stall:m Silo:n Schuppen:m Gewächshaus:n Mühle:f Schmiede:f Werkstatt:f Zollhaus:n
		Sternwarte:f Turnhalle:f Schwimmbad:n Aquarium:n Galerie:f Badehaus:n Tankstelle:f Kaserne:f
		Gefängnis:n Arena:f Hochhaus:n Labor:n Sauna:f Fenster:n Tür:f Wand:f Säule:f Fußboden:m Stockwerk:n
		Erdgeschoss:n Eingang:m Foyer:n Halle:f Saal:m Kinderzimmer:n Arbeitszimmer:n Toilette:f
		Wintergarten:m Erker:m Giebel:m Innenhof:m Atrium:n Kuppel:f Gewölbe:n Schornstein:m Fensterbank:f
		Fensterladen:m Bauwerk:n Einfamilienhaus:n Reihenhaus:n Altbau:m Neubau:m Penthouse:n Maisonette:f
		Bungalow:m Chalet:n Ferienhaus:n Ferienwohnung:f Herrenhaus:n Anwesen:n Baumhaus:n Iglu:m
		Wolkenkratzer:m Immobilie:f Grundstück:n Eigentumswohnung:f Wohnanlage:f Bunker:m Hangar:m
		Kraftwerk:n Brauerei:f Druckerei:f Sägewerk:n Gärtnerei:f Metzgerei:f Konditorei:f Drogerie:f
		Klinik:f Kanzlei:f Salon:m Atelier:n Studio:n Gymnasium:n Akademie:f Internat:n Kita:f Mensa:f
		Kantine:f Aula:f Hörsaal:m Fitnessstudio:n Stadion:n Opernhaus:n Konzertsaal:m Planetarium:n
		Diskothek:f Bar:f Imbiss:m Bistro:n Pizzeria:f Eisdiele:f Einkaufszentrum:n Geschäft:n Kiosk:m
		Boutique:f Baumarkt:m Parkhaus:n Motel:n Hostel:n Pension:f Sparkasse:f Polizeiwache:f Feuerwache:f
		Konsulat:n Ministerium:n Parlament:n Schrein:m Pyramide:f Zitadelle:f Kerker:m Pavillon:m Laube:f
		Wohnheim:n Altersheim:n Waisenhaus:n
	`,
	food: `
		Brot:n Nudel:f Suppe:f Eintopf:m Salat:m Joghurt:m Schokolade:f Bonbon:n Keks:m Kuchen:m Pudding:m
		Donut:m Waffel:f Pfannkuchen:m Hamburger:m Pizza:f Curry:n Omelett:n Brezel:f Brötchen:n Semmel:f
		Strudel:m Torte:f Wurst:f Frikadelle:f Schnitzel:n Braten:m Sauerkraut:n Knödel:m Lebkuchen:m
		Stollen:m Krapfen:m Auflauf:m Pommes:p Chips:p Eiscreme:f Müsli:n Toast:m Sandwich:n Döner:m
		Gulasch:n Spätzle:p Spiegelei:n Lasagne:f Spaghetti:p Sushi:n Muffin:m Croissant:n Baguette:n
		Praline:f Gummibärchen:n Kaugummi:m Marzipan:n Steak:n Nachtisch:m Zuckerwatte:f Essen:n Mahlzeit:f
		Frühstück:n Snack:m Ravioli:p Tortellini:p Gnocchi:p Risotto:n Paella:f Hotdog:m Leberkäse:m Püree:n
		Rösti:f Kartoffelpuffer:m Maultasche:f Flammkuchen:m Quiche:f Roulade:f Eisbein:n Haxe:f Gyros:n
		Falafel:f Hummus:m Guacamole:f Burrito:m Taco:m Tortilla:f Frühlingsrolle:f Ramen:p Pastete:f
		Frikassee:n Ragout:n Fondue:n Raclette:n Brei:m Milchreis:m Kompott:n Kaiserschmarrn:m Zwieback:m
		Crêpe:m Brownie:m Tiramisu:n Mousse:f Sorbet:n Götterspeise:f Lakritz:n Karamell:m Lutscher:m
		Popcorn:n Salzstange:f Cracker:m Bagel:m Kimchi:n Essiggurke:f Fischstäbchen:n Rollmops:m Rührei:n
		Schaschlik:n
	`,
	ingredient: `
		Reis:m Salz:n Zucker:m Pfeffer:m Ei:n Käse:m Butter:f Schinken:m Speck:m Salami:f Marmelade:f
		Honig:m Sahne:f Quark:m Roggen:m Gerste:f Hafer:m Linse:f Kichererbse:f Sojabohne:f Nuss:f
		Pistazie:f Erdnuss:f Marone:f Weizen:m Mehl:n Teig:m Öl:n Essig:m Senf:m Soße:f Brühe:f Tofu:m
		Vanille:f Zimt:m Ingwer:m Haselnuss:f Hähnchen:n Walnuss:f Basilikum:n Thymian:m Oregano:m
		Petersilie:f Koriander:m Schnittlauch:m Dill:m Salbei:m Estragon:m Minze:f Rosmarin:m Majoran:m
		Kresse:f Fleisch:n Filet:n Lende:f Kotelett:n Rippchen:n Keule:f Geflügel:n Pute:f Mett:n Schmalz:n
		Gelatine:f Fond:m Ketchup:m Mayonnaise:f Remoulade:f Meerrettich:m Pesto:n Dressing:n Sojasoße:f
		Tomatenmark:n Gewürz:n Paprikapulver:n Kurkuma:f Muskat:m Kardamom:m Kümmel:m Anis:m Safran:m
		Süßstoff:m Sirup:m Gelee:n Nougat:n Hefe:f Backpulver:n Natron:n Speisestärke:f Grieß:m Polenta:f
		Couscous:m Bulgur:m Quinoa:f Hirse:f Dinkel:m Semmelbrösel:p Schmand:m Mozzarella:m Parmesan:m
		Feta:m Gouda:m Camembert:m Mascarpone:m Margarine:f Crème_fraîche:f Eigelb:n Mandel:f Cashew:m
		Pinienkern:m Sesam:m Leinsamen:m Balsamico:m Nori:m Kaviar:m Marinade:f Kokosmilch:f Kaper:f
		Getreide:n
	`,
	vegetable: `
		Kartoffel:f Karotte:f Zwiebel:f Knoblauch:m Tomate:f Gurke:f Paprika:f Kohl:m Spinat:m Pilz:m Mais:m
		Bohne:f Erbse:f Kürbis:m Zucchini:f Aubergine:f Brokkoli:m Blumenkohl:m Spargel:m Lauch:m
		Artischocke:f Radieschen:n Rübe:f Sellerie:m Chili:f Fenchel:m Gemüse:n Kopfsalat:m Rucola:m
		Endivie:f Chicorée:m Radicchio:m Mangold:m Rosenkohl:m Grünkohl:m Wirsing:m Kohlrabi:m Chinakohl:m
		Süßkartoffel:f Rote_Bete:f Pastinake:f Schwarzwurzel:f Topinambur:m Maniok:m Rettich:m
		Frühlingszwiebel:f Schalotte:f Bärlauch:m Okra:f Peperoni:f Zuckerschote:f Saubohne:f Sojasprosse:f
		Bambussprosse:f Romanesco:m Sauerampfer:m Champignon:m Pfifferling:m Steinpilz:m Shiitake:m
		Morchel:f Trüffel:m Edamame:p Pak_Choi:m Rotkohl:m Yamswurzel:f Taro:m Brunnenkresse:f
		Petersilienwurzel:f Jalapeño:f Austernpilz:m
	`,
	fruit: `
		Apfel:m Birne:f Erdbeere:f Kirsche:f Banane:f Orange:f Zitrone:f Traube:f Pfirsich:m Pflaume:f
		Melone:f Mango:f Ananas:f Kiwi:f Mandarine:f Aprikose:f Nektarine:f Himbeere:f Heidelbeere:f
		Brombeere:f Beere:f Feige:f Dattel:f Granatapfel:m Quitte:f Mispel:f Pampelmuse:f Olive:f Avocado:f
		Kokosnuss:f Rosine:f Obst:n Wassermelone:f Mirabelle:f Johannisbeere:f Stachelbeere:f Preiselbeere:f
		Physalis:f Litschi:f Papaya:f Maracuja:f Guave:f Kaki:f Sternfrucht:f Drachenfrucht:f Kumquat:f
		Limette:f Clementine:f Rhabarber:m Schlehe:f Maulbeere:f Zwetschge:f Holunderbeere:f Durian:f
		Jackfrucht:f Mangostane:f Rambutan:f Tamarinde:f Aronia:f
	`,
	sport: `
		Fußball:m Baseball:m Basketball:m Volleyball:m Tischtennis:n Tennis:n Federball:m Golf:n Kegeln:n
		Billard:n Schwimmen:n Marathon:m Turnen:n Karate:n Judo:n Fechten:n Ringen:n Boxen:n Schießen:n
		Reiten:n Rudern:n Surfen:n Skifahren:n Hockey:n Rugby:n Kricket:n Radsport:m Klettern:n Schläger:m
		Tor:n Medaille:f Pokal:m Meister:m Endspiel:n Vorrunde:f Training:n Polo:n Eislauf:m Tauchen:n
		Dart:m Hürde:f Speer:m Diskus:m Staffel:f Anzeigetafel:f Helm:m Foul:n Gewichtheben:n Schlitten:m
		Aufschlag:m Sprung:m Lauf:m Ziel:n Podest:n Umkleide:f Tribüne:f Anhänger:m Kanusport:m Regatta:f
		Triathlon:m Zehnkampf:m Fünfkampf:m Wurf:m Sprungbrett:n Matte:f Ringe:p Bock:m Stürmer:m
		Verteidiger:m Trainer:m Spielfeld:n Bahn:f Elfmeter:m Ecke:f Punktestand:m Sieg:m Niederlage:f
		Rekord:m Turnier:n Liga:f Wettkampf:m Zielgerade:f Vorlage:f Handball:m Eishockey:n Squash:n
		Leichtathletik:f Weitsprung:m Hochsprung:m Sprint:m Kugelstoßen:n Bogenschießen:n Segeln:n Wandern:n
		Joggen:n Yoga:n Taekwondo:n Bergsteigen:n Skispringen:n Snowboarden:n Langlauf:m Biathlon:m Rodeln:n
		Eiskunstlauf:m Curling:n Bowling:n Minigolf:n Wasserball:m Rallye:f Rennen:n Mannschaft:f Gegner:m
		Torwart:m Ball:m Puck:m Stoppuhr:f Hantel:f Trampolin:n Halbzeit:f Abseits:n Freistoß:m Olympiade:f
		Weltmeisterschaft:f Sieger:m Läufer:m Schwimmer:m Reiter:m Turner:m Boxer:m Meisterschaft:f Sport:m
		Spiel:n Gymnastik:f Fitness:f Skateboarden:n Rafting:n Schnorcheln:n Angeln:n Kickboxen:n Sumo:n
		Slalom:m Dressur:f Bouldern:n Mittelfeld:n Verein:m Verlierer:m Unentschieden:n Ergebnis:n
		Halbfinale:n Doping:n Anpfiff:m Strecke:f Schanze:f
	`,
	vehicle: `
		Fahrrad:n Zug:m Boot:n Auto:n Bus:m Taxi:n Lastwagen:m Motorrad:n Roller:m Flugzeug:n Hubschrauber:m
		Raumschiff:n Rakete:f Unterseeboot:n Jacht:f Frachter:m Segler:m Floß:n Kriegsschiff:n Panzer:m
		Kutsche:f Karren:m Schubkarre:f Traktor:m Bagger:m Krankenwagen:m Seilbahn:f Straßenbahn:f
		Lokomotive:f Kanu:n Kajak:n Luftschiff:n Fallschirm:m Sänfte:f Dreirad:n Lieferwagen:m Limousine:f
		Schneepflug:m Katamaran:m Eisbrecher:m Tanker:m Lastkahn:m Kutter:m Doppeldecker:m Sonde:f Fähre:f
		Pistenraupe:f Einrad:n Schlepper:m Gondel:f Waggon:m Kalesche:f Postkutsche:f Karosse:f Cabrio:n
		Kipper:m Betonmischer:m Kran:m Walze:f Mähdrescher:m Schlittschuh:m Rollbrett:n Mofa:n Beiwagen:m
		Galeere:f Galeone:f Fregatte:f Korvette:f Brigg:f Schoner:m Einbaum:m Schaluppe:f Barkasse:f
		Segelflieger:m Jagdflieger:m Bomber:m Reisebus:m Planwagen:m Schiff:n Dampfer:m Wagen:m Wohnwagen:m
		Wohnmobil:n Geländewagen:m Kombi:m Sportwagen:m Rennwagen:m Oldtimer:m Rikscha:f Tretboot:n
		Rollstuhl:m Kinderwagen:m Bollerwagen:m Rollschuh:m Rennrad:n Mountainbike:n Tandem:n
		Heißluftballon:m Jet:m Gleitschirm:m Raumfähre:f Aufzug:m Rolltreppe:f Sessellift:m Gabelstapler:m
		Müllwagen:m Feuerwehrauto:n Flugzeugträger:m Dschunke:f Kogge:f Schneemobil:n Fahrzeug:n Metro:f
		Lastenrad:n Moped:n Quad:n Coupé:n Streifenwagen:m Planierraupe:f Ufo:n Kreuzfahrtschiff:n Jetski:m
		Buggy:m Rollator:m Einkaufswagen:m Sackkarre:f
	`,
	product: `
		Rechner:m Tastatur:f Bildschirm:m Drucker:m Lautsprecher:m Kopfhörer:m Mikrofon:n Drohne:f Tablet:n
		Handy:n Ladegerät:n Batterie:f Kühlschrank:m Staubsauger:m Ventilator:m Ofen:m Wasserfilter:m
		Reiskocher:m Mikrowelle:f Mixer:m Zahnbürste:f Zahnpasta:f Seife:f Armbanduhr:f Beamer:m Router:m
		Scanner:m Trockner:m Türklingel:f Thermometer:n Feuerlöscher:m Glühbirne:f Steckdose:f Steckleiste:f
		Bezug:m Handtuch:n Waschbecken:n Waschmittel:n Weichspüler:m Pfanne:f Schneebesen:m Schäler:m
		Korkenzieher:m Thermoskanne:f Fußmatte:f Kleiderbügel:m Fernseher:m Konsole:f Verstärker:m Waage:f
		Bügeleisen:n Toaster:m Fritteuse:f Entsafter:m Wasserkocher:m Heizkörper:m Thermostat:n Besteck:n
		Geschirr:n Tischdecke:f Serviette:f Abtropfsieb:n Spülbecken:n Wasserhahn:m Dusche:f Wanne:f
		Kaffeemühle:f Eierbecher:m Salzstreuer:m Untersetzer:m Fernbedienung:f Laptop:m Kabel:n Stecker:m
		Adapter:m Festplatte:f Webcam:f Objektiv:n Stativ:n Plattenspieler:m Schallplatte:f Kassette:f
		Taschenrechner:m Nähmaschine:f Waschmaschine:f Spülmaschine:f Herd:m Gefrierschrank:m
		Kaffeemaschine:f Grill:m Klimaanlage:f Rauchmelder:m Deo:n Zahnseide:f Duschgel:n Taschentuch:n
		Toilettenpapier:n Mülleimer:m Spülmittel:n Wischmopp:m Bügelbrett:n Zeitschrift:f Comic:m
		Ohrstöpsel:p Windel:f Schnuller:m Rasenmäher:m Pflaster:n Verband:m Tablette:f Kontaktlinse:f
		Hörgerät:n Wärmflasche:f Computer:m Smartwatch:f Akku:m Powerbank:f Heizlüfter:m Luftbefeuchter:m
		Saugroboter:m Pürierstab:m Küchenmaschine:f Waffeleisen:n Wok:m Backblech:n Frischhaltefolie:f
		Alufolie:f Backpapier:n Müllbeutel:m Geschirrtuch:n Waschlappen:m Duschvorhang:m Küchenrolle:f
		Wattestäbchen:n Mundwasser:n Tampon:m Medikament:n Nasenspray:n Putzmittel:n Wäscheklammer:f
		Headset:n Navi:n Controller:m Laubbläser:m Boiler:m
	`,
	beauty: `
		Lippenstift:m Shampoo:n Parfüm:n Lotion:f Sonnencreme:f Föhn:m Kamm:m Rasierer:m Nagellack:m
		Nagelfeile:f Pinzette:f Lockenstab:m Handspiegel:m Rasierpinsel:m Perücke:f Haarbürste:f Schminke:f
		Kosmetik:f Hautpflege:f Mascara:f Eyeliner:m Kajal:m Lidschatten:m Foundation:f Concealer:m Rouge:n
		Puder:m Primer:m Highlighter:m Bronzer:m Lipgloss:m Lippenbalsam:m Creme:f Serum:n Gesichtswasser:n
		Peeling:n Gesichtsmaske:f Selbstbräuner:m Rasierwasser:n Rasierschaum:m Rasierklinge:f Spülung:f
		Haarwachs:n Haargel:n Haarspray:n Pomade:f Haarfarbe:f Dauerwelle:f Glätteisen:n Lockenwickler:m
		Frisur:f Haarschnitt:m Strähnchen:n Dutt:m Puderquaste:f Wimpernzange:f Nagelschere:f Nagelknipser:m
		Maniküre:f Pediküre:f Massage:f Waxing:n Rasur:f Wellness:f Wattepad:n Kulturbeutel:m Henna:n
		Badesalz:n Haarkur:f Bartschneider:m Epilierer:m Flakon:m Eau_de_Toilette:n Augenbrauenstift:m
		Abschminktuch:n Duschhaube:f Haarschaum:m Solarium:n Gesichtsbehandlung:f Fußpflege:f Bartöl:n
		Schminkpinsel:m Schwämmchen:n Haarteil:n Toupet:n
	`,
	color: `
		Karmesin:n Scharlach:n Zinnoberrot:n Purpur:n Magenta:n Fuchsia:n Rosa:n Ocker:n Siena:n Sepia:n
		Senfgelb:n Olivgrün:n Limone:f Smaragdgrün:n Türkis:n Zyan:n Himmelblau:n Indigo:n Weinrot:n Rost:m
		Terrakotta:n Beige:n Khaki:n Anthrazit:n Zinngrau:n Ebenholz:n Azurblau:n Safrangelb:n Grünspan:m
		Kupferrot:n Goldgelb:n Silbergrau:n Bronzeton:m Aschgrau:n Rauchgrau:n Sandton:m Weizengelb:n
		Zimtbraun:n Muskatbraun:n Paprikarot:n Nachtblau:n Moosgrün:n Tannengrün:n Amarant:n Korallenrot:n
		Karmin:n Bordeauxrot:n Mahagoni:n Rotbraun:n Blaugrün:n Graublau:n Blassgelb:n Dunkelgrün:n
		Hellblau:n Kobaltblau:n Zitronengelb:n Pfirsichton:m Blaugrau:n Gelbgrün:n Braunrot:n Perlweiß:n
		Nebelgrau:n Lindgrün:n Beinweiß:n Rot:n Blau:n Grün:n Gelb:n Schwarz:n Weiß:n Braun:n Grau:n
		Violett:n Lila:n Pink:n Dunkelblau:n Hellgrün:n Dunkelrot:n Hellgrau:n Dunkelgrau:n Hellbraun:n
		Dunkelbraun:n Feuerrot:n Blutrot:n Kirschrot:n Ziegelrot:n Altrosa:n Marineblau:n Königsblau:n
		Stahlblau:n Eisblau:n Taubenblau:n Ultramarin:n Petrol:n Mintgrün:n Giftgrün:n Grasgrün:n
		Flaschengrün:n Apfelgrün:n Sonnengelb:n Kanariengelb:n Honiggelb:n Nussbraun:n Umbra:n Mausgrau:n
		Neongrün:n Pastell:n Kastanienbraun:n Lachsrosa:n Graphitgrau:n Schiefergrau:n Neongelb:n Babyblau:n
		Jadegrün:n Waldgrün:n Farbton:m Puderrosa:n Rubinrot:n Saphirblau:n Kaffeebraun:n Tintenblau:n
	`,
	finance: `
		Rechnung:f Quittung:f Anleihe:f Aktie:f Dividende:f Zins:m Darlehen:n Hypothek:f Einlage:f
		Ersparnis:f Konto:n Saldo:m Haushalt:m Vermögen:n Kapital:n Ertrag:m Gewinn:m Spanne:f Überschuss:m
		Fehlbetrag:m Schuld:f Kredit:m Lastschrift:f Scheck:m Münze:f Währung:f Rendite:f Depot:n Zoll:m
		Erstattung:f Prämie:f Rente:f Lohnliste:f Gehalt:n Lohn:m Bonus:m Provision:f Lizenzgebühr:f
		Franchise:f Fusion:f Übernahme:f Rettung:f Sicherheit:f Gutschein:m Tresor:m Staatskasse:f
		Überweisung:f Abrechnung:f Arbitrage:f Kontoauszug:m Sparbuch:n Verwahrung:f Gläubiger:m Schuldner:m
		Verleiher:m Bürge:m Bewertung:f Schätzung:f Inflation:f Rezession:f Liquidität:f Konkurs:m Spende:f
		Zuschuss:m Ausgabe:f Rabatt:m Rate:f Kasse:f Urkunde:f Wechsel:m Zinssatz:m Quote:f Beitrag:m
		Abgabe:f Steuer:f Umlage:f Freibetrag:m Bußgeld:n Verzug:m Wucher:m Kaution:f Mitgift:f Erbschaft:f
		Miete:f Pacht:f Wegezoll:m Zehnt:m Beute:f Schatz:m Reichtum:m Armut:f Kupon:m Pfand:n Bilanzbuch:n
		Tarif:m Notgroschen:m Rücklage:f Zuschlag:m Nachprüfung:f Geld:n Bargeld:n Schein:m Preis:m Kosten:p
		Umsatz:m Einkommen:n Einnahme:f Sparschwein:n Börse:f Kurs:m Investition:f Anleger:m Aktionär:m
		Fonds:m Trinkgeld:n Taschengeld:n Kreditkarte:f Geldautomat:m Dauerauftrag:m Buchung:f Bilanz:f
		Verlust:m Tilgung:f Versicherung:f Stipendium:n Honorar:n Wertpapier:n Handel:m Tausch:m Ware:f
		Angebot:n Nachfrage:f Kauf:m Lotterie:f Wette:f Euro:m Cent:m Dollar:m Zahlung:f Einzahlung:f
		Guthaben:n Budget:n Gebühr:f Leasing:n Subvention:f Steuererklärung:f Mahnung:f Portfolio:n
		Spekulation:f Kryptowährung:f Deflation:f Konjunktur:f Export:m Import:m Schnäppchen:n Kleingeld:n
		Entschädigung:f Abfindung:f Almosen:n Buchhaltung:f Verkauf:m Auktion:f Jackpot:m
	`,
	tech: `
		Server:m Puffer:m Pixel:n Codec:m Protokoll:n Stapel:m Halde:f Zeiger:m Firmware:f Bandbreite:f
		Latenz:f Gateway:n Firewall:f Teilnetz:n Rechnername:m Nutzlast:f Prüfsumme:f Schema:n Sicherung:f
		Verbund:m Splitter:m Abbild:n Behälter:m Sandkasten:m Pipeline:f Ablage:f Debugger:m Makro:n
		Matrix:f Ganzzahl:f Syntax:f Parser:m Assembler:m Befehl:m Bitrate:f Durchsatz:m Handschlag:m
		Namensraum:m Vermittler:m Endpunkt:m Hash:m Darstellung:f Shader:m Textur:f Vieleck:n Gitternetz:n
		Oktett:n Wegewahl:f Vermittlung:f Rundruf:m Datagramm:n Bootloader:m Dateisystem:n Partition:f
		Verzeichnis:n Prüfpunkt:m Rollback:n Migration:f Kern:m Prozess:m Sitzung:f Abfrage:f Index:m
		Tabelle:f Sicht:f Spalte:f Zeile:f Knoten:m Graph:m Liste:f Menge:f Modul:n Zusatz:m Flicken:m
		Etikett:n Version:f Prüfung:f Spur:f Profil:n Auslöser:m Ereignis:n Signal:n Zeitstempel:m
		Nutzerkonto:n Suchbaum:m Nebenzweig:m Grenzwert:m Internet:n Netzwerk:n Webseite:f Browser:m
		Suchmaschine:f Link:m Datei:f Datenbank:f Daten:p Software:f Hardware:f Programm:n App:f
		Algorithmus:m Code:m Fehler:m Absturz:m Virus:n Passwort:n Cloud:f Download:m Update:n Cache:m
		Cookie:n Prozessor:m Chip:m Platine:f Transistor:m Schaltkreis:m Sensor:m Roboter:m Byte:n Bit:n
		Terminal:n Skript:n Compiler:m Variable:f Funktion:f Klasse:f Schnittstelle:f Treiber:m
		Betriebssystem:n Domain:f Spam:m Chat:m Menü:n Modem:n Antenne:f Funk:m Frequenz:f Glasfaser:f
		WLAN:n Bluetooth:n Mail:f Benutzer:m Admin:m Login:n Avatar:m Emoji:n Hashtag:m Blog:m Forum:n
		Podcast:m Stream:m Video:n Taste:f Screenshot:m Desktop:m Cursor:m Touchscreen:m Display:n
		Grafikkarte:f Verschlüsselung:f Zertifikat:n Bot:m KI:f Upload:m Installation:f Einstellung:f
		Benachrichtigung:f Bug:m Malware:f Trojaner:m Phishing:n Parameter:m Auflösung:f Grafik:f
		Animation:f GPS:n
	`,
	weather: `
		Wolke:f Wind:m Regen:m Schnee:m Reif:m Nebel:m Tau:m Regenbogen:m Blitz:m Donner:m Schauer:m
		Monsun:m Taifun:m Wirbelwind:m Schneesturm:m Nieselregen:m Hagel:m Graupel:m Sturm:m Bö:f Zyklon:m
		Gewitter:n Unwetter:n Sintflut:f Dunst:m Schwaden:m Feuchte:f Vorhersage:f Bewölkung:f
		Sonnenschein:m Hitzewelle:f Frost:m Tauwetter:n Brise:f Zephir:m Passat:m Fallwind:m Hochdruck:m
		Tiefdruck:m Klima:n Temperatur:f Luftdruck:m Wolkenbruch:m Schwüle:f Abendrot:n Wetter:n Hundstage:p
		Bise:f Orkan:m Tornado:m Windhose:f Landregen:m Schneefall:m Platzregen:m Dürre:f Windstille:f
		Kälte:f Hitze:f Wetterlage:f Regenzeit:f Schneeflocke:f Regentropfen:m Glatteis:n Schneematsch:m
		Schneewehe:f Eisregen:m Flaute:f Rückenwind:m Gegenwind:m Luftfeuchtigkeit:f Niederschlag:m
		Kaltfront:f Warmfront:f Trockenzeit:f Kältewelle:f Smog:m Eisblume:f Kugelblitz:m Wetterleuchten:n
		Sandsturm:m Hurrikan:m Aufheiterung:f Abkühlung:f Erwärmung:f Klimawandel:m Mistral:m Schirokko:m
		Wetterwarnung:f Sturmflut:f Altweibersommer:m Nässe:f Schneeregen:m Hagelkorn:n Wetterumschwung:m
		Kälteeinbruch:m Lüftchen:n Pollenflug:m Treibhauseffekt:m Sichtweite:f Windstärke:f Glätte:f Ozon:n
		Feinstaub:m Jetstream:m Bora:f
	`,
	space: `
		Stern:m Mond:m Sonne:f Galaxie:f Komet:m Meteor:m Polarlicht:n Sternenstaub:m Milchstraße:f
		Finsternis:f Weltall:n Planet:m Trabant:m Kleinplanet:m Sternhaufen:m Sternbild:n Umlaufbahn:f
		Schwerkraft:f Drehung:f Umlauf:m Sonnenfleck:m Krater:m Lichtjahr:n Gestirn:n Firmament:n Ekliptik:f
		Meridian:m Stratosphäre:f Lufthülle:f Leere:f Polarstern:m Abendstern:m Morgenstern:m Supernova:f
		Weltraum:m Quadrant:m Parallaxe:f Parsec:n Nadir:n Azimut:n Ellipse:f Perihel:n Aphel:n Fotosphäre:f
		Chromosphäre:f Ionosphäre:f Exosphäre:f Mesosphäre:f Troposphäre:f Gravitation:f Halo:m Feuerkugel:m
		Raumsonde:f Sternschnuppe:f Asteroid:m Satellit:m Raumstation:f Sonnensystem:n Schwarzes_Loch:n
		Mondfinsternis:f Sonnenfinsternis:f Sonnenwind:m Raumkapsel:f Gasriese:m Zwergplanet:m
		Neutronenstern:m Pulsar:m Quasar:m Urknall:m Schwerelosigkeit:f Vakuum:n Strahlung:f Tierkreis:m
		Sternzeichen:n Nachthimmel:m Mondphase:f Himmelskörper:m Raumfahrt:f Weltraumschrott:m Schweif:m
		Korona:f Nova:f Exoplanet:m Universum:n Kosmos:m Teleskop:n Mondlandung:f Asteroidengürtel:m
		Kuipergürtel:m Sirius:m Wega:f Beteigeuze:m Rigel:m Aldebaran:m Antares:m Arktur:m Deneb:m Altair:m
		Spica:f Alpha_Centauri:m Orion:m Kassiopeia:f Plejaden:p Wurmloch:n Ereignishorizont:m Raumzeit:f
		Atmosphäre:f
	`,
	planet: `
		Merkur:m Venus:f Erde:f Mars:m Jupiter:m Saturn:m Uranus:m Neptun:m Pluto:m Ceres:f Eris:f Haumea:f
		Makemake:m Sedna:f Quaoar:m Orcus:m Gonggong:m Salacia:f Varuna:m Ixion:m Vesta:f Pallas:f Juno:f
		Hygiea:f Bennu:m Ryugu:m Itokawa:m Apophis:m Arrokoth:m Theia:f Phaethon:m Dimidium:m Spe:m
		Orbitar:m Fortitudo:m Ægir:m Amateru:m Dagon:m Meztli:m Smertrios:m Phobetor:m Tassili:m Madriu:m
		Yanyan:m Tondra:m Eburonia:m Yvaga:m Mastika:m Bendida:m Nakanbé:m Awasis:m Wangshu:m Pipitea:m
		Asye:m Veles:m Boinayel:m Eyeke:m Cayahuanca:m Hämarik:m Abol:m Bélisama:m Mintome:m Toge:m
		Santamasa:m Noifasui:m Chura:m Buru:m Staburags:m Baiduri:m Cuptor:m Xólotl:m Hairu:m Laligurans:m
		Kereru:m Albmi:m Perwana:m Pollera:m Viculus:m Samagiya:m Ramajay:m Khomsa:m Barajeel:m Cruinlagh:m
		Ibirapitá:m Madalitso:m Bambaruush:m Tahay:m Awohali:m Enaiposha:m Phailinsiam:m Levantes:m
		Najsakopajk:m Qingluan:m Cuancoá:m Astrolábos:m Ahra:m Aumatex:m Ixbalanqué:m Surt:m Haik:m
		Mulchatna:m Makombé:m Zembretta:m Bocaprins:m Agouto:m
	`,
	time: `
		Morgengrauen:n Morgenröte:f Dämmerung:f Einbruch:m Sonnenwende:f Jahreszeit:f Augenblick:m
		Ewigkeit:f Zukunft:f Nu:n Jahrhundert:n Jahrzehnt:n Morgen:m Mittag:m Nachmittag:m Abend:m Nacht:f
		Mitternacht:f Frühe:f Vorabend:m Gestern:n Heute:n Tageslauf:m Woche:f Monat:m Jahr:n Jahrtausend:n
		Epoche:f Ära:f Zeitalter:n Frühling:m Sommer:m Herbst:m Winter:m Vorzeit:f Jetzt:n Kindheit:f
		Jugend:f Reife:f Alter:n Frist:f Zeitraum:m Dauer:f Zeitspanne:f Jahrestag:m Gedenktag:m Saison:f
		Tagesanbruch:m Minute:f Sekunde:f Stunde:f Weile:f Wartezeit:f Kreislauf:m Schicht:f Runde:f Phase:f
		Etappe:f Abschnitt:m Vormittag:m Frühjahr:n Gegenwart:f Jahrgang:m Jahrfünft:n Wochenende:n
		Feiertag:m Werktag:m Tag:m Zeit:f Datum:n Termin:m Uhrzeit:f Ferien:p Urlaub:m Wochentag:m Montag:m
		Dienstag:m Mittwoch:m Donnerstag:m Freitag:m Samstag:m Sonntag:m Januar:m Februar:m März:m April:m
		Mai:m Juni:m Juli:m August:m September:m Oktober:m November:m Dezember:m Schlafenszeit:f Freizeit:f
		Geburtstag:m Jubiläum:n Neujahr:n Silvester:n Weihnachten:n Ostern:n Advent:m Karneval:m
		Schaltjahr:n Vergangenheit:f Anfang:m Ende:n Zeitpunkt:m Verspätung:f Semester:n Schuljahr:n
		Generation:f Steinzeit:f Mittelalter:n Antike:f Neuzeit:f Geisterstunde:f Übermorgen:n Vorgestern:n
		Feierabend:m Pause:f Zeitzone:f Countdown:m Ruhestand:m Pubertät:f Hochzeit:f Pfingsten:n
		Heiligabend:m Halloween:n Valentinstag:m Muttertag:m Oktoberfest:n Ramadan:m Quartal:n Moderne:f
		Renaissance:f Eiszeit:f Jahreswechsel:m Tageszeit:f Sommerzeit:f Stundenplan:m Fahrplan:m
	`,
	emotion: `
		Freude:f Trauer:f Zorn:m Furcht:f Überraschung:f Frohsinn:m Jubel:m Glück:n Rausch:m Verzückung:f
		Trost:m Hoffnung:f Verzweiflung:f Kummer:m Schwermut:f Wehmut:f Einsamkeit:f Sehnsucht:f Verlangen:n
		Leidenschaft:f Zuneigung:f Zärtlichkeit:f Wärme:f Güte:f Mitgefühl:n Einfühlung:f Mitleid:n
		Dankbarkeit:f Demut:f Geduld:f Klugheit:f Mäßigung:f Redlichkeit:f Staunen:n Ehrfurcht:f
		Gelassenheit:f Ruhe:f Stille:f Vertrauen:n Zweifel:m Verdacht:m Sorge:f Angst:f Schrecken:m Panik:f
		Wut:f Ärger:m Verdruss:m Langeweile:f Begeisterung:f Eifer:m Inbrunst:f Gefühl:n Illusion:f Mut:m
		Scham:f Stolz:m Neid:m Eifersucht:f Gier:f Laune:f Bitterkeit:f Groll:m Hass:m Verachtung:f
		Misstrauen:n Überdruss:m Beklemmung:f Betrübnis:f Entsetzen:n Andacht:f Milde:f Nachsicht:f
		Wohlwollen:n Sympathie:f Abneigung:f Frohlocken:n Unruhe:f Bangen:n Verblüffung:f Reue:f Wonne:f
		Sehnen:n Übermut:m Wehklage:f Liebe:f Spaß:m Lust:f Ekel:m Scheu:f Heimweh:n Fernweh:n
		Erleichterung:f Enttäuschung:f Frust:m Stress:m Nervosität:f Aufregung:f Vorfreude:f Schadenfreude:f
		Zufriedenheit:f Genugtuung:f Verwirrung:f Unsicherheit:f Schüchternheit:f Neugier:f Interesse:n
		Gleichgültigkeit:f Müdigkeit:f Erschöpfung:f Schmerz:m Leid:n Qual:f Heiterkeit:f Vergnügen:n
		Trotz:m Rache:f Schuldgefühl:n Peinlichkeit:f Verlegenheit:f Hochmut:m Eitelkeit:f Geiz:m
		Großzügigkeit:f Zuversicht:f Optimismus:m Nostalgie:f Ehrgeiz:m Motivation:f Tatendrang:m
		Lampenfieber:n Schock:m Grauen:n Grusel:m Unbehagen:n Argwohn:m Faszination:f Bewunderung:f
		Respekt:m Verehrung:f Liebeskummer:m Gnade:f Barmherzigkeit:f Vergebung:f Behagen:n Seligkeit:f
		Spannung:f Ungeduld:f Abscheu:m Empörung:f Selbstbewusstsein:n Resignation:f Hilflosigkeit:f
		Rührung:f Begierde:f Verliebtheit:f Hingabe:f Geborgenheit:f Gemütlichkeit:f Erfüllung:f Euphorie:f
		Ekstase:f Melancholie:f Weltschmerz:m Torschlusspanik:f Fremdscham:f Gram:m Phobie:f Humor:m
		Tapferkeit:f Feigheit:f Pessimismus:m
	`,
	body: `
		Kopf:m Stirn:f Braue:f Wimper:f Lid:n Nase:f Wange:f Kinn:n Kiefer:m Lippe:f Zunge:f Zahn:m
		Zahnfleisch:n Ohr:n Ohrläppchen:n Hals:m Nacken:m Schulter:f Ellbogen:m Handgelenk:n Handfläche:f
		Knöchel:m Finger:m Daumen:m Fingernagel:m Faust:f Brust:f Rippe:f Bauch:m Nabel:m Rücken:m Taille:f
		Hüfte:f Knie:n Schienbein:n Wade:f Fessel:f Ferse:f Zehe:f Knochen:m Schädel:m Muskel:m Sehne:f
		Gelenk:n Knorpel:m Herz:n Lunge:f Leber:f Magen:m Niere:f Milz:f Darm:m Blase:f Gehirn:n Nerv:m
		Vene:f Arterie:f Blut:n Haut:f Pore:f Haar:n Bart:m Träne:f Schweiß:m Speichel:m Atem:m Puls:m
		Herzschlag:m Kniescheibe:f Jochbein:n Trommelfell:n Augapfel:m Falte:f Grübchen:n Narbe:f
		Bluterguss:m Schwiele:f Schläfe:f Gaumen:m Kehlkopf:m Rachen:m Luftröhre:f Speiseröhre:f
		Zwerchfell:n Brustbein:n Wirbel:m Oberschenkel:m Wadenbein:n Oberarm:m Unterarm:m Fingerglied:n
		Fußwurzel:f Spann:m Achsel:f Leiste:f Kniekehle:f Pupille:f Hornhaut:f Netzhaut:f Zäpfchen:n
		Rachenmandel:f Auge:n Mund:m Arm:m Bein:n Hand:f Fuß:m Gesicht:n Körper:m Skelett:n Wirbelsäule:f
		Po:m Schoß:m Sohle:f Nasenloch:n Ohrmuschel:f Kehle:f Locke:f Zopf:m Glatze:f Scheitel:m
		Fingerkuppe:f Fingerabdruck:m Brustkorb:m Schlüsselbein:n Schulterblatt:n Steißbein:n Organ:n
		Bauchspeicheldrüse:f Gallenblase:f Galle:f Blinddarm:m Rückenmark:n Zelle:f Hormon:n Drüse:f
		Gewebe:n Fett:n Lymphe:f Wunde:f Pickel:m Sommersprosse:f Muttermal:n Warze:f Busen:m Brustwarze:f
		Rumpf:m Bizeps:m Gen:n DNA:f Kratzer:m Beule:f Schleim:m Schilddrüse:f Schnurrbart:m Gänsehaut:f
	`,
	clothing: `
		Hut:m Schuh:m Handschuh:m Schal:m Brille:f Mantel:m Jacke:f Hemd:n Bluse:f Kittel:m Hose:f Jeans:p
		Rock:m Kleid:n Weste:f Strickjacke:f Pullover:m Kapuzenpulli:m Socke:f Strumpf:m Unterwäsche:f
		Schlafanzug:m Schürze:f Kopftuch:n Krawatte:f Gürtel:m Schärpe:f Stiefel:m Turnschuh:m Pantoffel:m
		Uniform:f Kostüm:n Robe:f Umhang:m Poncho:m Regenmantel:m Anorak:m Parka:m Badeanzug:m
		Taucheranzug:m Overall:m Ärmel:m Kragen:m Manschette:f Saum:m Futter:n Stoff:m Leinen:n Seide:f
		Baumwolle:f Wolle:f Samt:m Kord:m Flanell:m Leder:n Barett:n Mütze:f Kappe:f Turban:m Schleier:m
		Tuch:n Gehrock:m Frack:m Smoking:m Wams:n Kutte:f Unterrock:m Mieder:n Gamasche:f Espadrille:f
		Fäustling:m Armstulpe:f Hosenträger:m Korsett:n Reifrock:m Mantilla:f Haube:f Dreispitz:m Kapuze:f
		Halstuch:n Stulpe:f Litze:f Borte:f Sturzhelm:m Shirt:n Sweatshirt:n Shorts:p Leggings:p
		Strumpfhose:f Bikini:m Badehose:f Bademantel:m Nachthemd:n Latzhose:f Anzug:m Sakko:n Blazer:m
		Dirndl:n Lederhose:f Tracht:f Kimono:m Sari:m Toga:f Tunika:f Trenchcoat:m Stirnband:n Haarspange:f
		Reißverschluss:m Schnürsenkel:m Absatz:m Pumps:p Strampler:m Trikot:n Trainingsanzug:m Badekappe:f
		Sonnenbrille:f Monokel:n Zylinder:m Tiara:f Diadem:n Maske:f Rüstung:f Kettenhemd:n Kilt:m
		Raumanzug:m Pelz:m Nylon:n Polyester:n Kaschmir:m Tweed:m Satin:m Brokat:m Tüll:m Filz:m Naht:f
		Kleidung:f Sandale:f BH:m Slip:m Mokassin:m Haarreif:m Sombrero:m Kaftan:m Lätzchen:n
		Ohrenschützer:m Fleece:n
	`,
	tool: `
		Axt:f Schaufel:f Säge:f Leiter:f Zange:f Meißel:m Amboss:m Blasebalg:m Ahle:f Klemme:f
		Schraubstock:m Wasserwaage:f Messschieber:m Winkelmesser:m Lineal:n Schere:f Hammer:m Bohrer:m
		Schmirgel:m Hobel:m Spitzhacke:f Sichel:f Sense:f Hacke:f Pflug:m Rechen:m Lötkolben:m Schleifer:m
		Maßband:n Zirkel:m Beil:n Brecheisen:n Hebel:m Keil:m Flaschenzug:m Kurbel:f Kelle:f Wetzstein:m
		Feile:f Reibe:f Sieb:n Spaten:m Egge:f Dreschflegel:m Spindel:f Spule:f Griff:m Klinge:f Niete:f
		Stichsäge:f Bandsäge:f Drehbank:f Kettensäge:f Hohleisen:n Reißnadel:f Winkel:m Fase:f Werkbank:f
		Stemmeisen:n Raspel:f Streichmaß:n Senklot:n Kneifzange:f Wagenheber:m Tacker:m Lötlampe:f
		Feuerstahl:m Gussform:f Stanze:f Schleifstein:m Bohrfutter:n Fräse:f Hippe:f Zugmesser:n Ösenzange:f
		Schraubenzieher:m Schraubenschlüssel:m Bohrmaschine:f Akkuschrauber:m Spachtel:m Farbrolle:f
		Gerüst:n Gießkanne:f Gartenschlauch:m Heckenschere:f Mistgabel:f Vorschlaghammer:m Dübel:m Bolzen:m
		Seitenschneider:m Teppichmesser:n Skalpell:n Laubsäge:f Kreissäge:f Körner:m Winkelschleifer:m
		Schweißgerät:n Multimeter:n Zollstock:m Stricknadel:f Webstuhl:m Spinnrad:n Töpferscheibe:f
		Brennofen:m Nudelholz:n Pfannenwender:m Kochlöffel:m Dosenöffner:m Flaschenöffner:m Nussknacker:m
		Stößel:m Schrubber:m Kehrblech:n Handfeger:m Geodreieck:n Spritze:f Stethoskop:n Sextant:m Harpune:f
		Falle:f Lasso:n Peitsche:f Joch:n Ölkanne:f Werkzeug:n Taschenmesser:n Pipette:f Reagenzglas:n
		Knoblauchpresse:f Pumpe:f Kompressor:m Winde:f Häkelnadel:f Kescher:m
	`,
	drink: `
		Kaffee:m Tee:m Milch:f Wasser:n Limonade:f Apfelwein:m Kakao:m Punsch:m Aufguss:m Cappuccino:m
		Espresso:m Bier:n Pils:n Schwarzbier:n Wein:m Rotwein:m Weißwein:m Roséwein:m Sekt:m Champagner:m
		Sherry:m Wermut:m Likör:m Schnaps:m Obstler:m Rum:m Gin:m Wodka:m Whisky:m Weinbrand:m Tequila:m
		Sake:m Met:m Cocktail:m Nektar:m Sprudel:m Tonic:n Molke:f Buttermilch:f Kefir:m Smoothie:m
		Milchshake:m Radler:n Schorle:f Kirschwasser:n Absinth:m Glühwein:m Federweißer:m Brause:f Cola:f
		Energydrink:m Spezi:n Mokka:m Grüntee:m Schwarztee:m Matcha:m Chai:m Mate:m Kombucha:m Ayran:m
		Lassi:m Korn:m Grappa:m Ouzo:m Cognac:m Prosecco:m Bowle:f Sangria:f Grog:m Aperitif:m Kölsch:n
		Most:m Getränk:n Saft:m Latte_Macchiato:m Helles:n Calvados:m Amaretto:m Mojito:m Caipirinha:f
		Spritz:m Frappé:m Softdrink:m Raki:m Bourbon:m Soju:m Rooibos:m Digestif:m Kwass:m Ristretto:m
		Americano:m Cava:m Riesling:m Merlot:m Slibowitz:m Pastis:m Sambuca:m Limoncello:m Mezcal:m Pisco:m
		Aquavit:m Piña_Colada:f Cuba_Libre:m Daiquiri:m Negroni:m Bitter_Lemon:n Ginger_Ale:n Oolong:m
		Bubble_Tea:m
	`,
	toy: `
		Drachen:m Kreisel:m Murmel:f Würfel:m Puzzle:n Ballon:m Schach:n Domino:n Puppe:f Teddybär:m
		Kuscheltier:n Bauklotz:m Spielkarte:f Kartenspiel:n Brettspiel:n Halma:n Skat:m Poker:n Bingo:n
		Quiz:n Kreuzworträtsel:n Sudoku:n Jojo:n Springseil:n Hüpfburg:f Schaukel:f Rutsche:f Wippe:f
		Karussell:n Sandburg:f Schneemann:m Schneeball:m Seifenblase:f Wasserpistole:f Spielzeugauto:n
		Modelleisenbahn:f Puppenhaus:n Handpuppe:f Marionette:f Spieluhr:f Kaleidoskop:n Zauberwürfel:m
		Stelzen:p Reifen:m Steckenpferd:n Schaukelpferd:n Klettergerüst:n Planschbecken:n Gokart:n Frisbee:f
		Bumerang:m Flummi:m Kicker:m Flipper:m Spielautomat:m Videospiel:n Spielfigur:f Spielbrett:n
		Spielstein:m Knete:f Malbuch:n Mikado:n Tangram:n Baukasten:m Papierflieger:m Verstecken:n Fangen:n
		Blindekuh:f Sackhüpfen:n Topfschlagen:n Schnitzeljagd:f Schatzsuche:f Mobile:n Beißring:m
		Modellflugzeug:n Zinnsoldat:m Ritterburg:f Kaufladen:m Seifenkiste:f Spielzeug:n Actionfigur:f
		Kinderküche:f Murmelbahn:f Fingerfarbe:f Malkasten:m Sticker:m Gummitwist:m Zauberkasten:m
		Schwimmring:m Schwimmflügel:m Luftmatratze:f Sandförmchen:n Steinschleuder:f Puppenwagen:m
		Hampelmann:m Backgammon:n Rommé:n Tauziehen:n Völkerball:m
	`,
	sound: `
		Flüstern:n Rascheln:n Knarren:n Schrei:m Seufzer:m Gelächter:n Lachen:n Ruf:m Stimme:f Geräusch:n
		Lärm:m Laut:m Hall:m Knall:m Knacken:n Knistern:n Knirschen:n Klappern:n Klirren:n Klingeln:n
		Klopfen:n Ticken:n Summen:n Brummen:n Zischen:n Rauschen:n Plätschern:n Platsch:m Pfeifen:n Pfiff:m
		Heulen:n Jaulen:n Bellen:n Miauen:n Schnurren:n Zwitschern:n Krächzen:n Gackern:n Grunzen:n
		Wiehern:n Brüllen:n Knurren:n Fauchen:n Quaken:n Zirpen:n Schnarchen:n Husten:m Niesen:n Gähnen:n
		Schluchzen:n Weinen:n Kichern:n Stöhnen:n Murmeln:n Applaus:m Klatschen:n Trommelwirbel:m Grollen:n
		Rumpeln:n Poltern:n Krachen:n Dröhnen:n Scheppern:n Quietschen:n Rattern:n Hupen:n Alarm:m Läuten:n
		Piepen:n Klimpern:n Schmatzen:n Rülpsen:n Räuspern:n Herzklopfen:n Schweigen:n Geplapper:n
		Geschnatter:n Gejammer:n Kikeriki:n Tatütata:n Plumps:m Klick:m Schnaufen:n Keuchen:n Wimmern:n
		Winseln:n Stampfen:n Schritt:m Schuss:m Explosion:f Schall:m Krach:m Getöse:n Raunen:n Ächzen:n
		Röcheln:n Hecheln:n Schnalzen:n Klingelton:m Sirene:f Säuseln:n Gluckern:n Blubbern:n Muhen:n
		Blöken:n Meckern:n Gurren:n Surren:n Kreischen:n Lautstärke:f Brausen:n Tosen:n Prasseln:n
		Knattern:n Bimmeln:n
	`,
	person: `
		Kind:n Baby:n Zwilling:m Großmutter:f Großvater:m Oma:f Opa:m Mutter:f Vater:m Mama:f Papa:m
		Eltern:p Geschwister:p Bruder:m Schwester:f Sohn:m Tochter:f Enkel:m Neffe:m Nichte:f Onkel:m
		Tante:f Cousin:m Mann:m Frau:f Braut:f Witwe:f Waise:f Nachbar:m Gast:m Fremder:m Wanderer:m Held:m
		Schlingel:m Frechdachs:m Schlafmütze:f Bücherwurm:m Träumer:m Tollpatsch:m Faulpelz:m Angsthase:m
		Spaßvogel:m Nervensäge:f Besserwisser:m Streber:m Sturkopf:m Glückspilz:m Pechvogel:m Liebling:m
		Freund:m Freundin:f Kumpel:m Feind:m Kollege:m Teenager:m Senior:m Rentner:m Junge:m Mädchen:n
		Nesthäkchen:n Nachkomme:m Familie:f Mensch:m Zuschauer:m Besucher:m Dame:f Herr:m Kerl:m Schurke:m
		Feigling:m Genie:n Witzbold:m Draufgänger:m Abenteurer:m Optimist:m Pessimist:m Einzelgänger:m
		Stubenhocker:m Frühaufsteher:m Nachteule:f Morgenmuffel:m Naschkatze:f Vielfraß:m Tourist:m
		Anfänger:m Paar:n Leute:p Person:f Erwachsener:m Jugendlicher:m Greis:m Partner:m Bräutigam:m
		Verwandter:m Vorfahr:m Schwager:m Pate:m Mitbewohner:m Gastgeber:m Kunde:m Bürger:m Einwohner:m
		Mitglied:n Teilnehmer:m Fan:m Star:m Retter:m Opfer:n Täter:m Zeuge:m Rivale:m Langschläfer:m
		Feinschmecker:m Weltenbummler:m Lebenskünstler:m Perfektionist:m Egoist:m Angeber:m Lügner:m
		Schwätzer:m Spießer:m Rebell:m Außenseiter:m Profi:m Experte:m Laie:m Typ:m
	`,
	furniture: `
		Kissen:n Decke:f Matratze:f Vorhang:m Bettdecke:f Schrank:m Regal:n Nachttisch:m Teppich:m
		Jalousie:f Leuchter:m Stuhl:m Tisch:m Bett:n Sofa:n Sessel:m Hocker:m Schreibtisch:m Kommode:f
		Vitrine:f Schublade:f Wiege:f Hängematte:f Bettgestell:n Lattenrost:m Laken:n Bettwäsche:f Polster:n
		Gardine:f Rollo:n Lampenschirm:m Kronleuchter:m Stehlampe:f Kerzenständer:m Vase:f Bilderrahmen:m
		Garderobe:f Kleiderständer:m Schaukelstuhl:m Liegestuhl:m Liege:f Futon:m Tresen:m Arbeitsplatte:f
		Raumteiler:m Paravent:m Standuhr:f Kamin:m Tapete:f Wandteppich:m Blumentopf:m Laufstall:m
		Wickeltisch:m Hochstuhl:m Schemel:m Sitzsack:m Spind:m Anrichte:f Pult:n Lichterkette:f Wäschekorb:m
		Papierkorb:m Schirmständer:m Wäscheständer:m Markise:f Möbel:n Couchtisch:m Plaid:n Ottomane:f
		Chaiselongue:f Diwan:m Sitzbank:f Strandkorb:m Einrichtung:f Dekoration:f Kleiderschrank:m
		Bücherregal:n Esstisch:m Bürostuhl:m Etagenbett:n
	`
});

// What a noun's gender is, for `randModifier` to agree with a value it finds here,
// apart from the rest of the language's data.
export const DE_GENDER = DE_NOUNS.gender;
