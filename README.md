# Farhan & Dr. Sobia — Digital Nikah Invitation

A luxury physical wedding invitation rebuilt as a single, continuous mobile
experience: a sealed envelope that folds open into one uninterrupted sheet of
paper running from the hero to the closing.

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · no animation library.

```bash
npm install
npm run dev          # http://localhost:3000
```

---

## The journey

Closed invitation → fold → hero → date reveal → formal invitation → timeline →
countdown → location → closing. Every stage shares one paper material, one gold,
one typographic scale and one vertical rhythm, so nothing reads as a separate
"section" of a website.

---

## Where to change things

Almost everything lives in two files.

### `data/wedding.ts` — all the words

| To change | Edit |
|---|---|
| **Groom name** | `groom.name` (and `groom.initial` for the wax seal) |
| **Bride name** | `bride.name` (and `bride.initial` for the wax seal) |
| **Parents** | `groom.parents`, `bride.parents` |
| **Date** | `date.day`, `date.month`, `date.year`, and `date.iso` |
| **Events** | the `events` array — see below |
| **Venue** | `venue.city`, `venue.name`, `venue.room` (optional), `venue.mapsUrl`, `venue.mapEmbedUrl` |
| **Bismillah / letter** | `invitation.*` |
| **Closing lines** | `closing.lines` |
| **Music** | `audio.src` |

`date.iso` drives the countdown and `date.day/month/year` drive the scratch
cards — **keep them in agreement**.

The seal monogram (`F & S`) and the closing signature are derived from the
names, so changing a name updates both automatically.

**Events.** Each entry is `{ time, title, image }`, where `image` is a key in
`images.timeline`. Add, remove or reorder freely — the timeline lays itself out
and alternates sides on its own. To use a new illustration, add the file under
`public/images/timeline/` and register it in `data/images.ts`.

### `data/images.ts` — all the artwork

Components reference artwork by key, never by path. To swap a piece of art,
either overwrite the file at the existing path or point the key somewhere new.

**Venue photograph** — none ships with the invitation. Drop one in
`public/images/venue/` and set `venue.exterior` to its path; an arch-masked,
gold-framed plate then appears in the Location section. Left empty, the plate is
omitted entirely rather than filled with a restatement of the address, and
nothing is requested.

**Music** — none ships either. Put an mp3 in `public/audio/` and set
`audio.src` in `data/wedding.ts`. The control then appears once the invitation
is opened. It never autoplays, and with no file the control does not render.

### Regenerating artwork

Original supplied art lives in `assets/source/`. The pipeline crops, slices and
optimises it into `public/images/`:

```bash
npm run assets
```

It also slices the six timeline illustrations out of the single contact sheet
they arrived on. Re-run it after replacing anything in `assets/source/`.

---

## Layout

```
app/                 layout, page, fonts, design system (globals.css)
components/
  InvitationExperience.tsx   owns the seal state and the whole journey
  opening/                   the closed invitation and the fold
  sections/                  hero, date, invitation, timeline, countdown, location, closing
  ui/                        arch, ornament, scratch card, map, music, reveal
data/                wedding.ts (words) · images.ts (artwork)
hooks/               seal state, countdown, audio, scroll progress, in-view, reduced motion
scripts/             prepare-assets.mjs · qa/
assets/source/       original supplied artwork (not served)
assets/reference/    the reference video
public/images/       generated, optimised WebP
```

---

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

The browser-driven checks need Playwright, which is deliberately **not** a
dependency — its postinstall pulls ~150 MB of browsers, and Vercel runs
devDependency install scripts on every deploy. Install it on demand:

```bash
npm i -D playwright && npx playwright install chromium

npm start                    # then, against the running server:
npm run verify               # 24 behavioural checks
npm run shots                # screenshots into .qa-shots/
```

`verify` covers scroll locking, session memory, scratch and keyboard reveal,
reduced motion, the countdown, the absent-music fallback, and horizontal
overflow at 375/390/393/430/768/1024/1440/1920.

---

## Deploying to Vercel

The app is a fully static export target with no environment variables and no
API keys — the map embed is keyless.

```bash
npx vercel          # preview
npx vercel --prod   # production
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new);
Next.js is detected automatically and the defaults are correct.
