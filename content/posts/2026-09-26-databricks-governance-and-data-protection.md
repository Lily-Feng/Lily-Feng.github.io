---
title: "Learning Databricks: access control and data protection answer different questions"
date: 2026-09-26
summary: Unity Catalog and data-protection study notes on who can access an object, what they can do, and what sensitive values they should see.
domain: Data Governance
topics: [Databricks, Unity Catalog, Data Protection]
kind: post
connections: [databricks-cdf-and-cdc]
---

Two screenshots from my Databricks learning belong next to each other. One organizes access control into principals, objects, and privileges. The other compares ways to transform sensitive values. They describe different decisions that meet in the same data product.

## Start with the access relationship

![Unity Catalog training diagram grouping privileges, securable objects, and principals such as users, service principals, and groups.](/images/databricks/unity-catalog-security-model.png)

*Databricks training screenshot. [View full size](/images/databricks/unity-catalog-security-model.png).*

Unity Catalog privileges attach to securable objects and are granted to principals. For reading a table, `SELECT` works alongside the required `USE CATALOG` and `USE SCHEMA` privileges on its parents. Access to the containing namespace does not by itself grant access to the table’s data. The [privileges reference](https://docs.databricks.com/aws/en/data-governance/unity-catalog/access-control/privileges-reference) explains these requirements.

My practical reading is to make the access request concrete: which identity needs which operation on which object? “Give the pipeline access” is incomplete until I know the identity it runs as and the outputs it writes.

For a hypothetical retail dataset, an analyst reading an aggregate sales table and an ingestion service updating customer records have different needs. I would model those separately, then test the identities that actually perform the work.

## Decide what the authorized reader should see

![Training comparison of masking, pseudonymization, hashing, column encryption, and tokenization, including utility and protection tradeoffs.](/images/databricks/data-protection-techniques.png)

*Databricks training comparison, preserved as a study reference. [View full size](/images/databricks/data-protection-techniques.png). Its protection ratings are qualitative teaching shorthand, not guarantees.*

Permission to query a table is only one part of the design. An authorized analyst might need customer counts without needing raw contact details. Databricks supports row filters and column masks that apply policies during queries; the [filters and masks documentation](https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks/) describes their behavior and constraints.

The comparison slide prompts a second set of questions: must a value remain recognizable, must records remain joinable, and must the original be recoverable? I would choose a technique from those requirements rather than from a single “low” or “high” rating.

I also would not treat the slide’s description of hashing as proof that a hashed identifier is anonymous. A deterministic transformation can still preserve linkability. The surrounding data and the way the transformation is implemented matter to the design.

## Review access and exposure together

My review would follow one representative identity through a realistic query. Can it reach the intended object? Can it perform only the intended operations? What values appear in its result, and can those results reveal more when combined with another dataset?

These screenshots helped me separate the questions without separating the responsibility. A useful governance design needs both an access model and a clear decision about what data each consumer should receive.
