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
| `FeaturePageHeader` | Branded, animated header for public feature pages | `title`, `subtitle`, `icon` |
| `PageHeader` | Consistent public page title and optional subtitle | `title`, `subtitle`, `tone` |
| `Heading` | Semantic headings with responsive typography | `level`, `size`, `tone`, `weight`, `align`, `spacingBottom`, `tracking` |
| `Text` | Body text formatting without one-off color/weight components | `as`, `size`, `tone`, `weight`, `align`, `leading`, `spacingBottom` |
| `Button` | Public button/link appearance with accessible focus styles | `appearance`, `size`, `motion`, `asChild` |
| `Surface` | Container formatting without long local utility lists | `tone`, `radius`, `padding`, `shadow`, `border`, `interaction` |
| `IconFrame` | Icon size, centering, background, placement and interaction | `size`, `radius`, `tone`, `placement`, `interaction` |
| `Dialog` | Accessible modal foundation with focus and scroll management | `open`, `onClose`, `title`, `closeOnBackdrop` |
| `ImageGalleryDialog` | Full-screen image gallery shared by events and projects | `images`, `initialIndex`, `open`, `onClose`, `title` |
| `useGalleryNavigation` | Circular previous/next and direct image navigation | `itemCount`, `initialIndex` |

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
| Particles and decorative feature animation | Unique to the home page and the reduced-motion task |
| JSON selection, sanitization, and translated content | Data and feature responsibility, not presentation primitives |
| Navbar and Footer composition | Unique application-shell components that already have one owner |

Feature components may use shared primitives internally while retaining their
domain-specific markup and behavior.

## Public mobile navigation

`src/components/layout/Navbar.tsx` composes the public header and passes the
same translated links to desktop navigation and `MobileNavigation.tsx`.
`MobileNavigation` only composes the components in `layout/mobile-navigation/`:
`MobileNavigationTrigger` owns the button and its ARIA attributes,
`MobileNavigationPanel` owns the animated panel structure and Tab boundary handling,
and `MobileNavigationLinks` renders translated links and their active state.
`useMobileNavigation` owns its
open state, route/breakpoint dismissal, and keyboard/focus handling. It receives
the logo ref as a desktop focus target.
Below `md`
(768 px), a menu button exposes the home, team, projects, and events links.
The header controls and menu fit a 320 px viewport; the smallest navbar is
72 px tall, leaving 14 px above and below its 44 px controls. Desktop links
remain in the header. The public navbar is content-sized: its logo and vertical padding
scale across breakpoints, while language controls retain a 44 px minimum touch
target. `Layout` exposes its measured height through `--public-navbar-height`
for the mobile menu and home Hero. This change does not affect the administrator
frontend.

The menu extends the full width of the navbar directly below its bottom edge,
overlaying page content without shifting it. `mobile-navigation.css` animates
the panel height in both directions (320 ms) and staggers the link entrances.
The panel stays mounted for smooth reversal during rapid toggling; closed links
are immediately inert and hidden from assistive technology. Reduced-motion
preferences disable the transitions. No portal or floating dialog is used.
Its trigger supplies `aria-expanded` and
`aria-controls`. Opening focuses the first link; Escape, selecting a link
(including the current route), or a route change closes the menu and returns
focus to the trigger. Outside pointer/focus interactions dismiss it without
stealing focus from the selected control. Tab after the last link or Shift+Tab
before the first closes the popup and returns focus to its trigger; this is a
navigation disclosure, not an ARIA application menu.

Every press of `MobileNavigationTrigger` plays a 620 ms border glow; its hook
restarts the animation for rapid presses. `MobileNavigationLinks` delegates
route changes to `useMobileLinkNavigation`: clicking a different route first
brightens its text and grows the underline for 400 ms, then navigates. During
that interval, the remaining links are disabled to preserve the selected path.
The underline grows at a constant pace, so its visible progress matches the
navigation delay. The delay stays below 0.8 seconds and is skipped for
reduced-motion users.

Crossing to the desktop breakpoint closes the popup and moves focus to the
logo instead of the hidden trigger. The PL/EN/DE language controls remain
available outside the popup; selecting a language also dismisses it, preserves
focus on the language button, and updates translated menu labels.

Regression checks: at 320 px, open the menu with keyboard and pointer, follow
all four links, select the current route, navigate back/forward, dismiss with
Escape and outside click, Tab out, switch PL/EN/DE with the menu open, and
resize through 768 px. Check initial/return focus, trigger ARIA attributes,
and the bounds of the panel and header controls. Also check opening/closing
animation, rapid toggling, short viewports (scrollable links), and reduced motion.
Verify the trigger glow on both opening and closing; then select a different
link and confirm its text and underline animate before the route changes.

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
