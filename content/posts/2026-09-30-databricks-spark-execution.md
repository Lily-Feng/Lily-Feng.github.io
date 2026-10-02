---
title: "Learning Databricks: follow the Spark plan before adding compute"
date: 2026-09-30
summary: Spark study notes connecting driver and executor responsibilities, query planning, adaptive execution, and the cost of unnecessary actions.
domain: Data Engineering
topics: [Databricks, Apache Spark, Performance]
kind: post
connections: [databricks-lakeflow-orchestration, databricks-cdf-and-cdc]
color: data
icon: data
cover: /images/databricks/spark-query-optimization.png
coverAlt: Spark query optimization diagram
---

Three screenshots from my Databricks learning form a useful sequence: where Spark runs work, how it plans a query, and which coding habits can undermine that plan. I want to connect them before treating a slow workload as a request for a larger cluster.

## Know what runs on the driver

![Spark architecture diagram showing a driver coordinating executors and tasks across worker nodes.](/images/databricks/spark-architecture.png)

*Databricks training screenshot. [View full size](/images/databricks/spark-architecture.png).*

The driver coordinates an application; executors run tasks and hold application data. The [Spark cluster overview](https://spark.apache.org/docs/latest/cluster-overview.html) explains these roles.

My first debugging question would be whether the expensive work is distributed at all. If code brings a large result back into a local Python process, more executor capacity may not address the bottleneck. That is a different problem from a distributed join whose tasks are unevenly sized.

## Read the plan, then compare it with execution

![Spark query optimization diagram showing analysis, logical optimization, physical planning, code generation, and runtime feedback through adaptive query execution.](/images/databricks/spark-query-optimization.png)

*Databricks training screenshot. [View full size](/images/databricks/spark-query-optimization.png). The “enabled by default as of Spark 3.2” statement refers to AQE.*

Adaptive Query Execution uses runtime statistics to adjust execution decisions, including shuffle partition handling and some join strategies. It has been enabled by default in Apache Spark since 3.2.0. The [Spark performance guide](https://spark.apache.org/docs/latest/sql-performance-tuning.html) describes these optimizations.

I read the diagram as a reminder that the written query, the planned work, and the observed work are three things to compare. My investigation would ask whether the query scans more data than intended, whether a join multiplies rows unexpectedly, and whether a small number of tasks dominate elapsed time. Those questions give a compute change a purpose.

## Make each action earn its cost

![Training recommendations to prefer DataFrames or SQL, avoid unnecessary actions, and avoid concentrating large computations on the driver.](/images/databricks/spark-code-optimization.png)

*Databricks training screenshot. [View full size](/images/databricks/spark-code-optimization.png).*

`collect()` returns all rows to the driver and should be used only when the result is small enough for driver memory. That constraint is explicit in the [PySpark API documentation](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.collect.html).

The slide’s warning about actions is useful, but I would apply it with context. A deliberate count for a quality check has a purpose. A leftover count added only to inspect a notebook cell may not. Likewise, local pandas can be appropriate for a small result; the concern is accidentally making it the execution path for a large dataset.

For a future optimization, I would keep the output contract fixed, record a baseline, change one thing, and compare both correctness and runtime. These screenshots give me a starting order for that investigation: execution location, query plan, task behavior, then capacity.
