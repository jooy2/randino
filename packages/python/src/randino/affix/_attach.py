"""Shared by `rand_suffix` and `rand_prefix`."""

import math
from collections.abc import Callable

from randino._internal.utils import clamp, rand_token
from randino.affix.data import AFFIX_CHARSET, AFFIX_LENGTH_MAX


def attach(
    value: str | list[str],
    length: int,
    separator: str,
    charset: str,
    join: Callable[[str, str, str], str],
) -> str | list[str]:
    """Attach a freshly drawn token to one string, or to every string in a list.

    One token each rather than one for the batch, which is the whole point of
    passing a generator's output here. `join` is what decides the side it lands
    on.

    Args:
        value: The string, or the list of strings, to attach to.
        length: Characters in the token, clamped to `1..AFFIX_LENGTH_MAX`.
        separator: Placed between the value and the token.
        charset: Characters the token is drawn from; empty means the default.
        join: Given `(value, token, separator)`, returns the finished string.

    Returns:
        A string when `value` is a string, a list when it is a list.
    """
    size = clamp(math.floor(length), 1, AFFIX_LENGTH_MAX)
    alphabet = charset or AFFIX_CHARSET

    def one(item: str) -> str:
        return join(item, rand_token(size, alphabet), separator)

    if isinstance(value, str):
        return one(value)

    return [one(item) for item in value]
