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
    id: "senior-staff-data-ai",
    organization: "Visa",
    role: "Senior Staff Software Engineer — Data & AI Platforms",
    location: "Foster City, California",
    period: "2018–Present",
    category: "work",
    summary: "Design and build enterprise Data, AI, and Business Intelligence platform capabilities.",
    highlights: [
      "Built open-source solutions for an internal BI platform, including semantic-layer capabilities supporting enterprise analytics.",
      "Led architecture and engineering work across Power BI and Microsoft Azure, including system architecture, security engineering, telemetry, and observability.",
      "Contributed to adoption and integration of Databricks for Visa’s Data & AI platform.",
      "Designed and developed agentic workforce solutions to automate and augment BI infrastructure management and operational tasks.",
      "Evaluated and incorporated open-source technologies into enterprise Data & AI infrastructure.",
      "Joined a five-person AI micro-pod and built the “Visa Destination” Portfolio Intelligence product during a six-month product-development initiative.",
      "Earlier in the role, built BI infrastructure supporting multiple Data and AI products and researched open-source technologies for new infrastructure solutions.",
    ],
    skills: ["Agentic AI", "Databricks", "Power BI", "Microsoft Azure", "Semantic Layers", "Security & Observability"],
  },
  {
    id: "principal-consultant",
    organization: "MicroStrategy Professional Services",
    role: "Principal Consultant / Performance Engineering",
    location: "Los Angeles, California",
    period: "2012–2018",
    category: "work",
    summary: "Partnered with major enterprise customers on large-scale BI architecture and performance engineering.",
    highlights: [
      "Researched high-performance topics including 2 TB RAM utilization, cloud development/deployment, capacity planning, and peak workload management.",
      "Worked with customers including eBay, Facebook, Home Depot, Sears, Disney, Wells Fargo, Hulu, and Yahoo.",
      "Collaborated with Sales Engineering, regional service leadership, and technology teams on product planning and enterprise BI implementation.",
      "Advised customers on system architecture, performance, scalability, and capacity planning.",
    ],
    skills: ["Enterprise BI", "Performance Engineering", "Scalability", "Capacity Planning", "Customer Collaboration"],
  },
  {
    id: "performance-engineering",
    organization: "MicroStrategy",
    role: "Performance Engineering",
    location: "McLean, Virginia",
    period: "2007–2012",
    category: "work",
    summary: "Developed software performance tuning, benchmarks, code-coverage solutions, and practical-limit testing for enterprise BI software.",
    highlights: [],
    skills: ["Software Performance", "Benchmarking", "Code Coverage", "Capacity Planning"],
  },
  {
    id: "lead-software-engineer-test-china",
    organization: "MicroStrategy China Technology Center",
    role: "Lead Software Engineer in Test",
    location: "Hangzhou, China",
    period: "2007–2012",
    category: "work",
    summary: "Led a 20+ person Performance team in China.",
    highlights: [
      "Produced product benchmark press release and customer capacity-planning approaches.",
    ],
    skills: ["Performance Engineering", "Team Leadership", "Benchmarking", "Capacity Planning"],
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
