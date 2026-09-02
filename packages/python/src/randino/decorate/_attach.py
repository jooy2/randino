"""Shared by `rand_suffix` and `rand_prefix`."""

import math
from collections.abc import Callable

from randino._internal.utils import clamp, rand_token
from randino.decorate.data import AFFIX_CHARSET, AFFIX_LENGTH_MAX


def attach(
    value: str | list[str] | None,
    length: int,
    separator: str,
    charset: str,
    join: Callable[[str, str, str], str],
) -> str | list[str]:
    """Attach a freshly drawn token to one string, or to every string in a list.

    One token each rather than one for the batch, which is the whole point of
    passing a generator's output here. `join` is what decides the side it lands
    on. With no value at all the bare token is the answer, separator and all left
    off — what a decorator attaches is worth having on its own.

    Args:
        value: The string, the list of strings, or None for the token alone.
        length: Characters in the token, clamped to `1..AFFIX_LENGTH_MAX`.
        separator: Placed between the value and the token.
        charset: Characters the token is drawn from; empty means the default.
        join: Given `(value, token, separator)`, returns the finished string.

    Returns:
        A string when `value` is a string or None, a list when it is a list.
    """
    size = clamp(math.floor(length), 1, AFFIX_LENGTH_MAX)
    alphabet = charset or AFFIX_CHARSET

    def token() -> str:
        return rand_token(size, alphabet)

    if value is None:
        return token()

    def one(item: str) -> str:
        return join(item, token(), separator)

    if isinstance(value, str):
        return one(value)

    return [one(item) for item in value]
