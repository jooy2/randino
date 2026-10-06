"""German organizations: the stems, the words for a business and the shapes."""

from randino._internal.parse import words
from randino.organization.data._types import (
    OrganizationLanguageData,
    SyllableOrganizationSynthesis,
)

DE = OrganizationLanguageData(
    stems=words("""
        Lindenhof Bergtal Sonnenberg Eichenwald Rosenau Birkenfeld Tannenhof Waldeck
        Lindenberg Falkenstein Adlerhorst Nordlicht Buchenau Erlenbach Fichtenau Haselbach
        Lerchenfeld Mühlental Quellental Rabenstein Silbertal Ulmenhof Weidenau Wiesental
        Ahornfeld Brunnental Felsenau Hainbach Kieselbach Morgenrot Sternfeld Eschenhain
        Talwiese Rotbuche Kranichsee Moosgrund Bachwiese Hochfeld Grünau Ostheide
    """),
    syn=SyllableOrganizationSynthesis(
        onset=words("b br d f g h k kl l m n r s sch st t w"),
        vowel=words("a e i o u a e ei au ie"),
        coda=("", *words("n r l rt nd ck ng ld")),
        min_syllables=2,
        max_syllables=2,
    ),
    industries={
        "tech": words("Software Systemtechnik Elektronik Informatik Digital Netzwerke"),
        "manufacturing": words(
            "Maschinenbau Metallbau Präzisionstechnik Chemie Werkzeugbau Kunststofftechnik"
        ),
        "food": words("Lebensmittel Backwaren Feinkost Molkerei Brauerei Mühle"),
        "retail": words("Handel Handelshaus Großhandel Versand Warenhaus"),
        "finance": words("Finanz Vermögensverwaltung Beteiligungen Versicherungsmakler Capital"),
        "construction": words("Bau Hochbau Tiefbau Immobilien Bauträger Architekten"),
        "logistics": words("Logistik Spedition Transporte Kurierdienst Umzüge"),
        "media": words("Medien Verlag Werbeagentur Filmproduktion Kommunikation"),
        "health": words("Pharma Medizintechnik Biotech Labor Gesundheit"),
        "energy": words("Energie Solartechnik Windkraft Energietechnik Gas"),
    },
    generic=words("Gruppe Holding International"),
    templates={
        "company": ("{stem} {industry}",),
        "nonprofit": (
            "Stiftung {stem}",
            "Bürgerstiftung {stem}",
            "Förderverein {stem} e.V.",
            "Heimatverein {stem} e.V.",
            "Kunstverein {stem} e.V.",
            "Sportverein {stem} e.V.",
            "Freundeskreis {stem} e.V.",
        ),
        "school": (
            "Kindergarten {stem}",
            "Grundschule {stem}",
            "Realschule {stem}",
            "Gymnasium {stem}",
            "Gesamtschule {stem}",
            "Berufsschule {stem}",
            "Hochschule {stem}",
            "Universität {stem}",
        ),
        "government": (
            "Stadtverwaltung {stem}",
            "Gemeindeverwaltung {stem}",
            "Bürgeramt {stem}",
            "Polizeiinspektion {stem}",
            "Freiwillige Feuerwehr {stem}",
            "Finanzamt {stem}",
            "Amtsgericht {stem}",
        ),
        "public": (
            "Stadtbibliothek {stem}",
            "Klinikum {stem}",
            "Kreiskrankenhaus {stem}",
            "Stadtwerke {stem}",
            "Heimatmuseum {stem}",
            "Volkshochschule {stem}",
            "Verkehrsbetriebe {stem}",
        ),
    },
    legal_forms=(
        "{name} GmbH",
        "{name} AG",
        "{name} GmbH & Co. KG",
        "{name} KG",
        "{name} UG (haftungsbeschränkt)",
    ),
)
