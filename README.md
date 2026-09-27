# Geoanalysis

The Geoanalysis administration dashboard is built with Next.js App Router, React, and Tailwind CSS 4.

## Design system

Read [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) before changing the interface. The dashboard applies the Geoanalysis ivory, forest, and green palette, IBM Plex typography, and responsive sidebar layout from the project design reference. The current dashboard content is static sample content.

## Local development

Set `DATABASE_URL` in `.env.local` and apply the schema before opening admin pages:

```bash
npm run db:migrate
npm run dev
```

Project-wide implementation notes are in [AGENTS.md](AGENTS.md).
