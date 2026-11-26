// Builds static/nathan-rihet-resume.pdf from the resume page's data (src/data/resume.ts, experience.ts,
// projects.ts), in the layout of the October 2026 PDF (a LibreOffice export): US Letter, Liberation Sans,
// the same sizes, colours, spacing, rules, bullets and links. Only the words come from the data.
//
//   npm run resume-pdf      then   npm run resume-text
//
// Needs LiberationSans-Regular.ttf and LiberationSans-Bold.ttf in scripts/resume-pdf/fonts/ (not committed),
// or in the folder named by RESUME_FONTS. The October file used Liberation Sans 2.1.5 (the Liberation fonts
// release). The copies in pdfjs-dist/standard_fonts/ are version 1.07.4: same widths, same outlines to within
// 0.05 pt, except a slightly wider lowercase "z" in the regular face. They are embedded as subsets.
// No other dependency: TypeScript (already a dev dependency) reads the data files.

import { createRequire } from "node:module"
import { createHash } from "node:crypto"
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { deflateSync } from "node:zlib"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const OUT = "static/nathan-rihet-resume.pdf"

// ---- The October 2026 layout, measured in its PDF (points, origin bottom left) ----

const PAGE = { width: 612, height: 792 }
const LEFT = 44.05 // text starts here; the section rules run from 44 to 568.05
const RULE = { from: 44, to: 568.05, below: 6.2, width: 0.75 }
// A word goes to the next line when it would end past this point. The old file has a line ending at
// 565.81 and wraps a word that would have ended at 567.54.
const WRAP_AT = 566.7
const BULLET_X = 80.05 // the "●"
const BULLET_TEXT_X = 89.05
const LINK_LINE_X = 59.05 // "Course: …", "Source: …", "Demo: …"
const BOTTOM = 36 // lowest point a line's descent may reach
const CENTER = (LEFT + RULE.to) / 2

const COLORS = {
  text: [28, 28, 28], // #1C1C1C
  heading: [78, 78, 78], // #4E4E4E
  link: [17, 85, 204], // #1155CC
  rule: [183, 183, 183], // #B7B7B7
}

// Font size of each kind of paragraph. H: section heading. C: company or school. T: the line under it.
// B: bullet. LK: link line. SK: skill line. E: education line. PT: project title. ST: project stack.
// LD: leadership paragraph. P: plain paragraph.
const SIZE = { name: 23, tagline: 12, contact: 10, H: 11.5 }
const sizeOf = (kind) => SIZE[kind] ?? 10.5
// Distance between two lines of one paragraph.
const PITCH = { B: 12.1 }
const pitchOf = (kind) => PITCH[kind] ?? 13.05
// Distance from the last line of one paragraph to the first line of the next, by pair of kinds. All are
// measured in the October file except B>H: every kind measured before a heading gives 23.95, so it does too.
const GAP = {
  "contact>H": 23.75,
  "H>P": 22.15,
  "H>SK": 22.15,
  "H>E": 22.15,
  "H>PT": 22.15,
  "H>LD": 22.15,
  "H>C": 23.15,
  "P>H": 23.95,
  "SK>H": 23.95,
  "E>H": 23.95,
  "LK>H": 23.95,
  "B>H": 23.95,
  "SK>SK": 15.05,
  "E>E": 16.05,
  "LD>LD": 17.05,
  "C>T": 13.05,
  "T>B": 16.05,
  "B>B": 12.1,
  "B>C": 19.1,
  "B>LK": 18.1,
  "LK>PT": 18.05,
  "PT>ST": 16.05,
  "PT>B": 16.05,
  "ST>B": 15.05,
}
// Baseline of the first line of a page after the first one: a heading's is measured, the others follow from
// the 36 pt top margin and each line's height.
const TOP = { H: 743.35, B: 746.1 }
const topOf = (kind) => TOP[kind] ?? 745.25
// Header of page 1: baselines.
const HEADER = { name: 732.9, tagline: 712.35, contact: 696.25 }

// ---- Typography of the PDF: plain ASCII separators, as the October file had them ----

const plain = (text) =>
  text
    .replace(/\s*—\s*/g, " - ")
    .replace(/(\d)–(\d)/g, "$1 - $2")
    .replace(/[’‘]/g, "'")
    .replace(/\s*·\s*/g, " | ")

const shortUrl = (href) => href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")

// ---- The data ----

// Compiles the three data files to CommonJS in a temporary folder and loads them.
const loadData = () => {
  const ts = createRequire(import.meta.url)("typescript")
  const dir = mkdtempSync(path.join(tmpdir(), "resume-pdf-"))
  try {
    writeFileSync(path.join(dir, "package.json"), '{ "type": "commonjs" }\n')
    for (const name of ["projects", "experience", "resume"]) {
      const source = readFileSync(path.join(root, "src/data", `${name}.ts`), "utf8")
      const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
      })
      writeFileSync(path.join(dir, `${name}.js`), outputText)
    }
    const load = createRequire(path.join(dir, "index.js"))
    return { ...load("./projects.js"), ...load("./experience.js"), ...load("./resume.js") }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

// Runs: { text, bold?, color?, href? }. A paragraph: { kind, runs, x?, bullet? }. A block is kept on one
// page; a heading is kept with the block after it.
const bold = (text) => ({ text, bold: true })
const reg = (text) => ({ text })
const link = (href, text = shortUrl(href)) => ({ text, color: "link", href })
const para = (kind, runs, extra = {}) => ({ kind, runs, ...extra })
const heading = (text) => ({ heading: true, paras: [para("H", [{ text: text.toUpperCase(), bold: true, color: "heading" }])] })
const block = (...paras) => ({ paras })
const bullets = (items) => items.map((item) => para("B", [reg(plain(item))], { bullet: true }))
const linkLine = (label, href) => para("LK", [bold(`${label}:`), reg(" "), link(href)], { x: LINK_LINE_X })
// For a check that rebuilds the October file from its own words.
export const parts = { para, block, heading, bold, reg, link, linkLine, bullets }

export const buildResume = (data) => {
  const { education, getProject, leadership, mainSkillGroups, resumeHeadline, resumeProfile, roles } = data
  const { selectedProjects, skillLine, spokenLanguages, statusLabel, teaching } = data

  const header = {
    name: "NATHAN RIHET",
    tagline: plain(resumeHeadline),
    contact: [
      reg("nathan.rihet06@gmail.com | "),
      link("https://www.linkedin.com/in/nathan-rihet/"),
      reg(" | "),
      link("https://github.com/NathanKneT"),
      reg(" | "),
      link("https://nathanglhf.com/"),
    ],
  }

  const sections = []
  const section = (title, ...blocks) => sections.push(heading(title), ...blocks)

  // The October file's own headings: "Professional summary" where the page says "Profile", and so on.
  section("Professional summary", block(para("P", [reg(plain(resumeProfile))])))

  section(
    "Technical skills",
    ...mainSkillGroups().map((group) => block(para("SK", [bold(`${group.area}:`), reg(` ${skillLine(group)}`)]))),
    block(
      para("SK", [
        bold("Spoken Languages:"),
        reg(` ${spokenLanguages.map((language) => `${language.name} (${language.level})`).join(", ")}`),
      ]),
    ),
  )

  section(
    "Professional experience",
    ...roles.map((role) =>
      block(
        para("C", [bold(plain(role.company).toUpperCase())]),
        para("T", [reg(plain([role.title, role.location, role.period, role.note].filter(Boolean).join(" | ")))]),
        ...bullets(role.highlights.map((highlight) => highlight.text)),
      ),
    ),
  )

  section(
    "Teaching experience",
    block(
      para("C", [bold(plain(teaching.institution).toUpperCase())]),
      para("T", [reg(plain([teaching.title, teaching.location, teaching.period].join(" | ")))]),
      ...bullets(teaching.bullets),
      linkLine("Course", teaching.materialsUrl),
    ),
  )

  // One line per degree, the country after the school. A degree too long for that keeps the school, its
  // country and the years together on a second line, rather than letting a lone year wrap.
  section(
    "Education",
    ...education.map((entry) => {
      const where = [`${entry.school}, ${entry.place}`, entry.years].join(" | ")
      return block(para("E", [reg(plain(`${entry.degree} | ${where}`))], { orElse: [reg(plain(`${entry.degree}\n${where}`))] }))
    }),
  )

  // The PDF links out only: the repository when there is one, else the playable demo.
  section(
    "Selected engineering projects",
    ...selectedProjects.map((entry) => {
      const project = getProject(entry.slug)
      const meta = [entry.subtitle, statusLabel[project.status], project.year].filter(Boolean).join(" | ")
      const out = project.sourceUrl ? ["Source", project.sourceUrl] : project.demoUrl ? ["Demo", project.demoUrl] : null
      return block(
        para("PT", [bold(plain(project.title)), reg(plain(` | ${meta}`))]),
        para("ST", [bold("Stack:"), reg(` ${project.stack.join(", ")}`)]),
        ...bullets(entry.bullets),
        ...(out ? [linkLine(...out)] : []),
      )
    }),
  )

  section(
    "Leadership & creative practice",
    ...leadership.map((entry) =>
      block(
        para("LD", [
          bold(`${plain(entry.name)}:`),
          reg(` ${plain(entry.text)}`),
          ...(entry.name.startsWith("Photography") ? [reg(" "), link("https://nathanglhf.com/")] : []),
        ]),
      ),
    ),
  )

  return { header, sections }
}

// ---- TrueType: metrics, and subsets for embedding ----

export class TrueTypeFont {
  constructor(file) {
    const b = (this.data = readFileSync(file))
    this.tables = {}
    for (let i = 0; i < b.readUInt16BE(4); i++) {
      const o = 12 + 16 * i
      this.tables[b.toString("latin1", o, o + 4)] = { offset: b.readUInt32BE(o + 8), length: b.readUInt32BE(o + 12) }
    }
    const head = this.tables.head.offset
    this.unitsPerEm = b.readUInt16BE(head + 18)
    this.bbox = [0, 2, 4, 6].map((i) => b.readInt16BE(head + 36 + i))
    const longLoca = b.readInt16BE(head + 50) === 1
    this.numGlyphs = b.readUInt16BE(this.tables.maxp.offset + 4)
    const hhea = this.tables.hhea.offset
    this.ascender = b.readInt16BE(hhea + 4)
    this.descender = b.readInt16BE(hhea + 6)
    this.numHMetrics = b.readUInt16BE(hhea + 34)
    const os2 = this.tables["OS/2"]
    this.capHeight = os2 && b.readUInt16BE(os2.offset) >= 2 ? b.readInt16BE(os2.offset + 88) : this.ascender
    const loca = this.tables.loca.offset
    this.loca = Array.from({ length: this.numGlyphs + 1 }, (_, i) =>
      longLoca ? b.readUInt32BE(loca + 4 * i) : 2 * b.readUInt16BE(loca + 2 * i),
    )
    this.cmap = this.readCmap()
    this.postScriptName = this.readName(6)
  }

  readCmap() {
    const b = this.data
    const base = this.tables.cmap.offset
    let sub = null
    for (let i = 0; i < b.readUInt16BE(base + 2); i++) {
      const platform = b.readUInt16BE(base + 4 + 8 * i)
      const encoding = b.readUInt16BE(base + 6 + 8 * i)
      const offset = base + b.readUInt32BE(base + 8 + 8 * i)
      if (platform === 3 && encoding === 1 && b.readUInt16BE(offset) === 4) sub = offset
    }
    if (sub === null) throw new Error("No Unicode cmap (3,1) of format 4")
    const map = new Map()
    const segments = b.readUInt16BE(sub + 6) / 2
    const ends = sub + 14
    const starts = ends + 2 * segments + 2
    const deltas = starts + 2 * segments
    const ranges = deltas + 2 * segments
    for (let s = 0; s < segments; s++) {
      const start = b.readUInt16BE(starts + 2 * s)
      const end = b.readUInt16BE(ends + 2 * s)
      const delta = b.readInt16BE(deltas + 2 * s)
      const range = b.readUInt16BE(ranges + 2 * s)
      for (let c = start; c <= end && c !== 0xffff; c++) {
        let glyph = range === 0 ? c + delta : b.readUInt16BE(ranges + 2 * s + range + 2 * (c - start))
        if (range !== 0 && glyph !== 0) glyph += delta
        glyph &= 0xffff
        if (glyph) map.set(c, glyph)
      }
    }
    return map
  }

  readName(id) {
    const b = this.data
    const base = this.tables.name.offset
    const strings = base + b.readUInt16BE(base + 4)
    for (let i = 0; i < b.readUInt16BE(base + 2); i++) {
      const r = base + 6 + 12 * i
      if (b.readUInt16BE(r) === 3 && b.readUInt16BE(r + 6) === id) {
        const raw = b.subarray(strings + b.readUInt16BE(r + 10), strings + b.readUInt16BE(r + 10) + b.readUInt16BE(r + 8))
        return Buffer.from(raw).swap16().toString("utf16le")
      }
    }
    return null
  }

  glyphOf(char) {
    const glyph = this.cmap.get(char.codePointAt(0))
    if (!glyph) throw new Error(`${this.postScriptName} has no glyph for ${JSON.stringify(char)}`)
    return glyph
  }

  advance(glyph) {
    const i = Math.min(glyph, this.numHMetrics - 1)
    return this.data.readUInt16BE(this.tables.hmtx.offset + 4 * i)
  }

  // Advance in thousandths of an em, rounded as LibreOffice writes it in the PDF's widths (and lays it out).
  width1000(glyph) {
    return Math.round((this.advance(glyph) * 1000) / this.unitsPerEm)
  }

  // Width of a text in points.
  width(text, size) {
    let units = 0
    for (const char of text) units += this.width1000(this.glyphOf(char))
    return (units * size) / 1000
  }

  glyphData(glyph) {
    const glyf = this.tables.glyf.offset
    return this.data.subarray(glyf + this.loca[glyph], glyf + this.loca[glyph + 1])
  }

  // The font with every glyph outside `used` (and the parts of composite glyphs) left empty. Glyph ids
  // do not change, so the PDF can map its codes straight to them.
  subset(used) {
    const keep = new Set([0, ...used])
    const todo = [...keep]
    while (todo.length) {
      const data = this.glyphData(todo.pop())
      if (data.length < 10 || data.readInt16BE(0) >= 0) continue
      for (let p = 10; ; ) {
        const flags = data.readUInt16BE(p)
        const part = data.readUInt16BE(p + 2)
        if (!keep.has(part)) keep.add(part), todo.push(part)
        p += 4 + (flags & 1 ? 4 : 2) + (flags & 8 ? 2 : flags & 0x40 ? 4 : flags & 0x80 ? 8 : 0)
        if (!(flags & 0x20)) break
      }
    }
    const pieces = []
    const loca = Buffer.alloc(4 * (this.numGlyphs + 1))
    let offset = 0
    for (let g = 0; g < this.numGlyphs; g++) {
      loca.writeUInt32BE(offset, 4 * g)
      if (!keep.has(g)) continue
      const data = this.glyphData(g)
      const padded = Buffer.alloc((data.length + 3) & ~3)
      data.copy(padded)
      pieces.push(padded)
      offset += padded.length
    }
    loca.writeUInt32BE(offset, 4 * this.numGlyphs)
    const table = (tag) => {
      const t = this.tables[tag]
      return t && Buffer.from(this.data.subarray(t.offset, t.offset + t.length))
    }
    const head = table("head")
    head.writeUInt32BE(0, 8) // checkSumAdjustment, set below
    head.writeInt16BE(1, 50) // long loca
    // post format 3: no glyph names.
    const post = table("post").subarray(0, 32)
    post.writeUInt32BE(0x00030000, 0)
    // The same tables as the subsets LibreOffice embedded.
    const tables = { "OS/2": table("OS/2"), cmap: table("cmap"), "cvt ": table("cvt "), fpgm: table("fpgm") }
    Object.assign(tables, { glyf: Buffer.concat(pieces), head, hhea: table("hhea"), hmtx: table("hmtx"), loca })
    Object.assign(tables, { maxp: table("maxp"), name: table("name"), post, prep: table("prep") })
    return assembleFont(tables)
  }
}

const checksum = (buffer) => {
  const padded = Buffer.alloc((buffer.length + 3) & ~3)
  buffer.copy(padded)
  let sum = 0
  for (let i = 0; i < padded.length; i += 4) sum = (sum + padded.readUInt32BE(i)) >>> 0
  return sum
}

const assembleFont = (tables) => {
  const tags = Object.keys(tables).filter((tag) => tables[tag]).sort()
  const count = tags.length
  const power = 2 ** Math.floor(Math.log2(count))
  const directory = Buffer.alloc(12 + 16 * count)
  directory.writeUInt32BE(0x00010000, 0)
  directory.writeUInt16BE(count, 4)
  directory.writeUInt16BE(power * 16, 6)
  directory.writeUInt16BE(Math.log2(power), 8)
  directory.writeUInt16BE(count * 16 - power * 16, 10)
  let offset = directory.length
  const bodies = []
  tags.forEach((tag, i) => {
    const data = tables[tag]
    const r = 12 + 16 * i
    directory.write(tag, r, "latin1")
    directory.writeUInt32BE(checksum(data), r + 4)
    directory.writeUInt32BE(offset, r + 8)
    directory.writeUInt32BE(data.length, r + 12)
    const padded = Buffer.alloc((data.length + 3) & ~3)
    data.copy(padded)
    bodies.push(padded)
    offset += padded.length
  })
  const font = Buffer.concat([directory, ...bodies])
  const headAt = directory.readUInt32BE(12 + 16 * tags.indexOf("head") + 8)
  font.writeUInt32BE((0xb1b0afba - checksum(font)) >>> 0, headAt + 8)
  return font
}

// ---- Layout: lines, wrapping and pages ----

// Splits a paragraph into pieces that may end a line: after spaces, and after a hyphen between a letter or
// digit and a letter (never after "/", as in the old file's "keyboard/touch"). A "\n" forces a new line.
const pieces = (runs) => {
  const chars = []
  runs.forEach((run, r) => {
    for (const char of run.text) chars.push({ char, r })
  })
  const out = []
  let current = []
  chars.forEach((c, i) => {
    if (c.char === "\n") {
      if (current.length) out.push(current)
      out.push("newline")
      current = []
      return
    }
    current.push(c)
    const next = chars[i + 1]
    if (!next) return
    const afterSpace = c.char === " " && next.char !== " "
    const afterHyphen = c.char === "-" && /[\p{L}\p{N}]/u.test(chars[i - 1]?.char ?? "") && /\p{L}/u.test(next.char)
    if (afterSpace || afterHyphen) out.push(current), (current = [])
  })
  if (current.length) out.push(current)
  return out
}

export const layout = (doc, fonts) => {
  const fontOf = (run) => (run.bold ? fonts.bold : fonts.regular)
  const charWidth = (run, char, size) => fontOf(run).width(char, size)

  // Lines of a paragraph: arrays of { run, text } segments. A paragraph with `orElse` uses those runs
  // instead when its own do not fit on one line.
  const wrap = (p, runs = p.runs) => {
    const size = sizeOf(p.kind)
    const x0 = p.bullet ? BULLET_TEXT_X : p.x ?? LEFT
    const lines = [[]]
    let x = x0
    for (const piece of pieces(runs)) {
      if (piece === "newline") {
        lines.push([])
        x = x0
        continue
      }
      const widths = piece.map((c) => charWidth(runs[c.r], c.char, size))
      let trimmed = piece.length
      while (trimmed > 0 && piece[trimmed - 1].char === " ") trimmed--
      const inkWidth = widths.slice(0, trimmed).reduce((a, b) => a + b, 0)
      if (lines.at(-1).length && x + inkWidth > WRAP_AT) lines.push([]), (x = x0)
      lines.at(-1).push(...piece)
      x += widths.reduce((a, b) => a + b, 0)
    }
    if (p.orElse && runs === p.runs && lines.length > 1) return wrap(p, p.orElse)
    return lines.map((chars) => {
      const segments = []
      for (const c of chars) {
        const last = segments.at(-1)
        if (last && last.r === c.r) last.text += c.char
        else segments.push({ r: c.r, text: c.char })
      }
      return { x: x0, segments: segments.map((s) => ({ run: runs[s.r], text: s.text })) }
    })
  }

  const pages = [{ items: [] }]
  const page = () => pages.at(-1)
  const place = (p, lines, firstBaseline) =>
    lines.forEach((line, i) =>
      page().items.push({ ...line, para: p, lineIndex: i, y: firstBaseline - i * pitchOf(p.kind) }),
    )

  // Header, page 1.
  for (const kind of ["name", "tagline", "contact"]) {
    const value = doc.header[kind]
    const runs = typeof value === "string" ? [{ text: value, bold: true }] : value
    const size = sizeOf(kind)
    const width = runs.reduce((sum, run) => sum + fontOf(run).width(run.text, size), 0)
    const p = para(kind, runs)
    place(p, [{ x: CENTER - width / 2, segments: runs.map((run) => ({ run, text: run.text })) }], HEADER[kind])
  }

  let y = HEADER.contact
  let previous = "contact"
  const wrapped = doc.sections.map((b) => ({ ...b, lines: b.paras.map((p) => wrap(p)) }))
  // Baselines of a block's paragraphs, from the line before it (or from the top of a new page).
  const positions = (b, fromY, fromKind) => {
    let at = fromY
    let kind = fromKind
    return b.paras.map((p, i) => {
      const gap = kind === null ? null : GAP[`${kind}>${p.kind}`]
      if (kind !== null && gap === undefined) throw new Error(`No spacing measured for ${kind} > ${p.kind}`)
      at = kind === null ? topOf(p.kind) : at - gap
      const first = at
      at -= (b.lines[i].length - 1) * pitchOf(p.kind)
      kind = p.kind
      return first
    })
  }
  const lowest = (b, firsts) => {
    const i = b.paras.length - 1
    const last = firsts[i] - (b.lines[i].length - 1) * pitchOf(b.paras[i].kind)
    return last - 0.2119 * sizeOf(b.paras[i].kind)
  }
  wrapped.forEach((b, index) => {
    // A heading goes with the block after it.
    const group = (b.heading ? [b, wrapped[index + 1]] : [b]).filter(Boolean)
    let fits = true
    let at = y
    let kind = previous
    for (const g of group) {
      const firsts = positions(g, at, kind)
      if (lowest(g, firsts) < BOTTOM) fits = false
      const i = g.paras.length - 1
      at = firsts[i] - (g.lines[i].length - 1) * pitchOf(g.paras[i].kind)
      kind = g.paras[i].kind
    }
    if (!fits) pages.push({ items: [] }), (previous = null)
    const firsts = positions(b, y, previous)
    b.paras.forEach((p, i) => place(p, b.lines[i], firsts[i]))
    const i = b.paras.length - 1
    y = firsts[i] - (b.lines[i].length - 1) * pitchOf(b.paras[i].kind)
    previous = b.paras[i].kind
  })
  return pages
}

// ---- PDF ----

const num = (n) => {
  const s = (Math.round(n * 1000) / 1000).toFixed(3).replace(/\.?0+$/, "")
  return s === "-0" ? "0" : s
}
const rgb = ([r, g, b]) => [r, g, b].map((c) => (c / 255).toFixed(6).replace(/\.?0+$/, "")).join(" ")
const pdfString = (s) => `(${s.replace(/[\\()]/g, (c) => `\\${c}`)})`

export const writePdf = (pages, fonts, { date = new Date() } = {}) => {
  const objects = []
  const alloc = () => objects.push(null)
  const set = (id, body) => (objects[id - 1] = typeof body === "string" ? Buffer.from(body, "latin1") : body)
  const stream = (dict, data) => {
    const packed = deflateSync(data, { level: 9 })
    return Buffer.concat([Buffer.from(`<<${dict}/Length ${packed.length}/Filter/FlateDecode>>\nstream\n`, "latin1"), packed, Buffer.from("\nendstream", "latin1")])
  }

  const catalog = alloc()
  const pagesId = alloc()
  const structRoot = alloc()
  const parentTree = alloc()
  const fontIds = { regular: alloc(), bold: alloc() }
  const used = { regular: new Set(), bold: new Set() }
  const toUnicode = { regular: new Map(), bold: new Map() }

  // Structure tree: Document > P | L > LI > Lbl + LBody > P, with Link elements for the links.
  const elements = []
  const element = (type, parent) => {
    const e = { id: alloc(), type, parent, kids: [] }
    elements.push(e)
    parent?.kids.push(e)
    return e
  }
  const documentElement = element("Document", null)
  const parentTreeNums = []

  const pageIds = []
  let structParent = 0
  let lastList = null
  pages.forEach((pageData) => {
    const pageId = alloc()
    pageIds.push(pageId)
    const pageIndex = structParent++
    const mcidOwners = []
    const annots = []
    const ops = []
    const rules = []
    let paraElement = null
    let currentPara = null
    const mark = (owner) => {
      mcidOwners.push(owner)
      const mcid = mcidOwners.length - 1
      owner.page ??= pageId
      owner.kids.push({ mcid, page: pageId })
      return mcid
    }
    for (const item of pageData.items) {
      const p = item.para
      const size = sizeOf(p.kind)
      if (p !== currentPara) {
        currentPara = p
        if (p.bullet) {
          if (!lastList || lastList.page !== pageId || !lastList.open) lastList = { el: element("L", documentElement), page: pageId, open: true }
          const li = element("LI", lastList.el)
          const lbl = element("Lbl", li)
          const body = element("LBody", li)
          paraElement = element("P", body)
          ops.push(`/Lbl <</MCID ${mark(lbl)}>>BDC`)
          ops.push(textOp(fonts, used, toUnicode, "regular", size, COLORS.text, BULLET_X, item.y, "●"))
          ops.push("EMC")
        } else {
          if (lastList) lastList.open = false
          paraElement = element("P", documentElement)
        }
        if (p.kind === "H") rules.push(item.y - RULE.below)
      }
      let x = item.x
      for (const { run, text } of item.segments) {
        const face = run.bold ? "bold" : "regular"
        const width = fonts[face].width(text, size)
        const color = COLORS[run.color ?? "text"]
        if (run.href) {
          const linkElement = element("Link", paraElement)
          const mcid = mark(linkElement)
          ops.push(`/Link <</MCID ${mcid}>>BDC`)
          ops.push(textOp(fonts, used, toUnicode, face, size, color, x, item.y, text))
          const drop = size <= 10 ? 1.1 : 1.2
          ops.push(`q 1 0 0 1 ${num(x)} ${num(item.y)} cm\n0.5 w ${rgb(color)} RG\n0 ${num(-drop)} m ${num(width)} ${num(-drop)} l S\nQ`)
          ops.push("EMC")
          const annot = alloc()
          const sp = structParent++
          set(annot, `<</Type/Annot/Subtype/Link/Border[0 0 0]/Rect[${[x - 0.1, item.y - 0.245 * size, x + width + 0.1, item.y + 0.905 * size].map(num).join(" ")}]/A<</Type/Action/S/URI/URI${pdfString(run.href)}>>/StructParent ${sp}/P ${pageId} 0 R>>`)
          annots.push(annot)
          linkElement.annot = annot
          parentTreeNums.push([sp, `${linkElement.id} 0 R`])
        } else {
          const mcid = mark(paraElement)
          ops.push(`/P <</MCID ${mcid}>>BDC`)
          ops.push(textOp(fonts, used, toUnicode, face, size, color, x, item.y, text))
          ops.push("EMC")
        }
        x += width
      }
    }
    if (lastList) lastList.open = false
    if (rules.length) {
      ops.push(`/Artifact BMC\n${rgb(COLORS.rule)} RG`)
      for (const ry of rules) ops.push(`q ${num(RULE.width)} w 0 J 1 j\n${num(RULE.to)} ${num(ry)} m\n${num(RULE.from)} ${num(ry)} l S\nQ`)
      ops.push("EMC")
    }
    const contents = alloc()
    set(contents, stream("", Buffer.from(ops.join("\n") + "\n", "latin1")))
    set(pageId, `<</Type/Page/Parent ${pagesId} 0 R/MediaBox[0 0 ${PAGE.width} ${PAGE.height}]/Resources<</Font<</F1 ${fontIds.regular} 0 R/F2 ${fontIds.bold} 0 R>>/ProcSet[/PDF/Text]>>${annots.length ? `/Annots[${annots.map((a) => `${a} 0 R`).join(" ")}]` : ""}/Tabs/S/StructParents ${pageIndex}/Contents ${contents} 0 R>>`)
    parentTreeNums.push([pageIndex, `[${mcidOwners.map((o) => `${o.id} 0 R`).join(" ")}]`])
  })

  // Fonts.
  for (const face of ["regular", "bold"]) {
    const font = fonts[face]
    const glyphs = [...used[face]].sort((a, b) => a - b)
    const tag = createHash("md5").update(face + glyphs.join(",")).digest().subarray(0, 6)
    const prefix = [...tag].map((b) => String.fromCharCode(65 + (b % 26))).join("")
    const name = `${prefix}+${font.postScriptName}`
    const scale = 1000 / font.unitsPerEm
    const file = alloc()
    const descriptor = alloc()
    const cid = alloc()
    const cmap = alloc()
    const program = font.subset(glyphs)
    set(file, stream(`/Length1 ${program.length}`, program))
    set(descriptor, `<</Type/FontDescriptor/FontName/${name}/Flags 4/FontBBox[${font.bbox.map((v) => Math.round(v * scale)).join(" ")}]/ItalicAngle 0/Ascent ${Math.round(font.ascender * scale)}/Descent ${Math.round(font.descender * scale)}/CapHeight ${Math.round(font.capHeight * scale)}/StemV ${face === "bold" ? 120 : 80}/FontFile2 ${file} 0 R>>`)
    const widths = glyphs.map((g) => `${g}[${font.width1000(g)}]`).join(" ")
    set(cid, `<</Type/Font/Subtype/CIDFontType2/BaseFont/${name}/CIDSystemInfo<</Registry(Adobe)/Ordering(Identity)/Supplement 0>>/FontDescriptor ${descriptor} 0 R/DW 1000/W[${widths}]/CIDToGIDMap/Identity>>`)
    const entries = glyphs.map((g) => {
      const hex = Buffer.from(toUnicode[face].get(g), "utf16le").swap16().toString("hex").toUpperCase()
      return `<${g.toString(16).padStart(4, "0").toUpperCase()}> <${hex}>`
    })
    const chunks = []
    for (let i = 0; i < entries.length; i += 100) chunks.push(`${Math.min(100, entries.length - i)} beginbfchar\n${entries.slice(i, i + 100).join("\n")}\nendbfchar`)
    const cmapText = `/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <</Registry (Adobe) /Ordering (UCS) /Supplement 0>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange\n${chunks.join("\n")}\nendcmap\nCMapName currentdict /CMap defineresource pop\nend\nend\n`
    set(cmap, stream("", Buffer.from(cmapText, "latin1")))
    set(fontIds[face], `<</Type/Font/Subtype/Type0/BaseFont/${name}/Encoding/Identity-H/DescendantFonts[${cid} 0 R]/ToUnicode ${cmap} 0 R>>`)
  }

  // Structure elements.
  for (const e of elements) {
    const kids = e.kids.map((k) =>
      k.id ? `${k.id} 0 R` : k.page === e.page ? `${k.mcid}` : `<</Type/MCR/Pg ${k.page} 0 R/MCID ${k.mcid}>>`,
    )
    if (e.annot) kids.push(`<</Type/OBJR/Obj ${e.annot} 0 R/Pg ${e.page} 0 R>>`)
    const parent = e.parent ? e.parent.id : structRoot
    set(e.id, `<</Type/StructElem/S/${e.type}/P ${parent} 0 R${e.page ? `/Pg ${e.page} 0 R` : ""}/K[${kids.join(" ")}]>>`)
  }
  parentTreeNums.sort((a, b) => a[0] - b[0])
  set(parentTree, `<</Nums[${parentTreeNums.map(([k, v]) => `${k} ${v}`).join(" ")}]>>`)
  set(structRoot, `<</Type/StructTreeRoot/K[${documentElement.id} 0 R]/ParentTree ${parentTree} 0 R/ParentTreeNextKey ${structParent}>>`)
  set(pagesId, `<</Type/Pages/Kids[${pageIds.map((id) => `${id} 0 R`).join(" ")}]/Count ${pageIds.length}>>`)
  set(catalog, `<</Type/Catalog/Pages ${pagesId} 0 R/PageMode/UseOutlines/StructTreeRoot ${structRoot} 0 R/Lang(en-US)/MarkInfo<</Marked true>>>>`)
  const pad = (n) => String(n).padStart(2, "0")
  const stamp = `D:${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  const info = alloc()
  set(info, `<</CreationDate(${stamp})/ModDate(${stamp})>>`)

  const parts = [Buffer.from("%PDF-1.7\n%\xE2\xE3\xCF\xD3\n", "latin1")]
  const offsets = []
  let length = parts[0].length
  objects.forEach((body, i) => {
    if (!body) throw new Error(`Object ${i + 1} was never written`)
    const chunk = Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`, "latin1"), body, Buffer.from("\nendobj\n", "latin1")])
    offsets.push(length)
    parts.push(chunk)
    length += chunk.length
  })
  const id = createHash("md5").update(Buffer.concat(parts)).digest("hex").toUpperCase()
  const xref = [`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`, ...offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`)].join("")
  parts.push(Buffer.from(`${xref}trailer\n<</Size ${objects.length + 1}/Root ${catalog} 0 R/Info ${info} 0 R/ID[<${id}><${id}>]>>\nstartxref\n${length}\n%%EOF\n`, "latin1"))
  return Buffer.concat(parts)
}

// One text run: glyph ids as 2-byte codes (Identity-H), positioned as LibreOffice wrote them.
const textOp = (fonts, used, toUnicode, face, size, color, x, y, text) => {
  const font = fonts[face]
  let hex = ""
  for (const char of text) {
    const glyph = font.glyphOf(char)
    used[face].add(glyph)
    toUnicode[face].set(glyph, char)
    hex += glyph.toString(16).padStart(4, "0")
  }
  return `q ${rgb(color)} rg\nBT\n${num(x)} ${num(y)} Td /${face === "bold" ? "F2" : "F1"} ${num(size)} Tf<${hex.toUpperCase()}>Tj\nET\nQ`
}

export const loadFonts = () => {
  const dirs = [process.env.RESUME_FONTS, path.join(root, "scripts/resume-pdf/fonts")].filter(Boolean)
  for (const dir of dirs) {
    const regular = path.join(dir, "LiberationSans-Regular.ttf")
    const boldFile = path.join(dir, "LiberationSans-Bold.ttf")
    if (existsSync(regular) && existsSync(boldFile)) return { regular: new TrueTypeFont(regular), bold: new TrueTypeFont(boldFile) }
  }
  throw new Error(`LiberationSans-Regular.ttf and LiberationSans-Bold.ttf not found in: ${dirs.join(", ")}`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const fonts = loadFonts()
  const pages = layout(buildResume(loadData()), fonts)
  const pdf = writePdf(pages, fonts)
  writeFileSync(path.join(root, OUT), pdf)
  console.log(`${OUT}: ${pages.length} pages, ${pdf.length} bytes (${fonts.regular.readName(5)})`)
}
