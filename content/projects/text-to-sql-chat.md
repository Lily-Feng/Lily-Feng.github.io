---
title: Text-to-SQL Chat Application
date: 2026-06-18
summary: A project concept for translating natural-language questions into governed, reviewable SQL and useful answers.
domain: Applied Machine Learning
topics:
  - Generative AI
  - Data Products
  - Evaluation
connections:
  - rag-in-production
  - decision-quality
kind: project
featured: true
---

The goal of this project is to make analytical data more approachable without hiding the query that produced an answer.

## Proposed flow

1. A user asks a data question in natural language.
2. An orchestration layer identifies the relevant data product and delegates query generation.
3. A specialized Text-to-SQL component generates a constrained query from governed schema context.
4. The system validates the query before execution and returns the answer with the generated SQL and sources.

## Design principles

- Keep generated SQL visible so users can inspect how an answer was produced.
- Restrict access at the data layer instead of relying on prompt instructions.
- Evaluate with representative questions, ambiguous requests, and adversarial cases.
- Separate “I could not answer” from an empty or zero-valued result.

The useful product is not a chatbot that writes SQL. It is a trustworthy path from a business question to a reproducible answer.
