# HTML to Next.js migration backlog

## Goal

Convert the Geoanalysis public-site and CMS prototypes into real Next.js App Router pages while preserving their visual system, bilingual content, responsive behavior, and demonstrated interactions.

Completion means:

- every prototype screen has a direct URL;
- navigation uses `next/link`, not in-memory page switching;
- shared shells and repeated patterns live in `components/`;
- pages remain Server Components unless an interaction requires a Client Component;
- browser-initiated submissions and future CMS mutations cross validated Next.js Route Handlers before reaching privileged code;
- French remains the default interface language;
- the app passes lint, production build, keyboard, reduced-motion, and narrow-screen checks;
- no new runtime dependency is added unless existing Next.js, React, and CSS cannot meet a requirement.

## Source map

Use these files as the visual and content references:

- `.project/Design système couleurs et navigation/GEOANALYSIS.dc.html`: public website. It contains 13 screen states: home, firm, expertise list, expertise detail, projects list, project detail, methods, news list, news detail, articles list, article detail, contact, and design system.
- `.project/Design système couleurs et navigation/GEOANALYSIS CMS.dc.html`: CMS source. It contains dashboard, expertise, projects, articles, news, media, team, partners, messages, settings, editor drawer, delete confirmation, and toast states.
- `.project/Design système couleurs et navigation/cms-export-src.html`: same CMS source plus a bundler thumbnail. Do not implement it separately.
- `.project/Design système couleurs et navigation/GEOANALYSIS CMS (standalone).html`: bundled copy of the CMS and its runtime. Do not implement it separately.
- `.project/Design système couleurs et navigation/support.js`: prototype runtime only. Do not copy or import it into Next.js.
- `DESIGN_SYSTEM.md`: authoritative palette, typography, spacing, responsive, and accessibility rules.
- `.project/Design système couleurs et navigation/uploads/Capture d'écran 2026-07-16 à 17.03.33.png`: original logo photo reference.
- `public/geoanalysis-logo.png`: app-ready logo asset.

## Target architecture

Use this structure. Create a file only when its issue needs it.

```text
app/
  layout.tsx
  page.tsx                         # redirect to /fr
  [lang]/
    layout.tsx                     # validate fr | en
    page.tsx                       # public home
    bureau/page.tsx
    expertises/page.tsx
    expertises/[slug]/page.tsx
    realisations/page.tsx
    realisations/[slug]/page.tsx
    methodes-technologies/page.tsx
    actualites/page.tsx
    actualites/[slug]/page.tsx
    articles/page.tsx
    articles/[slug]/page.tsx
    contact/page.tsx
    design-system/page.tsx
  admin/
    layout.tsx
    page.tsx
    expertises/page.tsx
    realisations/page.tsx
    articles/page.tsx
    actualites/page.tsx
    mediatheque/page.tsx
    equipe/page.tsx
    partenaires/page.tsx
    messages/page.tsx
    parametres/page.tsx
  api/
    contact/route.ts
    admin/
      expertises/route.ts
      expertises/[id]/route.ts
      realisations/route.ts
      realisations/[id]/route.ts
      articles/route.ts
      articles/[id]/route.ts
      actualites/route.ts
      actualites/[id]/route.ts
      media/route.ts
      equipe/route.ts
      equipe/[id]/route.ts
      partenaires/route.ts
      partenaires/[id]/route.ts
      messages/[id]/route.ts
      parametres/route.ts
components/
  shared/
  site/
  admin/
lib/
  content/
    site.ts
    admin.ts
  server/
    auth.ts
    validation.ts
    rate-limit.ts
    data/                          # server-only data access and safe DTOs
  i18n.ts
```

Architecture rules:

- `app/**/page.tsx` selects data, sets metadata, and composes components. Keep page files thin.
- `components/site/` contains public-site presentation. `components/admin/` contains CMS presentation. `components/shared/` contains only components used by both surfaces.
- `lib/content/` holds typed fixture content extracted from the prototypes. It contains no JSX and no browser APIs.
- `lib/server/` is the only place allowed to read secrets, sessions, or persistent data. Mark its entry modules with `import "server-only"`.
- `lib/i18n.ts` owns `Locale`, locale validation, localized value selection, and locale-preserving href generation.
- Keep state inside the smallest interactive Client Component. Do not add a global state library.
- Do not create repositories, services, factories, dependency injection, or generic schema-driven renderers for static fixture data.
- Use CSS classes and shared variables. Do not carry inline styles from the HTML prototypes into JSX.

## Confirmed shared components

Create these only when their first listed issue is implemented. Extend them when later issues prove another shared use.

- `components/shared/brand-logo.tsx`: logo and accessible brand name; used by both shells.
- `components/shared/language-switcher.tsx`: FR/EN links that preserve the current destination.
- `components/shared/status-badge.tsx`: published, draft, review, and message status text plus color; used by dashboard and admin lists.
- `components/site/site-header.tsx` and `site-footer.tsx`: all public pages.
- `components/site/page-hero.tsx`: repeated interior-page kicker, title, and lead block.
- `components/site/project-card.tsx`: home, project index, expertise detail, and related projects.
- `components/site/editorial-card.tsx`: news and article indexes, home previews, and related content.
- `components/admin/admin-sidebar.tsx`, `admin-topbar.tsx`, and `admin-shell.tsx`: all CMS pages.
- `components/admin/filter-bar.tsx`: projects, articles, news, and media.
- `components/admin/editor-drawer.tsx`: expertise, project, article, news, team, partner, and message editing.
- `components/admin/confirm-dialog.tsx` and `toast.tsx`: destructive confirmation and operation feedback.

Do not extract one-off page sections. Extract a component after the same structure appears twice or when it owns an interaction or accessibility contract.

---

## Issue 01 — Establish routes, content types, and migration guardrails

**Outcome:** Every target page has a stable route and a typed data source before visual conversion starts.

**Depends on:** none.

**Work:**

- Replace current root dashboard route with a redirect from `/` to `/fr`.
- Create the route folders listed in **Target architecture** with minimal valid pages.
- Validate `[lang]` against `fr` and `en`; call `notFound()` for any other value.
- In Next.js 16 pages, treat `params` as a promise and `await` it.
- Add `Locale`, `LocalizedText`, and minimal content types in `lib/i18n.ts` and the relevant content file. Keep types close to their data.
- Extract public content arrays and CMS fixture arrays from the prototype scripts. Preserve IDs, ordering, labels, dates, filters, and FR/EN values.
- Give public expertise, project, news, and article entries stable slugs. Use those slugs in route generation and lookup.
- Add `generateStaticParams()` for both locales and every known public detail slug.
- Add `not-found.tsx` behavior for unknown content slugs.
- Document that CMS edits remain in-memory prototype behavior until a backend issue is separately approved.

**Acceptance:**

- `/` redirects to `/fr`.
- Every route in the architecture tree renders without a runtime error.
- `/de`, an unknown expertise slug, and an unknown project slug render the not-found UI.
- Content data has no JSX, `window`, or React state.
- No prototype runtime or bundled HTML is imported.
- `npm run lint` and `npm run build` pass.

**Non-goals:** visual fidelity, persistence, authentication, API routes, database schema.

---

## Issue 02 — Build the public shell and locale-aware navigation

**Outcome:** All public routes share one responsive, keyboard-accessible header and footer.

**Depends on:** Issue 01.

**Work:**

- Create `BrandLogo`, `LanguageSwitcher`, `SiteHeader`, `MobileNavigation`, and `SiteFooter`.
- Put shared public chrome in `app/[lang]/layout.tsx`.
- Convert prototype click handlers to semantic `Link` elements. Use `button` only for opening and closing the mobile menu.
- Preserve active navigation with `aria-current="page"`.
- Preserve current public path when switching languages. If a translated detail slug does not exist, use the matching record ID to build the other locale URL.
- Keep the public nav labels from the prototype: Accueil, Le Bureau, Nos Expertises, Réalisations, Méthodes & Technologies, Actualités, Articles, Contact.
- Implement the desktop navigation at the prototype breakpoint and a mobile disclosure below it.
- Close the mobile menu after navigation and on Escape. Restore focus to the menu trigger.
- Add a first-focusable “Aller au contenu” skip link.
- Use `next/image` for the logo and existing local image assets.
- Move repeated inline colors, dimensions, focus styles, and typography into `app/globals.css` using existing variables.

**Acceptance:**

- Header and footer render once through the locale layout on every public page.
- All destinations work with direct load, browser back/forward, Cmd/Ctrl-click, and middle-click.
- Mobile menu is operable by keyboard and exposes its expanded state.
- Focus is visible on every link and button.
- At 320px width and 200% zoom, no public navigation item or primary action becomes unreachable.
- FR/EN switching keeps the user on the equivalent page.

**Non-goals:** animated route transitions, third-party menu component, external CMS.

---

## Issue 03 — Convert the public home page

**Outcome:** `/fr` and `/en` reproduce the complete public home state with real links.

**Depends on:** Issues 01–02.

**Work:**

- Compose the hero, desktop metrics, firm introduction, pillars, expertise preview, process steps, methods preview, projects preview, news preview, and articles preview.
- Create `SectionHeading`, `ProjectCard`, and `EditorialCard` only for structures that repeat on later routes.
- Link each card to its real detail route.
- Keep one page `<h1>` and use descending headings for sections and cards.
- Replace decorative image placeholders with semantic containers using empty alt text only when an actual decorative image is present.
- Keep motion optional. Wrap the prototype entrance treatment in `prefers-reduced-motion: no-preference` or omit it.
- Add locale-specific metadata title and description.

**Acceptance:**

- All home sections from the prototype appear in the same order.
- Every “all”, “learn more”, expertise, project, news, and article action reaches a real route.
- Cards use shared components where their structure repeats.
- Home renders as a Server Component except for shell interactions.
- Layout remains readable at 320px, 680px, 1080px, and 1440px.

**Non-goals:** carousel, analytics, CMS fetching, decorative animation beyond the reference.

---

## Issue 04 — Convert the firm page

**Outcome:** `/[lang]/bureau` reproduces the firm overview and values page.

**Depends on:** Issues 01–02.

**Work:**

- Build the shared interior `PageHero` from the page kicker, title, and lead pattern.
- Render the two firm content blocks and the values list from typed localized data.
- Reuse `PageHero`; keep unique page sections local to the page.
- Add locale-specific metadata.

**Acceptance:**

- Content and order match the `isAbout` prototype state.
- One `<h1>` exists; “Nos valeurs” is a subordinate heading.
- No page-only wrapper is promoted into `components/` without a second use.
- Page works without client JavaScript.

---

## Issue 05 — Convert expertise index and detail routes

**Outcome:** Users can browse all expertise areas and open a stable detail URL.

**Depends on:** Issues 01–04.

**Work:**

- Build `/[lang]/expertises` from the three prototype expertise groups and their sub-services.
- Build `/[lang]/expertises/[slug]` from selected expertise data.
- Detail page must include breadcrumb/back link, title, summary, sub-services, method, technology, deliverables, audience, and related projects.
- Reuse `PageHero`, `ProjectCard`, and section-heading patterns.
- Use `generateMetadata()` for expertise detail pages.
- Use `notFound()` when lookup fails.

**Acceptance:**

- Mining, environment, and water expertise records each have a stable URL.
- Index links open the matching detail content after direct refresh.
- Related-project links open the correct project route.
- Lists use semantic `ul`/`ol` where order or grouping has meaning.
- No client state is used for route selection.

---

## Issue 06 — Convert project index and detail routes

**Outcome:** Users can filter the project index and open complete project pages.

**Depends on:** Issues 01–03 and 05.

**Work:**

- Build `/[lang]/realisations` using `ProjectCard`.
- Represent expertise filtering in the URL query string, for example `?expertise=mining`, so filters survive refresh and sharing.
- Use links for filters; expose the active filter with text and `aria-current` or equivalent state.
- Build `/[lang]/realisations/[slug]` with breadcrumb/back link, metadata, gallery, method, results, and contact call to action.
- Keep placeholder gallery visuals accessible and clearly decorative until real images exist.
- Add detail metadata and unknown-slug handling.

**Acceptance:**

- All six prototype projects render.
- Filtered results match project domain IDs and persist on refresh.
- Detail pages show the selected project, not a shared default record.
- Gallery, methods, and results remain usable at 320px and 200% zoom.
- Contact call to action links to the localized contact route.

**Non-goals:** animated filtering, lightbox, remote image service.

---

## Issue 07 — Convert methods and technologies page

**Outcome:** `/[lang]/methodes-technologies` exposes every method group from the prototype.

**Depends on:** Issues 01–03.

**Work:**

- Reuse `PageHero` and section-heading styles.
- Render method groups and their items from localized data.
- Preserve prototype grouping and reading order.
- Add locale-specific metadata.

**Acceptance:**

- All method groups and entries from `methodGroups` render in both locales.
- Semantic heading order matches visual hierarchy.
- Page requires no Client Component.

---

## Issue 08 — Convert news and article indexes and details

**Outcome:** News and articles have reusable list/detail patterns without duplicated page markup.

**Depends on:** Issues 01–03.

**Work:**

- Create `EditorialCard` for the shared category, date, reading time, title, teaser, and image-placeholder structure.
- Create a small `EditorialDetail` composition only if news and article detail markup stays structurally identical after conversion.
- Build `/[lang]/actualites` and `/[lang]/actualites/[slug]`.
- Build `/[lang]/articles` and `/[lang]/articles/[slug]`.
- Detail pages must include back link, metadata, title, teaser, body, and related items. Article detail also keeps the contact call to action.
- Add `generateMetadata()`, `generateStaticParams()`, and `notFound()` behavior.

**Acceptance:**

- All prototype news and article records have direct URLs.
- Related cards exclude the current record and link to correct records.
- Reading-time text appears only where the source provides it.
- Indexes and details share components without a generic “content page builder”.
- Pages work without client state.

---

## Issue 09 — Convert contact and design-system pages

**Outcome:** Remaining public prototype states have direct routes and correct semantics.

**Depends on:** Issues 01–03.

**Work:**

- Build `/[lang]/contact` with name, company, email, phone, project type, and message fields from the prototype.
- Use a real `<form>`, visible `<label>` elements, correct `name`, `type`, `autocomplete`, and `inputmode` attributes.
- Use native radio inputs for project type instead of clickable `div` elements.
- Validate on submit. Show field-specific recovery text and focus the first invalid field.
- Keep submit behavior local and explicit: demo success state only. Do not imply a message reached a server.
- Build `/[lang]/design-system` from the prototype palette and spacing reference, backed by variables from `app/globals.css`.
- Keep design-system navigation out of the primary public nav; retain the footer link.

**Acceptance:**

- Contact form completes by keyboard alone.
- Every field has a persistent accessible name.
- Invalid input explains how to recover; success state is announced through a polite live region.
- Design-system swatches use shared variables, not duplicated hex literals.
- Both routes render in French and English.

**Non-goals:** email delivery, spam protection, server persistence. Add those only with an approved backend issue.

---

## Issue 10 — Build the admin shell and migrate the dashboard

**Outcome:** `/admin` reproduces the CMS dashboard inside one reusable admin shell.

**Depends on:** Issue 01.

**Work:**

- Move the current dashboard implementation from `app/page.tsx` to `/admin` and split it into `AdminShell`, `AdminSidebar`, `AdminTopbar`, `StatCard`, `RecentContentPanel`, and `PipelinePanel` where repetition proves the boundary.
- Convert sidebar entries and “Tout voir” actions to `Link` elements for real admin routes.
- Keep nonfunctional global search visually present only if it is disabled and labeled as unavailable. Prefer wiring it to the current page list in later issues.
- Use `StatusBadge` for all dashboard statuses.
- Preserve the 252px desktop sidebar, 72px top bar, mobile horizontal nav, French-first copy, and IBM Plex fonts.
- Keep active-route detection in the smallest Client Component that needs `usePathname()`.
- Keep dashboard data in `lib/content/admin.ts`.

**Acceptance:**

- `/admin` direct load shows all four metrics, three recent-content panels, and pipeline.
- Each sidebar and dashboard destination opens a real route.
- Static controls are not announced as interactive.
- Admin shell works at 320px, 680px, 900px, 1200px, and 1560px.
- Dashboard page remains a Server Component except active-navigation behavior.

---

## Issue 11 — Build the shared admin edit workflow through expertise management

**Outcome:** `/admin/expertises` proves the reusable edit, confirm, status, and feedback components end to end.

**Depends on:** Issue 10.

**Work:**

- Build expertise and nested sub-service rows with publish/unpublish, expand/collapse, edit, delete, add sub-service, and add expertise actions.
- Create `EditorDrawer`, `ConfirmDialog`, and `Toast` during this issue because all later admin entities reuse them.
- Use native buttons, form fields, select elements, and disclosure state.
- Drawer must move focus inside, trap focus, close on Escape, mark background inert, and restore focus to its trigger.
- Confirmation dialog must name the item and repeat the destructive action in its button label.
- Keep mutations in an in-memory Client Component store scoped to the admin prototype. Preserve state while navigating within the mounted page; document reset on refresh.
- Reuse `StatusBadge`; do not create expertise-specific copies.
- Implement reorder controls with Move up/Move down buttons. Do not rely on drag alone.

**Acceptance:**

- User can add, edit, publish, unpublish, reorder, and delete an expertise or sub-service in demo state.
- Delete always requires confirmation and Cancel restores focus.
- Drawer fields expose FR and EN tabs and the source fields relevant to expertise.
- All interactions work by keyboard and have visible focus.
- Refresh behavior is explicitly labeled as demo-only, not saved.

**Non-goals:** database persistence, rich-text library, drag-and-drop dependency.

---

## Issue 12 — Convert admin projects, articles, and news

**Outcome:** Three content-management routes reuse filtering, status, and editor infrastructure.

**Depends on:** Issues 10–11.

**Work:**

- Build `/admin/realisations` with expertise filters, search, count, rows, status actions, edit, delete, empty state, and pagination presentation from the prototype.
- Build `/admin/articles` and `/admin/actualites` with a shared editorial list component, category/status filters, tags, metadata, and entity-specific labels.
- Extend `EditorDrawer` with project, article, and news field configurations without turning the entire UI into a generic schema renderer.
- Add project gallery editing, image caption, cover selection, and accessible remove controls.
- Implement search in `AdminTopbar` against the current route’s list through a small route-scoped Client Component.
- Use real buttons for filters and actions. State must be expressed through text or `aria-pressed`, not color alone.

**Acceptance:**

- Each route directly loads and shows its complete fixture list.
- Search and filters combine correctly and expose a useful empty state with a clear reset action.
- Project, article, and news forms show only fields from their prototype definitions.
- Gallery cover selection remains identifiable without color.
- Publish, edit, and delete behavior reuses Issue 11 infrastructure.

**Non-goals:** real pagination requests, media uploads, WYSIWYG editor dependency.

---

## Issue 13 — Convert admin media, team, and partners

**Outcome:** Asset and directory management routes preserve the remaining collection workflows.

**Depends on:** Issues 10–12.

**Work:**

- Build `/admin/mediatheque` with upload zone, progress demo, file-type filters, and media grid.
- Implement upload as a clearly labeled local preview. Use a native file input and never claim server persistence.
- Build `/admin/equipe` with list, edit, delete, and keyboard reorder controls.
- Build `/admin/partenaires` with list, edit, and delete actions.
- Extend `EditorDrawer` only with team and partner field variants.
- Reuse `FilterBar`, `ConfirmDialog`, and `Toast`.

**Acceptance:**

- Media filters show correct fixture groups: images, PDF, and other.
- File input has an accessible label; upload progress is announced without interrupting the user.
- Team order can change without drag-and-drop.
- Partner links are validated as URLs before accepting the local draft.
- Delete and edit behavior matches other admin routes.

**Non-goals:** object storage, image optimization pipeline, server upload endpoint.

---

## Issue 14 — Convert messages board and settings

**Outcome:** `/admin/messages` and `/admin/parametres` complete the CMS screen inventory.

**Depends on:** Issues 10–13.

**Work:**

- Build the messages pipeline with columns for new, qualified, quote sent, in progress, won, and lost.
- Keep drag-and-drop as optional pointer enhancement only. Provide an accessible status `<select>` or explicit Move action for keyboard and touch users.
- Open message details in the shared `EditorDrawer`; include contact, company, project type, status, message, and attachment metadata.
- Build settings groups for identity, contact details, social networks, and global SEO.
- Use a real form with one Save settings action and a polite success message.
- Connect the dashboard message badge and pipeline counts to the same fixture state only if a small shared provider can do so without making the whole admin tree client-rendered. Otherwise keep route-local demo state and state the limitation.

**Acceptance:**

- Every message can change status without pointer drag.
- Column counts and empty states update in the current demo session.
- Message attachment is reachable and has a descriptive label.
- Every setting has a visible label and appropriate input type.
- Saving settings reports demo success and never claims persistence.

**Non-goals:** notifications, CRM integration, attachment download service, persistent settings.

---

## Issue 15 — Put submissions and CMS mutations behind secure Next.js APIs

**Outcome:** Real contact and CMS writes use Next.js Route Handlers as validated trust boundaries instead of trusting browser state.

**Depends on:** Issues 09 and 11–14. Start this issue only after the authentication and persistence providers are selected.

**Work:**

- Implement `app/api/**/route.ts` handlers listed in **Target architecture**. Use `POST` for creation, `PATCH` for updates, and `DELETE` for deletion. Never mutate data through `GET`.
- Keep reads used by Server Components direct through the server-only data layer. Do not make Server Components fetch the app's own Route Handlers; that adds an unnecessary HTTP round trip and can break prerendering.
- Create a small server-only data layer that performs authorization and returns minimal safe DTOs. Only this layer may access database credentials, private tokens, or full records.
- Add `requireAdmin()` and call it inside every admin Route Handler. Do not rely on hidden URLs, client guards, or `proxy.ts` as authorization.
- Return `401` when no valid session exists and `403` when the authenticated account lacks permission. Return the same generic response shape without leaking whether a private record exists.
- Store sessions in `HttpOnly`, `Secure`, `SameSite=Lax` or stricter cookies. Rotate the session after authentication and invalidate it on logout.
- Validate every path parameter and request body on the server with explicit allow-lists, length limits, and known enum values. Reject unknown fields instead of spreading request JSON into stored objects.
- Check `Content-Type` before parsing. Enforce body and file size limits and return `413` or `415` where appropriate.
- Protect cookie-authenticated mutations with same-origin `Origin`/`Host` verification. Allow CORS only for an explicitly approved origin; otherwise omit cross-origin access.
- Add rate limiting to `POST /api/contact`, authentication attempts, and uploads. Return `429` with `Retry-After`. Use the deployment platform's distributed limiter; do not use an in-memory map in serverless production.
- Add a honeypot or equivalent low-cost bot check to the contact endpoint. Keep error messages neutral and never echo submitted HTML.
- Sanitize rich content before storage and again before rendering. Do not use `dangerouslySetInnerHTML` with untrusted content.
- For media, prefer direct-to-object-storage uploads through short-lived signed URLs. Validate authenticated ownership, allowed MIME types, magic bytes, extension, maximum size, and generated object keys. Never trust the browser filename or write uploads to the app filesystem.
- Return only fields needed by the current screen. Never return session tokens, internal IDs not required by the client, stack traces, raw database errors, or environment values.
- Set mutation responses to `Cache-Control: no-store`. Use correct status codes: `201`, `204`, `400`, `401`, `403`, `404`, `409`, `413`, `415`, `422`, and `429`.
- Log request IDs, action, result, and actor ID for admin writes. Redact contact messages, credentials, tokens, cookies, and uploaded file contents.
- Replace the demo contact success state with a success message only after `/api/contact` returns a successful response.
- Replace local-only CMS mutations with the matching admin API calls. Use optimistic UI only when failure restores prior state and announces recovery.
- Add security headers in `next.config.ts`, including a deployment-appropriate Content Security Policy, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and frame restrictions. Keep secrets out of `NEXT_PUBLIC_*` variables.
- Add focused tests for unauthenticated, unauthorized, malformed, oversized, wrong-content-type, rate-limited, conflict, missing-record, and successful requests.

**Acceptance:**

- Direct calls to every admin mutation without a valid authorized session fail server-side.
- Changing a client payload cannot set protected fields, publish unauthorized content, or access another record.
- Cross-origin mutation attempts fail before the data layer runs.
- Contact spam bursts receive `429`; normal valid submissions remain available.
- Oversized and disallowed uploads are rejected before storage.
- API responses and logs expose no secrets, raw errors, or unnecessary personal data.
- Server Components read the data layer directly; browser code uses Route Handlers for mutations.
- Security tests, `npm run lint`, and `npm run build` pass.

**Non-goals:** inventing a custom authentication protocol, storing uploads on the Next.js filesystem, generic catch-all admin proxy, exposing the database directly to the browser.

---

## Issue 16 — Consolidate CSS, verify parity, and remove migration residue

**Outcome:** Migrated app is maintainable, accessible, and ready for backend work without prototype code in production paths.

**Depends on:** Issues 01–15.

**Work:**

- Consolidate shared color, type, spacing, surface, focus, status, and layout values in `app/globals.css`. Remove repeated raw values where a design token already exists.
- Keep component selectors grouped by `shared`, `site`, and `admin`. Do not add CSS Modules unless global naming becomes a demonstrated collision problem.
- Add locale-specific metadata to every public route and `robots` metadata that prevents indexing `/admin`.
- Verify all semantic landmarks, one `<h1>` per page, heading order, labels, accessible names, active states, and status text.
- Verify keyboard-only flows for both mobile menus, filters, forms, drawers, dialogs, CMS row actions, and message status changes.
- Verify visible focus, reduced motion, 320px reflow, 200% zoom, long FR/EN strings, and no clipped controls.
- Check text/background contrast using rendered pairs. Fix through shared tokens, then recheck.
- Run `npm run lint` and `npm run build`.
- Remove unused starter SVGs and dead dashboard code only after confirming no imports remain. Preserve all `.project` reference files.
- Update `README.md` with route map, local commands, fixture-data location, and explicit demo-state limitations.

**Acceptance:**

- All source-map screens have a matching route and visual state.
- No production file imports `.dc.html`, `support.js`, the standalone bundle, or remote Google font CSS.
- No clickable `div` remains.
- No inaccessible control, missing visible focus, color-only state, or reduced-motion violation remains.
- All supported pages remain usable at 320px and 200% zoom.
- Lint and production build pass with no migration TODO that blocks the stated goal.

## Explicitly deferred work

These items are not present as real systems in the HTML prototypes and must not be invented during conversion:

- selection and procurement of authentication, database, rate-limit, email, and object-storage providers; choose these before Issue 15 starts;
- custom authentication or cryptography when a maintained provider can supply them;
- contact email delivery and anti-spam;
- rich-text editor dependency;
- analytics, search service, notifications, and CRM integration;
- generic design-system package or Storybook.

Create separate issues when product requirements and backend contracts exist.

## Definition of done for each issue

An issue is complete only when:

1. its direct URL works after refresh;
2. its acceptance list passes;
3. shared patterns reuse existing components instead of copying markup;
4. new interactions use native elements and keyboard paths;
5. `npm run lint` passes;
6. `npm run build` passes when the issue changes routing, metadata, server/client boundaries, or data lookup;
7. no unrelated reference file or user change is modified.
