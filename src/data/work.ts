/**
 * The repositories this site points at, in three tiers: knowledge refreshers, open-source projects,
 * and learning notebooks.
 *
 * `status` says where the work can be read: `live` has a published site,
 * `repo` is source only, `unpublished` has no link yet.
 */

export type RepoStatus = "live" | "repo" | "unpublished";

export type WorkRepo = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  topics: string[];
  status: RepoStatus;
  repoUrl?: string;
  siteUrl?: string;
  articlePath?: string;
  cover?: string;
  coverAlt?: string;
};

export type WorkTier = {
  id: string;
  eyebrow: string;
  title: string;
  blurb: string;
  repos: WorkRepo[];
};

export const statusLabels: Record<RepoStatus, string> = {
  live: "Live site",
  repo: "Source only",
  unpublished: "Not yet published",
};

export const workTiers: WorkTier[] = [
  {
    id: "pillars",
    eyebrow: "Knowledge base",
    title: "Data and AI",
    blurb:
      "Connected notes, architecture references, and a knowledge graph for refreshing useful ideas — and finding the connections between them.",
    repos: [
      {
        id: "calm-data-and-ai",
        name: "Calm Data and AI",
        tagline: "A slow feed for a fast field.",
        description:
          "A connected engineering atlas for cloud systems, data platforms, SQL, Python, and Go — one concept at a time, small enough to finish with a coffee. This is the detailed layer beneath the knowledge map on this site.",
        topics: ["Data platforms", "Cloud", "SQL", "Python", "Go"],
        status: "live",
        repoUrl: "https://github.com/Lily-Feng/Calm.Data.and.AI",
        siteUrl: "https://lily-feng.github.io/Calm.Data.and.AI/",
      },
      {
        id: "enterprise-atlas",
        name: "Enterprise Data & AI Architecture Atlas",
        tagline: "Where two systems designed separately have to meet.",
        description:
          "The infrastructure counterpart: hybrid on-prem/cloud networking, GPU interconnect and parallelism, agentic operations, and cost-tiered log intelligence. Topology, integration, and the knobs — rather than how any one system works internally.",
        topics: ["Hybrid network", "AI infra", "Agentic ops", "AIOps"],
        status: "repo",
        repoUrl: "https://github.com/Lily-Feng/Enterprise-Data-AI-Architecture-Atlas",
      },
    ],
  },
  {
    id: "builds",
    eyebrow: "Projects",
    title: "Open-source projects",
    blurb:
      "Different stacks, different questions. These projects turn ideas about trust, health, operations, and security into working systems. Explore the source and the thinking behind each build.",
    repos: [
      {
        id: "trustgraph",
        name: "TrustGraph",
        tagline: "Exploring the protocols behind agentic commerce.",
        description:
          "An agentic commerce demo bringing A2A, UCP, AP2, and x402 together in a payments scenario. Explore how these protocols fit together, with merchant trust and an audit trail providing context for agent-driven transactions.",
        topics: ["A2A", "UCP", "AP2", "x402"],
        status: "live",
        repoUrl: "https://github.com/Lily-Feng/TrustGraph",
        siteUrl: "https://lily-feng.github.io/TrustGraph/",
        cover: "/images/work/trustgraph-protocol-icons.jpg",
        coverAlt: "Merchant Digital Twin storefront icon connected to A2A agent, UCP cart, AP2 shield, and x402 payment icons",
      },
      {
        id: "twiistlab",
        name: "TwiistLab",
        tagline: "Data for good — type 1 diabetes.",
        description:
          "A privacy-first personal analytics workflow for people with type 1 diabetes: Tidepool export into private S3, a governed Unity Catalog lakehouse, and a read-only dashboard. Real health data never leaves the private boundary; only code, schemas, and synthetic fixtures are published.",
        topics: ["Health data", "Databricks", "Unity Catalog", "Governance"],
        status: "unpublished",
      },
      {
        id: "log-ai",
        name: "Log-AI",
        tagline: "Metered inference on what survives the cheap filters.",
        description:
          "Log analysis at adversarial volume, where cost per record rather than model quality decides the shape of the pipeline. Deterministic parsing and statistical screening on every line, agentic reasoning only on the remainder.",
        topics: ["AIOps", "LLM agents", "Observability", "Python"],
        status: "repo",
        repoUrl: "https://github.com/Lily-Feng/Log-AI",
      },
      {
        id: "codex-harness",
        name: "Codex Vulnerability Harness",
        tagline: "Reads your codebase like an attacker, files a report instead.",
        description:
          "An agentic security review harness that walks a repository looking for exploitable paths and writes up what it finds. Codex-first, and an independent implementation rather than a port of anything internal.",
        topics: ["Security", "Agents", "Code review", "Python"],
        status: "repo",
        repoUrl: "https://github.com/Lily-Feng/codex-vulnerability-agentic-harness",
        cover: "/images/work/codex-vulnerability-harness.jpg",
        coverAlt: "Visa security harness adapted for Codex subscription access, with a fork connector and developer community icons",
      },

    ],
  },
  {
    id: "notes",
    eyebrow: "Practice",
    title: "Learning notebooks",
    blurb:
      "Hands-on notes, simulations, and study tools. A place to work through unfamiliar ideas, test what I understand, and keep what helps.",
    repos: [
      {
        id: "reinforcement-learning",
        name: "Reinforcement Learning",
        tagline: "Algorithms with the simulation attached.",
        description:
          "Implementations of core reinforcement learning algorithms alongside interactive simulations and demos, on the theory that the update rule is easier to believe once you have watched it run.",
        topics: ["RL", "Simulation", "Astro"],
        status: "live",
        repoUrl: "https://github.com/Lily-Feng/Reinforcement-Learning",
        siteUrl: "https://lily-feng.github.io/Reinforcement-Learning/",
      },
      {
        id: "claude-architect",
        name: "Claude Certified Architect",
        tagline: "Architecture judgment, put into practice.",
        description:
          "My exam preparation notes and mock test for exploring AI architecture tradeoffs: latency, cost, accuracy, and evaluation. The blog collects the details and lessons from the work.",
        topics: ["Claude", "AI architecture", "Evaluation"],
        status: "live",
        articlePath: "/blogs/claude-certified-architect-exam-preparation",
        cover: "/images/claude/claude-mock-test.png",
        coverAlt: "Claude Architect mock test with timed mock and study mode options",
      },
      {
        id: "skills",
        name: "Skills",
        tagline: "Reusable agent skills, shared.",
        description:
          "The agent skills that turned out to be worth keeping and worth handing to someone else.",
        topics: ["Agents", "Tooling", "Python"],
        status: "repo",
        repoUrl: "https://github.com/Lily-Feng/skills",
      },
    ],
  },
];

export const profileUrl = "https://github.com/Lily-Feng";
