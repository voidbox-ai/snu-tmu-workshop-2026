/* =========================================================
   Dev-server API — the working half of the old serve.py.

   Two things in this deck write to disk while it is running, and both are
   local-only by design:

     1. Speaker notes, edited from the speaker view (`S` → Edit → Ctrl+S).
        The patched reveal notes plugin POSTs to /api/notes; here we write the
        text into that slide's own `.notes.html` file and Vite hot-reloads it.

     2. Pictures, dropped onto /images.html. The slots are read straight out
        of the <ImageSlot slot="…" desc="…"> props in src/slides/*.tsx, so the
        drop-in page always offers exactly the pictures the deck asks for.

   Every write snapshots what it is about to overwrite: notes into .backups/,
   pictures into public/assets/_replaced/. Nothing is lost.

   None of this exists in the built site — the plugin is `apply: 'serve'`, and
   the speaker view hides its Edit button when the endpoint does not answer.
   ========================================================= */

import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Connect, Plugin } from 'vite'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const APP_ROOT = path.resolve(HERE, '..')
const SLIDE_DIR = path.join(APP_ROOT, 'src', 'slides')
const PUBLIC_DIR = path.join(APP_ROOT, 'public')
const BACKUP_DIR = path.join(APP_ROOT, '.backups')
const REPLACED_DIR = path.join(PUBLIC_DIR, 'assets', '_replaced')
const POOL_DIR = path.join(PUBLIC_DIR, 'assets', '_pool')

const KEEP_BACKUPS = 40
const MAX_UPLOAD = 30 * 1024 * 1024

const POOL_README = `Drop any pictures here — straight from Explorer is fine, a whole folder at once.

Nothing in this folder is used by the slides directly. Open the images page
(http://localhost:8000/images.html) and drag them from the tray onto the slot
they belong to; that copies the file under the name the deck expects and leaves
the original here.

HEIC files from an iPhone will show up but cannot be assigned — browsers do not
display them. Export as JPEG first.
`

/* ---------- image sniffing ---------------------------------------------- */
/* Only formats a browser will actually render; anything else is refused at
   the door rather than silently landing in a slot that stays blank. */

function sniffImage(blob: Buffer): string | null {
  if (blob.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'JPEG'
  if (blob.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return 'PNG'
  const head6 = blob.subarray(0, 6).toString('latin1')
  if (head6 === 'GIF87a' || head6 === 'GIF89a') return 'GIF'
  if (blob.subarray(0, 4).toString('latin1') === 'RIFF' &&
      blob.subarray(8, 12).toString('latin1') === 'WEBP') return 'WebP'
  const brand = blob.subarray(8, 12).toString('latin1')
  if (blob.subarray(4, 8).toString('latin1') === 'ftyp') {
    if (brand === 'avif' || brand === 'avis') return 'AVIF'
    if (brand === 'heic' || brand === 'heix' || brand === 'mif1') return null // Chrome will not display it
  }
  const text = blob.subarray(0, 400).toString('utf8').trimStart()
  if (text.startsWith('<svg') || (text.startsWith('<?xml') && text.includes('<svg'))) return 'SVG'
  return null
}

/* ---------- the deck on disk -------------------------------------------- */

async function slideFiles(): Promise<string[]> {
  const names = await fs.readdir(SLIDE_DIR)
  return names.filter((n) => n.endsWith('.tsx')).sort()
}

/** `09-what-the-layer-did.tsx` -> `.../09-what-the-layer-did.notes.html` */
function notesPathFor(slideFile: string): string {
  return path.join(SLIDE_DIR, slideFile.replace(/\.tsx$/, '.notes.html'))
}

async function listNotes(): Promise<string[]> {
  const files = await slideFiles()
  return Promise.all(
    files.map(async (f) => {
      try {
        return await fs.readFile(notesPathFor(f), 'utf8')
      } catch {
        return ''
      }
    }),
  )
}

/** `20260821-011553` — the same shape serve.py used. */
function timestamp(): string {
  const d = new Date()
  const p = (n: number, w = 2) => String(n).padStart(w, '0')
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  )
}

async function backupNotes(file: string): Promise<string | null> {
  let existing: string
  try {
    existing = await fs.readFile(file, 'utf8')
  } catch {
    return null
  }
  await fs.mkdir(BACKUP_DIR, { recursive: true })
  const stem = path.basename(file, '.html') // e.g. 20-for-discussion.notes
  const dest = path.join(BACKUP_DIR, `${stem}-${timestamp()}.html`)
  await fs.writeFile(dest, existing, 'utf8')

  // keep the last N *for this slide*, so one busy slide cannot evict another's
  const kept = (await fs.readdir(BACKUP_DIR))
    .filter((n) => n.startsWith(`${stem}-`) && n.endsWith('.html'))
    .sort()
  for (const old of kept.slice(0, Math.max(0, kept.length - KEEP_BACKUPS))) {
    await fs.rm(path.join(BACKUP_DIR, old), { force: true })
  }
  return path.basename(dest)
}

async function saveNote(index: number, html: string): Promise<string | null> {
  const files = await slideFiles()
  const file = files[index]
  if (!file) throw new Error(`slide ${index + 1} does not exist (deck has ${files.length})`)

  const target = notesPathFor(file)
  const backup = await backupNotes(target)
  await fs.writeFile(target, `${html.trim()}\n`, 'utf8')
  return backup
}

/* ---------- picture slots ------------------------------------------------ */

export interface SlotInfo {
  name: string
  desc: string
  slides: number[]
  bytes?: number | null
  mtime?: number
  format?: string
}

const SLOT_BLOCK = /<ImageSlot\b[\s\S]*?\/>/g
const SLOT_NAME = /\bslot=(?:"([^"]*)"|\{'([^']*)'\}|\{"([^"]*)"\})/
const SLOT_DESC = /\bdesc=(?:"([^"]*)"|\{'([^']*)'\}|\{"([^"]*)"\})/

function firstGroup(m: RegExpMatchArray | null): string {
  if (!m) return ''
  return m[1] ?? m[2] ?? m[3] ?? ''
}

/** Every picture the deck asks for, in slide order, with its description. */
async function listSlots(): Promise<SlotInfo[]> {
  const files = await slideFiles()
  const slots = new Map<string, SlotInfo>()

  for (const [i, file] of files.entries()) {
    const source = await fs.readFile(path.join(SLIDE_DIR, file), 'utf8')
    for (const block of source.match(SLOT_BLOCK) ?? []) {
      const name = firstGroup(block.match(SLOT_NAME))
      if (!name) continue
      const desc = firstGroup(block.match(SLOT_DESC))
      const entry = slots.get(name) ?? { name, desc, slides: [] }
      if (!entry.desc && desc) entry.desc = desc
      if (!entry.slides.includes(i + 1)) entry.slides.push(i + 1)
      slots.set(name, entry)
    }
  }

  const out: SlotInfo[] = []
  for (const entry of slots.values()) {
    const file = path.join(PUBLIC_DIR, entry.name)
    try {
      const st = await fs.stat(file)
      const fd = await fs.open(file, 'r')
      const head = Buffer.alloc(512)
      await fd.read(head, 0, 512, 0)
      await fd.close()
      entry.bytes = st.size
      entry.mtime = Math.round(st.mtimeMs)
      entry.format = sniffImage(head) ?? 'unknown'
    } catch {
      entry.bytes = null
    }
    out.push(entry)
  }
  return out
}

/** Resolve a slot name to a path, refusing anything the deck does not declare. */
async function slotPath(name: string): Promise<string> {
  const valid = new Set((await listSlots()).map((s) => s.name))
  if (!valid.has(name)) throw new Error(`${name} is not a picture slot in this deck`)
  return path.join(PUBLIC_DIR, name)
}

/* ---------- the unsorted pool ------------------------------------------- */

async function ensurePool(): Promise<void> {
  await fs.mkdir(POOL_DIR, { recursive: true })
  const readme = path.join(POOL_DIR, 'READ-ME.txt')
  try {
    await fs.access(readme)
  } catch {
    await fs.writeFile(readme, POOL_README, 'utf8')
  }
}

function poolPath(filename: string): string {
  if (!filename || filename.includes('/') || filename.includes('\\') || filename.startsWith('.')) {
    throw new Error(`bad filename ${filename}`)
  }
  const file = path.join(POOL_DIR, filename)
  if (path.dirname(path.resolve(file)) !== path.resolve(POOL_DIR)) {
    throw new Error(`bad filename ${filename}`)
  }
  return file
}

async function listPool() {
  await ensurePool()
  const out = []
  for (const name of await fs.readdir(POOL_DIR)) {
    const file = path.join(POOL_DIR, name)
    const st = await fs.stat(file)
    if (!st.isFile() || name.startsWith('.') || name === 'READ-ME.txt') continue
    const fd = await fs.open(file, 'r')
    const head = Buffer.alloc(512)
    await fd.read(head, 0, 512, 0)
    await fd.close()
    out.push({
      filename: name,
      url: `assets/_pool/${name}`,
      bytes: st.size,
      mtime: Math.round(st.mtimeMs),
      format: sniffImage(head),
    })
  }
  out.sort((a, b) => b.mtime - a.mtime)
  return out
}

/** Move a file being replaced into _replaced/ instead of losing it. */
async function stashExisting(file: string): Promise<string | null> {
  try {
    await fs.access(file)
  } catch {
    return null
  }
  await fs.mkdir(REPLACED_DIR, { recursive: true })
  const dest = path.join(REPLACED_DIR, `${timestamp()}-${path.basename(file)}`)
  await fs.rename(file, dest)
  return path.basename(dest)
}

/* ---------- plumbing ----------------------------------------------------- */

function decodeDataUrl(dataUrl: string): Buffer {
  const comma = dataUrl.indexOf(',')
  if (comma < 0) throw new Error('not a data URL')
  return Buffer.from(dataUrl.slice(comma + 1), 'base64')
}

function readJson(req: Connect.IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_UPLOAD + 8192) {
        reject(new Error(`payload too large (${(size / 1048576).toFixed(1)} MB)`))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

export function deckApi(): Plugin {
  return {
    name: 'deck-api',
    apply: 'serve',

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const route = (req.url ?? '').split('?')[0]!
        if (!route.startsWith('/api/')) {
          // the deck is edited live; never let the browser serve a stale picture
          if (route.startsWith('/assets/')) res.setHeader('Cache-Control', 'no-store')
          return next()
        }

        const reply = (code: number, payload: unknown) => {
          const body = JSON.stringify(payload)
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('Cache-Control', 'no-store')
          res.end(body)
        }

        try {
          /* ---- notes ---- */

          if (route === '/api/notes' && (req.method === 'GET' || req.method === 'HEAD')) {
            if (req.method === 'HEAD') {
              res.statusCode = 200
              return res.end()
            }
            return reply(200, { ok: true, notes: await listNotes() })
          }

          if (route === '/api/notes' && req.method === 'POST') {
            const data = await readJson(req)
            const index = Number(data.index)
            const html = data.html
            if (typeof html !== 'string') throw new Error('html must be a string')
            const backup = await saveNote(index, html)
            server.config.logger.info(
              `  saved notes for slide ${index + 1}` + (backup ? `  (backup ${backup})` : ''),
            )
            return reply(200, { ok: true, backup })
          }

          /* ---- picture slots ---- */

          if (route === '/api/assets' && req.method === 'GET') {
            return reply(200, { ok: true, slots: await listSlots() })
          }

          if (route === '/api/assets' && req.method === 'POST') {
            const data = await readJson(req)
            const name = String(data.name)
            const blob = decodeDataUrl(String(data.dataUrl))
            if (blob.length > MAX_UPLOAD) throw new Error('image is larger than 30 MB')
            const kind = sniffImage(blob)
            if (!kind) {
              throw new Error(
                'not a format browsers display — use JPEG, PNG, WebP or GIF ' +
                  '(HEIC from an iPhone will not work)',
              )
            }
            const file = await slotPath(name)
            const replaced = await stashExisting(file)
            await fs.mkdir(path.dirname(file), { recursive: true })
            await fs.writeFile(file, blob)
            server.config.logger.info(
              `  saved ${name}  (${kind}, ${(blob.length / 1048576).toFixed(1)} MB)`,
            )
            return reply(200, { ok: true, format: kind, bytes: blob.length, replaced })
          }

          if (route === '/api/assets/from-pool' && req.method === 'POST') {
            const data = await readJson(req)
            const src = poolPath(String(data.pool))
            let head: Buffer
            try {
              head = (await fs.readFile(src)).subarray(0, 512)
            } catch {
              throw new Error(`${data.pool} is no longer in the pool`)
            }
            const kind = sniffImage(head)
            if (!kind) {
              throw new Error(
                `${data.pool} is not a format browsers display — export it as JPEG first`,
              )
            }
            const dest = await slotPath(String(data.name))
            const replaced = await stashExisting(dest)
            await fs.mkdir(path.dirname(dest), { recursive: true })
            await fs.copyFile(src, dest) // copy, so one picture can fill two slots
            server.config.logger.info(`  ${data.pool} -> ${data.name}`)
            const st = await fs.stat(dest)
            return reply(200, { ok: true, format: kind, bytes: st.size, replaced })
          }

          if (route === '/api/assets/remove' && req.method === 'POST') {
            const data = await readJson(req)
            const file = await slotPath(String(data.name))
            const stashed = await stashExisting(file)
            if (!stashed) throw new Error('nothing there to remove')
            server.config.logger.info(`  removed ${data.name} -> assets/_replaced/${stashed}`)
            return reply(200, { ok: true, stashed })
          }

          /* ---- the unsorted pool ---- */

          if (route === '/api/pool' && req.method === 'GET') {
            return reply(200, { ok: true, pool: await listPool() })
          }

          if (route === '/api/pool' && req.method === 'POST') {
            const data = await readJson(req)
            let file = poolPath(String(data.filename))
            const blob = decodeDataUrl(String(data.dataUrl))
            if (blob.length > MAX_UPLOAD) throw new Error('image is larger than 30 MB')
            await ensurePool()
            // never silently overwrite something already in the pool
            const ext = path.extname(file)
            const stem = file.slice(0, file.length - ext.length)
            let n = 2
            for (;;) {
              try {
                await fs.access(file)
              } catch {
                break
              }
              file = `${stem}-${n}${ext}`
              n += 1
            }
            await fs.writeFile(file, blob)
            return reply(200, { ok: true, filename: path.basename(file) })
          }

          if (route === '/api/pool/remove' && req.method === 'POST') {
            const data = await readJson(req)
            const stashed = await stashExisting(poolPath(String(data.filename)))
            if (!stashed) throw new Error('nothing there to remove')
            return reply(200, { ok: true, stashed })
          }

          return reply(404, { ok: false, error: 'unknown endpoint' })
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          server.config.logger.warn(`  ! ${route} failed: ${message}`)
          return reply(400, { ok: false, error: message })
        }
      })
    },
  }
}
