#!/usr/bin/env node
// Unsplash image fetcher — search by keyword, or pull a whole collection.
//
//   node images/unsplash.mjs search "mechanical keyboard" 131
//   node images/unsplash.mjs collection 8961198       # all photos in a collection
//   node images/unsplash.mjs collections iam-hussain  # list a user's collection ids
//
// Options: --size=raw|full|regular|small (default regular)
//          --out=dir (default: this images/ folder)
//          --orientation=landscape|portrait|squarish   (search only)
//
// Writes images + credits.json (Unsplash requires attribution) into <out>/<slug>/

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Multiple access keys — each demo app gets 50 req/hour, so rotate on 403.
const KEYS = (process.env.UNSPLASH_ACCESS_KEY ||
  'jtEt1YGTPOtKa-NTW0dW48RRnq_vqu_9uPTQP6JIXEk,MjFTmh3hH_H0kIkWn7rJwrubGiaTcX6nkFXXrpOeLqo'
).split(',').map(k => k.trim()).filter(Boolean);
let ki = 0;
const key = () => KEYS[ki];
const API = 'https://api.unsplash.com';
const PER_PAGE = 30; // Unsplash max

const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => a.replace(/^--/, '').split('='))
);
const [cmd, arg1, arg2] = args.filter(a => !a.startsWith('--'));
const SIZE = flags.size || 'regular';
const OUT = flags.out || import.meta.dirname; // download next to this script

const slug = s => (s || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);

async function api(path) {
  for (let tried = 0; tried < KEYS.length; tried++) {
    const res = await fetch(API + path, {
      headers: { Authorization: `Client-ID ${key()}`, 'Accept-Version': 'v1' },
    });
    if (res.status === 403) { // rate limited — burn this key, try the next
      console.warn(`\n  key ${ki + 1}/${KEYS.length} exhausted, switching`);
      ki = (ki + 1) % KEYS.length;
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} on ${path}`);
    return res.json();
  }
  throw new Error(`All ${KEYS.length} keys rate limited (50 req/hour each). Wait an hour, add another key to UNSPLASH_ACCESS_KEY, or apply for production access.`);
}

// Walks pages until `limit` photos collected or the API runs dry.
async function collect(getPage, limit) {
  const photos = [];
  for (let page = 1; photos.length < limit; page++) {
    const body = await getPage(page);
    const batch = Array.isArray(body) ? body : body.results;
    if (!batch?.length) break;
    photos.push(...batch);
    if (batch.length < PER_PAGE) break;
  }
  return photos.slice(0, limit);
}

async function save(photos, name) {
  const dir = join(OUT, slug(name));
  await mkdir(dir, { recursive: true });
  const credits = [];

  for (let i = 0; i < photos.length; i += 8) {
    await Promise.all(photos.slice(i, i + 8).map(async p => {
      const file = `${slug(p.alt_description || p.description || 'photo')}-${p.id}.jpg`;
      const res = await fetch(p.urls[SIZE]);
      await writeFile(join(dir, file), Buffer.from(await res.arrayBuffer()));
      // Unsplash API guideline: ping the download endpoint. Best effort.
      fetch(`${p.links.download_location}?client_id=${key()}`).catch(() => {});
      credits.push({
        file,
        id: p.id,
        alt: p.alt_description,
        color: p.color,
        width: p.width,
        height: p.height,
        photographer: p.user.name,
        photographer_url: `${p.user.links.html}?utm_source=plugfolio&utm_medium=referral`,
        page: p.links.html,
      });
    }));
    process.stdout.write(`\r  ${Math.min(i + 8, photos.length)}/${photos.length}`);
  }

  await writeFile(join(dir, 'credits.json'), JSON.stringify(credits, null, 2));
  console.log(`\n✓ ${credits.length} images → ${dir}`);
}

const orient = flags.orientation ? `&orientation=${flags.orientation}` : '';

switch (cmd) {
  case 'search': {
    const n = Number(arg2) || 30;
    const photos = await collect(
      page => api(`/search/photos?query=${encodeURIComponent(arg1)}&page=${page}&per_page=${PER_PAGE}${orient}`),
      n
    );
    console.log(`"${arg1}" → ${photos.length} photos (${SIZE})`);
    await save(photos, arg1);
    break;
  }
  case 'collection': {
    const info = await api(`/collections/${arg1}`);
    const photos = await collect(
      page => api(`/collections/${arg1}/photos?page=${page}&per_page=${PER_PAGE}`),
      Number(arg2) || info.total_photos
    );
    console.log(`"${info.title}" → ${photos.length} photos (${SIZE})`);
    await save(photos, info.title);
    break;
  }
  case 'collections': {
    const list = await api(`/users/${arg1}/collections?per_page=${PER_PAGE}`);
    for (const c of list) console.log(`${c.id}\t${c.total_photos}\t${c.title}`);
    break;
  }
  case 'test': {
    const { strict: a } = await import('node:assert');
    a.equal(slug('Mechanical Keyboard!! 2024'), 'mechanical-keyboard-2024');
    a.equal(slug(null), 'untitled');
    let pages = 0;
    const fake = async n => { pages++; return Array(PER_PAGE).fill({ id: n }); };
    a.equal((await collect(fake, 131)).length, 131);
    a.equal(pages, 5); // ceil(131/30)
    console.log('ok');
    break;
  }
  default:
    console.log(`Usage:
  node unsplash.mjs search "mechanical keyboard" 131 [--size=regular] [--orientation=landscape]
  node unsplash.mjs collection <id> [limit]
  node unsplash.mjs collections <username>`);
}
