export type ResumeCategory = "work" | "education";

export type ResumeEntry = {
  id: string;
  organization?: string;
  role: string;
  location?: string;
  period: string;
  category: ResumeCategory;
  summary?: string;
  highlights: string[];
  skills: string[];
};

export type JourneyLocation = {
  id: string;
  organization: string;
  role: string;
  location: string;
  period: string;
  category: ResumeCategory;
  lat: number;
  lng: number;
  summary: string;
  skills: string[];
};

export const profile = {
  name: "Lily Feng",
  title: "Senior Staff Software Engineer — Data & AI Platforms",
  summary: "Senior Staff Software Engineer with 15+ years of experience evolving from enterprise BI and performance engineering to Data & AI platform architecture and agentic AI systems. Designs enterprise-scale AI and analytics platforms spanning agentic workflows, MCP and tool integration, semantic layers, Databricks, Power BI, Azure, security, and observability. Hands-on experience building agentic workforce solutions for enterprise infrastructure operations and developing AI products in a rapid changing small AI micro-pod style.",
  links: {
    linkedin: "https://www.linkedin.com/in/lilyf/",
    github: "https://github.com/Lily-Feng",
  },
  expertise: [
    {
      category: "Customer & Solution Engineering",
      details: "Enterprise customer collaboration, solution architecture, performance engineering, scalability, capacity planning",
    },
    {
      category: "AI & Agentic Systems",
      details: "Agentic workflows, MCP and tool integration, AI-assisted infrastructure operations, LLM-enabled applications",
    },
    {
      category: "Software Engineering",
      details: "Python, Java, SQL, Linux, full-stack system design, open-source software",
    },
    {
      category: "Data & Analytics",
      details: "Databricks, semantic layers, Power BI, enterprise analytics, BI infrastructure",
    },
    {
      category: "Cloud & Platform",
      details: "Microsoft Azure, security architecture, telemetry and observability, infrastructure engineering, performance tuning",
    },
  ],
};

// Career content is limited to facts supplied by Lily.
export const resumeEntries: ResumeEntry[] = [
  {
    id: "visa-ai-micropod",
    organization: "Visa",
    role: "AI MicroPOD — Portfolio Intelligence",
    period: "2026",
    category: "work",
    summary: "Architected a privacy-preserving portfolio-intelligence product with a five-person AI microPOD, delivering a client-ready vertical slice in about three months and roughly 10% of traditional delivery time.",
    highlights: [],
    skills: ["Agentic AI", "Product Architecture", "Privacy-Preserving Analytics"],
  },
  {
    id: "visa-agentic-payments",
    organization: "Visa",
    role: "Agentic Payments Trust Prototype",
    period: "2026",
    category: "work",
    summary: "Prototyped agent identity and Visa-certified trust scoring for agentic commerce.",
    highlights: [],
    skills: ["Agentic Commerce", "Identity", "Trust Scoring"],
  },
  {
    id: "visa-infrastructure-automation",
    organization: "Visa",
    role: "Infrastructure Intelligence & Automation",
    period: "2025",
    category: "work",
    summary: "Connected knowledge, request routing, and infrastructure automation to reduce routine service workflows from about an hour of human effort to near-zero.",
    highlights: [],
    skills: ["MCP", "Infrastructure Automation", "Agentic Workflows"],
  },
  {
    id: "visa-deep-research-agent",
    organization: "Visa",
    role: "Enterprise Deep-Research Agent",
    period: "Early 2025",
    category: "work",
    summary: "Built and published one of Visa’s earliest bounded MCP research agents, connecting Confluence design context with Jira execution history.",
    highlights: [],
    skills: ["ReAct", "MCP", "Enterprise Research"],
  },
  {
    id: "visa-logai",
    organization: "Visa",
    role: "LogAI Prototype",
    period: "2023",
    category: "work",
    summary: "Initiated a streaming log-classification and analytics prototype that became the foundation for Visa’s LogAI effort.",
    highlights: [],
    skills: ["Applied AI", "Streaming Analytics", "Observability"],
  },
  {
    id: "visa-secure-cloud-platform",
    organization: "Visa",
    role: "Secure Cloud Data Platform",
    period: "2022",
    category: "work",
    summary: "Implemented cloud networking and security for a production data platform operating under payment-industry constraints.",
    highlights: [],
    skills: ["Cloud Architecture", "Networking", "Security"],
  },
  {
    id: "visa-conversational-bi",
    organization: "Visa",
    role: "Conversational Analytics Assistant",
    period: "2021",
    category: "work",
    summary: "Built a conversational query-assistant plugin for Apache Superset before the mainstream adoption of large language models.",
    highlights: [],
    skills: ["Conversational AI", "Apache Superset", "Enterprise Analytics"],
  },
  {
    id: "visa-platform-evaluation",
    organization: "Visa",
    role: "Enterprise Data Platform Strategy",
    period: "2021",
    category: "work",
    summary: "Co-led the technical, security, compliance, and licensing evaluation that moved a strategic data-platform decision to closure.",
    highlights: [],
    skills: ["Platform Strategy", "Databricks", "Enterprise Architecture"],
  },
  {
    id: "visa-upgrade-acceleration",
    organization: "Visa",
    role: "Infrastructure Upgrade Acceleration",
    period: "2019",
    category: "work",
    summary: "Redesigned a legacy infrastructure-upgrade workflow, shortening the cycle from two years to three months—an 8× improvement.",
    highlights: [],
    skills: ["Infrastructure Architecture", "Process Design", "Performance"],
  },
  {
    id: "microstrategy-field-engineering",
    organization: "MicroStrategy Professional Services",
    role: "Fortune 500 Field Engineering",
    period: "2014–2018",
    category: "work",
    summary: "Delivered data products and solved critical architecture and performance challenges for Fortune 500 customers; authored the organization’s standard services runbook.",
    highlights: [],
    skills: ["Solution Architecture", "Performance Engineering", "Customer Delivery"],
  },
  {
    id: "microstrategy-prime",
    organization: "MicroStrategy",
    role: "PRIME Performance Engineering",
    period: "2014",
    category: "work",
    summary: "Advanced performance engineering for a massively parallel, distributed in-memory analytics platform operating across hundreds of CPU cores and nodes.",
    highlights: [],
    skills: ["Distributed Systems", "In-Memory Analytics", "Performance Engineering"],
  },
  {
    id: "microstrategy-ebay-benchmark",
    organization: "MicroStrategy",
    role: "2 TB Analytics Benchmark",
    period: "2013",
    category: "work",
    summary: "Led performance benchmarking for the platform’s first validated single-server deployment with 2 TB of memory.",
    highlights: [],
    skills: ["Benchmarking", "Large-Memory Systems", "Technical Leadership"],
  },
  {
    id: "microstrategy-kilocycle",
    organization: "MicroStrategy",
    role: "Performance Benchmarking Program",
    period: "2012",
    category: "work",
    summary: "Created the KiloCycle benchmark and load-testing program, validating more than 20,000 active users on commodity hardware.",
    highlights: [],
    skills: ["Benchmarking", "Load Testing", "Capacity Planning"],
  },
  {
    id: "microstrategy-china-leadership",
    organization: "MicroStrategy China Technology Center",
    role: "Performance Engineering Leadership",
    location: "Hangzhou, China",
    period: "2007–2012",
    category: "work",
    summary: "Progressed from SDET to leading more than 20 engineers across DevOps, performance, and test automation.",
    highlights: [],
    skills: ["Engineering Leadership", "DevOps", "Test Automation"],
  },
  {
    id: "ut-austin",
    organization: "University of Texas at Austin",
    role: "M.S. Data Science",
    period: "Expected Dec 2026",
    category: "education",
    highlights: [],
    skills: [],
  },
  {
    id: "uiuc",
    organization: "University of Illinois Urbana-Champaign",
    role: "Master of Business Administration (MBA)",
    period: "2022–2025",
    category: "education",
    highlights: [],
    skills: [],
  },
  {
    id: "nanjing-university",
    organization: "Nanjing University",
    role: "B.S. Computer Science",
    period: "2003–2007",
    category: "education",
    highlights: [],
    skills: [],
  },
];

export const categoryLabels: Record<ResumeCategory, string> = {
  work: "Professional work",
  education: "Education",
};

export const categoryColors: Record<ResumeCategory, string> = {
  work: "#14b8a6",
  education: "#60a5fa",
};

// Verified professional and education locations used by the journey globe.
export const journeyLocations: JourneyLocation[] = [
  {
    id: "nanjing-university-location",
    organization: "Nanjing University",
    role: "B.S. Computer Science",
    location: "Nanjing, China",
    period: "2003–2007",
    category: "education",
    lat: 32.0603,
    lng: 118.7969,
    summary: "Undergraduate education in Computer Science.",
    skills: ["Computer Science"],
  },
  {
    id: "microstrategy-hangzhou-location",
    organization: "MicroStrategy China Technology Center",
    role: "Lead Software Engineer in Test",
    location: "Hangzhou, China",
    period: "2007–2012",
    category: "work",
    lat: 30.2741,
    lng: 120.1551,
    summary: "Led a 20+ person Performance team in China, producing product benchmark press release and customer capacity-planning approaches.",
    skills: ["Performance Engineering", "Team Leadership", "Benchmarking"],
  },
  {
    id: "microstrategy-mclean-location",
    organization: "MicroStrategy",
    role: "Performance Engineering",
    location: "McLean, Virginia",
    period: "2007–2012",
    category: "work",
    lat: 38.9339,
    lng: -77.1773,
    summary: "Developed software performance tuning, benchmarks, code-coverage solutions, and practical-limit testing for enterprise BI software.",
    skills: ["Performance Engineering", "Benchmarking", "Capacity Planning"],
  },
  {
    id: "microstrategy-los-angeles-location",
    organization: "MicroStrategy Professional Services",
    role: "Principal Consultant",
    location: "Los Angeles, California",
    period: "2012–2018",
    category: "work",
    lat: 34.0522,
    lng: -118.2437,
    summary: "Partnered with major enterprise customers on large-scale BI architecture and performance engineering.",
    skills: ["Enterprise BI", "Solution Architecture", "Performance Engineering"],
  },
  {
    id: "visa-foster-city-location",
    organization: "Visa",
    role: "Senior Staff Software Engineer",
    location: "Foster City, California",
    period: "2018–Present",
    category: "work",
    lat: 37.5585,
    lng: -122.2711,
    summary: "Design and build enterprise Data, AI, and Business Intelligence platform capabilities.",
    skills: ["Data & AI Platforms", "Agentic AI", "Enterprise Analytics"],
  },
  {
    id: "uiuc-location",
    organization: "University of Illinois Urbana-Champaign",
    role: "Master of Business Administration (MBA)",
    location: "Urbana-Champaign, Illinois",
    period: "2022–2025",
    category: "education",
    lat: 40.102,
    lng: -88.2272,
    summary: "Master of Business Administration program.",
    skills: ["Business Administration"],
  },
  {
    id: "ut-austin-location",
    organization: "University of Texas at Austin",
    role: "M.S. Data Science",
    location: "Austin, Texas",
    period: "Expected Dec 2026",
    category: "education",
    lat: 30.2849,
    lng: -97.7341,
    summary: "Master of Science in Data Science program.",
    skills: ["Data Science"],
  },
];
