#!/usr/bin/env python3
"""
Deck server for "Presence Before Synchronization".

Serves the deck locally (which the reveal.js speaker view needs) and adds one
extra endpoint so notes edited in the speaker view are written straight back
into index.html.

    POST /api/notes    {"index": 6, "html": "<p>...</p>"}

It also backs the image manager at /images.html, which reads the picture slots
out of index.html and lets you drop files straight into them:

    GET  /api/assets   -> every slot, its description, and whether it is filled
    POST /api/assets   {"name": "assets/x.jpg", "dataUrl": "data:image/..."}
    POST /api/assets/remove     {"name": "assets/x.jpg"}
    POST /api/assets/from-pool  {"name": "assets/x.jpg", "pool": "IMG_2841.jpg"}

Unsorted pictures live in assets/_pool/ — drop a whole folder in there from
Explorer, then assign them to slots on the images page:

    GET  /api/pool     -> everything sitting in the pool
    POST /api/pool     {"filename": "IMG_2841.jpg", "dataUrl": "..."}
    POST /api/pool/remove  {"filename": "IMG_2841.jpg"}

Every write snapshots the previous file first — index.html into .backups/,
replaced images into assets/_replaced/ — so nothing is lost.

Usage:  python serve.py [port]      (default 8000)
"""

import base64
import datetime
import glob
import http.server
import json
import os
import re
import shutil
import socketserver
import sys
import threading
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
DECK = os.path.join(ROOT, 'index.html')
BACKUP_DIR = os.path.join(ROOT, '.backups')
KEEP_BACKUPS = 40

ASIDE_RE   = re.compile(r'(<aside class="notes">)(.*?)(</aside>)', re.DOTALL)
SECTION_RE = re.compile(r'<section\b.*?</section>', re.DOTALL)
IMG_RE     = re.compile(r'<img\b[^>]*?data-slot="([^"]+)"[^>]*?>', re.DOTALL)
DESC_RE    = re.compile(r'data-desc="([^"]*)"')

ASSET_DIR    = os.path.join(ROOT, 'assets')
REPLACED_DIR = os.path.join(ASSET_DIR, '_replaced')
POOL_DIR     = os.path.join(ASSET_DIR, '_pool')
MAX_UPLOAD   = 30 * 1024 * 1024

POOL_README = """\
Drop any pictures here — straight from Explorer is fine, a whole folder at once.

Nothing in this folder is used by the slides directly. Open the images page
(http://localhost:8000/images.html) and drag them from the tray onto the slot
they belong to; that copies the file under the name the deck expects and leaves
the original here.

HEIC files from an iPhone will show up but cannot be assigned — browsers do not
display them. Export as JPEG first.
"""

# magic bytes for the formats a browser will actually render
SIGNATURES = [
    (b'\xff\xd8\xff', 'JPEG'),
    (b'\x89PNG\r\n\x1a\n', 'PNG'),
    (b'GIF87a', 'GIF'),
    (b'GIF89a', 'GIF'),
]


def sniff_image(blob):
    """Return a format name, or None if a browser will not render this."""
    for sig, name in SIGNATURES:
        if blob.startswith(sig):
            return name
    if blob[:4] == b'RIFF' and blob[8:12] == b'WEBP':
        return 'WebP'
    if blob[4:8] == b'ftyp' and blob[8:12] in (b'avif', b'avis'):
        return 'AVIF'
    if blob[4:8] == b'ftyp' and blob[8:12] in (b'heic', b'heix', b'mif1'):
        return None  # HEIC — Chrome will not display it
    head = blob[:400].lstrip()
    if head.startswith(b'<svg') or (head.startswith(b'<?xml') and b'<svg' in blob[:400]):
        return 'SVG'
    return None


def list_slots():
    """Every picture slot in the deck, in slide order, with its description."""
    text = read_deck()
    slots = {}
    for idx, sec in enumerate(SECTION_RE.finditer(text), start=1):
        for m in IMG_RE.finditer(sec.group(0)):
            name = m.group(1)
            d = DESC_RE.search(m.group(0))
            entry = slots.setdefault(name, {
                'name': name,
                'desc': d.group(1) if d else '',
                'slides': [],
            })
            if idx not in entry['slides']:
                entry['slides'].append(idx)
            if not entry['desc'] and d:
                entry['desc'] = d.group(1)

    out = []
    for entry in slots.values():
        path = os.path.join(ROOT, entry['name'].replace('/', os.sep))
        if os.path.exists(path):
            st = os.stat(path)
            with open(path, 'rb') as f:
                kind = sniff_image(f.read(512))
            entry['bytes'] = st.st_size
            entry['mtime'] = int(st.st_mtime * 1000)
            entry['format'] = kind or 'unknown'
        else:
            entry['bytes'] = None
        out.append(entry)
    return out


def slot_path(name):
    """Resolve a slot name to a path, refusing anything not declared in the deck."""
    valid = {s['name'] for s in list_slots()}
    if name not in valid:
        raise ValueError('%r is not a picture slot in this deck' % name)
    return os.path.join(ROOT, name.replace('/', os.sep))


def ensure_pool():
    os.makedirs(POOL_DIR, exist_ok=True)
    readme = os.path.join(POOL_DIR, 'READ-ME.txt')
    if not os.path.exists(readme):
        with open(readme, 'w', encoding='utf-8') as f:
            f.write(POOL_README)


def list_pool():
    """Everything sitting in assets/_pool/, newest first."""
    ensure_pool()
    out = []
    for fn in os.listdir(POOL_DIR):
        path = os.path.join(POOL_DIR, fn)
        if not os.path.isfile(path) or fn.startswith('.') or fn == 'READ-ME.txt':
            continue
        st = os.stat(path)
        with open(path, 'rb') as f:
            kind = sniff_image(f.read(512))
        out.append({
            'filename': fn,
            'url': 'assets/_pool/' + fn,
            'bytes': st.st_size,
            'mtime': int(st.st_mtime * 1000),
            'format': kind,             # None => browsers cannot show it
        })
    out.sort(key=lambda e: -e['mtime'])
    return out


def pool_path(filename):
    """Resolve a pool filename, refusing anything that escapes the folder."""
    if not filename or '/' in filename or '\\' in filename or filename.startswith('.'):
        raise ValueError('bad filename %r' % filename)
    path = os.path.join(POOL_DIR, filename)
    if os.path.dirname(os.path.abspath(path)) != os.path.abspath(POOL_DIR):
        raise ValueError('bad filename %r' % filename)
    return path


def stash_existing(path):
    """Move a file being replaced into assets/_replaced/ instead of losing it."""
    if not os.path.exists(path):
        return None
    os.makedirs(REPLACED_DIR, exist_ok=True)
    stamp = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
    dest = os.path.join(REPLACED_DIR, '%s-%s' % (stamp, os.path.basename(path)))
    shutil.move(path, dest)
    return os.path.basename(dest)


def read_deck():
    with open(DECK, encoding='utf-8') as f:
        return f.read()


def write_deck(text):
    tmp = DECK + '.tmp'
    # newline='' keeps the file's own line endings — without it Windows turns
    # every save into a whole-file CRLF rewrite, which buries the real diff.
    with open(tmp, 'w', encoding='utf-8', newline='') as f:
        f.write(text)
    os.replace(tmp, DECK)


def snapshot():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    stamp = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
    dest = os.path.join(BACKUP_DIR, 'index-%s.html' % stamp)
    shutil.copy2(DECK, dest)
    old = sorted(glob.glob(os.path.join(BACKUP_DIR, 'index-*.html')))
    for path in old[:-KEEP_BACKUPS]:
        try:
            os.remove(path)
        except OSError:
            pass
    return os.path.basename(dest)


def list_notes():
    return [m.group(2) for m in ASIDE_RE.finditer(read_deck())]


def save_note(index, html):
    """Replace the body of the index-th <aside class="notes"> block."""
    text = read_deck()
    spans = [m.span() for m in ASIDE_RE.finditer(text)]
    if not 0 <= index < len(spans):
        raise IndexError('slide %d has no notes block (deck has %d)'
                         % (index, len(spans)))

    match = list(ASIDE_RE.finditer(text))[index]
    backup = snapshot()
    new = text[:match.start(2)] + html + text[match.end(2):]
    write_deck(new)
    return backup


class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    # ---- helpers ------------------------------------------------------

    def reply(self, code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        # the deck is edited live; never let the browser serve a stale copy
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # keep the console clean; saves are logged explicitly

    # ---- routes -------------------------------------------------------

    def do_GET(self):
        route = self.path.split('?')[0]
        if route == '/api/notes':
            try:
                return self.reply(200, {'ok': True, 'notes': list_notes()})
            except Exception as exc:
                return self.reply(500, {'ok': False, 'error': str(exc)})
        if route == '/api/assets':
            try:
                return self.reply(200, {'ok': True, 'slots': list_slots()})
            except Exception as exc:
                return self.reply(500, {'ok': False, 'error': str(exc)})
        if route == '/api/pool':
            try:
                return self.reply(200, {'ok': True, 'pool': list_pool()})
            except Exception as exc:
                return self.reply(500, {'ok': False, 'error': str(exc)})
        return super().do_GET()

    def read_json(self):
        length = int(self.headers.get('Content-Length') or 0)
        if length > MAX_UPLOAD + 8192:
            raise ValueError('payload too large (%.1f MB)' % (length / 1048576))
        return json.loads(self.rfile.read(length).decode('utf-8'))

    def do_POST(self):
        route = self.path.split('?')[0]

        if route == '/api/assets':
            try:
                data = self.read_json()
                name = data['name']
                blob = base64.b64decode(data['dataUrl'].split(',', 1)[1])
                if len(blob) > MAX_UPLOAD:
                    raise ValueError('image is larger than 30 MB')
                kind = sniff_image(blob)
                if kind is None:
                    raise ValueError(
                        'not a format browsers display — use JPEG, PNG, WebP or GIF '
                        '(HEIC from an iPhone will not work)')
                path = slot_path(name)
                stashed = stash_existing(path)
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, 'wb') as f:
                    f.write(blob)
            except Exception as exc:
                print('  ! image save failed:', exc)
                return self.reply(400, {'ok': False, 'error': str(exc)})
            print('  saved %s  (%s, %.1f MB)' % (name, kind, len(blob) / 1048576))
            return self.reply(200, {'ok': True, 'format': kind,
                                    'bytes': len(blob), 'replaced': stashed})

        if route == '/api/assets/from-pool':
            try:
                data = self.read_json()
                src = pool_path(data['pool'])
                if not os.path.exists(src):
                    raise ValueError('%s is no longer in the pool' % data['pool'])
                with open(src, 'rb') as f:
                    kind = sniff_image(f.read(512))
                if kind is None:
                    raise ValueError(
                        '%s is not a format browsers display — export it as JPEG first'
                        % data['pool'])
                dest = slot_path(data['name'])
                stashed = stash_existing(dest)
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                shutil.copy2(src, dest)      # copy, so one picture can fill two slots
            except Exception as exc:
                print('  ! assign failed:', exc)
                return self.reply(400, {'ok': False, 'error': str(exc)})
            print('  %s -> %s' % (data['pool'], data['name']))
            return self.reply(200, {'ok': True, 'format': kind,
                                    'bytes': os.path.getsize(dest), 'replaced': stashed})

        if route == '/api/pool':
            try:
                data = self.read_json()
                path = pool_path(data['filename'])
                blob = base64.b64decode(data['dataUrl'].split(',', 1)[1])
                if len(blob) > MAX_UPLOAD:
                    raise ValueError('image is larger than 30 MB')
                ensure_pool()
                # never silently overwrite something already in the pool
                stem, ext = os.path.splitext(path)
                i = 2
                while os.path.exists(path):
                    path = '%s-%d%s' % (stem, i, ext)
                    i += 1
                with open(path, 'wb') as f:
                    f.write(blob)
            except Exception as exc:
                print('  ! pool upload failed:', exc)
                return self.reply(400, {'ok': False, 'error': str(exc)})
            return self.reply(200, {'ok': True, 'filename': os.path.basename(path)})

        if route == '/api/pool/remove':
            try:
                data = self.read_json()
                path = pool_path(data['filename'])
                stashed = stash_existing(path)
                if stashed is None:
                    raise ValueError('nothing there to remove')
            except Exception as exc:
                return self.reply(400, {'ok': False, 'error': str(exc)})
            return self.reply(200, {'ok': True, 'stashed': stashed})

        if route == '/api/assets/remove':
            try:
                data = self.read_json()
                path = slot_path(data['name'])
                stashed = stash_existing(path)
                if stashed is None:
                    raise ValueError('nothing there to remove')
            except Exception as exc:
                return self.reply(400, {'ok': False, 'error': str(exc)})
            print('  removed %s -> assets/_replaced/%s' % (data['name'], stashed))
            return self.reply(200, {'ok': True, 'stashed': stashed})

        if route != '/api/notes':
            return self.reply(404, {'ok': False, 'error': 'unknown endpoint'})

        try:
            data = self.read_json()
            index = int(data['index'])
            html = data['html']
            if not isinstance(html, str):
                raise ValueError('html must be a string')
            backup = save_note(index, html)
        except Exception as exc:
            print('  ! save failed:', exc)
            return self.reply(400, {'ok': False, 'error': str(exc)})

        stamp = datetime.datetime.now().strftime('%H:%M:%S')
        print('  saved notes for slide %d  (%s, backup %s)'
              % (index + 1, stamp, backup))
        return self.reply(200, {'ok': True, 'backup': backup})


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main():
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    for attempt in range(port, port + 20):
        try:
            httpd = Server(('127.0.0.1', attempt), Handler)
            port = attempt
            break
        except OSError:
            continue
    else:
        print('Could not find a free port near %d.' % port)
        return 1

    url = 'http://localhost:%d/index.html' % port
    print()
    print('  Presence Before Synchronization')
    print('  ' + url)
    print()
    print('  S = speaker view (notes are editable there and save back into index.html)')
    print('  images: http://localhost:%d/images.html  — drag pictures into their slots' % port)
    print('  pool:   assets/_pool/  — drop unsorted pictures here, assign them on that page')
    print('  backups: .backups/     stop the server: Ctrl+C')
    print()

    ensure_pool()
    threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n  stopped.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
