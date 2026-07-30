/* ═══════════════════════════════════════════════════════════════════
   A real QR encoder, small enough to ship inline.

   The share panel offers a code you can point a camera at. A decorative
   block of squares that does not decode would be a lie in a deliverable
   people screenshot, so this encodes properly: byte mode, error
   correction L, versions 1–4 (up to 78 bytes — a Plugfolio profile URL
   is around 30). Single ECC block through version 4, which is why there
   is no interleaving step here.

   window.qrMatrix(text) → array of arrays of 0|1, or null if too long.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* version → [size, data codewords, ecc codewords, alignment centre] */
  var V = {
    1: [21, 19,  7, 0],
    2: [25, 34, 10, 18],
    3: [29, 55, 15, 22],
    4: [33, 80, 20, 26]
  };

  /* ── GF(256), primitive polynomial 0x11D ───────────────────────── */
  var EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (function () {
    for (var i = 0, x = 1; i < 255; i++) {
      EXP[i] = x; LOG[x] = i;
      x <<= 1; if (x & 0x100) x ^= 0x11D;
    }
    for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
  })();
  function mul(a, b) { return (a && b) ? EXP[LOG[a] + LOG[b]] : 0; }

  function generator(n) {
    var g = [1];
    for (var i = 0; i < n; i++) {
      var next = new Array(g.length + 1).fill(0);
      for (var j = 0; j < g.length; j++) {
        /* Coefficients run highest-degree first, so multiplying by x keeps
           the index and multiplying by the constant moves it down one. */
        next[j] ^= g[j];
        next[j + 1] ^= mul(g[j], EXP[i]);
      }
      g = next;
    }
    return g;
  }

  function ecc(data, n) {
    var g = generator(n), rem = new Array(n).fill(0);
    for (var i = 0; i < data.length; i++) {
      var factor = data[i] ^ rem[0];
      rem.shift(); rem.push(0);
      for (var j = 0; j < n; j++) rem[j] ^= mul(g[j + 1], factor);
    }
    return rem;
  }

  /* ── bit stream ────────────────────────────────────────────────── */
  function encode(bytes, ver) {
    var dataWords = V[ver][1], bits = [];
    function push(value, len) {
      for (var i = len - 1; i >= 0; i--) bits.push((value >> i) & 1);
    }
    push(0b0100, 4);                 /* byte mode */
    push(bytes.length, 8);           /* count: 8 bits for versions 1–9 */
    for (var i = 0; i < bytes.length; i++) push(bytes[i], 8);

    var cap = dataWords * 8;
    push(0, Math.min(4, cap - bits.length));         /* terminator */
    while (bits.length % 8) bits.push(0);
    var words = [];
    for (var b = 0; b < bits.length; b += 8) {
      words.push(parseInt(bits.slice(b, b + 8).join(''), 2));
    }
    var pad = [0xEC, 0x11], k = 0;
    while (words.length < dataWords) words.push(pad[k++ % 2]);
    return words.concat(ecc(words, V[ver][2]));
  }

  /* ── module placement ──────────────────────────────────────────── */
  function blank(size) {
    var m = [], r = [];
    for (var y = 0; y < size; y++) { m.push(new Array(size).fill(0)); r.push(new Array(size).fill(false)); }
    return { m: m, reserved: r };
  }

  function finder(g, size, x0, y0) {
    /* the 7×7 eye plus its one-module separator */
    for (var y = -1; y <= 7; y++) for (var x = -1; x <= 7; x++) {
      var px = x0 + x, py = y0 + y;
      if (px < 0 || py < 0 || px >= size || py >= size) continue;
      var on = (x >= 0 && x <= 6 && (y === 0 || y === 6)) ||
               (y >= 0 && y <= 6 && (x === 0 || x === 6)) ||
               (x >= 2 && x <= 4 && y >= 2 && y <= 4);
      g.m[py][px] = on ? 1 : 0;
      g.reserved[py][px] = true;
    }
  }

  function skeleton(ver) {
    var size = V[ver][0], g = blank(size), i;
    finder(g, size, 0, 0);
    finder(g, size, size - 7, 0);
    finder(g, size, 0, size - 7);

    /* timing */
    for (i = 8; i < size - 8; i++) {
      g.m[6][i] = g.m[i][6] = (i % 2 === 0) ? 1 : 0;
      g.reserved[6][i] = g.reserved[i][6] = true;
    }

    /* one alignment pattern from version 2 up, bottom-right quadrant */
    var c = V[ver][3];
    if (c) {
      for (var y = -2; y <= 2; y++) for (var x = -2; x <= 2; x++) {
        var on = Math.max(Math.abs(x), Math.abs(y)) !== 1;
        g.m[c + y][c + x] = on ? 1 : 0;
        g.reserved[c + y][c + x] = true;
      }
    }

    /* dark module + the two format-info strips */
    g.m[size - 8][8] = 1; g.reserved[size - 8][8] = true;
    for (i = 0; i <= 8; i++) {
      if (!g.reserved[8][i]) { g.reserved[8][i] = true; }
      if (!g.reserved[i][8]) { g.reserved[i][8] = true; }
    }
    for (i = 0; i < 8; i++) {
      g.reserved[8][size - 1 - i] = true;
      g.reserved[size - 1 - i][8] = true;
    }
    return g;
  }

  function place(g, words, size) {
    var bits = [];
    words.forEach(function (w) { for (var i = 7; i >= 0; i--) bits.push((w >> i) & 1); });

    var idx = 0, up = true;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;                       /* skip the timing column */
      for (var v = 0; v < size; v++) {
        var y = up ? size - 1 - v : v;
        for (var c = 0; c < 2; c++) {
          var x = right - c;
          if (g.reserved[y][x]) continue;
          g.m[y][x] = idx < bits.length ? bits[idx++] : 0;
        }
      }
      up = !up;
    }
  }

  var MASK = [
    function (x, y) { return (x + y) % 2 === 0; },
    function (x, y) { return y % 2 === 0; },
    function (x, y) { return x % 3 === 0; },
    function (x, y) { return (x + y) % 3 === 0; },
    function (x, y) { return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0; },
    function (x, y) { return (x * y) % 2 + (x * y) % 3 === 0; },
    function (x, y) { return ((x * y) % 2 + (x * y) % 3) % 2 === 0; },
    function (x, y) { return ((x + y) % 2 + (x * y) % 3) % 2 === 0; }
  ];

  /* format info: 2 bits ECC (L = 01) + 3 bits mask, BCH(15,5), XOR 0x5412 */
  function formatBits(mask) {
    var v = (0b01 << 3) | mask, d = v << 10;
    for (var i = 4; i >= 0; i--) if (d & (1 << (i + 10))) d ^= 0b10100110111 << i;
    return ((v << 10) | d) ^ 0b101010000010010;
  }

  function writeFormat(m, size, mask) {
    var f = formatBits(mask);
    function bit(i) { return (f >> i) & 1; }
    for (var i = 0; i <= 5; i++) { m[8][i] = bit(i); m[size - 1 - i][8] = bit(i); }
    m[8][7] = bit(6); m[size - 7][8] = bit(6);
    m[8][8] = bit(7); m[8][size - 8] = bit(7);
    m[7][8] = bit(8); m[8][size - 7] = bit(8);
    for (var j = 9; j <= 14; j++) { m[14 - j][8] = bit(j); m[8][size - 15 + j] = bit(j); }
    m[size - 8][8] = 1;   /* the dark module — never a format bit */
  }

  /* The four standard penalty rules. Any mask produces a valid symbol;
     these pick the one a camera reads most reliably. */
  function penalty(m, size) {
    var p = 0, x, y, i, run, dark = 0;

    function line(get) {
      var score = 0;
      for (i = 0; i < size; i++) {
        run = 1;
        for (var j = 1; j < size; j++) {
          if (get(i, j) === get(i, j - 1)) { run++; }
          else { if (run >= 5) score += run - 2; run = 1; }
        }
        if (run >= 5) score += run - 2;
      }
      return score;
    }
    p += line(function (r, c) { return m[r][c]; });
    p += line(function (r, c) { return m[c][r]; });

    for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) {
      var s = m[y][x] + m[y][x + 1] + m[y + 1][x] + m[y + 1][x + 1];
      if (s === 0 || s === 4) p += 3;
    }

    var PAT = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
    function scan(get) {
      var score = 0;
      for (var a = 0; a < size; a++) for (var b = 0; b + 11 <= size; b++) {
        var hit = true, hit2 = true;
        for (var k = 0; k < 11; k++) {
          if (get(a, b + k) !== PAT[k]) hit = false;
          if (get(a, b + k) !== PAT[10 - k]) hit2 = false;
        }
        if (hit || hit2) score += 40;
      }
      return score;
    }
    p += scan(function (r, c) { return m[r][c]; });
    p += scan(function (r, c) { return m[c][r]; });

    for (y = 0; y < size; y++) for (x = 0; x < size; x++) dark += m[y][x];
    p += Math.floor(Math.abs(dark * 100 / (size * size) - 50) / 5) * 10;
    return p;
  }

  window.qrMatrix = function (text) {
    var bytes = [];
    for (var i = 0; i < text.length; i++) {
      var c = text.charCodeAt(i);
      if (c < 128) bytes.push(c);
      else if (c < 2048) bytes.push(192 | (c >> 6), 128 | (c & 63));
      else bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
    }
    var ver = 0;
    for (var v = 1; v <= 4; v++) {
      /* 4 mode bits + 8 count bits = 2 codewords of overhead, less the
         terminator, which may be truncated — hence the exact form. */
      if (bytes.length + 2 <= V[v][1]) { ver = v; break; }
    }
    if (!ver) return null;

    var size = V[ver][0], words = encode(bytes, ver);
    var best = null, bestScore = Infinity;
    for (var mask = 0; mask < 8; mask++) {
      var g = skeleton(ver);
      place(g, words, size);
      for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) {
        if (!g.reserved[y][x] && MASK[mask](x, y)) g.m[y][x] ^= 1;
      }
      writeFormat(g.m, size, mask);
      var sc = penalty(g.m, size);
      if (sc < bestScore) { bestScore = sc; best = g.m; }
    }
    return best;
  };
})();
