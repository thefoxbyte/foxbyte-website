# FoxByte website

The marketing site for FoxByte, built with Next.js 16 (App Router), React 19, TypeScript, CSS Modules, Motion and Lenis.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build, every page prerendered |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

## Environment

| Variable | Used for | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph, structured data | `http://localhost:3000` |
| `CONTACT_WEBHOOK_URL` | Where `/api/contact` forwards contact-form messages as JSON (Slack, Zapier, a CRM) | not set: the form says it is not connected and points to GitHub Discussions |

## Layout

```
src/app            routes, metadata, sitemap, robots, manifest, Open Graph image
src/components     layout, home sections, FoxBot, shared UI
src/content        every word on the site: home, product, pages, blog, changelog, legal
src/lib            hooks, theme, smooth scrolling
public/brand       logo files
public/shots       console screenshots
```
