# Design system

One token layer drives colour, type, space, radius, and motion across the site.
Component CSS never contains a literal — if you find yourself typing a hex value
or a pixel radius into a component rule, the token is missing, not the rule.

## Files

| File | Contains |
| --- | --- |
| `src/styles.css` | Import barrel. Import order *is* cascade order. |
| `src/styles/tokens.css` | Primitives, semantic roles, both themes, accent presets. |
| `src/styles/base.css` | Reset, document type, the global interaction contract, shared recipes. |
| `src/styles/layout.css` | Shell, header, nav, flyouts, hero, page intros, footer. |
| `src/styles/components.css` | Search, cards, section headings, article page, Markdown. |
| `src/styles/graph.css` | Domain tabs, graph canvas, concept popup, resource links. |
| `src/styles/resume.css` | About page, resume timeline, journey globe. |
| `src/styles/responsive.css` | Breakpoints and print. Layout only — no new colour. |

## Changing the colour of the whole site

Every accent, tint, glow, border-highlight, and focus ring derives from a single
hue angle. Rotate it and the site recolours coherently, because lightness and
chroma relationships are preserved.

**Option 1 — set a preset** on the root element:

```html
<html data-accent="rose">
```

Available: `teal` (default), `emerald`, `indigo`, `violet`, `rose`, `amber`.

**Option 2 — set the hue directly** in `src/styles/tokens.css`:

```css
:root { --hue-accent: 320; }   /* any angle 0–360 */
```

There are three hue dials in total:

| Dial | Default | Drives |
| --- | --- | --- |
| `--hue-accent` | `185` (teal) | Links, active states, focus ring, "Read" resources, graph highlights |
| `--hue-secondary` | `285` | Domain labels, post categories, "Build" resources, resume roles |
| `--hue-highlight` | `75` | "Currently exploring" mark, "Practice" resources |

Neutrals follow `--hue-neutral` (`255`) at very low chroma, so surfaces stay
subtly cool rather than dead grey. Drop `--chroma-neutral`-adjacent values to `0`
for pure greys.

### Why OKLCH

`oklch(L C H)` separates perceived lightness from hue, so rotating `H` does not
change how light a colour reads. That is what makes a single-number recolour safe:
contrast ratios survive the rotation. `scripts`-free verification lives in the
table below — every pair passes its WCAG minimum in both themes across all six
presets.

| Pair | Min | Light | Dark |
| --- | --- | --- | --- |
| Headings on page | 4.5 | 16.2 | 18.0 |
| Body on page | 4.5 | 11.3 | 13.7 |
| Secondary text on page | 4.5 | 6.3 | 8.2 |
| Meta / label text | 3.0 | 4.3 | 5.6 |
| Accent + focus ring | 3.0 | 4.8–5.6 | 9.8–11.1 |

(Accent rows show the range across the six presets.)

## Token reference

### Semantic colour roles

Components use **only** these. They are the whole contract.

```
Surfaces   --surface-page      page background
           --surface-sunken    recessed: code blocks, canvas veil
           --surface-card      cards, panels, header
           --surface-raised    hover state on a card or list row
           --surface-inset     chips, kbd, segmented-control track
           --surface-overlay   popups and flyouts (pair with backdrop-filter)
           --surface-veil      graph canvas ground

Text       --text-strong       headings, emphasised body
           --text-default      body copy
           --text-muted        secondary copy, descriptions
           --text-subtle       meta, timestamps, counts
           --text-on-accent    text sitting on an accent fill

Borders    --border-subtle     default dividers and card edges
           --border-default    inputs, popups, interactive outlines
           --border-strong     hover emphasis

Accents    --accent            --accent-hover  --accent-soft  --accent-line
           --secondary         --secondary-soft  --secondary-line
           --highlight         --highlight-soft  --highlight-line

Depth      --shadow-sm  --shadow-md  --shadow-lg  --shadow-overlay  --glow-accent
```

`*-soft` is a ~10% fill tint. `*-line` is a ~33% border tint. Use those instead
of inventing an `rgba()`.

### Scales

```
Type      --text-2xs (11px) --text-xs (12) --text-sm (13) --text-md (14)
          --text-base (15) --text-lg (17) --text-xl (20) --text-2xl (26)
          --text-3xl / --text-4xl / --text-5xl  (fluid clamp)

Space     --space-1 (4px) through --space-12 (104px), on a 4pt grid

Radius    --radius-xs (4) --radius-sm (6) --radius-md (10)
          --radius-lg (14) --radius-xl (20) --radius-pill --radius-circle

Motion    --dur-fast (120ms) --dur-base (200ms) --dur-slow (320ms)
          --ease-out --ease-spring
          --transition-colors --transition-transform
```

**11px is the floor.** Nothing renders smaller than `--text-2xs`.

## The interaction contract

Defined once in `base.css`; every control inherits it. This is what makes clicked
and hovered things look deliberate rather than accidental.

- **Focus.** One `:focus-visible` ring — `--focus-ring-width` solid
  `--focus-ring-color` at `--focus-ring-offset`. Never remove it. Controls flush
  to an edge get a negative offset via the existing `:where(...)` exception.
- **Transition.** All interactive elements ease colour and shadow on
  `--dur-base`/`--ease-out`. Only add a `transition` to a component rule when it
  also animates `transform`.
- **Hover.** Raise the surface (`--surface-raised`), lift the text one step
  (`--text-muted` → `--text-strong`), or tint the border (`--accent-line` →
  `--accent`). Pick one; do not do all three.
- **Disabled.** `opacity: .5` plus `not-allowed`, applied automatically to
  `:disabled` and `[aria-disabled="true"]`.

### Shared recipes

`base.css` also exposes three utility classes for new markup: `.u-surface`
(bordered card that lifts on hover), `.u-eyebrow` (uppercase accent label), and
`.u-chip` (tag pill).

## Rules for adding to the system

1. Component rules contain no colour literals, no raw pixel radii, no raw
   durations. The only literals live in `tokens.css` and the `@media print` token
   override.
2. Never restyle a component per theme. If something looks wrong in one theme,
   the semantic token is wrong, not the component.
3. New colour need? Add a semantic role, not a one-off hex.
4. New size? Use the nearest scale step. If nothing fits, the scale is wrong —
   change it once, centrally.

## Two things that are deliberately not themed

- **`--cluster-accent`** is set inline per graph node from the authored graph
  data (`ConceptPopup.tsx`). It is content colour, not theme colour, and falls
  back to `--accent` when absent.
- **`.globe-shell`** declares its own local dark scope. It renders a night-side
  Earth in both themes, so its atmosphere and arc colours are constants of the
  scene (`ExperienceGlobe.tsx`), not of the page palette.
