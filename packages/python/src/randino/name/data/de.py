# Generated from `data/name/de.yaml` by `tools/codegen`.
# Edit that file and re-run the generator; edits here are overwritten.
"""German name pools."""

from randino._internal.parse import words
from randino.name.data._types import NameLanguageData, NameLengthSpec
from randino.name.data.syllables import GERMAN_SYLLABLES

DE = NameLanguageData(
    order="given-first",
    joiner=" ",
    has_middle=True,
    roman="fold",
    length_spec=NameLengthSpec(given=(5, 10), last=(5, 8), middle=(5, 9)),
    last=words("""
        Müller Schmidt Schneider Fischer Weber Meyer Wagner Becker Schulz Hoffmann
        Schäfer Koch Bauer Richter Klein Wolf Schröder Neumann Schwarz Zimmermann Braun
        Krüger Hofmann Hartmann Lange Werner Krause Lehmann Köhler Herrmann Schmitz
        Walter Meier König Mayer Huber Kaiser Fuchs Peters Scholz Möller Jung Hahn Vogel
        Roth Berger
    """),
    male=words("""
        Lukas Leon Finn Paul Jonas Elias Ben Noah Luis Felix Maximilian Julian Moritz
        David Tim Jan Niklas Philipp Sebastian Alexander Michael Thomas Andreas Stefan
        Martin Florian Matthias Daniel Christian Markus Emil Anton Theo Oskar Jakob
        Johannes Friedrich Wilhelm Heinrich Georg Konrad Ludwig Karl Otto Joachim Fabian
        Linus Erik
    """),
    female=words("""
        Mia Emma Hannah Emilia Sofia Lena Lea Marie Anna Laura Julia Sarah Lisa
        Katharina Johanna Charlotte Clara Amelie Leonie Frida Greta Ida Melina Nele
        Paula Sophie Antonia Helena Nora Maria Luisa Mathilda Theresa Elisabeth Ingrid
        Ursula Gisela Renate Monika Petra Brigitte Christa Sabine Claudia Stefanie
        Franziska Magdalena Annika
    """),
    syn=GERMAN_SYLLABLES,
)
