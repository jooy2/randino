"""Processor architectures: `x86_64`, `arm64`, and the rarer ones on request."""

from randino.architecture.data import ARCHITECTURES
from randino.architecture.rand_architecture import rand_architecture

__all__ = ["ARCHITECTURES", "rand_architecture"]
