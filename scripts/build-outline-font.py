"""
Builds app/fonts/unbounded-outline-500.woff2 — a static Unbounded Medium with overlapping contours merged.

Variable fonts keep overlapping contours inside glyphs. A normal fill hides them, but `-webkit-text-stroke`
draws every contour, so outlined headings showed stray lines inside letters. This static instance is used
only for outlined text.

Run:  uv run --with fonttools --with skia-pathops --with brotli python scripts/build-outline-font.py
"""

import io
import pathlib
import urllib.request

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SOURCE = "https://raw.githubusercontent.com/google/fonts/main/ofl/unbounded/Unbounded%5Bwght%5D.ttf"
OUT = pathlib.Path(__file__).resolve().parent.parent / "app" / "fonts" / "unbounded-outline-500.woff2"
# Basic Latin, Latin-1, Cyrillic, general punctuation, currency and arrows used on the site.
UNICODES = "U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+0400-045F,U+0490-0491,U+2010-2027,U+2030-203A,U+20AC,U+20BD,U+2116,U+2122,U+2190-2193,U+2212,U+2726"


def main() -> None:
    data = urllib.request.urlopen(SOURCE).read()
    font = TTFont(io.BytesIO(data))
    static = instancer.instantiateVariableFont(font, {"wght": 500}, overlap=instancer.OverlapMode.REMOVE)

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(static)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    static.flavor = "woff2"
    static.save(OUT)
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
