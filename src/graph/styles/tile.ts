import type { StylePack } from "./index";
import { drawLabelBelow, labelBelowBounds, labelSize, withAlpha, wrapText } from "./index";

/** Hard-edged tiles with the title set inside the block — a treemap feel. */
export const tile: StylePack = {
  id: "tile",
  hit: "rect",
  box: (node) =>
    node.kind === "note"
      ? { hw: node.radius, hh: node.radius }
      : { hw: node.radius * 1.45, hh: node.radius * 0.9 },

  backdrop({ ctx, theme, width, height, originX, originY }) {
    const step = 44;
    ctx.save();
    ctx.globalAlpha = theme.mode === "dark" ? 0.16 : 0.24;
    ctx.strokeStyle = theme.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = Math.floor(originX / step) * step; x < originX + width; x += step) {
      ctx.moveTo(x, originY);
      ctx.lineTo(x, originY + height);
    }
    for (let y = Math.floor(originY / step) * step; y < originY + height; y += step) {
      ctx.moveTo(originX, y);
      ctx.lineTo(originX + width, y);
    }
    ctx.stroke();
    ctx.restore();
  },

  drawEdge(edge, { ctx, alpha, accent, emphasis }) {
    ctx.save();
    ctx.globalAlpha = alpha * (emphasis ? 0.9 : 0.4);
    ctx.strokeStyle = accent;
    ctx.lineWidth = emphasis ? 1.2 + edge.weight * 2 : 0.8;
    ctx.beginPath();
    ctx.moveTo(edge.source.x, edge.source.y);
    ctx.lineTo(edge.target.x, edge.target.y);
    ctx.stroke();
    ctx.restore();
  },

  drawNode(node, { ctx, alpha, accent, state, theme }) {
    const { hw, hh } = tile.box(node);
    const x = node.x - hw;
    const y = node.y - hh;
    ctx.save();
    ctx.globalAlpha = alpha;

    const fill = ctx.createLinearGradient(x, y, x, y + hh * 2);
    fill.addColorStop(0, withAlpha(accent, state === "dim" ? 0.28 : 0.92));
    fill.addColorStop(1, withAlpha(accent, state === "dim" ? 0.12 : 0.42));
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, hw * 2, hh * 2);

    ctx.strokeStyle =
      state === "focus" ? withAlpha("#ffffff", 0.95) : withAlpha(accent, state === "related" ? 0.9 : 0.45);
    ctx.lineWidth = state === "focus" ? 2.4 : 1;
    ctx.strokeRect(x, y, hw * 2, hh * 2);

    if (node.kind === "concept") {
      // Weight bar along the bottom edge
      ctx.fillStyle = withAlpha(theme.mode === "dark" ? "#ffffff" : "#0b1424", state === "dim" ? 0.15 : 0.55);
      ctx.fillRect(x, y + hh * 2 - 3, hw * 2 * node.weight, 3);
    }
    ctx.restore();
  },

  drawLabel(node, env) {
    if (node.kind === "note") {
      drawLabelBelow(node, env, 12);
      return;
    }
    const { ctx } = env;
    const { hw, hh } = tile.box(node);
    const inner = hw * 2 - 16;
    if (inner < 34) return;

    ctx.save();
    ctx.globalAlpha = env.alpha;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    const size = labelSize(node);
    ctx.font = `640 ${size}px Inter, system-ui, sans-serif`;
    const lines = wrapText(ctx, node.label, inner, hh > 26 ? 3 : 2);
    const lineHeight = size * 1.2;
    const meta = node.tier.toUpperCase();
    const metaSize = Math.max(7.5, size * 0.62);
    const block = lines.length * lineHeight + metaSize + 5;
    const top = node.y - block / 2 + size;

    ctx.fillStyle = withAlpha("#ffffff", 0.94);
    lines.forEach((line, index) => ctx.fillText(line, node.x - hw + 8, top + index * lineHeight));
    ctx.font = `500 ${metaSize}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = withAlpha("#ffffff", 0.62);
    ctx.fillText(meta, node.x - hw + 8, top + lines.length * lineHeight + 3);
    ctx.restore();
  },

  labelBounds(node, ctx) {
    // Concept labels sit inside the tile, so only note labels can collide.
    return node.kind === "note" ? labelBelowBounds(node, ctx, 12) : null;
  },
};
