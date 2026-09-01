"""Append a random token to a string, or to every string in a list."""

from typing import overload

from randino.affix._attach import attach
from randino.affix.data import AFFIX_LENGTH_DEFAULT, AFFIX_SEPARATOR_DEFAULT


@overload
def rand_suffix(
    value: str,
    *,
    length: int = ...,
    separator: str = ...,
    charset: str = ...,
) -> str: ...


@overload
def rand_suffix(
    value: list[str],
    *,
    length: int = ...,
    separator: str = ...,
    charset: str = ...,
) -> list[str]: ...


def rand_suffix(
    value: str | list[str],
    *,
    length: int = AFFIX_LENGTH_DEFAULT,
    separator: str = AFFIX_SEPARATOR_DEFAULT,
    charset: str = "",
) -> str | list[str]:
    """Append a random token, so that two people asking at the same moment differ.

    A list gets a fresh token per entry rather than one for the batch, which is
    what a generator's output is usually passed here for.

    Args:
        value: The string, or the list of strings, to append to.
        length: Characters in the token. Clamped to `1..32`.
        separator: Placed between the value and the token.
        charset: Characters the token is drawn from. Defaults to alphanumerics
            without `0O1lI`, the pairs that are easy to misread.

    Returns:
        A string when `value` is a string, a list when it is a list.

    Example:
        >>> rand_suffix("멋진사자")
        '멋진사자_nVtRC'
        >>> rand_suffix(rand_nickname(language="ko", count=2))
        ['오래된곰_AVcCV', '영원한도마뱀_RUKAP']
    """
    return attach(value, length, separator, charset, lambda item, token, sep: item + sep + token)
