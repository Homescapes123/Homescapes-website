# Homescapes Studio: website content editor

A [Sanity Studio](https://www.sanity.io/docs/studio) where the owner edits the website's photos and
text without touching code: leadership profiles, portfolio projects, before & after photos, client
reviews, services, FAQs and the studio's contact details.

- **Owner-only.** The Studio requires a Sanity sign-in with an invited account. Website visitors never
  see it and need no account.
- **Separate from the website.** It has its own `package.json` and is not part of the Vercel build.
- **No enquiries here.** Enquiries are emailed to the studio and never stored
  in Sanity (datasets on the free plan are publicly readable).

Status: schemas and editor are ready, with a placeholder project ID. Nothing has been deployed, and
the website does not read from Sanity yet.

## Requirements

- Node.js 22.12 or newer (Sanity Studio v6). Check with `node --version`.
- Install dependencies with the repo's package manager: `npx -y bun@1.4.4 install` (in `studio/`).

## One-time setup (after the business creates its Sanity account)

1. Sign in at [sanity.io/manage](https://www.sanity.io/manage) with the business Gmail account and
   create a project with a dataset named `production`.
2. Copy `.env.example` to `.env` and fill in `SANITY_STUDIO_PROJECT_ID` (and `SANITY_STUDIO_HOST`).
3. Project → API → CORS origins: add `https://www.homescapes.studio`, `http://localhost:3000` and the
   Vercel preview domain, without credentials. The website needs these to read published content.
4. Import the current website content:

   ```sh
   npx -y bun@1.4.4 run seed            # writes seed/content.ndjson from the verified backup
   npx sanity dataset import seed/content.ndjson production --missing
   ```

   `--missing` only creates documents that don't exist yet, so it is safe to run again. All six
   portfolio projects arrive as **Needs owner review**: their photos are stock images.
5. Try it locally with `npx -y bun@1.4.4 run dev` (http://localhost:3333), then publish it with
   `npx sanity deploy` (only with approval). After the first deploy, add the `appId` it prints to
   `deployment` in `sanity.cli.ts`.
6. Members → invite the owner as **Administrator**.

## For the owner

- **Studio details**: email, phone, WhatsApp, address, hours, and headline figures. Remove any
  figure you can't back up.
- **Leadership**: one profile per person, shown side by side. Leave the photo empty until you have
  a real photograph; initials are shown instead.
- **Portfolio projects → Needs owner review**: confirm each project is real and replace stock photos
  with your own, then set *Review status* to *Approved*.
- **Client reviews**: clients leave reviews on the studio's Google listing (the website's "Review Us on
  Google" button). To feature one on the website, add it here only if it is from a real client, tick the
  confirmation box, and publish. Up to three are shown.
- **Before & after**: the section stays hidden on the website until you add your own photos.

## Plan limits (checked 2026-11-04)

Free plan: up to 20 users, Administrator and Viewer roles only, 2 public datasets, 10k documents,
250k API and 1M CDN requests per month, 100 GB assets and 100 GB bandwidth per month.
Growth ($15 per seat per month) adds private datasets and Editor/Contributor roles.
