---
title: "Learning Databricks: where CDF fits in a CDC pipeline"
date: 2026-09-28
summary: A study note separating Delta change data feed from the broader change data capture process, with attention to ordering, target state, and recovery.
domain: Data Engineering
topics: [Databricks, Delta Lake, CDC]
kind: post
connections: [databricks-lakeflow-orchestration, databricks-governance-and-data-protection]
---

I saved a comparison of CDF and CDC because the similar names can hide a useful architectural distinction. I read it as a prompt to ask where a change is observed and what downstream state that change needs to produce.

![Databricks training comparison of Delta change data feed and the broader change data capture concept.](/images/databricks/cdf-vs-cdc.png)

*Databricks training screenshot. [View full size](/images/databricks/cdf-vs-cdc.png). The slide uses the older APPLY CHANGES API name.*

## A feed of changes is one part of the process

CDC is the broader practice of capturing and propagating changes. Delta change data feed exposes row-level changes to a table, with metadata such as change type, commit version, and commit timestamp. It can be consumed by downstream processing. It records changes after it is enabled, and its history is bounded by retention; it is not a permanent archive. See the [change data feed documentation](https://docs.databricks.com/aws/en/tables/features/change-data-feed).

My way of drawing the boundary is to distinguish the source system, the captured events, the Delta table that receives them, and the downstream tables that consume changes. A change feed answers a different question at each boundary. Enabling CDF on a destination table does not, by itself, capture an external database’s transaction log.

## Decide what a change means for the target

Imagine a customer record whose address changes twice. A current-state table should ultimately contain the latest address. A history table should retain the sequence of versions. Both can start from change events, but they have different output contracts.

Databricks now recommends `AUTO CDC` in place of `APPLY CHANGES`. Its pipeline APIs support SCD Type 1 and Type 2 processing and use a sequencing column to handle ordering. The [AUTO CDC documentation](https://docs.databricks.com/aws/en/ldp/cdc) explains the APIs and requirements.

The important design decision for me is what counts as “latest.” An arrival timestamp and a source sequence do not necessarily mean the same thing. I would want that choice written into the pipeline contract, especially when late events are possible.

## Design the restart path before it is needed

The retention detail changes how I think about reliability. If a consumer falls behind beyond the available change history, a checkpoint alone cannot supply the missing events.

For a hypothetical production pipeline, I would document the expected outage window, the retained history, and the recovery route. That might involve replaying a durable upstream event log or rebuilding from a fresh source snapshot, depending on what the system preserves. I would test duplicate delivery, deletes, out-of-order updates, and a restart after a long pause.

The screenshot is useful as an introduction. The question I want to keep asking is more concrete: which changes can this consumer still read, and can it reconstruct the target state correctly?
