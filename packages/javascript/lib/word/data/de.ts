import { words } from '../../_internal/parse.js';
import { DE_MODIFIERS } from './modifiers/de.js';
import { DE_NOUNS } from './nouns/de.js';
import type { WordLanguageData } from './types.js';

export const DE: WordLanguageData = {
	...DE_MODIFIERS,
	nouns: DE_NOUNS.pools,
	nounGender: DE_NOUNS.gender,
	// German puts the modifier in front of the noun, so the noun is drawn ahead of
	// its turn — see `buildWords`. Its nouns are written capitalised, the way
	// German writes them, which is why `capitalize` stays off.
	// How common each noun is, for `vocabulary` to draw by: the everyday words,
	// and the ones a specialist or a dictionary would know. Every noun in neither
	// list is common. See `WordLevels`.
	levels: {
		basic: words(`
			Katze Hund Löwe Tiger Fuchs Wolf Bär Kaninchen Eichhörnchen Elefant Reh Pferd Esel Kuh Ziege
			Schaf Schwein Affe Krokodil Schlange Schildkröte Frosch Vogel Adler Papagei Eule Taube Schwan
			Ente Gans Huhn Fisch Wal Delfin Hai Schnecke Biene Ameise Spinne Fliege Mücke Wurm Fledermaus
			Igel Kamel Zebra Pinguin Giraffe Nilpferd Nashorn Känguru Möwe Muschel Käfer Wespe Marienkäfer
			Flasche Bleistift Radierer Regenschirm Lampe Laterne Spiegel Schlüssel Schloss Tasche Knopf Nadel
			Faden Pinsel Farbe Papier Heft Brief Postkarte Briefmarke Karte Kamera Film Radio Ballon Drachen
			Würfel Puzzle Zelt Streichholz Kerze Topf Kanne Tasse Löffel Teller Feder Magnet Band Umschlag
			Kissen Decke Korb Besen Seil Eimer Schild Netz Kamm Schachtel Dose Haken Nagel Schraube Kette
			Ring Rucksack Kiste Schale Klammer Schleife Wecker Meer Fluss See Wasserfall Tal Berg Hügel Wiese
			Wald Höhle Wüste Sand Fels Vulkan Erdbeben Bach Gipfel Schatten Echo Quelle Ufer Küste Strand
			Kanal Welle Schaum Baum Blatt Blume Wurzel Samen Frucht Moos Bambus Kirschbaum Rose Löwenzahn
			Sonnenblume Gras Zweig Knospe Pollen Zapfen Eichel Tanne Eiche Kastanie Walnuss Rasen Hecke
			Blumenstrauß Kaktus Basilikum Petersilie Schnittlauch Minze Lavendel Palme Stamm Rinde Saft Dorn
			Brombeere Apfelbaum Mohn Tulpe Klee Brennnessel Gold Silber Kupfer Eisen Stahl Bronze Kristall
			Perle Marmor Edelstein Gips Rubin Smaragd Aluminium Blei Freiheit Frieden Wahrheit Erinnerung
			Fantasie Gedicht Grammatik Physik Chemie Biologie Mathematik Geschichte Rätsel Geheimnis
			Versprechen Reise Abenteuer Versuch Frage Antwort Rat Fest Kultur Sprache Alphabet Kalender
			Ahnung Vorbild Zeugnis Vertrag Technik Kunst Zufall Schicksal Wille Form Ursache Ordnung Chaos
			Grenze Drache Einhorn Meerjungfrau Fee Kobold Elf Zwerg Troll Riese Vampir Werwolf Gespenst Geist
			Seele Engel Gott Zauber Fluch Hexe Wichtel Zauberstab Stab Krone Ritter Jäger Dieb Pirat Kapitän
			Koch Gärtner Detektiv Maler Tänzer Clown Soldat König Königin Prinz Prinzessin Kaiser Bauer
			Fischer Pilot Ingenieur Briefträger Polizist Arzt Apotheker Tierarzt Lehrer Schüler Reporter
			Sänger Schauspieler Musiker Doktor Erfinder Forscher Sportler Bäcker Anwalt Richter Kassierer
			Verkäufer Kellner Hausmeister Fahrer Mechaniker Friseur Metzger Astronaut Klavier Gitarre Trommel
			Glocke Lied Tanz Rhythmus Melodie Flöte Trompete Geige Orgel Note Pause Chor Konzert Bühne Takt
			Orchester Dirigent Rassel Tempo Strophe Ton Klang Markt Platz Stadt Dorf Gasse Brücke Garten
			Bücherei Museum Theater Schule Park Hafen Bahnhof Flughafen Leuchtturm Burg Mauer Palast Turm
			Keller Terrasse Hof Scheune Hütte Spielplatz Turnhalle Schwimmbad Aquarium Zoo Rathaus
			Krankenhaus Apotheke Buchladen Bäckerei Café Küche Schlafzimmer Wohnzimmer Flur Treppe Tunnel
			Kreuzung Bauernhof Lager Villa Dom Friedhof Moschee Viertel Abkürzung Mühle Werkstatt Stall Reis
			Brot Nudel Suppe Eintopf Salat Salz Zucker Pfeffer Knoblauch Zwiebel Kartoffel Karotte Gurke
			Kürbis Spinat Pilz Ei Käse Butter Joghurt Apfel Erdbeere Traube Melone Pfirsich Orange Zitrone
			Banane Mango Kirsche Ananas Schokolade Bonbon Keks Kuchen Pudding Donut Waffel Pfannkuchen
			Hamburger Pizza Brezel Brötchen Torte Wurst Schinken Speck Salami Frikadelle Schnitzel Braten
			Marmelade Honig Sahne Quark Sauerkraut Knödel Mais Bohne Erbse Tomate Paprika Zucchini Brokkoli
			Blumenkohl Spargel Birne Pflaume Mandarine Kiwi Nuss Erdnuss Lebkuchen Fußball Basketball
			Volleyball Tischtennis Tennis Federball Golf Kegeln Schwimmen Marathon Turnen Karate Judo Boxen
			Schießen Reiten Rudern Surfen Skifahren Hockey Klettern Schläger Tor Medaille Pokal Meister
			Endspiel Training Tauchen Helm Foul Schlitten Sprung Lauf Ziel Umkleide Matte Stürmer Verteidiger
			Trainer Stadion Spielfeld Bahn Elfmeter Ecke Sieg Niederlage Rekord Turnier Liga Wettkampf
			Fahrrad Zug Boot Auto Bus Taxi Lastwagen Motorrad Roller Flugzeug Hubschrauber Raumschiff Rakete
			Floß Panzer Kutsche Schubkarre Traktor Bagger Krankenwagen Seilbahn Straßenbahn Lokomotive
			Fallschirm Dreirad Lieferwagen Fähre Waggon Cabrio Kran Schlittschuh Reisebus Rechner Tastatur
			Maus Bildschirm Drucker Lautsprecher Kopfhörer Mikrofon Tablet Handy Ladegerät Batterie
			Kühlschrank Staubsauger Ventilator Ofen Mikrowelle Backofen Mixer Rasierer Zahnbürste Zahnpasta
			Seife Shampoo Parfüm Armbanduhr Trockner Föhn Sonnencreme Hausschuh Sandale Matratze Vorhang
			Türklingel Thermometer Glühbirne Steckdose Bettdecke Handtuch Waschbecken Waschmittel Pfanne
			Kleiderbügel Schrank Regal Nachttisch Fernseher Waage Bügeleisen Toaster Wasserkocher Teppich
			Besteck Geschirr Tischdecke Serviette Wasserhahn Dusche Wanne Rosa Türkis Himmelblau Weinrot
			Creme Beige Goldgelb Schneeweiß Rotbraun Dunkelgrün Hellblau Tiefschwarz Zitronengelb Rechnung
			Quittung Aktie Zins Konto Haushalt Gewinn Schuld Kredit Münze Währung Rente Gehalt Lohn Bonus
			Rettung Sicherheit Gutschein Tresor Überweisung Kontoauszug Sparbuch Inflation Spende Ausgabe
			Rabatt Kasse Steuer Bußgeld Kaution Miete Beute Schatz Reichtum Armut Pfand Server Paket
			Protokoll Sicherung Behälter Sandkasten Ablage Feld Befehl Darstellung Verzeichnis Kern Prozess
			Sitzung Tabelle Sicht Spalte Zeile Knoten Liste Menge Bibliothek Etikett Version Prüfung Spur
			Profil Ereignis Signal Thema Wolke Wind Regen Schnee Nebel Tau Regenbogen Blitz Donner Schauer
			Schneesturm Nieselregen Hagel Sturm Gewitter Unwetter Vorhersage Sonnenschein Hitzewelle Frost
			Klima Temperatur Wetter Orkan Tornado Schneefall Dürre Kälte Hitze Stern Mond Sonne Galaxie Komet
			Milchstraße Weltall Planet Sternbild Umlaufbahn Schwerkraft Krater Lichtjahr Vollmond Halbmond
			Mars Venus Jupiter Saturn Merkur Uranus Neptun Pluto Weltraum Dämmerung Jahreszeit Augenblick
			Ewigkeit Zukunft Jahrhundert Jahrzehnt Morgen Mittag Nachmittag Abend Nacht Mitternacht Gestern
			Heute Woche Monat Halbjahr Jahr Frühling Sommer Herbst Winter Jetzt Kindheit Jugend Alter Dauer
			Saison Minute Sekunde Stunde Weile Wartezeit Schicht Runde Phase Abschnitt Vormittag Frühjahr
			Wochenende Feiertag Werktag Freude Trauer Überraschung Glück Hoffnung Verzweiflung Einsamkeit
			Sehnsucht Wärme Mitleid Dankbarkeit Geduld Ruhe Stille Vertrauen Zweifel Verdacht Sorge Angst
			Panik Wut Ärger Langeweile Begeisterung Gefühl Mut Stolz Neid Eifersucht Laune Hass Kopf Stirn
			Wimper Nase Wange Kinn Lippe Zunge Zahn Zahnfleisch Ohr Hals Nacken Schulter Ellbogen Handgelenk
			Knöchel Finger Daumen Fingernagel Faust Brust Rippe Bauch Nabel Rücken Hüfte Knie Schienbein Wade
			Ferse Zehe Knochen Schädel Muskel Gelenk Herz Lunge Leber Magen Niere Darm Blase Gehirn Nerv Blut
			Fleisch Haut Haar Bart Träne Schweiß Atem Puls Narbe Oberschenkel Hut Schuh Handschuh Schal
			Brille Mantel Jacke Hemd Bluse Hose Jeans Rock Kleid Weste Strickjacke Pullover Kapuzenpulli
			Socke Strumpf Unterwäsche Schlafanzug Schürze Kopftuch Krawatte Gürtel Stiefel Turnschuh
			Pantoffel Uniform Kostüm Regenmantel Badeanzug Ärmel Kragen Stoff Seide Baumwolle Wolle Leder
			Mütze Kappe Tuch Kapuze Axt Schaufel Säge Leiter Zange Lineal Schere Hammer Bohrer Hacke Pflug
			Rechen Maßband Zirkel Hebel Feile Reibe Sieb Spaten Griff Klinge Kettensäge Winkel Wagenheber
			Tacker Kaffee Tee Milch Wasser Limonade Kakao Kamillentee Cappuccino Espresso Bier Pils
			Weizenbier Wein Rotwein Weißwein Sekt Champagner Schnaps Rum Wodka Whisky Cocktail Sirup Sprudel
			Eistee Buttermilch Smoothie Milchshake Radler Schorle Glühwein Apfelsaft Fruchtsaft
			Puppe Teddybär Kuscheltier Bauklotz Spielkarte Kartenspiel Brettspiel Springseil Hüpfburg Schaukel Rutsche
			Wippe Karussell Sandburg Schneemann Schneeball Seifenblase Wasserpistole Spielzeugauto Puppenhaus Frisbee
			Flummi Kicker Videospiel Spielfigur Knete Malbuch Verstecken Fangen Sackhüpfen Schnitzeljagd Schatzsuche
			Papierflieger Jojo Poker Quiz Sudoku Bingo Skat Flüstern Schrei Lachen Ruf Stimme Geräusch Lärm Knall
			Klingeln Klopfen Ticken Summen Brummen Zischen Rauschen Pfiff Heulen Bellen Miauen Schnurren Zwitschern
			Brüllen Knurren Quaken Schnarchen Husten Niesen Gähnen Weinen Kichern Applaus Klatschen Hupen Alarm Piepen
			Schuss Explosion Klick Plumps Kikeriki Tatütata Schritt Kind Baby Zwilling Großmutter Großvater Oma Opa
			Mutter Vater Mama Papa Eltern Geschwister Bruder Schwester Sohn Tochter Enkel Neffe Nichte Onkel Tante
			Cousin Mann Frau Braut Witwe Nachbar Gast Held Freund Freundin Kumpel Feind Kollege Teenager Senior
			Rentner Junge Mädchen Kleinkind Familie Mensch Zuschauer Besucher Dame Herr Kerl Genie Optimist Tourist
			Anfänger Paar Liebling Streber Träumer Angsthase Glückspilz Pechvogel Spaßvogel Faulpelz Stuhl Tisch Bett
			Sofa Sessel Hocker Bank Schreibtisch Kommode Schublade Wiege Hängematte Laken Bettwäsche Gardine Rollo
			Lampenschirm Kronleuchter Stehlampe Kerzenständer Vase Bilderrahmen Garderobe Kleiderständer Schaukelstuhl
			Liegestuhl Liege Tresen Arbeitsplatte Kamin Tapete Blumentopf Laufstall Wickeltisch Hochstuhl Sitzsack
			Spind Wäschekorb Papierkorb Wäscheständer Markise Fensterbank Fensterladen
			Ratte Hamster Meerschweinchen Hase Eisbär Krähe Schmetterling Buch Zeitung Uhr Koffer Glas Schüssel Gabel
			Messer Becher Taschenlampe Feuerzeug Tinte Kreide Schwamm Lappen Bürste Schnur Draht Tüte Beutel Sack
			Deckel Foto Bild Stock Pfeil Schwert Geschenk Kugel Brett Geldbeutel Himmel Insel Stein Teich Feuer Flamme
			Rauch Asche Staub Boden Luft Eis Busch Gebirge Sonnenaufgang Sonnenuntergang Licht Dunkelheit Pfütze
			Tropfen Lawine Fichte Strauch Blüte Beere Laub Ast Kraut Unkraut Rosmarin Krokus Diamant Kohle Metall Idee
			Gedanke Meinung Wissen Plan Regel Gesetz Recht Pflicht Traum Witz Märchen Roman Wort Buchstabe Zahl Rede
			Zauberer Monster Mumie Zombie Hölle Paradies Teufel Wunder Zaubertrank Zauberspruch Zahnarzt
			Krankenschwester Feuerwehrmann Bauarbeiter Elektriker Programmierer Journalist Fotograf Architekt
			Professor Student Bürgermeister Pfarrer Nonne Schiedsrichter Chirurg Schlagzeug Bass Keyboard
			Mundharmonika Triangel Blockflöte Oper Musical Ballett Tango Jazz Rap Schlager Gesang Probe Auftritt Haus
			Wohnung Zimmer Bad Balkon Dach Dachboden Garage Laden Supermarkt Kaufhaus Kino Restaurant Hotel Kirche
			Universität Büro Fabrik Haltestelle Parkplatz Tankstelle Straße Weg Autobahn Kindergarten Klassenzimmer
			Kneipe Zirkus Brunnen Schuppen Labor Sauna Esszimmer Weizen Mehl Teig Öl Essig Senf Soße Pommes Chips
			Eiscreme Müsli Toast Sandwich Döner Gulasch Spätzle Spiegelei Lasagne Spaghetti Muffin Croissant Baguette
			Gummibärchen Kaugummi Marzipan Vanille Zimt Olive Kokosnuss Haselnuss Rosine Himbeere Heidelbeere Hähnchen
			Steak Hackfleisch Nachtisch Handball Eishockey Leichtathletik Weitsprung Hochsprung Sprint Segeln Wandern
			Joggen Yoga Snowboarden Rodeln Bowling Minigolf Rennen Mannschaft Gegner Torwart Ball Halbzeit Olympiade
			Weltmeisterschaft Sieger Läufer Schwimmer Reiter Turner Boxer Meisterschaft Trampolin Schiff Dampfer Wagen
			Wohnwagen Wohnmobil Geländewagen Kombi Sportwagen Rennwagen Oldtimer Tretboot Rollstuhl Kinderwagen
			Bollerwagen Rollschuh Rennrad Mountainbike Heißluftballon Jet Aufzug Rolltreppe Müllwagen Feuerwehrauto
			Schlauchboot Fernbedienung Laptop Kabel Stecker Festplatte Plattenspieler Schallplatte Kassette
			Taschenrechner Nähmaschine Waschmaschine Spülmaschine Herd Gefrierschrank Kaffeemaschine Grill Klimaanlage
			Rauchmelder Pinzette Lippenstift Nagellack Deo Zahnseide Duschgel Taschentuch Toilettenpapier Mülleimer
			Spülmittel Bügelbrett Zeitschrift Comic Windel Schnuller Rasenmäher Pflaster Verband Tablette Wärmflasche
			Rot Blau Grün Gelb Schwarz Weiß Braun Grau Violett Lila Pink Dunkelblau Hellgrün Dunkelrot Hellgrau
			Dunkelgrau Hellbraun Dunkelbraun Geld Bargeld Schein Preis Kosten Einkommen Sparschwein Börse Kurs
			Trinkgeld Taschengeld Kreditkarte Geldautomat Verlust Versicherung Handel Ware Angebot Kauf Lotterie Wette
			Internet Netzwerk Webseite Browser Suchmaschine Link Datei Daten Software Programm App Code Fehler Absturz
			Virus Passwort Download Update Chip Roboter Menü Chat Antenne Schneeflocke Regentropfen Glatteis
			Schneematsch Rückenwind Gegenwind Niederschlag Smog Hurrikan Klimawandel Sandsturm Erde Sternschnuppe
			Asteroid Satellit Raumstation Sonnensystem Schwarzes_Loch Sonnenfinsternis Mondfinsternis Urknall
			Schwerelosigkeit Nachthimmel Sternzeichen Raumfahrt Tag Zeit Datum Termin Uhrzeit Ferien Urlaub Montag
			Dienstag Mittwoch Donnerstag Freitag Samstag Sonntag Januar Februar März April Mai Juni Juli August
			September Oktober November Dezember Geburtstag Neujahr Silvester Weihnachten Ostern Vergangenheit Anfang
			Ende Übermorgen Vorgestern Feierabend Freizeit Schlafenszeit Liebe Spaß Lust Ekel Heimweh Erleichterung
			Enttäuschung Frust Stress Aufregung Vorfreude Schadenfreude Zufriedenheit Neugier Interesse Müdigkeit
			Schmerz Vergnügen Trotz Rache Schock Respekt Ehrgeiz Lampenfieber Auge Mund Arm Bein Hand Fuß Gesicht
			Körper Skelett Wirbelsäule Po Sohle Nasenloch Kehle Locke Zopf Glatze Fingerabdruck Brustkorb
			Schlüsselbein Schulterblatt Organ Galle Blinddarm Zelle Wunde Pickel Sommersprosse Muttermal Warze Fett
			Shirt Sweatshirt Shorts Leggings Strumpfhose Bikini Badehose Bademantel Nachthemd Latzhose Anzug Sakko
			Blazer Dirndl Lederhose Kimono Stirnband Haarspange Reißverschluss Schnürsenkel Absatz Gummistiefel Pumps
			Trikot Trainingsanzug Badekappe Sonnenbrille Zylinder Perücke Maske Rüstung Pelz Schraubenzieher
			Schraubenschlüssel Bohrmaschine Akkuschrauber Spachtel Gerüst Gießkanne Gartenschlauch Heckenschere Dübel
			Zollstock Stricknadel Nudelholz Pfannenwender Kochlöffel Dosenöffner Flaschenöffner Nussknacker Schrubber
			Kehrblech Handfeger Geodreieck Spritze Falle Peitsche Orangensaft Cola Energydrink Mineralwasser Spezi
			Grüntee Schwarztee Prosecco Bowle Sangria Kölsch Eiskaffee Pfefferminztee Zitronensaft Kokosmilch
		`),
		rare: words(`
			Zikade Gnu Gürteltier Schnabeltier Lemur Tapir Iltis Rebhuhn Wiedehopf Distelfink Häher Zaunkönig
			Seehecht Leuchtkäfer Tausendfüßer Leguan Molch Boa Viper Meerforelle Bottich Mörser Öse Zwirn
			Zwinge Atoll Landzunge Landenge Eiland Moräne Findling Untiefe Doline Tropfstein Sims Aue Furt
			Meerbusen Zinne Kluft Karst Geröllhalde Salzwiese Meeresarm Föhre Estragon Stechpalme Ölbaum Ulme
			Kamelie Begonie Petunie Binse Glyzinie Achat Obsidian Glimmer Flussspat Kalzit Malachit Olivin
			Turmalin Zirkon Pyrit Magnetit Hämatit Zinnober Bleiglanz Talk Wismut Mangan Lapislazuli Karneol
			Jaspis Onyx Beryll Spinell Peridot Alabaster Gneis Quarzit Tuff Dolomit Apatit Baryt Korund
			Feldspat Muskovit Siderit Limonit Bauxit Ritus Chiffre Lehrsatz Axiom Prämisse Analogie Sinnbild
			Manifest Prosa Novelle Synthese Ästhetik Rhetorik Dialektik Semantik Orthografie Kalligrafie
			Chimäre Hydra Greif Golem Weissagung Götze Totem Najade Dryade Walküre Nekromant Bestiarium Satyr
			Faun Harpyie Gorgone Leviathan Undine Sylphe Reliquie Hippogreif Mantikor Lindwurm Unhold
			Fährmann Kehrer Lektor Gerber Bankier Lotse Hutmacher Botaniker Archivar Zimmerer Küfer Seiler
			Laute Mandoline Klangfarbe Ouvertüre Fuge Etüde Nachtstück Rhapsodie Requiem Kantate Quintett
			Halbton Notenlinie Fagott Okarina Zither Psalter Kastagnette Kontrapunkt Kadenz Arpeggio Triller
			Glissando Legato Choral Motette Präludium Dreiklang Leier Schalmei Badehaus Abtei Kreuzgang
			Bastion Warte Weiler Mausoleum Schenke Steig Wehr Pferch Zollhaus Mispel Kanusport Regatta
			Fünfkampf Ringe Sänfte Katamaran Lastkahn Pistenraupe Kalesche Karosse Rollbrett Kreuzfahrer
			Galeere Galeone Fregatte Korvette Brigg Schoner Einbaum Schaluppe Barkasse Trittroller
			Abtropfsieb Rasierpinsel Karmesin Scharlach Zinnoberrot Siena Limone Zyan Malve Zinngrau
			Safrangelb Grünspan Bronzeton Sandton Weizengelb Zimtbraun Muskatbraun Paprikarot Amarant Karmin
			Pfirsichton Nebelgrau Lindgrün Beinweiß Schuldposten Fehlbetrag Lohnliste Lizenzgebühr Franchise
			Staatskasse Arbitrage Verwahrung Verleiher Liquidität Umlage Verzug Wucher Mitgift Wegezoll Zehnt
			Kupon Bilanzbuch Notgroschen Nachprüfung Bildpunkt Codec Halde Latenz Gateway Brandmauer Teilnetz
			Rechnername Nutzlast Prüfsumme Fehlersucher Makro Parser Assembler Bitrate Durchsatz Namensraum
			Streuwert Shader Oktett Wegewahl Rundruf Datagramm Bootloader Prüfpunkt Rollback Zeitstempel
			Suchbaum Nebenzweig Zyklon Schwaden Feuchte Zephir Passat Fallwind Hundstage Bise Sprühregen
			Hagelschlag Fallböe Trabant Kleinplanet Sternhaufen Gestirn Firmament Ekliptik Meridian Lufthülle
			Quadrant Parallaxe Parsec Nadir Azimut Perihel Aphel Fotosphäre Chromosphäre Ionosphäre Exosphäre
			Mesosphäre Troposphäre Halo Zwergstern Feuerkugel Sternenmeer Weltenraum Morgenröte Nu Tageslauf
			Vorzeit Morgenluft Jahrfünft Folgejahr Frohsinn Verzückung Schwermut Einfühlung Mäßigung
			Redlichkeit Verdruss Inbrunst Überdruss Beklemmung Betrübnis Andacht Frohlocken Bangen Wonne
			Sehnen Wehklage Jochbein Schwiele Brustbein Wadenbein Fingerglied Fußwurzel Spann Zäpfchen
			Rachenmandel Barett Gehrock Wams Mieder Gamasche Espadrille Armstulpe Reifrock Mantilla Dreispitz
			Stulpe Litze Borte Sturzhelm Blasebalg Ahle Messschieber Schmirgel Wetzstein Egge Dreschflegel
			Spindel Bandsäge Drehbank Hohleisen Reißnadel Fase Handbohrer Stemmeisen Streichmaß Senklot
			Lötlampe Feuerstahl Gussform Stanze Bohrfutter Fräse Hippe Handbeil Zugmesser Anreißnadel
			Ösenzange Wermut Enzian Rübensaft Sauermilch Dickmilch
			Halma Mikado Tangram Zinnsoldat Steckenpferd Kaleidoskop Seifenkiste Hall Schall Nesthäkchen Nachkomme
			Paravent Anrichte Wandteppich Schemel
			Rinnsal Grat Gischt Stromschnelle Treibholz Flechte Hagebutte Ginster Platane Gladiole Setzling Tang
			Medaillon Mondstein Tigerauge Legierung Radium Plutonium Palladium Arsen Thallium Strass Speckstein
			Silizium Kalium Epos Parabel Alraune Klabautermann Wünschelrute Ghul Gestaltwandler Halbgott Irrlicht
			Schamane Druide Barde Knappe Nachtwächter Gaukler Narr Cembalo Sitar Menuett Taktstock Dschunke Kogge
			Umbra Ultramarin Taubenblau Kanariengelb Stahlblau Pechschwarz Tilgung Dauerauftrag Fonds Wertpapier
			Transistor Schaltkreis Platine Compiler Terminal Skript Schnittstelle Mistral Schirokko Kugelblitz
			Wetterleuchten Eisblume Aufheiterung Altweibersommer Gasriese Pulsar Quasar Neutronenstern Korona Nova
			Weltraumschrott Zwergplanet Geisterstunde Genugtuung Argwohn Behagen Seligkeit Tatendrang Hochmut
			Barmherzigkeit Lymphe Steißbein Bauchspeicheldrüse Monokel Tiara Diadem Brokat Tüll Toga Tunika Sari
			Kettenhemd Seitenschneider Körner Stößel Sextant Joch Multimeter Winkelschleifer Töpferscheibe Webstuhl
			Spinnrad Brennofen Harpune Mate Lassi Grog Most Eiswein Reiswein
		`)
	}
};
