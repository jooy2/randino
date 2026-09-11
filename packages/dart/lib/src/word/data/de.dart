// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

// Written once, with the gender each noun carries; `taggedNouns` splits the tags
// back off into the lookup the modifiers agree against.
final TaggedNouns _nouns = taggedNouns(<WordTheme, String>{
  WordTheme.animal: r'''
    Katze:f Hund:m Löwe:m Tiger:m Leopard:m Gepard:m Fuchs:m Wolf:m Bär:m Panda:m
    Otter:m Kaninchen:n Eichhörnchen:n Elefant:m Hirsch:m Reh:n Pferd:n Esel:m Kuh:f
    Stier:m Ziege:f Schaf:n Schwein:n Affe:m Gorilla:m Krokodil:n Schlange:f Eidechse:f
    Schildkröte:f Frosch:m Kröte:f Vogel:m Schwalbe:f Spatz:m Rabe:m Falke:m Adler:m
    Pfau:m Papagei:m Eule:f Taube:f Kranich:m Schwan:m Ente:f Gans:f Huhn:n Fisch:m
    Wal:m Delfin:m Hai:m Krake:m Tintenfisch:m Garnele:f Krabbe:f Schnecke:f Biene:f
    Ameise:f Spinne:f Libelle:f Zikade:f Fliege:f Mücke:f Wurm:m Fledermaus:f Igel:m
    Waschbär:m Dachs:m Luchs:m Bison:m Elch:m Kamel:n Koala:m Faultier:n Frettchen:n
    Maulwurf:m Reiher:m Pelikan:m Walross:n Wiesel:n Gazelle:f Zebra:n Büffel:m Robbe:f
    Pinguin:m Strauß:m
    Wildschwein:n Rentier:n Antilope:f Gnu:n Giraffe:f Nilpferd:n Nashorn:n
    Erdmännchen:n Gürteltier:n Biber:m Schnabeltier:n Känguru:n Lemur:m Schimpanse:m
    Pavian:m Tapir:m Iltis:m Marder:m Amsel:f Nachtigall:f Lerche:f Wachtel:f Fasan:m
    Rebhuhn:n Kolibri:m Tukan:m Flamingo:m Storch:m Wiedehopf:m Distelfink:m Elster:f
    Häher:m Kauz:m Bussard:m Möwe:f Specht:m Zaunkönig:m Aal:m Sardine:f Thunfisch:m
    Dorsch:m Seehecht:m Forelle:f Karpfen:m Rochen:m Qualle:f Muschel:f
    Auster:f Hummer:m Seestern:m Käfer:m Heuschrecke:f Grille:f Wespe:f Motte:f
    Leuchtkäfer:m Tausendfüßer:m Skorpion:m Floh:m Raupe:f Hummel:f Marienkäfer:m
    Leguan:m Chamäleon:n Salamander:m Molch:m Boa:f Viper:f Kobra:f Python:m
    Meerforelle:f
    Ratte:f Hamster:m Meerschweinchen:n Hase:m Eisbär:m Puma:m Jaguar:m Hyäne:f Lama:n Krähe:f
    Schmetterling:m Hering:m Hecht:m
  ''',
  WordTheme.object: r'''
    Flasche:f Bleistift:m Radierer:m Regenschirm:m Lampe:f Laterne:f Spiegel:m
    Schlüssel:m Schloss:n Tasche:f Knopf:m Nadel:f Faden:m Pinsel:m Farbe:f Papier:n
    Heft:n Brief:m Postkarte:f Briefmarke:f Karte:f Fernrohr:n Mikroskop:n Kamera:f
    Film:m Radio:n Segel:n
    Anker:m Zelt:n Fackel:f Streichholz:n Kerze:f Topf:m Kanne:f Tasse:f Löffel:m
    Teller:m Zahnrad:n Feder:f Magnet:m Band:n Umschlag:m Korb:m
    Besen:m Pfeife:f Seil:n Eimer:m Fächer:m Schild:m Netz:n Angel:f Krug:m Kamm:m
    Glöckchen:n Trichter:m Tablett:n Schachtel:f Fass:n Dose:f Fläschchen:n
    Kompass:m Stecknadel:f Fingerhut:m Knäuel:n Bindfaden:m Strick:m Haken:m Nagel:m
    Schraube:f Scharnier:n Riegel:m Kette:f Schnalle:f Brosche:f Armreif:m Ring:m
    Aktentasche:f Rucksack:m Truhe:f Kiste:f Bottich:m Schale:f Mörser:m Klammer:f
    Schleife:f Kordel:f Docht:m Öse:f Zwirn:m Lupe:f Wecker:m Kanister:m Zwinge:f
    Buch:n Zeitung:f Uhr:f Koffer:m Glas:n Schüssel:f Gabel:f Messer:n Becher:m Taschenlampe:f
    Feuerzeug:n Notizbuch:n Ordner:m Mappe:f Tinte:f Füller:m Kreide:f Klebstoff:m Gummiband:n
    Reißzwecke:f Schwamm:m Lappen:m Bürste:f Schnur:f Draht:m Tüte:f Beutel:m Sack:m Deckel:m
    Korken:m Globus:m Sanduhr:f Fernglas:n Zettel:m Stempel:m Siegel:n Foto:n Bild:n Stock:m Pfeil:m
    Bogen:m Schwert:n Dolch:m Ohrring:m Armband:n Medaillon:n Geschenk:n Kugel:f Brett:n
    Geldbeutel:m Brieftasche:f Lesezeichen:n Strohhalm:m Klebeband:n Leine:f
  ''',
  WordTheme.nature: r'''
    Meer:n Fluss:m See:m Wasserfall:m Tal:n Berg:m Hügel:m Wiese:f Wald:m Höhle:f
    Wüste:f Sand:m Fels:m Kiesel:m Vulkan:m Erdbeben:n Gletscher:m Riff:n Sumpf:m Bach:m
    Bucht:f Düne:f Gipfel:m Heide:f Steppe:f Savanne:f Mündung:f Delta:n Lagune:f
    Atoll:n Fjord:m Landzunge:f Halbinsel:f Landenge:f Inselgruppe:f Eiland:n
    Hochebene:f Schlucht:f Klippe:f Moräne:f Geröll:n Findling:m Sandbank:f
    Untiefe:f Abgrund:m Geysir:m Doline:f Tropfstein:m Grotte:f Sims:n Hang:m Schatten:m
    Echo:n Glut:f Quelle:f Ufer:n Küste:f
    Urwald:m Ebene:f Tundra:f Moor:n Oase:f Aue:f Furt:f Strand:m
    Meerbusen:m Meerenge:f Kanal:m Strömung:f Gezeiten:p Welle:f Schaum:m Brandung:f
    Steilhang:m Zinne:f Mulde:f Senke:f Kessel:m Kluft:f Karst:m Geröllhalde:f
    Steilküste:f Lichtung:f Dickicht:n
    Salzwiese:f Meeresarm:m Felsspalte:f
    Himmel:m Insel:f Stein:m Teich:m Tümpel:m Flut:f Ebbe:f Feuer:n Flamme:f Rauch:m Asche:f Staub:m
    Schlamm:m Lehm:m Kies:m Boden:m Lawine:f Erdrutsch:m Tsunami:m Gischt:f Sonnenaufgang:m
    Sonnenuntergang:m Luft:f Eis:n Eiszapfen:m Eisscholle:f Eisberg:m Wildnis:f Hain:m Busch:m
    Gebirge:n Grat:m Felswand:f Rinnsal:n Sonnenstrahl:m Tropfen:m Pfütze:f Watt:n Treibholz:n
    Funke:m Landschaft:f Stromschnelle:f Kap:n Meeresgrund:m Tiefsee:f Spiegelung:f Dunkelheit:f
    Licht:n Lava:f
  ''',
  WordTheme.plant: r'''
    Baum:m Blatt:n Blume:f Wurzel:f Samen:m Frucht:f Moos:n Farn:m Bambus:m Föhre:f
    Ahorn:m Kirschbaum:m Rose:f Lotus:m Chrysantheme:f Orchidee:f Löwenzahn:m
    Sonnenblume:f Seerose:f Gras:n Zweig:m Trieb:m Knospe:f Blütenblatt:n Pollen:m
    Zapfen:m Eichel:f Ginkgo:m Weide:f Birke:f Zeder:f Tanne:f Eiche:f Kastanie:f
    Walnuss:f Rasen:m Alge:f Hecke:f Blumenstrauß:m Kaktus:m Aloe:f Basilikum:n
    Thymian:m Oregano:m Petersilie:f Koriander:m Schnittlauch:m Fenchel:m Dill:m
    Salbei:m Estragon:m Minze:f Kamille:f Lavendel:m Efeu:m Palme:f
    Stamm:m Rinde:f Saft:m Dorn:m Brombeere:f Mistel:f Stechpalme:f Lorbeer:m
    Ölbaum:m Apfelbaum:m Mandelbaum:m Pappel:f Esche:f Ulme:f Linde:f Buche:f
    Lärche:f Mammutbaum:m Eukalyptus:m Akazie:f Magnolie:f Kamelie:f Begonie:f
    Petunie:f Geranie:f Nelke:f Gänseblume:f Mohn:m Hyazinthe:f Narzisse:f Tulpe:f
    Lilie:f Dahlie:f Pfingstrose:f Klee:m Binse:f Brennnessel:f Distel:f
    Maiglöckchen:n Glyzinie:f
    Fichte:f Schilf:n Rebe:f Flechte:f Strauch:m Blüte:f Stängel:m Halm:m Ähre:f Schote:f Beere:f
    Holunder:m Hagebutte:f Hasel:f Jasmin:m Krokus:m Schneeglöckchen:n Vergissmeinnicht:n
    Butterblume:f Kornblume:f Stiefmütterchen:n Iris:f Gladiole:f Ringelblume:f Primel:f Edelweiß:n
    Ginster:m Wacholder:m Eibe:f Platane:f Zypresse:f Hopfen:m Raps:m Zuckerrohr:n Kraut:n Unkraut:n
    Rosmarin:m Majoran:m Kresse:f Setzling:m Keim:m Ranke:f Laub:n Ast:m Baumstumpf:m Knolle:f
    Tang:m
  ''',
  WordTheme.gem: r'''
    Gold:n Silber:n Kupfer:n Eisen:n Stahl:m Bronze:f Messing:n Zinn:n Zink:n Platin:n
    Kristall:m Quarz:m Amethyst:m Achat:m Bernstein:m Perle:f Jade:f Opal:m Obsidian:m
    Marmor:m Granit:m Kalkstein:m Basalt:m Feuerstein:m Meteorit:m Erz:n Edelstein:m
    Barren:m Glimmer:m Flussspat:m Kalzit:m Malachit:m Granat:m Schwefel:m Elfenbein:n
    Nugget:n Graphit:m Quecksilber:n Gips:m Ader:f Olivin:m Turmalin:m Rubin:m Saphir:m
    Smaragd:m Topas:m Zirkon:m Pyrit:m Magnetit:m Hämatit:m Zinnober:m Bleiglanz:m
    Talk:m Wismut:n
    Nickel:n Titan:n Aluminium:n Blei:n Wolfram:n Kobalt:n Chrom:n Mangan:n Lithium:n
    Uran:n Lapislazuli:m Karneol:m Jaspis:m Onyx:m Beryll:m Spinell:m Peridot:m
    Alabaster:m Schiefer:m Sandstein:m Gneis:m Quarzit:m Tuff:m Dolomit:m Apatit:m
    Baryt:m Korund:m Feldspat:m Muskovit:m Siderit:m Limonit:m Bauxit:m
    Diamant:m Kohle:f Mondstein:m Tigerauge:n Kalk:m Mineral:n Gestein:n Koralle:f Metall:n
    Legierung:f Magnesium:n Natrium:n Kalium:n Kalzium:n Silizium:n Radium:n Plutonium:n Palladium:n
    Arsen:n Thallium:n Strass:m Speckstein:m
  ''',
  WordTheme.concept: r'''
    Freiheit:f Frieden:m Wahrheit:f Weisheit:f Erinnerung:f Fantasie:f Erzählung:f
    Gedicht:n Skizze:f Grammatik:f Logik:f Physik:f Chemie:f Biologie:f Philosophie:f
    Mathematik:f Geometrie:f Algebra:f Geschichte:f Mythos:m Legende:f Fabel:f
    Sprichwort:n Rätsel:n Geheimnis:n Versprechen:n Reise:f Abenteuer:n Überfahrt:f
    Entdeckung:f Versuch:m Frage:f Antwort:f Debatte:f Rat:m Fest:n Dimension:f
    Harmonie:f Ritus:m Brauch:m Kultur:f Sprache:f Alphabet:n Chiffre:f Archiv:n
    Kalender:m Horizont:m Ahnung:f Vernunft:f Urteil:n Lehre:f Lehrsatz:m Axiom:n
    Hypothese:f Paradox:n Dilemma:n Vorbild:n Prämisse:f Ableitung:f Analogie:f
    Metapher:f Sinnbild:n Chronik:f Zeugnis:n Manifest:n Vertrag:m Bündnis:n
    Abstammung:f Erbe:n Zeremonie:f Schwelle:f
    Vers:m Prosa:f Novelle:f Essay:n These:f Synthese:f Analyse:f Methode:f Theorie:f
    Praxis:f Technik:f Kunst:f Ethik:f Ästhetik:f Rhetorik:f Dialektik:f Semantik:f
    Orthografie:f Kalligrafie:f Gewissheit:f Zufall:m Schicksal:n Los:n Wille:m
    Gewissen:n Identität:f Wesen:n Materie:f Form:f Ursache:f Wirkung:f Ordnung:f
    Chaos:n Grenze:f Ursprung:m Absicht:f Einsicht:f
    Idee:f Gedanke:m Meinung:f Wissen:n Bildung:f Glaube:m Plan:m Regel:f Gesetz:n Recht:n Pflicht:f
    Ehre:f Ruhm:m Traum:m Witz:m Märchen:n Roman:m Drama:n Komödie:f Tragödie:f Wort:n Buchstabe:m
    Zahl:f Bedeutung:f Sinn:m Prinzip:n Tugend:f Gerechtigkeit:f Religion:f Astronomie:f Medizin:f
    Literatur:f Epos:n Parabel:f Ironie:f Anekdote:f Zitat:n Rede:f
  ''',
  WordTheme.myth: r'''
    Drache:m Phönix:m Einhorn:n Meerjungfrau:f Fee:f Kobold:m Elf:m Zwerg:m Troll:m
    Oger:m Riese:m Chimäre:f Hydra:f Greif:m Zentaur:m Minotaurus:m Sphinx:f Pegasus:m
     Basilisk:m Golem:m Vampir:m Werwolf:m Gespenst:n Geist:m Seele:f
    Dämon:m Engel:m Göttin:f Gott:m Zauber:m Fluch:m Weissagung:f Orakel:n Amulett:n
    Talisman:m Rune:f Pforte:f Heiligtum:n Götze:m Totem:n Nymphe:f Najade:f Dryade:f
    Walküre:f Muse:f Hexer:m Hexe:f Nekromant:m Alchemist:m Weiser:m Vorzeichen:n Omen:n
    Bestiarium:n
    Satyr:m Faun:m Harpyie:f Gorgone:f Zyklop:m Koloss:m Leviathan:m Gnom:m Wichtel:m
    Undine:f Sylphe:f Dschinn:m Erscheinung:f Beschwörung:f Zauberbuch:n Pentagramm:n
    Reliquie:f Kelch:m Gral:m Zauberstab:m Stab:m Zepter:n Krone:f Hippogreif:m
    Mantikor:m Lindwurm:m Unhold:m Waldgeist:m
    Zauberer:m Wassermann:m Zauberspruch:m Zaubertrank:m Elixier:n Kristallkugel:f Bann:m Segen:m
    Monster:n Mumie:f Zombie:m Yeti:m Poltergeist:m Irrlicht:n Alraune:f Seeschlange:f
    Klabautermann:m Sandmann:m Osterhase:m Höllenhund:m Hölle:f Paradies:n Unterwelt:f Jenseits:n
    Tarnkappe:f Schriftrolle:f Wunder:n Altar:m Verwandlung:f Horoskop:n Tarot:n Wünschelrute:f
    Geisterschiff:n Spuk:m Fabelwesen:n Sirene:f Jungbrunnen:m Ork:m Gestaltwandler:m Ghul:m
    Teufel:m Halbgott:m
  ''',
  WordTheme.job: r'''
    Ritter:m Jäger:m Dieb:m Pirat:m Matrose:m Kapitän:m Koch:m Gärtner:m Schmied:m
    Detektiv:m Dichter:m Maler:m Tänzer:m Clown:m Reisender:m Pilger:m Mönch:m
    Bogenschütze:m Fechter:m Krieger:m General:m Soldat:m Wache:f Pförtner:m König:m
    Königin:f Prinz:m Prinzessin:f Kaiser:m Butler:m Magd:f Diener:m Händler:m Bauer:m
    Fischer:m Hirte:m Holzfäller:m Fährmann:m Kutscher:m Pilot:m Ingenieur:m
    Briefträger:m Bote:m Kehrer:m Polizist:m Arzt:m Pfleger:m Apotheker:m Tierarzt:m
    Lehrer:m Schüler:m Bibliothekar:m Reporter:m Lektor:m Übersetzer:m Sänger:m
    Schauspieler:m Regisseur:m Musiker:m Bergmann:m Tischler:m Töpfer:m Schneider:m
    Wahrsager:m Prophet:m Priester:m Gelehrter:m Doktor:m Erfinder:m Forscher:m
    Sportler:m Akrobat:m Bildhauer:m Uhrmacher:m Bäcker:m Brauer:m Gerber:m Weber:m
    Anwalt:m Richter:m Notar:m Buchhalter:m Bankier:m Kassierer:m Verkäufer:m
    Kellner:m Hausmeister:m Lotse:m Fahrer:m Mechaniker:m Klempner:m Maurer:m Glaser:m
    Juwelier:m Schuster:m Hutmacher:m Friseur:m Barbier:m Konditor:m Metzger:m
    Florist:m Buchhändler:m Archäologe:m Astronom:m Biologe:m Geologe:m Botaniker:m
    Historiker:m Philosoph:m Archivar:m Winzer:m Müller:m Imker:m Zimmerer:m Küfer:m
    Seiler:m
    Kosmonaut:m Astronaut:m
    Zahnarzt:m Krankenschwester:f Feuerwehrmann:m Bauarbeiter:m Elektriker:m Programmierer:m
    Journalist:m Fotograf:m Architekt:m Professor:m Student:m Bürgermeister:m Schamane:m Druide:m
    Barde:m Schornsteinfeger:m Knappe:m Nachtwächter:m Gaukler:m Narr:m Förster:m Chirurg:m
    Hebamme:f Sanitäter:m Pfarrer:m Nonne:f Graf:m Herzog:m Fürst:m Schiedsrichter:m Spion:m
    Offizier:m
  ''',
  WordTheme.music: r'''
    Klavier:n Gitarre:f Trommel:f Glocke:f Harfe:f Lied:n Tanz:m Rhythmus:m Melodie:f
    Akkord:m Flöte:f Trompete:f Saxofon:n Klarinette:f Oboe:f Cello:n Bratsche:f Geige:f
    Becken:n Tamburin:n Xylofon:n Orgel:f Akkordeon:n Laute:f Mandoline:f Banjo:n
    Partitur:f Note:f Pause:f Tonleiter:f Chor:m Solo:n Konzert:n Bühne:f Sinfonie:f
    Sonate:f Walzer:m Ballade:f Wiegenlied:n Marsch:m Vorspiel:n Klangfarbe:f Takt:m
    Orchester:n Satz:m Ouvertüre:f Fuge:f Etüde:f Nachtstück:n Ständchen:n Rhapsodie:f
    Hymne:f Requiem:n Kantate:f Arie:f Duett:n Trio:n Quartett:n Quintett:n Dirigent:m
    Oktave:f Halbton:m Notenlinie:f Metronom:n Pedal:n Saite:f Mundstück:n
    Kontrabass:m Fagott:n Horn:n Posaune:f Tuba:f Dudelsack:m Okarina:f Zither:f
    Psalter:m Rassel:f Kastagnette:f Kuhglocke:f Gong:m Pauke:f Kontrapunkt:m Kadenz:f
    Arpeggio:n Triller:m Glissando:n Legato:n Tempo:n Refrain:m Strophe:f Volkslied:n
    Choral:m Motette:f Kanon:m Präludium:n Ton:m Klang:m Dreiklang:m Leier:f Schalmei:f
    Schlagzeug:n Bass:m Ukulele:f Synthesizer:m Keyboard:n Mundharmonika:f Triangel:f Cembalo:n
    Sitar:f Blockflöte:f Oper:f Musical:n Ballett:n Tango:m Polka:f Jazz:m Blues:m Rap:m Schlager:m
    Menuett:n Gesang:m Sopran:m Tenor:m Tonart:f Dur:n Moll:n Taktstock:m Notenschlüssel:m Zugabe:f
    Probe:f Auftritt:m Ensemble:n
  ''',
  WordTheme.place: r'''
    Markt:m Platz:m Stadt:f Dorf:n Gasse:f Brücke:f Garten:m Bücherei:f Museum:n
    Theater:n Schule:f Park:m Hafen:m Kai:m Bahnhof:m Flughafen:m Leuchtturm:m Burg:f
    Mauer:f Palast:m Tempel:m Turm:m Speicher:m Keller:m Terrasse:f Hof:m Veranda:f
    Gewächshaus:n Scheune:f Hütte:f Spielplatz:m Turnhalle:f Schwimmbad:n Aquarium:n
    Galerie:f Zoo:m Badehaus:n Rathaus:n Postamt:n Krankenhaus:n Apotheke:f Buchladen:m
    Bäckerei:f Café:n Gasthaus:n Küche:f Schlafzimmer:n Wohnzimmer:n Flur:m Treppe:f
    Tunnel:m Steg:m Kreuzung:f Allee:f Festung:f Bauernhof:m Obstgarten:m Abtei:f
    Kreuzgang:m Bastion:f Warte:f Graben:m Werft:f Lager:n Villa:f Landhaus:n Weiler:m
    Dom:m Kapelle:f Kloster:n Friedhof:m Mausoleum:n Gruft:f Moschee:f Synagoge:f
    Pagode:f Herberge:f Wirtshaus:n Schenke:f Taverne:f Jahrmarkt:m Viertel:n
    Vorstadt:f Vorort:m Boulevard:m Pfad:m Steig:m Abkürzung:f Damm:m Schleuse:f Wehr:n
    Mühle:f Schmiede:f Werkstatt:f Silo:n Stall:m Pferch:m Heuboden:m Gaststube:f
    Anlegestelle:f Zollhaus:n
    Sternwarte:f
    Haus:n Wohnung:f Zimmer:n Bad:n Balkon:m Dach:n Dachboden:m Garage:f Laden:m Supermarkt:m
    Kaufhaus:n Kino:n Restaurant:n Hotel:n Kirche:f Universität:f Büro:n Fabrik:f Haltestelle:f
    Parkplatz:m Tankstelle:f Straße:f Weg:m Autobahn:f Acker:m Weinberg:m Steinbruch:m Bergwerk:n
    Kaserne:f Gefängnis:n Kindergarten:m Klassenzimmer:n Kneipe:f Arena:f Zirkus:m Hochhaus:n
    Ruine:f Denkmal:n Brunnen:m Schuppen:m Labyrinth:n Labor:n Sauna:f Speisekammer:f Esszimmer:n
  ''',
  WordTheme.food: r'''
    Reis:m Brot:n Nudel:f Suppe:f Eintopf:m Salat:m Salz:n Zucker:m Pfeffer:m
    Knoblauch:m Zwiebel:f Kartoffel:f Karotte:f Gurke:f Kürbis:m Kohl:m Spinat:m Pilz:m
    Ei:n Käse:m Butter:f Joghurt:m Apfel:m Erdbeere:f Traube:f Melone:f Pfirsich:m
    Orange:f Zitrone:f Banane:f Mango:f Kirsche:f Ananas:f Schokolade:f Bonbon:n Keks:m
    Kuchen:m Pudding:m Donut:m Waffel:f Pfannkuchen:m Hamburger:m Pizza:f Nudelgericht:n
    Curry:n Omelett:n Brezel:f Brötchen:n Semmel:f Strudel:m Torte:f Wurst:f Schinken:m
    Speck:m Salami:f Frikadelle:f Schnitzel:n Braten:m Marmelade:f Honig:m Sahne:f
    Quark:m Sauerkraut:n Knödel:m
    Roggen:m Gerste:f Hafer:m Mais:m Linse:f Kichererbse:f Bohne:f Erbse:f Sojabohne:f
    Tomate:f Paprika:f Aubergine:f Zucchini:f Brokkoli:m Blumenkohl:m Artischocke:f
    Spargel:m Lauch:m Radieschen:n Rübe:f Sellerie:m Birne:f Pflaume:f Feige:f
    Granatapfel:m Quitte:f Mispel:f Aprikose:f Nektarine:f Pampelmuse:f Mandarine:f
    Kiwi:f Nuss:f Pistazie:f Erdnuss:f Marone:f Lebkuchen:m Stollen:m Krapfen:m
    Auflauf:m
    Weizen:m Mehl:n Teig:m Öl:n Essig:m Senf:m Soße:f Brühe:f Pommes:p Chips:p Eiscreme:f Müsli:n
    Toast:m Sandwich:n Döner:m Gulasch:n Spätzle:p Spiegelei:n Lasagne:f Spaghetti:p Sushi:n Tofu:m
    Muffin:m Croissant:n Baguette:n Praline:f Gummibärchen:n Kaugummi:m Marzipan:n Vanille:f Zimt:m
    Ingwer:m Chili:f Olive:f Avocado:f Kokosnuss:f Haselnuss:f Rosine:f Dattel:f Himbeere:f
    Heidelbeere:f Hähnchen:n Steak:n Hackfleisch:n Nachtisch:m Zuckerwatte:f
  ''',
  WordTheme.sport: r'''
    Fußball:m Baseball:m Basketball:m Volleyball:m Tischtennis:n Tennis:n Federball:m
    Golf:n Kegeln:n Billard:n Schwimmen:n Marathon:m Turnen:n Karate:n Judo:n Fechten:n
    Ringen:n Boxen:n Schießen:n Reiten:n Rudern:n Surfen:n Skifahren:n Hockey:n Rugby:n
    Kricket:n Radsport:m Klettern:n Schläger:m Tor:n Medaille:f Pokal:m Meister:m
    Endspiel:n Vorrunde:f Training:n Polo:n Eislauf:m Tauchen:n Dart:m Hürde:f Speer:m
    Diskus:m Staffel:f Anzeigetafel:f Helm:m Foul:n Gewichtheben:n Schlitten:m
    Aufschlag:m Sprung:m Lauf:m Ziel:n Podest:n Umkleide:f Tribüne:f Anhänger:m
    Kanusport:m Regatta:f Triathlon:m Zehnkampf:m Fünfkampf:m Wurf:m Sprungbrett:n
    Matte:f Ringe:p Bock:m Stürmer:m Verteidiger:m Trainer:m
    Stadion:n Spielfeld:n Bahn:f Elfmeter:m Ecke:f Punktestand:m Sieg:m Niederlage:f
    Rekord:m Turnier:n Liga:f Wettkampf:m Zielgerade:f Vorlage:f
    Handball:m Eishockey:n Squash:n Leichtathletik:f Weitsprung:m Hochsprung:m Sprint:m
    Kugelstoßen:n Bogenschießen:n Segeln:n Wandern:n Joggen:n Yoga:n Taekwondo:n Bergsteigen:n
    Skispringen:n Snowboarden:n Langlauf:m Biathlon:m Rodeln:n Eiskunstlauf:m Curling:n Bowling:n
    Minigolf:n Wasserball:m Rallye:f Rennen:n Mannschaft:f Gegner:m Torwart:m Ball:m Puck:m
    Stoppuhr:f Hantel:f Trampolin:n Halbzeit:f Abseits:n Freistoß:m Olympiade:f Weltmeisterschaft:f
    Sieger:m Läufer:m Schwimmer:m Reiter:m Turner:m Boxer:m Meisterschaft:f
  ''',
  WordTheme.vehicle: r'''
    Fahrrad:n Zug:m Boot:n Auto:n Bus:m Taxi:n Lastwagen:m Motorrad:n Roller:m
    Flugzeug:n Hubschrauber:m Raumschiff:n Rakete:f Unterseeboot:n Jacht:f Frachter:m
    Segler:m Floß:n Kriegsschiff:n Panzer:m Kutsche:f Karren:m Schubkarre:f Traktor:m
    Bagger:m Krankenwagen:m Seilbahn:f Straßenbahn:f Lokomotive:f Kanu:n Kajak:n
    Luftschiff:n Fallschirm:m Sänfte:f Dreirad:n Lieferwagen:m Limousine:f Schneepflug:m
    Katamaran:m Eisbrecher:m Tanker:m Lastkahn:m Fischkutter:m Doppeldecker:m Sonde:f
    Fähre:f Pistenraupe:f Einrad:n Schlepper:m Gondel:f Waggon:m
    Kalesche:f Postkutsche:f Karosse:f Cabrio:n Kipper:m Betonmischer:m Kran:m Walze:f
    Mähdrescher:m Schlittschuh:m Rollbrett:n Mofa:n Beiwagen:m Kreuzfahrer:m Galeere:f
    Galeone:f Fregatte:f Korvette:f Brigg:f Schoner:m Einbaum:m Schaluppe:f Barkasse:f
    Segelflieger:m Jagdflieger:m Bomber:m Trittroller:m Reisebus:m
    Planwagen:m
    Schiff:n Dampfer:m Wagen:m Wohnwagen:m Wohnmobil:n Geländewagen:m Kombi:m Sportwagen:m
    Rennwagen:m Oldtimer:m Rikscha:f Tretboot:n Rollstuhl:m Kinderwagen:m Bollerwagen:m Rollschuh:m
    Rennrad:n Mountainbike:n Tandem:n Heißluftballon:m Jet:m Gleitschirm:m Raumfähre:f Aufzug:m
    Rolltreppe:f Sessellift:m Gabelstapler:m Müllwagen:m Feuerwehrauto:n Flugzeugträger:m Dschunke:f
    Kogge:f Schlauchboot:n Schneemobil:n
  ''',
  WordTheme.product: r'''
    Rechner:m Tastatur:f Maus:f Bildschirm:m Drucker:m Lautsprecher:m Kopfhörer:m
    Mikrofon:n Drohne:f Tablet:n Handy:n Ladegerät:n Batterie:f Kühlschrank:m
    Staubsauger:m Ventilator:m Ofen:m Wasserfilter:m Reiskocher:m Mikrowelle:f
    Backofen:m Mixer:m Rasierer:m Zahnbürste:f Zahnpasta:f Seife:f Shampoo:n Parfüm:n
    Armbanduhr:f Beamer:m Router:m Scanner:m Trockner:m Föhn:m Lotion:f Sonnencreme:f
    Hausschuh:m Sandale:f Türklingel:f Thermometer:n Feuerlöscher:m
    Glühbirne:f Steckdose:f Steckleiste:f Bezug:m Handtuch:n Waschbecken:n
    Waschmittel:n Weichspüler:m Pfanne:f Schneebesen:m Schäler:m Korkenzieher:m
    Thermoskanne:f Fußmatte:f Kleiderbügel:m
    Fernseher:m Konsole:f Verstärker:m Waage:f Bügeleisen:n Toaster:m Fritteuse:f
    Entsafter:m Wasserkocher:m Heizkörper:m Thermostat:n
    Besteck:n Geschirr:n Tischdecke:f Serviette:f Abtropfsieb:n Spülbecken:n
    Wasserhahn:m Dusche:f Wanne:f Handspiegel:m Nagelfeile:f Rasierpinsel:m
    Kaffeemühle:f Eierbecher:m Salzstreuer:m Untersetzer:m
    Fernbedienung:f Laptop:m Kabel:n Stecker:m Adapter:m Festplatte:f Webcam:f Objektiv:n Stativ:n
    Plattenspieler:m Schallplatte:f Kassette:f Taschenrechner:m Nähmaschine:f Waschmaschine:f
    Spülmaschine:f Herd:m Gefrierschrank:m Kaffeemaschine:f Grill:m Klimaanlage:f Rauchmelder:m
    Pinzette:f Lippenstift:m Nagellack:m Deo:n Zahnseide:f Duschgel:n Taschentuch:n
    Toilettenpapier:n Mülleimer:m Spülmittel:n Wischmopp:m Bügelbrett:n Zeitschrift:f Comic:m
    Ohrstöpsel:p Windel:f Schnuller:m Rasenmäher:m Lockenstab:m Pflaster:n Verband:m Tablette:f
    Kontaktlinse:f Hörgerät:n Wärmflasche:f
  ''',
  WordTheme.color: r'''
    Karmesin:n Scharlach:n Zinnoberrot:n Purpur:n Magenta:n Fuchsia:n Rosa:n Lachs:n
     Ocker:n Siena:n Sepia:n Senfgelb:n Olivgrün:n Limone:f Smaragdgrün:n
    Türkis:n Zyan:n Himmelblau:n Indigo:n Flieder:n Malve:f Veilchen:n Weinrot:n Rost:m
    Terrakotta:n Creme:f Beige:n Khaki:n Anthrazit:n Zinngrau:n Ebenholz:n
    Rabenschwarz:n Azurblau:n Safrangelb:n Aquamarin:n Grünspan:m Perlmutt:n Kupferrot:n
    Goldgelb:n Silbergrau:n Bronzeton:m Aschgrau:n Rauchgrau:n Sandton:m Weizengelb:n
    Zimtbraun:n Muskatbraun:n Paprikarot:n Nachtblau:n Moosgrün:n Tannengrün:n
    Schneeweiß:n
    Amarant:n Korallenrot:n Karmin:n Bordeauxrot:n Mahagoni:n Rotbraun:n Blaugrün:n
    Graublau:n Blassgelb:n Dunkelgrün:n Hellblau:n Tiefschwarz:n
    Kobaltblau:n Zitronengelb:n Pfirsichton:m Blaugrau:n Gelbgrün:n Braunrot:n
    Perlweiß:n Nebelgrau:n Lindgrün:n
    Beinweiß:n
    Rot:n Blau:n Grün:n Gelb:n Schwarz:n Weiß:n Braun:n Grau:n Violett:n Lila:n Pink:n Dunkelblau:n
    Hellgrün:n Dunkelrot:n Hellgrau:n Dunkelgrau:n Hellbraun:n Dunkelbraun:n Feuerrot:n Blutrot:n
    Kirschrot:n Ziegelrot:n Altrosa:n Marineblau:n Königsblau:n Stahlblau:n Eisblau:n Taubenblau:n
    Ultramarin:n Petrol:n Mintgrün:n Giftgrün:n Grasgrün:n Flaschengrün:n Apfelgrün:n Sonnengelb:n
    Kanariengelb:n Honiggelb:n Nussbraun:n Umbra:n Pechschwarz:n Mausgrau:n Neongrün:n Pastell:n
  ''',
  WordTheme.finance: r'''
    Rechnung:f Quittung:f Anleihe:f Aktie:f Dividende:f Zins:m Darlehen:n Hypothek:f
    Einlage:f Ersparnis:f Konto:n Saldo:m Haushalt:m Vermögen:n Schuldposten:m
    Kapital:n Ertrag:m Gewinn:m Spanne:f Überschuss:m Fehlbetrag:m Schuld:f Kredit:m
    Lastschrift:f Scheck:m Münze:f Währung:f Rendite:f Depot:n Zoll:m Erstattung:f
    Prämie:f Rente:f Lohnliste:f Gehalt:n Lohn:m Bonus:m Provision:f Lizenzgebühr:f
    Franchise:f Fusion:f Übernahme:f Rettung:f Sicherheit:f Gutschein:m
    Tresor:m Staatskasse:f Überweisung:f Abrechnung:f Arbitrage:f Kontoauszug:m
    Sparbuch:n Verwahrung:f Gläubiger:m Schuldner:m Verleiher:m Bürge:m Bewertung:f
    Schätzung:f Inflation:f Rezession:f Liquidität:f Konkurs:m Spende:f Zuschuss:m
    Ausgabe:f Rabatt:m Rate:f
    Kasse:f Urkunde:f Wechsel:m Zinssatz:m Quote:f Beitrag:m Abgabe:f Steuer:f
    Umlage:f Freibetrag:m Bußgeld:n Verzug:m Wucher:m Kaution:f Mitgift:f Erbschaft:f
    Miete:f Pacht:f Wegezoll:m Zehnt:m Beute:f Schatz:m Reichtum:m Armut:f Kupon:m
    Pfand:n Bilanzbuch:n Tarif:m Notgroschen:m Rücklage:f
    Zuschlag:m Nachprüfung:f
    Geld:n Bargeld:n Schein:m Preis:m Kosten:p Umsatz:m Einkommen:n Einnahme:f Sparschwein:n Börse:f
    Kurs:m Investition:f Anleger:m Aktionär:m Fonds:m Trinkgeld:n Taschengeld:n Kreditkarte:f
    Geldautomat:m Dauerauftrag:m Buchung:f Bilanz:f Verlust:m Tilgung:f Versicherung:f Stipendium:n
    Honorar:n Wertpapier:n Handel:m Tausch:m Ware:f Angebot:n Nachfrage:f Kauf:m Lotterie:f Wette:f
  ''',
  WordTheme.tech: r'''
    Server:m Puffer:m Bildpunkt:m Codec:m Paket:n Protokoll:n Stapel:m Halde:f Zeiger:m
    Firmware:f Bandbreite:f Latenz:f Gateway:n Brandmauer:f Teilnetz:n Rechnername:m
    Nutzlast:f Prüfsumme:f Schema:n Sicherung:f Verbund:m Splitter:m Abbild:n Behälter:m
    Sandkasten:m Pipeline:f Ablage:f Fehlersucher:m Makro:n Feld:n Matrix:f Ganzzahl:f
    Syntax:f Parser:m Assembler:m Befehl:m Bitrate:f Durchsatz:m Handschlag:m
    Namensraum:m Vermittler:m Endpunkt:m Streuwert:m Darstellung:f Shader:m
    Textur:f Vieleck:n Gitternetz:n Oktett:n Wegewahl:f Vermittlung:f Rundruf:m
    Datagramm:n Bootloader:m Dateisystem:n Partition:f Verzeichnis:n Prüfpunkt:m
    Rollback:n Migration:f
    Kern:m Prozess:m Sitzung:f Abfrage:f Index:m Tabelle:f Sicht:f Spalte:f Zeile:f
    Knoten:m Graph:m Liste:f Menge:f Modul:n Bibliothek:f Zusatz:m Flicken:m
    Etikett:n Version:f Bauwerk:n Prüfung:f Spur:f Profil:n
    Auslöser:m Ereignis:n Signal:n Thema:n Zeitstempel:m Nutzerkonto:n
    Suchbaum:m Nebenzweig:m Grenzwert:m
    Internet:n Netzwerk:n Webseite:f Browser:m Suchmaschine:f Link:m Datei:f Datenbank:f Daten:p
    Software:f Hardware:f Programm:n App:f Algorithmus:m Code:m Fehler:m Absturz:m Virus:n
    Passwort:n Cloud:f Download:m Update:n Cache:m Cookie:n Prozessor:m Chip:m Platine:f
    Transistor:m Schaltkreis:m Sensor:m Roboter:m Byte:n Bit:n Terminal:n Skript:n Compiler:m
    Variable:f Funktion:f Klasse:f Schnittstelle:f Treiber:m Betriebssystem:n Domain:f Spam:m Chat:m
    Menü:n Modem:n Antenne:f Funk:m Frequenz:f Glasfaser:f
  ''',
  WordTheme.weather: r'''
    Wolke:f Wind:m Regen:m Schnee:m Reif:m Nebel:m Tau:m Regenbogen:m Blitz:m Donner:m
    Schauer:m Monsun:m Taifun:m Wirbelwind:m Schneesturm:m Nieselregen:m Hagel:m
    Graupel:m Sturm:m Bö:f Zyklon:m Gewitter:n Unwetter:n Sintflut:f Dunst:m Schwaden:m
    Feuchte:f Vorhersage:f Bewölkung:f Sonnenschein:m Hitzewelle:f Frost:m Tauwetter:n
    Windstoß:m Brise:f Zephir:m Passat:m Fallwind:m Hochdruck:m Tiefdruck:m Klima:n
    Temperatur:f Luftdruck:m Wolkenbruch:m Schwüle:f Raureif:m Morgentau:m Abendrot:n
    Wetter:n
    Hundstage:p Bise:f Westwind:m Ostwind:m Nordwind:m Südwind:m
    Orkan:m Tornado:m Windhose:f Staubwolke:f Sprühregen:m Landregen:m Schneefall:m
    Hagelschlag:m Platzregen:m Wolkendecke:f Dürre:f Windstille:f Kälte:f Hitze:f
    Wetterlage:f Regenzeit:f
    Fallböe:f
    Schneeflocke:f Regentropfen:m Glatteis:n Schneematsch:m Schneewehe:f Eisregen:m Flaute:f
    Rückenwind:m Gegenwind:m Luftfeuchtigkeit:f Niederschlag:m Kaltfront:f Warmfront:f Trockenzeit:f
    Kältewelle:f Smog:m Eisblume:f Kugelblitz:m Wetterleuchten:n Sandsturm:m Hurrikan:m
    Aufheiterung:f Abkühlung:f Erwärmung:f Klimawandel:m Mistral:m Schirokko:m Wetterwarnung:f
    Sturmflut:f Bodenfrost:m Aprilwetter:n Altweibersommer:m
  ''',
  WordTheme.space: r'''
    Stern:m Mond:m Sonne:f Galaxie:f Komet:m Meteor:m Polarlicht:n Mondsichel:f
    Sternenstaub:m Milchstraße:f Finsternis:f Weltall:n Planet:m Trabant:m Kleinplanet:m
     Sternhaufen:m Sternbild:n Umlaufbahn:f Schwerkraft:f Drehung:f
    Umlauf:m Sonnenfleck:m Krater:m Lichtjahr:n Gestirn:n Firmament:n Ekliptik:f
    Meridian:m Stratosphäre:f Lufthülle:f Leere:f Vollmond:m Neumond:m Halbmond:m
    Mondlicht:n Sternenlicht:n Polarstern:m Abendstern:m Morgenstern:m Mars:m Venus:f
    Jupiter:m Saturn:m Merkur:m Uranus:m Neptun:m Pluto:m Supernova:f Weltraum:m
    Quadrant:m Parallaxe:f Parsec:n Nadir:n Azimut:n Ellipse:f Perihel:n Aphel:n
    Fotosphäre:f Chromosphäre:f Ionosphäre:f Exosphäre:f Mesosphäre:f Troposphäre:f
    Gravitation:f Halo:m Zwergstern:m
    Feuerkugel:m Raumsonde:f Sternenmeer:n Weltenraum:m
    Erde:f Sternschnuppe:f Asteroid:m Satellit:m Raumstation:f Sonnensystem:n Schwarzes_Loch:n
    Mondfinsternis:f Sonnenfinsternis:f Sonnenwind:m Raumkapsel:f Gasriese:m Zwergplanet:m
    Neutronenstern:m Pulsar:m Quasar:m Urknall:m Schwerelosigkeit:f Vakuum:n Strahlung:f Tierkreis:m
    Sternzeichen:n Nachthimmel:m Mondphase:f Himmelskörper:m Raumfahrt:f Weltraumschrott:m Schweif:m
    Korona:f Nova:f
  ''',
  WordTheme.time: r'''
    Morgengrauen:n Morgenröte:f Dämmerung:f Einbruch:m Sonnenwende:f Jahreszeit:f
    Augenblick:m Ewigkeit:f Zukunft:f Nu:n Jahrhundert:n Jahrzehnt:n Morgen:m Mittag:m
    Nachmittag:m Abend:m Nacht:f Mitternacht:f Frühe:f Vorabend:m Gestern:n Heute:n
    Tageslauf:m Woche:f Monat:m Vierteljahr:n Halbjahr:n Jahr:n Jahrtausend:n Epoche:f
    Ära:f Zeitalter:n Frühling:m Sommer:m Herbst:m Winter:m Vorzeit:f Jetzt:n Kindheit:f
    Jugend:f Reife:f Alter:n Frist:f Zeitraum:m Dauer:f Zeitspanne:f Jahrestag:m
    Gedenktag:m Saison:f Tagesanbruch:m
    Minute:f Sekunde:f Stunde:f Weile:f Atempause:f Wartezeit:f Kreislauf:m
    Schicht:f Runde:f Phase:f Etappe:f Abschnitt:m Vormittag:m Frühjahr:n Spätsommer:m
    Gegenwart:f Morgenluft:f Jahrgang:m Jahrfünft:n Wochenende:n Feiertag:m Werktag:m
    Vorjahr:n Folgejahr:n
    Tag:m Zeit:f Datum:n Termin:m Uhrzeit:f Ferien:p Urlaub:m Wochentag:m Montag:m Dienstag:m
    Mittwoch:m Donnerstag:m Freitag:m Samstag:m Sonntag:m Januar:m Februar:m März:m April:m Mai:m
    Juni:m Juli:m August:m September:m Oktober:m November:m Dezember:m Schlafenszeit:f Freizeit:f
    Geburtstag:m Jubiläum:n Neujahr:n Silvester:n Weihnachten:n Ostern:n Advent:m Karneval:m
    Mittsommer:m Schaltjahr:n Vergangenheit:f Anfang:m Ende:n Zeitpunkt:m Verspätung:f Semester:n
    Schuljahr:n Generation:f Steinzeit:f Mittelalter:n Antike:f Neuzeit:f Geisterstunde:f
    Übermorgen:n Vorgestern:n Feierabend:m
  ''',
  WordTheme.emotion: r'''
    Freude:f Trauer:f Zorn:m Furcht:f Überraschung:f Frohsinn:m Jubel:m Glück:n Rausch:m
    Verzückung:f Trost:m Hoffnung:f Verzweiflung:f Kummer:m Schwermut:f Wehmut:f
    Einsamkeit:f Sehnsucht:f Verlangen:n Leidenschaft:f Zuneigung:f Zärtlichkeit:f
    Wärme:f Güte:f Mitgefühl:n Einfühlung:f Mitleid:n Dankbarkeit:f Demut:f Geduld:f
    Klugheit:f Mäßigung:f Redlichkeit:f Staunen:n Ehrfurcht:f Gelassenheit:f Ruhe:f
    Stille:f Vertrauen:n Zweifel:m Verdacht:m Sorge:f Angst:f Schrecken:m Panik:f Wut:f
    Ärger:m Verdruss:m Langeweile:f Begeisterung:f Eifer:m Inbrunst:f Gefühl:n
    Illusion:f Mut:m Scham:f Stolz:m Neid:m Eifersucht:f Gier:f Laune:f
    Bitterkeit:f Groll:m Hass:m Verachtung:f Misstrauen:n Überdruss:m Beklemmung:f
    Betrübnis:f Entsetzen:n Andacht:f Milde:f Nachsicht:f Wohlwollen:n Sympathie:f
    Abneigung:f Frohlocken:n Unruhe:f Bangen:n Verblüffung:f Reue:f Wonne:f Sehnen:n
    Übermut:m Wehklage:f
    Liebe:f Spaß:m Lust:f Ekel:m Scheu:f Heimweh:n Fernweh:n Erleichterung:f Enttäuschung:f Frust:m
    Stress:m Nervosität:f Aufregung:f Vorfreude:f Schadenfreude:f Zufriedenheit:f Genugtuung:f
    Verwirrung:f Unsicherheit:f Schüchternheit:f Neugier:f Interesse:n Gleichgültigkeit:f
    Müdigkeit:f Erschöpfung:f Schmerz:m Leid:n Qual:f Heiterkeit:f Vergnügen:n Trotz:m Rache:f
    Schuldgefühl:n Peinlichkeit:f Verlegenheit:f Hochmut:m Eitelkeit:f Geiz:m Großzügigkeit:f
    Zuversicht:f Optimismus:m Nostalgie:f Ehrgeiz:m Motivation:f Tatendrang:m Lampenfieber:n
    Schock:m Grauen:n Grusel:m Unbehagen:n Argwohn:m Faszination:f Bewunderung:f Respekt:m
    Verehrung:f Liebeskummer:m Gnade:f Barmherzigkeit:f Vergebung:f Behagen:n Seligkeit:f
  ''',
  WordTheme.body: r'''
    Kopf:m Stirn:f Braue:f Wimper:f Lid:n Nase:f Wange:f Kinn:n Kiefer:m Lippe:f Zunge:f
    Zahn:m Zahnfleisch:n Ohr:n Ohrläppchen:n Hals:m Nacken:m Schulter:f Ellbogen:m
    Handgelenk:n Handfläche:f Knöchel:m Finger:m Daumen:m Fingernagel:m Faust:f Brust:f
    Rippe:f Bauch:m Nabel:m Rücken:m Taille:f Hüfte:f Schenkel:m Knie:n Schienbein:n
    Wade:f Fessel:f Ferse:f Zehe:f Knochen:m Schädel:m Muskel:m Sehne:f Gelenk:n
    Knorpel:m Herz:n Lunge:f Leber:f Magen:m Niere:f Milz:f Darm:m Blase:f Gehirn:n
    Nerv:m Vene:f Arterie:f Blut:n Fleisch:n Haut:f Pore:f Haar:n Bart:m Träne:f
    Schweiß:m Speichel:m Atem:m Puls:m Herzschlag:m Kniescheibe:f Jochbein:n
    Trommelfell:n Augapfel:m Falte:f Grübchen:n Narbe:f Bluterguss:m
    Schwiele:f
    Schläfe:f Gaumen:m Mandel:f Kehlkopf:m Rachen:m Luftröhre:f Speiseröhre:f
    Zwerchfell:n Brustbein:n Wirbel:m Oberschenkel:m Wadenbein:n
    Oberarm:m Unterarm:m Fingerglied:n Fußwurzel:f Spann:m Achsel:f Leiste:f Kniekehle:f
    Pupille:f Hornhaut:f Netzhaut:f Zäpfchen:n Rachenmandel:f
    Auge:n Mund:m Arm:m Bein:n Hand:f Fuß:m Gesicht:n Körper:m Skelett:n Wirbelsäule:f Po:m Schoß:m
    Sohle:f Nasenloch:n Ohrmuschel:f Kehle:f Locke:f Zopf:m Glatze:f Scheitel:m Fingerkuppe:f
    Fingerabdruck:m Brustkorb:m Schlüsselbein:n Schulterblatt:n Steißbein:n Organ:n
    Bauchspeicheldrüse:f Gallenblase:f Galle:f Blinddarm:m Rückenmark:n Zelle:f Hormon:n Drüse:f
    Gewebe:n Fett:n Lymphe:f Wunde:f Pickel:m Sommersprosse:f Muttermal:n Warze:f
  ''',
  WordTheme.clothing: r'''
    Hut:m Schuh:m Handschuh:m Schal:m Brille:f Mantel:m Jacke:f Hemd:n Bluse:f Kittel:m
    Hose:f Jeans:p Rock:m Kleid:n Weste:f Strickjacke:f Pullover:m Kapuzenpulli:m
    Socke:f Strumpf:m Unterwäsche:f Schlafanzug:m Schürze:f Kopftuch:n Krawatte:f
    Gürtel:m Schärpe:f Stiefel:m Turnschuh:m Pantoffel:m Uniform:f Kostüm:n Robe:f
    Umhang:m Poncho:m Regenmantel:m Anorak:m Parka:m Badeanzug:m Taucheranzug:m
    Overall:m Ärmel:m Kragen:m Manschette:f Saum:m Futter:n Stoff:m Leinen:n Seide:f
    Baumwolle:f Wolle:f Samt:m Kord:m Flanell:m Leder:n Barett:n Mütze:f Kappe:f
     Turban:m Schleier:m Tuch:n
    Gehrock:m Frack:m Smoking:m Wams:n Kutte:f Unterrock:m Mieder:n Gamasche:f
    Holzschuh:m Espadrille:f Fäustling:m Armstulpe:f Hosenträger:m Korsett:n
    Reifrock:m Mantilla:f Haube:f Dreispitz:m Kapuze:f Halstuch:n Stulpe:f
    Litze:f Borte:f
    Sturzhelm:m
    Shirt:n Sweatshirt:n Shorts:p Leggings:p Strumpfhose:f Bikini:m Badehose:f Bademantel:m
    Nachthemd:n Latzhose:f Anzug:m Sakko:n Blazer:m Dirndl:n Lederhose:f Tracht:f Kimono:m Sari:m
    Toga:f Tunika:f Trenchcoat:m Stirnband:n Haarspange:f Reißverschluss:m Schnürsenkel:m Absatz:m
    Gummistiefel:m Pumps:p Strampler:m Trikot:n Trainingsanzug:m Badekappe:f Sonnenbrille:f
    Monokel:n Zylinder:m Tiara:f Diadem:n Perücke:f Maske:f Rüstung:f Kettenhemd:n Kilt:m
    Raumanzug:m Pelz:m Nylon:n Polyester:n Kaschmir:m Tweed:m Satin:m Brokat:m Tüll:m Filz:m Naht:f
  ''',
  WordTheme.tool: r'''
    Axt:f Schaufel:f Säge:f Leiter:f Zange:f Meißel:m Amboss:m Blasebalg:m Ahle:f
    Klemme:f Schraubstock:m Wasserwaage:f Messschieber:m Winkelmesser:m Lineal:n
    Schere:f Hammer:m Holzhammer:m Bohrer:m Schmirgel:m Hobel:m Spitzhacke:f Sichel:f
    Sense:f Hacke:f Pflug:m Rechen:m Lötkolben:m Schleifer:m Maßband:n Zirkel:m Beil:n
    Brecheisen:n Hebel:m Keil:m Flaschenzug:m Kurbel:f Kelle:f Wetzstein:m Feile:f
    Reibe:f Sieb:n Spaten:m Egge:f Dreschflegel:m Spindel:f Spule:f Griff:m Klinge:f
    Niete:f Stichsäge:f Bandsäge:f Drehbank:f Kettensäge:f Handsäge:f Hohleisen:n
    Reißnadel:f Winkel:m Fase:f Werkbank:f
    Handbohrer:m Stemmeisen:n Raspel:f Streichmaß:n Senklot:n Kneifzange:f
    Wagenheber:m Tacker:m Lötlampe:f Feuerstahl:m Gussform:f Stanze:f Schleifstein:m
    Bohrfutter:n Fräse:f Hippe:f Handbeil:n Zugmesser:n
    Anreißnadel:f Ösenzange:f
    Schraubenzieher:m Schraubenschlüssel:m Bohrmaschine:f Akkuschrauber:m Spachtel:m Farbrolle:f
    Gerüst:n Gießkanne:f Gartenschlauch:m Heckenschere:f Mistgabel:f Vorschlaghammer:m Dübel:m
    Bolzen:m Seitenschneider:m Teppichmesser:n Skalpell:n Laubsäge:f Kreissäge:f Körner:m
    Winkelschleifer:m Schweißgerät:n Multimeter:n Zollstock:m Stricknadel:f Webstuhl:m Spinnrad:n
    Töpferscheibe:f Brennofen:m Nudelholz:n Pfannenwender:m Kochlöffel:m Dosenöffner:m
    Flaschenöffner:m Nussknacker:m Stößel:m Schrubber:m Kehrblech:n Handfeger:m Geodreieck:n
    Spritze:f Stethoskop:n Sextant:m Harpune:f Falle:f Lasso:n Peitsche:f Joch:n Ölkanne:f
  ''',
  WordTheme.drink: r'''
    Kaffee:m Tee:m Milch:f Wasser:n Limonade:f Apfelwein:m Kakao:m Punsch:m
    Aufguss:m Kamillentee:m Kräutertee:m Milchkaffee:m Cappuccino:m Espresso:m Bier:n
    Pils:n Weizenbier:n Schwarzbier:n Wein:m Rotwein:m Weißwein:m Roséwein:m Sekt:m
    Champagner:m Sherry:m Portwein:m Wermut:m Likör:m Schnaps:m Obstler:m Rum:m Gin:m
    Wodka:m Whisky:m Weinbrand:m Tequila:m Sake:m Met:m Cocktail:m Nektar:m Sirup:m
    Sprudel:m Tonic:n Eistee:m Molke:f Buttermilch:f Kefir:m Smoothie:m Milchshake:m
    Zuckerwasser:n Eiswasser:n Heißgetränk:n
    Malzbier:n Bockbier:n Radler:n Schorle:f Traubensaft:m Obstbrand:m Kirschwasser:n
    Enzian:m Absinth:m Glühwein:m Federweißer:m Apfelsaft:m Birnensaft:m
    Rübensaft:m Zitronentee:m Sauermilch:f Dickmilch:f Brause:f Quellwasser:n
    Tafelwasser:n
    Fruchtsaft:m
    Orangensaft:m Cola:f Energydrink:m Mineralwasser:n Spezi:n Mokka:m Grüntee:m Schwarztee:m
    Matcha:m Chai:m Mate:m Kombucha:m Ayran:m Lassi:m Eierlikör:m Korn:m Grappa:m Ouzo:m Cognac:m
    Prosecco:m Bowle:f Sangria:f Grog:m Aperitif:m Kölsch:n Most:m Eiswein:m Reiswein:m Kokosmilch:f
    Eiskaffee:m Pfefferminztee:m Zitronensaft:m
  ''',
  WordTheme.toy: r'''
    Drachen:m Kreisel:m Murmel:f Würfel:m Puzzle:n Ballon:m Schachspiel:n Domino:n Puppe:f
    Teddybär:m Kuscheltier:n Bauklotz:m Spielkarte:f Kartenspiel:n Brettspiel:n Halma:n Skat:m
    Poker:n Bingo:n Quiz:n Kreuzworträtsel:n Sudoku:n Jojo:n Springseil:n Hüpfburg:f Schaukel:f
    Rutsche:f Wippe:f Karussell:n Sandburg:f Schneemann:m Schneeball:m Seifenblase:f Wasserpistole:f
    Spielzeugauto:n Modelleisenbahn:f Puppenhaus:n Handpuppe:f Marionette:f Spieluhr:f Kaleidoskop:n
    Zauberwürfel:m Stelzen:p Reifen:m Steckenpferd:n Schaukelpferd:n Klettergerüst:n Planschbecken:n
    Gokart:n Frisbee:f Bumerang:m Flummi:m Kicker:m Flipper:m Spielautomat:m Videospiel:n
    Spielfigur:f Spielbrett:n Spielstein:m Knete:f Malbuch:n Mikado:n Tangram:n Baukasten:m
    Papierflieger:m Verstecken:n Fangen:n Blindekuh:f Sackhüpfen:n Topfschlagen:n Schnitzeljagd:f
    Schatzsuche:f Mobile:n Beißring:m Modellflugzeug:n Zinnsoldat:m Ritterburg:f Kaufladen:m
    Seifenkiste:f
  ''',
  WordTheme.sound: r'''
    Flüstern:n Rascheln:n Knarren:n Schrei:m Seufzer:m Gelächter:n Lachen:n Ruf:m Stimme:f
    Geräusch:n Lärm:m Laut:m Hall:m Knall:m Knacken:n Knistern:n Knirschen:n Klappern:n Klirren:n
    Klingeln:n Klopfen:n Ticken:n Summen:n Brummen:n Zischen:n Rauschen:n Plätschern:n Platsch:m
    Pfeifen:n Pfiff:m Heulen:n Jaulen:n Bellen:n Miauen:n Schnurren:n Zwitschern:n Krächzen:n
    Gackern:n Grunzen:n Wiehern:n Brüllen:n Knurren:n Fauchen:n Quaken:n Zirpen:n Schnarchen:n
    Husten:m Niesen:n Gähnen:n Schluchzen:n Weinen:n Kichern:n Stöhnen:n Murmeln:n Geschrei:n
    Applaus:m Klatschen:n Trommelwirbel:m Grollen:n Rumpeln:n Poltern:n Krachen:n Dröhnen:n
    Scheppern:n Quietschen:n Rattern:n Hupen:n Alarm:m Läuten:n Piepen:n Klimpern:n Schmatzen:n
    Rülpsen:n Räuspern:n Herzklopfen:n Schweigen:n Geplapper:n Geschnatter:n Gejammer:n Kikeriki:n
    Tatütata:n Plumps:m Klick:m Schnaufen:n Keuchen:n Wimmern:n Winseln:n Stampfen:n Schritt:m
    Schuss:m Explosion:f Schall:m
  ''',
  WordTheme.person: r'''
    Kind:n Baby:n Zwilling:m Großmutter:f Großvater:m Oma:f Opa:m Mutter:f Vater:m Mama:f Papa:m
    Eltern:p Geschwister:p Bruder:m Schwester:f Sohn:m Tochter:f Enkel:m Neffe:m Nichte:f Onkel:m
    Tante:f Cousin:m Mann:m Frau:f Braut:f Witwe:f Waise:f Nachbar:m Gast:m Fremder:m Wanderer:m
    Held:m Schlingel:m Frechdachs:m Schlafmütze:f Bücherwurm:m Träumer:m Tollpatsch:m Faulpelz:m
    Angsthase:m Spaßvogel:m Nervensäge:f Besserwisser:m Streber:m Sturkopf:m Glückspilz:m
    Pechvogel:m Liebling:m Freund:m Freundin:f Kumpel:m Feind:m Kollege:m Teenager:m Senior:m
    Rentner:m Junge:m Mädchen:n Kleinkind:n Nesthäkchen:n Nachkomme:m Familie:f Mensch:m Zuschauer:m
    Besucher:m Dame:f Herr:m Kerl:m Schurke:m Feigling:m Genie:n Witzbold:m Draufgänger:m
    Abenteurer:m Optimist:m Pessimist:m Einzelgänger:m Stubenhocker:m Frühaufsteher:m Nachteule:f
    Morgenmuffel:m Naschkatze:f Vielfraß:m Tourist:m Anfänger:m Paar:n
  ''',
  WordTheme.furniture: r'''
    Kissen:n Decke:f Matratze:f Vorhang:m Bettdecke:f Schrank:m Regal:n Nachttisch:m Teppich:m
    Jalousie:f Leuchter:m Stuhl:m Tisch:m Bett:n Sofa:n Sessel:m Hocker:m Bank:f Schreibtisch:m
    Kommode:f Vitrine:f Schublade:f Wiege:f Hängematte:f Bettgestell:n Lattenrost:m Laken:n
    Bettwäsche:f Polster:n Gardine:f Rollo:n Lampenschirm:m Kronleuchter:m Stehlampe:f
    Kerzenständer:m Vase:f Bilderrahmen:m Garderobe:f Kleiderständer:m Schaukelstuhl:m Liegestuhl:m
    Liege:f Futon:m Tresen:m Arbeitsplatte:f Raumteiler:m Paravent:m Standuhr:f Kamin:m Tapete:f
    Wandteppich:m Blumentopf:m Laufstall:m Wickeltisch:m Hochstuhl:m Schemel:m Sitzsack:m Spind:m
    Anrichte:f Pult:n Lichterkette:f Wäschekorb:m Papierkorb:m Schirmständer:m Wäscheständer:m
    Markise:f Fensterbank:f Fensterladen:m
  ''',
});

/// The German word dataset.
final WordLanguageData de = WordLanguageData(
  joiner: ' ',
  capitalize: false,
  adjectives: words(r'''
 blau grün rot schwarz weiß gelb golden silbern hell glänzend groß klein
 lang kurz breit schmal niedrig schnell langsam stark schwach hart weich
 warm kalt lauwarm trocken feucht sauber neu alt jung schön hässlich süß bitter
 salzig scharf sauer sanft rau leicht schwer rund spitz tief fern nah reich arm
 selten ruhig laut tapfer weise fröhlich traurig frei ewig durchsichtig einsam
 strahlend wild heiter still uralt modern endlos hohl seidig neblig wolkig regnerisch
 sonnig schneeig windig rostig neugierig schelmisch edel bescheiden freundlich
 flink stachelig ruhelos kräftig verworren lebhaft zart grau blass innig
 eisig glühend düster leuchtend erhaben schlicht zierlich drollig schlau kühn faul
 wach glatt dicht knapp
 treu geduldig wachsam geschickt standhaft mild offen verschlossen stur schroff
 zottig pummelig massiv luftig dampfend würzig honigsüß
 gefleckt gestreift abgenutzt poliert nagelneu gereift dick dünn flach spitzig krumm
 gerade schlank gedrungen gedämpft schrill klangvoll dumpf melodisch heiser bebend
 lau schwül bedeckt klar bereift sternenklar mondhell moosig
 rankend grünend duftend smaragden korallen elfenbeinern kristallen
 bronzen zinnern bleiern achatfarben purpurn zinnoberrot ockerfarben indigoblau
 türkis lavendelfarben malvenfarben rabenschwarz entlegen winzig prächtig karg
 kunstvoll grob gebrechlich kraftvoll geräumig abschüssig
 '''),
  actions: words(r'''
    schlafend rennend fliegend schwimmend singend tanzend lachend weinend gehend stehend
    sitzend liegend essend trinkend lesend schreibend malend lernend wartend suchend
    rufend hörend sehend träumend wachend versteckt jagend fangend werfend ziehend
    schiebend öffnend schließend bauend pflanzend erntend kochend backend webend nähend
    rudernd fahrend kletternd rollend treibend fließend brennend schmelzend blühend
    welkend fallend wandernd flüsternd schimmernd blinkend schwebend wiegend kreisend
    schleichend hüpfend springend schnaufend gähnend streckend grübelnd staunend zögernd
    jubelnd grüßend umarmend streichelnd tröstend weckend reisend fliehend landend
    spähend lauschend zählend messend schmiedend schnitzend polierend gießend schneidend
    hackend faltend wickelnd siegelnd klingend summend
    erwachend hockend kauernd lehnend umkehrend nahend zurückweichend
    innehaltend schreitend eilend querend heimkehrend aufbrechend entschwindend
    pirschend schwankend hopsend blickend hinaufschauend beobachtend bewachend streifend
    glättend ordnend pflegend waschend trocknend flechtend zuschneidend klebend
    entfaltend füllend leerend eingießend rührend schmorend bratend wärmend kühlend
    kostend schluckend ritzend färbend lackierend feilend wägend nachschmeckend
    wiederkäuend
  '''),
  nouns: _nouns.pools,
  nounGender: _nouns.gender,
  // German declines the modifier in front of the noun, and the base form is the
  // bare stem: `blau` becomes `blauer Wal`, `blaue Katze`, `blaues Haus`.
  // German gender is not predictable from the ending, and these four suffixes are
  // the exception — every noun in `-ung`, `-heit`, `-keit` or `-schaft` is
  // feminine, and one in `-chen` or `-lein` neuter. A made-up word matching none
  // of them is masculine, which is a guess; what it buys is an article and an
  // adjective that agree with each other rather than a bare `Ein blau …`.
  genderRules: const <(String, WordGender)>[
    ('ung', WordGender.f),
    ('heit', WordGender.f),
    ('keit', WordGender.f),
    ('schaft', WordGender.f),
    ('chen', WordGender.n),
    ('lein', WordGender.n),
    ('', WordGender.m),
  ],
  agreement: const <WordGender, List<List<String>>>{
    WordGender.m: <List<String>>[
      <String>['el', 'ler'],
      <String>['auer', 'aurer'],

      <String>['e', 'er'],
      <String>['', 'er'],
    ],
    WordGender.f: <List<String>>[
      <String>['el', 'le'],
      <String>['auer', 'aure'],

      <String>['e', 'e'],
      <String>['', 'e'],
    ],
    WordGender.n: <List<String>>[
      <String>['el', 'les'],
      <String>['auer', 'aures'],

      <String>['e', 'es'],
      <String>['', 'es'],
    ],
    WordGender.p: <List<String>>[
      <String>['el', 'le'],
      <String>['auer', 'aure'],
      <String>['e', 'e'],
      <String>['', 'e'],
    ],
  },
  // German puts the modifier in front of the noun, so the noun is drawn ahead of
  // its turn. Its nouns are written capitalised, the way German writes them.
  // How common each noun is, for `vocabulary` to draw by: the everyday words,
  // and the ones a specialist or a dictionary would know. Every noun in neither
  // list is common.
  levels: WordLevels(
    basic: words(r'''
      Katze Hund Löwe Tiger Fuchs Wolf Bär Kaninchen Eichhörnchen Elefant Reh Pferd Esel Kuh Ziege
      Schaf Schwein Affe Krokodil Schlange Schildkröte Frosch Vogel Adler Papagei Eule Taube Schwan
      Ente Gans Huhn Fisch Wal Delfin Hai Schnecke Biene Ameise Spinne Fliege Mücke Wurm Fledermaus
      Igel Kamel Zebra Pinguin Giraffe Nilpferd Nashorn Känguru Möwe Muschel Käfer Wespe Marienkäfer
      Flasche Bleistift Radierer Regenschirm Lampe Laterne Spiegel Schlüssel Schloss Tasche Knopf
      Nadel Faden Pinsel Farbe Papier Heft Brief Postkarte Briefmarke Karte Kamera Film Radio Ballon
      Drachen Würfel Puzzle Zelt Streichholz Kerze Topf Kanne Tasse Löffel Teller Feder Magnet Band
      Umschlag Kissen Decke Korb Besen Seil Eimer Schild Netz Kamm Schachtel Dose Haken Nagel
      Schraube Kette Ring Rucksack Kiste Schale Klammer Schleife Wecker Meer Fluss See Wasserfall
      Tal Berg Hügel Wiese Wald Höhle Wüste Sand Fels Vulkan Erdbeben Bach Gipfel Schatten Echo
      Quelle Ufer Küste Strand Kanal Welle Schaum Baum Blatt Blume Wurzel Samen Frucht Moos Bambus
      Kirschbaum Rose Löwenzahn Sonnenblume Gras Zweig Knospe Pollen Zapfen Eichel Tanne Eiche
      Kastanie Walnuss Rasen Hecke Blumenstrauß Kaktus Basilikum Petersilie Schnittlauch Minze
      Lavendel Palme Stamm Rinde Saft Dorn Brombeere Apfelbaum Mohn Tulpe Klee Brennnessel Gold
      Silber Kupfer Eisen Stahl Bronze Kristall Perle Marmor Edelstein Gips Rubin Smaragd Aluminium
      Blei Freiheit Frieden Wahrheit Erinnerung Fantasie Gedicht Grammatik Physik Chemie Biologie
      Mathematik Geschichte Rätsel Geheimnis Versprechen Reise Abenteuer Versuch Frage Antwort Rat
      Fest Kultur Sprache Alphabet Kalender Ahnung Vorbild Zeugnis Vertrag Technik Kunst Zufall
      Schicksal Wille Form Ursache Ordnung Chaos Grenze Drache Einhorn Meerjungfrau Fee Kobold Elf
      Zwerg Troll Riese Vampir Werwolf Gespenst Geist Seele Engel Gott Zauber Fluch Hexe Wichtel
      Zauberstab Stab Krone Ritter Jäger Dieb Pirat Kapitän Koch Gärtner Detektiv Maler Tänzer Clown
      Soldat König Königin Prinz Prinzessin Kaiser Bauer Fischer Pilot Ingenieur Briefträger
      Polizist Arzt Apotheker Tierarzt Lehrer Schüler Reporter Sänger Schauspieler Musiker Doktor
      Erfinder Forscher Sportler Bäcker Anwalt Richter Kassierer Verkäufer Kellner Hausmeister
      Fahrer Mechaniker Friseur Metzger Astronaut Klavier Gitarre Trommel Glocke Lied Tanz Rhythmus
      Melodie Flöte Trompete Geige Orgel Note Pause Chor Konzert Bühne Takt Orchester Dirigent
      Rassel Tempo Strophe Ton Klang Markt Platz Stadt Dorf Gasse Brücke Garten Bücherei Museum
      Theater Schule Park Hafen Bahnhof Flughafen Leuchtturm Burg Mauer Palast Turm Keller Terrasse
      Hof Scheune Hütte Spielplatz Turnhalle Schwimmbad Aquarium Zoo Rathaus Krankenhaus Apotheke
      Buchladen Bäckerei Café Küche Schlafzimmer Wohnzimmer Flur Treppe Tunnel Kreuzung Bauernhof
      Lager Villa Dom Friedhof Moschee Viertel Abkürzung Mühle Werkstatt Stall Reis Brot Nudel Suppe
      Eintopf Salat Salz Zucker Pfeffer Knoblauch Zwiebel Kartoffel Karotte Gurke Kürbis Spinat Pilz
      Ei Käse Butter Joghurt Apfel Erdbeere Traube Melone Pfirsich Orange Zitrone Banane Mango
      Kirsche Ananas Schokolade Bonbon Keks Kuchen Pudding Donut Waffel Pfannkuchen Hamburger Pizza
      Brezel Brötchen Torte Wurst Schinken Speck Salami Frikadelle Schnitzel Braten Marmelade Honig
      Sahne Quark Sauerkraut Knödel Mais Bohne Erbse Tomate Paprika Zucchini Brokkoli Blumenkohl
      Spargel Birne Pflaume Mandarine Kiwi Nuss Erdnuss Lebkuchen Fußball Basketball Volleyball
      Tischtennis Tennis Federball Golf Kegeln Schwimmen Marathon Turnen Karate Judo Boxen Schießen
      Reiten Rudern Surfen Skifahren Hockey Klettern Schläger Tor Medaille Pokal Meister Endspiel
      Training Tauchen Helm Foul Schlitten Sprung Lauf Ziel Umkleide Matte Stürmer Verteidiger
      Trainer Stadion Spielfeld Bahn Elfmeter Ecke Sieg Niederlage Rekord Turnier Liga Wettkampf
      Fahrrad Zug Boot Auto Bus Taxi Lastwagen Motorrad Roller Flugzeug Hubschrauber Raumschiff
      Rakete Floß Panzer Kutsche Schubkarre Traktor Bagger Krankenwagen Seilbahn Straßenbahn
      Lokomotive Fallschirm Dreirad Lieferwagen Fähre Waggon Cabrio Kran Schlittschuh Reisebus
      Rechner Tastatur Maus Bildschirm Drucker Lautsprecher Kopfhörer Mikrofon Tablet Handy
      Ladegerät Batterie Kühlschrank Staubsauger Ventilator Ofen Mikrowelle Backofen Mixer Rasierer
      Zahnbürste Zahnpasta Seife Shampoo Parfüm Armbanduhr Trockner Föhn Sonnencreme Hausschuh
      Sandale Matratze Vorhang Türklingel Thermometer Glühbirne Steckdose Bettdecke Handtuch
      Waschbecken Waschmittel Pfanne Kleiderbügel Schrank Regal Nachttisch Fernseher Waage
      Bügeleisen Toaster Wasserkocher Teppich Besteck Geschirr Tischdecke Serviette Wasserhahn
      Dusche Wanne Rosa Türkis Himmelblau Weinrot Creme Beige Goldgelb Schneeweiß Rotbraun
      Dunkelgrün Hellblau Tiefschwarz Zitronengelb Rechnung Quittung Aktie Zins Konto Haushalt
      Gewinn Schuld Kredit Münze Währung Rente Gehalt Lohn Bonus Rettung Sicherheit Gutschein Tresor
      Überweisung Kontoauszug Sparbuch Inflation Spende Ausgabe Rabatt Kasse Steuer Bußgeld Kaution
      Miete Beute Schatz Reichtum Armut Pfand Server Paket Protokoll Sicherung Behälter Sandkasten
      Ablage Feld Befehl Darstellung Verzeichnis Kern Prozess Sitzung Tabelle Sicht Spalte Zeile
      Knoten Liste Menge Bibliothek Etikett Version Prüfung Spur Profil Ereignis Signal Thema Wolke
      Wind Regen Schnee Nebel Tau Regenbogen Blitz Donner Schauer Schneesturm Nieselregen Hagel
      Sturm Gewitter Unwetter Vorhersage Sonnenschein Hitzewelle Frost Klima Temperatur Wetter Orkan
      Tornado Schneefall Dürre Kälte Hitze Stern Mond Sonne Galaxie Komet Milchstraße Weltall Planet
      Sternbild Umlaufbahn Schwerkraft Krater Lichtjahr Vollmond Halbmond Mars Venus Jupiter Saturn
      Merkur Uranus Neptun Pluto Weltraum Dämmerung Jahreszeit Augenblick Ewigkeit Zukunft
      Jahrhundert Jahrzehnt Morgen Mittag Nachmittag Abend Nacht Mitternacht Gestern Heute Woche
      Monat Halbjahr Jahr Frühling Sommer Herbst Winter Jetzt Kindheit Jugend Alter Dauer Saison
      Minute Sekunde Stunde Weile Wartezeit Schicht Runde Phase Abschnitt Vormittag Frühjahr
      Wochenende Feiertag Werktag Freude Trauer Überraschung Glück Hoffnung Verzweiflung Einsamkeit
      Sehnsucht Wärme Mitleid Dankbarkeit Geduld Ruhe Stille Vertrauen Zweifel Verdacht Sorge Angst
      Panik Wut Ärger Langeweile Begeisterung Gefühl Mut Stolz Neid Eifersucht Laune Hass Kopf Stirn
      Wimper Nase Wange Kinn Lippe Zunge Zahn Zahnfleisch Ohr Hals Nacken Schulter Ellbogen
      Handgelenk Knöchel Finger Daumen Fingernagel Faust Brust Rippe Bauch Nabel Rücken Hüfte Knie
      Schienbein Wade Ferse Zehe Knochen Schädel Muskel Gelenk Herz Lunge Leber Magen Niere Darm
      Blase Gehirn Nerv Blut Fleisch Haut Haar Bart Träne Schweiß Atem Puls Narbe Oberschenkel Hut
      Schuh Handschuh Schal Brille Mantel Jacke Hemd Bluse Hose Jeans Rock Kleid Weste Strickjacke
      Pullover Kapuzenpulli Socke Strumpf Unterwäsche Schlafanzug Schürze Kopftuch Krawatte Gürtel
      Stiefel Turnschuh Pantoffel Uniform Kostüm Regenmantel Badeanzug Ärmel Kragen Stoff Seide
      Baumwolle Wolle Leder Mütze Kappe Tuch Kapuze Axt Schaufel Säge Leiter Zange Lineal Schere
      Hammer Bohrer Hacke Pflug Rechen Maßband Zirkel Hebel Feile Reibe Sieb Spaten Griff Klinge
      Kettensäge Winkel Wagenheber Tacker Kaffee Tee Milch Wasser Limonade Kakao Kamillentee
      Cappuccino Espresso Bier Pils Weizenbier Wein Rotwein Weißwein Sekt Champagner Schnaps Rum
      Wodka Whisky Cocktail Sirup Sprudel Eistee Buttermilch Smoothie Milchshake Radler Schorle
      Glühwein Apfelsaft Fruchtsaft
      Puppe Teddybär Kuscheltier Bauklotz Spielkarte Kartenspiel Brettspiel Springseil Hüpfburg
      Schaukel Rutsche Wippe Karussell Sandburg Schneemann Schneeball Seifenblase Wasserpistole
      Spielzeugauto Puppenhaus Frisbee Flummi Kicker Videospiel Spielfigur Knete Malbuch Verstecken
      Fangen Sackhüpfen Schnitzeljagd Schatzsuche Papierflieger Jojo Poker Quiz Sudoku Bingo Skat
      Flüstern Schrei Lachen Ruf Stimme Geräusch Lärm Knall Klingeln Klopfen Ticken Summen Brummen
      Zischen Rauschen Pfiff Heulen Bellen Miauen Schnurren Zwitschern Brüllen Knurren Quaken
      Schnarchen Husten Niesen Gähnen Weinen Kichern Applaus Klatschen Hupen Alarm Piepen Schuss
      Explosion Klick Plumps Kikeriki Tatütata Schritt Kind Baby Zwilling Großmutter Großvater Oma
      Opa Mutter Vater Mama Papa Eltern Geschwister Bruder Schwester Sohn Tochter Enkel Neffe Nichte
      Onkel Tante Cousin Mann Frau Braut Witwe Nachbar Gast Held Freund Freundin Kumpel Feind
      Kollege Teenager Senior Rentner Junge Mädchen Kleinkind Familie Mensch Zuschauer Besucher Dame
      Herr Kerl Genie Optimist Tourist Anfänger Paar Liebling Streber Träumer Angsthase Glückspilz
      Pechvogel Spaßvogel Faulpelz Stuhl Tisch Bett Sofa Sessel Hocker Bank Schreibtisch Kommode
      Schublade Wiege Hängematte Laken Bettwäsche Gardine Rollo Lampenschirm Kronleuchter Stehlampe
      Kerzenständer Vase Bilderrahmen Garderobe Kleiderständer Schaukelstuhl Liegestuhl Liege Tresen
      Arbeitsplatte Kamin Tapete Blumentopf Laufstall Wickeltisch Hochstuhl Sitzsack Spind
      Wäschekorb Papierkorb Wäscheständer Markise Fensterbank Fensterladen
      Ratte Hamster Meerschweinchen Hase Eisbär Krähe Schmetterling Buch Zeitung Uhr Koffer Glas
      Schüssel Gabel Messer Becher Taschenlampe Feuerzeug Tinte Kreide Schwamm Lappen Bürste Schnur
      Draht Tüte Beutel Sack Deckel Foto Bild Stock Pfeil Schwert Geschenk Kugel Brett Geldbeutel
      Himmel Insel Stein Teich Feuer Flamme Rauch Asche Staub Boden Luft Eis Busch Gebirge
      Sonnenaufgang Sonnenuntergang Licht Dunkelheit Pfütze Tropfen Lawine Fichte Strauch Blüte
      Beere Laub Ast Kraut Unkraut Rosmarin Krokus Diamant Kohle Metall Idee Gedanke Meinung Wissen
      Plan Regel Gesetz Recht Pflicht Traum Witz Märchen Roman Wort Buchstabe Zahl Rede Zauberer
      Monster Mumie Zombie Hölle Paradies Teufel Wunder Zaubertrank Zauberspruch Zahnarzt
      Krankenschwester Feuerwehrmann Bauarbeiter Elektriker Programmierer Journalist Fotograf
      Architekt Professor Student Bürgermeister Pfarrer Nonne Schiedsrichter Chirurg Schlagzeug Bass
      Keyboard Mundharmonika Triangel Blockflöte Oper Musical Ballett Tango Jazz Rap Schlager Gesang
      Probe Auftritt Haus Wohnung Zimmer Bad Balkon Dach Dachboden Garage Laden Supermarkt Kaufhaus
      Kino Restaurant Hotel Kirche Universität Büro Fabrik Haltestelle Parkplatz Tankstelle Straße
      Weg Autobahn Kindergarten Klassenzimmer Kneipe Zirkus Brunnen Schuppen Labor Sauna Esszimmer
      Weizen Mehl Teig Öl Essig Senf Soße Pommes Chips Eiscreme Müsli Toast Sandwich Döner Gulasch
      Spätzle Spiegelei Lasagne Spaghetti Muffin Croissant Baguette Gummibärchen Kaugummi Marzipan
      Vanille Zimt Olive Kokosnuss Haselnuss Rosine Himbeere Heidelbeere Hähnchen Steak Hackfleisch
      Nachtisch Handball Eishockey Leichtathletik Weitsprung Hochsprung Sprint Segeln Wandern Joggen
      Yoga Snowboarden Rodeln Bowling Minigolf Rennen Mannschaft Gegner Torwart Ball Halbzeit
      Olympiade Weltmeisterschaft Sieger Läufer Schwimmer Reiter Turner Boxer Meisterschaft
      Trampolin Schiff Dampfer Wagen Wohnwagen Wohnmobil Geländewagen Kombi Sportwagen Rennwagen
      Oldtimer Tretboot Rollstuhl Kinderwagen Bollerwagen Rollschuh Rennrad Mountainbike
      Heißluftballon Jet Aufzug Rolltreppe Müllwagen Feuerwehrauto Schlauchboot Fernbedienung Laptop
      Kabel Stecker Festplatte Plattenspieler Schallplatte Kassette Taschenrechner Nähmaschine
      Waschmaschine Spülmaschine Herd Gefrierschrank Kaffeemaschine Grill Klimaanlage Rauchmelder
      Pinzette Lippenstift Nagellack Deo Zahnseide Duschgel Taschentuch Toilettenpapier Mülleimer
      Spülmittel Bügelbrett Zeitschrift Comic Windel Schnuller Rasenmäher Pflaster Verband Tablette
      Wärmflasche Rot Blau Grün Gelb Schwarz Weiß Braun Grau Violett Lila Pink Dunkelblau Hellgrün
      Dunkelrot Hellgrau Dunkelgrau Hellbraun Dunkelbraun Geld Bargeld Schein Preis Kosten Einkommen
      Sparschwein Börse Kurs Trinkgeld Taschengeld Kreditkarte Geldautomat Verlust Versicherung
      Handel Ware Angebot Kauf Lotterie Wette Internet Netzwerk Webseite Browser Suchmaschine Link
      Datei Daten Software Programm App Code Fehler Absturz Virus Passwort Download Update Chip
      Roboter Menü Chat Antenne Schneeflocke Regentropfen Glatteis Schneematsch Rückenwind Gegenwind
      Niederschlag Smog Hurrikan Klimawandel Sandsturm Erde Sternschnuppe Asteroid Satellit
      Raumstation Sonnensystem Schwarzes_Loch Sonnenfinsternis Mondfinsternis Urknall
      Schwerelosigkeit Nachthimmel Sternzeichen Raumfahrt Tag Zeit Datum Termin Uhrzeit Ferien
      Urlaub Montag Dienstag Mittwoch Donnerstag Freitag Samstag Sonntag Januar Februar März April
      Mai Juni Juli August September Oktober November Dezember Geburtstag Neujahr Silvester
      Weihnachten Ostern Vergangenheit Anfang Ende Übermorgen Vorgestern Feierabend Freizeit
      Schlafenszeit Liebe Spaß Lust Ekel Heimweh Erleichterung Enttäuschung Frust Stress Aufregung
      Vorfreude Schadenfreude Zufriedenheit Neugier Interesse Müdigkeit Schmerz Vergnügen Trotz
      Rache Schock Respekt Ehrgeiz Lampenfieber Auge Mund Arm Bein Hand Fuß Gesicht Körper Skelett
      Wirbelsäule Po Sohle Nasenloch Kehle Locke Zopf Glatze Fingerabdruck Brustkorb Schlüsselbein
      Schulterblatt Organ Galle Blinddarm Zelle Wunde Pickel Sommersprosse Muttermal Warze Fett
      Shirt Sweatshirt Shorts Leggings Strumpfhose Bikini Badehose Bademantel Nachthemd Latzhose
      Anzug Sakko Blazer Dirndl Lederhose Kimono Stirnband Haarspange Reißverschluss Schnürsenkel
      Absatz Gummistiefel Pumps Trikot Trainingsanzug Badekappe Sonnenbrille Zylinder Perücke Maske
      Rüstung Pelz Schraubenzieher Schraubenschlüssel Bohrmaschine Akkuschrauber Spachtel Gerüst
      Gießkanne Gartenschlauch Heckenschere Dübel Zollstock Stricknadel Nudelholz Pfannenwender
      Kochlöffel Dosenöffner Flaschenöffner Nussknacker Schrubber Kehrblech Handfeger Geodreieck
      Spritze Falle Peitsche Orangensaft Cola Energydrink Mineralwasser Spezi Grüntee Schwarztee
      Prosecco Bowle Sangria Kölsch Eiskaffee Pfefferminztee Zitronensaft Kokosmilch
    '''),
    rare: words(r'''
      Zikade Gnu Gürteltier Schnabeltier Lemur Tapir Iltis Rebhuhn Wiedehopf Distelfink Häher
      Zaunkönig Seehecht Leuchtkäfer Tausendfüßer Leguan Molch Boa Viper Meerforelle Bottich Mörser
      Öse Zwirn Zwinge Atoll Landzunge Landenge Eiland Moräne Findling Untiefe Doline Tropfstein
      Sims Aue Furt Meerbusen Zinne Kluft Karst Geröllhalde Salzwiese Meeresarm Föhre Estragon
      Stechpalme Ölbaum Ulme Kamelie Begonie Petunie Binse Glyzinie Achat Obsidian Glimmer Flussspat
      Kalzit Malachit Olivin Turmalin Zirkon Pyrit Magnetit Hämatit Zinnober Bleiglanz Talk Wismut
      Mangan Lapislazuli Karneol Jaspis Onyx Beryll Spinell Peridot Alabaster Gneis Quarzit Tuff
      Dolomit Apatit Baryt Korund Feldspat Muskovit Siderit Limonit Bauxit Ritus Chiffre Lehrsatz
      Axiom Prämisse Analogie Sinnbild Manifest Prosa Novelle Synthese Ästhetik Rhetorik Dialektik
      Semantik Orthografie Kalligrafie Chimäre Hydra Greif Golem Weissagung Götze Totem Najade
      Dryade Walküre Nekromant Bestiarium Satyr Faun Harpyie Gorgone Leviathan Undine Sylphe
      Reliquie Hippogreif Mantikor Lindwurm Unhold Fährmann Kehrer Lektor Gerber Bankier Lotse
      Hutmacher Botaniker Archivar Zimmerer Küfer Seiler Laute Mandoline Klangfarbe Ouvertüre Fuge
      Etüde Nachtstück Rhapsodie Requiem Kantate Quintett Halbton Notenlinie Fagott Okarina Zither
      Psalter Kastagnette Kontrapunkt Kadenz Arpeggio Triller Glissando Legato Choral Motette
      Präludium Dreiklang Leier Schalmei Badehaus Abtei Kreuzgang Bastion Warte Weiler Mausoleum
      Schenke Steig Wehr Pferch Zollhaus Mispel Kanusport Regatta Fünfkampf Ringe Sänfte Katamaran
      Lastkahn Pistenraupe Kalesche Karosse Rollbrett Kreuzfahrer Galeere Galeone Fregatte Korvette
      Brigg Schoner Einbaum Schaluppe Barkasse Trittroller Abtropfsieb Rasierpinsel Karmesin
      Scharlach Zinnoberrot Siena Limone Zyan Malve Zinngrau Safrangelb Grünspan Bronzeton Sandton
      Weizengelb Zimtbraun Muskatbraun Paprikarot Amarant Karmin Pfirsichton Nebelgrau Lindgrün
      Beinweiß Schuldposten Fehlbetrag Lohnliste Lizenzgebühr Franchise Staatskasse Arbitrage
      Verwahrung Verleiher Liquidität Umlage Verzug Wucher Mitgift Wegezoll Zehnt Kupon Bilanzbuch
      Notgroschen Nachprüfung Bildpunkt Codec Halde Latenz Gateway Brandmauer Teilnetz Rechnername
      Nutzlast Prüfsumme Fehlersucher Makro Parser Assembler Bitrate Durchsatz Namensraum Streuwert
      Shader Oktett Wegewahl Rundruf Datagramm Bootloader Prüfpunkt Rollback Zeitstempel Suchbaum
      Nebenzweig Zyklon Schwaden Feuchte Zephir Passat Fallwind Hundstage Bise Sprühregen
      Hagelschlag Fallböe Trabant Kleinplanet Sternhaufen Gestirn Firmament Ekliptik Meridian
      Lufthülle Quadrant Parallaxe Parsec Nadir Azimut Perihel Aphel Fotosphäre Chromosphäre
      Ionosphäre Exosphäre Mesosphäre Troposphäre Halo Zwergstern Feuerkugel Sternenmeer Weltenraum
      Morgenröte Nu Tageslauf Vorzeit Morgenluft Jahrfünft Folgejahr Frohsinn Verzückung Schwermut
      Einfühlung Mäßigung Redlichkeit Verdruss Inbrunst Überdruss Beklemmung Betrübnis Andacht
      Frohlocken Bangen Wonne Sehnen Wehklage Jochbein Schwiele Brustbein Wadenbein Fingerglied
      Fußwurzel Spann Zäpfchen Rachenmandel Barett Gehrock Wams Mieder Gamasche Espadrille Armstulpe
      Reifrock Mantilla Dreispitz Stulpe Litze Borte Sturzhelm Blasebalg Ahle Messschieber Schmirgel
      Wetzstein Egge Dreschflegel Spindel Bandsäge Drehbank Hohleisen Reißnadel Fase Handbohrer
      Stemmeisen Streichmaß Senklot Lötlampe Feuerstahl Gussform Stanze Bohrfutter Fräse Hippe
      Handbeil Zugmesser Anreißnadel Ösenzange Wermut Enzian Rübensaft Sauermilch Dickmilch
      Halma Mikado Tangram Zinnsoldat Steckenpferd Kaleidoskop Seifenkiste Hall Schall Nesthäkchen
      Nachkomme Paravent Anrichte Wandteppich Schemel
      Rinnsal Grat Gischt Stromschnelle Treibholz Flechte Hagebutte Ginster Platane Gladiole
      Setzling Tang Medaillon Mondstein Tigerauge Legierung Radium Plutonium Palladium Arsen
      Thallium Strass Speckstein Silizium Kalium Epos Parabel Alraune Klabautermann Wünschelrute
      Ghul Gestaltwandler Halbgott Irrlicht Schamane Druide Barde Knappe Nachtwächter Gaukler Narr
      Cembalo Sitar Menuett Taktstock Dschunke Kogge Umbra Ultramarin Taubenblau Kanariengelb
      Stahlblau Pechschwarz Tilgung Dauerauftrag Fonds Wertpapier Transistor Schaltkreis Platine
      Compiler Terminal Skript Schnittstelle Mistral Schirokko Kugelblitz Wetterleuchten Eisblume
      Aufheiterung Altweibersommer Gasriese Pulsar Quasar Neutronenstern Korona Nova Weltraumschrott
      Zwergplanet Geisterstunde Genugtuung Argwohn Behagen Seligkeit Tatendrang Hochmut
      Barmherzigkeit Lymphe Steißbein Bauchspeicheldrüse Monokel Tiara Diadem Brokat Tüll Toga
      Tunika Sari Kettenhemd Seitenschneider Körner Stößel Sextant Joch Multimeter Winkelschleifer
      Töpferscheibe Webstuhl Spinnrad Brennofen Harpune Mate Lassi Grog Most Eiswein Reiswein
    '''),
  ),
  frames: const <WordFrame>[
    WordFrame(<WordSlot>[WordSlot.noun], 12),
    WordFrame(<WordSlot>[WordSlot.adjective, WordSlot.noun], 50),
    WordFrame(<WordSlot>[WordSlot.action, WordSlot.noun], 38),
  ],
  syn: SyllableSynthesis(
    onset: words(
      'b d f g h k l m n p r s t w z bl br dr fl fr gl gr kl kn kr pf schl schm schn schr schw sp st tr',
    ),
    vowel: words('a e e i i o u au ei ie eu ä ö ü'),
    coda: <String>['', ...words('n m r l s t ch ng nd st rt lt')],
    minSyllables: 2,
    maxSyllables: 2,
  ),
);
