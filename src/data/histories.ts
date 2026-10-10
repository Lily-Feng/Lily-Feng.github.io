// Links into Calm Data and AI; the timelines themselves stay in that repository.
const timelineUrl = "https://lily-feng.github.io/Calm.Data.and.AI/timeline.html";

export const briefHistories = [
  {
    id: "cs-papers",
    symbol: "▤",
    label: "Computing foundations",
    summary: "The papers that laid the foundations of computing, and the ideas that followed.",
  },
  {
    id: "languages",
    symbol: "{}",
    label: "Programming languages",
    summary: "How programming languages changed what we ask a machine to do.",
  },
  {
    id: "data-storage",
    symbol: "◫",
    label: "Data and storage",
    summary: "The recurring trade between structure and scale, through the history of data storage.",
  },
  {
    id: "data-platforms",
    symbol: "◈",
    label: "Data platforms",
    summary: "Hadoop, Hive, Spark, Databricks, and Snowflake: two roads that ended up in the same place.",
  },
  {
    id: "machine-learning",
    symbol: "◉",
    label: "Machine learning",
    summary: "How machines learned to predict, through breakthroughs and long winters.",
  },
  {
    id: "reinforcement-learning",
    symbol: "RL",
    label: "Reinforcement learning",
    summary: "Trial and error, optimal control, and temporal difference converge in reinforcement learning.",
  },
  {
    id: "infrastructure",
    symbol: "▥",
    label: "Systems and infrastructure",
    summary: "From mainframes to cloud APIs: how the places we run software changed.",
  },
].map((history) => ({ ...history, url: `${timelineUrl}?series=${history.id}` }));
