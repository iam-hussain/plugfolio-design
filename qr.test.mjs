/* Run: node qr.test.mjs
   Proves qr.js emits scannable symbols rather than a plausible-looking grid:
     · every string round-trips back out of its own finished matrix
     · both format-info copies agree — a scanner may read either one
     · the Reed-Solomon syndromes are zero, i.e. a valid codeword
     · over-long input refuses instead of truncating

   It decodes rather than diffing against a reference encoder on purpose:
   pad-codeword conventions differ between encoders, so two byte-different
   matrices can both be correct. Function patterns were checked against a
   reference separately and matched exactly. Exits non-zero on failure. */
import fs from 'fs';

global.window = {};
eval(fs.readFileSync(new URL('./qr.js', import.meta.url), 'utf8'));

/* size → [data codewords, ecc codewords, alignment centre] */
const V = { 21: [19, 7, 0], 25: [34, 10, 18], 29: [55, 15, 22], 33: [80, 20, 26] };
const MASK = [
  (x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0,
  (x, y) => x % 3 === 0,       (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
  (x, y) => (x * y) % 2 + (x * y) % 3 === 0,
  (x, y) => ((x * y) % 2 + (x * y) % 3) % 2 === 0,
  (x, y) => ((x + y) % 2 + (x * y) % 3) % 2 === 0
];

/* Every module a decoder must skip: finders, separators, timing, alignment,
   both format strips. Written out independently of qr.js, so a mistake in
   its map cannot pass itself. */
function reservedMap(size, align) {
  const r = Array.from({ length: size }, () => new Array(size).fill(false));
  const eye = (x0, y0) => {
    for (let y = -1; y < 8; y++) for (let x = -1; x < 8; x++) {
      const px = x0 + x, py = y0 + y;
      if (px >= 0 && py >= 0 && px < size && py < size) r[py][px] = true;
    }
  };
  eye(0, 0); eye(size - 7, 0); eye(0, size - 7);
  for (let i = 0; i < size; i++) { r[6][i] = true; r[i][6] = true; }
  for (let i = 0; i < 9; i++) { r[8][i] = true; r[i][8] = true; }
  for (let i = 0; i < 8; i++) { r[8][size - 1 - i] = true; r[size - 1 - i][8] = true; }
  if (align) for (let y = -2; y < 3; y++) for (let x = -2; x < 3; x++) r[align + y][align + x] = true;
  return r;
}

function formatCopies(m) {
  const size = m.length, a = [], b = [];
  for (let i = 0; i <= 5; i++) { a[i] = m[8][i]; b[i] = m[size - 1 - i][8]; }
  a[6] = m[8][7]; b[6] = m[size - 7][8];
  a[7] = m[8][8]; b[7] = m[8][size - 8];
  a[8] = m[7][8]; b[8] = m[8][size - 7];
  for (let j = 9; j <= 14; j++) { a[j] = m[14 - j][8]; b[j] = m[8][size - 15 + j]; }
  return [a.join(''), b.join('')];
}

function maskOf(m) {
  const bits = formatCopies(m)[0];
  let raw = 0;
  for (let i = 14; i >= 0; i--) raw = (raw << 1) | Number(bits[i]);
  return ((raw ^ 0b101010000010010) >> 10) & 7;
}

/* Walk the zigzag back out and hand over the codewords. */
function codewords(m) {
  const size = m.length, [dw, ec, align] = V[size];
  const res = reservedMap(size, align), f = MASK[maskOf(m)];
  const bits = [];
  let up = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let v = 0; v < size; v++) {
      const y = up ? size - 1 - v : v;
      for (let c = 0; c < 2; c++) {
        const x = right - c;
        if (res[y][x]) continue;
        bits.push(m[y][x] ^ (f(x, y) ? 1 : 0));
      }
    }
    up = !up;
  }
  const w = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) w.push(parseInt(bits.slice(i, i + 8).join(''), 2));
  return { bits, words: w.slice(0, dw + ec), ec };
}

function decode(m) {
  const { bits } = codewords(m);
  const mode = parseInt(bits.slice(0, 4).join(''), 2);
  const n = parseInt(bits.slice(4, 12).join(''), 2);
  let out = '';
  for (let i = 0; i < n; i++) {
    out += String.fromCharCode(parseInt(bits.slice(12 + i * 8, 20 + i * 8).join(''), 2));
  }
  return { mode, text: out };
}

/* GF(256) again, independently, to check the codeword really is valid. */
const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
for (let i = 0, x = 1; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11D; }
for (let j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
const mul = (a, b) => (a && b) ? EXP[LOG[a] + LOG[b]] : 0;
function syndromesZero(words, n) {
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (const w of words) s = mul(s, EXP[i]) ^ w;
    if (s !== 0) return false;
  }
  return true;
}

let pass = 0, fail = 0;
const chk = (name, ok, note) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'} ${name}${note ? ' — ' + note : ''}`);
  ok ? pass++ : fail++;
};

const CASES = [
  'x', 'hi', 'abc', '0123456789',
  'plugfolio.com/mayamoves',
  'https://plugfolio.com/mayamoves',
  'https://plugfolio.com/a-rather-longer-creator-handle-here-ok'
];

for (const t of CASES) {
  const m = window.qrMatrix(t);
  if (!m) { chk(JSON.stringify(t), false, 'returned null'); continue; }
  const size = m.length;
  const d = decode(m);
  chk(`round-trips  ${size}x${size} mask${maskOf(m)}  ${JSON.stringify(t.slice(0, 32))}`,
      d.text === t && d.mode === 4, d.text === t ? '' : `got ${JSON.stringify(d.text)}`);

  const [a, b] = formatCopies(m);
  chk(`  format copies agree`, a === b, a === b ? '' : `${a} vs ${b}`);
  chk(`  dark module set`, m[size - 8][8] === 1);
  const { words, ec } = codewords(m);
  chk(`  Reed-Solomon syndromes zero`, syndromesZero(words, ec));
}

chk('over-long input refuses', window.qrMatrix('x'.repeat(200)) === null);

console.log(`\n  ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
