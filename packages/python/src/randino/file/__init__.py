"""File extensions and the MIME types they are served as: `.pdf`, `image/png`."""

from randino.file.data import FILE_CATEGORIES, MIME_TOP_LEVELS
from randino.file.rand_file_extension import rand_file_extension
from randino.file.rand_mime_type import rand_mime_type

__all__ = ["FILE_CATEGORIES", "MIME_TOP_LEVELS", "rand_file_extension", "rand_mime_type"]
