"""Helpers for the catalogs of real products, written one row per line.

Kept apart from `parse` on purpose: `parse` reaches into the word package for its pool
types, and the catalogs are imported before the word package is, so sharing the module
would have the two import each other half-finished — the reason `date/data` carries a copy
of `words` of its own.
"""


def rows(source: str) -> tuple[tuple[str, ...], ...]:
    """Split a table written one row per line with `|` between the cells.

    For the catalogs of real products whose names carry spaces of their own: `Core
    i7-13700K`, `Galaxy S24 Ultra`, `23H2 (Build 22631)`. Every cell is trimmed, blank
    lines are skipped, and an empty cell stays an empty string so a row keeps its
    columns where they are.
    """
    return tuple(
        tuple(cell.strip() for cell in line.strip().split("|"))
        for line in source.split("\n")
        if line.strip()
    )


def items(cell: str) -> tuple[str, ...]:
    """Split a cell holding a list, `a, b, c`, into its entries. An empty cell is none."""
    return tuple(entry.strip() for entry in cell.split(",") if entry.strip())
