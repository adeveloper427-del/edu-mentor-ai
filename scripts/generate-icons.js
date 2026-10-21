/**
 * Generates the app icon / splash / favicon PNGs from code, so the project
 * needs no external design assets.
 *
 *   node scripts/generate-icons.js
 *
 * Draws the Edu Mentor robot mark: a friendly white robot on the brand gradient.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// ---------------------------------------------------------------- PNG writer
function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // Each scanline is prefixed with filter type 0.
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ------------------------------------------------------------------ canvas
function createCanvas(size) {
  const data = Buffer.alloc(size * size * 4); // transparent
  const set = (x, y, [r, g, b, a = 255]) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    if (a === 255) {
      data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255;
      return;
    }
    // simple source-over blend
    const sa = a / 255;
    const da = data[i + 3] / 255;
    const oa = sa + da * (1 - sa);
    if (oa === 0) return;
    data[i] = Math.round((r * sa + data[i] * da * (1 - sa)) / oa);
    data[i + 1] = Math.round((g * sa + data[i + 1] * da * (1 - sa)) / oa);
    data[i + 2] = Math.round((b * sa + data[i + 2] * da * (1 - sa)) / oa);
    data[i + 3] = Math.round(oa * 255);
  };
  return { size, data, set };
}

const lerp = (a, b, t) => Math.round(a + (b - a) * t);

/** Anti-aliased coverage helper: how much of this pixel is inside the shape. */
function coverage(inside, x, y) {
  let hits = 0;
  for (let sy = 0; sy < 2; sy++) {
    for (let sx = 0; sx < 2; sx++) {
      if (inside(x + sx * 0.5 + 0.25, y + sy * 0.5 + 0.25)) hits++;
    }
  }
  return hits / 4;
}

function fillShape(canvas, inside, color) {
  for (let y = 0; y < canvas.size; y++) {
    for (let x = 0; x < canvas.size; x++) {
      const c = coverage(inside, x, y);
      if (c > 0) canvas.set(x, y, [color[0], color[1], color[2], Math.round(255 * c)]);
    }
  }
}

const roundedRect = (x0, y0, x1, y1, r) => (px, py) => {
  if (px < x0 || px > x1 || py < y0 || py > y1) return false;
  const cx = Math.min(Math.max(px, x0 + r), x1 - r);
  const cy = Math.min(Math.max(py, y0 + r), y1 - r);
  return (px - cx) ** 2 + (py - cy) ** 2 <= r * r;
};

const circle = (cx, cy, r) => (px, py) => (px - cx) ** 2 + (py - cy) ** 2 <= r * r;

/** Lower half of a ring — used for the smile. */
const smileArc = (cx, cy, r, thickness) => (px, py) => {
  if (py < cy) return false;
  const d = Math.hypot(px - cx, py - cy);
  return d <= r && d >= r - thickness;
};

// ------------------------------------------------------------------ artwork
const BRAND_TOP = [108, 99, 255];   // #6C63FF
const BRAND_MID = [139, 124, 255];  // #8B7CFF
const BRAND_BOT = [255, 107, 154];  // #FF6B9A
const INK = [43, 42, 76];           // #2B2A4C
const WHITE = [255, 255, 255];

function paintGradient(canvas) {
  const { size } = canvas;
  for (let y = 0; y < size; y++) {
    const t = y / (size - 1);
    let c;
    if (t < 0.5) {
      const k = t / 0.5;
      c = [lerp(BRAND_TOP[0], BRAND_MID[0], k), lerp(BRAND_TOP[1], BRAND_MID[1], k), lerp(BRAND_TOP[2], BRAND_MID[2], k)];
    } else {
      const k = (t - 0.5) / 0.5;
      c = [lerp(BRAND_MID[0], BRAND_BOT[0], k), lerp(BRAND_MID[1], BRAND_BOT[1], k), lerp(BRAND_MID[2], BRAND_BOT[2], k)];
    }
    for (let x = 0; x < size; x++) canvas.set(x, y, c);
  }
}

/** Draws the robot mark, scaled to the canvas, centred. `s` scales the mark. */
function paintRobot(canvas, scale = 1) {
  const S = canvas.size;
  const u = (v) => (v / 1024) * S; // design units -> pixels
  const cx = S / 2;

  // Everything is laid out around the centre so `scale` shrinks it evenly.
  const m = (v) => cx + (u(v) - cx) * scale;
  const d = (v) => u(v) * scale;

  // antenna
  fillShape(canvas, circle(cx, m(232), d(34)), WHITE);
  fillShape(canvas, roundedRect(m(496), m(240), m(528), m(340), d(16)), WHITE);

  // head
  fillShape(canvas, roundedRect(m(272), m(330), m(752), m(742), d(96)), WHITE);

  // ears
  fillShape(canvas, roundedRect(m(212), m(452), m(272), m(596), d(28)), WHITE);
  fillShape(canvas, roundedRect(m(752), m(452), m(812), m(596), d(28)), WHITE);

  // eyes
  fillShape(canvas, circle(m(408), m(486), d(52)), INK);
  fillShape(canvas, circle(m(616), m(486), d(52)), INK);

  // cheeks
  fillShape(canvas, circle(m(336), m(600), d(30)), BRAND_BOT);
  fillShape(canvas, circle(m(688), m(600), d(30)), BRAND_BOT);

  // smile
  fillShape(canvas, smileArc(cx, m(566), d(112), d(30)), INK);
}

// ------------------------------------------------------------------- output
function build(name, size, { gradient = true, scale = 1 }) {
  const canvas = createCanvas(size);
  if (gradient) paintGradient(canvas);
  paintRobot(canvas, scale);

  const out = path.join(__dirname, "..", "assets", name);
  fs.writeFileSync(out, encodePng(size, size, canvas.data));
  console.log("wrote", path.relative(process.cwd(), out), `${size}x${size}`);
}

fs.mkdirSync(path.join(__dirname, "..", "assets"), { recursive: true });

build("icon.png", 1024, { gradient: true, scale: 1 });
// Android masks adaptive icons heavily, so keep the mark well inside the frame.
build("adaptive-icon.png", 1024, { gradient: false, scale: 0.62 });
build("splash.png", 1024, { gradient: false, scale: 0.85 });
build("favicon.png", 96, { gradient: true, scale: 1 });
