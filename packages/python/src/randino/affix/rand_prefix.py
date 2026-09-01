"""Prepend a random token to a string, or to every string in a list."""

from typing import overload

from randino.affix._attach import attach
from randino.affix.data import AFFIX_LENGTH_DEFAULT, AFFIX_SEPARATOR_DEFAULT


@overload
def rand_prefix(
    value: str,
    *,
    length: int = ...,
    separator: str = ...,
    charset: str = ...,
) -> str: ...


@overload
def rand_prefix(
    value: list[str],
    *,
    length: int = ...,
    separator: str = ...,
    charset: str = ...,
) -> list[str]: ...


def rand_prefix(
    value: str | list[str],
    *,
    length: int = AFFIX_LENGTH_DEFAULT,
    separator: str = AFFIX_SEPARATOR_DEFAULT,
    charset: str = "",
) -> str | list[str]:
    """Prepend a random token — the mirror of `rand_suffix`.

    For the places where the distinguishing part belongs in front: a shard, a
    tenant, a key that is sortable by nothing.

    Args:
        value: The string, or the list of strings, to prepend to.
        length: Characters in the token. Clamped to `1..32`.
        separator: Placed between the token and the value.
        charset: Characters the token is drawn from. Defaults to alphanumerics
            without `0O1lI`, the pairs that are easy to misread.

    Returns:
        A string when `value` is a string, a list when it is a list.

    Example:
        >>> rand_prefix("멋진사자")
        'nVtRC_멋진사자'
        >>> rand_prefix("order", length=4, separator="-")
        'k3Rm-order'
    """
    return attach(value, length, separator, charset, lambda item, token, sep: token + sep + item)
