"""Italian name pools."""

from randino._internal.parse import words
from randino.name.data._types import NameLanguageData, NameLengthSpec
from randino.name.data.syllables import ITALIAN_SYLLABLES

IT = NameLanguageData(
    order="given-first",
    joiner=" ",
    has_middle=True,
    roman="fold",
    length_spec=NameLengthSpec(given=(5, 10), last=(5, 8), middle=(5, 9)),
    male=words("""
        Lorenzo Francesco Alessandro Andrea Matteo Leonardo Gabriele Riccardo Tommaso
        Edoardo Federico Davide Giuseppe Antonio Marco Luca Giovanni Stefano Simone Paolo
        Roberto Giorgio Nicola Salvatore Pietro Vincenzo Angelo Emanuele Michele Fabio
        Alessio Daniele Dario Enrico Filippo Gianluca Giacomo Luigi Mattia Maurizio Nicolò
        Pasquale Raffaele Umberto Carlo Claudio Domenico
    """),
    female=words("""
        Sofia Giulia Aurora Alice Ginevra Emma Giorgia Greta Martina Chiara Sara Beatrice
        Anna Francesca Elena Valentina Federica Elisa Alessia Ilaria Silvia Laura Marta
        Gaia Noemi Camilla Bianca Roberta Paola Lucia Antonella Arianna Carlotta Caterina
        Eleonora Emanuela Gabriella Giada Giovanna Ludovica Margherita Michela Nicoletta
        Rossella Serena Stefania Vittoria
    """),
    last=words("""
        Rossi Russo Ferrari Esposito Bianchi Romano Colombo Ricci Marino Greco Bruno Gallo
        Conti De_Luca Costa Giordano Mancini Rizzo Lombardi Moretti Barbieri Fontana
        Santoro Mariani Rinaldi Caruso Ferrara Galli Martini Leone Longo Gentile Vitale
        Lombardo Serra Coppola Marchesi Parisi Villa Conte Farina Testa Grasso Palumbo
        Amato Sartori
    """),
    syn=ITALIAN_SYLLABLES,
)
