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
  ''',
  WordTheme.object: r'''
    Flasche:f Bleistift:m Radierer:m Regenschirm:m Lampe:f Laterne:f Spiegel:m
    Schlüssel:m Schloss:n Tasche:f Knopf:m Nadel:f Faden:m Pinsel:m Farbe:f Papier:n
    Heft:n Brief:m Postkarte:f Briefmarke:f Karte:f Fernrohr:n Mikroskop:n Kamera:f
    Film:m Radio:n Ballon:m Drachen:m Kreisel:m Murmel:f Würfel:m Puzzle:n Segel:n
    Anker:m Zelt:n Fackel:f Streichholz:n Kerze:f Topf:m Kanne:f Tasse:f Löffel:m
    Teller:m Zahnrad:n Feder:f Magnet:m Band:n Umschlag:m Kissen:n Decke:f Korb:m
    Besen:m Pfeife:f Seil:n Eimer:m Fächer:m Schild:m Netz:n Angel:f Krug:m Kamm:m
    Glöckchen:n Trichter:m Tablett:n Schachtel:f Fass:n Dose:f Fläschchen:n
    Kompass:m Stecknadel:f Fingerhut:m Knäuel:n Bindfaden:m Strick:m Haken:m Nagel:m
    Schraube:f Scharnier:n Riegel:m Kette:f Schnalle:f Brosche:f Armreif:m Ring:m
    Aktentasche:f Rucksack:m Truhe:f Kiste:f Bottich:m Schale:f Mörser:m Klammer:f
    Schleife:f Kordel:f Docht:m Öse:f Zwirn:m Lupe:f Wecker:m Kanister:m Zwinge:f
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
    Matte:f Ringe:p Bock:m Schachspiel:n Domino:n Stürmer:m Verteidiger:m Trainer:m
    Stadion:n Spielfeld:n Bahn:f Elfmeter:m Ecke:f Punktestand:m Sieg:m Niederlage:f
    Rekord:m Turnier:n Liga:f Wettkampf:m Zielgerade:f Vorlage:f
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
  ''',
  WordTheme.product: r'''
    Rechner:m Tastatur:f Maus:f Bildschirm:m Drucker:m Lautsprecher:m Kopfhörer:m
    Mikrofon:n Drohne:f Tablet:n Handy:n Ladegerät:n Batterie:f Kühlschrank:m
    Staubsauger:m Ventilator:m Ofen:m Wasserfilter:m Reiskocher:m Mikrowelle:f
    Backofen:m Mixer:m Rasierer:m Zahnbürste:f Zahnpasta:f Seife:f Shampoo:n Parfüm:n
    Armbanduhr:f Beamer:m Router:m Scanner:m Trockner:m Föhn:m Lotion:f Sonnencreme:f
    Hausschuh:m Sandale:f Matratze:f Vorhang:m Türklingel:f Thermometer:n Feuerlöscher:m
    Glühbirne:f Steckdose:f Steckleiste:f Bettdecke:f Bezug:m Handtuch:n Waschbecken:n
    Waschmittel:n Weichspüler:m Pfanne:f Schneebesen:m Schäler:m Korkenzieher:m
    Thermoskanne:f Fußmatte:f Kleiderbügel:m Schrank:m Regal:n Nachttisch:m
    Fernseher:m Konsole:f Verstärker:m Waage:f Bügeleisen:n Toaster:m Fritteuse:f
    Entsafter:m Wasserkocher:m Heizkörper:m Thermostat:n Teppich:m Jalousie:f Leuchter:m
    Besteck:n Geschirr:n Tischdecke:f Serviette:f Abtropfsieb:n Spülbecken:n
    Wasserhahn:m Dusche:f Wanne:f Handspiegel:m Nagelfeile:f Rasierpinsel:m
    Kaffeemühle:f Eierbecher:m Salzstreuer:m Untersetzer:m
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
    flüsternd lau schwül bedeckt klar bereift sternenklar mondhell moosig
    rankend grünend blühend duftend smaragden korallen elfenbeinern kristallen
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
