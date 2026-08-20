#!/usr/bin/env python3
"""
reveal.js bundles the whole speaker view into notes.js as one big JS string,
so editing speaker-view.html on its own has no effect. This script injects the
current speaker-view.html back into that string.

Run it after any change to reveal/plugin/notes/speaker-view.html:

    python build-speaker-view.py

It is idempotent — running it twice is harmless.
"""

import json
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'reveal', 'plugin', 'notes', 'speaker-view.html')
DST = os.path.join(ROOT, 'reveal', 'plugin', 'notes', 'notes.js')
ANCHOR = 'n.document.write('


def find_string_literal(text, start):
    """Return (open_quote_index, close_quote_index) of the JS string at `start`."""
    i = text.index('"', start)
    j = i + 1
    while j < len(text):
        c = text[j]
        if c == '\\':
            j += 2
            continue
        if c == '"':
            return i, j
        j += 1
    raise ValueError('unterminated string literal in notes.js')


def main():
    for path in (SRC, DST):
        if not os.path.exists(path):
            print('missing:', path)
            return 1

    html = open(SRC, encoding='utf-8').read()
    js = open(DST, encoding='utf-8').read()

    at = js.find(ANCHOR)
    if at < 0:
        print('Could not find "%s" in notes.js — reveal.js version changed?' % ANCHOR)
        return 1

    open_q, close_q = find_string_literal(js, at + len(ANCHOR))
    if js[close_q + 1] != ')':
        print('Unexpected syntax after the speaker-view string; aborting.')
        return 1

    # JSON string escaping is a valid subset of JS string escaping.
    literal = json.dumps(html, ensure_ascii=False)
    # These two are legal in JSON but terminate a JS string literal.
    literal = literal.replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')

    if js[open_q:close_q + 1] == literal:
        print('notes.js already up to date.')
        return 0

    if not os.path.exists(DST + '.orig'):
        shutil.copy2(DST, DST + '.orig')
        print('kept pristine copy: notes.js.orig')

    out = js[:open_q] + literal + js[close_q + 1:]
    with open(DST, 'w', encoding='utf-8') as f:
        f.write(out)

    print('injected %s (%d chars) into notes.js' % (os.path.basename(SRC), len(html)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
