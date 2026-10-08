"""Phone numbers: `010-4821-3967`, `(415) 726-0193`, written the way their country does."""

from randino.phone.data import PHONE_COUNTRIES, PHONE_TYPES
from randino.phone.rand_phone import rand_phone

__all__ = ["PHONE_COUNTRIES", "PHONE_TYPES", "rand_phone"]
