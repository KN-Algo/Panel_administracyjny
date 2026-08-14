# Public frontend shared API

The `shared` directory contains small, reusable presentation primitives for the
public frontend. It is intentionally independent from `features/admin`.

> Changes in this directory can affect several routes at once. Always verify
> `/`, `/team`, `/projects`, and `/events` at desktop and mobile widths before
> merging a shared change.

## Importing

Public components should import the supported API from the root entry point:

```tsx
import { ContentContainer, Heading, PageHeader, Section, Text } from "@/shared";
```

Do not import internal CVA recipes. Their class lists are implementation
details, so the shared contract remains the typed component props.

`components/ui` contains shadcn/Radix primitives belonging to the administrator
frontend. They are outside this task and are not part of the public shared API.
Public components must not import from `components/ui`.

## Current components

| Component | Responsibility | Important props |
| --- | --- | --- |
| `PublicPage` | Root surface of a public route | `tone`, `minHeight` |
| `Section` | Semantic page section and vertical spacing | `spacing`, `tone`, `align`, `as` |
| `ContentContainer` | Horizontal padding and maximum content width | `size`, `align`, `as` |
| `PageHeader` | Consistent public page title and optional subtitle | `title`, `subtitle`, `tone` |
| `Heading` | Semantic headings with responsive typography | `level`, `size`, `tone`, `weight`, `align`, `spacingBottom`, `tracking` |
| `Text` | Body text formatting without one-off color/weight components | `as`, `size`, `tone`, `weight`, `align`, `leading`, `spacingBottom` |
| `Button` | Public button/link appearance with accessible focus styles | `appearance`, `size`, `motion`, `asChild` |
| `Surface` | Container formatting without long local utility lists | `tone`, `radius`, `padding`, `shadow`, `border`, `interaction` |
| `IconFrame` | Icon size, centering, background, placement and interaction | `size`, `radius`, `tone`, `placement`, `interaction` |

The `className` prop is available for genuinely local decoration or layout
integration. It must not be used by page composition to recreate a variant
that belongs in the shared API.

## Shared styles

- `styles/theme.css` owns public brand, neutral, and social-media color tokens.
- `styles/scrollbar.css` owns the global public scrollbar appearance.
- `styles/theme.ts` contains JavaScript fallbacks required before CSS variables
  can be read from the browser.

Use semantic Tailwind tokens such as `bg-brand-dark` and `text-brand-light`.
Do not add hardcoded brand hex values to public TSX files. Do not construct
Tailwind classes dynamically, for example `bg-${tone}`; every class must be a
complete literal visible to the Tailwind scanner.

## Intentionally outside shared

| Element | Location/reason |
| --- | --- |
| News cards and news carousel | Home feature; owned by the home refactor task |
| Event cards, grid, and event content | Events feature; owned by the events refactor task |
| Project accordion, sections, and image carousel | Projects feature; owned by the projects refactor task |
| Member and supervisor cards | Team feature; owned by the team refactor task |
| Complete dialog behavior | Separate accessible-dialog task; a style wrapper alone is not sufficient |
| Complete gallery, carousel arrows, dots, counters, and transitions | Explicitly excluded from this migration |
| Particles and decorative feature animation | Unique to the home page and the reduced-motion task |
| JSON selection, sanitization, and translated content | Data and feature responsibility, not presentation primitives |
| Navbar and Footer composition | Unique application-shell components that already have one owner |

Feature components may use shared primitives internally while retaining their
domain-specific markup and behavior.

## Adding or changing a shared component

1. Confirm that the pattern occurs in more than one public context or is a
   stable public design-system decision.
2. Prefer a semantic component and a finite string variant over multiple
   boolean props.
3. Preserve the underlying HTML semantics. Avoid wrappers that can change
   flex/grid behavior or focus order.
4. Add the new component to `shared/index.ts` and update this inventory.
5. Run `npm run lint`, `npm run typecheck`, and `npm run build`.
6. Compare all affected routes and interactive states with their visual
   baseline, including keyboard focus and reduced-motion mode.
