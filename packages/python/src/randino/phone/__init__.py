"""Phone numbers: `010-4821-####`, `(415) 726-####`, written the way their country does.

The last four digits are hidden here; a call returns every digit.
"""

from randino.phone.data import PHONE_COUNTRIES, PHONE_TYPES
from randino.phone.rand_phone import rand_phone

__all__ = ["PHONE_COUNTRIES", "PHONE_TYPES", "rand_phone"]
