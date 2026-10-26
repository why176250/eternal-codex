# Eternal Codex

Launch-week guides and a searchable reference for **World of Warcraft: Forever** (the Classic+ release, international realms), written for an English-speaking audience.

- Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Content: Markdown guides with frontmatter in `content/guides/`
- Data: seed JSON in `src/data/` (classes, items, dungeons)
- Deploy target: Vercel / Netlify / any Node host (static-first, no DB required for the MVP)

## Run locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm start      # serve the build
```

## Add a guide

1. Create `content/guides/<slug>.md` with frontmatter:

```md
---
title: "Guide title"
description: "One-sentence summary used for cards, meta description, and OG previews."
category: "Leveling"        # Start Here | Systems | Leveling | Classes | Professions | Endgame
date: "2026-10-28"
updated: "2026-10-28"
tags: ["leveling"]
featured: false
confidence: "community"     # verified | community | seed
---
```

2. The page, TOC, sitemap entry, and card all generate automatically.

## Data model

- `src/data/classes.json` — 9 classes, roles, difficulty, leveling notes, dual-spec plan.
- `src/data/items.json` — seed item set (name, slot, type, level, quality, source, note).
- `src/data/dungeons.json` — dungeon/raid ladder with level bands.

The item set is deliberately labelled as a **Classic baseline seed** in the UI. Do not present it as live-verified Forever data until stats are checked in-game.

## Data sources

- `src/data/forever/` is imported from the **Sargeras Info Station** community
  dataset (`https://www.sargerastech.com/api/forever`) via
  `scripts/import-forever.py` and `scripts/import-guides.py`.
- The raw payload stays in `data-import/` and is git-ignored.
- The source is shared for personal, non-commercial reference. Keep the
  attribution note on every imported data page and do not sell access.
- `src/data/*.json` (classes, Classic item seed, dungeon ladder) remains the
  hand-written Classic baseline used by the English guides and BiS pages.

## Editorial rules (important)

- Every guide carries a confidence level (`verified` / `community` / `seed`) and a `updated` date.
- No datamined or leaked source data.
- No paywalls, gold selling, boosting ads, or trackers in the launch build.
- Keep the fan-site disclaimer in the footer and never use official logos as branding.

## SEO checklist (already wired)

- `app/sitemap.ts` and `app/robots.ts`
- Per-page canonical + Open Graph metadata
- Article JSON-LD on guides, ItemList JSON-LD on the database
- `public/og.png` social card
- Set `NEXT_PUBLIC_SITE_URL` at build time to the production domain

## Deployment

```bash
# Vercel
vercel --prod
# or Netlify: build command `pnpm build`, publish `.next` via the Next adapter
```

After the first deploy, submit `https://<domain>/sitemap.xml` to Google Search Console and set `NEXT_PUBLIC_SITE_URL`.

## Before launch

- [ ] Swap `corrections@eternalcodex.example` for a real inbox
- [ ] Replace the placeholder domain in `src/lib/site.ts` (or set the env var)
- [ ] Add real verified item stats after the first in-game checks
- [ ] Add hardcore ruleset content when it opens
- [ ] Set up Search Console + a lightweight analytics alternative only if it can run without tracking scripts
