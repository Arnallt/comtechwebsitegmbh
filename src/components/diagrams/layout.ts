// Shared geometry for the diagram system — CLAUDE.md §5. One primitive
// (a labelled node with an ownership state) laid out five ways.

// The `owner` rule (CLAUDE.md §2.1/§4.1), applied by hand at every call site
// — not a label→owner lookup table, because the same label can mean a
// different thing in different diagrams (see the two "Registry" nodes
// below). Whoever adds a node re-runs this test:
//
//   comtech     — the node names a technology-verb function (configure,
//                 deploy, execute, record, integrate) that ComTech's own
//                 platform/technology performs — even when an issuer
//                 instructs it. Minting, the platform's own registry, and
//                 processing a corporate action all qualify: the decision
//                 is the issuer's, the execution is ComTech's.
//   third-party — the node names a decision, a physical/legal act, or an
//                 external party or category ComTech does not perform or
//                 is not: asset onboarding, structuring, custody,
//                 verification/audit, another company, a partner category,
//                 the underlying DLT network, or a brand-hierarchy child
//                 whose operator isn't uniformly ComTech (e.g. the three
//                 pillars on /home — Technology is client-operated).
//   emphasis    — a destination/end-state worth the heavier stroke without
//                 asserting it's ComTech's technology layer.
//
// Cross-check before shipping a new usage: grep the repo for the same
// label and confirm the owner matches, unless the context genuinely
// differs (technology.mdx's bottom-row "Registry" is a third-party
// registrar in the integration stack, not the platform's own registry).
export type Owner = 'comtech' | 'third-party' | 'emphasis';

export interface NodeSpec {
  label: string;
  owner?: Owner;
}

export interface LaidOutNode {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  owner: Owner;
}

export interface Connector {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  arrow?: boolean;
}

export interface Layout {
  nodes: LaidOutNode[];
  connectors: Connector[];
  width: number;
  height: number;
}

export const NODE_HEIGHT = 48;
const PAD_X = 16;
const CHAR_WIDTH = 6.6; // coarse advance width for Archivo 600 at 12.5px

export function nodeWidth(label: string): number {
  return Math.max(104, Math.round(label.length * CHAR_WIDTH) + PAD_X * 2);
}

function owner(spec: NodeSpec): Owner {
  return spec.owner ?? 'third-party';
}

/** Left-to-right row of nodes joined by arrowed connectors. */
export function chainHorizontal(items: NodeSpec[], gap = 40): Layout {
  const nodes: LaidOutNode[] = [];
  const connectors: Connector[] = [];
  let x = 0;
  items.forEach((item, i) => {
    const width = nodeWidth(item.label);
    nodes.push({ x, y: 0, width, height: NODE_HEIGHT, label: item.label, owner: owner(item) });
    if (i > 0) {
      const prev = nodes[i - 1];
      connectors.push({
        x1: prev.x + prev.width,
        y1: NODE_HEIGHT / 2,
        x2: x,
        y2: NODE_HEIGHT / 2,
        arrow: true,
      });
    }
    x += width + gap;
  });
  return { nodes, connectors, width: x - gap, height: NODE_HEIGHT };
}

/** Top-to-bottom column of nodes joined by arrowed connectors, centred. */
export function chainVertical(items: NodeSpec[], gap = 32): Layout {
  const raw: LaidOutNode[] = [];
  const connectors: Connector[] = [];
  let y = 0;
  items.forEach((item, i) => {
    const width = nodeWidth(item.label);
    raw.push({ x: 0, y, width, height: NODE_HEIGHT, label: item.label, owner: owner(item) });
    if (i > 0) {
      connectors.push({ x1: 0, y1: y - gap, x2: 0, y2: y, arrow: true });
    }
    y += NODE_HEIGHT + gap;
  });
  const maxWidth = Math.max(...raw.map((n) => n.width));
  const nodes = raw.map((n) => ({ ...n, x: (maxWidth - n.width) / 2 }));
  const centredConnectors = connectors.map((c) => ({ ...c, x1: maxWidth / 2, x2: maxWidth / 2 }));
  return { nodes, connectors: centredConnectors, width: maxWidth, height: y - gap };
}

/**
 * Vertical stack of layers, top-to-bottom, arrowed. A layer can hold more
 * than one node (rendered side by side) — used for the API stack's final
 * partner row.
 */
export function stack(layers: NodeSpec[][], rowGap = 40, colGap = 24): Layout {
  const nodes: LaidOutNode[] = [];
  const connectors: Connector[] = [];
  let y = 0;
  let maxRowWidth = 0;
  const rowWidths = layers.map((layer) => {
    const widths = layer.map((item) => nodeWidth(item.label));
    return widths.reduce((a, b) => a + b, 0) + colGap * (layer.length - 1);
  });
  maxRowWidth = Math.max(...rowWidths);

  layers.forEach((layer, rowIndex) => {
    const rowWidth = rowWidths[rowIndex];
    let x = (maxRowWidth - rowWidth) / 2;
    const rowNodes: LaidOutNode[] = [];
    layer.forEach((item) => {
      const width = nodeWidth(item.label);
      rowNodes.push({ x, y, width, height: NODE_HEIGHT, label: item.label, owner: owner(item) });
      x += width + colGap;
    });
    nodes.push(...rowNodes);

    if (rowIndex > 0) {
      const prevCenterX = maxRowWidth / 2;
      connectors.push({ x1: prevCenterX, y1: y - rowGap, x2: prevCenterX, y2: y, arrow: true });
    }
    y += NODE_HEIGHT + rowGap;
  });

  return { nodes, connectors, width: maxRowWidth, height: y - rowGap };
}

export interface HubLayout extends Layout {
  centerLabel: string;
}

/** Central node with radial spokes to surrounding nodes. */
export function hub(center: NodeSpec, spokes: NodeSpec[], minRadius = 160): HubLayout {
  const centerWidth = nodeWidth(center.label);
  // Radius must give each spoke node enough arc length not to collide with
  // its neighbours — widest node sets the required spacing.
  const widest = Math.max(...spokes.map((s) => nodeWidth(s.label)));
  const requiredCircumference = spokes.length * (widest + 32);
  const radius = Math.max(minRadius, requiredCircumference / (2 * Math.PI));
  const cx = radius;
  const cy = radius;
  const nodes: LaidOutNode[] = [
    { x: cx - centerWidth / 2, y: cy - NODE_HEIGHT / 2, width: centerWidth, height: NODE_HEIGHT, label: center.label, owner: owner(center) },
  ];
  const connectors: Connector[] = [];

  spokes.forEach((spec, i) => {
    const angle = (i / spokes.length) * Math.PI * 2 - Math.PI / 2;
    const width = nodeWidth(spec.label);
    const nx = cx + Math.cos(angle) * radius - width / 2;
    const ny = cy + Math.sin(angle) * radius - NODE_HEIGHT / 2;
    nodes.push({ x: nx, y: ny, width, height: NODE_HEIGHT, label: spec.label, owner: owner(spec) });
    connectors.push({
      x1: cx + Math.cos(angle) * (centerWidth / 2),
      y1: cy + Math.sin(angle) * (centerWidth / 2),
      x2: cx + Math.cos(angle) * (radius - NODE_HEIGHT / 2),
      y2: cy + Math.sin(angle) * (radius - NODE_HEIGHT / 2),
    });
  });

  const xs = nodes.map((n) => [n.x, n.x + n.width]).flat();
  const ys = nodes.map((n) => [n.y, n.y + n.height]).flat();
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const shifted = nodes.map((n) => ({ ...n, x: n.x - minX, y: n.y - minY }));
  const shiftedConnectors = connectors.map((c) => ({
    x1: c.x1 - minX,
    y1: c.y1 - minY,
    x2: c.x2 - minX,
    y2: c.y2 - minY,
  }));

  return {
    nodes: shifted,
    connectors: shiftedConnectors,
    width: Math.max(...xs) - minX,
    height: Math.max(...ys) - minY,
    centerLabel: center.label,
  };
}

/** Stacked rows, each its own horizontal chain — for side-by-side comparisons. */
export function rows(items: NodeSpec[][], gap = 40, rowGap = 64): { layouts: Layout[]; width: number; height: number } {
  const layouts = items.map((row) => chainHorizontal(row, gap));
  const width = Math.max(...layouts.map((l) => l.width));
  const height = layouts.reduce((sum, l) => sum + l.height, 0) + rowGap * (layouts.length - 1);
  return { layouts, width, height };
}

/** One parent node with children below it, connected by a single trunk that splits. */
export function tree(root: NodeSpec, children: NodeSpec[], gap = 40, rowGap = 64): Layout {
  const childRow = chainHorizontal(children, gap);
  const rootWidth = nodeWidth(root.label);
  const rootX = (childRow.width - rootWidth) / 2;
  const nodes: LaidOutNode[] = [
    { x: rootX, y: 0, width: rootWidth, height: NODE_HEIGHT, label: root.label, owner: owner(root) },
    ...childRow.nodes.map((n) => ({ ...n, y: NODE_HEIGHT + rowGap })),
  ];
  const trunkY1 = NODE_HEIGHT;
  const trunkY2 = NODE_HEIGHT + rowGap;
  const connectors: Connector[] = childRow.nodes.map((n) => ({
    x1: rootX + rootWidth / 2,
    y1: trunkY1,
    x2: n.x + n.width / 2,
    y2: trunkY2,
  }));
  return { nodes, connectors, width: childRow.width, height: NODE_HEIGHT * 2 + rowGap };
}
