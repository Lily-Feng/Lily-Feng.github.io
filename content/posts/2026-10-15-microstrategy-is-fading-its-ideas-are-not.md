---
title: "MicroStrategy is fading. Its ideas are everywhere."
date: 2026-10-15
summary: The product that defined business intelligence is losing its place, but almost every piece of its core design is being rebuilt across the modern data and AI stack.
domain: Data Engineering
topics: [Business Intelligence, Semantic Layer, AI, Data Platforms]
kind: post
color: data
icon: data
cover: /images/data/microstrategy-layered-architecture.png
coverAlt: MicroStrategy mapped across seven architecture layers
---

Ask a room of data people about MicroStrategy and you will get a smile and a story about a giant, expensive system from the 2000s. Ask what it actually did and the room gets quieter. I spent years inside this kind of system, and I think the quiet is the interesting part.

The product is losing ground. The idea inside it is not. Look at today's data tools and AI assistants and you find the same design, taken apart and rebuilt in pieces. This post is a tour of that design, written for people who have never opened a BI tool.

## The problem it solved

Imagine ten people in a company each asking, "What was revenue last quarter?" Each person opens a different tool, writes a slightly different query, and gets a slightly different number. The meeting that follows is about whose number is right, not about the business.

MicroStrategy's central idea was to stop this at the root. Someone defines "revenue" once, in one place: what it sums, which customers it excludes, how it handles refunds. After that, nobody writes the calculation again. Everyone asks for "revenue" by name, and the system works out the database instructions needed to answer.

That is the whole trick. A shared dictionary of business terms, and a translator that turns a question in those terms into correct database code.

## One big machine, many jobs

MicroStrategy did this inside one large server, and that server did a lot. It kept track of what data existed. It held the dictionary of business terms. It wrote the database code. It stored pre-computed answers so popular questions came back fast. It could pull from several databases at once. It decided who was allowed to see which rows. And it drew the dashboards.

![MicroStrategy mapped across seven layers, from infrastructure and hardware up to consumption and experience. One server and one metadata repository sit inside the box, spanning security, the SQL and analytical engines, metrics and hierarchies, data mining, alerts and subscriptions. Dashed items mark the customer stack underneath it; faded items have no counterpart.](/images/data/microstrategy-layered-architecture.png)

Now look at the modern data stack. Each of those jobs has its own tool, usually open source:

| What the old server did | Who does it now |
| --- | --- |
| Remember what data exists | A catalog, such as Unity Catalog or Apache Polaris |
| Hold the dictionary of business terms | A semantic layer, such as dbt MetricFlow, Cube, or Databricks metric views |
| Turn a question into database code | The semantic layer's compiler, the same job under a new name |
| Keep ready-made answers for speed | Pre-aggregations and fast stores, such as Cube Store, Pinot, or StarRocks |
| Query several databases at once | A federation engine, such as Trino |
| Control who sees which rows | Policies in the warehouse itself |
| Draw the dashboards | Lightdash, Superset, Metabase, Looker, and others |
| Answer questions in plain English | AI assistants such as Genie and Cortex Analyst, or any agent speaking MCP |

Read the table down the left column and it is a spec sheet for one product. Read it down the right column and it is the modern data stack, nearly line for line.

## Why the big machine lost

The monolith was not wrong about the work. It was wrong about the packaging.

- **Storage became open.** Data now sits in open formats like Iceberg and Delta that many engines can read. The old server assumed it was the only thing standing between users and the warehouse.
- **Warehouses got powerful.** Much of the number crunching that once needed a middle tier now runs inside Snowflake or Databricks.
- **Definitions moved into code.** Business logic now lives in files under version control, reviewed like any other code, rather than inside a vendor's database that only the vendor's tools could open.
- **Teams wanted to pick their own parts.** One vendor owning the dictionary, the engine, and the dashboards felt like a lock-in, and the market reacted.

So the industry unbundled it. For a while that meant a dozen tools to stitch together. Now the pendulum is swinging back: Snowflake and Databricks are folding the dictionary of business terms into the warehouse itself, held together by shared standards. Even Strategy, the company behind MicroStrategy, has split its own semantic layer out as a standalone service called Mosaic.

## Why AI makes this matter more, not less

Here is the part that I find most interesting. Suppose you let an AI assistant answer "What was revenue last quarter?" with no dictionary behind it. It will do what ten confused analysts did: guess. It will pick a table, invent a definition, and return a confident number that may be wrong.

The fix is the same one MicroStrategy used twenty years ago. Give the assistant a governed dictionary of business terms and make it ask by name. It stops guessing at database code and starts choosing from definitions a human approved. The semantic layer is how an AI answer becomes something you can trust.

That is why a layer that looked like old plumbing is suddenly the hot topic. The most important new consumer of the semantic layer is not a person with a dashboard. It is an AI agent.

## What the new stack still can't do

I would be overselling if I said the modern stack has caught up. It has not, and the gaps are specific.

- **Calculations at a chosen level of detail.** "Each customer's sales as a share of their region's total" is natural in MicroStrategy and awkward almost everywhere else.
- **Real hierarchies.** Year, quarter, month, or country, state, city, with drilling that just works. Most newer tools model a web of joins instead.
- **Impact analysis at scale.** Telling you which of 40,000 reports break if you change one definition.
- **Facts at the wrong grain.** Quietly handling data recorded at one level when you ask at another.

The open-source tools are rebuilding these one at a time. Anyone who has built the old engine knows precisely where the new ones will get stuck, and that is knowledge the field currently needs.

## The takeaway

When a product fades, it is tempting to conclude that its ideas were wrong. Here the opposite happened. The ideas were so right that every part of them was rebuilt, usually better, in a place where it could be shared.

I have put the full mapping, layer by layer, into the [Calm Data and AI](https://github.com/Lily-Feng/Calm.Data.and.AI) repository, as a lens on the modern stack. If you work with data or AI, it is worth knowing which old idea you are standing on.
