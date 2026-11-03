# Legacy CMS content backup (3 Nov 2026)

The old PIN-protected admin (`/admin-portal`) and its Express API are being removed.
This folder preserves every piece of content that admin managed, so nothing is lost
and the new Sanity CMS can be seeded from it.

## What is here

| File | Contents |
|---|---|
| `content.json` | Exactly what the live site ships: founder profile, 6 projects, 10 services, 0 testimonials, 8 process steps, 7 FAQs, 3 blog posts (feature already unused), 4 Instagram posts, 3 before/after pairs |
| `review-flags.json` | Every portfolio image classified by source, plus the items the owner must review (see below) |
| `export-content.mjs` | Regenerates both files (`node backups/legacy-cms-2026-11-03/export-content.mjs`) or verifies them (`--verify`) |

The full source snapshot is the local git tag `backup/pre-admin-removal` (commit `189b622`).

## How the backup was verified

1. **Repo = production.** The tagged commit was built locally with the frozen `bun.lock`
   dependencies. `index-DoL0Dy18.js`, `index-DHaFw1ty.css` and the founder photo are
   byte-identical to the files served by https://www.homescapes.studio, so every piece of
   content on the live site is in this repo.
2. **There is no server-side store to export.** On the live site `/api/cms/store` returns the
   HTML page: the Express server never ran on Vercel, so no `cms_store.json` exists in production.
3. **`content.json` matches the source.** `--verify` re-reads the source modules and deep-compares
   every section, and checks the SHA-256 of both founder photos. A deliberately corrupted copy
   fails the check, and the restored file passes.

   The sources have changed since (for example, the stock before/after pairs were removed), so
   verify against the tagged snapshot:

   ```sh
   git worktree add --detach /tmp/hs-verify backup/pre-admin-removal
   cp -R backups /tmp/hs-verify/ && ln -s "$PWD/node_modules" /tmp/hs-verify/node_modules
   (cd /tmp/hs-verify && node backups/legacy-cms-2026-11-03/export-content.mjs --verify)
   git worktree remove --force /tmp/hs-verify
   ```

## Not covered: content that exists only in someone's browser

The old admin saved edits **only in the browser where they were made** (localStorage). Two kinds
of data may exist outside this backup:

- **Owner edits.** If the owner ever logged into `/admin-portal` and changed projects, services,
  FAQs or the founder photo, those changes live only on that phone or computer.
- **Enquiries.** Every booking or contact form ever submitted was saved only in the visitor's own
  browser. The studio never received them, and they cannot be recovered from here.

The new site code no longer reads or deletes these browser keys, so the owner's data stays on
their device until they clear their browser. To export it, the owner opens
https://www.homescapes.studio **on the device they used for the admin** and does one of the following:

- **Option A (no founder photo):** open `/admin-portal`, log in, and use **Export JSON**. This only
  works while the old version is still live.
- **Option B (everything):** open the browser console (desktop Chrome: View → Developer → JavaScript
  Console), paste the snippet below and press Enter. It downloads `homescapes-browser-backup.json`.

```js
(() => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('homescapes_') || key.startsWith('maison_'))) data[key] = localStorage.getItem(key);
  }
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), origin: location.origin, data }, null, 2)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'homescapes-browser-backup.json' });
  document.body.appendChild(a);
  a.click();
  a.remove();
  console.log('Exported keys:', Object.keys(data));
})();
```

That file can contain enquiry details (names, phone numbers, emails). Keep it private and
**do not commit it to this repository**.

## Owner review list

From `review-flags.json`. Nothing here has been removed or replaced: it is listed for the owner to decide.

**Portfolio projects.** All 6 use only Unsplash stock photos (32 images in total). Their locations,
clients and years could not be verified as real Homescapes work.

| Project | Location | Shown as featured |
|---|---|---|
| The Grand Horizon Penthouse | Worli, Mumbai | yes |
| Villa Solaria Estate | Golf Course Road, Gurgaon | yes |
| Aurum Executive Headquarters | BKC, Mumbai | yes |
| Atelier Culinary Studio & Kitchen | Indiranagar, Bengaluru | yes |
| Minimalist Teak Bedroom Sanctuary | Jubilee Hills, Hyderabad | no |
| Assagao Heritage Villa Renovation | Assagao, Goa | no |

**Before/after pairs.** There are 3, all stock photos and all captioned as foreign projects:
TriBeCa (New York), Kensington (London) and Beverly Hills (California).

**Other stock images.** 17 in total: 10 service images, 4 "Instagram" posts and 3 covers on the unused blog.
