/* =========================================================
   Dev-server API — the working half of the old serve.py.

   Two things in this deck write to disk while it is running, and both are
   local-only by design:

     1. Speaker notes, edited from the speaker view (`S` → Edit → Ctrl+S).
        The patched reveal notes plugin POSTs to /api/notes; here we write the
        text into that slide's own `.notes.html` file and Vite hot-reloads it.

     2. Pictures and videos, dropped onto /images.html. The slots are read
        straight out of the <MediaSlot slot="…"> props in src/slides/*.tsx, so
        the page always offers exactly the files the deck asks for. A slot does
        not care which kind it gets: drop a clip on a slot that held a still and
        the file is saved under the right extension, the old one is stashed, and
        every slide pointing at the old path is rewritten.

   Every write snapshots what it is about to overwrite: notes into .backups/,
   media into public/assets/_replaced/. Nothing is lost.

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
const MAX_IMAGE = 30 * 1024 * 1024
/* Videos are bigger by nature. The real ceiling is GitHub's, which refuses a
   single file over 100 MB; the page warns before you cross it. */
const MAX_VIDEO = 120 * 1024 * 1024
const MAX_UPLOAD = MAX_VIDEO

const POOL_README = `Drop any pictures here — straight from Explorer is fine, a whole folder at once.

Nothing in this folder is used by the slides directly. Open the images page
(http://localhost:8000/images.html) and drag them from the tray onto the slot
they belong to; that copies the file under the name the deck expects and leaves
the original here.

HEIC files from an iPhone will show up but cannot be assigned — browsers do not
display them. Export as JPEG first.
`

/* ---------- media sniffing ---------------------------------------------- */
/* Only formats a browser will actually show; anything else is refused at the
   door rather than silently landing in a slot that stays blank. The `kind`
   also decides which slots a file may fill — a picture cannot go into a video
   slot, and the other way round. */

export type MediaKind = 'image' | 'video'
export interface Sniffed {
  format: string
  kind: MediaKind
}

function sniffMedia(blob: Buffer): Sniffed | null {
  const image = (format: string): Sniffed => ({ format, kind: 'image' })
  const video = (format: string): Sniffed => ({ format, kind: 'video' })

  if (blob.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return image('JPEG')
  if (blob.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return image('PNG')

  const head6 = blob.subarray(0, 6).toString('latin1')
  if (head6 === 'GIF87a' || head6 === 'GIF89a') return image('GIF')

  // RIFF containers: WEBP is a picture, AVI is not something we accept
  if (blob.subarray(0, 4).toString('latin1') === 'RIFF' &&
      blob.subarray(8, 12).toString('latin1') === 'WEBP') return image('WebP')

  // Matroska / WebM
  if (blob.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) return video('WebM')

  // ISO base media: mp4, mov, and the still-image formats that share the box
  if (blob.subarray(4, 8).toString('latin1') === 'ftyp') {
    const brand = blob.subarray(8, 12).toString('latin1')
    if (brand === 'avif' || brand === 'avis') return image('AVIF')
    if (/^(heic|heix|hevc|hevx|mif1|msf1)$/.test(brand)) return null // Chrome will not display it
    if (brand === 'qt  ') return video('MOV')
    return video('MP4') // isom, iso2, mp41, mp42, avc1, M4V …
  }

  const text = blob.subarray(0, 400).toString('utf8').trimStart()
  if (text.startsWith('<svg') || (text.startsWith('<?xml') && text.includes('<svg'))) {
    return image('SVG')
  }
  return null
}

/** How big this kind of file is allowed to be. */
function capFor(kind: MediaKind): number {
  return kind === 'video' ? MAX_VIDEO : MAX_IMAGE
}

/** The extension a file of this format should be stored under. */
const EXT_FOR: Record<string, string> = {
  JPEG: '.jpg', PNG: '.png', GIF: '.gif', WebP: '.webp', AVIF: '.avif', SVG: '.svg',
  MP4: '.mp4', MOV: '.mov', WebM: '.webm',
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)$/i

/** What a slot currently holds, judged by its path — the deck reads it the same way. */
function kindOfPath(name: string): MediaKind {
  return VIDEO_EXT.test(name) ? 'video' : 'image'
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
  /** What is in it *now*, read off the extension. Not a restriction. */
  kind: MediaKind
  desc: string
  slides: number[]
  bytes?: number | null
  mtime?: number
  format?: string
}

/* One card per <MediaSlot slot="…">. A slot takes a picture or a video without
   caring which — see placeFile() below, which renames the slot to match what
   you dropped on it. `poster` is deliberately not a slot of its own: it is the
   still behind a video, and it points at some other slot's file. */
const SLOT_BLOCK = /<MediaSlot\b[\s\S]*?\/>/g

/** `name="x"`, `name={'x'}` or `name={"x"}` — the forms we author. */
function attr(source: string, name: string): string {
  const m = source.match(
    new RegExp(`\\b${name}=(?:"([^"]*)"|\\{'([^']*)'\\}|\\{"([^"]*)"\\})`),
  )
  if (!m) return ''
  return m[1] ?? m[2] ?? m[3] ?? ''
}

/** Read the first bytes of a file, for format sniffing. */
async function head(file: string, n = 512): Promise<Buffer> {
  const fd = await fs.open(file, 'r')
  const buf = Buffer.alloc(n)
  await fd.read(buf, 0, n, 0)
  await fd.close()
  return buf
}

/** Every file the deck asks for, in slide order, with its description. */
async function listSlots(): Promise<SlotInfo[]> {
  const files = await slideFiles()
  const slots = new Map<string, SlotInfo>()

  for (const [i, file] of files.entries()) {
    const source = await fs.readFile(path.join(SLIDE_DIR, file), 'utf8')
    for (const block of source.match(SLOT_BLOCK) ?? []) {
      const name = attr(block, 'slot')
      if (!name) continue
      const desc = attr(block, 'desc')
      const entry = slots.get(name) ?? { name, kind: kindOfPath(name), desc, slides: [] }
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
      entry.bytes = st.size
      entry.mtime = Math.round(st.mtimeMs)
      entry.format = sniffMedia(await head(file))?.format ?? 'unknown'
    } catch {
      entry.bytes = null
    }
    out.push(entry)
  }
  return out
}

/** Look a slot up by name, refusing anything the deck does not declare. */
async function findSlot(name: string): Promise<SlotInfo & { path: string }> {
  const slot = (await listSlots()).find((s) => s.name === name)
  if (!slot) throw new Error(`${name} is not a slot in this deck`)
  return { ...slot, path: path.join(PUBLIC_DIR, name) }
}

/** Refuse only what a browser cannot show at all, or what is too big. */
function checkUsable(media: Sniffed | null, bytes: number): Sniffed {
  if (!media) {
    throw new Error(
      '브라우저가 열 수 없는 형식입니다 — 사진은 JPEG·PNG·WebP·GIF, ' +
        '영상은 H.264 mp4나 WebM으로 내보내 주세요 (아이폰 HEIC는 동작하지 않습니다)',
    )
  }
  const cap = capFor(media.kind)
  if (bytes > cap) {
    throw new Error(`파일이 ${Math.round(cap / 1048576)} MB보다 큽니다`)
  }
  return media
}

/** Point every `slot="from"` and `poster="from"` in the deck at `to`. */
async function renameInSlides(from: string, to: string): Promise<number> {
  let changed = 0
  for (const file of await slideFiles()) {
    const p = path.join(SLIDE_DIR, file)
    const src = await fs.readFile(p, 'utf8')
    const next = src.split(`"${from}"`).join(`"${to}"`)
    if (next !== src) {
      await fs.writeFile(p, next, 'utf8')
      changed += 1
    }
  }
  return changed
}

/**
 * Put a file into a slot, whatever kind it is.
 *
 * A slot is just a path, and the deck reads its kind off the extension — so a
 * video landing on a slot that held a picture is not an error, it is a rename:
 * the file is written under the right extension, the old one is stashed, and
 * every slide pointing at the old path is rewritten to the new one.
 */
async function placeFile(
  name: string,
  media: Sniffed,
  write: (dest: string) => Promise<void>,
): Promise<{ target: string; renamed: string | null; slides: number }> {
  const slots = await listSlots()
  const slot = slots.find((s) => s.name === name)
  if (!slot) throw new Error(`${name} 은(는) 이 덱의 칸이 아닙니다`)

  const want = EXT_FOR[media.format] ?? path.extname(name)
  const have = path.extname(name)
  let target = name
  let renamed: string | null = null
  let slides = 0

  if (have.toLowerCase() !== want) {
    target = name.slice(0, name.length - have.length) + want
    if (slots.some((s) => s.name !== name && s.name === target)) {
      throw new Error(`${target} 은(는) 이미 다른 칸이 쓰고 있습니다`)
    }
    renamed = target
  }

  const targetPath = path.join(PUBLIC_DIR, target)
  await stashExisting(targetPath)
  if (renamed) await stashExisting(path.join(PUBLIC_DIR, name)) // the file it replaces
  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  await write(targetPath)

  if (renamed) slides = await renameInSlides(name, target)
  return { target, renamed, slides }
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
    const media = sniffMedia(await head(file))
    out.push({
      filename: name,
      url: `assets/_pool/${name}`,
      bytes: st.size,
      mtime: Math.round(st.mtimeMs),
      // null => the browser cannot show it, so it cannot be assigned
      format: media?.format ?? null,
      kind: media?.kind ?? null,
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
            const media = checkUsable(sniffMedia(blob), blob.length)
            const put = await placeFile(name, media, (dest) => fs.writeFile(dest, blob))
            server.config.logger.info(
              `  saved ${put.target}  (${media.format}, ${(blob.length / 1048576).toFixed(1)} MB)` +
                (put.renamed ? `  — slot renamed from ${name} in ${put.slides} slide(s)` : ''),
            )
            return reply(200, {
              ok: true, format: media.format, kind: media.kind, bytes: blob.length,
              name: put.target, renamed: put.renamed, slides: put.slides,
            })
          }

          if (route === '/api/assets/from-pool' && req.method === 'POST') {
            const data = await readJson(req)
            const src = poolPath(String(data.pool))
            let stat: Awaited<ReturnType<typeof fs.stat>>
            try {
              stat = await fs.stat(src)
            } catch {
              throw new Error(`${data.pool} 은(는) 모아둔 곳에 더 이상 없습니다`)
            }
            const media = checkUsable(sniffMedia(await head(src)), stat.size)
            // copy, not move, so one file can fill two slots
            const put = await placeFile(String(data.name), media, (dest) => fs.copyFile(src, dest))
            server.config.logger.info(
              `  ${data.pool} -> ${put.target}` +
                (put.renamed ? `  — slot renamed from ${data.name}` : ''),
            )
            return reply(200, {
              ok: true, format: media.format, kind: media.kind, bytes: stat.size,
              name: put.target, renamed: put.renamed, slides: put.slides,
            })
          }

          if (route === '/api/assets/remove' && req.method === 'POST') {
            const data = await readJson(req)
            const stashed = await stashExisting((await findSlot(String(data.name))).path)
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
            const media = sniffMedia(blob)
            if (blob.length > capFor(media?.kind ?? 'image')) {
              throw new Error(
                `파일이 ${Math.round(capFor(media?.kind ?? 'image') / 1048576)} MB보다 큽니다`,
              )
            }
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
