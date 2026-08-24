# Weighted knowledge-graph schema

The knowledge map is authored data, not a by-product of the Markdown corpus.
Each domain gets one JSON file in `src/data/graph/`, and that file is the shared
contract: this site renders it with a canvas engine (`src/graph/`), and any other
renderer — for example the vanilla Patternbook atlas in `Calm.Data.and.AI` — can
consume the same file without importing any of this repository's code.

Types live in [`src/graph/types.ts`](../src/graph/types.ts).

## File shape

```jsonc
{
  "id": "applied-ml",
  "domain": "Applied Machine Learning", // must match the `domain:` front matter of the notes
  "title": "Applied Machine Learning",
  "tagline": "One line under the heading.",
  "style": "galaxy",                    // default style pack for the whole map
  "layout": "force",                    // "force" | "orbit"
  "clusters": [
    {
      "id": "paradigms",
      "label": "Learning paradigms",
      "accent": "#52d3c6",              // 6-digit hex; every node in the cluster inherits it
      "summary": "Shown as a legend tooltip.",
      "style": "tile"                   // optional: overrides the domain style for this cluster
    }
  ],
  "nodes": [
    {
      "id": "supervised",
      "label": "Supervised learning",
      "cluster": "paradigms",
      "weight": 0.96,                   // 0–1 importance — see below
      "summary": "One or two sentences shown at the top of the popup.",
      "keyPoints": ["Three to five things worth remembering."],
      "topics": ["Machine Learning"],   // notes carrying any of these attach automatically
      "style": "orbit",                 // optional: overrides the cluster style for this node
      "resources": [
        { "type": "practice", "label": "Top K with a heap", "href": "https://…", "note": "Optional subtitle" },
        { "type": "article", "label": "Optional override", "slug": "rag-in-production" }
      ]
    }
  ],
  "edges": [
    { "source": "supervised", "target": "deep-learning", "weight": 0.8, "kind": "supports", "note": "Optional" }
  ]
}
```

A new file is picked up automatically — `src/data/graph/index.ts` globs the
directory. Nothing else needs editing.

## Weight

`weight` is the whole point of the redesign: it says how much of the domain a
concept actually carries. It drives node radius, label size, label priority when
labels compete for space, the layout ring in `orbit` mode, and the meter in the
popup.

| Weight | Tier | Reads as |
|---|---|---|
| ≥ 0.75 | `major` | A pillar of the domain — always labelled |
| 0.45 – 0.74 | `core` | Load-bearing but not headline — always labelled |
| 0.20 – 0.44 | `supporting` | Useful, labelled when there is room |
| < 0.20 | `minor` | Detail, labelled when zoomed in or focused |

Keep two to four `major` concepts per domain. If everything is major, nothing is.

## Edges

`kind` is one of `supports`, `prerequisite`, `contrasts`, `applies`. It is stored
for meaning and shown in tooltips; the renderer currently distinguishes edges by
`weight` (0–1), which sets line thickness and the order of "Connected concepts"
in the popup.

## Resources

`type` selects the visual treatment of the link. The mapping lives in
[`src/graph/resources.ts`](../src/graph/resources.ts) and the matching CSS blocks
are grouped under "Resource links" in `src/styles.css`.

| Type | Group heading | Treatment |
|---|---|---|
| `article` | Read | Solid card with a cyan spine |
| `practice` | Practice | Monospaced dashed chip, terminal-flavoured |
| `project` | Build | Soft violet slab |
| `reference` | Reference | Quiet, text-first row |
| `external` | Elsewhere | Ghost pill |

Use `slug` for a Markdown note in this repository (rendered as an in-app link) and
`href` for anything off-site. A `slug` that no longer resolves is dropped rather
than rendered as a dead link.

Notes attach on their own: every Markdown file in the domain joins the one or two
concepts whose `topics` it shares, scored so that a topic claimed by a single
concept outranks one sprinkled across the map. Attached notes appear as satellite
nodes and are added to that concept's "Read" group, so a new note never needs a
graph edit.

## Style packs

A style pack owns the drawing of a node, its label, its edges, and optionally the
backdrop. Packs live in `src/graph/styles/` and are selected per node:

```
node.style ?? cluster.style ?? domain.style
```

so a single map can mix styles — `enterprise-ai.json` draws tiles everywhere
except its "AI systems" cluster, which is a galaxy.

| Pack | Look | Weight shows up as |
|---|---|---|
| `galaxy` | Glowing orbs on a tiled starfield, curved edges | Orb size and halo |
| `orbit` | Outlined discs on dashed rings, dashed edges | Disc size plus a rim dial |
| `tile` | Hard-edged rectangles with the title set inside | Tile size plus a bottom bar |

`layout` is separate from style and is set per domain: `force` (clustered
relaxation) or `orbit` (rings by tier, angular sectors by cluster).

### Adding a pack

1. Write `src/graph/styles/<name>.ts` implementing `StylePack` — `box`,
   `drawNode`, `drawLabel`, `drawEdge`, `labelBounds`, and optionally `backdrop`
   (only the domain-level pack's backdrop is drawn).
2. Register it in `STYLE_PACKS` in `src/graph/styles/index.ts` and add its id to
   `StyleId` in `src/graph/types.ts`.
3. Reference it from a JSON file. No renderer changes are needed.

`labelBounds` returns the world-space box the label wants, so the engine can drop
or flip labels that would collide; return `null` if the label is drawn inside the
node body.

## Porting to another renderer

The JSON is deliberately free of framework concerns. A second renderer needs to
reproduce four things: the weight → radius/tier mapping (`radiusFor`/`tierFor` in
`src/graph/types.ts`), the style-resolution order above, the layout modes, and
the resource-type styling table. Everything else is presentation.
