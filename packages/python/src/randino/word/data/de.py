"""German word pools."""

from randino._internal.parse import tagged_nouns, words
from randino.word.data._types import SyllableSynthesis, WordFrame, WordLanguageData

# Written once, with the gender each noun carries; `tagged_nouns` splits the tags
# back off into the lookup the modifiers agree against.
_POOLS, _GENDER = tagged_nouns(
    {
        "animal": """
        Katze:f Hund:m Löwe:m Tiger:m Leopard:m Gepard:m Fuchs:m Wolf:m Bär:m Panda:m
        Otter:m Kaninchen:n Eichhörnchen:n Elefant:m Hirsch:m Reh:n Pferd:n Esel:m Kuh:f
        Stier:m Ziege:f Schaf:n Schwein:n Affe:m Gorilla:m Krokodil:n Schlange:f
        Eidechse:f Schildkröte:f Frosch:m Kröte:f Vogel:m Schwalbe:f Spatz:m Rabe:m
        Falke:m Adler:m Pfau:m Papagei:m Eule:f Taube:f Kranich:m Schwan:m Ente:f Gans:f
        Huhn:n Fisch:m Wal:m Delfin:m Hai:m Krake:m Tintenfisch:m Garnele:f Krabbe:f
        Schnecke:f Biene:f Ameise:f Spinne:f Libelle:f Zikade:f Fliege:f Mücke:f Wurm:m
        Fledermaus:f Igel:m Waschbär:m Dachs:m Luchs:m Bison:m Elch:m Kamel:n Koala:m
        Faultier:n Frettchen:n Maulwurf:m Reiher:m Pelikan:m Walross:n Wiesel:n
        Gazelle:f Zebra:n Büffel:m Robbe:f Pinguin:m Strauß:m
    """,
        "object": """
        Flasche:f Bleistift:m Radierer:m Regenschirm:m Lampe:f Laterne:f Spiegel:m
        Schlüssel:m Schloss:n Tasche:f Knopf:m Nadel:f Faden:m Pinsel:m Farbe:f Papier:n
        Heft:n Brief:m Postkarte:f Briefmarke:f Karte:f Fernrohr:n Mikroskop:n Kamera:f
        Film:m Radio:n Ballon:m Drachen:m Kreisel:m Murmel:f Würfel:m Puzzle:n Segel:n
        Anker:m Zelt:n Fackel:f Streichholz:n Kerze:f Topf:m Kanne:f Tasse:f Löffel:m
        Teller:m Zahnrad:n Feder:f Magnet:m Band:n Umschlag:m Kissen:n Decke:f Korb:m
        Besen:m Pfeife:f Seil:n Eimer:m Fächer:m Schild:m Netz:n Angel:f Krug:m Kamm:m
        Glöckchen:n Trichter:m Tablett:n Schachtel:f Fass:n Dose:f Fläschchen:n
    """,
        "nature": """
        Meer:n Fluss:m See:m Wasserfall:m Tal:n Berg:m Hügel:m Wiese:f Wald:m Höhle:f
        Wüste:f Sand:m Fels:m Kiesel:m Vulkan:m Erdbeben:n Gletscher:m Riff:n Sumpf:m
        Bach:m Bucht:f Düne:f Gipfel:m Heide:f Steppe:f Savanne:f Mündung:f Delta:n
        Lagune:f Atoll:n Fjord:m Landzunge:f Halbinsel:f Landenge:f Inselgruppe:f
        Eiland:n Hochebene:f Schlucht:f Klippe:f Spalte:f Moräne:f Geröll:n Findling:m
        Sandbank:f Untiefe:f Abgrund:m Geysir:m Doline:f Tropfstein:m Grotte:f Sims:n
        Hang:m Schatten:m Echo:n Glut:f Quelle:f Ufer:n Küste:f
    """,
        "plant": """
        Baum:m Blatt:n Blume:f Wurzel:f Samen:m Frucht:f Moos:n Farn:m Bambus:m
        Kieferbaum:m Ahorn:m Kirschbaum:m Rose:f Lotus:m Chrysantheme:f Orchidee:f
        Löwenzahn:m Sonnenblume:f Seerose:f Gras:n Zweig:m Trieb:m Knospe:f
        Blütenblatt:n Pollen:m Zapfen:m Eichel:f Ginkgo:m Weide:f Birke:f Zeder:f
        Tanne:f Eiche:f Kastanie:f Walnuss:f Rasen:m Alge:f Hecke:f Blumenstrauß:m
        Kaktus:m Aloe:f Basilikum:n Thymian:m Oregano:m Petersilie:f Koriander:m
        Schnittlauch:m Fenchel:m Dill:m Salbei:m Estragon:m Minze:f Kamille:f Lavendel:m
        Efeu:m Palme:f
    """,
        "gem": """
        Gold:n Silber:n Kupfer:n Eisen:n Stahl:m Bronze:f Messing:n Zinn:n Zink:n
        Platin:n Kristall:m Quarz:m Amethyst:m Achat:m Bernstein:m Perle:f Jade:f Opal:m
        Obsidian:m Marmor:m Granit:m Kalkstein:m Basalt:m Feuerstein:m Meteorit:m Erz:n
        Edelstein:m Barren:m Glimmer:m Flussspat:m Kalzit:m Malachit:m Granat:m
        Schwefel:m Elfenbein:n Nugget:n Graphit:n Quecksilber:n Gips:m Ader:f Olivin:m
        Turmalin:m Rubin:m Saphir:m Smaragd:m Topas:m Zirkon:m Pyrit:m Magnetit:m
        Hämatit:m Zinnober:m Bleiglanz:m Talk:m Wismut:n
    """,
        "concept": """
        Freiheit:f Frieden:m Wahrheit:f Weisheit:f Erinnerung:f Fantasie:f Erzählung:f
        Gedicht:n Skizze:f Grammatik:f Logik:f Physik:f Chemie:f Biologie:f
        Philosophie:f Mathematik:f Geometrie:f Algebra:f Geschichte:f Mythos:m Legende:f
        Fabel:f Sprichwort:n Rätsel:n Geheimnis:n Versprechen:n Reise:f Abenteuer:n
        Überfahrt:f Entdeckung:f Versuch:m Frage:f Antwort:f Debatte:f Rat:m Fest:n
        Dimension:f Harmonie:f Ritus:m Brauch:m Kultur:f Sprache:f Alphabet:n Chiffre:f
        Archiv:n Kalender:m Horizont:m Ahnung:f Vernunft:f Urteil:n Lehre:f Lehrsatz:m
        Axiom:n Hypothese:f Paradox:n Dilemma:n Vorbild:n Prämisse:f Ableitung:f
        Analogie:f Metapher:f Sinnbild:n Chronik:f Zeugnis:n Manifest:n Vertrag:m
        Bündnis:n Abstammung:f Erbe:n Zeremonie:f Schwelle:f
    """,
        "myth": """
        Drache:m Phönix:m Einhorn:n Meerjungfrau:f Fee:f Kobold:m Elf:m Zwerg:m Troll:m
        Oger:m Riese:m Chimäre:f Hydra:f Greif:m Zentaur:m Minotaurus:m Sphinx:f
        Pegasus:m Krake_Sage:m Basilisk:m Golem:m Vampir:m Werwolf:m Gespenst:n Geist:m
        Seele:f Dämon:m Engel:m Göttin:f Gott:m Zauber:m Fluch:m Weissagung:f Orakel:n
        Amulett:n Talisman:m Rune:f Pforte:f Heiligtum:n Götze:m Totem:n Nymphe:f
        Najade:f Dryade:f Walküre:f Muse:f Hexer:m Hexe:f Nekromant:m Alchemist:m
        Weiser:m Vorzeichen:n Omen:n Bestiarium:n
    """,
        "job": """
        Ritter:m Jäger:m Dieb:m Pirat:m Matrose:m Kapitän:m Koch:m Gärtner:m Schmied:m
        Detektiv:m Dichter:m Maler:m Tänzer:m Clown:m Reisender:m Pilger:m Mönch:m
        Bogenschütze:m Fechter:m Krieger:m General:m Soldat:m Wache:f Pförtner:m König:m
        Königin:f Prinz:m Prinzessin:f Kaiser:m Butler:m Magd:f Diener:m Händler:m
        Bauer:m Fischer:m Hirte:m Holzfäller:m Fährmann:m Kutscher:m Pilot:m Ingenieur:m
        Briefträger:m Bote:m Kehrer:m Polizist:m Arzt:m Pfleger:m Apotheker:m Tierarzt:m
        Lehrer:m Schüler:m Bibliothekar:m Reporter:m Lektor:m Übersetzer:m Sänger:m
        Schauspieler:m Regisseur:m Musiker:m Bergmann:m Tischler:m Töpfer:m Schneider:m
        Wahrsager:m Prophet:m Priester:m Gelehrter:m Doktor:m Erfinder:m Forscher:m
        Sportler:m Akrobat:m Bildhauer:m Uhrmacher:m Bäcker:m Brauer:m Gerber:m Weber:m
    """,
        "music": """
        Klavier:n Gitarre:f Trommel:f Glocke:f Harfe:f Lied:n Tanz:m Rhythmus:m
        Melodie:f Akkord:m Flöte:f Trompete:f Saxofon:n Klarinette:f Oboe:f Cello:n
        Bratsche:f Geige:f Becken:n Tamburin:n Xylofon:n Orgel:f Akkordeon:n Laute:f
        Mandoline:f Banjo:n Partitur:f Note:f Pause:f Tonleiter:f Chor:m Solo:n
        Konzert:n Bühne:f Sinfonie:f Sonate:f Walzer:m Ballade:f Wiegenlied:n Marsch:m
        Vorspiel:n Klangfarbe:f Takt:m Orchester:n Satz:m Ouvertüre:f Fuge:f Etüde:f
        Nachtstück:n Ständchen:n Rhapsodie:f Hymne:f Requiem:n Kantate:f Arie:f Duett:n
        Trio:n Quartett:n Quintett:n Dirigent:m Oktave:f Halbton:m Notenlinie:f
        Metronom:n Pedal:n Saite:f Mundstück:n
    """,
        "place": """
        Markt:m Platz:m Stadt:f Dorf:n Gasse:f Brücke:f Garten:m Bücherei:f Museum:n
        Theater:n Schule:f Park:m Hafen:m Kai:m Bahnhof:m Flughafen:m Leuchtturm:m
        Burg:f Mauer:f Palast:m Tempel:m Turm:m Speicher:m Keller:m Terrasse:f Hof:m
        Veranda:f Gewächshaus:n Scheune:f Hütte:f Spielplatz:m Turnhalle:f Schwimmbad:n
        Aquarium:n Galerie:f Zoo:m Badehaus:n Rathaus:n Postamt:n Krankenhaus:n
        Apotheke:f Buchladen:m Bäckerei:f Café:n Gasthaus:n Küche:f Schlafzimmer:n
        Wohnzimmer:n Flur:m Treppe:f Tunnel:m Steg:m Kreuzung:f Allee:f Festung:f
        Bauernhof:m Obstgarten:m Abtei:f Kreuzgang:m Bastion:f Warte:f Graben:m Werft:f
        Lager:n Villa:f Landhaus:n Weiler:m
    """,
        "food": """
        Reis:m Brot:n Nudel:f Suppe:f Eintopf:m Salat:m Salz:n Zucker:m Pfeffer:m
        Knoblauch:m Zwiebel:f Kartoffel:f Karotte:f Gurke:f Kürbis:m Kohl:m Spinat:m
        Pilz:m Ei:n Käse:m Butter:f Joghurt:m Apfel:m Erdbeere:f Traube:f Melone:f
        Pfirsich:m Orange:f Zitrone:f Banane:f Mango:f Kirsche:f Ananas:f Schokolade:f
        Bonbon:n Keks:m Kuchen:m Pudding:m Donut:m Waffel:f Pfannkuchen:m Hamburger:m
        Pizza:f Nudelgericht:n Curry:n Omelett:n Brezel:f Brötchen:n Semmel:f Strudel:m
        Torte:f Wurst:f Schinken:m Speck:m Salami:f Frikadelle:f Schnitzel:n Braten:m
        Marmelade:f Honig:m Sahne:f Quark:m Klöße:m Knödel:m
    """,
        "sport": """
        Fußball:m Baseball:m Basketball:m Volleyball:m Tischtennis:n Tennis:n
        Federball:m Golf:n Kegeln:n Billard:n Schwimmen:n Marathon:m Turnen:n Karate:n
        Judo:n Fechten:n Ringen:n Boxen:n Schießen:n Reiten:n Rudern:n Surfen:n
        Skifahren:n Hockey:n Rugby:n Kricket:n Radsport:m Klettern:n Schläger:m Tor:n
        Medaille:f Pokal:m Meister:m Endspiel:n Vorrunde:f Training:n Polo:n Eislauf:m
        Tauchen:n Dart:m Hürde:f Speer:m Diskus:m Staffel:f Anzeigetafel:f Helm:m Foul:n
        Gewichtheben:n Schlitten:m Aufschlag:m Sprung:m Lauf:m Ziel:n Podest:n
        Umkleide:f Tribüne:f Anhänger:m
    """,
        "vehicle": """
        Fahrrad:n Zug:m Boot:n Auto:n Bus:m Taxi:n Lastwagen:m Motorrad:n Roller:m
        Flugzeug:n Hubschrauber:m Raumschiff:n Rakete:f Unterseeboot:n Jacht:f
        Frachter:m Segler:m Floß:n Kriegsschiff:n Panzer:m Kutsche:f Karren:m
        Schubkarre:f Traktor:m Bagger:m Krankenwagen:m Seilbahn:f Straßenbahn:f
        Lokomotive:f Kanu:n Kajak:n Luftschiff:n Fallschirm:m Sänfte:f Dreirad:n
        Lieferwagen:m Limousine:f Schneepflug:m Katamaran:m Eisbrecher:m Tanker:m
        Lastkahn:m Fischkutter:m Doppeldecker:m Sonde:f Fähre:f Pistenraupe:f Einrad:n
        Schlepper:m Gondel:f Waggon:m
    """,
        "product": """
        Rechner:m Tastatur:f Maus:f Bildschirm:m Drucker:m Lautsprecher:m Kopfhörer:m
        Mikrofon:n Drohne:f Tablet:n Handy:n Ladegerät:n Batterie:f Kühlschrank:m
        Staubsauger:m Ventilator:m Ofen:m Wasserfilter:m Reiskocher:m Mikrowelle:f
        Backofen:m Mixer:m Rasierer:m Zahnbürste:f Zahnpasta:f Seife:f Shampoo:n
        Parfüm:n Armbanduhr:f Beamer:m Router:m Scanner:m Trockner:m Föhn:m Lotion:f
        Sonnencreme:f Hausschuh:m Sandale:f Matratze:f Vorhang:m Türklingel:f
        Thermometer:n Feuerlöscher:m Glühbirne:f Steckdose:f Steckleiste:f Bettdecke:f
        Bezug:m Handtuch:n Waschbecken:n Waschmittel:n Weichspüler:m Pfanne:f
        Schneebesen:m Schäler:m Korkenzieher:m Thermoskanne:f Fußmatte:f Kleiderbügel:m
        Schrank:m Regal:n Nachttisch:m
    """,
        "color": """
        Karmesin:n Scharlach:n Zinnoberrot:n Purpur:n Magenta:n Fuchsia:n Rosa:n Lachs:n
        Orange_Farbe:n Ocker:n Siena:n Sepia:n Senfgelb:n Olivgrün:n Limone:f
        Smaragdgrün:n Türkis:n Zyan:n Himmelblau:n Indigo:n Flieder:n Malve:f Veilchen:n
        Weinrot:n Rost:m Terrakotta:n Creme:f Beige:n Khaki:n Anthrazit:n Zinngrau:n
        Ebenholz:n Rabenschwarz:n Azurblau:n Safrangelb:n Aquamarin:n Grünspan:m
        Perlmutt:n Kupferrot:n Goldgelb:n Silbergrau:n Bronzeton:m Aschgrau:n
        Rauchgrau:n Sandton:m Weizengelb:n Zimtbraun:n Muskatbraun:n Paprikarot:n
        Nachtblau:n Moosgrün:n Tannengrün:n Schneeweiß:n
    """,
        "finance": """
        Rechnung:f Quittung:f Anleihe:f Aktie:f Dividende:f Zins:m Darlehen:n Hypothek:f
        Einlage:f Ersparnis:f Konto:n Saldo:m Haushalt:m Prüfung:f Vermögen:n
        Schuldposten:m Kapital:n Ertrag:m Gewinn:m Spanne:f Überschuss:m Fehlbetrag:m
        Schuld:f Kredit:m Lastschrift:f Scheck:m Münze:f Währung:f Rendite:f Depot:n
        Zoll:m Erstattung:f Prämie:f Rente:f Lohnliste:f Gehalt:n Lohn:m Bonus:m
        Provision:f Lizenzgebühr:f Franchise:f Fusion:f Übernahme:f Rettung:f
        Sicherheit:f Gutschein:m Barren_Gold:m Tresor:m Staatskasse:f Überweisung:f
        Abrechnung:f Arbitrage:f Kontoauszug:m Sparbuch:n Verwahrung:f Gläubiger:m
        Schuldner:m Verleiher:m Bürge:m Bewertung:f Schätzung:f Inflation:f Rezession:f
        Liquidität:f Konkurs:m Spende:f Zuschuss:m Ausgabe:f Rabatt:m Rate:f
    """,
        "tech": """
        Server:m Puffer:m Bildpunkt:m Codec:m Paket:n Protokoll:n Stapel:m Halde:f
        Zeiger:m Firmware:f Bandbreite:f Latenz:f Torweg:m Brandmauer:f Teilnetz:n
        Rechnername:m Nutzlast:f Prüfsumme:f Schema:n Sicherung:f Verbund:m Splitter:m
        Abbild:n Behälter:m Sandkasten:m Fließband:n Ablage:f Fehlersucher:m Makro:n
        Feld:n Matrix:f Ganzzahl:f Syntax:f Zerteiler:m Assembler:m Befehl:m Bitrate:f
        Durchsatz:m Handschlag:m Namensraum:m Vermittler:m Endpunkt:m Streuwert:m
        Darstellung:f Schattierer:m Textur:f Vieleck:n Gitternetz:n Oktett:n Wegewahl:f
        Vermittlung:f Rundruf:m Datagramm:n Startlader:m Dateisystem:n Partition:f
        Verzeichnis:n Prüfpunkt:m Rückrollung:f Umzug:m
    """,
        "weather": """
        Wolke:f Wind:m Regen:m Schnee:m Reif:m Nebel:m Tau:m Regenbogen:m Blitz:m
        Donner:m Schauer:m Monsun:m Taifun:m Wirbelwind:m Schneesturm:m Nieselregen:m
        Hagel:m Graupel:m Sturm:m Bö:f Zyklon:m Gewitter:n Unwetter:n Sintflut:f Dunst:m
        Schwaden:m Feuchte:f Vorhersage:f Bewölkung:f Sonnenschein:m Hitzewelle:f
        Frost:m Tauwetter:n Windstoß:m Brise:f Zephir:m Passat:m Fallwind:m Hochdruck:m
        Tiefdruck:m Klima:n Temperatur:f Luftdruck:m Wolkenbruch:m Schwüle:f Raureif:m
        Morgentau:m Abendrot:n Wetter:n
    """,
        "space": """
        Stern:m Mond:m Sonne:f Galaxie:f Komet:m Meteor:m Polarlicht:n Mondsichel:f
        Sternenstaub:m Milchstraße:f Finsternis:f Weltall:n Planet:m Trabant:m
        Kleinplanet:m Nebel_Stern:m Sternhaufen:m Sternbild:n Umlaufbahn:f Schwerkraft:f
        Drehung:f Umlauf:m Sonnenfleck:m Krater:m Lichtjahr:n Gestirn:n Firmament:n
        Ekliptik:f Meridian:m Stratosphäre:f Lufthülle:f Leere:f Vollmond:m Neumond:m
        Halbmond:m Mondlicht:n Sternenlicht:n Polarstern:m Abendstern:m Morgenstern:m
        Mars:m Venus:f Jupiter:m Saturn:m Merkur:m Uranus:m Neptun:m Pluto:m Supernova:f
        Weltraum:m
    """,
        "time": """
        Morgengrauen:n Morgenröte:f Dämmerung:f Einbruch:m Sonnenwende:f Jahreszeit:f
        Augenblick:m Ewigkeit:f Zukunft:f Nu:n Jahrhundert:n Jahrzehnt:n Morgen:m
        Mittag:m Nachmittag:m Abend:m Nacht:f Mitternacht:f Frühe:f Vorabend:m Gestern:n
        Heute:n Tageslauf:m Woche:f Monat:m Vierteljahr:n Halbjahr:n Jahr:n
        Jahrtausend:n Epoche:f Ära:f Zeitalter:n Frühling:m Sommer:m Herbst:m Winter:m
        Vorzeit:f Jetzt:n Kindheit:f Jugend:f Reife:f Alter:n Frist:f Zeitraum:m Dauer:f
        Zeitspanne:f Jahrestag:m Gedenktag:m Saison:f Tagesanbruch:m
    """,
        "emotion": """
        Freude:f Trauer:f Zorn:m Furcht:f Überraschung:f Frohsinn:m Jubel:m Glück:n
        Rausch:m Verzückung:f Trost:m Hoffnung:f Verzweiflung:f Kummer:m Schwermut:f
        Wehmut:f Einsamkeit:f Sehnsucht:f Verlangen:n Leidenschaft:f Zuneigung:f
        Zärtlichkeit:f Wärme:f Güte:f Mitgefühl:n Einfühlung:f Mitleid:n Dankbarkeit:f
        Demut:f Geduld:f Klugheit:f Mäßigung:f Redlichkeit:f Staunen:n Ehrfurcht:f
        Gelassenheit:f Ruhe:f Stille:f Vertrauen:n Zweifel:m Verdacht:m Sorge:f Angst:f
        Schrecken:m Panik:f Wut:f Ärger:m Verdruss:m Langeweile:f Begeisterung:f Eifer:m
        Inbrunst:f Gefühl:n Illusion:f Mut:m Scham:f Stolz:m Neid:m Eifersucht:f Gier:f
        Laune:f
    """,
        "body": """
        Kopf:m Stirn:f Braue:f Wimper:f Lid:n Nase:f Wange:f Kinn:n Kiefer:m Lippe:f
        Zunge:f Zahn:m Zahnfleisch:n Ohr:n Ohrläppchen:n Hals:m Nacken:m Schulter:f
        Ellbogen:m Handgelenk:n Handfläche:f Knöchel:m Finger:m Daumen:m Fingernagel:m
        Faust:f Brust:f Rippe:f Bauch:m Nabel:m Rücken:m Taille:f Hüfte:f Schenkel:m
        Knie:n Schienbein:n Wade:f Fessel:f Ferse:f Zehe:f Knochen:m Schädel:m Muskel:m
        Sehne:f Gelenk:n Knorpel:m Herz:n Lunge:f Leber:f Magen:m Niere:f Milz:f Darm:m
        Blase:f Gehirn:n Nerv:m Vene:f Arterie:f Blut:n Fleisch:n Haut:f Pore:f Haar:n
        Bart:m Träne:f Schweiß:m Speichel:m Atem:m Puls:m Herzschlag:m Kniescheibe:f
        Jochbein:n Trommelfell:n Augapfel:m Falte:f Grübchen:n Narbe:f Bluterguss:m
        Blase_Haut:f Schwiele:f
    """,
        "clothing": """
        Hut:m Schuh:m Handschuh:m Schal:m Brille:f Mantel:m Jacke:f Hemd:n Bluse:f
        Kittel:m Hose:f Jeans:f Rock:m Kleid:n Weste:f Strickjacke:f Pullover:m
        Kapuzenpulli:m Socke:f Strumpf:m Unterwäsche:f Schlafanzug:m Schürze:f
        Kopftuch:n Krawatte:f Gürtel:m Schärpe:f Stiefel:m Turnschuh:m Pantoffel:m
        Uniform:f Kostüm:n Robe:f Umhang:m Poncho:m Regenmantel:m Anorak:m Parka:m
        Badeanzug:m Taucheranzug:m Overall:m Ärmel:m Kragen:m Manschette:f Saum:m
        Futter:n Stoff:m Leinen:n Seide:f Baumwolle:f Wolle:f Samt:m Kord:m Flanell:m
        Leder:n Barett:n Mütze:f Kappe:f Helm_Kleid:m Turban:m Schleier:m Tuch:n
    """,
        "tool": """
        Axt:f Schaufel:f Säge:f Leiter:f Zange:f Meißel:m Amboss:m Blasebalg:m Ahle:f
        Klemme:f Schraubstock:m Wasserwaage:f Messschieber:m Winkelmesser:m Lineal:n
        Schere:f Hammer:m Holzhammer:m Bohrer:m Schmirgel:m Hobel:m Spitzhacke:f
        Sichel:f Sense:f Hacke:f Pflug:m Rechen:m Lötkolben:m Schleifer:m Maßband:n
        Zirkel:m Beil:n Brecheisen:n Hebel:m Keil:m Flaschenzug:m Kurbel:f Kelle:f
        Wetzstein:m Feile:f Reibe:f Sieb:n Spaten:m Egge:f Dreschflegel:m Spindel:f
        Spule:f Griff:m Klinge:f Niete:f Stichsäge:f Bandsäge:f Drehbank:f Kettensäge:f
        Handsäge:f Hohleisen:n Reißnadel:f Winkel:m Fase:f Werkbank:f
    """,
        "drink": """
        Kaffee:m Tee:m Saft:m Milch:f Wasser:n Limonade:f Apfelwein:m Kakao:m Punsch:m
        Aufguss:m Kamillentee:m Kräutertee:m Milchkaffee:m Cappuccino:m Espresso:m
        Bier:n Pils:n Weizenbier:n Schwarzbier:n Wein:m Rotwein:m Weißwein:m Roséwein:m
        Sekt:m Champagner:m Sherry:m Portwein:m Wermut:m Likör:m Schnaps:m Obstler:m
        Rum:m Gin:m Wodka:m Whisky:m Weinbrand:m Tequila:m Sake:m Met:m Cocktail:m
        Nektar:m Sirup:m Sprudel:m Tonic:n Eistee:m Molke:f Buttermilch:f Kefir:m
        Smoothie:m Milchshake:m Zuckerwasser:n Eiswasser:n Heißgetränk:n
    """,
    }
)

DE = WordLanguageData(
    joiner=" ",
    capitalize=False,
    adjectives=words("""
        blau grün rot schwarz weiß gelb golden silbern dunkel_hell hell glänzend groß
        klein lang kurz breit schmal hoch_gross niedrig schnell langsam stark schwach
        hart weich warm kalt lauwarm trocken feucht sauber neu alt jung schön hässlich
        süß bitter salzig scharf sauer sanft rau leicht schwer rund spitz tief fern nah
        reich arm selten ruhig laut tapfer weise fröhlich traurig frei ewig durchsichtig
        einsam strahlend wild heiter still uralt modern endlos hohl seidig neblig wolkig
        regnerisch sonnig schneeig windig rostig neugierig schelmisch edel bescheiden
        freundlich wild_wild flink stachelig ruhelos kräftig verworren lebhaft zart grau
        blass innig eisig glühend düster leuchtend erhaben schlicht zierlich drollig
        schlau kühn faul wach glatt dicht knapp
    """),
    actions=words("""
        schlafend rennend fliegend schwimmend singend tanzend lachend weinend gehend
        stehend sitzend liegend essend trinkend lesend schreibend malend lernend wartend
        suchend rufend hörend sehend träumend wachend versteckt jagend fangend werfend
        ziehend schiebend öffnend schließend bauend pflanzend erntend kochend backend
        webend nähend rudernd fahrend kletternd rollend treibend fließend brennend
        schmelzend blühend welkend fallend wandernd flüsternd leuchtend blinkend
        schwebend wiegend kreisend schleichend hüpfend springend schnaufend gähnend
        streckend grübelnd staunend zögernd jubelnd grüßend umarmend streichelnd
        tröstend weckend reisend fliehend landend spähend lauschend zählend messend
        schmiedend schnitzend polierend gießend schneidend hackend faltend wickelnd
        siegelnd klingend summend
    """),
    nouns=_POOLS,
    noun_gender=_GENDER,
    # German declines the modifier in front of the noun, and the base form is the
    # bare stem: `blau` becomes `blauer Wal`, `blaue Katze`, `blaues Haus`.
    agreement={
        "m": (("e", "er"), ("", "er")),
        "f": (("e", "e"), ("", "e")),
        "n": (("e", "es"), ("", "es")),
    },
    # German puts the modifier in front of the noun, so the noun is drawn ahead of
    # its turn. Its nouns are written capitalised, the way German writes them.
    frames=(
        WordFrame(("noun",), 12),
        WordFrame(("adjective", "noun"), 50),
        WordFrame(("action", "noun"), 38),
    ),
    syn=SyllableSynthesis(
        onset=words(
            "b d f g h k l m n p r s t w z bl br dr fl fr gl gr kl kn kr pf schl schm schn schr schw sp st tr"
        ),
        vowel=words("a e e i i o u au ei ie eu ä ö ü"),
        coda=("", *words("n m r l s t ch ng nd st rt lt")),
        min_syllables=2,
        max_syllables=2,
    ),
)
