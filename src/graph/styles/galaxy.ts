import type { StylePack } from "./index";
import { drawLabelBelow, labelBelowBounds, withAlpha } from "./index";

/** Glowing orbs on a starfield. Weight reads as brightness and halo size. */
export const galaxy: StylePack = {
  id: "galaxy",
  hit: "circle",
  box: (node) => ({ hw: node.radius, hh: node.radius }),

  backdrop({ ctx, theme, width, height, originX, originY, time }) {
    // Tiled starfield: stars belong to world tiles, so they pan and zoom with the map.
    const tile = 180;
    const startX = Math.floor(originX / tile) * tile;
    const startY = Math.floor(originY / tile) * tile;
    ctx.save();
    ctx.fillStyle = theme.ink;
    for (let x = startX; x < originX + width; x += tile) {
      for (let y = startY; y < originY + height; y += tile) {
        let seed = (Math.abs(x * 73856093) ^ Math.abs(y * 19349663)) % 2147483647 || 7;
        const rand = () => {
          seed = (seed * 16807) % 2147483647;
          return (seed - 1) / 2147483646;
        };
        for (let i = 0; i < 3; i++) {
          const sx = x + rand() * tile;
          const sy = y + rand() * tile;
          const size = rand();
          const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(time / 2400 + sx));
          ctx.globalAlpha = (theme.mode === "dark" ? 0.45 : 0.24) * twinkle * (0.35 + size * 0.65);
          ctx.beginPath();
          ctx.arc(sx, sy, size > 0.92 ? 1.5 : 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  },

  drawEdge(edge, { ctx, alpha, accent, emphasis }) {
    const dx = edge.target.x - edge.source.x;
    const dy = edge.target.y - edge.source.y;
    ctx.save();
    ctx.globalAlpha = alpha * (emphasis ? 0.9 : 0.5);
    ctx.strokeStyle = accent;
    ctx.lineWidth = emphasis ? 1 + edge.weight * 2.4 : 0.7 + edge.weight * 0.9;
    ctx.beginPath();
    ctx.moveTo(edge.source.x, edge.source.y);
    ctx.quadraticCurveTo(
      (edge.source.x + edge.target.x) / 2 + dy * 0.11,
      (edge.source.y + edge.target.y) / 2 - dx * 0.11,
      edge.target.x,
      edge.target.y,
    );
    ctx.stroke();
    ctx.restore();
  },

  drawNode(node, { ctx, alpha, accent, state, time }) {
    const pulse = state === "focus" ? 1 + Math.sin(time / 520) * 0.045 : 1;
    const radius = node.radius * pulse;
    ctx.save();
    ctx.globalAlpha = alpha;

    const haloReach = radius * 1.75;
    const halo = ctx.createRadialGradient(node.x, node.y, radius * 0.8, node.x, node.y, haloReach);
    halo.addColorStop(0, withAlpha(accent, state === "dim" ? 0.08 : 0.26));
    halo.addColorStop(1, withAlpha(accent, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(node.x, node.y, haloReach, 0, Math.PI * 2);
    ctx.fill();

    const body = ctx.createRadialGradient(
      node.x - radius * 0.34,
      node.y - radius * 0.38,
      radius * 0.12,
      node.x,
      node.y,
      radius,
    );
    body.addColorStop(0, withAlpha("#ffffff", node.kind === "note" ? 0.28 : 0.34));
    body.addColorStop(0.55, withAlpha(accent, 0.97));
    body.addColorStop(1, withAlpha(accent, 0.78));
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Rim: without it the orb dissolves into the page on a light background.
    ctx.strokeStyle = withAlpha(accent, state === "dim" ? 0.3 : 0.85);
    ctx.lineWidth = node.kind === "note" ? 1 : 1.5;
    ctx.stroke();

    if (state === "focus" || state === "related") {
      ctx.strokeStyle = withAlpha("#ffffff", state === "focus" ? 0.92 : 0.4);
      ctx.lineWidth = state === "focus" ? 2.2 : 1.2;
      ctx.stroke();
    }

    if (state === "focus") {
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + 9, 0, Math.PI * 2);
      ctx.strokeStyle = withAlpha(accent, 0.55);
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
    ctx.restore();
  },

  drawLabel(node, env) {
    drawLabelBelow(node, env, 15);
  },

  labelBounds(node, ctx) {
    return labelBelowBounds(node, ctx, 15);
  },
};
