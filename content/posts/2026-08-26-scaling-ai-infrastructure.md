---
title: "Scaling AI infrastructure: scale up, scale out, scale across"
date: 2026-08-26
summary: Reflections from Scale Networking 2026 on how AI is moving the boundary of one machine from servers to racks and data centers.
domain: AI Infrastructure
topics: [AI Infrastructure, Networking, Systems Architecture]
kind: post
color: architecture
icon: architecture
cover: /ai-infrastructure-boundaries.jpeg
coverAlt: AI infrastructure scaling boundaries diagram
---

<!-- Original creation time inferred from LinkedIn activity ID (ID >> 22): 2026-08-26T22:15:25.676Z. Display date uses America/Los_Angeles. Not a verified publication timestamp; source may have been edited. -->

I spent a day at Scale Networking 2026, also catching up my knowledge with all the new names:

- NVIDIA Rubin GPU
- AMD MI400
- Google TPU
- Microsoft Maia
- Meta MTIA
- OpenAI Jalapeño

## Scaling AI Infrastructure: scale up → scale out → scale across

![Same Pattern, New Boundary: a comparison of VMware-era server, cluster, and data-center scaling with AI package, rack, pod, and region scaling.](/ai-infrastructure-boundaries.jpeg)

[Open the full-size diagram](/ai-infrastructure-boundaries.jpeg)

I first thought this looked a lot like the VMware era. But AI infra is changing the meaning of each step. Back then, scale-up meant a bigger server.

Today, scale-up can mean an entire rack — and with systems like OpenAI’s Jalapeño, that tightly coupled domain may stretch across multiple racks.

The story is no longer just about faster chips. It’s about who gets to define the system boundary: compute, memory, interconnect, rack, and eventually the data center.

NVIDIA is pushing NVLink/NVSwitch. Google has its own ICI. Meta, Microsoft, and OpenAI are increasingly leaning on Ethernet-based fabrics.

So maybe history isn’t really repeating.

The boundary of “one machine” is just moving outward again.
