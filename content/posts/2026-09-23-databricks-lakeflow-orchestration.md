---
title: "Learning Databricks: reading a Lakeflow workflow as a system"
date: 2026-09-23
summary: Lakeflow study notes on how triggers, task dependencies, compute, and observability turn a collection of scripts into an operating workflow.
domain: Data Engineering
topics: [Databricks, Lakeflow, Orchestration]
kind: post
connections: [databricks-cdf-and-cdc, databricks-spark-execution]
---

While learning Databricks, I saved three diagrams that belong together: the orchestration architecture, the job/task layers, and a retail processing example. Taken together, they offer a useful way to read a workflow before getting lost in individual notebooks.

## Four questions around the task graph

![Lakeflow orchestration diagram showing triggers, control flow, observability, and compute surrounding a workflow that serves ETL, ML/AI, and analytics.](/images/databricks/lakeflow-orchestration.png)

*Databricks training screenshot from my study collection. [View full size](/images/databricks/lakeflow-orchestration.png).*

My interpretation of this diagram starts with four questions: what starts the work, what must finish before the next step, where the work runs, and how I know it succeeded. These questions expose decisions that a notebook alone cannot communicate.

A schedule might be appropriate for a daily report. A file-arrival trigger might better match an incoming delivery. Either way, I would want to know what happens when input arrives twice, arrives late, or does not arrive at all.

Lakeflow Jobs coordinates tasks and their dependencies. A job can combine different task types rather than requiring every step to be a notebook. The current [Lakeflow Jobs documentation](https://docs.databricks.com/aws/en/jobs/) describes the orchestration model.

## Separate the job from its tasks

![Training overview of Lakeflow task types, sequential and parallel dependencies, conditionals, nested jobs, loops, triggers, and compute.](/images/databricks/lakeflow-job-task-layers.png)

*Databricks training screenshot. [View full size](/images/databricks/lakeflow-job-task-layers.png). The slide uses the older DLT label for pipeline tasks.*

I read the job as the operating contract and each task as a unit of work. A task boundary is useful when it gives me a meaningful place to inspect an output, retry a failure, or assign responsibility. Splitting every small function into a task would make the graph harder to read without necessarily improving recovery.

The distinction also matters when discussing performance: parallel boxes in a job graph describe workflow concurrency. They do not describe how Spark distributes the work inside each box.

## Follow the retail example through to the dashboard

![Retail workflow with orders, customers, and sales ingestion; joins; a for-each task; duplicate handling through an if/else block; transformations; and a dashboard.](/images/databricks/retail-pipeline.png)

*Databricks training example, rather than a production system I built. [View full size](/images/databricks/retail-pipeline.png).*

The interesting part is the convergence. Independent inputs become joined datasets, branch-specific processing happens, and the dashboard depends on those results. That makes freshness a property of the whole path, not just the final dashboard task.

For a similar design, I would ask whether each join has a clear input contract, whether duplicate handling is deterministic, and whether rerunning a branch changes the result. I would also check the downstream run conditions explicitly: the arrows alone do not tell me what happens after a failure or a skipped branch.

What I want to carry into future work is this habit: read the workflow as a set of dependencies and recovery boundaries before reading it as a set of scripts.
