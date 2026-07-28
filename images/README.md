# images/

Unsplash fetcher for design assets. One file, no dependencies, Node 18+.

Downloads land in `images/<slug>/` alongside a `credits.json`.

## Usage

```bash
# keyword search — 131 photos (paginates 30 per request)
node images/unsplash.mjs search "mechanical keyboard" 131

# a whole collection (omit the limit to grab all of it)
node images/unsplash.mjs collection 8961198 [limit]

# list a user's collections: id, count, title
node images/unsplash.mjs collections iam-hussain

# self-check
node images/unsplash.mjs test
```

### Options

| Flag | Default | Notes |
|---|---|---|
| `--size=` | `regular` | `raw` \| `full` \| `regular` (1080px) \| `small` (400px) |
| `--out=` | this folder | any directory |
| `--orientation=` | any | `landscape` \| `portrait` \| `squarish` — search only |

```bash
node images/unsplash.mjs search "workspace desk" 40 --size=full --orientation=landscape
node images/unsplash.mjs collection 8961198 --out=./refer/moodboard
```

## credits.json

Written next to every download. Unsplash requires photographer attribution,
and it doubles as a manifest for design work — alt text, dominant colour,
and dimensions per image:

```json
[
  {
    "file": "black-and-orange-computer-keyboard-KYw1eUx1J7Y.jpg",
    "id": "KYw1eUx1J7Y",
    "alt": "black and orange computer keyboard",
    "color": "#262626",
    "width": 5464,
    "height": 3640,
    "photographer": "Jane Doe",
    "photographer_url": "https://unsplash.com/@jane?utm_source=plugfolio&utm_medium=referral",
    "page": "https://unsplash.com/photos/KYw1eUx1J7Y"
  }
]
```

## Auth & rate limits

Each Unsplash demo app allows **50 API requests/hour**. The script holds two
Access Keys and rotates automatically: on a `403` it prints
`key 1/2 exhausted, switching` and retries with the next one. It only fails
once every key is spent.

Add more keys (create another app at unsplash.com/oauth/applications):

```bash
export UNSPLASH_ACCESS_KEY=key1,key2,key3   # comma-separated, overrides built-ins
```

Access Keys are public Client-IDs, safe in this repo. Never add a
**Secret Key** — it isn't used here.

A 131-image search costs ~5 search calls plus 131 download-tracking pings
(an Unsplash API guideline), so budget ~3 keys for one big pull, or apply for
production access (5000/hr). Image bytes come from `images.unsplash.com` and
are not rate limited.

## Telling Claude to use it

> Fetch 60 landscape "modern office workspace" images into `images/`.

> List my Unsplash collections, then download collection 8961198 at full size.
