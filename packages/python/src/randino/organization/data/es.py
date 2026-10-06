"""Spanish organizations: the stems, the words for a business and the shapes."""

from randino._internal.parse import words
from randino.organization.data._types import (
    OrganizationLanguageData,
    SyllableOrganizationSynthesis,
)

ES = OrganizationLanguageData(
    stems=words("""
        Valdeolmo Montealegre Peñaverde Robledal Fuentelaguna Riosol Valdecastro Castilnuevo
        Monteluz Prado_Alto Valleluna Arroyoclaro Vistalegre Bellamar Altozano Lomaverde
        Navalsol Peñaluna Villasol Fuentesol Riofresno Valdemora Sierra_Clara Montesol
        Costaluz Miravalle Llanoalto Olivar_Alto Campoclaro Robleda_Alta Torrealba
        Valdesierra Puentelargo Alcornal Encinar_del_Valle Las_Lomas El_Robledo Monteclaro
        Valfrío Rivaluz
    """),
    syn=SyllableOrganizationSynthesis(
        onset=words("b c d f g l m n p r s t v br tr cl pl"),
        vowel=words("a e i o u a o ia io ue"),
        coda=("", "", "", *words("n s l r")),
        min_syllables=2,
        max_syllables=3,
    ),
    industries={
        "tech": words("Tecnologías Sistemas Soluciones_Informáticas Software Electrónica Redes"),
        "manufacturing": words("Industrias Manufacturas Metalúrgica Química Talleres Plásticos"),
        "food": words("Alimentos Conservas Panadería Lácteos Bodegas Frutas"),
        "retail": words("Comercial Distribuciones Almacenes Supermercados Suministros"),
        "finance": words(
            "Inversiones Capital Finanzas Gestión_Patrimonial Seguros Asesores_Financieros"
        ),
        "construction": words(
            "Construcciones Inmobiliaria Promociones Arquitectura Obras_y_Reformas"
        ),
        "logistics": words("Transportes Logística Mudanzas Mensajería Envíos"),
        "media": words("Ediciones Comunicación Producciones Medios Publicidad Estudio"),
        "health": words("Laboratorios Farmacéutica Clínica Biotecnología Salud Ortopedia"),
        "energy": words("Energía Energías_Renovables Energía_Solar Eléctrica Eólica Combustibles"),
    },
    generic=words("Grupo Corporación"),
    templates={
        "company": ("{industry} {stem}",),
        "nonprofit": (
            "Fundación {stem}",
            "Asociación {stem}",
            "Asociación Cultural {stem}",
            "Asociación de Vecinos de {stem}",
            "Club Deportivo {stem}",
            "Banco de Alimentos de {stem}",
            "Peña {stem}",
        ),
        "school": (
            "Escuela Infantil {stem}",
            "Colegio {stem}",
            "Colegio Público {stem}",
            "Instituto {stem}",
            "IES {stem}",
            "Liceo {stem}",
            "Universidad de {stem}",
        ),
        "government": (
            "Ayuntamiento de {stem}",
            "Alcaldía de {stem}",
            "Municipalidad de {stem}",
            "Comisaría de {stem}",
            "Parque de Bomberos de {stem}",
            "Juzgado de Paz de {stem}",
            "Registro Civil de {stem}",
        ),
        "public": (
            "Biblioteca Municipal de {stem}",
            "Hospital de {stem}",
            "Hospital General de {stem}",
            "Museo de {stem}",
            "Centro de Salud {stem}",
            "Centro Cultural {stem}",
            "Polideportivo Municipal de {stem}",
        ),
    },
    legal_forms=(
        "{name}, S.A.",
        "{name}, S.L.",
        "{name}, S.A. de C.V.",
    ),
)
