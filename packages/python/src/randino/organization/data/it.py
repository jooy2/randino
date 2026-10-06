"""Italian organizations: the stems, the words for a business and the shapes."""

from randino._internal.parse import words
from randino.organization.data._types import (
    OrganizationLanguageData,
    SyllableOrganizationSynthesis,
)

IT = OrganizationLanguageData(
    stems=words("""
        Valfiorita Colleverde Pratobello Borgoalto Fontechiara Poggio_Alto Rivabella
        Montelieto Valserena Castelluce Roccabella Bosco_Alto Valdirose Collesole
        Fiumebianco Prato_Fiorito Borgo_Sereno Lago_Chiaro Casalverde Vallerosa Pietraluce
        Sorgentina Valgioiosa Rocca_Serena Monterosso_Alto Campofiorito Torrelunga
        Selvachiara Pianverde Rivachiara Castelvento Poggiolieto Colle_Ameno Fontebella
        Valdisole Borgofiorito Montesereno Prato_Lungo Querceto Olmeda
    """),
    syn=SyllableOrganizationSynthesis(
        onset=words("b c d f g l m n p r s t v br tr gr st ch"),
        vowel=words("a e i o u a o ia io"),
        coda=("", "", "", "", *words("n l r")),
        min_syllables=2,
        max_syllables=3,
    ),
    industries={
        "tech": words("Tecnologie Sistemi Informatica Elettronica Software Reti"),
        "manufacturing": words(
            "Industrie Officine_Meccaniche Meccanica Chimica Metallurgica Plastica"
        ),
        "food": words("Alimentari Pastificio Caseificio Conserve Forno Oleificio"),
        "retail": words("Commerciale Distribuzione Magazzini Forniture Ingrosso"),
        "finance": words("Finanziaria Investimenti Capitali Assicurazioni Gestioni_Patrimoniali"),
        "construction": words("Costruzioni Edilizia Immobiliare Impresa_Edile Restauri"),
        "logistics": words("Trasporti Logistica Spedizioni Autotrasporti Traslochi"),
        "media": words("Edizioni Comunicazione Produzioni Media Pubblicità Studio"),
        "health": words("Farmaceutica Laboratori Biotecnologie Medicale Sanità Ortopedia"),
        "energy": words("Energia Energie_Rinnovabili Energia_Solare Elettrica Eolica Combustibili"),
    },
    generic=words("Gruppo"),
    templates={
        "company": ("{industry} {stem}",),
        "nonprofit": (
            "Fondazione {stem}",
            "Associazione {stem}",
            "Associazione Culturale {stem}",
            "Associazione Sportiva {stem}",
            "Pro Loco {stem}",
            "Circolo {stem}",
            "Croce Verde {stem}",
        ),
        "school": (
            "Scuola dell'Infanzia {stem}",
            "Scuola Primaria {stem}",
            "Istituto Comprensivo {stem}",
            "Liceo Scientifico {stem}",
            "Liceo Classico {stem}",
            "Istituto Tecnico {stem}",
            "Università di {stem}",
        ),
        "government": (
            "Comune di {stem}",
            "Questura di {stem}",
            "Prefettura di {stem}",
            "Tribunale di {stem}",
            "Polizia Locale di {stem}",
            "Stazione Carabinieri di {stem}",
        ),
        "public": (
            "Biblioteca Comunale di {stem}",
            "Ospedale Civile di {stem}",
            "Museo Civico di {stem}",
            "Teatro Comunale di {stem}",
            "Centro Sportivo Comunale di {stem}",
            "Azienda Sanitaria di {stem}",
        ),
    },
    legal_forms=(
        "{name} S.r.l.",
        "{name} S.p.A.",
        "{name} S.n.c.",
        "{name} S.a.s.",
    ),
)
