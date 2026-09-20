# Geoanalysis design system

This guide records the visual system in `.project/Design système couleurs et navigation/cms-export-src.html` and the dashboard reference. Use it for every Geoanalysis administration screen so new pages feel part of the same product.

## Product feel

- Calm, precise, and grounded in geography and field work.
- Use a warm ivory canvas, white content surfaces, a forest sidebar, and green for the main action and active state.
- Keep content dense enough for editorial and project management, with clear grouping and generous panel spacing.
- French is the default interface language. Keep labels short and use sentence case except for compact metadata labels.

## Color tokens

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#FBFAF7` | Main workspace canvas |
| `--surface` | `#FFFFFF` | Cards, menus, and fields |
| `--surface-soft` | `#F2F1EC` | Quiet supporting surfaces |
| `--surface-green` | `#EFF7F2` | Published and selected states |
| `--foreground` | `#1C2622` | Main text and sidebar |
| `--muted` | `#5A6661` | Secondary text on light surfaces |
| `--brand` | `#0E8C3F` | Primary action and links |
| `--brand-hover` | `#0A6E31` | Hover and pressed action state |
| `--brand-bright` | `#3FB37B` | Sidebar accent and small highlights |
| `--brand-pale` | `#CDEBD8` | Selection and pale emphasis |
| `--sidebar-muted` | `#B5BEB9` | Secondary labels on the dark sidebar |
| `--border` | `rgba(28, 38, 34, 0.12)` | Card and section boundaries |

Keep semantic meaning visible in text and shape as well as color. Published, draft, review, success, and warning states need a readable label. Use the green palette for positive or active states; reserve red for destructive or failed states.

## Type

- Use IBM Plex Sans for interface copy, headings, and controls.
- Use IBM Plex Mono for breadcrumbs, status labels, timestamps, and compact metadata.
- Use light weights for large counts, medium weights for panel headings, and regular weights for body copy.
- Keep body copy comfortably readable. Reserve uppercase and wide tracking for short metadata labels.
- Enable tabular numerals for counts and metrics.

## Layout and components

- The desktop administration shell uses a 252px forest sidebar and a flexible ivory workspace.
- Keep the top bar at about 72px high. It contains the breadcrumb, page title, search, language selector, and the page's primary action when that action exists.
- Use a 16px gap between dashboard cards. Let metrics wrap into two columns on tablets and phones; reduce to one when the content needs more room.
- Use white cards with a 1px quiet border and a 3px corner radius. Inputs and compact controls use a 2px radius. Avoid large pill shapes except for small count badges.
- Use 18–22px card padding and thin separators between records.
- The sidebar keeps the logo and account area fixed in its frame. Mark the current page with a slim green edge and a subtle green surface.
- Dashboard patterns include metric cards, recent-content lists, labeled status chips, and the compact commercial pipeline.
- On narrow screens, move the sidebar above the workspace and let its navigation scroll horizontally. Keep controls and labels readable without clipping.

## Interaction and accessibility

- Use semantic landmarks, headings in order, labeled fields, native links and buttons, and a visible keyboard focus ring.
- Keep interactive targets at least 40px high; use larger targets on touch-first views where space allows.
- Meet WCAG AA text contrast. The sidebar's secondary copy must stay lighter than the original 45% white treatment where that treatment fails contrast.
- Respect `prefers-reduced-motion`. Motion is optional polish and must not carry state or meaning.
- Do not present a control as active until its action is implemented. Static examples should use non-interactive elements.
- At 320px width, navigation can scroll horizontally, but content, status labels, and controls must remain reachable and legible.

## Implementation

- Keep shared colors and font aliases in `app/globals.css`; use these tokens rather than one-off hex values in components.
- Load the IBM Plex fonts through `next/font` in the root layout.
- Keep the app's design in the existing Next.js App Router and CSS setup. Do not add a component or icon dependency for simple dashboard elements.
- Read this guide before adding or changing administration UI. Update it when the product's visual rules change.
