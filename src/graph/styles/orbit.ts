import type { StylePack } from "./index";
import { drawLabelBelow, labelBelowBounds, withAlpha } from "./index";

/** Concentric rings: major concepts near the center, minor ones further out. */
export const orbit: StylePack = {
  id: "orbit",
  hit: "circle",
  box: (node) => ({ hw: node.radius, hh: node.radius }),

  backdrop({ ctx, theme, center, unit }) {
    ctx.save();
    ctx.setLineDash([3, 7]);
    ctx.strokeStyle = theme.line;
    ctx.lineWidth = 1;
    for (const ratio of [0.13, 0.29, 0.44, 0.56, 0.66]) {
      ctx.globalAlpha = theme.mode === "dark" ? 0.3 : 0.42;
      ctx.beginPath();
      ctx.ellipse(center.x, center.y, unit * ratio, unit * ratio * 0.9, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },

  drawEdge(edge, { ctx, alpha, accent, emphasis }) {
    ctx.save();
    ctx.globalAlpha = alpha * (emphasis ? 0.85 : 0.34);
    ctx.strokeStyle = accent;
    ctx.lineWidth = emphasis ? 1 + edge.weight * 2 : 0.8;
    if (!emphasis) ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(edge.source.x, edge.source.y);
    ctx.lineTo(edge.target.x, edge.target.y);
    ctx.stroke();
    ctx.restore();
  },

  drawNode(node, { ctx, alpha, accent, state, theme }) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(theme.mode === "dark" ? "#0b1424" : "#ffffff", 0.92);
    ctx.fill();
    ctx.fillStyle = withAlpha(accent, state === "dim" ? 0.14 : state === "idle" ? 0.3 : 0.55);
    ctx.fill();
    ctx.strokeStyle = withAlpha(accent, state === "focus" ? 1 : 0.75);
    ctx.lineWidth = state === "focus" ? 2.6 : node.tier === "major" ? 2 : 1.3;
    ctx.stroke();

    // Weight dial: an arc of the rim proportional to importance
    if (node.kind === "concept") {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * node.weight);
      ctx.strokeStyle = withAlpha(accent, state === "dim" ? 0.15 : 0.7);
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    ctx.restore();
  },

  drawLabel(node, env) {
    drawLabelBelow(node, env, 17);
  },

  labelBounds(node, ctx) {
    return labelBelowBounds(node, ctx, 17);
  },
};
