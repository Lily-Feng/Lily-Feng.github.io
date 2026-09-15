/**
 * The repositories this site points at, in three tiers: domain pillars, builds,
 * and open notebooks.
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
    eyebrow: "Domain",
    title: "Two pillars",
    blurb:
      "Ten-plus years of data and AI work, split by the angle it is viewed from: how a system works inside, and how systems are wired together.",
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
    eyebrow: "Builds",
    title: "Things made to be looked at",
    blurb:
      "Prototypes and projects with a thesis. Each is independent work on synthetic or personal data — no employer code, data, or design carried over.",
    repos: [
      {
        id: "trustgraph",
        name: "TrustGraph",
        tagline: "Autonomous decisions you can audit.",
        description:
          "Fraud and merchant trust for a payments platform where a growing share of transactions are initiated by AI agents rather than humans. Merchant digital twin, AP2 payment mandate, and escrow, against a Stripe-shaped data contract in test mode with synthetic data.",
        topics: ["Agentic commerce", "Fraud", "Evaluation", "Payments"],
        status: "repo",
        repoUrl: "https://github.com/Lily-Feng/TrustGraph",
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
      },
      {
        id: "java-crm-databricks",
        name: "java-crm-databricks",
        tagline: "A small CRM used as a probe.",
        description:
          "A mini CRM written in Java to exercise Databricks Lakebase, Unity Catalog, and adjacent platform features from a JVM client — built to find the edges rather than to ship a CRM.",
        topics: ["Java", "Lakebase", "Unity Catalog"],
        status: "repo",
        repoUrl: "https://github.com/Lily-Feng/java-crm-databricks",
      },
    ],
  },
  {
    id: "notes",
    eyebrow: "Open notebooks",
    title: "Learning in public",
    blurb:
      "Working notebooks rather than finished writing. They are here because the practice is the point, and because a half-built understanding is still worth showing.",
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
        id: "programming",
        name: "Programming practice",
        tagline: "Five languages, recurring patterns.",
        description:
          "Fundamentals, data structures, and problem-solving patterns across SQL, Python, Java, Go, and Rust — kept as a deliberate refresh rather than an interview grind.",
        topics: ["SQL", "Python", "Java", "Go", "Rust"],
        status: "repo",
        repoUrl: "https://github.com/Lily-Feng/programming",
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
